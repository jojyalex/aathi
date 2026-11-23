#!/usr/bin/env python3
"""ആതി app server: serves the web app and saves progress in SQLite.

Run:   python3 server.py            -> http://localhost:8765  (this computer only)
       python3 server.py --lan      -> also reachable from phones/tablets on the same Wi-Fi,
                                       as http://aathi.local:8765 (macOS Bonjour; --name other to change, --name none to skip)
       python3 server.py --port 9000
       python3 server.py --db /path/test.db   (use a different database, e.g. for testing)

Data:  data/aathi.db  (progress + automatic snapshots). Only the Python standard library is used.
"""
import json, os, sqlite3, sys, threading, time
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

ROOT = os.path.dirname(os.path.abspath(__file__))
DB = os.path.join(ROOT, 'data', 'aathi.db')
SNAP_EVERY = 10 * 60      # keep a snapshot at most every 10 minutes
SNAP_KEEP = 200           # and keep the newest 200
MAX_BODY = 5 * 1024 * 1024
BLOCKED = ('/data', '/tools', '/server.py', '/.')
lock = threading.Lock()


def db():
    c = sqlite3.connect(DB)
    c.row_factory = sqlite3.Row
    return c


def init():
    os.makedirs(os.path.dirname(DB), exist_ok=True)
    with db() as c:
        c.executescript('''
          PRAGMA journal_mode=WAL;
          CREATE TABLE IF NOT EXISTS profile(id TEXT PRIMARY KEY, state TEXT NOT NULL, rev INTEGER NOT NULL DEFAULT 0, updated_at REAL NOT NULL);
          CREATE TABLE IF NOT EXISTS snapshot(id INTEGER PRIMARY KEY AUTOINCREMENT, profile TEXT NOT NULL, state TEXT NOT NULL, saved_at REAL NOT NULL);
          CREATE TABLE IF NOT EXISTS event(id INTEGER PRIMARY KEY AUTOINCREMENT, profile TEXT NOT NULL, ts REAL NOT NULL, kind TEXT NOT NULL, data TEXT);
        ''')


def save_state(pid, state_txt):
    now = time.time()
    with lock, db() as c:
        row = c.execute('SELECT rev FROM profile WHERE id=?', (pid,)).fetchone()
        rev = (row['rev'] if row else 0) + 1
        c.execute('INSERT INTO profile(id,state,rev,updated_at) VALUES(?,?,?,?) '
                  'ON CONFLICT(id) DO UPDATE SET state=excluded.state, rev=excluded.rev, updated_at=excluded.updated_at',
                  (pid, state_txt, rev, now))
        last = c.execute('SELECT MAX(saved_at) m FROM snapshot WHERE profile=?', (pid,)).fetchone()['m']
        if not last or now - last > SNAP_EVERY:
            c.execute('INSERT INTO snapshot(profile,state,saved_at) VALUES(?,?,?)', (pid, state_txt, now))
            c.execute('DELETE FROM snapshot WHERE profile=? AND id NOT IN '
                      '(SELECT id FROM snapshot WHERE profile=? ORDER BY id DESC LIMIT ?)', (pid, pid, SNAP_KEEP))
    return rev, now


class H(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def log_message(self, fmt, *args):
        if '/api/' in (self.path or ''):
            return  # keep the console quiet for autosaves
        super().log_message(fmt, *args)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def _json(self, code, obj):
        b = json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def _pid(self, q):
        pid = (q.get('profile') or ['default'])[0]
        return pid if pid.replace('-', '').replace('_', '').isalnum() and len(pid) <= 40 else 'default'

    def _body(self):
        n = int(self.headers.get('Content-Length') or 0)
        if n <= 0 or n > MAX_BODY:
            return None
        return self.rfile.read(n).decode('utf-8')

    def do_GET(self):
        u = urlparse(self.path)
        if any(u.path.startswith(b) for b in BLOCKED):
            return self.send_error(404)
        if u.path == '/api/health':
            return self._json(200, {'ok': True})
        if u.path == '/api/state':
            pid = self._pid(parse_qs(u.query))
            with db() as c:
                r = c.execute('SELECT state,rev,updated_at FROM profile WHERE id=?', (pid,)).fetchone()
            return self._json(200, {'state': json.loads(r['state']) if r else None,
                                    'rev': r['rev'] if r else 0, 'updated_at': r['updated_at'] if r else None})
        if u.path == '/api/snapshots':
            pid = self._pid(parse_qs(u.query))
            with db() as c:
                rows = c.execute('SELECT id,saved_at FROM snapshot WHERE profile=? ORDER BY id DESC LIMIT 50', (pid,)).fetchall()
            return self._json(200, [dict(r) for r in rows])
        if u.path.startswith('/api/'):
            return self.send_error(404)
        return super().do_GET()

    def do_PUT(self):
        u = urlparse(self.path)
        if u.path != '/api/state':
            return self.send_error(404)
        txt = self._body()
        try:
            st = json.loads(txt or '')
            assert isinstance(st, dict)
        except Exception:
            return self._json(400, {'error': 'bad state'})
        rev, now = save_state(self._pid(parse_qs(u.query)), json.dumps(st, ensure_ascii=False))
        return self._json(200, {'ok': True, 'rev': rev, 'updated_at': now})

    def do_POST(self):
        u = urlparse(self.path)
        if u.path == '/api/state':        # navigator.sendBeacon on page close
            return self.do_PUT()
        if u.path == '/api/event':
            try:
                ev = json.loads(self._body() or '')
                with lock, db() as c:
                    c.execute('INSERT INTO event(profile,ts,kind,data) VALUES(?,?,?,?)',
                              (self._pid(parse_qs(u.query)), time.time(), str(ev.get('kind', ''))[:40],
                               json.dumps(ev.get('data'), ensure_ascii=False)))
                return self._json(200, {'ok': True})
            except Exception:
                return self._json(400, {'error': 'bad event'})
        if u.path == '/api/restore':      # body: {"snapshot": id}
            try:
                sid = int(json.loads(self._body() or '')['snapshot'])
                pid = self._pid(parse_qs(u.query))
                with db() as c:
                    r = c.execute('SELECT state FROM snapshot WHERE id=? AND profile=?', (sid, pid)).fetchone()
                if not r:
                    return self._json(404, {'error': 'no such snapshot'})
                save_state(pid, r['state'])
                return self._json(200, {'ok': True, 'state': json.loads(r['state'])})
            except Exception:
                return self._json(400, {'error': 'bad request'})
        return self.send_error(404)


def main():
    port = int(sys.argv[sys.argv.index('--port') + 1]) if '--port' in sys.argv else 8765
    host = '0.0.0.0' if '--lan' in sys.argv else '127.0.0.1'
    global DB
    if '--db' in sys.argv:
        DB = os.path.abspath(sys.argv[sys.argv.index('--db') + 1])
    init()
    srv = ThreadingHTTPServer((host, port), H)
    print(f'ആതി is running:  http://localhost:{port}   (data: {DB})')
    mdns = None
    if host == '0.0.0.0':
        import socket, shutil, subprocess
        ip = None
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM); s.connect(('10.255.255.255', 1)); ip = s.getsockname()[0]; s.close()
            print(f'On a phone/tablet on the same Wi-Fi open:  http://{ip}:{port}')
        except Exception:
            pass
        # Announce a friendly name (default aathi.local) with macOS Bonjour, so phones can use http://aathi.local:PORT
        name = sys.argv[sys.argv.index('--name') + 1] if '--name' in sys.argv else 'aathi'
        if ip and name != 'none' and shutil.which('dns-sd'):
            mdns = subprocess.Popen(['dns-sd', '-P', 'ആതി Malayalam', '_http._tcp', 'local', str(port), f'{name}.local', ip],
                                    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print(f'                      or simply:  http://{name}.local:{port}')
    print('Press Ctrl+C to stop.')
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print('\nStopped.')
    finally:
        if mdns:
            mdns.terminate()


if __name__ == '__main__':
    main()

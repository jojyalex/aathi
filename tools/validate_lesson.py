#!/usr/bin/env python3
"""Check a lesson.json against tools/LESSON_SPEC.md. Usage: python3 tools/validate_lesson.py lessons/<id>/lesson.json"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ITEMS = {'e', 'p', 'text', 'house', 'hut', 'school', 'building', 'tree', 'palm', 'mangrove', 'bush', 'flowertree', 'flower', 'sun', 'moon',
         'cloud', 'stars', 'rain', 'birds', 'butterflies', 'fish', 'boat', 'plane', 'stove', 'pot', 'fire', 'torch', 'table', 'book',
         'blackboard', 'marbles', 'car', 'fence', 'wall', 'glow'}
ROLES = {'man', 'woman', 'boy', 'girl', 'oldman', 'oldwoman', 'gandhi', 'teacher', 'cook', 'pilot', 'farmer'}
POSES = {'stand', 'run', 'wave', 'point', 'sit', 'sad'}
ANIMS = {'bob', 'sway', 'spin', 'hop', 'fly', 'swim', 'drive', 'walk', 'pulse', 'beat', 'grow', 'rise', 'fall', 'shake', 'float', 'flutter',
         'wiggle', 'slidein', 'slideout', 'pop', 'flicker', 'zoom'}
BGS = {'day', 'dusk', 'night', 'dawn', 'grey', 'indoor', 'kitchen', 'classroom', 'sky'}
GROUNDS = {'grass', 'field', 'water', 'river', 'road', 'floor', 'soil', 'dry', 'beach', 'city', 'none'}
STEPS = {'info', 'story', 'cards', 'match', 'memory', 'warmup', 'quiz', 'builder', 'write', 'retell', 'final'}
VOICES = {'ml-IN-SobhanaNeural', 'ml-IN-MidhunNeural'}
MAL = re.compile('[ഀ-ൿ]')


def check(path):
    err = []
    E = err.append
    try:
        L = json.load(open(path, encoding='utf-8'))
    except Exception as e:
        return [f'not valid JSON: {e}']
    for k in ('id', 'unit', 'order', 'title', 'titleEn', 'kind', 'level', 'icon', 'summaryEn', 'speakers', 'scenes', 'words', 'quiz', 'build', 'retell', 'write', 'plan'):
        if k not in L: E(f'missing top-level "{k}"')
    if err: return err
    if os.path.basename(os.path.dirname(os.path.abspath(path))) != L['id']: E('id must equal folder name')
    sp = L['speakers']
    if 'N' not in sp: E('speakers needs "N"')
    for c, s in sp.items():
        for k in ('name', 'ml', 'emoji', 'voice', 'rate', 'pitch'):
            if k not in s: E(f'speaker {c} missing {k}')
        if s.get('voice') not in VOICES: E(f'speaker {c} bad voice')
        if not re.fullmatch(r'[+-]\d+%', s.get('rate', '')): E(f'speaker {c} rate like "-12%"')
        if not re.fullmatch(r'[+-]\d+Hz', s.get('pitch', '')): E(f'speaker {c} pitch like "+0Hz"')

    def item_ok(it, where):
        if not isinstance(it, list) or not it: return E(f'{where}: item must be a non-empty array')
        opts = it[-1] if isinstance(it[-1], dict) else None
        if opts and opts.get('anim') and opts['anim'] not in ANIMS: E(f'{where}: unknown anim {opts["anim"]}')
        if it[0] not in ITEMS: return E(f'{where}: unknown item {it[0]}')
        if it[0] == 'p':
            if len(it) < 4 or it[1] not in ROLES: E(f'{where}: person needs known role, x, y')
            if len(it) > 5 and isinstance(it[5], str) and it[5] not in POSES: E(f'{where}: unknown pose {it[5]}')
        if it[0] == 'e' and (len(it) < 4 or not isinstance(it[1], str)): E(f'{where}: emoji item ["e", "🍚", x, y, size]')

    fxnames = set()
    nsent = 0
    if not (3 <= len(L['scenes']) <= 16): E('scenes: 4–14 expected')
    if len({sc.get('id') for sc in L['scenes']}) != len(L['scenes']): E('scene ids must be unique')
    for i, sc in enumerate(L['scenes']):
        w = f'scene {i}'
        for k in ('id', 'title', 'ml', 'art', 'sents'):
            if k not in sc: E(f'{w} missing {k}')
        if 'book' in sc and not os.path.exists(os.path.join(ROOT, sc['book'])): E(f'{w}: book image not found {sc["book"]}')
        a = sc.get('art', {})
        if a.get('bg') not in BGS: E(f'{w}: bad bg {a.get("bg")}')
        if a.get('ground') not in GROUNDS: E(f'{w}: bad ground {a.get("ground")}')
        for j, it in enumerate(a.get('items', [])): item_ok(it, f'{w} item {j}')
        fx = a.get('fx', {})
        for n, its in fx.items():
            for j, it in enumerate(its): item_ok(it, f'{w} fx {n} item {j}')
        for j, s in enumerate(sc.get('sents', [])):
            nsent += 1
            if not (isinstance(s, list) and 3 <= len(s) <= 4): E(f'{w} sent {j}: [speaker, ml, en, fx?]'); continue
            if s[0] not in sp: E(f'{w} sent {j}: unknown speaker {s[0]}')
            if not MAL.search(s[1]): E(f'{w} sent {j}: no Malayalam text')
            if MAL.search(s[2]): E(f'{w} sent {j}: English contains Malayalam')
            if len(s[1].split()) > 32: E(f'{w} sent {j}: too long ({len(s[1].split())} words), split it')
            if len(s) == 4 and s[3] and s[3] not in fx: E(f'{w} sent {j}: fx "{s[3]}" not defined in art.fx')
    if nsent < 8: E('very few sentences - the whole lesson text should be included')
    ids = set()
    if not (6 <= len(L['words']) <= 18): E('words: 8–16 expected')
    for w in L['words']:
        for k in ('id', 'ml', 'rom', 'en', 'emoji', 'set'):
            if k not in w: E(f'word {w.get("id")} missing {k}')
        if w.get('id') in ids: E(f'duplicate word id {w.get("id")}')
        ids.add(w.get('id'))
    sets = {w.get('set') for w in L['words']}
    if not (5 <= len(L['quiz']) <= 14): E('quiz: 6–12 expected')
    for i, q in enumerate(L['quiz']):
        for k in ('q', 'qe', 'o', 'oe', 'a', 'sec'):
            if k not in q: E(f'quiz {i} missing {k}')
        if len(q.get('o', [])) != 4 or len(q.get('oe', [])) != 4: E(f'quiz {i}: need 4 options in o and oe')
        if not (0 <= q.get('a', -1) < 4): E(f'quiz {i}: a must be 0-3')
    for i, b in enumerate(L['build']):
        if not (2 <= len(b.get('ch', [])) <= 8) or 'en' not in b or 'rom' not in b: E(f'build {i}: ch(2-8), en, rom')
    if not (3 <= len(L['retell']) <= 8): E('retell: 4–6 points')
    for k in ('title', 'prompt', 'en', 'starters', 'min'):
        if k not in L['write']: E(f'write missing {k}')
    if not (2 <= len(L['plan']) <= 8): E('plan: 3–7 days')
    has_final = False
    for d, day in enumerate(L['plan']):
        for k in ('title', 'ml', 'steps'):
            if k not in day: E(f'day {d + 1} missing {k}')
        for st in day.get('steps', []):
            if st.get('t') not in STEPS: E(f'day {d + 1}: unknown step {st.get("t")}')
            if st.get('t') in ('cards', 'match', 'memory') and st.get('set') not in sets: E(f'day {d + 1}: set {st.get("set")} has no words')
            if st.get('t') == 'quiz' and not any(q.get('sec') == st.get('sec') for q in L['quiz']): E(f'day {d + 1}: quiz sec {st.get("sec")} has no questions')
            if st.get('t') == 'story' and 'scenes' in st:
                a, b = st['scenes']
                if not (0 <= a <= b < len(L['scenes'])): E(f'day {d + 1}: story scenes out of range')
            if st.get('t') == 'final': has_final = True
    if not has_final: E('last day should include a "final" step')
    return err


if __name__ == '__main__':
    bad = 0
    for p in sys.argv[1:]:
        e = check(p)
        if e:
            bad += 1
            print(f'✗ {p}'); [print('   -', x) for x in e[:40]]
        else:
            L = json.load(open(p, encoding='utf-8'))
            print(f'✓ {p}: {sum(len(s["sents"]) for s in L["scenes"])} sentences, {len(L["scenes"])} scenes, {len(L["plan"])} days')
    sys.exit(1 if bad else 0)

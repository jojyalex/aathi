# ആതി — Malayalam adventure (Kerala Padavali Class 6)

A self-running game-based plan for the chapter **ഒരു സ്വപ്നമുണ്ടായിരുന്നു...** (textbook pages 48–54).

## How to open (saves progress in SQLite)
1. Open Terminal in this folder and run:
   `python3 server.py`
2. Open **http://localhost:8765** in Chrome, Safari or Edge.

Progress is saved on this computer in `data/aathi.db` (SQLite), so refreshing the page, clearing the browser or switching browsers does not lose anything. The server also keeps automatic snapshots every 10 minutes. The green dot next to the logo means "saved"; red means the server is not running.

- Tablet on the same Wi-Fi: run `python3 server.py --lan` and open the address it prints.
- Opening `index.html` directly still works, but then progress lives only in that browser.
- Moving old progress across: in the old version open Parent → *Download backup*, then in the new one Parent → *Restore*.

## Deploy with Coolify
1. Add this repository as an application in Coolify and select the **Dockerfile** build pack (Dockerfile path: `Dockerfile`).
2. Set the exposed port to **8000** and attach your domain.
3. Add persistent storage mounted at **`/data`** so saved progress survives redeploys.

The container serves the app on `0.0.0.0:8000`; its SQLite database is stored at `/data/aathi.db`.

## Lessons
All 16 lessons of the book (5 units) are in the **📚 Lessons** tab. Each lesson has its own path of days (3–7 days, by difficulty; the Aathi story keeps its 15-day plan), its own read-along story with animated scenes, word games, questions, sentence builder, writing and a final challenge. Progress is saved separately per lesson. Pick any lesson at any time.

Lesson content lives in `lessons/<id>/lesson.json` (format: `tools/LESSON_SPEC.md`). After editing one:
`python3 tools/validate_lesson.py lessons/<id>/lesson.json` then `../.venv/bin/python tools/build_lesson.py <id>` (makes the audio, `data.js` and the lesson list `lessons/index.js`).

## Story time (read-along)
The **Story** tab plays the whole chapter (116 lines, about 8 minutes) with Malayalam audio. Each word lights up as it is spoken, with "sounds like" letters and English underneath, and an animated picture for every scene. Tap any word or line to start from there. The audio is in `audio/story/` and the timings are in `story-data.js`.

To change the story text or translations, edit `tools/story_source.json` and rebuild the audio:
`pip install edge-tts` then `python3 tools/build_story.py` (needs internet; only changed lines are re-made).

## Moving through lessons
The next day opens as soon as the previous one is done (no waiting for dates). Tap a locked day and choose **Jump here** to skip ahead. Any finished step can be played again (↻ Again) for +10 XP; replays never overwrite the saved quiz and retell scores.

## What runs automatically
- Opens on the next mission (15–20 min).
- Game mode (pages 48–49, days 2–4) vs classic mode (pages 50–52, days 5–7), then a **checkpoint quiz on day 8** — this is the fair comparison of the two methods.
- Word reviews are scheduled automatically (spaced repetition), XP/levels/streaks, a final quiz on day 15 and an optional one-week-later quiz (Day 22).
- The parent report (Parent tab) compares all quizzes and can be copied as text.

## Parent's only jobs
1. Day 8 and 15: sit in for the retell and tick what was covered (PIN-protected if you set a PIN).
2. Rate the two writing pieces (days 13–14) in the Parent tab.
3. Roblox days (10–11): be around, and start the Roblox world.

## Backup
Parent tab → *Download backup*. Restore with *Restore*.

## Files
`server.py` (web server + SQLite), `index.html`, `style.css`, `app.js` (engine), `content.js` (words, questions, plan), `story.js` / `story.css` (read-along player), `story-art.js` (animated scenes), `story-data.js` (generated story text + word timings), `audio/story/` (generated audio), `tools/` (story source and audio builder), `img/` (two textbook illustrations), `data/` (the SQLite database, created on first run).

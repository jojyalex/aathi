# Lesson file format (`lessons/<id>/lesson.json`)

One JSON file per textbook lesson. `python3 tools/build_lesson.py <id>` turns it into
`lessons/<id>/data.js` + Malayalam audio with word timings. Check a file with
`python3 tools/validate_lesson.py lessons/<id>/lesson.json`.

The learner: **Isaiah, 11, Malayalam reading at about Grade 2 level, fluent English, loves games (Roblox).**
The textbook is Kerala Padavali Class 6, far above his level. So: English everywhere, short sentences,
simple words, fun tone, small steps. The app adds "sounds like" English letters automatically.

## Top level

```json
{
  "id": "u1-l1-adukkala",                 // must match the folder name
  "unit": 1, "unitMl": "അമൃതം നുകരാം", "unitEn": "Taste the nectar (food)",
  "order": 1,                             // position inside the unit
  "title": "അടുക്കള", "titleEn": "The Kitchen",
  "pages": "9–11", "kind": "poem",        // poem | story | essay | memoir | letter | play | biography | article
  "author": "Name (English letters)",
  "level": "easy",                        // easy | medium | hard  (drives how many days)
  "icon": "🍲",                           // one emoji for the lesson
  "summaryEn": "<p>2–4 short paragraphs of simple English telling what the lesson is about and the big idea.</p>",
  "speakers": { ... },
  "scenes":   [ ... ],
  "words":    [ ... ],
  "quiz":     [ ... ],
  "build":    [ ... ],
  "retell":   [ ... ],
  "write":    { ... },
  "plan":     [ ... ]
}
```

## speakers
Code → voice. Always include `N` (storyteller/poem reader). Add one per talking character.
Voices: `ml-IN-SobhanaNeural` (female) or `ml-IN-MidhunNeural` (male). Vary `pitch` (e.g. "+20Hz" child,
"-12Hz" old person) and `rate` (e.g. "-12%" calm, "-25%" very old/slow). Poems: rate about "-15%".
```json
"N": {"name": "Storyteller", "ml": "കഥ പറയുന്നയാൾ", "emoji": "📖", "voice": "ml-IN-SobhanaNeural", "rate": "-12%", "pitch": "+0Hz"}
```

## scenes
The **whole lesson text** (prose or poem body; skip the activity questions/exercises after it), split into
4–14 scenes in reading order. Each scene has its own picture.
```json
{"id": "fire", "title": "English scene title", "ml": "Malayalam scene title",
 "book": "img/book/p009_1.jpg",            // optional: textbook picture that fits this scene
 "art": { ...ART SPEC... },
 "sents": [ ["N", "Malayalam sentence exactly as in the book.", "Simple English meaning.", "fxName?"] ]}
```
Rules for `sents`:
- Copy the Malayalam **exactly** from `markdown/*.md` (fix only obvious OCR breaks). Keep quote marks as “ ”.
- One row = one sentence (prose) or 1–2 lines (poems; join with a space). Max ~25 words per row.
- Split dialogue from narration: `“…”` said by DV is its own row with speaker DV.
- English: short, simple, friendly, faithful. Explain idioms in brackets, e.g. "(a way of saying she is very sad)".
- 4th item optional: an fx name defined in this scene's `art.fx` that should appear from this row on.

## ART SPEC (scene picture, 800×450 canvas, ground line about y=330)
```json
"art": {
  "bg": "day",          // day | dusk | night | dawn | grey | indoor | kitchen | classroom | sky
  "ground": "grass",    // grass | field | water | river | road | floor | soil | dry | beach | city | none
  "items": [ ITEM, ... ],                   // drawn in order (later = in front)
  "fx": { "fxName": [ ITEM, ... ] }         // extra items that appear when a sentence uses that fx
}
```
ITEM = array. Optional last element `{"anim": "bob", "delay": 0.5}` animates it.
| item | meaning |
|---|---|
| `["e", "🍚", x, y, size]` | any emoji (centre x, baseline y, font size 20–120). Use freely for props, food, animals, objects. |
| `["p", role, x, y, scale, pose, flip]` | person. role: man, woman, boy, girl, oldman, oldwoman, gandhi, teacher, cook, pilot, farmer. pose: stand, run, wave, point, sit, sad. scale 0.5–1.4 (feet at y). flip true = facing left |
| `["text", "words", x, y, size, "#color"]` | short text (Malayalam or English sound words) |
| `["house"|"hut"|"school", x, y, scale]` | building, base at y |
| `["building", x, baseY, width, height]` | city block |
| `["tree"|"palm"|"mangrove"|"bush", x, y, scale]` | plants, base at y |
| `["flowertree", x, y, scale, "#color"]` | flowering tree (e.g. champaka "#f6d365") |
| `["flower", x, y, scale, "#color"]` | single flower |
| `["sun"|"moon", x, y]`, `["cloud", x, y, scale]`, `["stars"]`, `["rain"]`, `["birds"]`, `["butterflies"]` | sky things |
| `["fish", x, y, scale]`, `["boat", x, y, scale]` | water things |
| `["plane", x, y, scale]` | early biplane (Wright brothers style) |
| `["stove", x, y, scale]`, `["pot", x, y, scale]`, `["fire", x, y, scale]`, `["torch", x, y, scale]` | kitchen/fire things |
| `["table", x, y, width]`, `["book", x, y, scale]`, `["blackboard", x, y, "text"]`, `["marbles", x, y]` | objects |
| `["car", x, y, scale]`, `["fence", x1, x2, y]`, `["wall", x, y, w, h]`, `["glow", x, y, r]` | misc |

anim: bob, sway, spin, hop, fly, swim, drive, walk, pulse, beat, grow, rise, fall, shake, float, flutter,
wiggle, slidein, slideout, pop, flicker, zoom.  Make each scene lively: 2–5 animated things, people
doing the action of the scene, fx that change the picture as the text moves. Look at the textbook
picture (`markdown/images/…`, you can open them) for inspiration, but draw the scene the text describes.

## words (8–16)
Key words a Grade-2 reader needs for this lesson. `id` is short, lowercase, unique in the file.
```json
{"id": "adukkala", "ml": "അടുക്കള", "rom": "adukkala", "en": "kitchen", "emoji": "🍳", "set": "A"}
```
`set` "A" for words from the first half, "B" for the second half (for short lessons all "A").

## quiz (6–12)
Comprehension questions answerable from the text. Malayalam question + English, 4 options each language,
`a` = index of correct option (vary it), `sec` "A"/"B" like words. Keep options short.
```json
{"q": "…?", "qe": "…?", "o": ["…","…","…","…"], "oe": ["…","…","…","…"], "a": 2, "sec": "A"}
```

## build (3–5)
Short sentences (3–7 chunks) from the text for the sentence-builder game, chunks in correct order.
```json
{"ch": ["ദിനകരന്", "ഒരു", "സ്വപ്നമുണ്ടായിരുന്നു"], "en": "Dinakaran had a dream.", "rom": "Dinakaranu oru swapnamundaayirunnu"}
```

## retell (4–6)
English checklist points a parent ticks while the child retells the lesson.

## write
One writing task inspired by the textbook activity, simplified. `min` = letters required (20–60).
```json
{"title": "✍️ English title", "prompt": "Malayalam prompt", "en": "English instructions (Malayalam, English or mixed is fine)", "starters": ["…", "…"], "min": 30}
```

## plan (days)
Number of days by complexity: easy 3, medium 4–5, hard 5–7. Each day 10–20 minutes, 2–4 steps.
Day 1 always starts with `info` then `story`. Last day ends with `final`.
```json
{"title": "English day title", "ml": "Malayalam day title", "icon": "🎧", "mode": "game", "steps": [ STEP, ... ]}
```
STEP types:
| step | what it does |
|---|---|
| `{"t":"info"}` | shows `summaryEn` (meet the lesson) |
| `{"t":"story","scenes":[0,3]}` | read-along of scenes 0..3 (inclusive). `{"t":"story"}` = whole lesson |
| `{"t":"cards","set":"A"}` | flip word cards |
| `{"t":"match","set":"A"}` / `{"t":"memory","set":"A"}` | word games |
| `{"t":"warmup","sets":["A"]}` | spaced review of learned words |
| `{"t":"quiz","sec":"A"}` | questions with instant feedback |
| `{"t":"builder"}` | sentence builder (uses `build`) |
| `{"t":"write"}` | writing task |
| `{"t":"retell"}` | tell the lesson to a parent |
| `{"t":"final"}` | final quiz: all questions + words; score saved for the parent report |

`mode` optional: "game" or "classic" (badge only).

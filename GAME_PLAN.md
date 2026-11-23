# Game plan: "Rescue Kunjimathvamma" (Roblox, Aathi world)

## The idea
Kunjimathvamma refuses to leave the water. A building is closing in on the wetland. Isaiah **hears a Malayalam word** and must put the right **object** in place before time runs out. Right answers push the building back. Wrong answers and slow answers let it advance. If the building covers the whole wetland, Kunjimathvamma is trapped inside it. If Isaiah answers all 10 words, the wetland is saved and she walks out of the water.

## What it teaches
- Hear a Malayalam word and link it to a real thing: sound -> meaning, with no English reading needed.
- Recognise the written word (Malayalam picture shown on screen) next to the sound.
- Chapter ideas: wetland (തണ്ണീർത്തടം), mangrove (കണ്ടൽ), swamp (ചതുപ്പ്), paddy field (നെൽപ്പാടം), bund (വരമ്പ്), fish (മീൻ), crab (ഞണ്ട്), frog (തവള), bird (പക്ഷി), butterfly (ശലഭം).
- Cause and effect from the story: when the water goes, the life goes.

## How a game works
1. Isaiah presses E on a start button: blue **Practice** or orange **Challenge** (near the spawn point).
2. The wetland resets. A panel shows: word number, time left, a **Building meter (0-7)** and the Malayalam word picture.
3. The word is spoken (and repeated every 6 seconds). Press E on the speaker to hear it again.
4. Isaiah walks to the plaza and presses E on the matching object. The objects change places every game, so he must listen, not memorise positions.
5. Result of each answer:

| Result | What happens |
|---|---|
| Correct | The building is pushed back (a filled part of the wetland is restored, or a pending advance is cancelled). Message shows the word, its meaning and the object glows green. |
| Wrong | Building advances one step. The wrong pad glows red, the right pad glows green, and the word is spoken again. |
| Time runs out | Building advances one step. Right pad glows green. Word is spoken again. |
| Time passing | The building also creeps forward on its own every 60 s (Practice) or 35 s (Challenge). |

## Winning and losing
- **Win:** all 10 words answered while the Building meter is below 7. The wetland comes back, Kunjimathvamma walks out of the water, and the result shows time, mistakes and stars (3 stars = no mistakes, 2 = up to 2 mistakes, 1 = more).
- **Lose:** the meter reaches 7 (the whole wetland is covered). Isaiah is moved safely to the start, the building seals over the wetland, and Kunjimathvamma is trapped inside. Press a start button to try again.

## Two modes
| | Practice | Challenge |
|---|---|---|
| Time per word | 40 s | 25 s |
| Building creeps | every 60 s | every 35 s |
| Labels on objects | shown (romanised + English) | hidden |
| Romanised hint under Malayalam word | always | after 10 s |

Start with Practice until Isaiah wins it twice, then Challenge.

## Suggested use during the 15-day plan
- Days 10-11 (Roblox days): explore first, then play one Practice game each day.
- From Day 12: one Challenge game per day. Note the result (win/lose, mistakes) in the parent log.
- Final days: a Challenge win with no more than 2 mistakes is a good sign the words are sticking.

## Tuning (all in the `AathiRescue` script, `CFG` table)
`roundTime`, `interval` (creep speed), `hintAfter`, `labels`. Make Challenge harder by lowering `roundTime` or `interval`.

## Limits
- Results are shown in the game only (not saved between sessions).
- The spoken Malayalam is a computer voice; have a Malayalam speaker check it.
- Roblox reviews every uploaded clip. Two clips were rejected at first and were re-made with the male voice; all 27 clips are now approved. If a word ever has no sound, check its moderation status in Creator Hub.
- Tuning and testing hooks live in the `AathiRescue` script (`RescueAPI`) and are only for testing.

## Look and feel
The world is styled as a Kerala backwater village at golden hour: terrain with hills, palms, banana plants, a village with two houses, a boat, a jetty and a stone plaza. Text is kept to a minimum: labels appear only when you are close, signs are small wooden boards, and details (meaning, English) appear when you press E.

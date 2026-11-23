/* Read-along story player: picture + Malayalam (word-by-word highlight) + sounds-like + English + audio.
   Uses STORY (story-data.js) and ART (story-art.js). Progress lives in S.story. */
'use strict';

/* ---------- Malayalam -> easy English letters (for "sounds like") ---------- */
const ROMAN = (() => {
  const V = { 'അ': 'a', 'ആ': 'aa', 'ഇ': 'i', 'ഈ': 'ee', 'ഉ': 'u', 'ഊ': 'oo', 'ഋ': 'ru', 'എ': 'e', 'ഏ': 'e', 'ഐ': 'ai', 'ഒ': 'o', 'ഓ': 'o', 'ഔ': 'au' };
  const M = { 'ാ': 'aa', 'ി': 'i', 'ീ': 'ee', 'ു': 'u', 'ൂ': 'oo', 'ൃ': 'ru', 'െ': 'e', 'േ': 'e', 'ൈ': 'ai', 'ൊ': 'o', 'ോ': 'o', 'ൌ': 'au', 'ൗ': 'au' };
  const K = { 'ക': 'k', 'ഖ': 'kh', 'ഗ': 'g', 'ഘ': 'gh', 'ങ': 'ng', 'ച': 'ch', 'ഛ': 'chh', 'ജ': 'j', 'ഝ': 'jh', 'ഞ': 'nj', 'ട': 't', 'ഠ': 'th', 'ഡ': 'd', 'ഢ': 'dh', 'ണ': 'n', 'ത': 'th', 'ഥ': 'th', 'ദ': 'd', 'ധ': 'dh', 'ന': 'n', 'പ': 'p', 'ഫ': 'ph', 'ബ': 'b', 'ഭ': 'bh', 'മ': 'm', 'യ': 'y', 'ര': 'r', 'ല': 'l', 'വ': 'v', 'ശ': 'sh', 'ഷ': 'sh', 'സ': 's', 'ഹ': 'h', 'ള': 'l', 'ഴ': 'zh', 'റ': 'r' };
  const CH = { 'ൺ': 'n', 'ൻ': 'n', 'ർ': 'r', 'ൽ': 'l', 'ൾ': 'l', 'ൿ': 'k', 'ം': 'm', 'ഃ': 'h' };
  const PAIR = { 'റ്റ': 'tt', 'ന്റ': 'nt', 'ണ്ട': 'nd', 'ന്ത': 'nth', 'ന്ദ': 'nd', 'മ്പ': 'mb', 'ങ്ങ': 'ng', 'ങ്ക': 'nk', 'ഞ്ഞ': 'nj', 'ഞ്ച': 'nch', 'ക്ഷ': 'ksh', 'ത്ത': 'tth', 'ച്ച': 'cch', 'ട്ട': 'tt', 'പ്പ': 'pp', 'ക്ക': 'kk', 'ല്ല': 'll', 'ള്ള': 'll', 'ന്ന': 'nn', 'മ്മ': 'mm', 'ണ്ണ': 'nn', 'യ്യ': 'yy', 'വ്വ': 'vv', 'ശ്ശ': 'ssh', 'സ്സ': 'ss', 'ത്ഥ': 'tth', 'ഷ്ട': 'sht' };
  const VIR = '്';
  return function (w) {
    let out = '', i = 0;
    while (i < w.length) {
      const c = w[i];
      if (V[c]) { out += V[c]; i++; continue; }
      if (CH[c]) { out += CH[c]; i++; continue; }
      let cons = null, len = 0;
      const tri = w.substr(i, 3);
      if (PAIR[tri]) { cons = PAIR[tri]; len = 3; }
      else if (K[c]) { cons = K[c]; len = 1; }
      if (cons === null) { out += c; i++; continue; }
      i += len;
      // conjunct with the next consonant: consonant + virama + consonant
      if (w[i] === VIR && K[w[i + 1]]) { out += cons; i++; continue; }
      if (w[i] === VIR) { out += cons + 'u'; i++; continue; }   // ending virama sounds like a soft "u"
      if (M[w[i]]) { out += cons + M[w[i]]; i++; continue; }
      out += cons + 'a';
    }
    return out;
  };
})();
const romanWord = w => ROMAN(w.replace(/[“”"‘’'!?.,;:…()\-–—]/g, ''));

/* ---------- reader ---------- */
let storyStop = null;
function storyReader(opts = {}) {
  const ST = STORY;
  const range = opts.scenes || [0, ST.scenes.length - 1];
  const scenes = ST.scenes.slice(range[0], range[1] + 1);
  const sceneIds = new Set(scenes.map(s => s.id));
  const sents = ST.sents.filter(s => sceneIds.has(s.scene));
  LP.story = Object.assign({ pos: 0, heard: {}, rom: true, en: true, speed: 1, auto: true }, LP.story || {});
  const P = LP.story;
  if (!sents.length) return h('p', {}, 'This lesson has no story yet.');
  // remember the place by sentence id (works for partial ranges too)
  let startAt = Math.max(0, sents.findIndex(s => s.id === P.at));
  if (P.at === undefined && typeof P.pos === 'number' && !opts.scenes) startAt = Math.min(P.pos, sents.length - 1);
  const audio = new Audio(); audio.preload = 'auto';
  let cur = -1, playing = false, raf = 0, repeat = false, sceneShown = null, wordEls = [], listRows = [];
  const sceneIdx = id => scenes.findIndex(s => s.id === id);

  /* stage */
  const stage = h('div', { class: 'st-stage' });
  const layerA = h('div', { class: 'st-layer on' }), layerB = h('div', { class: 'st-layer' });
  const sceneChip = h('div', { class: 'st-chip' });
  const BOOK = { excavator: 'img/excavator.jpg', km: 'img/split.jpg' };
  const bookOf = sc => sc.book || (typeof sc.art === 'string' ? BOOK[sc.art] : null);
  const bookBtn = h('button', { class: 'st-bookbtn hide', onclick: () => stage.classList.toggle('book') }, '🖼️ Book picture');
  const bookImg = h('img', { class: 'st-book', alt: 'Illustration from the textbook' });
  stage.append(layerA, layerB, bookImg, h('div', { class: 'st-paper' }), sceneChip, bookBtn);

  /* text */
  const who = h('div', { class: 'st-who' });
  const line = h('div', { class: 'st-line ml' });
  const en = h('div', { class: 'st-en' });
  const textCard = h('div', { class: 'st-text' }, who, line, en);

  /* controls */
  const playBtn = h('button', { class: 'st-play', 'aria-label': 'Play' }, '▶');
  const prevBtn = h('button', { class: 'st-ctl', 'aria-label': 'Previous line', onclick: () => goTo(cur - 1, true) }, '⏮');
  const nextBtn = h('button', { class: 'st-ctl', 'aria-label': 'Next line', onclick: () => goTo(cur + 1, true) }, '⏭');
  const repBtn = h('button', { class: 'st-tog', title: 'Repeat this line', onclick: () => { repeat = !repeat; repBtn.classList.toggle('on', repeat); } }, '🔁 Repeat');
  const spdBtn = h('button', { class: 'st-tog on', title: 'Speed', onclick: () => { const v = [1, .85, .7]; P.speed = v[(v.indexOf(P.speed) + 1) % v.length] || 1; audio.playbackRate = P.speed; spdBtn.textContent = speedLabel(); save(); } });
  const speedLabel = () => ({ 1: '🐇 Normal', .85: '🐢 Slower', .7: '🐌 Slowest' }[P.speed] || '🐇 Normal');
  spdBtn.textContent = speedLabel();
  const tog = (key, label) => { const b = h('button', { class: 'st-tog' + (P[key] ? ' on' : ''), onclick: () => { P[key] = !P[key]; b.classList.toggle('on', P[key]); applyToggles(); save(); } }, label); return b; };
  const romTog = tog('rom', '🔤 Sounds like'), enTog = tog('en', '🇬🇧 English'), autoTog = tog('auto', '⏩ Keep going');
  playBtn.onclick = () => playing ? pause() : play();
  const prog = h('div', { class: 'bar st-prog' }, h('i'));
  const controls = h('div', { class: 'st-controls' }, h('div', { class: 'st-main' }, prevBtn, playBtn, nextBtn), prog, h('div', { class: 'st-toggles' }, romTog, enTog, spdBtn, repBtn, autoTog));

  /* scenes strip + full text */
  const strip = h('div', { class: 'st-strip' }, scenes.map((sc, k) => h('button', { class: 'st-scene', 'data-k': k, onclick: () => { goTo(sents.findIndex(s => s.scene === sc.id), true); } }, h('b', {}, k + 1), ' ', sc.title)));
  const list = h('div', { class: 'st-list' });
  let lastScene = null;
  sents.forEach((s, i) => {
    if (s.scene !== lastScene) { lastScene = s.scene; const sc = scenes[sceneIdx(s.scene)]; list.append(h('div', { class: 'st-lh' }, sc.title, ' · ', h('span', { class: 'ml' }, sc.ml))); }
    const r = h('button', { class: 'st-row', onclick: () => goTo(i, true) }, h('span', { class: 'st-sp' }, ST.speakers[s.sp].emoji), h('span', {}, h('span', { class: 'ml' }, s.ml), h('small', {}, s.en)));
    listRows.push(r); list.append(r);
  });
  const listWrap = h('details', { class: 'st-all' }, h('summary', {}, '📜 The whole story — tap any line to start there'), list);

  function applyToggles() { root.classList.toggle('no-rom', !P.rom); root.classList.toggle('no-en', !P.en); }

  function showScene(id) {
    if (sceneShown === id) return;
    sceneShown = id;
    const sc = scenes[sceneIdx(id)];
    const [on, off] = layerA.classList.contains('on') ? [layerA, layerB] : [layerB, layerA];
    off.innerHTML = ART.scene(sc.art);
    on.classList.remove('on'); off.classList.add('on');
    setTimeout(() => { if (!on.classList.contains('on')) on.innerHTML = ''; }, 900);
    sceneChip.innerHTML = ''; sceneChip.append(h('b', {}, `${sceneIdx(id) + 1}/${scenes.length}`), ' ', sc.title);
    const book = bookOf(sc);
    bookBtn.classList.toggle('hide', !book); stage.classList.remove('book');
    if (book) bookImg.src = book;
    strip.querySelectorAll('.st-scene').forEach(b => b.classList.toggle('on', +b.dataset.k === sceneIdx(id)));
    const chip = strip.querySelector('.st-scene.on'); if (chip) strip.scrollTo({ left: chip.offsetLeft - 20, behavior: 'smooth' });
  }
  function applyFx(i) {
    const s = sents[i];
    const svgEl = stage.querySelector('.st-layer.on svg'); if (!svgEl) return;
    [...svgEl.classList].filter(c => c.startsWith('on-') || c.startsWith('now-')).forEach(c => svgEl.classList.remove(c));
    const active = new Set();
    for (let k = 0; k <= i; k++) if (sents[k].scene === s.scene && sents[k].fx) active.add(sents[k].fx);
    active.forEach(f => svgEl.classList.add('on-' + f));
    if (s.fx) svgEl.classList.add('now-' + s.fx);
    svgEl.querySelectorAll('.fxg').forEach(g => { const name = [...g.classList].find(c => c.startsWith('fx-')).slice(3); g.classList.toggle('show', active.has(name)); });
  }
  function drawLine(i) {
    const s = sents[i], sp = ST.speakers[s.sp];
    who.innerHTML = ''; who.append(h('span', { class: 'st-av sp-' + s.sp }, sp.emoji), h('b', {}, sp.name), ' ', h('span', { class: 'ml mut' }, sp.ml));
    line.innerHTML = ''; line.scrollTop = 0; wordEls = s.words.map((w, k) => {
      const el = h('button', { class: 'st-w', onclick: () => { goTo(i, false); playFrom(w.s); } }, h('span', { class: 'w' }, w.t), h('span', { class: 'r' }, romanWord(w.t) || ' '));
      line.append(el, ' '); return el;
    });
    en.textContent = s.en;
    textCard.classList.remove('pop'); void textCard.offsetWidth; textCard.classList.add('pop');
    listRows.forEach((r, k) => r.classList.toggle('on', k === i));
    if (listWrap.open) { const r = listRows[i]; list.scrollTo({ top: r.offsetTop - list.offsetTop - 60, behavior: 'smooth' }); }
    prog.firstChild.style.width = (i / (sents.length - 1) * 100) + '%';
  }
  function goTo(i, andPlay) {
    if (i < 0 || i >= sents.length) return;
    const wasPlaying = playing;
    cur = i; P.at = sents[i].id; if (!opts.scenes) P.pos = i; save();
    showScene(sents[i].scene);
    requestAnimationFrame(() => applyFx(i));
    drawLine(i);
    audio.src = sents[i].audio; audio.playbackRate = P.speed || 1;
    if (andPlay === true || (andPlay !== false && wasPlaying)) play(); else { playing = false; playBtn.textContent = '▶'; }
  }
  function playFrom(t) {
    const go1 = () => { audio.currentTime = Math.max(0, t - .05); play(); };
    if (audio.readyState >= 1) go1(); else audio.addEventListener('loadedmetadata', go1, { once: true });
  }
  function play() {
    if (cur < 0) goTo(startAt, false);
    audio.playbackRate = P.speed || 1;
    audio.play().then(() => { playing = true; playBtn.textContent = '⏸'; root.classList.add('playing'); tick(); }).catch(() => { playing = false; playBtn.textContent = '▶'; });
  }
  function pause() { audio.pause(); playing = false; playBtn.textContent = '▶'; root.classList.remove('playing'); cancelAnimationFrame(raf); }
  function tick() {
    cancelAnimationFrame(raf);
    const t = audio.currentTime, ws = sents[cur].words;
    wordEls.forEach((el, k) => {
      const w = ws[k], end = k + 1 < ws.length ? Math.max(ws[k + 1].s, w.s + .05) : w.e + .3;
      const on = t >= w.s && t < end;
      if (on && !el.classList.contains('on')) { const top = el.offsetTop - line.offsetTop; if (top < line.scrollTop || top > line.scrollTop + line.clientHeight - el.offsetHeight) line.scrollTo({ top: top - 8, behavior: 'smooth' }); }
      el.classList.toggle('on', on); el.classList.toggle('done', t >= end);
    });
    if (playing) raf = requestAnimationFrame(tick);
  }
  audio.addEventListener('ended', () => {
    wordEls.forEach(el => { el.classList.remove('on'); el.classList.add('done'); });
    const s = sents[cur];
    if (!P.heard[s.id]) { P.heard[s.id] = 1; addXP(1); floatXP(playBtn, '+1'); }
    const n = Object.keys(P.heard).length;
    if (n >= ST.sents.length && !P.finished) { P.finished = today(); addXP(30); confetti(50); }
    save();
    if (repeat) { setTimeout(() => { audio.currentTime = 0; play(); }, 500); return; }
    playing = false;
    if (P.auto && cur < sents.length - 1) setTimeout(() => goTo(cur + 1, true), 450);
    else { playBtn.textContent = '▶'; root.classList.remove('playing'); }
  });
  audio.addEventListener('error', () => { pause(); en.textContent = '⚠️ Audio file missing — run tools/build_story.py. ' + sents[cur].en; });

  const keys = e => {
    if (e.target.closest('input,textarea,select')) return;
    if (e.code === 'Space') { e.preventDefault(); playing ? pause() : play(); }
    else if (e.key === 'ArrowRight') goTo(cur + 1, true);
    else if (e.key === 'ArrowLeft') goTo(cur - 1, true);
  };
  document.addEventListener('keydown', keys);

  const heardN = Object.keys(P.heard).length, totalN = ST.sents.length;
  const head = h('div', { class: 'st-head' }, h('div', {}, h('h2', { class: 'ml', style: 'margin:0' }, ST.title), h('div', { class: 'mut' }, ST.credit)),
    h('div', { class: 'chip' }, `🎧 ${heardN}/${totalN} lines heard`));
  const root = h('div', { class: 'story' }, opts.compact ? null : head, stage, textCard, controls, strip, listWrap,
    h('p', { class: 'hint' }, 'Tip: tap any Malayalam word to hear the story from that word. Space = play/pause, ← → = previous/next line.'));
  applyToggles();
  storyStop = () => { pause(); audio.src = ''; document.removeEventListener('keydown', keys); storyStop = null; };
  setTimeout(() => goTo(startAt, false), 0);
  return root;
}

/* Animated illustrations for the read-along story (inspired by the textbook's watercolour pictures).
   storyArt(key) returns an SVG string. Groups with class "fxg fx-NAME" appear when the reader adds
   class "on-NAME" to the svg (each sentence in story-data.js may carry an fx name). */
'use strict';
const ART = (() => {
  const C = {
    skinD: '#8d5a3b', skinV: '#7a4a2e', skinA: '#8a5636', skinK: '#6e4630', skinT: '#7d5034',
    blue: '#3a7bd5', mundu: '#f3ecd8', green: '#2e9e6a', orange: '#e07b39', white: '#f6f4ee', purple: '#8e5bd0',
    leaf1: '#2f8a3b', leaf2: '#4fae4a', leaf3: '#7cc96a', dark: '#1f5c2e', root: '#8a5a35', mud: '#9b7653', mud2: '#7d5c3f',
    water: '#58b7d8', water2: '#3d97c0', soil: '#b07a4f', dry: '#e2b07a', crack: '#b9814e', steel: '#f2a422'
  };
  const defs = `<defs>
    <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fdcff"/><stop offset="1" stop-color="#fff6df"/></linearGradient>
    <linearGradient id="skyDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9e7a"/><stop offset=".6" stop-color="#ffd59a"/><stop offset="1" stop-color="#fff0cf"/></linearGradient>
    <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2a5c"/><stop offset="1" stop-color="#6a4f8f"/></linearGradient>
    <linearGradient id="skyGrey" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9b4bf"/><stop offset="1" stop-color="#e6e2da"/></linearGradient>
    <linearGradient id="wat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ccbe6"/><stop offset="1" stop-color="#2f84ad"/></linearGradient>
    <linearGradient id="watG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5cc2a8"/><stop offset="1" stop-color="#1f6f62"/></linearGradient>
    <radialGradient id="glow"><stop offset="0" stop-color="#fff7c2" stop-opacity=".95"/><stop offset="1" stop-color="#fff7c2" stop-opacity="0"/></radialGradient>
    <filter id="wc" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="5"/></filter>
    <filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .45  0 0 0 0 .35  0 0 0 .08 0"/></filter>
  </defs>`;
  /* No live SVG filters here: they would re-render every animation frame. The paper texture is a cached CSS overlay. */
  const svg = (inner, cls) => `<svg class="st-svg ${cls || ''}" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${defs}<g>${inner}</g></svg>`;
  const fx = (name, inner, extra) => `<g class="fxg fx-${name} ${extra || ''}">${inner}</g>`;

  /* ---------- nature pieces ---------- */
  const sky = (k = 'Day') => `<rect width="800" height="450" fill="url(#sky${k})"/>`;
  const stars = () => Array.from({ length: 40 }, (_, i) => `<circle class="twinkle" style="animation-delay:-${(i * .37) % 3}s" cx="${(i * 97) % 800}" cy="${(i * 53) % 220}" r="${1 + (i % 3) * .6}" fill="#fff"/>`).join('');
  const sun = (x, y, r = 34) => `<g transform="translate(${x} ${y})"><circle r="${r * 2.2}" fill="url(#glow)"/><g class="spin">${Array.from({ length: 12 }, (_, i) => `<rect x="-3" y="${-r - 20}" width="6" height="14" rx="3" fill="#ffd34d" transform="rotate(${i * 30})"/>`).join('')}</g><circle r="${r}" fill="#ffd34d"/><circle r="${r * .7}" fill="#ffe27a"/></g>`;
  const cloud = (x, y, s = 1, d = 60) => `<g class="drift" style="--d:${d}s"><g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity=".9"><ellipse cx="0" cy="0" rx="46" ry="18"/><ellipse cx="-22" cy="-10" rx="22" ry="18"/><ellipse cx="14" cy="-16" rx="26" ry="22"/></g></g>`;
  const hills = (y = 250, c1 = '#8fcf87', c2 = '#6fb46c') => `<path d="M0 ${y} Q120 ${y - 70} 240 ${y - 10} T480 ${y - 20} T800 ${y - 30} V450 H0Z" fill="${c1}"/><path d="M0 ${y + 30} Q160 ${y - 20} 320 ${y + 20} T640 ${y + 10} T800 ${y + 20} V450 H0Z" fill="${c2}"/>`;
  const water = (y, grad = 'wat', cls = '') => `<g class="${cls}"><rect x="-40" y="${y}" width="880" height="${470 - y}" fill="url(#${grad})"/>
    <g class="wave"><path d="M-80 ${y + 4} q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#d9f4ff" stroke-width="3" fill="none" opacity=".8"/></g>
    <g class="wave slow"><path d="M-80 ${y + 34} q30 -6 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" stroke="#bfe8f7" stroke-width="2" fill="none" opacity=".55"/></g></g>`;
  const mangrove = (x, y, s = 1, cls = 'sway', dark) => {
    const g = dark ? ['#1d5a2c', '#246b34', '#2f7d3d'] : [C.leaf1, C.leaf2, C.leaf3];
    const roots = Array.from({ length: 7 }, (_, i) => { const dx = (i - 3) * 13; return `<path d="M${dx * .3} -30 Q${dx} -10 ${dx * 1.6} 12" stroke="${C.root}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`; }).join('');
    const leaves = [[-34, -62, 26], [0, -80, 32], [34, -60, 26], [-18, -96, 22], [20, -98, 22], [0, -54, 24]].map(([a, b, r], i) => `<circle cx="${a}" cy="${b}" r="${r}" fill="${g[i % 3]}"/>`).join('');
    return `<g transform="translate(${x} ${y}) scale(${s})"><g class="${cls}" style="animation-delay:-${(x % 7) * .4}s">${roots}<path d="M0 -30 L0 -60" stroke="${C.root}" stroke-width="6"/>${leaves}<g fill="#9fe08a" opacity=".6">${[[-30, -70], [8, -92], [30, -64], [-6, -60]].map(([a, b]) => `<path d="M${a} ${b} l4 -8 l4 8 l-4 3z"/>`).join('')}</g></g></g>`;
  };
  const reeds = (x, y, n = 6, c = '#5f9f45') => `<g class="sway" transform="translate(${x} ${y})">${Array.from({ length: n }, (_, i) => `<path d="M${i * 6} 0 Q${i * 6 + 4} -30 ${i * 6 + (i % 2 ? 8 : -4)} -${46 + (i % 3) * 10}" stroke="${c}" stroke-width="2.5" fill="none"/>`).join('')}</g>`;
  const fish = (x, y, s = 1, col = '#f39c42', dur = 14, delay = 0, rev = false) => `<g class="swim${rev ? ' rev' : ''}" style="--d:${dur}s;animation-delay:-${delay}s"><g transform="translate(${x} ${y}) scale(${rev ? -s : s} ${s})"><g class="wiggle"><path d="M0 0 q14 -12 30 0 q-16 12 -30 0z" fill="${col}"/><path d="M0 0 l-10 -8 v16z" fill="${col}"/><circle cx="22" cy="-2" r="2" fill="#123"/></g></g></g>`;
  const crab = (x, y, s = 1) => `<g class="scuttle"><g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="16" ry="10" fill="#d9472b"/>${[-1, 1].map(k => `<path d="M${k * 14} -2 l${k * 10} -10 M${k * 14} 4 l${k * 12} 4 M${k * 10} 6 l${k * 8} 8" stroke="#b5321b" stroke-width="2.5"/><circle cx="${k * 26}" cy="-14" r="5" fill="#d9472b"/>`).join('')}<circle cx="-5" cy="-11" r="2.5" fill="#123"/><circle cx="5" cy="-11" r="2.5" fill="#123"/></g></g>`;
  const frog = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="hop"><ellipse cx="0" cy="0" rx="16" ry="11" fill="#5cb85c"/><circle cx="-7" cy="-10" r="6" fill="#5cb85c"/><circle cx="7" cy="-10" r="6" fill="#5cb85c"/><circle cx="-7" cy="-11" r="2.5" fill="#123"/><circle cx="7" cy="-11" r="2.5" fill="#123"/><path d="M-6 2 q6 4 12 0" stroke="#2d6a2d" stroke-width="1.5" fill="none"/><ellipse cx="-14" cy="8" rx="8" ry="4" fill="#4aa64a"/><ellipse cx="14" cy="8" rx="8" ry="4" fill="#4aa64a"/></g></g>`;
  const bird = (x, y, s = 1, dur = 18, delay = 0, col = '#2c3e66') => `<g class="fly" style="--d:${dur}s;animation-delay:-${delay}s"><g transform="translate(${x} ${y}) scale(${s})"><g class="flap"><path d="M-22 0 Q-10 -14 0 0 Q10 -14 22 0" stroke="${col}" stroke-width="4" fill="none" stroke-linecap="round"/></g></g></g>`;
  const heron = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="peck"><path d="M0 0 q-6 -30 6 -48 q8 -10 14 -2" stroke="#e9eef2" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="-4" cy="4" rx="18" ry="11" fill="#e9eef2"/><path d="M20 -50 l18 4" stroke="#f0b429" stroke-width="3"/><circle cx="14" cy="-50" r="1.8" fill="#123"/></g><path d="M-6 14 v30 M2 14 v30" stroke="#c9a24a" stroke-width="2.5"/></g>`;
  const butterfly = (x, y, c = '#ff8a3d', delay = 0) => `<g class="flutter" style="animation-delay:-${delay}s"><g transform="translate(${x} ${y})"><g class="wings"><path d="M0 0 q-16 -18 -18 -2 q-2 12 18 2z" fill="${c}"/><path d="M0 0 q16 -18 18 -2 q2 12 -18 2z" fill="${c}"/><path d="M0 0 q-10 14 -12 6 q0 -6 12 -6z M0 0 q10 14 12 6 q0 -6 -12 -6z" fill="${c}" opacity=".8"/></g><path d="M0 -6 v12" stroke="#3a2a1a" stroke-width="2"/></g></g>`;
  const dragonfly = (x, y, delay = 0) => `<g class="flutter" style="animation-delay:-${delay}s"><g transform="translate(${x} ${y})"><path d="M-20 0 h40" stroke="#5a7a8c" stroke-width="3"/><g class="wings" opacity=".7"><ellipse cx="-4" cy="-6" rx="10" ry="4" fill="#d6f0ff"/><ellipse cx="8" cy="-6" rx="10" ry="4" fill="#d6f0ff"/></g></g></g>`;
  const clam = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-10 0 q10 -16 20 0z" fill="#f2d7b6" stroke="#c9a27a"/><path d="M-6 0 l4 -9 M0 0 v-11 M6 0 l-4 -9" stroke="#c9a27a"/></g>`;
  const boat = (x, y, s = 1, person = true) => `<g class="bob"><g transform="translate(${x} ${y}) scale(${s})"><path d="M-70 0 Q0 30 70 0 L60 -8 H-60Z" fill="#7a4b2a"/><path d="M-60 -8 H60" stroke="#5a3318" stroke-width="3"/>${person ? personSVG({ x: 0, y: -6, s: .55, skin: C.skinD, top: C.blue, bottom: C.mundu, pose: 'row' }) : ''}<path d="M30 -40 L60 20" stroke="#5a3318" stroke-width="4"/></g></g>`;

  /* ---------- people ---------- */
  function personSVG(o) {
    const { x = 0, y = 0, s = 1, skin = C.skinD, top = C.blue, bottom = C.mundu, hair = '#24160f', bun = false, grey = false, pose = 'stand', flip = false, cls = '', towel = false, glasses = false, bald = false, pigtails = false, cap = '' } = o;
    const H = grey ? '#c9c4bc' : hair;
    let legs = '', arms = '';
    if (pose === 'run') {
      legs = `<g class="legA"><path d="M-4 -44 L-14 -2" stroke="${skin}" stroke-width="7" stroke-linecap="round"/></g><g class="legB"><path d="M4 -44 L14 -2" stroke="${skin}" stroke-width="7" stroke-linecap="round"/></g>`;
      arms = `<g class="armA"><path d="M-14 -78 L-26 -54" stroke="${skin}" stroke-width="6" stroke-linecap="round"/></g><g class="armB"><path d="M14 -78 L26 -56" stroke="${skin}" stroke-width="6" stroke-linecap="round"/></g>`;
    } else if (pose === 'sit' || pose === 'row') {
      legs = '';
      arms = pose === 'row' ? `<path d="M-12 -76 L20 -60 M12 -76 L26 -58" stroke="${skin}" stroke-width="6" stroke-linecap="round"/>` : `<path d="M-14 -74 Q0 -62 14 -74" stroke="${skin}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-14 -74 Q0 -66 14 -70" stroke="${skin}" stroke-width="5" fill="none"/>`;
    } else {
      legs = `<path d="M-7 -44 L-8 -2 M7 -44 L8 -2" stroke="${skin}" stroke-width="7" stroke-linecap="round"/>`;
      if (pose === 'point') arms = `<path d="M-14 -78 L-18 -50" stroke="${skin}" stroke-width="6" stroke-linecap="round"/><g class="pointarm"><path d="M14 -78 L50 -84" stroke="${skin}" stroke-width="6" stroke-linecap="round"/></g>`;
      else if (pose === 'wave') arms = `<path d="M-14 -78 L-18 -50" stroke="${skin}" stroke-width="6" stroke-linecap="round"/><g class="wavearm"><path d="M14 -78 L30 -104" stroke="${skin}" stroke-width="6" stroke-linecap="round"/></g>`;
      else if (pose === 'sad') arms = `<path d="M-14 -78 L-10 -50 M14 -78 L10 -50" stroke="${skin}" stroke-width="6" stroke-linecap="round"/>`;
      else arms = `<path d="M-14 -78 L-18 -50 M14 -78 L18 -50" stroke="${skin}" stroke-width="6" stroke-linecap="round"/>`;
    }
    const lower = pose === 'sit' || pose === 'row' ? '' : `<path d="M-15 -48 H15 L19 -10 H-19Z" fill="${bottom}"/>`;
    const headY = pose === 'sad' ? -92 : -96;
    const face = `<circle cx="-4.5" cy="${headY}" r="1.8" fill="#1a0f0a"/><circle cx="4.5" cy="${headY}" r="1.8" fill="#1a0f0a"/>` +
      (pose === 'sad' ? `<path d="M-4 ${headY + 7} q4 -3 8 0" stroke="#1a0f0a" stroke-width="1.6" fill="none"/>` : `<path d="M-4 ${headY + 5} q4 3 8 0" stroke="#1a0f0a" stroke-width="1.6" fill="none"/>`);
    return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><g class="${cls}">${legs}${lower}<path d="M-16 -82 Q0 -88 16 -82 L14 -44 H-14Z" fill="${top}"/>${towel ? `<path d="M-16 -82 Q-4 -70 6 -84" stroke="#fff" stroke-width="5" fill="none"/>` : ''}${arms}<circle cx="0" cy="${headY}" r="13" fill="${skin}"/>${bald ? `<path d="M-13 ${headY} q-2 -6 2 -8 M13 ${headY} q2 -6 -2 -8" stroke="${H}" stroke-width="3" fill="none"/>` : `<path d="M-13 ${headY - 2} Q0 ${headY - 20} 13 ${headY - 2} Q8 ${headY - 9} 0 ${headY - 10} Q-8 ${headY - 9} -13 ${headY - 2}Z" fill="${H}"/>`}${bun ? `<circle cx="-11" cy="${headY - 6}" r="6" fill="${H}"/>` : ''}${pigtails ? `<circle cx="-15" cy="${headY + 2}" r="5" fill="${H}"/><circle cx="15" cy="${headY + 2}" r="5" fill="${H}"/>` : ''}${cap ? `<path d="M-14 ${headY - 6} Q0 ${headY - 24} 14 ${headY - 6}Z" fill="${cap}"/><path d="M8 ${headY - 7} h12" stroke="${cap}" stroke-width="4"/>` : ''}${face}${glasses ? `<circle cx="-5" cy="${headY}" r="4.5" fill="none" stroke="#222" stroke-width="1.5"/><circle cx="5" cy="${headY}" r="4.5" fill="none" stroke="#222" stroke-width="1.5"/><path d="M-0.5 ${headY} h1" stroke="#222" stroke-width="1.5"/>` : ''}</g></g>`;
  }
  const P = {
    din: (x, y, s = 1, pose = 'stand', cls = '', flip = false) => personSVG({ x, y, s, skin: C.skinD, top: C.blue, bottom: C.mundu, pose, cls, flip }),
    dev: (x, y, s = 1, pose = 'stand', cls = '', flip = false) => personSVG({ x, y, s, skin: C.skinV, top: C.green, bottom: C.green, bun: true, pose, cls, flip, towel: true }),
    amma: (x, y, s = 1, pose = 'stand', cls = '') => personSVG({ x, y, s, skin: C.skinA, top: C.orange, bottom: C.orange, bun: true, grey: true, pose, cls }),
    km: (x, y, s = 1, pose = 'sit', cls = '') => personSVG({ x, y, s, skin: C.skinK, top: C.white, bottom: C.white, bun: true, grey: true, pose, cls }),
    kar: (x, y, s = 1, pose = 'sit', cls = '') => personSVG({ x, y, s, skin: C.skinT, top: C.purple, bottom: C.purple, bun: true, pose, cls }),
    kid: (x, y, s, top) => personSVG({ x, y, s, skin: '#8f5d3c', top, bottom: '#2d4a7a', pose: 'wave', cls: 'bounce' })
  };

  /* ---------- built things ---------- */
  const house = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-90" y="-80" width="180" height="80" fill="#f1e2c3"/><path d="M-115 -78 L0 -150 L115 -78Z" fill="#b5532c"/><path d="M-115 -78 L0 -150 L115 -78" stroke="#8a3b1c" stroke-width="5" fill="none"/>${Array.from({ length: 6 }, (_, i) => `<path d="M${-100 + i * 40} -84 l20 -12" stroke="#8a3b1c" stroke-width="2"/>`).join('')}<rect x="-20" y="-56" width="40" height="56" fill="#7a4b2a"/><rect x="40" y="-60" width="32" height="26" fill="#6b8fa8"/><path d="M56 -60 v26 M40 -47 h32" stroke="#f1e2c3" stroke-width="3"/><rect x="-74" y="-60" width="32" height="26" fill="#6b8fa8"/><g class="smoke"><circle cx="70" cy="-150" r="8" fill="#ddd"/><circle cx="78" cy="-170" r="10" fill="#e6e6e6"/><circle cx="72" cy="-194" r="12" fill="#efefef"/></g><rect x="62" y="-140" width="16" height="30" fill="#8a3b1c"/></g>`;
  const pot = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="steam">${[-10, 0, 10].map((d, i) => `<path d="M${d} -40 q-6 -10 0 -20 q6 -10 0 -20" stroke="#fff" stroke-width="3" fill="none" opacity=".8" style="animation-delay:-${i * .6}s"/>`).join('')}</g><ellipse cx="0" cy="-30" rx="30" ry="8" fill="#3b2a1e"/><path d="M-32 -30 Q-36 6 0 8 Q36 6 32 -30Z" fill="#4a3426"/><ellipse cx="0" cy="-30" rx="24" ry="5" fill="#f5f0e1"/><path d="M-30 12 h60" stroke="#e8662e" stroke-width="6"/><g class="flame"><path d="M-14 14 q4 -16 8 0 q4 -12 8 0 q4 -16 8 0z" fill="#ff9a2e"/></g></g>`;
  const fence = (x1, x2, y) => `<g>${Array.from({ length: Math.floor((x2 - x1) / 50) + 1 }, (_, i) => `<rect x="${x1 + i * 50 - 3}" y="${y - 50}" width="6" height="52" fill="#6e6a64"/>`).join('')}${[0, 1, 2].map(k => `<path d="M${x1} ${y - 44 + k * 14} H${x2}" stroke="#8d8a85" stroke-width="1.6" stroke-dasharray="6 3"/>`).join('')}</g>`;
  const wall = (x, y, w, h, c = '#b7aca0') => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>${Array.from({ length: Math.ceil(h / 14) }, (_, r) => `<path d="M${x} ${y + r * 14} H${x + w}" stroke="#8f857a" stroke-width="1.5"/>` + Array.from({ length: Math.ceil(w / 30) }, (_, k) => `<path d="M${x + k * 30 + (r % 2) * 15} ${y + r * 14} v14" stroke="#8f857a" stroke-width="1.5"/>`).join('')).join('')}</g>`;
  const granite = (x, y, w, h) => `<g>${Array.from({ length: Math.ceil(w / 46) * Math.ceil(h / 34) }, (_, i) => { const cx = x + (i % Math.ceil(w / 46)) * 46 + (Math.floor(i / Math.ceil(w / 46)) % 2) * 20; const cy = y + Math.floor(i / Math.ceil(w / 46)) * 34; return `<rect x="${cx}" y="${cy}" width="44" height="32" rx="8" fill="${['#7d8288', '#6c7177', '#8a8f95'][i % 3]}" stroke="#545a60" stroke-width="2"/>`; }).join('')}</g>`;
  const building = (x, base, w, h, c = '#c9ced4', cls = '') => `<g class="${cls}" style="transform-origin:${x + w / 2}px ${base}px"><rect x="${x}" y="${base - h}" width="${w}" height="${h}" fill="${c}"/>${Array.from({ length: Math.floor(h / 26) * Math.floor(w / 22) }, (_, i) => `<rect x="${x + 6 + (i % Math.floor(w / 22)) * 22}" y="${base - h + 8 + Math.floor(i / Math.floor(w / 22)) * 26}" width="12" height="14" fill="${i % 4 ? '#7f97ad' : '#ffe58a'}"/>`).join('')}</g>`;
  const pillars = (x, base, n) => `<g>${Array.from({ length: n }, (_, i) => `<rect x="${x + i * 46}" y="${base - 70}" width="14" height="70" fill="#9aa0a6"/>${[0, 1, 2].map(k => `<path d="M${x + i * 46 + 3 + k * 4} ${base - 70} v-18" stroke="#6d5a4a" stroke-width="1.6"/>`).join('')}`).join('')}<rect x="${x - 10}" y="${base - 6}" width="${n * 46}" height="10" fill="#8b9096"/></g>`;
  const excavator = (x, y, s = 1, holding = '') => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-90" y="-20" width="180" height="26" rx="13" fill="#3f3f3f"/>${[-70, -35, 0, 35, 70].map(c => `<circle cx="${c}" cy="-7" r="9" fill="#666"/>`).join('')}<rect x="-80" y="-80" width="150" height="62" rx="8" fill="${C.steel}"/><rect x="10" y="-130" width="70" height="56" rx="6" fill="#2f3b45"/><rect x="18" y="-124" width="54" height="40" rx="4" fill="#9fc3d6"/><g class="arm" style="transform-origin:-60px -70px"><path d="M-60 -70 L-170 -170" stroke="${C.steel}" stroke-width="22" stroke-linecap="round"/><g class="arm2" style="transform-origin:-170px -170px"><path d="M-170 -170 L-250 -60" stroke="${C.steel}" stroke-width="18" stroke-linecap="round"/><path d="M-275 -60 h50 l-10 40 h-30z" fill="#5a5a5a"/>${holding}</g></g></g>`;

  /* ---------- scenes ---------- */
  const S = {};
  S.wetland = () => svg(sky() + sun(660, 80) + cloud(160, 70, 1.1, 70) + cloud(480, 50, .8, 90) + hills(220) +
    water(250) + mangrove(110, 280, 1.2) + mangrove(230, 300, .9) + mangrove(700, 290, 1.25) + mangrove(600, 310, .8) +
    reeds(330, 260, 7) + reeds(520, 262, 6) + fish(200, 360, 1.2, '#f39c42', 16, 2) + fish(450, 400, 1, '#ffd34d', 20, 8, true) + fish(620, 370, .9, '#ff7a59', 13, 5) +
    crab(80, 430, .9) + frog(760, 300, .9) + heron(420, 260, .9) + bird(200, 120, 1, 22, 3) + bird(320, 150, .7, 26, 10) + butterfly(560, 200, '#ff8a3d', 1) + dragonfly(300, 220, 2) +
    fx('boat', boat(420, 300, 1.1)) + fx('boat', clam(160, 440) + clam(190, 436) + clam(640, 444)) +
    fx('glow', `<circle cx="400" cy="225" r="300" fill="url(#glow)" class="pulse"/>`));
  S.excavator = () => svg(sky('Dusk') + hills(260, '#a7c98b', '#8fb874') + water(300, 'watG') + mangrove(640, 330, 1.1) + mangrove(740, 340, .9) + reeds(520, 300, 6) +
    fish(560, 400, 1, '#f39c42', 12, 1) + bird(600, 120, 1, 14, 2) + bird(680, 160, .7, 16, 6) + butterfly(470, 220, '#ffb13d', 2) + dragonfly(420, 180, 1) +
    excavator(330, 330, 1, fx('scoop', `<g transform="translate(-250 -96) scale(.75)">${mangrove(0, 0, 1, 'shake')}${crab(-20, -40, .6)}</g>`)) +
    fx('reach', `<path d="M60 330 q30 -20 60 0" stroke="#fff" stroke-width="3" fill="none" class="pulse"/>`) +
    fx('scoop', `<g class="fall">${fish(80, 330, .8, '#f39c42', 8)}${bird(140, 220, .8, 6, 1)}</g>`), 'shake-on-scoop');
  S.giant = () => svg(sky('Grey') + hills(280, '#9ccf8c', '#7db86f') +
    `<g class="eatme">${mangrove(560, 330, 1)}${mangrove(660, 340, .8)}<path d="M480 300 q60 -110 130 -20 q50 -80 120 10 V450 H480Z" fill="#6aa65f"/><path d="M500 360 q80 -20 260 0" stroke="#6fc3df" stroke-width="16" fill="none"/></g>` +
    `<g class="giant"><ellipse cx="230" cy="300" rx="190" ry="150" fill="#6b5b7b"/><ellipse cx="230" cy="320" rx="150" ry="110" fill="#7d6c8e"/><circle cx="180" cy="220" r="22" fill="#fff"/><circle cx="270" cy="220" r="22" fill="#fff"/><circle cx="186" cy="224" r="10" fill="#222" class="look"/><circle cx="276" cy="224" r="10" fill="#222" class="look"/><g class="jaw"><path d="M140 290 Q230 380 330 290 Z" fill="#3a2335"/><path d="M150 292 l12 14 l12 -14 l12 14 l12 -14 l12 14 l12 -14 l12 14 l12 -14 l12 14 l12 -14 l12 14 l12 -14 l12 14 l12 -14" fill="#fff"/></g></g>` +
    fx('eat', `<g class="crumbs">${[0, 1, 2, 3, 4].map(i => `<circle cx="${400 + i * 20}" cy="${300 + (i % 2) * 20}" r="8" fill="${['#6aa65f', '#8a6a4a', '#6fc3df'][i % 3]}" style="animation-delay:${i * .15}s"/>`).join('')}</g>`) +
    fx('city', `<g class="rise-up">${building(470, 450, 70, 200, '#b9c1c9')}${building(550, 450, 90, 260, '#a3adb8')}${building(650, 450, 60, 170, '#c7ccd2')}${building(715, 450, 80, 230, '#9ea8b3')}</g>`));
  S.farm = () => svg(sky() + sun(640, 90, 40) + cloud(200, 80, 1, 80) + hills(240, '#a5d68f', '#8cc77a') +
    `<rect y="300" width="800" height="150" fill="${C.soil}"/>${Array.from({ length: 6 }, (_, i) => `<path d="M0 ${320 + i * 24} H800" stroke="#9a6a42" stroke-width="3"/>`).join('')}` +
    P.din(250, 330, 1.3, 'stand') +
    fx('sprout', `<g transform="translate(470 320)"><ellipse rx="40" ry="10" fill="#8a5a35"/><g class="grow"><path d="M0 0 v-60" stroke="#3d9a3d" stroke-width="5"/><path d="M0 -40 q-26 -10 -30 -30 q22 0 30 26z M0 -54 q26 -10 30 -30 q-22 0 -30 26z" fill="#5cc25c"/></g><g class="drops">${[-20, 0, 20].map((d, i) => `<path d="M${d} -120 q-5 8 0 12 q5 -4 0 -12z" fill="#6fc3df" style="animation-delay:${i * .3}s"/>`).join('')}</g></g>`) +
    fx('harvest', `<g class="grow-all">${Array.from({ length: 14 }, (_, i) => `<g transform="translate(${40 + i * 56} ${430 - (i % 2) * 14})"><path d="M0 0 v-46" stroke="#5a9a3a" stroke-width="3"/><path d="M0 -46 q8 -18 2 -30 M0 -40 q-10 -14 -6 -28" stroke="#e3b844" stroke-width="5" fill="none"/></g>`).join('')}</g>`) +
    fx('kids', P.kid(560, 440, .8, '#e85a71') + P.kid(620, 440, .75, '#f2b134') + P.kid(680, 440, .8, '#6c5ce7')) +
    fx('five', `<g class="pop-row" transform="translate(130 140)">${['🟫', '💧', '☀️', '💦', '🌱'].map((e, i) => `<g transform="translate(${i * 120} 0)"><circle r="40" fill="#fff" opacity=".85"/><text y="16" text-anchor="middle" font-size="44" style="animation-delay:${i * .25}s">${e}</text></g>`).join('')}</g>`) +
    fx('glow', `<circle cx="470" cy="260" r="200" fill="url(#glow)" class="pulse"/>`));
  S.home = () => svg(sky() + cloud(600, 70, 1, 70) + hills(240, '#a0d290', '#88c27b') + `<rect y="330" width="800" height="120" fill="#c9a36f"/>` +
    house(520, 340, 1.05) + `<path d="M130 340 q-30 -80 20 -150 q20 40 0 150z" fill="#3f8d3f"/><path d="M150 340 v-180" stroke="#7a5a35" stroke-width="8"/>${[0, 1, 2, 3, 4].map(i => `<path d="M150 170 q${-60 + i * 30} ${-30 + Math.abs(i - 2) * 12} ${-90 + i * 45} ${10 + Math.abs(i - 2) * 10}" stroke="#4aa04a" stroke-width="7" fill="none"/>`).join('')}` +
    P.din(330, 420, 1.15, 'stand', 'breathe') +
    fx('sad', `<g class="rainy"><g transform="translate(330 150)"><ellipse rx="70" ry="26" fill="#9aa4ad"/>${[-40, -15, 10, 35].map((d, i) => `<path d="M${d} 30 l-4 16" stroke="#6fa3c7" stroke-width="3" class="drip" style="animation-delay:${i * .25}s"/>`).join('')}</g></g>`) +
    fx('pot', pot(690, 430, 1)) +
    fx('amma', `<g class="peek">${P.amma(520, 340, .9, 'stand')}</g>`) +
    fx('devaki', `<g class="slide-in">${P.dev(200, 430, 1.1, 'wave', 'shake-soft')}</g>`) +
    fx('runoff', `<g class="run-off">${P.dev(200, 430, 1.1, 'run', '', true)}</g>`), 'scene-home');
  S.fields = () => svg(sky() + sun(700, 70, 30) + hills(200, '#9fd08e', '#87c27a') +
    `<rect y="230" width="800" height="220" fill="#7fbf5a"/>${Array.from({ length: 5 }, (_, i) => `<path d="M0 ${250 + i * 44} Q400 ${236 + i * 44} 800 ${252 + i * 44}" stroke="#a7834f" stroke-width="10" fill="none"/>`).join('')}` +
    `<g class="paddy">${Array.from({ length: 40 }, (_, i) => `<path d="M${(i * 41) % 800} ${270 + Math.floor(i / 20) * 70 + (i % 3) * 12} q3 -16 0 -26 M${(i * 41) % 800 + 6} ${270 + Math.floor(i / 20) * 70 + (i % 3) * 12} q-3 -14 2 -22" stroke="#4e9a35" stroke-width="2.5" fill="none"/>`).join('')}</g>` +
    `<path d="M560 450 q60 -80 240 -110 V450Z" fill="#5d4a35" opacity=".6"/>` + reeds(620, 380, 9, '#6c8f3a') + reeds(700, 360, 8, '#6c8f3a') + mangrove(760, 330, .9, 'sway', true) +
    `<g class="cross">${P.dev(0, 0, .9, 'run')}</g><g class="cross late">${P.din(0, 0, .95, 'run')}</g>` + bird(300, 120, .8, 20, 4) + butterfly(200, 230, '#ffdd55', 3));
  S.construction = () => svg(sky('Grey') + `<rect y="250" width="800" height="200" fill="#a88a6a"/><path d="M0 250 Q200 230 400 255 T800 245 V270 H0Z" fill="#8f7354"/>` +
    building(560, 270, 110, 170, '#c4c9ce') + building(680, 270, 90, 110, '#b3b9c0') + pillars(80, 330, 6) + excavator(470, 380, .6) +
    fx('rise', `<g class="rise-up">${building(300, 300, 80, 150, '#d0d4d8')}${building(20, 300, 60, 90, '#bcc2c8')}</g>`) +
    fx('lines', `<g class="draw"><path d="M60 420 H760" stroke="#fff" stroke-width="4" stroke-dasharray="14 10"/><path d="M400 280 V440" stroke="#fff" stroke-width="4" stroke-dasharray="14 10"/></g><g transform="translate(140 400)"><path d="M0 0 q20 -10 40 0 t40 0 t40 0" stroke="#6fc3df" stroke-width="4" fill="none" class="fade-line"/></g>`) +
    fx('fence', fence(40, 380, 440) + wall(430, 380, 340, 60)));
  S.treaty = () => svg(sky() + sun(400, 70, 30) + hills(230, '#9ad08a', '#7fc173') +
    `<ellipse cx="400" cy="340" rx="300" ry="90" fill="url(#wat)"/><ellipse cx="400" cy="330" rx="280" ry="70" fill="none" stroke="#d9f4ff" stroke-width="3" class="pulse"/>` +
    mangrove(110, 330, .9) + mangrove(690, 330, .9) + reeds(200, 300, 6) + reeds(580, 300, 6) +
    fx('glow', `<circle cx="400" cy="330" r="260" fill="url(#glow)" class="pulse"/><path d="M400 300 c-30 -40 -80 0 0 50 c80 -50 30 -90 0 -50z" fill="#ff6b8a" class="beat"/>`) +
    fx('animals', `<g class="pop-ring">${fish(300, 350, 1, '#f39c42', 30)}${fish(470, 360, 1, '#ffd34d', 30, 10, true)}<g style="animation-delay:.2s">${frog(230, 300, 1)}</g><g style="animation-delay:.4s">${crab(560, 300, 1)}</g><g style="animation-delay:.6s">${clam(360, 410)}${clam(440, 412)}</g><g style="animation-delay:.8s">${heron(640, 280, .8)}</g>${bird(300, 160, 1, 16, 1)}${butterfly(500, 200, '#ff8a3d', 1)}${butterfly(260, 220, '#a56cf0', 2)}${dragonfly(560, 180, 2)}</g>`) +
    fx('scroll', `<g class="unroll" transform="translate(400 160)"><rect x="-150" y="-60" width="300" height="120" rx="10" fill="#fdf3d7" stroke="#c9a96b" stroke-width="4"/><circle cx="-150" cy="0" r="14" fill="#c9a96b"/><circle cx="150" cy="0" r="14" fill="#c9a96b"/><text x="0" y="-18" text-anchor="middle" font-size="22" font-weight="800" fill="#7a5a2a">💧 ജലഉടമ്പടി 💧</text><text x="0" y="22" text-anchor="middle" font-size="26">🐟🐸🦀🐦🦋🌿👨‍🌾</text></g>`));
  S.buried = () => svg(sky('Dusk') + `<rect y="190" width="800" height="260" fill="#8a6a4a"/><rect y="190" width="800" height="30" fill="#6f553b"/>` +
    building(500, 200, 100, 140, '#c4c9ce') + pillars(120, 200, 5) + fence(620, 790, 200) +
    P.din(330, 200, .9, 'sad', 'breathe') +
    fx('xray', `<g class="xray"><rect x="40" y="250" width="720" height="180" rx="60" fill="url(#wat)" opacity=".75"/>${fish(150, 330, 1, '#ffe08a', 18)}${fish(400, 360, 1.1, '#ffd0a0', 22, 6, true)}${fish(600, 310, .9, '#ffe08a', 16, 3)}${mangrove(120, 420, .6)}${mangrove(680, 420, .6)}${frog(500, 410, .8)}${clam(300, 420)}<text x="400" y="290" text-anchor="middle" font-size="22" fill="#fff" font-weight="800" opacity=".85">… the great wetland sleeps below …</text></g>`) +
    fx('sad', `<g transform="translate(330 70)"><ellipse rx="60" ry="22" fill="#8c95a0"/>${[-30, 0, 30].map((d, i) => `<path d="M${d} 24 l-4 16" stroke="#6fa3c7" stroke-width="3" class="drip" style="animation-delay:${i * .3}s"/>`).join('')}</g>`));
  S.mangroves = () => svg(sky() + cloud(150, 60, .9, 80) + hills(200, '#8fc77d', '#79b56b') + water(300, 'watG') +
    mangrove(470, 300, 1.4, 'sway', true) + mangrove(560, 290, 1.6, 'sway', true) + mangrove(660, 300, 1.3, 'sway', true) + mangrove(760, 310, 1.2, 'sway', true) +
    `<g class="km-far">${P.km(560, 318, .45, 'sit')}</g>` +
    `<rect y="330" width="420" height="120" fill="#7c9a52"/>` + reeds(30, 360, 8, '#5e8a35') + reeds(360, 350, 7, '#5e8a35') +
    `<g class="walk-in">${P.dev(220, 430, 1, 'run')}</g><g class="walk-in late">${P.din(120, 440, 1.05, 'run')}</g>` +
    fx('spot', `<circle cx="560" cy="290" r="44" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="8 6" class="spin-slow"/>`) + bird(300, 120, .8, 20, 6));
  S.tide = () => svg(sky('Dusk') + sun(620, 160, 44) + `<g class="mound"><ellipse cx="400" cy="370" rx="190" ry="44" fill="${C.mud}"/><ellipse cx="400" cy="362" rx="170" ry="30" fill="#a98563"/></g>` +
    P.din(400, 362, 1, 'sit') + mangrove(90, 330, 1.1) + mangrove(720, 330, 1.2) +
    `<g class="tidewater">${water(372, 'wat')}${fish(200, 420, .9, '#f39c42', 12)}${fish(560, 430, .8, '#ffd34d', 15, 4, true)}</g>` +
    fx('ripple', [0, 1, 2].map(i => `<ellipse cx="400" cy="376" rx="40" ry="8" fill="none" stroke="#fff" stroke-width="3" class="ripple" style="animation-delay:${i * .8}s"/>`).join('') + `<text x="560" y="300" font-size="30" font-weight="800" fill="#fff" class="float-txt">ഗ്ള്.. ഗ്ള്..</text>`) +
    fx('under', `<g class="bubbles-up">${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${380 + (i % 3) * 18}" cy="300" r="${4 + i % 3 * 2}" fill="none" stroke="#fff" stroke-width="2" style="animation-delay:${i * .4}s"/>`).join('')}</g>`), 'scene-tide');
  S.km = () => svg(`<rect width="800" height="450" fill="#3a2a5a"/>${stars()}` +
    `<path d="M40 210 L760 210 L700 330 L100 330Z" fill="${C.dry}"/>${Array.from({ length: 16 }, (_, i) => `<path d="M${80 + i * 42} ${215 + (i % 3) * 30} l${(i % 2 ? 1 : -1) * 18} 24 l10 22" stroke="${C.crack}" stroke-width="3" fill="none"/>`).join('')}` +
    `<path d="M100 330 L700 330 L400 450Z" fill="#2f8a6e" opacity=".9"/>${mangrove(220, 400, .7, 'sway', true)}${mangrove(580, 400, .7, 'sway', true)}${fish(330, 400, .7, '#cfe8d0', 14)}${fish(460, 420, .6, '#cfe8d0', 18, 3, true)}` +
    `<path d="M150 230 q-10 -40 10 -70 M150 200 l-14 -12 M156 186 l12 -10" stroke="#7a5a3a" stroke-width="3" fill="none"/><g transform="translate(200 268)"><path d="M0 0 h26 M6 0 l-6 -6 M12 0 l-4 -6 M18 0 l-2 -6 M6 0 l-6 6 M12 0 l-4 6 M18 0 l-2 6" stroke="#eee" stroke-width="2"/><circle cx="30" cy="0" r="5" fill="#eee"/></g>` +
    `<rect x="560" y="226" width="16" height="44" fill="#e8c34a"/><rect x="560" y="226" width="16" height="10" fill="#333"/><g transform="translate(610 240)">${[0, 1, 2, 3, 4].map(i => `<circle cx="${i * 14}" cy="0" r="8" fill="none" stroke="#888" stroke-width="2"/>`).join('')}</g>` +
    `<ellipse cx="400" cy="268" rx="150" ry="40" fill="url(#watG)"/>` +
    `<g class="shiver-g">${P.km(400, 300, 1.15, 'sit')}</g><ellipse cx="400" cy="282" rx="132" ry="24" fill="#5cc2a8" opacity=".85"/>` +
    [0, 1].map(i => `<ellipse cx="400" cy="270" rx="60" ry="10" fill="none" stroke="#dff" stroke-width="2" class="ripple" style="animation-delay:${i * 1.2}s"/>`).join('') +
    fx('karthyani', `<g class="fade-in">${P.kar(250, 290, .9, 'sit')}</g>`) +
    fx('devakiin', `<g class="climb">${P.dev(640, 300, .9, 'stand')}</g>`) +
    fx('boat', `<g transform="translate(400 120)" class="bob"><path d="M-60 0 Q0 26 60 0 L52 -7 H-52Z" fill="#7a4b2a"/><text x="0" y="-24" font-size="20" fill="#fff" text-anchor="middle" font-weight="700">🛶 ?</text></g>`) +
    fx('close', `<circle cx="400" cy="240" r="120" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 8" class="spin-slow"/>`), 'scene-km');
  S.walls = () => svg(sky('Grey') + water(300, 'wat', 'tidewater-hi') + granite(430, 170, 370, 160) + `<rect x="430" y="140" width="370" height="30" fill="#5d6268"/>` +
    `<rect y="330" width="430" height="120" fill="#7c9a52"/>` + mangrove(80, 330, 1, 'sway', true) + mangrove(200, 340, .8, 'sway', true) +
    P.km(300, 400, 1, 'sit') + `<ellipse cx="300" cy="396" rx="70" ry="16" fill="url(#watG)"/>` + P.din(140, 440, 1.05, 'stand') + P.kar(380, 440, .85, 'stand') +
    fx('point', `<g transform="translate(330 300)"><path d="M0 0 L70 -40" stroke="${C.skinK}" stroke-width="7" stroke-linecap="round" class="pointarm"/><path d="M90 -50 l60 -30" stroke="#fff" stroke-width="3" stroke-dasharray="6 6"/></g>`) +
    fx('crash', `<g class="splash">${[0, 1, 2, 3, 4].map(i => `<path d="M${430} ${220 + i * 22} q-40 -20 -60 ${-10 + i * 6} q30 0 60 10z" fill="#e6f7ff" opacity=".9" style="animation-delay:${i * .2}s"/>`).join('')}</g><text x="300" y="120" font-size="34" font-weight="900" fill="#fff" class="float-txt">😢 💧</text>`), 'scene-walls');

  /* ---------- declarative scenes for the other lessons (see tools/LESSON_SPEC.md) ---------- */
  const ROLE = {
    man: { skin: C.skinD, top: C.blue, bottom: C.mundu },
    woman: { skin: C.skinV, top: C.green, bottom: C.green, bun: true },
    boy: { skin: '#8f5d3c', top: '#e85a5a', bottom: '#2d4a7a', kid: true },
    girl: { skin: '#8a5838', top: '#ff7eb6', bottom: '#ff7eb6', pigtails: true, kid: true },
    oldman: { skin: C.skinK, top: C.white, bottom: C.mundu, grey: true },
    oldwoman: { skin: C.skinK, top: C.white, bottom: C.white, grey: true, bun: true },
    gandhi: { skin: '#9a6a4a', top: '#f4efe2', bottom: '#f4efe2', bald: true, glasses: true, grey: true },
    teacher: { skin: C.skinA, top: C.purple, bottom: C.purple, bun: true, glasses: true },
    cook: { skin: C.skinD, top: '#ffffff', bottom: '#d9d2c0', cap: '#ffffff' },
    pilot: { skin: '#e0b48c', top: '#7a5230', bottom: '#4a3a2a', cap: '#5a3a1a' },
    farmer: { skin: '#7d4e30', top: '#e8b04a', bottom: C.mundu, cap: '#c9a24a' }
  };
  const BGK = { day: 'Day', dusk: 'Dusk', night: 'Night', dawn: 'Dusk', grey: 'Grey', sky: 'Day' };
  function backdrop(bg, ground) {
    let o = '';
    if (bg === 'indoor' || bg === 'kitchen' || bg === 'classroom') {
      const wallC = bg === 'kitchen' ? '#f6e3c2' : bg === 'classroom' ? '#fdf1d6' : '#f3dcc0';
      o += `<rect width="800" height="450" fill="${wallC}"/><rect x="520" y="60" width="150" height="120" fill="#9fd4f0" stroke="#8a5a35" stroke-width="10"/><path d="M595 60 v120 M520 120 h150" stroke="#8a5a35" stroke-width="6"/>`;
      if (bg === 'kitchen') o += `<rect x="60" y="150" width="300" height="12" fill="#8a5a35"/>${['#c0392b', '#e1a84a', '#7d5c3f', '#2e8b57'].map((c, i) => `<rect x="${80 + i * 70}" y="${110 + (i % 2) * 6}" width="40" height="${40 - (i % 2) * 6}" rx="6" fill="${c}"/>`).join('')}${Array.from({ length: 20 }, (_, i) => `<rect x="${(i % 10) * 80}" y="${250 + Math.floor(i / 10) * 40}" width="78" height="38" fill="${i % 2 ? '#e9d9bd' : '#f2e6cf'}"/>`).join('')}`;
      if (bg === 'classroom') o += `<rect x="0" y="300" width="800" height="12" fill="#c49a6c"/>`;
      if (ground === 'none' || ground === 'grass') ground = 'floor';
    } else {
      o += sky(BGK[bg] || 'Day');
      if (bg === 'night') o += stars();
    }
    const G = 330;
    switch (ground) {
      case 'grass': o += hills(240) + `<rect y="${G}" width="800" height="${450 - G}" fill="#79bf63"/>`; break;
      case 'field': o += hills(220, '#9fd08e', '#87c27a') + `<rect y="${G - 20}" width="800" height="${470 - G}" fill="#7fbf5a"/>${Array.from({ length: 4 }, (_, i) => `<path d="M0 ${G + i * 34} Q400 ${G - 12 + i * 34} 800 ${G + 2 + i * 34}" stroke="#a7834f" stroke-width="8" fill="none"/>`).join('')}<g class="paddy">${Array.from({ length: 36 }, (_, i) => `<path d="M${(i * 47) % 800} ${G + 20 + (i % 4) * 30} q3 -16 0 -26 M${(i * 47) % 800 + 6} ${G + 20 + (i % 4) * 30} q-3 -14 2 -22" stroke="#4e9a35" stroke-width="2.5" fill="none"/>`).join('')}</g>`; break;
      case 'water': o += hills(250, '#9ad08a', '#7fc173') + water(G - 30); break;
      case 'river': o += hills(230) + `<rect y="${G - 20}" width="800" height="${470 - G}" fill="#79bf63"/>` + `<path d="M0 ${G + 40} Q300 ${G + 10} 500 ${G + 50} T800 ${G + 30} V${G + 90} Q500 ${G + 110} 300 ${G + 80} T0 ${G + 100}Z" fill="url(#wat)"/>`; break;
      case 'road': o += hills(240) + `<rect y="${G}" width="800" height="${450 - G}" fill="#79bf63"/><rect y="${G + 40}" width="800" height="60" fill="#6b6f75"/><path d="M0 ${G + 70} H800" stroke="#fff" stroke-width="4" stroke-dasharray="30 24"/>`; break;
      case 'floor': o += `<rect y="${G}" width="800" height="${450 - G}" fill="#b98a5a"/>${Array.from({ length: 5 }, (_, i) => `<path d="M0 ${G + i * 26} H800" stroke="#a0744a" stroke-width="2"/>`).join('')}`; break;
      case 'soil': o += hills(240, '#a5d68f', '#8cc77a') + `<rect y="${G}" width="800" height="${450 - G}" fill="${C.soil}"/>${Array.from({ length: 4 }, (_, i) => `<path d="M0 ${G + 14 + i * 28} H800" stroke="#9a6a42" stroke-width="3"/>`).join('')}`; break;
      case 'dry': o += `<rect y="${G - 10}" width="800" height="${460 - G}" fill="${C.dry}"/>${Array.from({ length: 14 }, (_, i) => `<path d="M${30 + i * 56} ${G + 10 + (i % 3) * 30} l${(i % 2 ? 1 : -1) * 18} 24 l10 22" stroke="${C.crack}" stroke-width="3" fill="none"/>`).join('')}`; break;
      case 'beach': o += water(G - 70) + `<path d="M0 ${G} Q400 ${G - 30} 800 ${G} V450 H0Z" fill="#f2d79a"/>`; break;
      case 'city': o += ['#b9c1c9', '#a3adb8', '#c7ccd2', '#9ea8b3', '#b0b8c1', '#c2c8cf'].map((c, i) => building(i * 135 + 5, G, 110, 120 + (i * 53) % 140, c)).join('') + `<rect y="${G}" width="800" height="${450 - G}" fill="#6b6f75"/><path d="M0 ${G + 60} H800" stroke="#fff" stroke-width="4" stroke-dasharray="30 24"/>`; break;
      default: break;
    }
    return o;
  }
  const tree = (x, y, s = 1, c1 = C.leaf1, c2 = C.leaf2, dots) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="sway"><path d="M-8 0 L-5 -90 L5 -90 L8 0Z" fill="#7a5230"/><circle cx="0" cy="-120" r="50" fill="${c1}"/><circle cx="-34" cy="-96" r="34" fill="${c2}"/><circle cx="34" cy="-98" r="34" fill="${c2}"/><circle cx="0" cy="-150" r="32" fill="${c2}"/>${dots ? Array.from({ length: 14 }, (_, i) => `<circle cx="${Math.round(Math.cos(i * 2.4) * (20 + (i % 3) * 14))}" cy="${-118 + Math.round(Math.sin(i * 2.4) * (18 + (i % 4) * 9))}" r="5" fill="${dots}"/>`).join('') : ''}</g></g>`;
  const palm = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="sway"><path d="M0 0 q-14 -90 6 -190" stroke="#7a5a35" stroke-width="10" fill="none"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M6 -190 q${-80 + i * 32} ${-30 + Math.abs(i - 2.5) * 14} ${-110 + i * 44} ${20 + Math.abs(i - 2.5) * 12}" stroke="#3f9a3f" stroke-width="8" fill="none"/>`).join('')}<circle cx="2" cy="-182" r="7" fill="#8a6a2a"/><circle cx="12" cy="-180" r="7" fill="#8a6a2a"/></g></g>`;
  const bush = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="-20" cy="-18" r="22" fill="${C.leaf1}"/><circle cx="12" cy="-24" r="26" fill="${C.leaf2}"/><circle cx="36" cy="-14" r="18" fill="${C.leaf1}"/></g>`;
  const flower = (x, y, s = 1, c = '#ff6b8a') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 q-4 -20 0 -40" stroke="#3d9a3d" stroke-width="3" fill="none"/><path d="M0 -20 q-12 -2 -14 -12 q10 0 14 10" fill="#5cc25c"/><g transform="translate(0 -46)">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-9" rx="6" ry="10" fill="${c}" transform="rotate(${a})"/>`).join('')}<circle r="5" fill="#ffd34d"/></g></g>`;
  const moon = (x, y) => `<g transform="translate(${x} ${y})"><circle r="60" fill="url(#glow)"/><circle r="28" fill="#fff6c9"/><circle cx="10" cy="-6" r="24" fill="#2a2a5c" opacity=".9"/></g>`;
  const rain = () => `<g>${Array.from({ length: 40 }, (_, i) => `<path d="M${(i * 41) % 800} ${(i * 29) % 300} l-6 18" stroke="#9cc9e8" stroke-width="2.5" class="drip" style="animation-delay:-${(i % 7) * .14}s;animation-duration:.8s"/>`).join('')}</g>`;
  const plane = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-90" y="-36" width="180" height="8" rx="3" fill="#e8dcc0" stroke="#8a6a3a"/><rect x="-90" y="0" width="180" height="8" rx="3" fill="#e8dcc0" stroke="#8a6a3a"/>${[-70, -30, 30, 70].map(d => `<path d="M${d} -28 V0" stroke="#7a5a35" stroke-width="3"/>`).join('')}<path d="M-20 4 H60" stroke="#7a5a35" stroke-width="4"/><path d="M90 -14 h30 M110 -24 v24" stroke="#7a5a35" stroke-width="5"/><g class="prop" style="transform-origin:-96px -14px"><path d="M-96 -34 V6" stroke="#5a3a1a" stroke-width="5"/></g><path d="M-10 -6 l10 -8 l10 8" stroke="#3a2a1a" stroke-width="3" fill="none"/></g>`;
  const stove = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-70" y="-50" width="140" height="50" rx="8" fill="#a5522c"/><rect x="-26" y="-36" width="52" height="36" rx="18" fill="#3a1a0a"/><g class="flame"><path d="M-18 0 q6 -30 12 -6 q6 -26 12 -2 q6 -24 12 8z" fill="#ff9a2e"/><path d="M-8 0 q4 -16 8 -2 q4 -14 8 2z" fill="#ffd34d"/></g></g>`;
  const fire = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-30 0 l60 -10 M-30 -10 l60 10" stroke="#6a3a1a" stroke-width="8"/><g class="flame"><path d="M-24 -4 q8 -50 22 -18 q6 -40 20 -4 q8 -30 6 22z" fill="#ff7a1a"/><path d="M-12 -4 q6 -28 12 -6 q6 -20 10 6z" fill="#ffd34d"/></g></g>`;
  const torch = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-110" r="50" fill="url(#glow)"/><path d="M0 0 L-4 -90 L4 -90Z" fill="#7a5230"/><rect x="-9" y="-96" width="18" height="12" fill="#5a3a1a"/><g class="flame"><path d="M-12 -96 q4 -40 12 -24 q4 -30 14 0 q0 14 -26 24z" fill="#ff8a1a"/><path d="M-5 -98 q3 -18 6 -10 q4 -12 6 6z" fill="#ffe27a"/></g></g>`;
  const table = (x, y, w = 200) => `<g><rect x="${x - w / 2}" y="${y - 70}" width="${w}" height="12" rx="4" fill="#9a6a3a"/><rect x="${x - w / 2 + 10}" y="${y - 58}" width="10" height="58" fill="#7a4a2a"/><rect x="${x + w / 2 - 20}" y="${y - 58}" width="10" height="58" fill="#7a4a2a"/></g>`;
  const book = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -6 Q-30 -20 -60 -10 V30 Q-30 20 0 34Z" fill="#fff" stroke="#c94b4b" stroke-width="4"/><path d="M0 -6 Q30 -20 60 -10 V30 Q30 20 0 34Z" fill="#fff" stroke="#c94b4b" stroke-width="4"/>${[0, 1, 2].map(i => `<path d="M-50 ${2 + i * 8} q20 -6 40 0 M10 ${2 + i * 8} q20 -6 40 0" stroke="#9aa" stroke-width="2" fill="none"/>`).join('')}</g>`;
  const blackboard = (x, y, t = '') => `<g transform="translate(${x} ${y})"><rect x="-150" y="-100" width="300" height="160" rx="6" fill="#2f4f3a" stroke="#8a5a35" stroke-width="10"/><text x="0" y="-10" text-anchor="middle" font-size="34" fill="#f4f4e8" font-weight="700">${esc(t)}</text><rect x="-40" y="56" width="80" height="6" fill="#ddd"/></g>`;
  const marbles = (x, y) => `<g transform="translate(${x} ${y})">${['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22'].map((c, i) => `<g class="roll" style="animation-delay:-${i * .5}s"><circle cx="${(i % 3) * 26 - 26}" cy="${-8 - Math.floor(i / 3) * 22}" r="10" fill="${c}"/><circle cx="${(i % 3) * 26 - 29}" cy="${-11 - Math.floor(i / 3) * 22}" r="3" fill="#fff" opacity=".7"/></g>`).join('')}<circle cx="0" cy="10" r="18" fill="none" stroke="#7a5a35" stroke-width="2" stroke-dasharray="4 4"/></g>`;
  const car = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-70 -20 h140 v-20 q-10 -6 -30 -6 l-20 -24 h-50 l-20 24 h-20z" fill="#e74c3c"/><rect x="-36" y="-64" width="30" height="20" fill="#bfe6ff"/><rect x="2" y="-64" width="30" height="20" fill="#bfe6ff"/><circle cx="-40" cy="-16" r="14" fill="#333"/><circle cx="40" cy="-16" r="14" fill="#333"/></g>`;
  const hut = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-70" y="-70" width="140" height="70" fill="#d9b98a"/><path d="M-95 -66 L0 -140 L95 -66Z" fill="#c9a24a"/>${Array.from({ length: 8 }, (_, i) => `<path d="M${-85 + i * 24} -70 l14 -20" stroke="#a5822f" stroke-width="2"/>`).join('')}<rect x="-16" y="-48" width="32" height="48" fill="#6a4a2a"/></g>`;
  const school = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-160" y="-110" width="320" height="110" fill="#f6e1a8"/><path d="M-180 -106 L0 -170 L180 -106Z" fill="#c0563a"/>${[-120, -60, 60, 120].map(d => `<rect x="${d - 18}" y="-84" width="36" height="34" fill="#7fb3d5"/>`).join('')}<rect x="-22" y="-70" width="44" height="70" fill="#7a4b2a"/><rect x="-60" y="-150" width="120" height="26" rx="6" fill="#fff"/><text x="0" y="-131" text-anchor="middle" font-size="18" font-weight="800" fill="#c0563a">വിദ്യാലയം</text><path d="M150 -110 v-80" stroke="#666" stroke-width="3"/><path d="M150 -190 h34 v20 h-34" fill="#ff9933"/></g>`;
  const esc = t => String(t).replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
  function item(it) {
    let opt = {};
    if (it.length && it[it.length - 1] && typeof it[it.length - 1] === 'object' && !Array.isArray(it[it.length - 1])) { opt = it[it.length - 1]; it = it.slice(0, -1); }
    const [k, a, b, c, d, e, f] = it;
    let g = '';
    switch (k) {
      case 'e': g = `<text x="${b}" y="${c}" font-size="${d || 48}" text-anchor="middle">${esc(a)}</text>`; break;
      case 'p': { const R = ROLE[a] || ROLE.man; g = personSVG(Object.assign({}, R, { x: b, y: c, s: (d || 1) * (R.kid ? .8 : 1), pose: e || 'stand', flip: !!f })); break; }
      case 'text': g = `<text x="${b}" y="${c}" font-size="${d || 30}" text-anchor="middle" font-weight="800" fill="${e || '#fff'}" stroke="rgba(0,0,0,.35)" stroke-width="1">${esc(a)}</text>`; break;
      case 'house': g = house(a, b, (c || 1) * .8); break;
      case 'hut': g = hut(a, b, c || 1); break;
      case 'school': g = school(a, b, c || 1); break;
      case 'building': g = building(a, b, c || 80, d || 150, '#c4c9ce'); break;
      case 'tree': g = tree(a, b, c || 1); break;
      case 'palm': g = palm(a, b, c || 1); break;
      case 'mangrove': g = mangrove(a, b, c || 1); break;
      case 'bush': g = bush(a, b, c || 1); break;
      case 'flowertree': g = tree(a, b, c || 1, '#3f8a3f', '#5aa64a', d || '#f6d365'); break;
      case 'flower': g = flower(a, b, c || 1, d || '#ff6b8a'); break;
      case 'sun': g = sun(a ?? 680, b ?? 80); break;
      case 'moon': g = moon(a ?? 680, b ?? 80); break;
      case 'cloud': g = cloud(a ?? 200, b ?? 80, c || 1, 70); break;
      case 'stars': g = stars(); break;
      case 'rain': g = rain(); break;
      case 'birds': g = bird(200, 110, 1, 20, 2) + bird(320, 140, .7, 24, 9) + bird(120, 160, .8, 22, 15); break;
      case 'butterflies': g = butterfly(220, 230, '#ff8a3d', 1) + butterfly(560, 200, '#a56cf0', 3) + butterfly(420, 260, '#ffdd55', 5); break;
      case 'fish': g = fish(a, b, c || 1, '#f39c42', 14, (a || 0) % 9); break;
      case 'boat': g = boat(a, b, c || 1, false); break;
      case 'plane': g = plane(a, b, c || 1); break;
      case 'stove': g = stove(a, b, c || 1); break;
      case 'pot': g = pot(a, b, c || 1); break;
      case 'fire': g = fire(a, b, c || 1); break;
      case 'torch': g = torch(a, b, c || 1); break;
      case 'table': g = table(a, b, c || 200); break;
      case 'book': g = book(a, b, c || 1); break;
      case 'blackboard': g = blackboard(a, b, c || ''); break;
      case 'marbles': g = marbles(a, b); break;
      case 'car': g = car(a, b, c || 1); break;
      case 'fence': g = fence(a, b, c); break;
      case 'wall': g = wall(a, b, c, d); break;
      case 'glow': g = `<circle cx="${a}" cy="${b}" r="${c || 120}" fill="url(#glow)" class="pulse"/>`; break;
      default: g = '';
    }
    return opt.anim ? `<g class="ca ca-${opt.anim}" style="animation-delay:-${opt.delay || 0}s">${g}</g>` : g;
  }
  function compose(spec) {
    const items = (spec.items || []).map(item).join('');
    const fxs = Object.entries(spec.fx || {}).map(([n, its]) => fx(n, its.map(item).join(''))).join('');
    return svg(backdrop(spec.bg || 'day', spec.ground || 'grass') + items + fxs);
  }

  return { scene: k => (k && typeof k === 'object') ? compose(k) : (S[k] || S.wetland)() };
})();

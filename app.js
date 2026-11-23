/* ആതി — Malayalam learning journey through the Class 6 book. Progress: SQLite via server.py (+ browser cache). */
'use strict';
const KEY = 'aathi15v1';
const FRESH = () => ({v:2,name:'',start:null,pin:'',xp:0,cur:null,lp:{},srs:{},log:[],settings:{en:true}});
const FRESH_LP = () => ({days:{},tests:{},extra:{},override:{},writing:{},ratings:{},story:{}});
const AATHI='u3-l3-aathi';
const LESSON_KEYS=['WORDS','TEST_VOCAB','COMP','SENT','BUILD','ESSAY_POINTS','ESSAY_EN','SIM_QS','RETELL','INFO','ROBLOX','TASKS','WRITE','DAYS','DELAYED','STORY'];
let LID=null, LP=FRESH_LP(), LESSON=null;
const AATHI_STORY=window.STORY;   // story-data.js (built-in lesson) is loaded before this file
/* old single-lesson saves (v1) become the Aathi lesson */
function migrate(o){
  if(!o||o.v>=2) return o;
  const lp={}; ['days','tests','extra','override','writing','ratings','story'].forEach(k=>{ lp[k]=o[k]||{}; delete o[k]; });
  o.lp={[AATHI]:lp}; o.cur=AATHI; o.v=2; (o.log||[]).forEach(l=>{ if(!l.lid)l.lid=AATHI; });
  return o;
}
function catalog(){ return (window.CATALOG&&CATALOG.length)?CATALOG:[{id:AATHI,unit:3,order:3,title:'ഒരു സ്വപ്നമുണ്ടായിരുന്നു...',titleEn:'There Was a Dream (from Aathi)',icon:'🌊',days:15,builtin:true}]; }
const loading={};
function loadLesson(id){
  if(window.LESSONS&&LESSONS[id]) return Promise.resolve(LESSONS[id]);
  return loading[id]=loading[id]||new Promise((ok,bad)=>{ const sc=document.createElement('script'); sc.src=`lessons/${id}/data.js`; sc.onload=()=>LESSONS[id]?ok(LESSONS[id]):bad(new Error('no data')); sc.onerror=()=>{ delete loading[id]; bad(new Error('cannot load '+id)); }; document.head.append(sc); });
}
async function useLesson(id){
  let L; try{ L=await loadLesson(id); }catch(e){ id=AATHI; L=LESSONS[AATHI]; }
  if(id===AATHI) L.STORY=AATHI_STORY;
  LESSON_KEYS.forEach(k=>{ window[k]=L[k]!==undefined?L[k]:(k==='DAYS'||k==='WORDS'||k==='COMP'||k==='SENT'||k==='BUILD'||k==='ESSAY_POINTS'||k==='ESSAY_EN'||k==='SIM_QS'?[]:k==='DELAYED'?null:{}); });
  LESSON=L; LID=id; S.cur=id;
  S.lp[id]=Object.assign(FRESH_LP(),S.lp[id]||{}); LP=S.lp[id];
  return L;
}
async function switchLesson(id){ await useLesson(id); save(); go({name:'home'}); }
const isAathi=()=>LID===AATHI;
const NDAYS=()=>DAYS.length;
function lessonStats(id){ const lp=S.lp[id]; const c=catalog().find(x=>x.id===id)||{}; const tot=c.days||0; const done=lp?Object.values(lp.days||{}).filter(d=>d&&d.done).length:0; return {done:Math.min(done,tot),tot,started:!!lp&&Object.keys(lp.days||{}).length>0,fin:lp&&lp.tests&&lp.tests.final}; }
/* Progress is saved to the SQLite server (server.py) and cached in this browser.
   Opened as a plain file (no server) it falls back to browser-only storage. */
const API = /^https?:$/.test(location.protocol) ? 'api' : null;
let S = load();
const sync = {ok:null,t:null};
function load(){ try{ const o=migrate(JSON.parse(localStorage.getItem(KEY))); return o&&o.v?Object.assign(FRESH(),o):FRESH(); }catch(e){ return FRESH(); } }
function cache(){ try{ localStorage.setItem(KEY,JSON.stringify(S)); }catch(e){} }
function save(){ S.savedAt=Date.now(); cache(); if(API){ clearTimeout(sync.t); sync.t=setTimeout(pushState,400); } }
async function pushState(){
  clearTimeout(sync.t); sync.t=null;
  try{ const r=await fetch(API+'/state',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(S)}); setSync(r.ok); }
  catch(e){ setSync(false); sync.t=setTimeout(pushState,8000); }
}
function setSync(ok){ sync.ok=ok; const d=document.querySelector('.sync'); if(d){ d.className='sync '+(ok?'ok':'bad'); d.title=ok?'Saved on the computer (SQLite)':'Not saved to the computer yet - is server.py running?'; } }
async function boot(){
  if(API){
    try{
      const j=await (await fetch(API+'/state',{cache:'no-store'})).json();
      const srv=j.state&&j.state.v?j.state:null;
      if(srv&&(!S.savedAt||(srv.savedAt||0)>=S.savedAt)){ S=Object.assign(FRESH(),migrate(srv)); cache(); }
      else if(S.start) await pushState();      // first run with the server: move browser progress into SQLite
      setSync(true);
    }catch(e){ setSync(false); }
  }
  await useLesson(S.cur||(S.start?AATHI:(catalog()[0]||{}).id||AATHI));
  render();
}
window.addEventListener('pagehide',()=>{ if(API&&sync.t){ clearTimeout(sync.t); navigator.sendBeacon(API+'/state',new Blob([JSON.stringify(S)],{type:'application/json'})); } });

/* ---------- helpers ---------- */
/* Make Element.append accept arrays, null and false (skipped) and plain text. */
(function(){ const o=Element.prototype.append;
  Element.prototype.append=function(...k){ o.apply(this,k.flat(3).filter(c=>c!=null&&c!==false).map(c=>(c&&c.nodeType)?c:String(c))); }; })();
const $ = (s,el=document)=>el.querySelector(s);
function h(tag,a,...kids){
  const e=document.createElement(tag);
  for(const k in (a||{})){ const v=a[k];
    if(k==='class')e.className=v; else if(k==='html')e.innerHTML=v;
    else if(k.startsWith('on'))e.addEventListener(k.slice(2),v);
    else if(v!==false&&v!=null)e.setAttribute(k,v===true?'':v); }
  for(const c of kids.flat(3)){ if(c==null||c===false)continue; e.append(c.nodeType?c:document.createTextNode(String(c))); }
  return e;
}
const shuffle = a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const pad=n=>String(n).padStart(2,'0');
const ymd=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const today=()=>ymd(new Date());
const parseD=s=>{ const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d); };
const diffDays=(a,b)=>Math.round((parseD(a)-parseD(b))/864e5);
const addDays=(s,n)=>{ const d=parseD(s); d.setDate(d.getDate()+n); return ymd(d); };
const wordById=id=>WORDS.find(w=>w.id===id);
let timers=[];
function clearTimers(){ timers.forEach(t=>{clearInterval(t);clearTimeout(t);}); timers=[]; }

/* sound + speech + confetti */
let actx=null;
function beep(ok){ try{ actx=actx||new (window.AudioContext||window.webkitAudioContext)(); const notes=ok?[660,880]:[250,190]; notes.forEach((f,i)=>{ const o=actx.createOscillator(),g=actx.createGain(); o.type=ok?'triangle':'sawtooth'; o.connect(g);g.connect(actx.destination); o.frequency.value=f; const t=actx.currentTime+i*.1; g.gain.setValueAtTime(.001,t); g.gain.linearRampToValueAtTime(.07,t+.02); g.gain.exponentialRampToValueAtTime(.001,t+.16); o.start(t); o.stop(t+.18); }); }catch(e){} }
function say(t){ try{ if(!('speechSynthesis' in window))return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='ml-IN'; u.rate=.85; const v=speechSynthesis.getVoices().find(v=>/^ml/i.test(v.lang)); if(v)u.voice=v; speechSynthesis.speak(u);}catch(e){} }
const speakBtn=t=>h('button',{class:'btn sec sm',title:'Listen','aria-label':'Listen',onclick:e=>{e.stopPropagation();say(t);}},'🔊');
function confetti(n=26){ const c=h('div',{class:'confetti'}); const em=['🎉','⭐','🌿','💧','🦋','🐟']; const col=['#58cc02','#1cb0f6','#ff9600','#ffc800','#ff4b4b','#a560f0'];
  for(let i=0;i<n;i++){ const sq=i%3!==0; c.append(h('span',{class:sq?'sq':'',style:`left:${Math.random()*100}%;animation-delay:${Math.random()*.8}s;${sq?'background:'+col[i%col.length]:''}`},sq?'':em[i%em.length])); } document.body.append(c); setTimeout(()=>c.remove(),3800); }
const MASCOT_SVG=`<svg viewBox="0 0 100 110"><defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fd6ff"/><stop offset="1" stop-color="#1cb0f6"/></linearGradient></defs>
<ellipse cx="50" cy="104" rx="26" ry="5" fill="rgba(0,0,0,.14)"/>
<path d="M50 6C50 6 14 46 14 68a36 36 0 0 0 72 0C86 46 50 6 50 6Z" fill="url(#mg)" stroke="#1899d6" stroke-width="3"/>
<path d="M28 62c0-10 6-20 12-28" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".55"/>
<g class="eye"><ellipse cx="38" cy="66" rx="7" ry="8.5" fill="#fff"/><circle cx="39.5" cy="67" r="4.2" fill="#17323a"/><circle cx="41" cy="65" r="1.5" fill="#fff"/></g>
<g class="eye"><ellipse cx="62" cy="66" rx="7" ry="8.5" fill="#fff"/><circle cx="63.5" cy="67" r="4.2" fill="#17323a"/><circle cx="65" cy="65" r="1.5" fill="#fff"/></g>
<ellipse cx="29" cy="80" rx="5" ry="3" fill="#ff8fa3" opacity=".7"/><ellipse cx="71" cy="80" rx="5" ry="3" fill="#ff8fa3" opacity=".7"/>
<path class="mouth-s" d="M42 80q8 8 16 0" stroke="#17323a" stroke-width="3" stroke-linecap="round" fill="none"/>
<path class="mouth-o" d="M42 78q8 16 16 0Z" fill="#17323a"/></svg>`;
const mascot=(size,mood)=>h('div',{class:'mascot '+(mood||''),style:size?`width:${size}px;height:${size}px`:'',html:MASCOT_SVG});
function floatXP(el,txt){ const r=(el||document.body).getBoundingClientRect(); const f=h('div',{class:'floatxp',style:`left:${r.left+r.width/2-20}px;top:${r.top}px`},txt); document.body.append(f); setTimeout(()=>f.remove(),1200); }
function bubblesBg(){ if(document.querySelector('.bubbles'))return; const b=h('div',{class:'bubbles'}); for(let i=0;i<14;i++){ const z=14+Math.random()*34; b.append(h('i',{style:`left:${Math.random()*100}%;width:${z}px;height:${z}px;animation-duration:${14+Math.random()*16}s;animation-delay:-${Math.random()*20}s`})); } document.body.prepend(b); }

/* ---------- progress model ---------- */
const dayDef=n=>n===22?DELAYED:DAYS[n-1];
function dayDone(n){ return !!(LP.days[n]&&LP.days[n].done); }
function stepDone(n,i){ return !!(LP.days[n]&&LP.days[n].steps&&LP.days[n].steps[i]); }
function unlocked(n){
  if(!S.start)return false;
  if(LP.override[n]||n===1)return true;
  if(n===22) return isAathi()&&dayDone(15);
  return dayDone(n-1);
}
function currentDay(){ for(let n=1;n<=NDAYS();n++) if(!dayDone(n))return n; return (!isAathi()||dayDone(22))?null:22; }
function levelOf(xp){ let l=LEVELS[0]; LEVELS.forEach(x=>{ if(xp>=x[0])l=x; }); return l[1]; }
function levelIdx(xp){ let k=0; LEVELS.forEach((x,i)=>{ if(xp>=x[0])k=i; }); return k; }
function levelPct(xp){ const k=levelIdx(xp),nx=LEVELS[k+1]; return nx?Math.round((xp-LEVELS[k][0])/(nx[0]-LEVELS[k][0])*100):100; }
function addXP(n){ S.xp+=n; save(); }
function streak(){
  const dates=new Set(S.log.map(l=>l.date)); let d=today(),c=0;
  if(!dates.has(d)) d=addDays(d,-1);
  while(dates.has(d)){ c++; d=addDays(d,-1); }
  return c;
}
function minutesSpent(){ return Math.round(S.log.reduce((a,l)=>a+(l.secs||0),0)/60); }
function completeStep(n,i,t0,extra,redo){
  const xp0=S.xp,lv0=levelIdx(S.xp); let dayFinished=false;
  if(redo){ S.log.push(Object.assign({ts:Date.now(),date:today(),lid:LID,n,step:i,redo:true,secs:Math.min(2400,Math.round((Date.now()-t0)/1000))},extra||{})); addXP(10); save(); return {gain:S.xp-xp0,dayFinished:false,levelUp:levelIdx(S.xp)>lv0,redo:true}; }
  LP.days[n]=LP.days[n]||{steps:{}}; LP.days[n].steps[i]=true;
  S.log.push(Object.assign({ts:Date.now(),date:today(),lid:LID,n,step:i,secs:Math.min(2400,Math.round((Date.now()-t0)/1000))},extra||{}));
  addXP(20);
  const def=dayDef(n);
  if(def.steps.every((_,k)=>LP.days[n].steps[k])){ LP.days[n].done=true; LP.days[n].date=today(); addXP(50); dayFinished=true; }
  save();
  return {gain:S.xp-xp0,dayFinished,levelUp:levelIdx(S.xp)>lv0};
}

const DAY_ICON={1:'🌊',2:'🧩',3:'🃏',4:'🗺️',5:'📖',6:'✏️',7:'❓',8:'🏁',9:'🌍',10:'🛠️',11:'🚜',12:'🎭',13:'✍️',14:'📝',15:'🏆',22:'⭐'};
const CHEERS=['Super!','Awesome!','Fantastic!','Well done!','Brilliant!','You rock!'];
function celebrate(r,after){
  const o=h('div',{class:'celebrate'});
  const xpEl=h('div',{},'0'),big=r.dayFinished;
  o.append(mascot(150,'cheer'),h('h1',{},big?'Day complete! 🎉':r.redo?'Practice done! 💪':CHEERS[Math.floor(Math.random()*CHEERS.length)]),
    h('div',{class:'ml mut'},big?'ദിനം പൂർത്തിയായി!':'മിടുക്കൻ!'),
    h('div',{class:'stats'},h('div',{class:'stat xp'},h('b',{},'XP earned'),xpEl),h('div',{class:'stat fire'},h('b',{},'Streak'),h('div',{},'🔥 '+streak()))),
    r.levelUp?h('div',{class:'lvlup'},'⬆️ Level up! '+levelOf(S.xp)):null,
    h('button',{class:'btn acc',onclick:()=>{ o.remove(); after(); }},'Continue'));
  document.body.append(o); confetti(big||r.levelUp?60:30);
  let t0=null; const dur=900; const step=t=>{ t0=t0||t; const k=Math.min(1,(t-t0)/dur); xpEl.textContent='+'+Math.round(r.gain*k); if(k<1)requestAnimationFrame(step); }; requestAnimationFrame(step);
}

/* ---------- navigation ---------- */
let view={name:'home'};
function go(v){ clearTimers(); if(typeof storyStop==='function')storyStop(); try{speechSynthesis.cancel();}catch(e){} view=v; render(); window.scrollTo(0,0); }
function render(){
  bubblesBg(); document.querySelectorAll('.actionbar,.overlay').forEach(x=>x.remove());
  const app=$('#app'); app.innerHTML='';
  app.append(headerEl());
  let body;
  if(view.name==='home') body=S.start?homeView():welcomeView();
  else if(view.name==='map') body=mapView();
  else if(view.name==='parent') body=parentView();
  else if(view.name==='day') body=dayView(view.n);
  else if(view.name==='step') body=stepView(view.n,view.i);
  else if(view.name==='free') body=freeView();
  else if(view.name==='story') body=storyView();
  else if(view.name==='course') body=courseView();
  app.append(body);
  if(view.name!=='step') app.append(navEl());
}
function headerEl(){
  return h('header',{class:'top'},h('div',{class:'brand'},mascot(38),h('span',{class:'t'},'ആതി'),API?h('span',{class:'sync '+(sync.ok===false?'bad':sync.ok?'ok':''),title:'Save status'}):null),
    S.start?h('div',{class:'chips'},h('span',{class:'chip fire'},h('span',{class:'fl'},'🔥'),streak()),h('span',{class:'chip xp'},'⭐ '+S.xp),h('span',{class:'chip'},levelOf(S.xp))):null);
}
function navEl(){
  const b=(l,ic,v)=>h('button',{class:view.name===v?'on':'',onclick:()=>{ if(v==='parent')askPin(()=>go({name:'parent'})); else go({name:v}); }},h('span',{},ic),l);
  return h('nav',{class:'nav'},b('Learn','🏠','home'),b('Lessons','📚','course'),b('Story','📖','story'),b('Trophies','🏆','map'),b('Parent','👪','parent'));
}
function askPin(cb){
  if(!S.pin) return cb();
  const inp=h('input',{type:'password',inputmode:'numeric',maxlength:'6',placeholder:'Parent PIN'});
  const msg=h('div',{class:'mut'});
  const m=h('div',{style:'position:fixed;inset:0;background:rgba(0,0,0,.5);display:grid;place-items:center;z-index:60'},
    h('div',{class:'card',style:'max-width:320px;width:90%'},h('h3',{},'👪 Parent area'),inp,msg,
      h('div',{class:'row',style:'margin-top:10px'},
        h('button',{class:'btn',onclick:()=>{ if(inp.value===S.pin){m.remove();cb();} else msg.textContent='Wrong PIN'; }},'Open'),
        h('button',{class:'btn sec',onclick:()=>m.remove()},'Cancel'))));
  document.body.append(m); inp.focus();
  inp.addEventListener('keydown',e=>{ if(e.key==='Enter') m.querySelector('.btn').click(); });
}

/* ---------- welcome ---------- */
function welcomeView(){
  const name=h('input',{type:'text',placeholder:"Child's first name",value:'Isaiah'});
  const pin=h('input',{type:'password',inputmode:'numeric',maxlength:'6',placeholder:'Parent PIN (optional, 4-6 digits)'});
  const date=h('input',{type:'date',value:today()});
  return h('div',{class:'card welcome'},mascot(130,'cheer'),
    h('h1',{class:'ml'},'മലയാളം സാഹസികയാത്ര'),h('div',{class:'mut'},'Malayalam adventure · Kerala Padavali Class 6'),
    h('p',{},'Join Thulli the water drop on an adventure through your Malayalam book! Every lesson has stories you can hear, games, and quizzes. Earn ⭐ XP, keep your 🔥 streak and unlock new levels.'),
    h('p',{class:'hint'},'16 lessons in 5 units. Pick any lesson, go at your own pace, and replay anything.'),
    h('div',{class:'row'},name),h('div',{class:'row',style:'margin-top:4px'},pin),
    h('p',{class:'hint'},'Start date of Day 1:'),date,
    h('div',{style:'margin-top:16px'},h('button',{class:'btn big',onclick:()=>{ S.name=name.value.trim(); S.pin=pin.value.trim(); S.start=date.value||today(); save(); go({name:'course'}); }},'Start my adventure 🚀')));
}

/* ---------- home ---------- */
function nodeState(d){ const done=dayDone(d.n),ok=unlocked(d.n); return {done,ok,now:d.n===currentDay()}; }
function pathEl(days,onTap){
  const GAP=112,W=340,xs=[170,235,255,205,130,85,110,175,240,255,205,130,85,110,175,240];
  const pts=days.map((d,i)=>({x:xs[i%xs.length],y:70+i*GAP}));
  const H=pts[pts.length-1].y+90;
  const box=h('div',{class:'path',style:`height:${H}px`});
  const svgNS='http://www.w3.org/2000/svg'; const svg=document.createElementNS(svgNS,'svg'); svg.setAttribute('class','track'); svg.setAttribute('viewBox',`0 0 ${W} ${H}`); svg.setAttribute('preserveAspectRatio','none');
  for(let i=0;i<pts.length-1;i++){ const a=pts[i],b=pts[i+1],my=(a.y+b.y)/2; const pa=document.createElementNS(svgNS,'path'); pa.setAttribute('d',`M${a.x} ${a.y}C${a.x} ${my},${b.x} ${my},${b.x} ${b.y}`); if(dayDone(days[i].n))pa.setAttribute('class','on'); svg.append(pa); }
  box.append(svg);
  days.forEach((d,i)=>{ const st=nodeState(d),p=pts[i]; const big=isAathi()?(d.n===8||d.n===15||d.n===22):d.n===NDAYS();
    const left=(p.x/W*100)+'%';
    if(st.now) box.append(h('div',{class:'start-tag',style:`left:${left};top:${p.y}px`},st.ok?'START':'NEXT'));
    box.append(h('button',{class:'pnode'+(st.done?' done':'')+(st.now&&st.ok?' now':'')+(!st.ok&&!st.done?' lock':'')+(big?' big':''),style:`left:${left};top:${p.y}px`,'aria-label':`Day ${d.n}: ${d.title}`,onclick:()=>onTap(d,st)},
      h('span',{class:'ico'},st.ok||st.done?((isAathi()?DAY_ICON[d.n]:d.icon)||'⭐'):'🔒'),h('span',{class:'num'},d.n===22?'+7':d.n)));
    if(st.now&&st.ok){ const side=p.x>W/2?'left:2%':'right:2%'; box.append(h('div',{class:'sidekick',style:`${side};top:${p.y-35}px`},mascot(70,'cheer'))); }
  });
  return box;
}
function openSheet(n){
  const ov=h('div',{class:'overlay',onclick:e=>{ if(e.target===ov)ov.remove(); }});
  const sh=h('div',{class:'sheet'},h('div',{class:'grab'}));
  const body=dayView(n,true); body.classList.remove('card'); body.style.cssText='border:0;box-shadow:none;padding:0;margin:0;animation:none';
  sh.append(body); ov.append(sh); document.body.append(ov);
}
function courseView(){
  const wrap=h('div'); const cat=catalog();
  wrap.append(h('div',{class:'hero'},mascot(80,'cheer'),h('div',{class:'speech'},'Pick any lesson you like!',h('span',{class:'ml'},'ഇഷ്ടമുള്ള പാഠം തിരഞ്ഞെടുക്കൂ'))));
  const units=[...new Set(cat.map(c=>c.unit))];
  const colors=['#58cc02','#1cb0f6','#ff9600','#a560f0','#ff4b4b'];
  units.forEach((u,ui)=>{
    const ls=cat.filter(c=>c.unit===u); const first=ls[0]||{};
    wrap.append(h('div',{class:'unit-head',style:`--uc:${colors[ui%colors.length]}`},h('small',{},`UNIT ${u}`),h('h2',{class:'ml'},first.unitMl||''),h('div',{},first.unitEn||'')));
    const grid=h('div',{class:'lgrid'});
    ls.forEach(c=>{ const st=lessonStats(c.id); const pct=st.tot?Math.round(st.done/st.tot*100):0; const cur=c.id===LID;
      grid.append(h('button',{class:'lcard'+(cur?' cur':'')+(pct===100?' fin':''),style:`--uc:${colors[ui%colors.length]}`,onclick:()=>switchLesson(c.id)},
        h('div',{class:'lc-ico'},c.icon||'📘'),h('div',{class:'lc-body'},h('b',{class:'ml'},c.title),h('span',{},c.titleEn||''),
          h('small',{},`${c.days} day${c.days>1?'s':''} · ${({easy:'🟢 easy',medium:'🟡 medium',hard:'🔴 harder'})[c.level]||''}${c.pages?' · p. '+c.pages:''}`),
          h('div',{class:'bar',style:'height:10px;margin:6px 0 0'},h('i',{style:`width:${pct}%`}))),
        h('span',{class:'lc-tag'},cur?'NOW':pct===100?'✓':st.started?'GO':'START')));
    });
    wrap.append(grid);
  });
  return wrap;
}
function jumpSheet(n){
  const ov=h('div',{class:'overlay',onclick:e=>{ if(e.target===ov)ov.remove(); }});
  const d=dayDef(n);
  ov.append(h('div',{class:'sheet',style:'text-align:center'},h('div',{class:'grab'}),mascot(80,'cheer'),h('h2',{},`Jump ahead to Day ${n}?`),h('p',{},d.title,h('br'),h('span',{class:'ml mut'},d.ml)),
    h('p',{class:'mut'},'You can skip ahead whenever you feel ready. Earlier days stay open, so you can come back and finish them.'),
    h('button',{class:'btn big',onclick:()=>{ LP.override[n]=true; save(); ov.remove(); render(); openSheet(n); }},'Jump here ⏩'),
    h('div',{style:'height:10px'}),h('button',{class:'btn sec big',onclick:()=>ov.remove()},'Not now')));
  document.body.append(ov);
}
function dayList(){ return DAYS.concat(isAathi()&&DELAYED&&LP.days[15]&&LP.days[15].done?[DELAYED]:[]); }
function mascotLine(n,ok){
  if(n===null)return ['You did it, hero! 🏆','എല്ലാം പൂർത്തിയായി!'];
  if(!ok)return ['Great work! Come back tomorrow 🌙','നാളെ വീണ്ടും കാണാം'];
  const s=LP.days[n]&&Object.keys(LP.days[n].steps||{}).length;
  return s?['Keep going, you are close!','മുന്നോട്ട്!']:['Ready for today\'s mission?','തുടങ്ങാം!'];
}
function homeView(){
  const wrap=h('div'); const n=currentDay(); const doneCount=DAYS.filter(d=>dayDone(d.n)).length;
  const ok=n!==null&&unlocked(n); const [say1,say2]=mascotLine(n,ok);
  wrap.append(h('div',{class:'hero'},mascot(84,ok?'':'cheer'),h('div',{class:'speech'},(S.name?S.name+', ':'')+say1.charAt(0).toLowerCase()+say1.slice(1) ,h('span',{class:'ml'},say2))));
  const k=levelIdx(S.xp),nx=LEVELS[k+1];
  wrap.append(h('div',{class:'card lvl'},h('div',{class:'ico'},LEVELS[k][1].split(' ').pop()),h('div',{class:'grow'},h('div',{},h('b',{},levelOf(S.xp).replace(/\s?\S+$/,'')||levelOf(S.xp)),nx?h('span',{class:'mut'},`  ·  ${nx[0]-S.xp} XP to next level`):h('span',{class:'mut'},'  ·  Top level!')),
    h('div',{class:'bar'},h('i',{style:`width:${levelPct(S.xp)}%`})),h('div',{class:'mut'},`${doneCount} of ${NDAYS()} days · ${minutesSpent()} min practised`))));
  const heard=Object.keys((LP.story||{}).heard||{}).length;
  wrap.append(h('div',{class:'tiles'},
    h('button',{class:'tile2 story',onclick:()=>go({name:'story'})},h('span',{class:'big'},'📖'),h('b',{},'Story time'),h('small',{},`Listen & read · ${heard}/${(STORY.sents||[]).length} lines`)),
    h('button',{class:'tile2 play',onclick:()=>go({name:'free'})},h('span',{class:'big'},'🎯'),h('b',{},'Quick practice'),h('small',{},'Word games for bonus XP'))));
  const days=dayList(); const cd=n!==null?dayDef(n):null;
  wrap.append(h('div',{class:'banner lesson-banner'},h('div',{class:'lb-txt'},h('small',{},`Unit ${LESSON.unit||''} · Lesson ${LESSON.order||''}`+(cd?` · ${n===22?'Follow-up':`Day ${n} of ${NDAYS()}`}`:' · Complete! 🏆')),
      h('h2',{class:'ml'},(LESSON.icon||'')+' '+LESSON.title),h('div',{},LESSON.titleEn||'')),
    h('button',{class:'lb-btn',onclick:()=>go({name:'course'})},'📚 LESSONS')));
  if(cd) wrap.append(h('div',{class:'today'},h('span',{class:'mut'},'Next: '),h('b',{},cd.title),' ',h('span',{class:'ml mut'},cd.ml)));
  else wrap.append(h('div',{class:'card',style:'text-align:center'},h('h3',{},'🏆 You finished this lesson!'),h('p',{class:'mut'},'Replay any day below, or pick a new lesson.'),h('button',{class:'btn big',onclick:()=>go({name:'course'})},'Choose the next lesson ▶')));
  wrap.append(h('div',{class:'section-title'},'Your path'));
  wrap.append(pathEl(days,(d,st)=>{ if(st.ok||st.done)openSheet(d.n); else jumpSheet(d.n); }));
  return wrap;
}
function dayView(n,compact){
  const def=dayDef(n); const wrap=h('div',{class:'card'});
  const tag=def.mode==='game'?h('span',{class:'badge'},'🎮 Game'):def.mode==='classic'?h('span',{class:'badge cl'},'📖 Classic'):null;
  wrap.append(h('div',{class:'mut'},n===22?'Follow-up':`Day ${n} of ${NDAYS()}`),h('h2',{},def.title,' ',tag),h('div',{class:'ml mut'},def.ml));
  const ul=h('ul',{class:'steps'}); let first=-1;
  def.steps.forEach((s,i)=>{ const d=stepDone(n,i); if(!d&&first<0)first=i;
    ul.append(h('li',{},h('span',{class:'tick'+(d?' on':'')},d?'✓':i+1),h('span',{},stepLabel(s)),
      !unlocked(n)&&!d?null:h('button',{class:'btn sm'+(d?' sec':''),style:'margin-left:auto',onclick:()=>{ document.querySelectorAll('.overlay').forEach(o=>o.remove()); go({name:'step',n,i}); }},d?'↻ Again':'Open'))); });
  wrap.append(ul);
  if(dayDone(n)) wrap.append(h('div',{class:'bubble'},'🎉 Day complete! Play any step again for practice (+10 XP each).'),h('button',{class:'btn acc big',onclick:()=>{ document.querySelectorAll('.overlay').forEach(o=>o.remove()); go({name:'step',n,i:0}); }},'↻ Play this day again'));
  else if(unlocked(n)) wrap.append(h('button',{class:'btn acc big',onclick:()=>{ document.querySelectorAll('.overlay').forEach(o=>o.remove()); go({name:'step',n,i:first}); }},first===0?'Start ▶':'Continue ▶'));
  else wrap.append(h('button',{class:'btn sec big',onclick:()=>{ document.querySelectorAll('.overlay').forEach(o=>o.remove()); jumpSheet(n); }},'⏩ Jump ahead to this day'));
  return wrap;
}
const STEP_LABELS={quiz:'❓ Questions',final:'🏆 Final challenge',story:'📖 Story time: read & listen',info:'Read',test:'Quiz',retell:'Tell the story (with a parent)',read:'Read key lines',builder:'Sentence builder game',cards:'Word cards',match:'Matching game',memory:'Memory game',warmup:'Quick word review',quest:'Quest game',plainq:'Questions',sim:'Wetland simulator',roblox:'Roblox mission',task:'Offline task',write:'Writing',order:'Essay planner',report:'Progress report'};
function stepLabel(s){
  if(s.t==='story'&&s.scenes){ const a=STORY.scenes[s.scenes[0]],b=STORY.scenes[s.scenes[1]]; return '📖 Listen: '+(a===b?a.title:a.title+' → '+b.title); }
  if(s.t==='info'&&!s.k)return '👋 Meet the lesson';
  if(s.t==='roblox')return '🎮 '+ROBLOX[s.k].title; if(s.t==='task')return '📝 '+TASKS[s.k].title; if(s.t==='write')return '✍️ '+WRITE[s.k].title;
  if(s.t==='test')return {baseline:'Starting quiz',checkpoint:'Checkpoint quiz',final:'Final quiz',delayed:'One-week quiz'}[s.name];
  if(s.t==='info')return INFO[s.k].title; return STEP_LABELS[s.t]||s.t;
}
function mapView(){
  const wrap=h('div'); const k=levelIdx(S.xp); const doneN=DAYS.filter(d=>dayDone(d.n)).length;
  wrap.append(h('div',{class:'hero'},mascot(84,'cheer'),h('div',{class:'speech'},'Your trophy room 🏆',h('span',{class:'ml'},'നിങ്ങളുടെ നേട്ടങ്ങൾ'))));
  wrap.append(h('div',{class:'card'},h('h3',{},'Levels'),h('div',{class:'ladder'},LEVELS.map((l,i)=>h('div',{class:'rung'+(i<=k?' got':'')+(i===k?' cur':'')},h('span',{class:'ico'},l[1].split(' ').pop()),h('div',{style:'flex:1'},h('b',{},l[1].replace(/\s?\S+$/,'')),h('div',{class:'mut'},l[0]+' XP')),i<=k?h('span',{},'✅'):h('span',{},'🔒'))))));
  const tests=LP.tests; const sc=k=>tests[k]&&tests[k].A?tests[k].A.v+tests[k].A.c+tests[k].B.v+tests[k].B.c:null;
  const B=[['🔥','3-day streak',streak()>=3],['⚡','100 XP',S.xp>=100],['🌟','500 XP',S.xp>=500],['📅','5 days done',doneN>=5],['📚','3 lessons',catalog().filter(c=>lessonStats(c.id).done===c.days&&c.days).length>=3],['🎧','Story fan',Object.values(S.lp).some(l=>l.story&&l.story.finished)],['✍️','Wrote essay',!!(LP.writing.essay&&LP.writing.essay.text)],['🧠','Quiz 14+',[sc('baseline'),sc('checkpoint'),sc('final')].some(v=>v!==null&&v>=14)],['🏆','Lesson done',doneN>=NDAYS()]];
  wrap.append(h('div',{class:'card'},h('h3',{},'Badges'),h('div',{class:'hbadges'},B.map(b=>h('div',{class:'hb'+(b[2]?' got':'')},h('span',{class:'ico'},b[0]),b[1])))));
  wrap.append(h('div',{class:'card'},h('h3',{},'All days'),pathEl(dayList(),(d,st)=>{ if(st.ok||st.done)openSheet(d.n); })));
  return wrap;
}
function freeView(){
  const box=h('div',{class:'card'});
  const ws=shuffle(WORDS.filter(w=>S.srs[w.id])).slice(0,6);
  if(ws.length<3){ box.append(h('p',{},'Learn a few words first, then bonus games appear here.'),h('button',{class:'btn',onclick:()=>go({name:'home'})},'Back')); return box; }
  box.append(h('h2',{},'🎮 Bonus practice (no pressure)'));
  const q=h('div'); box.append(q);
  runQuiz(q,ws.map(vocabItem),{feedback:true,onAnswer:ok=>{ if(ok)addXP(5); },onFinish:r=>{ q.innerHTML=''; q.append(h('h3',{},`Done! ${r.filter(x=>x.ok).length}/${r.length} ✔`),h('button',{class:'btn',onclick:()=>go({name:'home'})},'Back')); }});
  return box;
}

/* ---------- step runner ---------- */
function stepView(n,i){
  const def=dayDef(n),st=def.steps[i];
  const box=h('div',{class:'stage'});
  const t0=Date.now();
  const redo=stepDone(n,i);
  const ctx={n,i,t0,redo,done:(extra)=>{ const r=completeStep(n,i,t0,extra,redo); beep(true);
    celebrate(r,()=>{ const nx=redo?(i+1<def.steps.length?i+1:-1):def.steps.findIndex((_,k)=>!stepDone(n,k)); if(nx>=0&&!r.dayFinished) go({name:'step',n,i:nx}); else go({name:'home'}); }); },back:()=>go({name:'home'})};
  const doneSteps=def.steps.filter((_,k)=>stepDone(n,k)).length;
  box.append(h('div',{class:'stepbar'},h('button',{class:'x','aria-label':'Close',onclick:()=>go({name:'home'})},'✕'),
    h('div',{class:'bar'},h('i',{style:`width:${doneSteps/def.steps.length*100}%`})),h('span',{class:'mut'},`${i+1}/${def.steps.length}`)));
  const card=h('div',{class:'card',style:'margin-top:0'}); box.append(card);
  card.append(h('h2',{},stepLabel(st)),redo?h('div',{class:'bubble'},'↻ Practice round: play as many times as you like.'+(st.t==='test'||st.t==='retell'?' Your first saved score stays the same.':'')):null);
  const body=h('div'); card.append(body);
  const fn=STEPS[st.t]; if(fn)fn(body,st,ctx); else body.append('Unknown step');
  return box;
}

/* ---------- quiz engine ---------- */
function vocabItem(w){
  const wrong=shuffle(WORDS.filter(x=>x.id!==w.id&&x.en!==w.en).map(x=>x.en)).slice(0,3);
  const o=shuffle([w.en,...wrong]);
  return {id:'V_'+w.id,vocab:true,sec:w.set,q:w.ml,rom:w.rom,qe:'',o,a:o.indexOf(w.en),wid:w.id};
}
function runQuiz(box,items,opts){
  let i=0,combo=0; const res=[];
  (function show(){
    box.innerHTML='';
    document.querySelectorAll('.actionbar').forEach(x=>x.remove());
    if(i>=items.length){ opts.onFinish(res); return; }
    const it=items[i]; const order=shuffle(it.o.map((_,k)=>k));
    let picked=null,hint=((S.settings||{}).en!==false),locked=false; const t1=Date.now();
    const hasEn=!it.vocab&&(it.qe||it.oe);
    const enEls=[];
    const bar=h('div',{class:'bar'},h('i',{style:`width:${i/items.length*100}%`}));
    const qe=h('div',{class:'mut'+(hint?'':' hide')},it.qe||''); enEls.push(qe);
    const fbTxt=h('div',{class:'fbtxt'});
    const next=h('button',{class:'btn',onclick:()=>{
      res.push({id:it.id,sec:it.sec,vocab:!!it.vocab,ok:picked===it.a,hint:!!(hasEn&&hint),secs:Math.round((Date.now()-t1)/1000)}); bottom.remove(); i++; show(); }},i+1<items.length?'Continue':'Finish ✔');
    const bottom=h('div',{class:'actionbar'},h('div',{class:'in'},fbTxt,next));
    const optBtns=order.map(k=>{
      const en=it.oe?h('span',{class:'en'+(hint?'':' hide')},it.oe[k]):null; if(en)enEls.push(en);
      const b=h('button',{class:'opt'},h('span',{class:it.vocab?'':'ml'},it.o[k]),en);
      b.onclick=()=>{
        if(locked)return;
        picked=k; optBtns.forEach(x=>x.classList.remove('sel')); b.classList.add('sel');
        if(opts.feedback){ locked=true; const ok=k===it.a; beep(ok);
          optBtns.forEach((x,ix)=>{ if(order[ix]===it.a)x.classList.add('good'); else if(x===b)x.classList.add('wrong'); });
          if(opts.onAnswer)opts.onAnswer(ok,it);
          combo=ok?combo+1:0;
          bottom.classList.add(ok?'good':'bad');
          if(ok){ fbTxt.textContent=(combo>=3?`🔥 ${combo} in a row! `:'')+CHEERS[Math.floor(Math.random()*CHEERS.length)]; floatXP(b,'+XP'); }
          else { fbTxt.textContent='Correct answer:'; fbTxt.append(h('small',{},it.o[it.a])); }
        } else fbTxt.textContent='Tap Continue when ready';
        document.body.append(bottom);
      };
      return b;
    });
    const enBtn=hasEn?h('button',{class:'btn sec sm',onclick:()=>{ hint=!hint; enEls.forEach(e=>e.classList.toggle('hide',!hint)); }},'🇬🇧 English'):null;
    box.append(h('div',{class:'stage'},bar,h('div',{class:'mut'},`Question ${i+1} of ${items.length}`+(combo>=2?`  ·  🔥 ${combo} streak`:'')),
      opts.scene&&it.scene?h('div',{class:'scene'},'📖 ',it.scene):null,
      h('div',{class:'row'},h('div',{class:'q ml',style:'flex:1'},it.q,it.rom?h('div',{class:'mut',style:'font-size:15px;font-weight:600'},it.rom):null),speakBtn(it.q)),qe,optBtns,
      h('div',{class:'row'},enBtn),h('div',{class:'spacer'})));
  })();
}
function summarize(res){
  const o={A:{v:0,c:0},B:{v:0,c:0},hints:0,secs:0};
  res.forEach(r=>{ if(r.ok&&o[r.sec])o[r.sec][r.vocab?'v':'c']++; if(r.hint)o.hints++; o.secs+=r.secs; });
  return o;
}
const pctSec=(t,s)=>t?Math.round((t[s].v+t[s].c)/9*100):null;

/* ---------- step implementations ---------- */
const STEPS={};
STEPS.info=(box,st,ctx)=>{ const sc0=(STORY.scenes||[]).find(x=>x.book); const d=st.k&&INFO[st.k]?INFO[st.k]:{title:'Meet the lesson: '+(LESSON.titleEn||''),html:`<p class="ml" style="font-size:22px;font-weight:800">${LESSON.title}</p>`+(LESSON.summaryEn||''),img:sc0&&sc0.book}; box.append(h('h3',{},d.title),d.img?h('img',{class:'pic',src:d.img,alt:'Illustration from the textbook, page 48'}):null,h('div',{html:d.html}),h('button',{class:'btn',onclick:()=>ctx.done()},'Got it ✔')); };

STEPS.test=(box,st,ctx)=>{
  const vocab=[...TEST_VOCAB.A,...TEST_VOCAB.B].map(id=>vocabItem(wordById(id)));
  const comp=COMP.filter(c=>c.test);
  const items=shuffle([...vocab,...comp]);
  const intro=h('div',{},h('p',{},'18 quick questions. Answers are not shown until the end. English is shown to help you; tap ',h('b',{},'Show/Hide English'),' to change it.'),
    h('button',{class:'btn',onclick:()=>{ intro.remove(); const q=h('div'); box.append(q);
      runQuiz(q,items,{feedback:false,onFinish:res=>{
        const sm=summarize(res); if(!ctx.redo){ LP.tests[st.name]=Object.assign(LP.tests[st.name]||{},{date:today(),A:sm.A,B:sm.B,hints:sm.hints,secs:sm.secs}); save(); }
        const tot=sm.A.v+sm.A.c+sm.B.v+sm.B.c; q.innerHTML='';
        q.append(h('h3',{},st.name==='baseline'?'🏁 Your starting line!':'Quiz saved!'),h('p',{},`You scored ${tot} out of 18.`),h('p',{class:'mut'},st.name==='baseline'?'Every journey starts here. Let\'s see how far you go in 15 days.':'The parent report will compare this with your earlier quizzes.'),h('button',{class:'btn',onclick:()=>ctx.done({score:tot})},'Continue ▶'));
      }}); }},'Start the quiz'));
  box.append(intro);
};

STEPS.retell=(box,st,ctx)=>{
  const names={A:'Pages 48–49',B:'Pages 50–52',F:isAathi()?'The whole chapter':'The whole lesson'};
  box.append(h('p',{},'Now tell the story out loud to a parent, in your own words (Malayalam, English or mixed). The parent ticks what was covered.'));
  const boxes={};
  st.parts.forEach(p=>{ box.append(h('h3',{},names[p])); boxes[p]=RETELL[p].map(t=>{ const c=h('input',{type:'checkbox'}); box.append(h('label',{style:'display:block;margin:6px 0'},c,' '+t)); return c; }); });
  box.append(h('button',{class:'btn',style:'margin-top:12px',onclick:()=>{ if(ctx.redo)return ctx.done(); askPin(()=>{
    const r={}; st.parts.forEach(p=>{ r[p]=boxes[p].filter(c=>c.checked).length; });
    LP.tests[st.name]=Object.assign(LP.tests[st.name]||{date:today()},{retell:r}); save(); ctx.done();
  }); }},ctx.redo?'Done ✔':'👪 Parent: save score'));
};

STEPS.read=(box,st,ctx)=>{
  const ss=SENT.filter(s=>s.sec===st.sec); const pages=st.sec==='A'?'48–49':'50–52';
  box.append(h('p',{class:'mut'},`Open your textbook at pages ${pages}. First read the page yourself, then read these key lines aloud.`));
  const finish=h('button',{class:'btn acc',disabled:true,onclick:()=>ctx.done()},'Finish ✔'); let got=0;
  if(st.mode==='game'){
    box.append(h('div',{class:'bar'},h('i',{id:'rb',style:'width:0'})));
    ss.forEach(s=>{ let done=false; const en=h('div',{class:'mut hide'},s.en,s.gloss.length?h('div',{},s.gloss.map(g=>h('span',{class:'chip',style:'margin:2px'},g[0]+' = '+g[1]))):null);
      const star=h('button',{class:'btn sm',onclick:e=>{ if(done)return; done=true; got++; beep(true); star.textContent='⭐ +5'; star.disabled=true; addXP(5); $('#rb').style.width=(got/ss.length*100)+'%'; if(got===ss.length)finish.disabled=false; }},'✔ I read it aloud');
      box.append(h('div',{class:'card',style:'margin:8px 0;padding:12px'},h('div',{class:'mut'},`Page ${s.page}`),h('div',{class:'ml',style:'font-size:20px'},s.ml),h('div',{class:'mut',style:'font-style:italic'},s.rom),
        h('div',{class:'row',style:'margin-top:6px'},speakBtn(s.ml),h('button',{class:'btn sec sm',onclick:()=>en.classList.toggle('hide')},'English'),star),en)); });
  } else {
    ss.forEach(s=>box.append(h('div',{style:'padding:8px 0;border-bottom:1px solid var(--line)'},h('div',{class:'mut'},`Page ${s.page}`),h('div',{class:'ml'},s.ml,' ',speakBtn(s.ml)),h('div',{class:'mut',style:'font-style:italic'},s.rom),h('div',{class:'mut'},s.en))));
    finish.disabled=false; finish.textContent='I have read these lines ✔';
  }
  box.append(finish);
};

STEPS.builder=(box,st,ctx)=>{
  let i=0;
  (function show(){
    box.innerHTML=''; if(i>=BUILD.length){ box.append(h('h3',{},'🧩 All sentences built!'),h('button',{class:'btn',onclick:()=>ctx.done()},'Finish ✔')); return; }
    const b=BUILD[i]; const chosen=[]; const ans=h('div',{class:'answerline ml'});
    const pool=h('div'); const btns=shuffle(b.ch.map((c,k)=>({c,k}))).map(o=>{ const x=h('button',{class:'chunk ml',onclick:()=>{ if(x.classList.contains('used'))return; x.classList.add('used'); chosen.push(o); draw(); }},o.c); return x; });
    pool.append(btns);
    function draw(){ ans.innerHTML=''; chosen.forEach((o,ix)=>ans.append(h('button',{class:'chunk ml',onclick:()=>{ chosen.splice(ix,1); btns.forEach(bt=>bt.classList.remove('used')); chosen.forEach(c=>{ btns.find(bt=>bt.textContent===c.c&&!bt.classList.contains('used')).classList.add('used'); }); draw(); }},o.c))); }
    const msg=h('div',{class:'mut'});
    box.append(h('div',{class:'bar'},h('i',{style:`width:${i/BUILD.length*100}%`})),h('p',{},'Build the sentence in the right order: ',h('b',{},b.en)),h('p',{class:'mut',style:'font-style:italic'},'Sounds like: '+b.rom),ans,pool,msg,
      h('div',{class:'row',style:'margin-top:10px'},h('button',{class:'btn',onclick:()=>{
        const ok=chosen.length===b.ch.length&&chosen.every((o,ix)=>o.k===ix); beep(ok);
        if(ok){ addXP(10); msg.textContent='✅ Perfect!'; setTimeout(()=>{i++;show();},700); } else msg.textContent='Not yet - check the order and try again.'; }},'Check'),
        h('button',{class:'btn sec',onclick:()=>say(b.ch.join(' '))},'🔊 Hear answer')));
  })();
};

function introduce(ids){ ids.forEach(id=>{ if(!S.srs[id])S.srs[id]={box:1,due:addDays(today(),1)}; }); save(); }
STEPS.cards=(box,st,ctx)=>{
  const ws=WORDS.filter(w=>w.set===st.set);
  if(st.mode==='classic'){
    box.append(h('p',{},st.review?'Read the word list again.':'Study this word list. Read each word and its meaning twice.'),
      h('table',{},h('tr',{},h('th',{},'Malayalam'),h('th',{},'English')),ws.map(w=>h('tr',{},h('td',{class:'ml'},w.ml,' ',speakBtn(w.ml),h('div',{class:'mut',style:'font-style:italic'},w.rom)),h('td',{},w.en)))),
      h('button',{class:'btn',style:'margin-top:12px',onclick:()=>{ introduce(ws.map(w=>w.id)); ctx.done(); }},'I have studied these ✔'));
    return;
  }
  let i=0; const queue=ws.slice();
  (function show(){
    box.innerHTML=''; if(!queue.length){ introduce(ws.map(w=>w.id)); box.append(h('h3',{},'🃏 Cards complete!'),h('button',{class:'btn',onclick:()=>ctx.done()},'Finish ✔')); return; }
    const w=queue[0]; let back=false;
    const card=h('div',{class:'flip ml',onclick:()=>{ back=!back; draw(); }});
    function draw(){ card.innerHTML=''; card.style.animation='none'; void card.offsetWidth; card.style.animation=''; if(back){ card.append(h('div',{style:'font-size:72px'},w.emoji),h('div',{style:'font-size:22px'},w.en)); } else { card.append(h('div',{},w.ml),h('div',{class:'mut',style:'font-size:18px;font-style:italic'},w.rom),h('div',{class:'mut',style:'font-size:14px'},'tap to flip')); } }
    draw();
    box.append(h('div',{class:'mut'},`${ws.length-queue.length+1<1?1:ws.length-queue.length+1} / ${ws.length}`),card,
      h('div',{class:'row',style:'margin-top:10px;justify-content:center'},speakBtn(w.ml),
        h('button',{class:'btn sec',onclick:()=>{ queue.push(queue.shift()); show(); }},'Again 🔁'),
        h('button',{class:'btn',onclick:()=>{ queue.shift(); addXP(3); show(); }},'Got it ✔')));
  })();
};

STEPS.match=(box,st,ctx)=>{
  const ws=WORDS.filter(w=>w.set===st.set).slice(0,6); let selL=null,matched=0; const t0=Date.now();
  const timer=h('span',{class:'chip'},'0s'); timers.push(setInterval(()=>{ timer.textContent=Math.round((Date.now()-t0)/1000)+'s'; },500));
  const L=shuffle(ws),R=shuffle(ws); const lb=[],rb=[];
  const lcol=h('div'),rcol=h('div');
  L.forEach((w,ix)=>{ const b=h('button',{class:'mcard ml',style:'width:100%;margin:5px 0',onclick:()=>{ if(b.classList.contains('ok'))return; lb.forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); selL=ix; }},w.ml); lb.push(b); lcol.append(b); });
  R.forEach((w,ix)=>{ const b=h('button',{class:'mcard',style:'width:100%;margin:5px 0',onclick:()=>{
      if(selL===null||b.classList.contains('ok'))return;
      if(L[selL].id===w.id){ lb[selL].classList.remove('sel'); lb[selL].classList.add('ok'); b.classList.add('ok'); matched++; selL=null; beep(true); addXP(5);
        if(matched===ws.length){ box.append(h('h3',{},`🎯 All matched in ${Math.round((Date.now()-t0)/1000)}s!`),h('button',{class:'btn',onclick:()=>ctx.done()},'Finish ✔')); } }
      else { beep(false); b.classList.add('bad'); setTimeout(()=>b.classList.remove('bad'),350); } }},w.emoji+' '+w.en); rb.push(b); rcol.append(b); });
  box.append(h('div',{class:'row'},h('span',{},'Tap a Malayalam word, then its English meaning.'),timer),h('div',{class:'pair'},lcol,rcol));
};

STEPS.memory=(box,st,ctx)=>{
  const ws=WORDS.filter(w=>w.set===st.set).slice(0,6);
  const cards=shuffle(ws.flatMap(w=>[{id:w.id,t:'ml',label:w.ml},{id:w.id,t:'en',label:w.emoji+' '+w.en}]));
  let first=null,lock=false,pairs=0,moves=0; const info=h('div',{class:'mut'},'Moves: 0');
  const grid=h('div',{class:'mem'});
  const els=cards.map((c,ix)=>{ const b=h('button',{class:'mcard ml down',onclick:()=>{
      if(lock||b.classList.contains('ok')||first===ix)return; b.classList.remove('down'); b.textContent=c.label;
      if(first===null){ first=ix; return; }
      moves++; info.textContent='Moves: '+moves; const a=cards[first];
      if(a.id===c.id&&a.t!==c.t){ els[first].classList.add('ok'); b.classList.add('ok'); beep(true); first=null; pairs++; addXP(5);
        if(pairs===ws.length)box.append(h('h3',{},`🧠 Done in ${moves} moves!`),h('button',{class:'btn',onclick:()=>ctx.done()},'Finish ✔')); }
      else { lock=true; beep(false); const f=first; first=null; timers.push(setTimeout(()=>{ [els[f],b].forEach(x=>{ x.classList.add('down'); x.textContent=''; }); lock=false; },900)); } }},''); return b; });
  els.forEach(e=>grid.append(e));
  box.append(h('p',{},'Flip two cards to find each Malayalam word and its English meaning.'),info,grid);
};

STEPS.warmup=(box,st,ctx)=>{
  const due=WORDS.filter(w=>st.sets.includes(w.set)&&S.srs[w.id]&&S.srs[w.id].due<=today()).sort((a,b)=>S.srs[a.id].box-S.srs[b.id].box).slice(0,6);
  if(!due.length){ box.append(h('p',{},'🌟 No words are due for review today. Nice memory!'),h('button',{class:'btn',onclick:()=>ctx.done()},'Continue ▶')); return; }
  box.append(h('p',{class:'mut'},'The app picked the words you need to practise today.'));
  const q=h('div'); box.append(q); const INT=[0,1,2,4,7,10];
  runQuiz(q,due.map(vocabItem),{feedback:true,onAnswer:(ok,it)=>{ const s=S.srs[it.wid]; if(ok){ s.box=Math.min(5,s.box+1); addXP(5);} else s.box=0; s.due=addDays(today(),INT[s.box]); save(); },
    onFinish:r=>{ q.innerHTML=''; q.append(h('h3',{},`${r.filter(x=>x.ok).length}/${r.length} remembered`),h('button',{class:'btn',onclick:()=>ctx.done({score:r.filter(x=>x.ok).length})},'Continue ▶')); }});
};

STEPS.quest=(box,st,ctx)=>{
  box.append(h('img',{class:'pic',src:'img/excavator.jpg',alt:'Excavator lifting a mangrove tree'}),h('p',{},'You are walking through Dinakaran\'s land. Each scene brings a question. Answer to move on!'));
  const q=h('div'); const go1=h('button',{class:'btn acc',onclick:()=>{ go1.remove(); box.append(q);
    runQuiz(q,COMP.filter(c=>c.sec==='A'),{feedback:true,scene:true,onAnswer:ok=>{ if(ok)addXP(10); },onFinish:r=>{ const sc=r.filter(x=>x.ok).length; if(!ctx.redo)LP.extra.questA=sc; save(); q.innerHTML=''; q.append(h('h3',{},`🏅 Quest complete: ${sc}/${r.length}`),h('button',{class:'btn',onclick:()=>ctx.done({score:sc})},'Finish ✔')); }}); }},'Begin the quest ▶');
  box.append(go1);
};

STEPS.plainq=(box,st,ctx)=>{
  const items=COMP.filter(c=>c.sec==='B'); const sel={};
  box.append(h('p',{class:'mut'},'Open the textbook pages 50–52 if you need to. Pick one answer for each question, then press Submit.'));
  items.forEach((c,qi)=>{ box.append(h('div',{style:'margin:14px 0'},h('div',{class:'ml',style:'font-weight:700'},`${qi+1}. ${c.q}`),h('div',{class:'mut'},c.qe),
    c.o.map((o,k)=>h('label',{style:'display:block;margin:4px 0'},h('input',{type:'radio',name:'q'+qi,onchange:()=>{ sel[qi]=k; }}),' ',h('span',{class:'ml'},o))))); });
  box.append(h('button',{class:'btn',onclick:()=>{
    if(Object.keys(sel).length<items.length){ alert('Please answer every question.'); return; }
    const sc=items.filter((c,qi)=>sel[qi]===c.a).length; if(!ctx.redo)LP.extra.plainB=sc; save(); box.innerHTML='';
    box.append(h('h3',{},`Score: ${sc} / ${items.length}`),items.map((c,qi)=>h('div',{style:'margin:8px 0'},h('span',{},sel[qi]===c.a?'✅ ':'❌ '),h('span',{class:'ml'},c.q),h('div',{class:'mut ml'},'Answer: '+c.o[c.a]))),h('button',{class:'btn',onclick:()=>ctx.done({score:sc})},'Finish ✔')); }},'Submit'));
};

STEPS.sim=(box,st,ctx)=>{
  let grid=[...'mmmmm',...'wwwww',...'wwwww',...'ppppp']; let mode='fill',filled=0,restored=0,reflected=false;
  const ico={m:'🌿',w:'💧',p:'🌾',c:'🧱'}, cls={m:'t-mang',w:'t-water',p:'t-paddy',c:'t-conc'};
  const gridEl=h('div',{class:'grid5'}),meters=h('div'),bub=h('div'),goal=h('div',{class:'mut'}),modes=h('div',{class:'row'}),fin=h('div');
  function metrics(){ const w=grid.filter(x=>x==='w').length,m=grid.filter(x=>x==='m').length;
    const fish=Math.round(12*Math.min(1,w/10)*(0.4+0.6*m/5)),crab=Math.round(10*m/5),frog=Math.round(8*(0.5*w/10+0.5*m/5)),bird=Math.round(6*(fish/12*0.6+m/5*0.4)),bfly=Math.round(8*m/5),food=Math.round(100*(0.5*w/10+0.3*m/5+0.2)),tide=Math.round(w/10*100);
    return [['🐟 Fish',fish,12],['🦀 Crabs',crab,10],['🐸 Frogs',frog,8],['🐦 Birds',bird,6],['🦋 Butterflies',bfly,8],['🌊 Tide',tide,100],['🍚 Food',food,100]]; }
  function draw(){
    gridEl.innerHTML=''; grid.forEach((t,ix)=>gridEl.append(h('button',{class:'tile '+cls[t],'aria-label':t,onclick:()=>{
      if(mode==='fill'&&(t==='w'||t==='m')){ grid[ix]='c'; filled++; beep(false); }
      else if(mode==='restore'&&t==='c'){ grid[ix]=ix<5?'m':'w'; restored++; beep(true); } else return; draw(); }},ico[t])));
    meters.innerHTML=''; const mt=metrics(); mt.forEach(([l,v,mx])=>meters.append(h('div',{class:'meter'},h('span',{},l),h('div',{class:'bar',style:'margin:0'},h('i',{style:`width:${v/mx*100}%`})),h('span',{},v))));
    bub.innerHTML=''; const tide=mt[5][1]; if(tide<40)bub.append(h('div',{class:'bubble'},h('span',{class:'ml'},'കുഞ്ഞിമാത്വമ്മ: "ഞാനെങ്ങടൂല്യ..."'),h('div',{class:'mut'},'The tide cannot come in any more. She waits in the water.')));
    else if(filled>0&&restored>0&&tide>=70)bub.append(h('div',{class:'bubble'},'💚 The water is coming back, and life with it!'));
    goal.textContent=`Filled: ${filled}/6 · Restored: ${restored}/3`;
    fin.innerHTML=''; if(filled>=6&&restored>=3&&!reflected) fin.append(h('button',{class:'btn acc',onclick:()=>{ reflected=true; box.innerHTML=''; const q=h('div'); box.append(h('h3',{},'Think about it'),q);
      runQuiz(q,SIM_QS.map(x=>Object.assign({sec:'S'},x)),{feedback:true,onAnswer:ok=>{ if(ok)addXP(15); },onFinish:()=>{ q.innerHTML=''; q.append(h('h3',{},'🌍 You saw how living things depend on each other!'),h('button',{class:'btn',onclick:()=>ctx.done()},'Finish ✔')); }}); }},'Next: reflection questions ▶'));
    modes.innerHTML=''; modes.append(h('button',{class:'btn '+(mode==='fill'?'':'sec'),onclick:()=>{mode='fill';draw();}},'🚜 Outside world: fill tiles'),h('button',{class:'btn '+(mode==='restore'?'':'sec'),onclick:()=>{mode='restore';draw();}},'🌱 Restore wetland'));
  }
  box.append(h('p',{},'This is the wetland of Aathi. First use the 🚜 to fill at least 6 tiles and watch the life numbers. Then switch to 🌱 and restore at least 3 tiles.'),modes,gridEl,goal,bub,h('h3',{},'Life in the wetland'),meters,fin);
  draw();
};

function checklist(box,items,onDone,extraEl){
  const cbs=items.map(t=>{ const c=h('input',{type:'checkbox',onchange:upd}); box.append(h('label',{style:'display:flex;gap:10px;margin:10px 0;align-items:flex-start'},c,h('span',{},t))); return c; });
  const btn=h('button',{class:'btn acc',disabled:true,onclick:onDone},'All done ✔');
  function upd(){ btn.disabled=!cbs.every(c=>c.checked); }
  if(extraEl)box.append(extraEl); box.append(btn);
}
STEPS.roblox=(box,st,ctx)=>{
  const r=ROBLOX[st.k]; const mins=h('input',{type:'number',min:'0',max:'180',placeholder:'Minutes you played/built'});
  box.append(h('p',{},h('b',{},r.title)));
  checklist(box,r.items,()=>{ LP.extra['rb'+st.k]=+mins.value||0; ctx.done({mins:+mins.value||0}); },h('div',{},h('div',{class:'mut'},'Minutes spent:'),mins,h('p',{class:'mut'},'Parent tip: the "Aathi" world is built in Roblox Studio (place "Place1"). Save it from Studio (File > Save to File As) so it is not lost, and press Play to explore it with your child.')));
};
STEPS.task=(box,st,ctx)=>{ const t=TASKS[st.k]; box.append(h('p',{},h('b',{},t.title))); checklist(box,t.items,()=>ctx.done()); };

STEPS.write=(box,st,ctx)=>{
  const w=WRITE[st.k]; const saved=(LP.writing[w.key]||{}).text||'';
  const ta=h('textarea',{placeholder:'Write here…'}); ta.value=saved; const cnt=h('div',{class:'mut'});
  const btn=h('button',{class:'btn acc',onclick:()=>{ LP.writing[w.key]={text:ta.value,date:today()}; save(); ctx.done(); }},'Save & finish ✔');
  function upd(){ const n=ta.value.trim().length; cnt.textContent=`${n} letters (need ${w.min})`; btn.disabled=n<w.min; LP.writing[w.key]={text:ta.value,date:today()}; save(); }
  ta.addEventListener('input',upd);
  box.append(h('div',{class:'ml',style:'font-weight:700'},w.prompt),h('p',{class:'mut'},w.en),
    h('div',{class:'row'},w.starters.map(s=>h('button',{class:'btn sec sm ml',onclick:()=>{ ta.value+=s; ta.focus(); upd(); }},s))),ta,cnt,
    h('p',{class:'mut'},'Tip: use the Malayalam keyboard on your phone/tablet, or Google Input Tools to type Malayalam from English letters.'),btn); upd();
};

STEPS.order=(box,st,ctx)=>{
  const idx=shuffle(ESSAY_POINTS.map((_,i)=>i)); const chosen=[]; const out=h('ol',{class:'ml'}); const msg=h('div',{class:'mut'});
  const btns=idx.map(i=>{ const b=h('button',{class:'opt',onclick:()=>{ if(b.disabled)return; b.disabled=true; b.classList.add('sel'); chosen.push(i); out.append(h('li',{},ESSAY_POINTS[i])); }},h('span',{class:'ml'},ESSAY_POINTS[i]),h('span',{class:'en'},ESSAY_EN[i])); return b; });
  box.append(h('p',{},'Planning an essay: tap the points in the order you would write them (what is natural first, what happens at the end last).'),btns,h('h3',{},'Your plan'),out,msg,
    h('div',{class:'row'},h('button',{class:'btn',onclick:()=>{ const ok=chosen.length===6&&chosen.every((v,k)=>v===k); beep(ok);
      if(ok){ addXP(15); box.innerHTML=''; box.append(h('h3',{},'📝 Great plan!'),h('ol',{class:'ml'},ESSAY_POINTS.map(p=>h('li',{},p))),h('button',{class:'btn',onclick:()=>ctx.done()},'Continue ▶')); }
      else msg.textContent='Not quite. Think: nature first → people interfere → effects → … Try again!'; }},'Check'),
      h('button',{class:'btn sec',onclick:()=>go({name:'step',n:ctx.n,i:ctx.i})},'Reset')));
};

STEPS.story=(box,st,ctx)=>{
  box.append(h('p',{class:'mut'},'Press ▶ and follow the yellow words. Tap any word to hear it again. Turn on 🔤 Sounds like and 🇬🇧 English if you need help.'),
    storyReader({compact:true,scenes:st.scenes}),h('button',{class:'btn acc big',style:'margin-top:12px',onclick:()=>ctx.done()},'I listened to it ✔'));
};
function storyView(){ return h('div',{},h('button',{class:'btn sec sm',style:'margin:4px 0 8px',onclick:()=>go({name:'course'})},'📚 '+(LESSON.titleEn||'Change lesson')+' ▾'),storyReader()); }
STEPS.quiz=(box,st,ctx)=>{
  const items=COMP.filter(c=>!st.sec||c.sec===st.sec); const q=h('div'); box.append(h('p',{class:'mut'},'Answer the questions. English help is shown below each one.'),q);
  runQuiz(q,shuffle(items),{feedback:true,onAnswer:ok=>{ if(ok)addXP(5); },onFinish:r=>{ const sc=r.filter(x=>x.ok).length; if(!ctx.redo)LP.extra['quiz'+(st.sec||'')]=sc; save(); q.innerHTML=''; q.append(h('h3',{},`🎯 ${sc} / ${r.length} correct!`),h('button',{class:'btn',onclick:()=>ctx.done({score:sc})},'Continue ▶')); }});
};
STEPS.final=(box,st,ctx)=>{
  const items=shuffle([...COMP,...shuffle(WORDS).slice(0,Math.min(8,WORDS.length)).map(vocabItem)]); const q=h('div');
  const intro=h('div',{},h('p',{},`The final challenge: ${items.length} questions about the whole lesson. Do your best! 💪`),h('button',{class:'btn big',onclick:()=>{ intro.remove(); box.append(q);
    runQuiz(q,items,{feedback:true,onAnswer:ok=>{ if(ok)addXP(5); },onFinish:r=>{ const sc=r.filter(x=>x.ok).length;
      if(!ctx.redo) LP.tests.final={date:today(),score:sc,total:r.length}; else LP.extra.finalPractice=sc; save();
      q.innerHTML=''; q.append(h('h3',{},`🏆 ${sc} / ${r.length}`),h('p',{class:'mut'},sc/r.length>=.8?'Amazing! You really know this lesson.':sc/r.length>=.5?'Good job! Replay the story to get even better.':'Nice try! Listen to the story again and replay the games.'),h('button',{class:'btn',onclick:()=>ctx.done({score:sc})},'Continue ▶')); }}); }},'Start ▶'));
  box.append(intro);
};
STEPS.report=(box,st,ctx)=>{ box.append(reportEl(),h('button',{class:'btn',style:'margin-top:12px',onclick:()=>ctx.done()},'Finish ✔')); };

/* ---------- report ---------- */
const TEST_NAMES=[['baseline','Day 1 start'],['checkpoint','Day 8 checkpoint'],['final','Day 15 final'],['delayed','Day 22 follow-up']];
function reportEl(){
  const wrap=h('div'); const T=LP.tests; const rows=TEST_NAMES.filter(([k])=>T[k]&&T[k].A);
  if(!rows.length){ wrap.append(h('p',{class:'mut'},'No quizzes completed yet.')); return wrap; }
  wrap.append(h('h3',{},'Quiz results (% correct)'),h('table',{},h('tr',{},h('th',{},'Quiz'),h('th',{},'🎮 Pages 48–49 (game)'),h('th',{},'📖 Pages 50–52 (classic)'),h('th',{},'Total /18'),h('th',{},'Retell')),
    rows.map(([k,l])=>{ const t=T[k]; const r=t.retell; const rt=r?Object.entries(r).map(([p,v])=>`${p}:${v}`).join(' '):'–';
      return h('tr',{},h('td',{},l),h('td',{},pctSec(t,'A')+'%'),h('td',{},pctSec(t,'B')+'%'),h('td',{},t.A.v+t.A.c+t.B.v+t.B.c),h('td',{},rt)); })));
  const bars=h('div',{class:'cmpbar'}); rows.forEach(([k,l])=>{ [['A','var(--acc)'],['B','var(--pri)']].forEach(([s,c])=>{ const v=pctSec(T[k],s); bars.append(h('div',{style:`height:${Math.max(3,v*1.0)}%;background:${c}`,title:`${l} ${s}: ${v}%`},v+'%')); }); });
  wrap.append(h('div',{style:'margin-top:12px'},bars),h('div',{class:'legend'},rows.map(([k,l])=>h('span',{},l+' (🎮|📖)'))));
  wrap.append(h('div',{class:'bubble',style:'margin-top:12px'},h('b',{},'What this shows: '),verdict()));
  return wrap;
}
function lessonReport(){
  const f=LP.tests.final, r=LP.tests.final&&LP.tests.final.retell;
  const qs=Object.entries(LP.extra).filter(([k])=>k.startsWith('quiz')).map(([k,v])=>`${k.replace('quiz','Questions ')}: ${v}`).join(' · ');
  const heard=Object.keys((LP.story||{}).heard||{}).length;
  return h('div',{},h('p',{},f&&f.score!=null?`🏆 Final challenge: ${f.score}/${f.total} (${f.date})`:'Final challenge not done yet.'),
    h('p',{class:'mut'},`🎧 Story lines heard: ${heard}/${(STORY.sents||[]).length}`+(qs?` · ${qs}`:'')+(r?` · Retell: ${r.F}/${RETELL.F.length} points`:'')));
}
function verdict(){
  const T=LP.tests,b=T.baseline,c=T.checkpoint,f=T.final,d=T.delayed; const out=[];
  if(b&&c){ const gA=pctSec(c,'A')-pctSec(b,'A'),gB=pctSec(c,'B')-pctSec(b,'B');
    out.push(`At the checkpoint (before any shared activities) the game-taught half changed by ${gA>=0?'+':''}${gA} points and the classic-taught half by ${gB>=0?'+':''}${gB} points. ${Math.max(gA,gB)<=0?'Neither half improved at this checkpoint.':gA>gB?'The game half gained more.':gA<gB?'The classic half gained more.':'Both halves gained the same.'}`);
    if(c.retell&&c.retell.A!=null&&c.retell.B!=null)out.push(`Retelling: game half ${c.retell.A}/4, classic half ${c.retell.B}/4.`); }
  if(b&&f){ const tb=b.A.v+b.A.c+b.B.v+b.B.c,tf=f.A.v+f.A.c+f.B.v+f.B.c; out.push(`Overall score moved from ${tb}/18 to ${tf}/18 after the full 15 days.`); }
  if(f&&d){ const tf=f.A.v+f.A.c+f.B.v+f.B.c,td=d.A.v+d.A.c+d.B.v+d.B.c; out.push(`One week later: ${td}/18 (final was ${tf}/18) - this shows what was remembered.`); }
  out.push('Note: this is one child over 15 days, so treat it as a useful signal, not proof. The two halves also differ a little in difficulty.');
  return out.join(' ');
}
function reportText(){
  const L=[`Aathi 15-day report${S.name?' - '+S.name:''}`,`Start: ${S.start}  XP: ${S.xp}  Minutes: ${minutesSpent()}  Streak: ${streak()}`,''];
  TEST_NAMES.forEach(([k,l])=>{ const t=LP.tests[k]; if(t&&t.A)L.push(`${l}: game half ${pctSec(t,'A')}%, classic half ${pctSec(t,'B')}%, total ${t.A.v+t.A.c+t.B.v+t.B.c}/18, hints used ${t.hints}${t.retell?', retell '+JSON.stringify(t.retell):''}`); });
  L.push('',verdict()); return L.join('\n');
}

/* ---------- parent ---------- */
function parentView(){
  const wrap=h('div');
  const cur=currentDay();
  wrap.append(h('div',{class:'card'},h('h2',{},'👪 Parent dashboard'),
    h('p',{},`Day 1 started: ${S.start}. Current day: ${cur===null?'finished':cur}. ${minutesSpent()} minutes practised, streak ${streak()} day(s), ${S.xp} XP.`),
    h('div',{class:'bubble'},'Nothing to prepare. The next lesson opens as soon as the previous one is done, and Isaiah can jump ahead or replay any step. Your jobs: (1) sit in for the retell on Day 8 and 15 and score it, (2) rate the writing below, (3) be there for Roblox days.')));
  const ov=h('table',{},h('tr',{},h('th',{},'Lesson'),h('th',{},'Days'),h('th',{},'Final quiz'),h('th',{},'Min')),
    catalog().map(c=>{ const st=lessonStats(c.id); const lp=S.lp[c.id]||{}; const f=c.id===AATHI?(lp.tests&&lp.tests.final&&lp.tests.final.A?(lp.tests.final.A.v+lp.tests.final.A.c+lp.tests.final.B.v+lp.tests.final.B.c)+'/18':'–'):(lp.tests&&lp.tests.final?`${lp.tests.final.score}/${lp.tests.final.total}`:'–');
      const mins=Math.round(S.log.filter(l=>(l.lid||AATHI)===c.id).reduce((a,l)=>a+(l.secs||0),0)/60);
      return h('tr',{style:c.id===LID?'font-weight:900':''},h('td',{},`${c.icon||''} U${c.unit}.${c.order} `,h('span',{class:'ml'},c.title),h('div',{class:'mut'},c.titleEn||'')),h('td',{},`${st.done}/${st.tot}`),h('td',{},f),h('td',{},mins||'–')); }));
  wrap.append(h('div',{class:'card'},h('h3',{},'📚 All lessons'),ov));
  wrap.append(h('div',{class:'card'},h('h3',{},`This lesson: ${LESSON.titleEn||''}`),isAathi()?reportEl():lessonReport()));
  const dl=h('table',{},h('tr',{},h('th',{},'Day'),h('th',{},'Mission'),h('th',{},'Done'),h('th',{},'Min')),
    DAYS.concat(isAathi()&&DELAYED?[DELAYED]:[]).map(d=>{ const mins=Math.round(S.log.filter(l=>l.n===d.n&&(l.lid||AATHI)===LID).reduce((a,l)=>a+(l.secs||0),0)/60); return h('tr',{},h('td',{},d.n),h('td',{},d.title,d.mode==='game'?' 🎮':d.mode==='classic'?' 📖':''),h('td',{},dayDone(d.n)?LP.days[d.n].date:'–'),h('td',{},mins||'–')); }));
  wrap.append(h('div',{class:'card'},h('h3',{},'Day log'),dl,
    !isAathi()?null:h('p',{class:'mut'},`Extra scores: Quest A ${LP.extra.questA??'–'}/8 · Classic questions B ${LP.extra.plainB??'–'}/9 · Roblox minutes: day 10 ${LP.extra.rbbuild??'–'}, day 11 ${LP.extra.rbcause??'–'}`)));
  const wc=h('div',{class:'card'},h('h3',{},'Writing samples'));
  Object.keys(WRITE).forEach(k=>{ const w=LP.writing[WRITE[k].key]; if(!w||!w.text)return; const rate=h('select',{onchange:e=>{ LP.ratings[k]=+e.target.value; save(); }},[0,1,2,3].map(v=>h('option',{value:v,selected:(LP.ratings[k]||0)===v},v?'★'.repeat(v):'not rated')));
    wc.append(h('h3',{},WRITE[k].title),h('div',{class:'ml',style:'white-space:pre-wrap;border:1px solid var(--line);border-radius:12px;padding:10px'},w.text),h('div',{class:'row',style:'margin-top:6px'},'Your rating: ',rate)); });
  if(wc.children.length>1)wrap.append(wc);
  const set=h('div',{class:'card'},h('h3',{},'Settings & backup'));
  const dateIn=h('input',{type:'date',value:S.start});
  const unl=h('select',{},[...DAYS.map(d=>d.n),22].map(n=>h('option',{value:n},'Day '+n)));
  const file=h('input',{type:'file',accept:'application/json'});
  const enChk=h('input',{type:'checkbox',onchange:e=>{ S.settings=S.settings||{}; S.settings.en=e.target.checked; save(); }}); enChk.checked=(S.settings||{}).en!==false;
  set.append(h('label',{style:'display:block;margin-bottom:10px'},enChk,' Show English translations by default in quizzes (recommended while Malayalam reading is still at an early level)'),
    h('div',{class:'mut'},'Day 1 date (for the report):'),dateIn,
    h('div',{class:'row',style:'margin:8px 0'},h('button',{class:'btn sec sm',onclick:()=>{ S.start=dateIn.value; save(); alert('Saved'); render(); }},'Save date'),unl,h('button',{class:'btn sec sm',onclick:()=>{ LP.override[unl.value]=true; save(); alert('Unlocked Day '+unl.value); }},'Unlock day')),
    h('p',{class:'mut'},API?(sync.ok?'💾 Progress is saved on this computer in data/aathi.db (SQLite), with automatic snapshots every 10 minutes.':'⚠️ The server is not answering - progress is only in this browser until server.py runs again.'):'⚠️ Opened as a file: progress is only saved in this browser. Start server.py and open http://localhost:8765 to save it in SQLite.'),
    h('div',{class:'row'},h('button',{class:'btn sm',onclick:()=>{ const t=reportText(); (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>alert('Report copied'),()=>prompt('Copy the report:',t)); }},'📋 Copy report'),
      h('button',{class:'btn sm',onclick:()=>{ const a=h('a',{href:URL.createObjectURL(new Blob([JSON.stringify(S,null,1)],{type:'application/json'})),download:`aathi-backup-${today()}.json`}); a.click(); }},'💾 Download backup')),
    h('p',{class:'mut'},'Restore from a backup file:'),file,
    h('div',{class:'row',style:'margin-top:8px'},h('button',{class:'btn sec sm',onclick:()=>{ const f=file.files[0]; if(!f)return; const r=new FileReader(); r.onload=()=>{ try{ S=Object.assign(FRESH(),JSON.parse(r.result)); save(); alert('Restored'); go({name:'home'}); }catch(e){ alert('Invalid file'); } }; r.readAsText(f); }},'Restore'),
      h('button',{class:'btn sec sm',style:'color:var(--bad)',onclick:()=>{ if(confirm('Erase ALL progress on this device?')){ S=FRESH(); save(); go({name:'home'}); } }},'Reset everything')));
  wrap.append(set);
  return wrap;
}

if('speechSynthesis' in window)speechSynthesis.onvoiceschanged=()=>{};
boot();

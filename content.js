/* Content for "ഒരു സ്വപ്നമുണ്ടായിരുന്നു..." (Kerala Padavali, Class 6, pages 48-54; story: Aathi by Sara Joseph).
   Section A = pages 48-49 (taught in GAME mode). Section B = pages 50-52 (taught in CLASSIC mode).
   Words with set 'C' are introduced later for the writing tasks. */

var WORDS = [
  {id:'chathuppu', rom:'chathuppu', ml:'ചതുപ്പ്', en:'swamp / marshy land', set:'A', emoji:'🐸'},
  {id:'varambu', rom:'varambu', ml:'വരമ്പ്', en:'raised strip of earth between fields', set:'A', emoji:'🌾'},
  {id:'noorumeni', rom:'noorumeni', ml:'നൂറുമേനി', en:'a bumper harvest', set:'A', emoji:'🧺'},
  {id:'paribhramam', rom:'paribhramam', ml:'പരിഭ്രമം', en:'nervous worry / panic', set:'A', emoji:'😟'},
  {id:'aavasa', rom:'aavaasavyavastha', ml:'ആവാസവ്യവസ്ഥ', en:'ecosystem', set:'A', emoji:'🦋'},
  {id:'krishikkaran', rom:'krishikkaaran', ml:'കൃഷിക്കാരൻ', en:'farmer', set:'A', emoji:'🧑‍🌾'},
  {id:'thanneer', rom:'thanneerthadam', ml:'തണ്ണീർത്തടം', en:'wetland', set:'B', emoji:'💧'},
  {id:'udampadi', rom:'udampadi', ml:'ഉടമ്പടി', en:'agreement / treaty', set:'B', emoji:'📜'},
  {id:'asthivaram', rom:'asthivaaram', ml:'അസ്ഥിവാരം', en:'foundation of a building', set:'B', emoji:'🏗️'},
  {id:'ettam', rom:'ettam', ml:'ഏറ്റം', en:'rising tide', set:'B', emoji:'🌊'},
  {id:'upajeevanam', rom:'upajeevanam', ml:'ഉപജീവനം', en:'way of earning a living', set:'B', emoji:'🐟'},
  {id:'kandal', rom:'kandal', ml:'കണ്ടൽ', en:'mangrove', set:'B', emoji:'🌿'},
  {id:'aarthi', rom:'aarthi', ml:'ആർത്തി', en:'greed', set:'C', emoji:'😋'},
  {id:'aathmaninda', rom:'aathmaninda', ml:'ആത്മനിന്ദ', en:'guilt / blaming oneself', set:'C', emoji:'😔'}
];
var TEST_VOCAB = {
  A:['chathuppu','varambu','noorumeni','paribhramam','aavasa'],
  B:['thanneer','udampadi','asthivaram','ettam','upajeevanam']
};

/* Comprehension questions. test:true = used in baseline/checkpoint/final tests. */
var COMP = [
 {id:'A1',sec:'A',test:true,scene:'Dinakaran dreams of a quiet life in a land of swamp, forest and water, farming and fishing.',
  q:'ദിനകരന്റെ സ്വപ്നം എന്തായിരുന്നു?',qe:"What was Dinakaran's dream?",
  o:['ചതുപ്പും കാടും വെള്ളവുമുള്ള ദേശത്ത് സമാധാനമായി ജീവിക്കുക','നഗരത്തിൽ വലിയ കെട്ടിടം പണിയുക','വിദേശത്തു പോയി പണം സമ്പാദിക്കുക','ഒരു മീൻപിടുത്തക്കപ്പൽ വാങ്ങുക'],
  oe:['To live peacefully in a land of swamp, forest and water','To build a big building in the city','To go abroad and earn money','To buy a fishing ship'],a:0},
 {id:'A2',sec:'A',test:true,scene:'The "outside world" reaches out with steel hands and scoops up small places.',
  q:"ഈ കഥയിൽ 'പുറംലോകം' എന്നതുകൊണ്ട് എന്താണ് ഉദ്ദേശിക്കുന്നത്?",qe:'What does "the outside world" mean in this story?',
  o:['മറ്റു രാജ്യങ്ങൾ','നഗരവികസനവും അതിനായി പ്രകൃതിയെ ഇല്ലാതാക്കുന്ന ശക്തികളും','ദിനകരന്റെ അയൽക്കാർ','പഴയ കൂട്ടുകാർ'],
  oe:['Other countries','Development, and the forces that destroy nature to build cities',"Dinakaran's neighbours",'Old friends'],a:1},
 {id:'A3',sec:'A',test:true,scene:'Working in the soil, Dinakaran looks for the truth: soil, water, sun, sweat and seed.',
  q:'ദിനകരൻ കണ്ടെത്തിയ ലളിതമായ സത്യം എന്താണ്?',qe:'What simple truth did Dinakaran find?',
  o:['മണ്ണും വെള്ളവും വെയിലും വിയർപ്പും ചേരുമ്പോൾ വിത്തു മുളയ്ക്കും','പണമുണ്ടെങ്കിൽ എന്തും വാങ്ങാം','നഗരത്തിലാണ് സുഖജീവിതം','കഠിനാധ്വാനം ആവശ്യമില്ല'],
  oe:['When soil, water, sun and sweat come together, a seed sprouts','With money you can buy anything','Comfortable life is in the city','Hard work is not needed'],a:0},
 {id:'A4',sec:'A',test:true,scene:'Devaki comes running, out of breath, crying out for help.',
  q:'ദേവകി ഓടിവന്നത് എന്തു പറയാനാണ്?',qe:'Why did Devaki come running?',
  o:['കുഞ്ഞിമാതു വെള്ളത്തിൽനിന്ന് കയറുന്നില്ല','ദിനകരന്റെ അമ്മയ്ക്ക് സുഖമില്ല','വയലിൽ തീപിടിച്ചു','കൊയ്ത്തുകാലം വന്നു'],
  oe:['Kunjimathu is not coming out of the water',"Dinakaran's mother is unwell",'A field caught fire','Harvest season has come'],a:0},
 {id:'A5',sec:'A',scene:'A farmer\'s life depends on five things.',
  q:'കൃഷിക്കാരന്റെ ജീവിതത്തിലെ അഞ്ചു കാര്യങ്ങളിൽ പെടാത്തത് ഏത്?',qe:'Which one is NOT among the five things in a farmer\'s life?',
  o:['വിത്ത്','വെയില്','വിയർപ്പ്','പണം'],oe:['seed','sun','sweat','money'],a:3},
 {id:'A6',sec:'A',scene:'The outside world is like a patient who can never be satisfied.',
  q:'പുറംലോകം ഉരുക്കുകൈകൾകൊണ്ട് എന്താണ് ചെയ്യുന്നത്?',qe:'What does the outside world do with its steel hands?',
  o:['ചെറിയ പ്രദേശങ്ങളെ വേരോടെ പറിച്ചുമാറ്റുന്നു','വയലുകളിൽ വിത്തു വിതയ്ക്കുന്നു','പാലങ്ങൾ പണിയുന്നു','മീൻ പിടിക്കുന്നു'],
  oe:['Uproots and scoops away small places','Sows seeds in fields','Builds bridges','Catches fish'],a:0},
 {id:'A7',sec:'A',scene:'Dinakaran\'s mother hears that Kunjimathu will not come up from the water.',
  q:'ദിനകരന്റെ അമ്മയ്ക്ക് വിചിത്രമായി തോന്നിയത് എന്താണ്?',qe:"What seemed strange to Dinakaran's mother?",
  o:['ഒരാൾ വെള്ളത്തിൽനിന്ന് കയറാതിരിക്കുന്നു എന്ന കാര്യം','ദേവകി ചിരിച്ചുകൊണ്ടു വന്നത്','ദിനകരൻ വൈകി വന്നത്','മഴ പെയ്തത്'],
  oe:['That someone refuses to come out of the water','That Devaki came laughing','That Dinakaran came late','That it rained'],a:0},
 {id:'A8',sec:'A',scene:'Devaki runs across the fields towards Ganesasubrahmanyam\'s land.',
  q:'ദേവകി ഗണേശസുബ്രഹ്മണ്യത്തിന്റെ സ്ഥലത്തേക്കു പോകുന്നതു കണ്ടപ്പോൾ ദിനകരന് എന്തു തോന്നി?',qe:'How did Dinakaran feel when he saw Devaki going to that land?',
  o:['അസ്വസ്ഥത','സന്തോഷം','ഉറക്കം','വിശപ്പ്'],oe:['Uneasy','Happy','Sleepy','Hungry'],a:0},

 {id:'B1',sec:'B',test:true,
  q:'മണ്ണിട്ടു നശിപ്പിച്ച തണ്ണീർത്തടത്തിനു മീതെ എന്താണ് ഉയരുന്നത്?',qe:'What is rising over the wetland that was filled with soil?',
  o:['പുതിയ കണ്ടൽക്കാടുകൾ','കെട്ടിടങ്ങളുടെ അസ്ഥിവാരങ്ങൾ','നെൽപ്പാടങ്ങൾ','കുളങ്ങൾ'],oe:['New mangrove forests','Foundations of buildings','Paddy fields','Ponds'],a:1},
 {id:'B2',sec:'B',test:true,
  q:'ജല ഉടമ്പടിയിൽ ഒപ്പിട്ടവർ ആരെല്ലാം?',qe:'Who "signed" the water treaty?',
  o:['മനുഷ്യർ മാത്രം','മനുഷ്യരും മീൻ, ഞണ്ട്, പക്ഷി, ചെടി തുടങ്ങിയ ജീവികളും','മീനുകൾ മാത്രം','കൃഷിക്കാർ മാത്രം'],
  oe:['Only humans','Humans and fish, crabs, birds, plants and other living things','Only fish','Only farmers'],a:1},
 {id:'B3',sec:'B',test:true,
  q:'കുഞ്ഞിമാത്വമ്മ വെള്ളത്തിൽ ഇരുന്നത് എന്തിനാണ്?',qe:'Why was Kunjimathvamma sitting in the water?',
  o:['മീൻ പിടിക്കാൻ','ഏറ്റം (വേലിയേറ്റം) വരുന്നതു കാത്ത്','കുളിക്കാൻ','ദിനകരനെ കാത്ത്'],oe:['To catch fish','Waiting for the tide to rise','To bathe','Waiting for Dinakaran'],a:1},
 {id:'B4',sec:'B',test:true,
  q:"'ഞാനെങ്ങടൂല്യ... നിങ്ങള് പൊയ്ക്കോ' എന്ന വാക്കുകളിൽനിന്ന് കുഞ്ഞിമാത്വമ്മയെക്കുറിച്ച് എന്തു മനസ്സിലാക്കാം?",qe:'What do the words "I\'m not going anywhere... you go" tell us about her?',
  o:['അവർക്ക് കുടുംബത്തോടു ദേഷ്യമാണ്','വെള്ളത്തോടും ദേശത്തോടും അത്രയ്ക്കു ബന്ധമുള്ളതിനാൽ അവർ അതിനെ വിട്ടുപോകാൻ തയ്യാറല്ല','അവർക്ക് ഒന്നും കേൾക്കാൻ കഴിയില്ല','അവർക്ക് നീന്താൻ പേടിയാണ്'],
  oe:['She is angry with her family','She is so attached to the water and the land that she will not leave it','She cannot hear anything','She is afraid to swim'],a:1},
 {id:'B5',sec:'B',
  q:'ഏറ്റം (വേലിയേറ്റം) ദിനകരനും കുഞ്ഞിമാത്വമ്മയ്ക്കും എത്ര പ്രധാനമാണ്?',qe:'How important is the rising tide to them?',
  o:['ആ വരവില്ലെങ്കിൽ ജീവിതമില്ല, നെല്ലില്ല, മീനില്ല','അതൊരു ശല്യമാണ്','ആർക്കും അതിൽ ശ്രദ്ധയില്ല','അതൊരു വിനോദം മാത്രം'],
  oe:['Without it there is no life, no rice, no fish','It is a nuisance','Nobody notices it','It is just fun'],a:0},
 {id:'B6',sec:'B',
  q:"'വെള്ളത്തിൽ വരച്ച വരപോലെയല്ല മണ്ണിൽ വരയ്ക്കുന്ന വരകൾ' - ഇതിന്റെ ആശയം എന്താണ്?",qe:'"Lines drawn on land are not like lines drawn on water" - what is the idea?',
  o:['മണ്ണിലെ അതിരുകൾ സ്ഥിരമായ വേലികളും മതിലുകളുമായി മാറുന്നു; വെള്ളത്തിനു അതിരില്ല','വെള്ളത്തിൽ വരയ്ക്കാൻ എളുപ്പമാണ്','മണ്ണിൽ ചിത്രം വരയ്ക്കരുത്','വരകൾ ഒന്നിനും കൊള്ളില്ല'],
  oe:['Boundaries on land become permanent fences and walls; water has no boundaries','Drawing on water is easy','Do not draw pictures on soil','Lines are useless'],a:0},
 {id:'B7',sec:'B',
  q:'കുഞ്ഞിമാത്വമ്മയുടെ രൂപം കഥയിൽ എങ്ങനെ വിവരിച്ചിരിക്കുന്നു?',qe:'How is Kunjimathvamma described sitting in the water?',
  o:['വിളറിവെളുത്ത വിരലുകളും കറുത്ത ചുണ്ടുകളും വിറയ്ക്കുന്ന ഉടലും','ചുവന്ന വസ്ത്രവും ചിരിക്കുന്ന മുഖവും','ഉയരമുള്ള ശക്തയായ സ്ത്രീ','കുട പിടിച്ച സ്ത്രീ'],
  oe:['Pale fingers, dark lips and a trembling body','Red dress and a smiling face','A tall strong woman','A woman holding an umbrella'],a:0},
 {id:'B8',sec:'B',
  q:"'കരിങ്കൽക്കെട്ടുകളിൽ വന്നലച്ചു നിലവിളിക്കുന്ന വെള്ളം' എന്തിനെ സൂചിപ്പിക്കുന്നു?",qe:'What does "water crying against the stone walls" suggest?',
  o:['വെള്ളത്തിനു പോകാൻ വഴിയില്ലാതായി; അത് പ്രകൃതിയുടെ ദുഃഖമാണ്','കല്ലുകൾ മനോഹരമാണ്','മഴ കൂടുതലാണ്','ആരോ പാടുന്നു'],
  oe:['The water has no path any more; it is nature\'s grief','The stones are beautiful','There is too much rain','Someone is singing'],a:0},
 {id:'B9',sec:'B',
  q:"'വെള്ളം വന്നാ വന്നപോലെ ജീവിക്കും. വന്നില്ലെങ്കിൽ വരാത്തപോലെ ജീവിക്കണം' - ദേവകി എന്താണ് പറയുന്നത്?",qe:'What is Devaki saying with these words?',
  o:['സാഹചര്യം മാറുമ്പോൾ അതിനനുസരിച്ചു ജീവിക്കാൻ പഠിക്കണം','വെള്ളത്തെ ഒഴിവാക്കണം','ഒന്നും ചെയ്യേണ്ട','മറ്റൊരു ദേശത്തു പോകണം'],
  oe:['We must learn to live according to how things change','Avoid the water','Do nothing','Move to another place'],a:0}
];

/* Key sentences (the child reads the full text in the textbook; these are the anchor lines). */
var SENT = [
 {id:'s1',rom:"Dinakaranu oru swapnamundaayirunnu.",sec:'A',page:48,ml:'ദിനകരന് ഒരു സ്വപ്നമുണ്ടായിരുന്നു.',en:'Dinakaran had a dream.',gloss:[['സ്വപ്നം','dream']]},
 {id:'s2',rom:"Chathuppum kaadum vellavumaayikkidakkunna deshathu samaadhaanamaayittu jeevikkuka enna swapnam.",sec:'A',page:48,ml:'ചതുപ്പും കാടും വെള്ളവുമായിക്കിടക്കുന്ന ദേശത്ത് സമാധാനമായിട്ട് ജീവിക്കുക എന്ന സ്വപ്നം.',en:'The dream of living peacefully in a land of swamp, forest and water.',gloss:[['ചതുപ്പ്','swamp'],['സമാധാനം','peace']]},
 {id:'s3',rom:"Puramlokam pakshe, swayam maarimariyuka maathramalla, kaineettukakoodiyaanu.",sec:'A',page:48,ml:'പുറംലോകം പക്ഷേ, സ്വയം മാറിമറിയുക മാത്രമല്ല, കൈനീട്ടുകകൂടിയാണ്.',en:'But the outside world does not only change by itself - it also reaches out its hand.',gloss:[['പുറംലോകം','outside world'],['കൈനീട്ടുക','to stretch out a hand']]},
 {id:'s4',rom:"Enthum veroode parichedukkaan sheshiyulla urukkukaikalkondu puramlokam kochupradeshangale korimaattikkalayunnu.",sec:'A',page:48,ml:'എന്തും വേരോടെ പറിച്ചെടുക്കാൻ ശേഷിയുള്ള ഉരുക്കുകൈകൾകൊണ്ട് പുറംലോകം കൊച്ചുപ്രദേശങ്ങളെ കോരിമാറ്റിക്കളയുന്നു.',en:'With steel hands that can uproot anything, the outside world scoops away small places.',gloss:[['വേര്','root'],['ഉരുക്ക്','steel']]},
 {id:'s5',rom:"Mannum vellavum veyilum viyarppum koodiyaanu vithine mulappikkunnathu.",sec:'A',page:49,ml:'മണ്ണും വെള്ളവും വെയിലും വിയർപ്പും കൂടിയാണ് വിത്തിനെ മുളപ്പിക്കുന്നത്.',en:'Soil, water, sun and sweat together make a seed sprout.',gloss:[['വിത്ത്','seed'],['വിയർപ്പ്','sweat']]},
 {id:'s6',rom:"Noorumeni vilayikkunnavanaanu krishikkaaran.",sec:'A',page:49,ml:'നൂറുമേനി വിളയിക്കുന്നവനാണ് കൃഷിക്കാരൻ.',en:'A farmer is one who grows a hundredfold harvest.',gloss:[['നൂറുമേനി','bumper harvest']]},
 {id:'s7',rom:"Avalu vellatheenn kernilya.",sec:'A',page:49,ml:'അവള് വെള്ളത്തീന്ന് കേറ്ണില്യ.',en:'She is not coming up out of the water. (spoken dialect)',gloss:[['കേറ്ണില്യ','is not coming up']]},
 {id:'s8',rom:"Ente koode onnu vaayo mone!",sec:'A',page:49,ml:'എന്റെകൂടെ ഒന്ന് വായോ മോനേ!',en:'Please come with me, son!',gloss:[['വായോ','come']]},
 {id:'s9',rom:"Vellathil varacha vara poleyalla mannil varaykkunna varakal.",sec:'B',page:50,ml:'വെള്ളത്തിൽ വരച്ച വര പോലെയല്ല മണ്ണിൽ വരയ്ക്കുന്ന വരകൾ.',en:'Lines drawn on land are not like lines drawn on water.',gloss:[['വര','line']]},
 {id:'s10',rom:"Aazhameriya snehathinte udampadiyilaayirunnu avarum aa thadaakavum.",sec:'B',page:50,ml:'ആഴമേറിയ സ്നേഹത്തിന്റെ ഉടമ്പടിയിലായിരുന്നു അവരും ആ തടാകവും.',en:'They and the lake were bound by a deep agreement of love.',gloss:[['ഉടമ്പടി','agreement'],['തടാകം','lake']]},
 {id:'s11',rom:"Nee njangalkku vellavum upajeevanavum tharum. Njangal ninnil vela cheyyukayum ninne paripaalikkukayum cheyyum.",sec:'B',page:50,ml:'നീ ഞങ്ങൾക്ക് വെള്ളവും ഉപജീവനവും തരും. ഞങ്ങൾ നിന്നിൽ വേല ചെയ്യുകയും നിന്നെ പരിപാലിക്കുകയും ചെയ്യും.',en:'You give us water and a living; we will work on you and take care of you.',gloss:[['ഉപജീവനം','livelihood'],['പരിപാലിക്കുക','to look after']]},
 {id:'s12',rom:"Aa varavillenkil jeevithamilla, nellilla, meenilla.",sec:'B',page:51,ml:'ആ വരവില്ലെങ്കിൽ ജീവിതമില്ല, നെല്ലില്ല, മീനില്ല.',en:'Without that arrival (of the tide) there is no life, no rice, no fish.',gloss:[['നെല്ല്','paddy / rice']]},
 {id:'s13',rom:"Vellam vanna vannapole jeevikkum. Vannillenkil varaathapole jeevikkanam.",sec:'B',page:51,ml:'വെള്ളം വന്നാ വന്നപോലെ ജീവിക്കും. വന്നില്ലെങ്കിൽ വരാത്തപോലെ ജീവിക്കണം.',en:'If the water comes we live as it comes; if it does not, we must live as if it never comes. (Devaki)',gloss:[]},
 {id:'s14',rom:"Karinkalkkettukalil vannalachu nilavilikkunna vellam.",sec:'B',page:52,ml:'കരിങ്കൽക്കെട്ടുകളിൽ വന്നലച്ചു നിലവിളിക്കുന്ന വെള്ളം.',en:'The water, rushing against the stone walls and crying out.',gloss:[['കരിങ്കല്ല്','granite stone'],['നിലവിളി','cry']]},
 {id:'s15',rom:"Njaanengadoolya... ningalu poykko.",sec:'B',page:52,ml:'ഞാനെങ്ങടൂല്യ... നിങ്ങള് പൊയ്ക്കോ.',en:"I'm not going anywhere... you go. (Kunjimathvamma)",gloss:[]}
];

var BUILD = [
 {rom:'Dinakaranu oru swapnamundaayirunnu',ch:['ദിനകരന്','ഒരു','സ്വപ്നമുണ്ടായിരുന്നു'],en:'Dinakaran had a dream.'},
 {rom:'Mannum vellavum veyilum viyarppum koodiyaanu vithine mulappikkunnathu',ch:['മണ്ണും','വെള്ളവും','വെയിലും','വിയർപ്പും','കൂടിയാണ്','വിത്തിനെ','മുളപ്പിക്കുന്നത്'],en:'Soil, water, sun and sweat together make the seed sprout.'},
 {rom:'Noorumeni vilayikkunnavanaanu krishikkaaran',ch:['നൂറുമേനി','വിളയിക്കുന്നവനാണ്','കൃഷിക്കാരൻ'],en:'The farmer is the one who grows a bumper harvest.'},
 {rom:'Puramlokam pakshe swayam maarimariyuka maathramalla kaineettukakoodiyaanu',ch:['പുറംലോകം','പക്ഷേ','സ്വയം','മാറിമറിയുക','മാത്രമല്ല','കൈനീട്ടുകകൂടിയാണ്'],en:'But the outside world does not only change by itself, it also reaches out.'},
 {rom:'Ente koode onnu vaayo mone',ch:['എന്റെകൂടെ','ഒന്ന്','വായോ','മോനേ'],en:'Please come with me, son!'}
];

var ESSAY_POINTS = ['പ്രകൃതിയുടെ സ്വാഭാവികമായ അവസ്ഥ','മനുഷ്യന്റെ ഇടപെടൽ','ആവാസവ്യവസ്ഥയ്ക്കു വരുന്ന മാറ്റം','ജലക്ഷാമം','പ്രകൃതിദുരന്തങ്ങൾ','ജീവിവർഗങ്ങളുടെ വംശനാശം'];
var ESSAY_EN = ['natural state of nature','human interference','change in the ecosystem','water shortage','natural disasters','extinction of species'];

var SIM_QS = [
 {id:'R1',q:'തണ്ണീർത്തടവും കണ്ടലും കുറഞ്ഞപ്പോൾ ഞണ്ടിനും പക്ഷിക്കും എന്തു സംഭവിച്ചു?',qe:'When wetland and mangroves shrank, what happened to crabs and birds?',
  o:['എണ്ണം കുറഞ്ഞു - ജീവികൾ പരസ്പരം ആശ്രയിക്കുന്നു','ഒന്നും സംഭവിച്ചില്ല','എണ്ണം കൂടി','അവ നഗരത്തിൽ പോയി'],oe:['They decreased - living things depend on each other','Nothing happened','They increased','They went to the city'],a:0},
 {id:'R2',q:'"എല്ലാ മനുഷ്യരുടെയും ആവശ്യങ്ങൾക്കുള്ള വിഭവങ്ങൾ ഭൂമിയിലുണ്ട്. എന്നാൽ ഒരാളുടെയും ആർത്തി തീർക്കാനുള്ളതില്ല" - ഗാന്ധിജി. ഇതിന്റെ ആശയം?',qe:'Gandhi: "The earth has enough for everyone\'s need, but not for anyone\'s greed." What is the idea?',
  o:['ആവശ്യത്തിനു മാത്രം എടുക്കണം; ആർത്തി പ്രകൃതിയെ നശിപ്പിക്കും','എല്ലാവരും കൂടുതൽ എടുക്കണം','ഭൂമിയിൽ ഒന്നുമില്ല','പണം മാത്രമാണ് പ്രധാനം'],oe:['Take only what is needed; greed destroys nature','Everyone should take more','There is nothing on earth','Only money matters'],a:0}
];

var RETELL = {
  A:['Names Dinakaran and tells his dream (peaceful life in the wetland)','Says the "outside world" is scooping up / destroying small places','Tells the farmer\'s truth: soil, water, sun, sweat, seed','Tells that Devaki ran in because Kunjimathu would not come out of the water'],
  B:['Explains the "water treaty" between people, animals and the wetland','Says buildings\' foundations are rising where the wetland was filled','Says Kunjimathvamma waits in the water for the tide','Tells her refusal ("I\'m not going") or the water crying on the stone walls'],
  F:['Names the main characters (Dinakaran, Devaki, Kunjimathvamma)','Tells Dinakaran\'s dream','Explains how the outside world destroys the wetland','Explains the water treaty / what the wetland gave people','Tells Kunjimathvamma\'s waiting and refusal to leave','Gives the message in his own words (greed, caring for nature)']
};

var INFO = {
 welcome:{title:'Welcome! സ്വാഗതം',html:`<p>For the next <b>15 days</b> you will explore the story <b class="ml">ഒരു സ്വപ്നമുണ്ടായിരുന്നു...</b> (pages 48–54 of your Malayalam book). It is a piece from a novel called <i>Aathi</i> by Sara Joseph.</p>
  <p>Each day has a short <b>mission</b> (15–20 minutes). Earn ⭐ XP, build a streak and unlock the next day.</p>
  <p><b>Today:</b> a quick starting quiz. Do not worry about the score — it only shows where you begin. English help is on, and every Malayalam line also shows how it sounds in English letters. The answers are not shown until later.</p>`},
 story:{title:'The story in English',img:'img/excavator.jpg',html:`<p><b>Dinakaran</b> is a young farmer. He dreams of a peaceful life in a wetland village full of swamp, forest and water, where people farm, fish and collect clams.</p>
  <p>But the <b>"outside world"</b> keeps stretching out steel hands (like excavators) to scoop up small places and fill them with soil to build big buildings.</p>
  <p>One day <b>Devaki</b> runs to tell Dinakaran that <b>Kunjimathu</b> (called <b>Kunjimathvamma</b>, an old woman) will not come out of the water. For ten or fourteen days the tide has not risen, because the wetland was filled in. She sits in the water waiting for it.</p>
  <p>Long ago the people, the fish, the crabs, birds, plants and the lake made a promise (a <b>water treaty</b>): <i>"You give us water and a living; we will work for you and look after you."</i> Now that promise is broken. Stone walls stand where water once flowed.</p>
  <p>At the end Kunjimathvamma says: <b class="ml">"ഞാനെങ്ങടൂല്യ... നിങ്ങള് പൊയ്ക്കോ."</b> — "I'm not going anywhere... you go."</p>
  <p><b>Big idea:</b> nature and people depend on each other. If we take more than we need (greed), the whole system breaks.</p>`},
 sectionA:{title:'Scenes of pages 48–49',html:'<p>Today we meet Dinakaran, his dream, the "outside world", and the moment Devaki comes running. You will read key lines and play with the sentences.</p>'}
};

var ROBLOX = {
 build:{title:'Roblox Day 1: Explore the wetland of Aathi',items:[
  'Open the "Aathi" place in Roblox Studio (or the Roblox game link your parent shares) and press Play.',
  'Walk around the wetland. Find the water, the mangroves (കണ്ടൽ), the paddy field (നെൽപ്പാടം), the bund (വരമ്പ്) and the swamp (ചതുപ്പ്).',
  'Walk up to the glowing labels and press E on at least 8 of them to learn the word and HEAR it in Malayalam (press E again to hear it again). Watch the "Words" score on the leaderboard go up.',
  'Press E next to Dinakaran, Devaki and Kunjimathvamma and listen to what each says in Malayalam, then say it back. (Each message shows the Malayalam, how it sounds in English letters, and the English. Say each line aloud, then find it in your book.)',
  'Find all 5 kinds of living things: fish, crab, frog, bird, butterfly. Tell a parent their Malayalam names (മീൻ, ഞണ്ട്, തവള, പക്ഷി, ശലഭം).',
  'Read the Water Treaty stone (ഉടമ്പടി). Find its lines in your textbook, page 50.',
  'Tell a parent three things in the world that are alive and what each one needs.',
  'Optional: add one thing of your own in Roblox Studio (a new sign, a tree, an animal).']},
 cause:{title:'Roblox Day 2: The outside world arrives',items:[
  'Press Play. Stand near the scoreboard and write down the numbers: fish, crabs, frogs, birds, butterflies, mangroves, tide.',
  'Go to the RED button and press E. Watch the yellow excavator fill one part of the wetland. Write the new numbers.',
  'Press the red button until the whole wetland is filled. After each press note which numbers dropped first and why you think so.',
  'Look for the building foundations (അസ്ഥിവാരം) that appear on the concrete. Find where the book says this (page 50).',
  'Find Kunjimathvamma. What does she say now? Find her words on page 52 of the book.',
  'Now press the GREEN button until the water is back. What happens to the animals and the numbers?',
  'Tell a parent: "What happened to the animals when the water went away? Why? What does this have to do with the greed in Gandhi\'s words?"']}
};

var TASKS = {
 copyWords:{title:'Notebook task: copy the wetland words',items:[
  'Open your notebook. Write each of these words twice with its meaning: തണ്ണീർത്തടം, ഉടമ്പടി, അസ്ഥിവാരം, ഏറ്റം, ഉപജീവനം, കണ്ടൽ.',
  'Read the six words aloud to a parent.']},
 findSent:{title:'Textbook task: find the sentences (page 52–53)',items:[
  'Find the sentence about Dinakaran\'s dream.',
  'Find what the outside world does to small places.',
  'Find the simple truth Dinakaran found.',
  'Find the five important things in a farmer\'s life.',
  'Find what seemed strange to Dinakaran\'s mother.',
  'Find the condition of Ganesasubrahmanyam\'s land.',
  'Find the "water treaty" lines.',
  'Find how Kunjimathvamma looked sitting in the water, and her reply to Dinakaran.',
  'Read each sentence you found aloud.']},
 act:{title:'Act it out!',items:[
  'Pick roles: Dinakaran, Devaki, Kunjimathvamma, Karthyani (with a parent or sibling).',
  'Read or say the dialogue from pages 49–52 with feeling.',
  'Try Kunjimathvamma\'s last line: "ഞാനെങ്ങടൂല്യ... നിങ്ങള് പൊയ്ക്കോ."',
  'Record a short video or just perform it for the family.']}
};

var WRITE = {
 dialogue:{title:'Write: Water and Kunjimathvamma talk',prompt:'വെള്ളവും കുഞ്ഞിമാത്വമ്മയും തമ്മിലുള്ള സംഭാഷണം എഴുതൂ.',en:'Write a conversation between the water and Kunjimathvamma (3–6 lines each if you can). Write in Malayalam, or in English letters (like "vellam"), or in English first and then try Malayalam. Any of these is fine!',
  starters:['വെള്ളം: ','കുഞ്ഞിമാത്വമ്മ: ','Water: ','Kunjimathvamma: '],min:30,key:'dialogue'},
 essay:{title:'Write: Nature and humans',prompt:'പ്രകൃതിക്കുമേലുള്ള മനുഷ്യന്റെ ഇടപെടലിനെക്കുറിച്ച് ഒരു ലഘുഉപന്യാസമെഴുതൂ.',en:'Write a short essay about humans interfering with nature. Use your ordered points. Aim for 6–10 sentences.',
  starters:['പ്രകൃതി ','മനുഷ്യൻ ','ആർത്തി ','Nature ','People '],min:60,key:'essay'}
};

/* Day plan. mode: 'game' = new method (Section A), 'classic' = usual method (Section B). */
var DAYS = [
 {n:1,title:'Meet the story',ml:'കഥയെ പരിചയപ്പെടാം',steps:[{t:'info',k:'welcome'},{t:'test',name:'baseline'},{t:'story'}]},
 {n:2,title:'Pages 48–49: read & build sentences',ml:'വായിക്കാം, വാക്യം ഒരുക്കാം',mode:'game',steps:[{t:'read',sec:'A',mode:'game'},{t:'builder'}]},
 {n:3,title:'Wetland words (A): flip, match, memory',ml:'വാക്കുകൾ കളിച്ചു പഠിക്കാം',mode:'game',steps:[{t:'cards',set:'A',mode:'game'},{t:'match',set:'A'},{t:'memory',set:'A'}]},
 {n:4,title:'Quest: Dinakaran\'s Land',ml:'ദിനകരന്റെ ദേശം - ക്വസ്റ്റ്',mode:'game',steps:[{t:'warmup',sets:['A'],mode:'game'},{t:'quest'}]},
 {n:5,title:'Pages 50–52: read the story',ml:'കഥ വായിക്കാം',mode:'classic',steps:[{t:'read',sec:'B',mode:'classic'}]},
 {n:6,title:'Wetland words (B): study list',ml:'വാക്കുകൾ പഠിക്കാം',mode:'classic',steps:[{t:'cards',set:'B',mode:'classic'},{t:'task',k:'copyWords'}]},
 {n:7,title:'Questions on pages 50–52',ml:'ചോദ്യോത്തരങ്ങൾ',mode:'classic',steps:[{t:'cards',set:'B',mode:'classic',review:true},{t:'plainq'}]},
 {n:8,title:'Checkpoint test',ml:'ചെക്ക്പോയിന്റ് ടെസ്റ്റ്',steps:[{t:'test',name:'checkpoint'},{t:'retell',name:'checkpoint',parts:['A','B']}]},
 {n:9,title:'Wetland simulator',ml:'തണ്ണീർത്തട സിമുലേറ്റർ',steps:[{t:'warmup',sets:['A','B'],mode:'game'},{t:'sim'}]},
 {n:10,title:'Roblox: build the wetland',ml:'റോബ്ലോക്സിൽ ആതി ഉണ്ടാക്കാം',steps:[{t:'roblox',k:'build'}]},
 {n:11,title:'Roblox: the outside world arrives',ml:'പുറംലോകം വരുന്നു',steps:[{t:'warmup',sets:['A','B'],mode:'game'},{t:'roblox',k:'cause'}]},
 {n:12,title:'Find the sentences & act the scene',ml:'വാക്യങ്ങൾ കണ്ടെത്താം, അഭിനയിക്കാം',steps:[{t:'task',k:'findSent'},{t:'task',k:'act'}]},
 {n:13,title:'Write: water and Kunjimathvamma',ml:'വെള്ളവും കുഞ്ഞിമാത്വമ്മയും',steps:[{t:'cards',set:'C',mode:'game'},{t:'write',k:'dialogue'}]},
 {n:14,title:'Essay: nature and humans',ml:'പ്രകൃതിയും മനുഷ്യനും',steps:[{t:'warmup',sets:['A','B','C'],mode:'game'},{t:'order'},{t:'write',k:'essay'}]},
 {n:15,title:'Final test & report',ml:'അവസാന ടെസ്റ്റ്',steps:[{t:'test',name:'final'},{t:'retell',name:'final',parts:['F']},{t:'report'}]}
];
var DELAYED = {n:22,title:'One-week-later test (optional)',ml:'ഒരാഴ്ചയ്ക്കുശേഷമുള്ള ടെസ്റ്റ്',steps:[{t:'test',name:'delayed'},{t:'retell',name:'delayed',parts:['F']},{t:'report'}]};

const LEVELS = [[0,'ജലകണം 💧'],[150,'തോണി 🛶'],[400,'കണ്ടൽ 🌿'],[800,'ആതി നായകൻ 🌊'],[1300,'പ്രകൃതിസംരക്ഷകൻ 🏆']];

/* Register this built-in lesson (Unit 3, lesson 3). Other lessons live in lessons/<id>/data.js. */
(window.LESSONS=window.LESSONS||{})['u3-l3-aathi']={id:'u3-l3-aathi',unit:3,order:3,builtin:true,title:'ഒരു സ്വപ്നമുണ്ടായിരുന്നു...',titleEn:'There Was a Dream (from Aathi)',icon:'🌊',
  WORDS,TEST_VOCAB,COMP,SENT,BUILD,ESSAY_POINTS,ESSAY_EN,SIM_QS,RETELL,INFO,ROBLOX,TASKS,WRITE,DAYS,DELAYED};

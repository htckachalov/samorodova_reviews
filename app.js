const BASE='web/';
const $=id=>document.getElementById(id);
function cnt(el,t,d){let s=null;const f=ts=>{if(!s)s=ts;const p=Math.min((ts-s)/d,1);el.textContent=Math.floor(p*t).toLocaleString('ru-RU')+(el.dataset.plus&&p===1?'+':'');if(p<1)requestAnimationFrame(f);else el.textContent=t.toLocaleString('ru-RU')+(el.dataset.plus?'+':'')};requestAnimationFrame(f)}
$('c1').dataset.plus=1;cnt($('c1'),3000,1600);cnt($('c2'),DATA.items.length,1600);cnt($('c3'),18,1200);
function open_(src){$('modi').src=BASE+src;$('mod').classList.add('on')}
// RESULTS
let rk=DATA.res[0][0];
$('rtabs').innerHTML=DATA.res.map(([k,n,s])=>`<button class="rtab${k===rk?' on':''}" data-k="${k}">${n}</button>`).join('');
function drawRes(){$('rgrid').innerHTML=DATA.curated[rk].map(c=>`<div class="rcard">${c.w?`<div class="rwhen">${c.w}</div>`:''}<div class="rmetric">${c.m}</div><div class="rauthor">${c.a}</div><div class="rtext">${c.t}</div><img class="rimg" loading="lazy" src="${BASE+c.i}" onclick="open_('${c.i}')"></div>`).join('')}
$('rtabs').onclick=e=>{const b=e.target.closest('.rtab');if(!b)return;rk=b.dataset.k;document.querySelectorAll('.rtab').forEach(x=>x.classList.toggle('on',x===b));drawRes()};
drawRes();
// SEARCH
const STOP=new Set(['и','в','на','я','не','что','это','а','как','с','у','мне','мой','моя','по','за','к','о','от','до','же','ли','бы','то','ты','вы','он','она','было','был','быть','есть','для','из','но','да','нет','так','вот','еще','ещё','уже','там','тут','все','всё','очень','просто','если','когда','можно','надо','буду','быть','хочу','меня','тебя','вообще','себя']);
const SYN={'дорог':['не пожалел','окупил','стоимост','вложил','заплатил','стоит'],'цен':['дорог','стоимост','окупил','не пожалел'],'деньг':['заработ','доход','оплат','клиент'],'заработ':['доход','оплат','клиент','бюджет'],'работ':['ваканс','собеседован','взяли','агентств','клиент'],'страш':['боял','страх','сомнева','переживал'],'бо':['боял','страх','сомнева'],'нул':['с нуля','новичок','не понимала','ничего не знала'],'нович':['с нуля','не понимала','ничего не знала'],'потян':['смогу','сложно','справ','боял'],'клиент':['заказчик','проект','бюджет','договор','оплат'],'возраст':['лет','поздно','взросл'],'врем':['совмеща','график','успева','работой'],'диплом':['переподготов','сертификат','документ']};
const NEG={'дорог':['дорогая','дорогие','дорогой наш','дорогая наша','дорогие наши']};
function stem(w){return w.replace(/(ами|ями|ого|ему|ыми|ими|ать|ять|ешь|ишь|ует|ают|ают|ся|ов|ей|ий|ый|ая|ое|ые|ую|ом|ах|ях|ам|ям|ты|ти|ла|ло|ли|ет|ит|у|а|о|ы|и|е|ь|й)$/,'')}
function search(q){
 const base=q.toLowerCase().split(/[^а-яёa-z0-9]+/).filter(w=>w.length>2&&!STOP.has(w)).map(stem);
 if(!base.length)return[];
 let extra=[],neg=[];
 base.forEach(w=>{for(const k in SYN){if(w.startsWith(k)||k.startsWith(w))extra=extra.concat(SYN[k])}
                  for(const k in NEG){if(w.startsWith(k))neg=neg.concat(NEG[k])}});
 const cnt=(s,w)=>{let n=0,i=0;while((i=s.indexOf(w,i))>-1){n++;i+=w.length}return n};
 return DATA.items.map(it=>{const low=it.q.toLowerCase();
   let b=0;base.forEach(w=>{b+=cnt(low,w)*3});
   if(!b)return{it,s:0};
   let s=b;
   extra.forEach(w=>{if(low.includes(w))s+=1.2});
   neg.forEach(w=>{s-=cnt(low,w)*3});
   return{it,s}})
  .filter(x=>x.s>0).sort((a,b)=>b.s-a.s||b.it.p-a.it.p).map(x=>x.it);
}
function grid(list,limit){
 if(!list.length)return '<div class="empty">По этим словам ничего не нашлось. Попробуй сказать иначе - например «страшно», «с нуля», «клиенты».</div>';
 const sh=list.slice(0,limit);
 return '<div class="masonry">'+sh.map(it=>`<div class="mcard" onclick="open_('${it.i}')"><img loading="lazy" src="${BASE+it.i}"></div>`).join('')+'</div>';
}
const CHIPS=['а не дорого ли это','боюсь, что не потяну','я вообще с нуля','где брать клиентов','сколько заработали','взяли на работу','я уже училась раньше','как совмещать с работой'];
$('chips').innerHTML=CHIPS.map(c=>`<button class="chip">${c}</button>`).join('');
$('chips').onclick=e=>{if(e.target.classList.contains('chip')){$('q').value=e.target.textContent;run()}};
let lim=24;
function run(){const q=$('q').value.trim();if(!q){$('sres').innerHTML='';return}
 const r=search(q);lim=24;
 $('sres').innerHTML=`<div class="scount">Нашлось <b>${r.length}</b> переписок</div>`+grid(r,lim)+(r.length>lim?'<button class="more" id="mr">Показать ещё →</button>':'');
 const m=$('mr');if(m)m.onclick=()=>{lim+=36;const rr=search($('q').value);$('sres').innerHTML=`<div class="scount">Нашлось <b>${rr.length}</b> переписок</div>`+grid(rr,lim)+(rr.length>lim?'<button class="more" id="mr">Показать ещё →</button>':'');const m2=$('mr');if(m2)m2.onclick=arguments.callee}}
let t;$('q').oninput=()=>{clearTimeout(t);t=setTimeout(run,280)};
// TABS
$('tabs').innerHTML=DATA.tabs.map(([k,q,kick])=>`<button class="tab" data-k="${k}"><div class="tab-kicker">${kick}</div><div class="tab-q">${q}</div></button>`).join('');
let tl=20;
$('tabs').onclick=e=>{const b=e.target.closest('.tab');if(!b)return;
 const k=b.dataset.k;document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x===b));
 tl=20;const list=DATA.items.filter(i=>i.t.includes(k)).sort((x,y)=>y.p-x.p);
 const draw=()=>{$('tabout').innerHTML=grid(list,tl)+(list.length>tl?'<button class="more" id="tm">Показать ещё →</button>':'');const m=$('tm');if(m)m.onclick=()=>{tl+=36;draw()}};
 draw();$('tabout').scrollIntoView({behavior:'smooth',block:'start'})};
// WALL
$('wall').innerHTML=[...DATA.items].sort((x,y)=>y.p-x.p).map(it=>`<img loading="lazy" src="${BASE+it.i}" onclick="open_('${it.i}')">`).join('');

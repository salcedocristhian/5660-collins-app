'use strict';
(() => {
  const DATA_PATH='./data/notices.json';
  const STORAGE_KEY='5660-resident-feed-v1';
  const LANGUAGE_KEY='5660-resident-language-v1';
  const POLL_INTERVAL=90_000;
  const $=(id)=>document.getElementById(id);
  const storage={getItem(k){try{return window.localStorage.getItem(k)}catch{return null}},setItem(k,v){try{window.localStorage.setItem(k,v)}catch{}}};
  const safeStr=v=>typeof v==='string'?v:'';
  const translations={
    en:{eyebrow:'5660 COLLINS · RESIDENT INFORMATION',heroTitle:'Your building.<br><em>Your updates.</em>',heroText:'A clear, reliable place for resident notices, project progress and what happens next.',heroNotices:'Read notices ↗',heroProjects:'View projects ↓',latestUpdate:'LATEST INFORMATION',residentNotices:'RESIDENT NOTICES',noticeHeading:'The latest, in one place.',noticeSub:'Important developments that residents should know.',directory:'PROJECT DIRECTORY',projectsHeading:'Where things stand.',projectsSub:'Permits, construction and milestones—without guesswork.',answerDesk:'RESIDENT ANSWER DESK',faqHeading:'Frequently asked questions.',faqSub:'Simple answers based on the latest dated project records.',contactHeading:'Need a current update?',contactText:'For your exact floor, access or urgent building matters, contact Building Management directly.',contactButton:'Email Building Management ↗',emergency:'For emergencies, call 911.',important:'Please note',legal:'An application is not an issued permit. Work dates are estimates until confirmed by the City, contractors and Management. This site is not an emergency notification system.',footer:'Resident Project Line · Miami Beach, Florida',backTop:'Back to top ↑',navNotices:'Notices',navProjects:'Projects',navAnswers:'Answers',navContact:'Contact',refresh:'Refresh',loading:'Checking for updates…',online:'Information loaded',stale:'Offline / saved information',error:'Information temporarily unavailable',review:'Preview for Management review. Confirm approval before public distribution.',updated:'Last published',checked:'Checked',notices:'notices',none:'No results found. Try another search.',search:'Search projects and permits',allCategories:'All categories',residentAction:'What residents should know',importantFlag:'Important',active:'Current notice',status:{pending:'Permit pending',design:'Design coordination',issued:'Permit issued','in-progress':'In progress',operational:'Operational'},cats:{permits:'Permits',infrastructure:'Infrastructure','life-safety':'Life safety',amenities:'Amenities',access:'Resident access'},dateLocale:'en-US',offlineDetail:'Showing the last saved copy; verify dates with Management.'},
    es:{eyebrow:'5660 COLLINS · INFORMACIÓN PARA RESIDENTES',heroTitle:'Tu edificio.<br><em>Tus novedades.</em>',heroText:'Un espacio claro y confiable para avisos, avances y próximos pasos de tu edificio.',heroNotices:'Leer avisos ↗',heroProjects:'Ver proyectos ↓',latestUpdate:'INFORMACIÓN MÁS RECIENTE',residentNotices:'AVISOS PARA RESIDENTES',noticeHeading:'Lo más reciente, en un solo lugar.',noticeSub:'Novedades importantes que debes conocer.',directory:'DIRECTORIO DE PROYECTOS',projectsHeading:'Estado de los proyectos.',projectsSub:'Permisos, construcción e hitos sin suposiciones.',answerDesk:'PREGUNTAS DE RESIDENTES',faqHeading:'Preguntas frecuentes.',faqSub:'Respuestas sencillas basadas en información fechada.',contactHeading:'¿Necesitas información actual?',contactText:'Para conocer trabajos en tu piso, accesos o asuntos urgentes, comunícate con la Administración.',contactButton:'Escribir a Administración ↗',emergency:'Para emergencias, llama al 911.',important:'Importante',legal:'Una solicitud no equivale a un permiso emitido. Las fechas son estimativas hasta que las confirmen la Ciudad, contratistas y Administración. Esta web no es un sistema de avisos de emergencia.',footer:'Resident Project Line · Miami Beach, Florida',backTop:'Volver arriba ↑',navNotices:'Avisos',navProjects:'Proyectos',navAnswers:'Preguntas',navContact:'Contacto',refresh:'Actualizar',loading:'Buscando actualizaciones…',online:'Información cargada',stale:'Sin conexión / copia guardada',error:'Información temporalmente no disponible',review:'Vista previa pendiente de revisión por Administración. Confirmar aprobación antes de distribuir a los residentes.',updated:'Última publicación',checked:'Consultado',notices:'avisos',none:'No hay resultados. Prueba otra búsqueda.',search:'Buscar proyectos y permisos',allCategories:'Todas las categorías',residentAction:'Qué deben saber los residentes',importantFlag:'Importante',active:'Aviso actual',status:{pending:'Permiso pendiente',design:'Coordinación de diseños',issued:'Permiso emitido','in-progress':'En trámite',operational:'Operativo'},cats:{permits:'Permisos',infrastructure:'Infraestructura','life-safety':'Seguridad de vida',amenities:'Amenidades',access:'Accesos'},dateLocale:'es-US',offlineDetail:'Se muestra la última copia guardada; confirme fechas con Administración.'}
  };
  let lang=storage.getItem(LANGUAGE_KEY)==='es'?'es':'en';
  let feed=null, filter='',category='all',lastCheck=null,offline=false,loading=false;
  const t=()=>translations[lang];
  const val=v=>safeStr(v?.[lang]||v?.en||'');
  const node=(name,cls,text)=>{const el=document.createElement(name);if(cls)el.className=cls;if(text!==undefined)el.textContent=String(text);return el};
  const fmtDate=(value,withTime=false)=>{if(!value)return '—';const d=new Date(value.length===10?value+'T12:00:00':value);if(Number.isNaN(d.getTime()))return '—';return new Intl.DateTimeFormat(t().dateLocale,{dateStyle:'medium',...(withTime?{timeStyle:'short'}:{})}).format(d)};
  function updateStaticLanguage(){
    document.documentElement.lang=lang;
    document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.getAttribute('data-i18n');if(t()[key]){if(key==='heroTitle')el.innerHTML=t()[key];else el.textContent=t()[key]}});
    $('languageBtn').innerHTML=lang==='en'?'ES <span aria-hidden="true">↗</span>':'EN <span aria-hidden="true">↗</span>';
    $('searchBox').placeholder=t().search;
    $('categorySelect').replaceChildren();
    $('categorySelect').append(node('option','',t().allCategories));$('categorySelect').firstChild.value='all';
    Object.entries(t().cats).forEach(([code,label])=>{const opt=node('option','',label);opt.value=code;$('categorySelect').append(opt)});
    $('categorySelect').value=category;
    render();
  }
  function updateStatus(){
    const status=$('feedStatusLabel'),desc=$('feedStatusDetail'),dot=$('statusDot');dot.classList.remove('online','offline');
    if(loading&&!feed){status.textContent=t().loading;desc.textContent='';return}
    if(!feed){status.textContent=t().error;desc.textContent=lang==='es'?'Vuelve a intentar con conexión.':'Try again while connected.';dot.classList.add('offline');return}
    const checked=lastCheck?`${t().checked}: ${fmtDate(lastCheck.toISOString(),true)}`:'';
    status.textContent=offline?t().stale:t().online;
    desc.textContent=`${t().updated}: ${fmtDate(feed.publishedAt,true)}${checked?' · '+checked:''}${offline?' · '+t().offlineDetail:''}`;
    dot.classList.add(offline?'offline':'online');
    $('heroFeedStatus').textContent=offline?(lang==='es'?'Copia guardada':'Saved copy'):(lang==='es'?'Datos publicados':'Published data');
    $('heroDate').textContent=fmtDate(feed.publishedAt);
    $('reviewWarning').hidden=feed.approvalStatus==='approved';
    $('reviewWarningText').textContent=t().review;
  }
  function renderNotices(){
    const list=$('noticeList');list.replaceChildren();const source=Array.isArray(feed?.notices)?feed.notices:[];
    const items=source.filter(x=>(category==='all'||x.category===category)&&[x.title?.en,x.title?.es,x.message?.en,x.message?.es,x.projectId].join(' ').toLocaleLowerCase().includes(filter)).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
    $('noticeCount').textContent=`${items.length} ${t().notices}`;
    for(const n of items){const card=node('article','notice-card'+(n.priority==='important'?' important':'')),top=node('div','notice-card-top'),badge=node('span','tag',t().cats[n.category]||n.category||'Notice');top.append(badge);
      if(n.priority==='important')top.append(node('span','tag tag-urgent',t().importantFlag));top.append(node('span','date',fmtDate(n.date)));
      card.append(top,node('h3','',val(n.title)),node('p','',val(n.message)));
      if(val(n.residentAction)){const action=node('div','notice-action'),strong=node('strong','',t().residentAction+': ');action.append(strong,document.createTextNode(val(n.residentAction)));card.append(action)}
      list.append(card);
    }
    if(!items.length)list.append(node('div','loading-card',t().none));
    if(source.length){const n=source.find(n=>n.priority==='important')||source[0];$('featuredTitle').textContent=val(n.title);$('featuredText').textContent=val(n.message)}
    else{$('featuredTitle').textContent=lang==='es'?'Sin avisos disponibles':'No notices available';$('featuredText').textContent=t().error}
  }
  function renderProjects(){const list=$('projectList');list.replaceChildren();const source=Array.isArray(feed?.projects)?feed.projects:[];const selected=source.filter(p=>(category==='all'||p.category===category)&&[p.title?.en,p.title?.es,p.summary?.en,p.summary?.es,p.permit].join(' ').toLocaleLowerCase().includes(filter));for(const p of selected){const card=node('article','project-card'),header=node('div','project-head');header.append(node('span','tag',t().cats[p.category]||p.category||'Project'),node('span','permit-ref',p.permit||''));const badge=node('span','status-badge '+(p.status||''),t().status[p.status]||p.status||'');card.append(header,node('h3','',val(p.title)),node('p','',val(p.summary)),badge);list.append(card)}if(!selected.length)list.append(node('div','loading-card',t().none))}
  function renderFaq(){const list=$('faqList');list.replaceChildren();const source=Array.isArray(feed?.faq)?feed.faq:[];const selected=source.filter(f=>[f.question?.en,f.question?.es,f.answer?.en,f.answer?.es].join(' ').toLocaleLowerCase().includes(filter));for(const f of selected){const box=node('details','faq'),summary=node('summary','',val(f.question)),answer=node('p','',val(f.answer));box.append(summary,answer);list.append(box)}if(!selected.length)list.append(node('div','loading-card',t().none))}
  function render(){renderNotices();renderProjects();renderFaq();updateStatus()}
  function validate(data){return data&&data.schemaVersion===1&&Array.isArray(data.notices)&&Array.isArray(data.projects)&&Array.isArray(data.faq)&&typeof data.publishedAt==='string'&&typeof data.version==='string'}
  async function refresh(silent=false){if(loading)return;loading=true;if(!silent){$('refreshBtn').disabled=true}updateStatus();try{const u=DATA_PATH+'?v='+Date.now();const r=await fetch(u,{cache:'no-store',headers:{'Accept':'application/json'}});if(!r.ok)throw Error('HTTP '+r.status);const data=await r.json();if(!validate(data))throw Error('Invalid resident feed schema');feed=data;storage.setItem(STORAGE_KEY,JSON.stringify(data));offline=!navigator.onLine;lastCheck=new Date()}catch(err){offline=true;if(!feed){try{const saved=JSON.parse(storage.getItem(STORAGE_KEY)||'null');if(validate(saved))feed=saved}catch{}}console.warn('Resident feed unavailable:',err.message)}finally{loading=false;$('refreshBtn').disabled=false;render()}}
  $('languageBtn').addEventListener('click',()=>{lang=lang==='en'?'es':'en';storage.setItem(LANGUAGE_KEY,lang);updateStaticLanguage()});
  $('searchBox').addEventListener('input',e=>{filter=e.target.value.trim().toLocaleLowerCase();render()});
  $('categorySelect').addEventListener('change',e=>{category=e.target.value;render()});
  $('refreshBtn').addEventListener('click',()=>refresh());
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refresh(true)});
  window.addEventListener('online',()=>refresh(true));
  updateStaticLanguage();refresh();setInterval(()=>{if(document.visibilityState==='visible')refresh(true)},POLL_INTERVAL);
  if('serviceWorker'in navigator&&location.protocol==='https:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(e=>console.warn('SW install:',e)));
})();

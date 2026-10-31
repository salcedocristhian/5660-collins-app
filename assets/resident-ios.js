'use strict';
(()=>{
const $=(id)=>document.getElementById(id);
const esc=(s)=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const translations={
en:{allprojects:'All project updates',projectexplainer:'Select a project for detailed status and next steps.',questions:'Resident questions',updates:'Updates',progress:'Progress',permits:'Permits',schedule:'Schedule',contact:'Contact',latest:'LATEST',noaction:'No action needed from you',recent:'Recent',building:'Building',interior:'Interior',planning:'Planning scenario',modelnote:'3D visualization is conceptual. The sequence does not represent completed or authorized field work.',review:'Review',issued:'Issued',notfiled:'Not filed',all:'All',timeline:'Timeline',milestones:'Milestones',nextmilestones:'Next milestones',permitissued:'Permit issued',permitreview:'Permit in review',permitnotfiled:'Not filed',today:'Today',schnote:'Only permit/engineering milestone windows are shown. Bars are not construction durations or completion dates.',buildingmgmt:'Building Management',hours:'Mon to Fri, 10:00 AM to 3:00 PM',call:'Call the office',email:'Email the manager',infoline:'Building info line',appointment:'Book an appointment',withmgmt:'With Building Management',construction:'Construction',report:'Report a building issue',sent:'Sent to Building Management',ownerrep:"Owner's representative",generalcontractor:'General contractor',summary:'of {n} permits issued or approved',inreview:'in review',toverify:'to verify',search:'Search permit or scope',floor:'Floor',stage:'Planning step',notstarted:'Not started',pending:'Pending permit',complete:'Completed',planned:'Planned',notconfirmed:'Not confirmed',openviewer:'Open original interactive 3D viewer',nothing:'No matching permits.',loading:'Permit information unavailable. Try again later.',detailStatus:'Current status',detailNext:'Next milestone',detailReview:'Review history',dated:'Updated',estimate:'Planning dates are estimates. An application number is not an issued permit.',stages:['Selective demolition','Air quality verification','Drywall rebuild','Fire sprinkler coordination','Corridor finishes'],stageNotes:['Awaiting City permit before planned selective demolition','Testing and verification must meet project requirements','Drywall installation follows authorization and inspections','Fire sprinkler work follows separate approved scope','Final finishes and inspections follow prior activities'],tasks:['Selective demolition','Air quality testing','Drywall rebuild'],recentText:{elevator:['Service elevator running again','Emergency repair completed; permanent repairs remain a separate phase.'],parking:['Parking lot lighting','Application registered with the City; permit not yet issued.'],doors:['Smoke enclosure doors','Drawings in coordination before permit submission.'],gym:['Gym and sauna restoration','Permit issued Oct 1; inspections required before reopening.']}},
es:{allprojects:'Todos los proyectos',projectexplainer:'Selecciona un proyecto para ver su estado y próximos pasos.',questions:'Preguntas de residentes',updates:'Novedades',progress:'Avance',permits:'Permisos',schedule:'Cronograma',contact:'Contacto',latest:'ÚLTIMO',noaction:'No necesitas hacer nada',recent:'Recientes',building:'Edificio',interior:'Interior',planning:'Escenario de planificación',modelnote:'La visualización 3D es conceptual. La secuencia no confirma trabajo ejecutado ni autorizado.',review:'Revisión',issued:'Emitidos',notfiled:'No presentados',all:'Todos',timeline:'Cronograma',milestones:'Hitos',nextmilestones:'Próximos hitos',permitissued:'Permiso emitido',permitreview:'En revisión',permitnotfiled:'No presentado',today:'Hoy',schnote:'Solo se muestran ventanas de hitos de ingeniería y permisos; las barras no indican duración de construcción ni terminación.',buildingmgmt:'Administración del edificio',hours:'Lun a vie, 10:00 AM a 3:00 PM',call:'Llamar a la oficina',email:'Correo a administración',infoline:'Línea informativa',appointment:'Solicitar una cita',withmgmt:'Con Administración',construction:'Construcción',report:'Reportar un problema',sent:'Se envía a Administración',ownerrep:'Representante del propietario',generalcontractor:'Contratista general',summary:'de {n} permisos emitidos o aprobados',inreview:'en revisión',toverify:'por verificar',search:'Buscar permiso o proyecto',floor:'Piso',stage:'Etapa prevista',notstarted:'Sin comenzar',pending:'Pendiente de permiso',complete:'Completado',planned:'Previsto',notconfirmed:'Por confirmar',openviewer:'Abrir visualizador 3D interactivo original',nothing:'No hay permisos que coincidan.',loading:'Información de permisos no disponible. Intenta de nuevo.',detailStatus:'Estado actual',detailNext:'Próximo hito',detailReview:'Historial de revisión',dated:'Actualizado',estimate:'Las fechas son estimadas. Un número de solicitud no implica que el permiso esté emitido.',stages:['Demolición selectiva','Verificación de calidad del aire','Reconstrucción de drywall','Coordinación de rociadores','Acabados de pasillos'],stageNotes:['Demolición pendiente del permiso municipal','Pruebas y verificaciones conforme al proyecto','Drywall después de permisos e inspecciones','Rociadores según alcance aprobado por separado','Acabados e inspecciones finales'],tasks:['Demolición selectiva','Pruebas de calidad del aire','Reconstrucción de drywall'],recentText:{elevator:['Elevador de servicio operativo otra vez','Se completó la reparación de emergencia; las reparaciones permanentes son otra fase.'],parking:['Iluminación del estacionamiento','Solicitud registrada en la Ciudad; permiso aún no emitido.'],doors:['Puertas de contención de humo','Planos en coordinación antes de presentar el permiso.'],gym:['Restauración del gimnasio y sauna','Permiso emitido el 1 de octubre; faltan inspecciones para reabrir.']}}};
const fallbackPermits=[
{id:'sprinkler',scope:'Fire sprinkler (ELSS)',number:'FP0826-7612',group:'review',status:'City review',next:'Target Oct 30, 2026'},
{id:'corridor',scope:'Hallway remediation / drywall',number:'BC2628687',group:'review',status:'Applied; not issued',next:'Building/Flood Nov 10; Plumbing/Planning/Elevator Nov 13'},
{id:'garage',scope:'Garage dewatering / stormwater',number:'BC2526722',group:'review',status:'Revised scope',next:'Keep application active by Nov 26 (reported)'},
{id:'lighting',scope:'Parking lot lighting',number:'BPI2650249',group:'review',status:'Intake; not issued',next:'Nov–Dec 2026, est.'},
{id:'guardrails',scope:'Stairwell guardrails',number:'BC2628393',group:'review',status:'Corrections',next:'TBD'},
{id:'boiler',scope:'Boiler / storage tank corrections',number:'MEC2605382',group:'review',status:'Corrections',next:'TBD'},
{id:'rer',scope:'Hallway County RER / DERM',number:'UP26079525',group:'review',status:'Submitted',next:'Linked to BC2628687'},
{id:'gym',scope:'Gym and sauna restoration',number:'BC2627814',group:'issued',status:'Issued Oct 1, 2026',next:'Inspections'},
{id:'county',scope:'Hallway County approval',number:'2027004562',group:'issued',status:'Approved Oct 22, 2026',next:'—'},
{id:'asbestos',scope:'Hallway County asbestos',number:'M2027000526',group:'issued',status:'Approved Oct 21',next:'—'},
{id:'coc',scope:'Garage contractor change',number:'PAU2623002',group:'issued',status:'Completed / closed',next:'—'},
{id:'alarm',scope:'Fire alarm (ELSS)',number:'Not assigned',group:'notfiled',status:'In preparation',next:'Nov 2026, est.'},
{id:'doors',scope:'Smoke enclosure doors',number:'Not assigned',group:'notfiled',status:'Design coordination',next:'Nov 2026, est.'},
{id:'pressurization',scope:'Stair pressurization / dampers',number:'Not assigned',group:'notfiled',status:'Engineering in progress',next:'Jan–Feb 2027, est.'},
{id:'gymalarm',scope:'Gym fire alarm / equipment',number:'Not confirmed',group:'notfiled',status:'Coordination',next:'Nov–Dec 2026, est.'},
{id:'dehumid',scope:'Temporary dehumidifier electrical',number:'Not confirmed',group:'notfiled',status:'TBD',next:'TBD'},
{id:'planters',scope:'Planter restoration',number:'No number yet',group:'notfiled',status:'Engineering',next:'TBD'},
{id:'chiller',scope:'Chiller - mechanical / electrical',number:'Unverified',group:'verify',status:'Verify trade permits',next:'Verify'},
{id:'chillerpump',scope:'Chiller pump replacement',number:'Unverified',group:'verify',status:'Verify submission',next:'Verify'}];
let publicKB=null,modelReady=false,modelRequested=false,modelFullscreen=false;
let lang='en',tab='updates',permitFilter='review',permitData=fallbackPermits.slice(),permitDate='2026-10-27',noticeData=null,view='interior',floor='2',step=0,playing=false,interval=null,scheduleMode='timeline';
const t=(k)=>translations[lang][k]||k;
function localDate(value){try{const d=new Date(String(value).substring(0,10)+'T12:00:00');return new Intl.DateTimeFormat(lang==='es'?'es-US':'en-US',{month:'short',day:'numeric'}).format(d)}catch{return value||''}}
function switchTab(next){if(!['updates','progress','permits','schedule','contact'].includes(next))return;stopPlay();tab=next;document.querySelectorAll('.screen').forEach(el=>{let on=el.dataset.tab===next;el.hidden=!on;el.classList.toggle('current',on)});document.querySelectorAll('.nav-item').forEach(el=>{let on=el.dataset.go===next;el.classList.toggle('active',on);if(on)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current')});const legacyFloorPicker=$('floorPicker');if(legacyFloorPicker)legacyFloorPicker.hidden=next!=='progress';$('topAction').hidden=false;$('topAction').textContent=next==='schedule'?'↥':lang==='en'?'ES':'EN';$('topAction').setAttribute('aria-label',next==='schedule'?'Share schedule':'Switch language');if(next==='progress')load3D();window.scrollTo(0,0);history.replaceState(null,'','#'+next)}
function setLang(next){lang=next;document.documentElement.lang=lang;document.querySelectorAll('[data-t]').forEach(el=>el.textContent=t(el.dataset.t));$('permitSearch').placeholder=t('search');$('modelExpand').setAttribute('aria-label',t('openviewer'));if(tab!=='schedule')$('topAction').textContent=lang==='en'?'ES':'EN';renderUpdates();renderKB();renderPermits();renderStages();renderSchedule();document.getElementById('reconstructionFrame')?.contentWindow?.postMessage({type:'collins-language',lang},location.origin)}
function renderUpdates(){
const ids=[['elevator','ic-elevator','teal','2026-10-26'],['parking','ic-lamp','blue','2026-10-27'],['doors','ic-door','plum','2026-10-27'],['gym','ic-gym','amber','2026-10-27']];
const n=noticeData&&Array.isArray(noticeData.notices)?noticeData.notices:[];
const preferred=n.find(x=>x.projectId==='corridor');
if(preferred){$('featureDate').textContent=localDate(preferred.date);$('featureTitle').textContent=localized(preferred.title);$('featureBody').textContent=localized(preferred.message)}
$('recentList').innerHTML=ids.map(([id,ic,color,date])=>{const x=translations[lang].recentText[id];return '<div class="list-row"><span class="tile '+color+'"><svg><use href="#'+ic+'"/></svg></span><div class="row-copy"><strong>'+esc(x[0])+'</strong><small>'+esc(x[1])+'</small></div><time class="row-date">'+esc(localDate(date))+'</time></div>'}).join('');
$('updateFoot').textContent=(lang==='es'?'Información del proyecto · Actualizado ':'Project information · Updated ')+localDate((noticeData&&noticeData.publishedAt)||'2026-10-27');
}
function localized(v){return typeof v==='string'?v:String((v&&v[lang])||(v&&v.en)||'')}
function renderKB(){
const entries=(publicKB&&Array.isArray(publicKB.projects))?publicKB.projects:[];
const tags={corridor:'amber',elevator:'teal',lighting:'blue',doors:'plum',sprinkler:'teal',alarm:'blue',pressurization:'plum',garage:'blue',gym:'amber',boilers:'red',chiller:'gray',planters:'teal',guardrails:'gray',humidity:'teal',firewatch:'red',waterfront:'blue'};
const list=$('projectList');if(!list)return;
list.innerHTML=entries.map(p=>'<button type="button" class="project-row" data-project="'+esc(p.id)+'"><span class="project-status-dot '+esc(tags[p.id]||'gray')+'"></span><span class="project-row-copy"><strong>'+esc(localized(p.title))+'</strong><small>'+esc(localized(p.status))+'</small></span><svg class="chevron"><use href="#ic-chevron"/></svg></button>').join('')||'<div class="empty">Project details are temporarily unavailable.</div>';
list.querySelectorAll('[data-project]').forEach(el=>el.addEventListener('click',()=>openProject(el.dataset.project)));
const faq=(publicKB&&Array.isArray(publicKB.faqs))?publicKB.faqs:[];
$('faqList').innerHTML=faq.map((f,i)=>'<details class="faq-item"><summary>'+esc(localized(f.question))+'</summary><p>'+esc(localized(f.answer))+'</p></details>').join('');
$('kbFoot').textContent=(lang==='es'?'Resumen público del KB · pasillos actualizados 31 de octubre de 2026; otros proyectos conservan sus fechas · Sin sincronización automática':'Public KB snapshot · Corridor updated Oct 31, 2026; other projects retain their dates · Not automatically synced')};
function openProject(id){
const p=publicKB&&publicKB.projects&&publicKB.projects.find(x=>x.id===id);if(!p)return;
const body='<div class="detail-key">'+esc(localized(p.status))+'</div><h2 id="detailTitle">'+esc(localized(p.title))+'</h2>'+(p.permit?'<div class="detail-ref">'+esc(p.permit)+'</div>':'')+'<div class="detail-facts"><strong>'+esc(lang==='es'?'Estado documentado':'Documented status')+'</strong><p>'+esc(localized(p.summary))+'</p><strong>'+esc(lang==='es'?'Próximo paso':'Next step')+'</strong><p>'+esc(localized(p.next))+'</p></div><p class="quiet-foot">'+esc(lang==='es'?'Fuente: KB de Proyectos LIVE (pasillos: capturas 31 oct. 2026; otros proyectos: fechas originales). Datos de permisos y cierres deben confirmarse con Administración.':'Source: Active Projects LIVE KB (corridor: Oct 31 screenshots; other projects: original dates). Verify live permit or completion status with Management.')+'</p>';
$('detailContents').innerHTML=body;$('detailBackdrop').hidden=false;$('permitDetail').hidden=false;document.body.classList.add('modal-open');$('detailClose').focus()
}
function renderPermits(){const valid=permitData.filter(x=>['review','issued','notfiled','verify'].includes(x.group));const counts={review:0,issued:0,notfiled:0,verify:0};valid.forEach(x=>counts[x.group]++);$('issuedNum').textContent=counts.issued;$('permitSumText').textContent=t('summary').replace('{n}',valid.length);$('issuedLabel').textContent=counts.issued+' '+(lang==='es'?'emitidos':'issued');$('reviewLabel').textContent=counts.review+' '+t('inreview');$('notLabel').textContent=counts.notfiled+' '+t('notfiled').toLowerCase();$('verifyLabel').textContent=counts.verify+' '+t('toverify');[['issued','.track-issued'],['review','.track-review'],['notfiled','.track-not'],['verify','.track-verify']].forEach(x=>document.querySelector(x[1]).style.flex=counts[x[0]]||0.01);
const q=$('permitSearch').value.trim().toLowerCase();const items=valid.filter(x=>(permitFilter==='all'||x.group===permitFilter)&&[x.scope,x.number,x.status].join(' ').toLowerCase().includes(q));$('permitList').innerHTML=items.map(x=>'<button type="button" class="permit-row" data-permit="'+esc(x.id)+'"><span class="permit-dot '+esc(x.group)+'"></span><span class="permit-title">'+esc(x.scope)+'<small>'+esc(x.number||'—')+'</small></span><span class="permit-due">'+esc(x.next||'TBD')+'</span><svg class="chevron"><use href="#ic-chevron"/></svg></button>').join('')||'<div class="empty">'+esc(t('nothing'))+'</div>';$('permitFoot').textContent=t('dated')+' '+localDate(permitDate)+' · '+t('estimate');
$('permitList').querySelectorAll('[data-permit]').forEach(el=>el.addEventListener('click',()=>openPermit(el.dataset.permit)))}
function openPermit(id){const x=permitData.find(p=>p.id===id);if(!x)return;const state={review:t('review'),issued:t('issued'),notfiled:t('notfiled'),verify:t('toverify')}[x.group]||x.group;let steps=Array.isArray(x.reviewPath)?'<h3>'+esc(t('detailReview'))+'</h3>'+x.reviewPath.map(p=>'<div class="review-step"><b>'+esc(p.state==='done'?'✓':p.state==='current'?'●':'○')+'</b> '+esc(p.label)+'<small>'+esc(p.detail||'')+'</small></div>').join(''):'';$('detailContents').innerHTML='<div class="detail-key">'+esc(state)+'</div><h2 id="detailTitle">'+esc(x.scope)+'</h2><div class="detail-ref">'+esc(x.number||'—')+'</div><div class="detail-facts"><strong>'+esc(t('detailStatus'))+'</strong><span>'+esc(x.status||state)+'</span><strong style="margin-top:17px">'+esc(t('detailNext'))+'</strong><span>'+esc(x.next||'TBD')+'</span></div>'+(x.note?'<p>'+esc(x.note)+'</p>':'')+steps+'<p class="quiet-foot">'+esc(t('estimate'))+'</p>';$('detailBackdrop').hidden=false;$('permitDetail').hidden=false;document.body.classList.add('modal-open');$('detailClose').focus()}
function closePermit(){$('detailBackdrop').hidden=true;$('permitDetail').hidden=true;document.body.classList.remove('modal-open')}
function renderStages(){
const es=lang==='es',week=step,levels=[...Array.from({length:20},(_,i)=>i+2),'PH'];
$('sequenceTitle').textContent=es?'Secuencia general de construcción':'Overall construction sequence';
$('sequenceSubtitle').textContent=(es?'Semana de planificación ':'Planning week ')+week+' / 34 · '+(es?'Todos los trades':'All trades');
$('floorHeading').textContent=es?'Actividad por trade y ubicación':'Trade activity & locations';
$('sequenceRange').value=week;
const fmt=(arr)=>arr.length?arr.map(v=>v==='PH'?'PH':String(v)).join(', '):'—';
const batch=(start,count)=>levels.slice(start,start+count);
const trades=[
{id:'drywall',name:'Drywall / Remediation',start:4,rate:'2-floor batches · unverified',pilot:true,location:w=>{const n=w-4;if(n<0)return null;const batchNum=Math.floor(n/5),offset=n%5;if(batchNum>10)return null;return {floors:batch(batchNum*2,2),activity:['Pilot / selective removal','AirMD clearance / verification','Drywall reconstruction','Drywall finishing','Painting / clean-up'][offset]}}},
{id:'doors',name:'Smoke Enclosure Doors',start:5,rate:'2 floors / week · target',pilot:true,location:w=>{const n=w-5;if(n<0||n>11)return null;return {floors:batch(n*2,2),activity:n===0?'Pilot / door installation':'Door assembly installation & adjustments'}}},
{id:'sprinkler',name:'Fire Sprinkler · ELSS',start:1,rate:'44-week program · floor rate TBD',pilot:true,location:w=>w>=1?{floors:[],area:'Location TBD by contractor',activity:w===1?'Pilot / mobilization & production study':'System installation / testing · area assignment pending'}:null},
{id:'alarm',name:'Fire Alarm · ELSS',start:5,rate:'44-week program · floor rate TBD',pilot:true,location:w=>w>=5?{floors:[],area:'Location TBD by contractor',activity:w===5?'Pilot / device installation study':'Devices, wiring & integration · area assignment pending'}:null},
{id:'lights',name:'Parking Lot Lighting',start:9,rate:'3 weeks · permit-dependent',pilot:true,location:w=>w>=9&&w<=11?{floors:[],area:'North & South parking areas',activity:['Pilot / layout, bases & setup','Poles, conduits & fixtures','Connections, tests & inspections'][w-9]}:null},
{id:'gym',name:'Gym & Sauna Restoration',start:0,rate:'4–8 weeks remaining',pilot:false,location:w=>w<=5?{floors:[],area:'Gym / Sauna',activity:'Restoration / inspections · activity details TBD'}:null},
{id:'chiller',name:'Chiller Mechanical / Electrical',start:0,rate:'4–6 weeks remaining',pilot:false,location:w=>w<=4?{floors:[],area:'Mechanical / chiller equipment',activity:'Corrective works & coordination · location TBD'}:null},
{id:'stairs',name:'Stair Pressurization / Dampers',start:18,rate:'17–26 weeks · system-based',pilot:true,location:w=>w>=18?{floors:[],area:'Stairs 2 & 3 / mechanical areas',activity:w===18?'Pilot / site setup & coordination':'Equipment, dampers, controls / commissioning'}:null}
];
const rows=trades.map(t=>{const info=t.location(week);const state=!info?(es?'Sin actividad prevista esta semana':'No activity projected this week'):(es?'Planificación tentativa':'Tentative forecast');const where=info?(info.floors.length?(es?'Pisos ':'Floors ')+fmt(info.floors):info.area):'—';return '<article class="trade-seq-row '+(info?'trade-seq-active':'')+'"><div class="trade-seq-head"><strong>'+esc(t.name)+'</strong><span>'+esc(state)+'</span></div><div class="trade-seq-where">'+esc(where)+'</div><p>'+esc(info?info.activity:(es?'Pendiente de programación o fuera de la ventana':'Not yet scheduled or outside the work window'))+'</p><small>'+esc(t.rate)+'</small></article>'}).join('');
$('floorTasks').innerHTML='<div class="trade-seq-intro">'+(es?'Vista general de todos los contratos para la semana seleccionada.':'All-workstream view for the selected planning week.')+'</div>'+rows;
let summary=$('allFloorWeekSummary');if(summary)summary.remove();
const existing=$('tradeSequenceDisclosure');if(existing)existing.remove();
const disclaimer=document.createElement('p');disclaimer.id='tradeSequenceDisclosure';disclaimer.className='quiet-foot';disclaimer.textContent=es?'Simulación conceptual. Los pisos de puertas siguen el objetivo de 2 pisos/semana; las fases de drywall son una hipótesis no validada. Otros trades no tienen distribución por piso confirmada. Ninguna actividad pendiente de permiso está autorizada por esta visualización.':'Conceptual scenario only. Door locations use the 2 floors/week target; drywall batches are unvalidated assumptions. Other trades have no confirmed floor assignments. This view does not authorize permit-dependent work.';
$('floorTasks').insertAdjacentElement('afterend',disclaimer);
sync3D();
}
function stopPlay(){if(interval)clearInterval(interval);interval=null;playing=false;$('sequencePlay').innerHTML='<svg><use href="#ic-play"/></svg>';$('sequencePlay').setAttribute('aria-label','Play planning weeks')}
function advance(dir){step=Math.max(0,Math.min(34,step+dir));if(step===34&&playing)stopPlay();renderStages()}
let scheduleData=null;
function renderSchedule(){
const defaultEntries=[
{name:{en:"Gym permit",es:"Permiso gimnasio"},start:0,length:1,group:"issued"},
{name:{en:"Sprinkler review",es:"Revisión rociadores"},start:0,length:1,group:"review"},
{name:{en:"Smoke door plans",es:"Planos puertas"},start:0,length:1,group:"notfiled"},
{name:{en:"Hallway permit",es:"Permiso pasillos"},start:1,length:1,group:"review"},
{name:{en:"Parking lighting",es:"Luces parqueadero"},start:1,length:2,group:"review"},
{name:{en:"Stair engineering",es:"Ingeniería escaleras"},start:1,length:1,group:"notfiled"},
{name:{en:"Garage application",es:"Solicitud garaje"},start:1,length:1,group:"review"}];
const bars=(scheduleData&&Array.isArray(scheduleData.timeline))?scheduleData.timeline:defaultEntries;
const months=['O','N','D','J','F','M','A','M','J','J','A','S'];
$('timelineGrid').innerHTML='<div class="timeline-head"><span class="timeline-range">Oct 2026 – Sep 2027</span>'+months.map(x=>'<span style="text-align:center">'+x+'</span>').join('')+'</div>'+bars.map(x=>'<div class="timeline-line"><span class="timeline-name">'+esc(localized(x.name))+'</span><div class="timeline-graph"><i class="today-line"></i><span class="gantt-bar '+esc(x.group||'notfiled')+'" style="left:'+(Math.max(0,Number(x.start)||0)/12*100)+'%;width:'+(Math.max(0.25,Number(x.length)||1)/12*100)+'%" title="'+esc(x.note||'')+'"></span></div></div>').join('');
const fallbackMilestones=[
{month:'OCT',day:'30',title:{en:'Fire sprinkler permit',es:'Permiso de rociadores'},detail:{en:'Possible release target, not confirmed',es:'Objetivo tentativo, no confirmado'}},
{month:'NOV',day:'26',title:{en:'Garage BC2526722',es:'Garaje BC2526722'},detail:{en:'Administrative action to verify',es:'Acción administrativa por verificar'}}
];
const miles=(scheduleData&&Array.isArray(scheduleData.milestones))?scheduleData.milestones:fallbackMilestones;
$('milestoneList').innerHTML=miles.map(x=>'<div class="milestone-row"><span class="milestone-date"><small>'+esc(x.month)+'</small>'+esc(x.day)+'</span><div class="milestone-copy"><strong>'+esc(localized(x.title))+'</strong><small>'+esc(localized(x.detail))+'</small></div></div>').join('');
$('timelinePanel').hidden=scheduleMode!=='timeline';
$('milestonePanel').hidden=false;
$('milestonePanel').querySelector('.section-heading').hidden=scheduleMode==='milestones';
$('milestonePanel').querySelector('.section-heading').textContent=t('nextmilestones');
document.querySelectorAll('[data-schedule]').forEach(el=>{const on=el.dataset.schedule===scheduleMode;el.classList.toggle('active',on);el.setAttribute('aria-selected',String(on))});
}
document.querySelectorAll('.nav-item').forEach(el=>el.addEventListener('click',()=>switchTab(el.dataset.go)));
$('topAction').addEventListener('click',()=>{if(tab==='schedule'){if(navigator.share)navigator.share({title:'5660 Collins · Schedule',url:location.href}).catch(()=>{});else navigator.clipboard&&navigator.clipboard.writeText(location.href).catch(()=>{});}else setLang(lang==='en'?'es':'en')});
document.querySelectorAll('[data-view]').forEach(el=>el.addEventListener('click',()=>{view=el.dataset.view;document.querySelectorAll('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===view);b.setAttribute('aria-selected',String(b.dataset.view===view))});sync3D();renderStages()}));
$('sequenceBack').addEventListener('click',()=>advance(-1));$('sequenceForward').addEventListener('click',()=>advance(1));$('sequenceRange').addEventListener('input',e=>{step=+e.target.value;renderStages()});$('sequencePlay').addEventListener('click',()=>{if(playing){stopPlay();return}playing=true;$('sequencePlay').innerHTML='<svg><use href="#ic-pause"/></svg>';$('sequencePlay').setAttribute('aria-label','Pause planning steps');interval=setInterval(()=>advance(1),1467)});
$('permitSearch').addEventListener('input',renderPermits);document.querySelectorAll('[data-filter]').forEach(el=>el.addEventListener('click',()=>{permitFilter=el.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===el);b.setAttribute('aria-selected',String(b===el))});renderPermits()}));
document.querySelectorAll('[data-schedule]').forEach(el=>el.addEventListener('click',()=>{scheduleMode=el.dataset.schedule;renderSchedule()}));
$('modelExpand').addEventListener('click',()=>{
modelFullscreen=!modelFullscreen;
$('modelPicture').classList.toggle('model-fullscreen',modelFullscreen);
document.body.classList.toggle('model-fullscreen-open',modelFullscreen);
$('modelExpand').setAttribute('aria-label',modelFullscreen?'Exit fullscreen 3D model':'Expand 3D model');
const w=$('realModelFrame').contentWindow;
if(w){try{w.dispatchEvent(new Event('resize'))}catch{}}
});
function load3D(){
/* Legacy model-viewer disabled: reconstruction.html is the sole 3D source. */
return;
if(view==='interior'||modelRequested)return;
modelRequested=true;
const iframe=$('realModelFrame');
iframe.addEventListener('load',()=>{
try{
const d=iframe.contentDocument,w=iframe.contentWindow;
if(!d||!w||!d.getElementById('modelMount')||!w.CorridorInterior)throw new Error('The original architectural model is not currently available in the repository.');
const mount=d.getElementById('modelMount');
d.body.appendChild(mount);
const style=d.createElement('style');
style.textContent=String.raw`html,body{height:100%!important;width:100%!important;margin:0!important;overflow:hidden!important;padding:0!important;background:#fff!important}body>*:not(#modelMount){display:none!important}#modelMount{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;min-height:0!important;max-height:none!important;border:0!important;border-radius:0!important;margin:0!important;box-shadow:none!important}#modelMount canvas{touch-action:none!important}#modelMount .canvas-hud,#modelMount .mini-hud,#modelMount .int-topnote,#modelMount .int-stagebar,#modelMount .int-progress-banner,#modelMount .int-tour,#modelMount .int-controls,#modelMount #intExpand{display:none!important}#modelMount #interiorMount{display:none!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important}#modelMount[data-mode='interior'] #interiorMount{display:block!important}#modelMount[data-mode='exterior'] #interiorMount,#modelMount[data-mode='exterior'] #planMount{display:none!important}#modelMount[data-mode='exterior'] > #c{display:block!important;visibility:visible!important;pointer-events:auto!important;width:100%!important;height:100%!important}#modelMount #interiorDock{display:none!important}#modelMount #interiorViewport{position:absolute!important;inset:0!important;height:100%!important;width:100%!important;min-height:0!important;overflow:hidden!important}#modelMount #interiorCanvas{height:100%!important;width:100%!important}`;
d.head.appendChild(style);
modelReady=true;$('modelLoading').hidden=true;
sync3D();
setTimeout(()=>{w.dispatchEvent(new Event('resize'));sync3D()},130);
}catch(e){modelReady=false;$('modelLoading').innerHTML='<strong>'+esc(lang==='es'?'No se pudo cargar el modelo 3D':'Unable to load the interactive 3D model')+'</strong><small>'+esc(e.message||'Please retry')+'</small>';}
});
iframe.src='./model-viewer.html?v=20261029-architectural15';
}
function sync3D(){
if(view==='interior')return;
if(!modelRequested){load3D();return;}
if(!modelReady)return;
try{
const iframe=$('realModelFrame'),d=iframe.contentDocument,w=iframe.contentWindow;
const select=d.getElementById('floorSelect');
if(select&&select.value!==floor){select.value=floor;select.dispatchEvent(new Event('change',{bubbles:true}))}
if(w.CorridorInterior){const desired=view==='building'?'exterior':'interior';if(w.CorridorInterior.mode!==desired)w.CorridorInterior.showMode(desired);const mount=d.getElementById('modelMount');if(mount)mount.dataset.mode=desired;}
const range=d.getElementById('weekRange');if(range&&Number(range.value)!==step){range.value=step;range.dispatchEvent(new Event('input',{bubbles:true}))}
const val=d.getElementById('floorStatus')?.textContent?.trim();if(val){const status=$('scenarioStatus');if(status)status.textContent=val;}
}catch(e){console.warn('3D sync:',e)}
}
$('detailClose').addEventListener('click',closePermit);$('detailBackdrop').addEventListener('click',closePermit);document.addEventListener('keydown',e=>{if(e.key==='Escape'){closePermit();if(modelFullscreen)$('modelExpand').click()}});
async function load(){try{const embedded=$('residentKBBackup');if(embedded&&!publicKB){const d=JSON.parse(embedded.textContent);if(Array.isArray(d.projects)){publicKB=d;renderKB()}}}catch(e){console.warn('Embedded project snapshot:',e)}try{let r=await fetch('./data/public-schedule-2026-10-28.json?v=1',{cache:'no-store'});if(r.ok){let d=await r.json();if(Array.isArray(d.timeline)){scheduleData=d;renderSchedule()}}}catch(e){console.warn('Schedule snapshot unavailable:',e)}try{let r=await fetch('./data/public-kb-2026-10-28.json?v=1',{cache:'no-store'});if(r.ok){const d=await r.json();if(Array.isArray(d.projects)){publicKB=d;renderKB()}}}catch(e){console.warn('KB snapshot unavailable:',e)}try{let r=await fetch('./data/permits.json?v=20261027',{cache:'no-store'});if(r.ok){let data=await r.json();if(Array.isArray(data.items)){permitData=data.items;permitDate=data.updatedAt||permitDate;renderPermits()}}}catch(e){renderPermits()}try{let r=await fetch('./data/notices.json?v=20261027',{cache:'no-store'});if(r.ok){let data=await r.json();if(Array.isArray(data.notices)){noticeData=data;renderUpdates()}}}catch(e){renderUpdates()}}
renderUpdates();renderKB();renderPermits();renderStages();renderSchedule();setLang('en');switchTab(location.hash.replace('#','')||'updates');load();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
})();
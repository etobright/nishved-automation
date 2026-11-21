import './style.css';
import logo from './assets/logo-cap-digital-scolaire.webp';
import { ArrowRight, Bell, BookOpen, BriefcaseBusiness, CalendarDays, ChartNoAxesColumnIncreasing, Check, ChevronDown, ChevronsUpDown, Circle, CircleHelp, CirclePlay, ClipboardList, CodeXml, Download, FileText, FlaskConical, GraduationCap, LayoutDashboard, Mail, Menu, Play, Plus, Presentation, School, Search, Sigma, Trophy, Upload, UsersRound } from 'lucide';
const icons = { ArrowRight, Bell, BookOpen, BriefcaseBusiness, CalendarDays, ChartNoAxesColumnIncreasing, Check, ChevronDown, ChevronsUpDown, Circle, CircleHelp, CirclePlay, ClipboardList, CodeXml, Download, FileText, FlaskConical, GraduationCap, LayoutDashboard, Mail, Menu, Play, Plus, Presentation, School, Search, Sigma, Trophy, Upload, UsersRound };
const icon = (name, size = 20) => {
  const data = icons[name];
  if (!Array.isArray(data)) return '';
  return '<svg aria-hidden="true" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+data.map(([tag, attrs])=>'<'+tag+' '+Object.entries(attrs).map(([k,v])=>k+'="'+v+'"').join(' ')+'/>').join('')+'</svg>';
};
const safe = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const grades = ['Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12','Grade 13'];
const roles = {
  'Élève': {name:'Amélie Raman', icon:'GraduationCap', nav:[['Mes cours','BookOpen'],['Mes devoirs','ClipboardList'],['Mes résultats','ChartNoAxesColumnIncreasing']]},
  'Professeur': {name:'Sophie André', icon:'Presentation', nav:[['Mes publications','BookOpen'],['Notes et remarques','ClipboardList']]},
  'Parent': {name:'Isabelle Raman', icon:'UsersRound', nav:[['Suivi de mon enfant','ChartNoAxesColumnIncreasing'],['Mes devoirs','ClipboardList']]},
  'Coordonnateur': {name:'David Joseph', icon:'UsersRound', nav:[['Catalogue des cours','BookOpen'],['Suivi pédagogique','ClipboardList']]},
  'Planificateur': {name:'Lina Louis', icon:'CalendarDays', nav:[['Planning scolaire','CalendarDays']]},
  'Direction': {name:'Marie Perrier', icon:'School', nav:[['Responsables','UsersRound'],['Suivi pédagogique','ChartNoAxesColumnIncreasing']]},
  'Responsable': {name:'Yann Morel', icon:'BriefcaseBusiness', nav:[['Programmeurs','UsersRound'],['Catalogue des cours','BookOpen']]},
  'Programmeur': {name:'Alex Robert', icon:'CodeXml', nav:[['Demandes techniques','ClipboardList']]}
};
const demo = [
  {id:'math', subject:'Mathématiques', title:'Les équations du premier degré', teacher:'Mme Sophie André', theme:'lavender', glyph:'Sigma', grade:'Grade 9', format:'PDF', progress:65},
  {id:'science', subject:'Sciences', title:'La cellule et ses organites', teacher:'M. David Joseph', theme:'mint', glyph:'FlaskConical', grade:'Grade 9', format:'Vidéo', progress:40, url:'/cellule.mp4'},
  {id:'fr', subject:'Français', title:'Comprendre le récit narratif', teacher:'Mme Lina Louis', theme:'peach', glyph:'BookOpen', grade:'Grade 9', format:'PDF', progress:25}
];
const summaries = {math:'Une équation du premier degré peut s’écrire ax + b = 0, où a est différent de zéro. On isole x en soustrayant b aux deux membres, puis en divisant par a. Exemple : 3x + 6 = 0 donne x = −2.',science:'La membrane protège la cellule et contrôle ses échanges. Le noyau contient l’information génétique. Les mitochondries participent à la production d’énergie. Observe dans la vidéo le rôle de ces trois éléments.',fr:'Un récit présente une situation initiale, un élément perturbateur, des péripéties, un dénouement et une situation finale. Repère ces étapes dans un texte de ton choix.'};
let role = read('cap-role','Élève');
if (!roles[role]) role = 'Élève';
let page = 'Tableau de bord';
let grade = 'Grade 9';
let query = '';
let filter = 'Tous les cours';
let done = read('cap-completed', []);
let homework = read('cap-homework', []);
let custom = read('cap-courses', []);
let notes = read('cap-notes', [{id:'n1', subject:'Mathématiques', mark:16, comment:'Bonne maîtrise des équations.'},{id:'n2', subject:'Français',mark:15,comment:'Poursuivre le travail sur la structure du récit.'},{id:'n3',subject:'Sciences',mark:17,comment:'Travail soigné et observations précises.'}]);
let entries = read('cap-agenda', [
  {id:'e1',day:'23',month:'NOV',title:'Évaluation de mathématiques',detail:'Lundi, 09:00 · Salle B12',theme:'lavender'},
  {id:'e2',day:'25',month:'NOV',title:'Atelier de sciences',detail:'Mercredi, 11:30 · Laboratoire',theme:'mint'},
  {id:'e3',day:'27',month:'NOV',title:'Remise du devoir de français',detail:'Vendredi, 16:00 · En ligne',theme:'peach'}
]);
let messages = read('cap-messages', [{id:'m1', title:'Mme Sophie André', detail:'Bonjour Amélie, le nouveau chapitre de mathématiques est disponible.'}]);
let tickets = read('cap-tickets', [{id:'t1',title:'Vérifier le lecteur vidéo', detail:'Contrôler la lecture des vidéos sur les petits écrans.', status:'À traiter'}]);
let people = read('cap-team', [{id:'r1',title:'Yann Morel',detail:'Responsable pédagogique',group:'Responsables'},{id:'r2',title:'Alex Robert',detail:'Programmeur web',group:'Programmeurs'}]);
const tasks = [
  {id:'d1',title:'Exercices sur les équations',subject:'Mathématiques',detail:'À rendre le 23 novembre',theme:'lavender',glyph:'Sigma'},
  {id:'d2',title:'Schéma de la cellule',subject:'Sciences',detail:'À rendre le 25 novembre',theme:'mint',glyph:'FlaskConical'},
  {id:'d3',title:'Rédaction d’un récit',subject:'Français',detail:'À rendre le 27 novembre',theme:'peach',glyph:'BookOpen'}
];
const app = document.querySelector('#app');
const dialog = document.querySelector('#dialog');
const button = (label, glyph, action, style='primary') => '<button type="button" class="btn '+style+'" '+action+'>'+icon(glyph,17)+safe(label)+'</button>';
const initials = (name) => name.split(' ').map(w=>w[0]).slice(0,2).join('');
const courseList = () => [...custom,...demo];
const progress = c => done.includes(c.id) ? 100 : c.progress || 0;
const average = () => notes.length ? new Intl.NumberFormat('fr-FR',{maximumFractionDigits:1}).format(notes.reduce((a,n)=>a+n.mark,0)/notes.length) : '—';
const dateLabel = new Intl.DateTimeFormat('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'Indian/Mauritius'}).format(new Date());
const go = (target) => {page=target; query=''; filter='Tous les cours'; render(); window.scrollTo(0,0);};
const navButton = ([label,glyph]) => '<button class="nav-item '+(page===label?'active':'')+'" data-page="'+safe(label)+'">'+icon(glyph)+'<span>'+safe(label)+'</span></button>';
function stat(label,value,glyph,theme,detail) {
  return '<article class="stat"><div class="stat-icon '+theme+'">'+icon(glyph,22)+'</div><div><div class="stat-label">'+label+'</div><strong>'+value+'</strong><small>'+detail+'</small></div></article>';
}
function card(c) {
  return '<article class="course"><div class="course-art '+safe(c.theme)+'"><span class="format">'+icon(c.format==='PDF'?'FileText':'CirclePlay',13)+safe(c.format)+'</span><div class="orbit"></div><div class="subject-glyph">'+icon(c.glyph,52)+'</div><span class="art-spark">✦</span><span class="art-dot"></span></div><div class="course-body"><span class="subject '+safe(c.theme)+'">'+safe(c.subject)+'</span><h3>'+safe(c.title)+'</h3><p>'+safe(c.teacher)+'</p><div class="progress-label"><span>Progression</span><b>'+progress(c)+' %</b></div><div class="bar" role="progressbar" aria-label="Progression" aria-valuenow="'+progress(c)+'"><i style="width:'+progress(c)+'%"></i></div>'+button(progress(c)===100?'Revoir le cours':'Continuer','ArrowRight','data-course="'+safe(c.id)+'"','course-btn')+'</div></article>';
}
function events(limit) {
  return entries.slice(0,limit).map(e=>'<div class="event"><div class="event-date '+safe(e.theme)+'"><strong>'+safe(e.day)+'</strong><span>'+safe(e.month)+'</span></div><div><h3>'+safe(e.title)+'</h3><p>'+safe(e.detail)+'</p></div></div>').join('') || '<p class="empty">Aucun événement prévu.</p>';
}
function heading(title, description, action='') {
  return '<div class="section-head"><div><h2>'+title+'</h2><p>'+description+'</p></div>'+action+'</div>';
}
function dashboard() {
  const list=courseList().filter(c=>c.grade===grade);
  const featured=list.find(c=>progress(c)<100) || list[0];
  const learning=role==='Élève';
  return '<div class="date">'+icon('CalendarDays',16)+'<span>'+safe(dateLabel)+'</span></div><section class="hero"><div class="hero-content"><span class="hero-pill">'+icon(roles[role].icon,15)+' '+(learning?grade+' · Espace élève':'Espace '+role.toLowerCase())+'</span><h1>Bonjour '+roles[role].name.split(' ')[0]+' ! <span class="wave">👋</span></h1><p>'+ (learning?'Prête à apprendre de nouvelles choses aujourd’hui ?<br>Reprends tes cours et avance à ton rythme.':'Retrouvez vos outils et les dernières informations de votre espace scolaire.')+'</p>'+ (learning && featured?button('Reprendre mon apprentissage','Play','data-course="'+safe(featured.id)+'"','hero-btn'):button('Ouvrir mon espace','ArrowRight','data-page="'+safe(roles[role].nav[0][0])+'"','hero-btn'))+'</div></section>'+
  '<section class="stats">'+(learning?stat('Cours en cours',list.filter(c=>progress(c)<100).length,'BookOpen','blue','Dans ton niveau')+stat('Devoirs à rendre',tasks.filter(t=>!homework.includes(t.id)).length,'ClipboardList','peach','Dans tes matières')+stat('Moyenne générale',average()+'<em> / 20</em>','ChartNoAxesColumnIncreasing','mint','Sur les notes disponibles')+stat('Cours terminés',list.filter(c=>progress(c)===100).length,'Trophy','lavender','Dans ton niveau'):stat('Supports de cours',courseList().length,'BookOpen','blue','Dans le catalogue')+stat('Événements',entries.length,'CalendarDays','lavender','Dans l’agenda')+stat('Notes enregistrées',notes.length,'ChartNoAxesColumnIncreasing','mint','Élève de démonstration'))+'</section>'+
  '<div class="dashboard-grid"><section>'+ (learning?heading('Mes cours en cours','Reprends là où tu t’es arrêtée.',button('Tous mes cours','ArrowRight','data-page="Mes cours"','link'))+'<div class="course-grid">'+list.slice(0,3).map(card).join('')+'</div>':heading('Accès rapides','Retrouvez les outils de votre espace.')+'<div class="panel quick">'+roles[role].nav.map(([label,glyph])=>button(label,glyph,'data-page="'+safe(label)+'"','secondary')).join('')+'</div>')+'</section><aside class="agenda panel"><div class="agenda-head"><span class="mini-icon blue">'+icon('CalendarDays',19)+'</span><div><h2>À venir</h2><p>Ton agenda scolaire</p></div></div>'+events(3)+button('Voir mon agenda','ArrowRight','data-page="Mon agenda"','secondary')+'</aside></div>';
}
function catalog() {
  const own=page==='Mes publications';
  const admin=page==='Catalogue des cours';
  const items=courseList().filter(c=>(own?c.teacher===roles[role].name:admin || c.grade===grade) && (filter==='Tous les cours' || c.format===filter) && (c.title+' '+c.subject+' '+c.grade).toLowerCase().includes(query.toLowerCase()));
  return heading(page,own?'Publiez des supports vidéo et PDF pour vos élèves.':'Explorez les ressources pédagogiques par niveau.',own?button('Publier un cours','Plus','data-form="course"'):'')+
  '<div class="toolbar"><label>Format <select id="format-filter">'+['Tous les cours','PDF','Vidéo'].map(v=>'<option '+(v===filter?'selected':'')+'>'+v+'</option>').join('')+'</select></label>'+(!admin&&!own?'<label>Niveau <select id="grade-filter">'+grades.map(v=>'<option '+(v===grade?'selected':'')+'>'+v+'</option>').join('')+'</select></label>':'')+'</div><div class="course-grid wide">'+(items.length?items.map(card).join(''):'<p class="empty">Aucun cours disponible pour cette sélection.</p>')+'</div>';
}
function rows(title,description,records,extra='',actions=()=>'', glyph='ClipboardList') {
  const matches=records.filter(r=>(r.title+' '+r.detail).toLowerCase().includes(query.toLowerCase()));
  return heading(title,description,extra)+'<div class="panel rows">'+(matches.length?matches.map(r=>'<article class="row"><div class="mini-icon '+safe(r.theme||'blue')+'">'+icon(r.glyph||glyph)+'</div><div><h3>'+safe(r.title)+'</h3><p>'+safe(r.detail)+'</p></div>'+actions(r)+'</article>').join(''):'<p class="empty">Aucun élément à afficher.</p>')+'</div>';
}
function content() {
  switch(page) {
  case 'Tableau de bord': return dashboard();
  case 'Recherche': case 'Mes cours': case 'Mes publications': case 'Catalogue des cours': return catalog();
  case 'Mes devoirs': return rows(page,'Consultez les travaux et les dates de remise.',tasks,'', t=>role==='Élève'?button(homework.includes(t.id)?'Remis':'Remettre',homework.includes(t.id)?'Check':'Upload','data-task="'+t.id+'"','secondary'):'<span class="badge">'+(homework.includes(t.id)?'Remis':'À rendre')+'</span>');
  case 'Mes résultats': case 'Notes et remarques': case 'Suivi pédagogique': case 'Suivi de mon enfant':
    return rows(page,'Amélie Raman · Grade 9 · Moyenne '+average()+' / 20',notes.map(n=>({title:n.subject,detail:n.comment,mark:n.mark})),role==='Professeur'?button('Ajouter une note','Plus','data-form="note"'):'',n=>'<span class="badge">'+n.mark+' / 20</span>','ChartNoAxesColumnIncreasing');
  case 'Mon agenda': case 'Planning scolaire': return heading(page,'Retrouvez les prochains rendez-vous et échéances.',role==='Planificateur'?button('Ajouter un événement','Plus','data-form="event"'):'')+'<div class="panel agenda full">'+events(entries.length)+'</div>';
  case 'Messages': return rows(page,'Échanges au sein de la plateforme.',messages,button('Nouveau message','Plus','data-form="message"'),()=>'', 'Mail');
  case 'Responsables': case 'Programmeurs': return rows(page,'Les membres de cette équipe.',people.filter(p=>p.group===page),button('Ajouter un membre','Plus','data-form="person"'),()=>'', 'UsersRound');
  case 'Demandes techniques': return rows(page,'Suivez les interventions de la plateforme.',tickets,button('Nouvelle demande','Plus','data-form="ticket"'),t=>button(t.status,t.status==='Résolue'?'Check':'Circle','data-ticket="'+safe(t.id)+'"','secondary'), 'CodeXml');
  case 'Aide et support': return heading(page,'Trouvez les réponses à vos questions.')+'<div class="panel faq"><details><summary>Comment accéder à mes cours ?</summary><p>Ouvrez Mes cours, choisissez votre niveau et sélectionnez le support souhaité.</p></details><details><summary>Comment changer d’espace ?</summary><p>Ouvrez le sélecteur en bas du menu pour explorer un autre rôle de démonstration.</p></details><details><summary>Où trouver mes échéances ?</summary><p>Les rendez-vous et dates de remise apparaissent dans Mon agenda.</p></details></div>';
  default: return '';
  }
}
function render() {
  const profile=roles[role];
  app.innerHTML='<div class="shell"><aside class="sidebar" id="sidebar"><button data-page="Tableau de bord" class="brand"><img class="brand-logo" src="'+logo+'" alt="Cap Digital Scolaire"></button><div class="navigation"><div class="nav-label">ESPACE DE TRAVAIL</div>'+[['Tableau de bord','LayoutDashboard'],...profile.nav,['Mon agenda','CalendarDays'],['Messages','Mail']].map(navButton).join('')+'<div class="nav-label support">ASSISTANCE</div>'+navButton(['Aide et support','CircleHelp'])+'</div><div class="sidebar-footer"><button class="role-switch" data-action="roles"><span class="role-avatar">'+icon(profile.icon,20)+'</span><span><b>Espace '+safe(role.toLowerCase())+'</b><small>Changer d’espace</small></span>'+icon('ChevronsUpDown',16)+'</button></div></aside><div class="main"><header class="topbar"><div class="top-title"><button class="icon-btn menu-toggle" data-action="menu" aria-label="Menu">'+icon('Menu')+'</button><b>'+safe(page)+'</b></div><div class="top-actions"><form id="search" class="search">'+icon('Search',18)+'<input name="q" aria-label="Rechercher un cours" placeholder="Rechercher…" value="'+safe(query)+'"><kbd>⌘ K</kbd></form><button class="icon-btn bell" data-action="notifications" aria-label="Notifications">'+icon('Bell',21)+'<i></i></button><button class="profile" data-action="roles" aria-label="Changer d’espace"><span class="avatar">'+initials(profile.name)+'</span><span><b>'+safe(profile.name)+'</b><small>'+safe(role==='Élève'?grade:role)+'</small></span>'+icon('ChevronDown',15)+'</button></div></header><main>'+content()+'</main></div></div>';
}
function modal(title, body) {
  dialog.innerHTML='<div class="dialog-head"><h2>'+safe(title)+'</h2><button class="icon-btn" data-action="close" aria-label="Fermer">'+icon('X')+'</button></div>'+body;
  if (!dialog.open) dialog.showModal();
}
function notify(message) {
  const toast=document.querySelector('#toast');
  toast.textContent=message;
  toast.classList.add('visible');
  clearTimeout(notify.timer);
  notify.timer=setTimeout(()=>toast.classList.remove('visible'),2800);
}
function openCourse(id) {
  const c=courseList().find(x=>x.id===id);
  if (!c) return;
  const description=c.description || summaries[id];
  const media=c.url?(c.format==='Vidéo'?'<video controls src="'+safe(c.url)+'"></video>':'<p><a class="btn secondary" href="'+safe(c.url)+'" download="'+safe(c.title)+'.pdf">Télécharger le PDF</a></p>'):'';
  modal(c.title,'<p class="dialog-meta">'+safe(c.subject)+' · '+safe(c.grade)+' · '+safe(c.format)+'</p><p>'+safe(description)+'</p>'+media+(!c.url&&c.format==='PDF'?button('Télécharger le PDF','Download','data-pdf="'+safe(c.id)+'"','secondary'):'')+(role==='Élève'?'<div class="dialog-actions">'+button(progress(c)===100?'Terminé':'Marquer comme terminé','Check','data-complete="'+safe(c.id)+'" '+(progress(c)===100?'disabled':''))+'</div>':''));
}
const input=(name,label,type='text',args='')=>'<label>'+label+'<input required name="'+name+'" type="'+type+'" '+args+'></label>';
const area=(name,label)=>'<label>'+label+'<textarea required name="'+name+'" rows="3"></textarea></label>';
const select=(name,label,options)=>'<label>'+label+'<select name="'+name+'">'+options.map(x=>'<option>'+safe(x)+'</option>').join('')+'</select></label>';
const forms = {
  course:()=>['Publier un cours',input('title','Titre du cours')+input('subject','Matière')+select('grade','Niveau',grades)+area('description','Description')+input('file','Fichier PDF ou vidéo','file','accept="application/pdf,video/*"')],
  note:()=>['Ajouter une note',input('subject','Matière')+input('mark','Note sur 20','number','min="0" max="20" step="0.25"')+area('comment','Remarque pédagogique')],
  event:()=>['Ajouter un événement',input('title','Intitulé')+input('date','Date','date')+input('detail','Heure et lieu')],
  message:()=>['Nouveau message',input('title','Destinataire')+area('detail','Message')],
  ticket:()=>['Nouvelle demande',input('title','Intitulé')+area('detail','Description')],
  person:()=>['Ajouter un membre',input('title','Nom complet')+input('detail','Fonction')],
  homework:()=>['Remettre le devoir',input('file','Fichier du devoir','file','accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"')]
};
function openForm(kind,id='') {
  const [title,fields]=forms[kind]();
  modal(title,'<form id="editor" data-kind="'+kind+'" data-id="'+safe(id)+'">'+fields+'<div class="dialog-actions"><button class="btn primary" type="submit">Enregistrer</button></div></form>');
}
function fileData(file) {
  return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.readAsDataURL(file);});
}
async function saveForm(form) {
  const data=Object.fromEntries(new FormData(form));
  const id=crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36);
  const kind=form.dataset.kind;
  if (data.file?.size>2000000) throw new Error('Choisissez un fichier de moins de 2 Mo pour cette démonstration.');
  if (kind==='course') {
    const pdf=data.file.type==='application/pdf';
    if (!pdf&&!data.file.type.startsWith('video/')) throw new Error('Choisissez un fichier PDF ou vidéo.');
    const next=[{id,title:data.title,subject:data.subject,description:data.description,grade:data.grade,teacher:roles[role].name,format:pdf?'PDF':'Vidéo',theme:'blue',glyph:'BookOpen',url:await fileData(data.file)},...custom];
    write('cap-courses',next); custom=next;
  }
  if (kind==='note') { const next=[...notes,{...data,id,mark:Number(data.mark)}];write('cap-notes',next);notes=next; }
  if (kind==='event') {
    const d=new Date(data.date+'T12:00:00');
    const next=[...entries,{id,title:data.title,detail:data.detail,day:String(d.getDate()).padStart(2,'0'),month:new Intl.DateTimeFormat('fr-FR',{month:'short'}).format(d).toUpperCase().replace('.',''),theme:'blue'}];write('cap-agenda',next);entries=next;
  }
  if (kind==='message') { const next=[{...data,id},...messages];write('cap-messages',next);messages=next; }
  if (kind==='ticket') { const next=[{...data,id,status:'À traiter'},...tickets];write('cap-tickets',next);tickets=next; }
  if (kind==='person') { const next=[...people,{...data,id,group:page}];write('cap-team',next);people=next; }
  if (kind==='homework') {
    const next=[...homework,form.dataset.id];
    write('cap-submission-'+form.dataset.id,{name:data.file.name,url:await fileData(data.file)});
    write('cap-homework',next);homework=next;
  }
  dialog.close(); render(); notify('Enregistrement effectué.');
}
function downloadPdf(c) {
  const clean=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^ -~]/g,'-').replace(/[()\\]/g,'\\$&');
  const words=(summaries[c.id]||c.description||'').split(' ');
  const lines=[clean(c.title),''];
  let line='';
  for(const w of words) {if(line.length+w.length>75){lines.push(clean(line));line='';}line+=(line?' ':'')+w;}
  if(line) lines.push(clean(line));
  const stream='BT /F1 13 Tf 50 780 Td 20 TL '+lines.map(s=>'('+s+') Tj T*').join('\n')+' ET';
  const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>','<< /Length '+stream.length+' >>\nstream\n'+stream+'\nendstream'];
  let pdf='%PDF-1.4\n';
  const offsets=objects.map((o,i)=>{const offset=pdf.length;pdf+=(i+1)+' 0 obj\n'+o+'\nendobj\n';return offset;});
  const xref=pdf.length;
  pdf+='xref\n0 6\n0000000000 65535 f \n'+offsets.map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')+'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF';
  const url=URL.createObjectURL(new Blob([pdf],{type:'application/pdf'}));
  const link=document.createElement('a');link.href=url;link.download=c.id+'.pdf';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
document.addEventListener('click', e=>{
  const b=e.target.closest('button');
  if(!b || b.disabled) return;
  const d=b.dataset;
  if(d.page) go(d.page);
  if(d.course) openCourse(d.course);
  if(d.form) openForm(d.form);
  if(d.pdf) downloadPdf(courseList().find(c=>c.id===d.pdf));
  if(d.complete){done=[...new Set([...done,d.complete])];write('cap-completed',done);render();openCourse(d.complete);notify('Cours terminé.');}
  if(d.task){
    if(homework.includes(d.task)){
      const submission=read('cap-submission-'+d.task,null);
      modal('Devoir remis','<p>'+safe(submission?.name)+'</p>');
    }else openForm('homework',d.task);
  }
  if(d.ticket){tickets=tickets.map(t=>t.id===d.ticket?{...t,status:t.status==='Résolue'?'À traiter':'Résolue'}:t);write('cap-tickets',tickets);render();}
  if(d.role && roles[d.role]){role=d.role;write('cap-role',role);dialog.close();go('Tableau de bord');}
  if(d.action==='close') dialog.close();
  if(d.action==='menu') document.querySelector('#sidebar').classList.toggle('opened');
  if(d.action==='roles') modal('Choisir un espace','<p>Explorez les profils de démonstration.</p><div class="role-grid">'+Object.entries(roles).map(([name,p])=>button(name,p.icon,'data-role="'+safe(name)+'"',role===name?'primary':'secondary')).join('')+'</div>');
  if(d.action==='notifications') modal('Notifications','<div class="notification">'+events(3)+'</div>');
});
document.addEventListener('change',e=>{
  if(e.target.id==='format-filter') {filter=e.target.value;render();}
  if(e.target.id==='grade-filter') {grade=e.target.value;render();}
});
document.addEventListener('submit',async e=>{
  e.preventDefault();
  if(e.target.id==='search'){
    query=new FormData(e.target).get('q').trim();
    page='Recherche';filter='Tous les cours';render();
  }
  if(e.target.id==='editor'){
    const submit=e.target.querySelector('button[type="submit"]');
    submit.disabled=true;
    try { await saveForm(e.target); } catch (error) {
      let status=e.target.querySelector('.form-error');
      if (!status) { status=document.createElement('p'); status.className='form-error'; status.setAttribute('role','alert'); submit.parentElement.before(status); }
      status.textContent=error.name==='QuotaExceededError'?'Le stockage local est plein. Essayez un fichier plus petit.':error.message;
      submit.disabled=false;
    }
  }
});
document.addEventListener('keydown', e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();document.querySelector('#search input').focus();}});
render();

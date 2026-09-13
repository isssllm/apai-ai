const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const SUPABASE_URL = 'https://aqqxxobwjwrffzilcmhr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_vbR6qA7_lSCrwZDKvFIYGw_ve6xxDBb';
const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const state = {
  material: 'test', language: localStorage.getItem('apai_lang') || 'kk', step: 1,
  prompt: '', user: null, profile: null, canGenerate: false, authMode: 'login'
};
const adminState={users:[],page:1,pageSize:20,search:'',status:'all',plan:'all'};

const dict = {
kk:{
navCreate:'Промпт жасау',navSaved:'Менің промпттарым',navAbout:'Жоба туралы',navHelp:'Көмек',login:'Кіру / Тіркелу',logout:'Шығу',adminPanel:'Админ панелі',adminUsers:'Қолданушылар',
eyebrow:'Мұғалімдерге арналған жаңа буын құралы',heroTitle:'Сабаққа дайындықты<br><span>ақылдырақ</span> жасаңыз.',heroText:'Тест, БЖБ, ТЖБ, ҚМЖ және визуалды материалдарға арналған дайын кәсіби промпттарды бірнеше қадамда жасаңыз.',start:'Промпт жасау <span>↗</span>',learn:'Толығырақ',note:'Көру ашық • Генератор ақылы қолданушыларға',preview:'Промпт дайын',copy:'Көшіру',quality:'Сапалы шаблондар',
createTitle:'Өзіңізге қажет промптты жасаңыз.',createText:'Материалды таңдаңыз — ApaI тек сол материалға қажетті сұрақтарды көрсетіп, дайын кәсіби промптты автоматты түрде толтырады.',
stepMaterial:'Материал',stepLesson:'Мәліметтер',stepSettings:'Баптаулар',stepResult:'Нәтиже',materialTitle:'Қандай материал керек?',continue:'Жалғастыру →',lessonTitle:'Негізгі мәліметтер',back:'← Артқа',settingsTitle:'Қосымша баптаулар',generate:'Промпт жасау ✦',resultTitle:'Дайын!',copyPrompt:'Промптты көшіру',savePrompt:'Сақтау',newPrompt:'Жаңа промпт',
tipsTitle:'ApaI қалай жұмыс істейді?',tipsText:'Әр материалға жеке кәсіби шаблон орнатылған. Сіз тек қажет мәліметтерді толтырасыз — сайт дайын промптты сол параметрлерге бейімдейді.',tip1:'Материал түрін таңдаңыз.',tip2:'Тек қажетті өрістерді толтырыңыз.',tip3:'Дайын промптты көшіріп алыңыз.',
savedTitle:'Менің промпттарым.',savedText:'Аккаунтыңызда сақталған промпттарды қайта ашыңыз.',aboutTitle:'Мұғалім уақытын үнемдейтін кәсіби промпт конструкторы.',aboutText:'ApaI әр материалға бөлек шаблон қолданады. Тестке бір логика, БЖБ/ТЖБ-ға бағалау құрылымы, презентация мен визуалдарға дизайн талаптары автоматты түрде беріледі.',helpTitle:'Көмек',helpText:'ApaI жасаған промптты ChatGPT, Gemini және басқа ЖИ құралдарына көшіруге болады.',faq1Q:'ApaI өзі материалды жасай ма?',faq1A:'ApaI дайын кәсіби промпт құрастырады. Соңғы материалды сіз таңдаған ЖИ сервисі жасайды.',faq2Q:'Үлгісін қалай көремін?',faq2A:'Материал карточкасындағы «Үлгісін көру» батырмасын басыңыз. Онда нәтиженің шамамен қандай форматта шығатыны көрсетіледі.',footerText:'Мұғалімдерге арналған ақылды көмекші.',
authLoginTitle:'Аккаунтқа кіру',authLoginText:'Промпт жасау үшін алдымен аккаунтқа кіріңіз немесе тіркеліңіз.',authSignupTitle:'ApaI-ге тіркелу',authSignupText:'Тіркелгеннен кейін төлеміңізді жасап, админнің қабылдауын күтіңіз. Қабылданғаннан кейін генератор ашылады.',loginTab:'Кіру',signupTab:'Тіркелу',fullName:'Аты-жөніңіз',password:'Құпиясөз',accountTitle:'Аккаунт',
accessPending:'Аккаунтыңыз тіркелді. Қазір админнің қабылдауын күтіңіз және төлемді растаңыз.',accessFree:'Аккаунт тіркелген, бірақ генераторды пайдалану үшін төлем қажет. Төлемнен кейін админ аккаунтты белсендіреді.',accessApproved:'Аккаунт белсенді. Генераторды пайдалана аласыз.',accessRejected:'Аккаунтты пайдалану рұқсат етілмеді. Админге хабарласыңыз.',accessBlocked:'Аккаунт бұғатталған.',notRegistered:'Промпт жасау үшін алдымен тіркелу немесе кіру керек.',paidOnly:'Генератор тек төлемі расталған және админ қабылдаған қолданушыларға ашық.',adminStatus:'Админ',paidStatus:'Ақылы аккаунт',freeStatus:'Төлем күтілуде',pendingStatus:'Қабылдау күтілуде',
accessUntil:'Қолжетімділік мерзімі',remainingTime:'Қалған уақыт',expiredStatus:'Мерзімі аяқталды',unlimited:'Шектеусіз',addMonth:'＋1 ай',blockNow:'Блоктау',savedEmpty:'Әзірге сақталған промпт жоқ.',profile:'Профиль',signupSuccess:'Тіркелу сәтті өтті. Email-ді растаңыз (егер растау қосылған болса), содан кейін төлем жасап, админнің қабылдауын күтіңіз.',loginSuccess:'Сәтті кірдіңіз.',adminTitle:'Админ панелі',adminSubtitle:'Қолданушыларды іздеу, сүзу және қолжетімділігін басқару.',searchUsers:'Аты немесе email бойынша іздеу',allStatuses:'Барлық статус',allPlans:'Барлық тариф',prev:'← Алдыңғы',next:'Келесі →',close:'Жабу',viewExample:'Үлгісін көру',exampleNote:'Бұл — нәтиженің шамамен көрінісі. Нақты материал сіз енгізген тақырып пен талаптарға байланысты өзгереді.'
},
ru:{
navCreate:'Создать промпт',navSaved:'Мои промпты',navAbout:'О проекте',navHelp:'Помощь',login:'Войти / Регистрация',logout:'Выйти',adminPanel:'Админ-панель',adminUsers:'Пользователи',
eyebrow:'Инструмент нового поколения для учителей',heroTitle:'Готовьте уроки<br><span>умнее.</span>',heroText:'Создавайте готовые профессиональные промпты для тестов, СОР, СОЧ, планов уроков и визуальных материалов.',start:'Создать промпт <span>↗</span>',learn:'Подробнее',note:'Просмотр открыт • Генератор для оплативших',preview:'Промпт готов',copy:'Копировать',quality:'Качественные шаблоны',
createTitle:'Создайте нужный вам промпт.',createText:'Выберите материал — ApaI покажет только нужные поля и автоматически подставит их в профессиональный шаблон.',stepMaterial:'Материал',stepLesson:'Данные',stepSettings:'Настройки',stepResult:'Результат',materialTitle:'Какой материал нужен?',continue:'Продолжить →',lessonTitle:'Основные данные',back:'← Назад',settingsTitle:'Дополнительные настройки',generate:'Создать промпт ✦',resultTitle:'Готово!',copyPrompt:'Скопировать промпт',savePrompt:'Сохранить',newPrompt:'Новый промпт',
tipsTitle:'Как работает ApaI?',tipsText:'Для каждого типа материала используется отдельный профессиональный шаблон. Вы заполняете только нужные данные — сайт адаптирует готовый промпт.',tip1:'Выберите тип материала.',tip2:'Заполните нужные поля.',tip3:'Скопируйте готовый промпт.',savedTitle:'Мои промпты.',savedText:'Открывайте сохранённые промпты вашего аккаунта.',aboutTitle:'Профессиональный конструктор промптов, экономящий время учителя.',aboutText:'Для теста, СОР/СОЧ, презентации и визуальных материалов используются разные шаблоны и разные поля.',helpTitle:'Помощь',helpText:'Готовый промпт можно скопировать в ChatGPT, Gemini и другие AI-сервисы.',faq1Q:'ApaI сам создаёт материал?',faq1A:'ApaI формирует профессиональный промпт. Финальный материал создаёт выбранный вами AI-сервис.',faq2Q:'Как посмотреть пример?',faq2A:'Нажмите «Посмотреть пример» на карточке материала — откроется примерный вид результата.',footerText:'Умный помощник для учителей.',
authLoginTitle:'Вход в аккаунт',authLoginText:'Чтобы создавать промпты, сначала войдите или зарегистрируйтесь.',authSignupTitle:'Регистрация в ApaI',authSignupText:'После регистрации оплатите доступ и дождитесь подтверждения администратора.',loginTab:'Войти',signupTab:'Регистрация',fullName:'Ваше имя',password:'Пароль',accountTitle:'Аккаунт',accessPending:'Аккаунт зарегистрирован. Ожидается подтверждение администратора и оплаты.',accessFree:'Для генератора требуется оплаченный доступ.',accessApproved:'Аккаунт активен. Генератор доступен.',accessRejected:'Доступ отклонён. Обратитесь к администратору.',accessBlocked:'Аккаунт заблокирован.',notRegistered:'Сначала зарегистрируйтесь или войдите.',paidOnly:'Генератор доступен только оплатившим и одобренным пользователям.',adminStatus:'Администратор',paidStatus:'Платный аккаунт',freeStatus:'Ожидается оплата',pendingStatus:'Ожидается одобрение',accessUntil:'Доступ до',remainingTime:'Осталось',expiredStatus:'Срок истёк',unlimited:'Без ограничений',addMonth:'＋1 месяц',blockNow:'Блокировать',savedEmpty:'Пока нет сохранённых промптов.',profile:'Профиль',signupSuccess:'Регистрация прошла успешно. Подтвердите email, если подтверждение включено, затем дождитесь одобрения.',loginSuccess:'Вы вошли в аккаунт.',adminTitle:'Админ-панель',adminSubtitle:'Поиск, фильтрация и управление доступом пользователей.',searchUsers:'Поиск по имени или email',allStatuses:'Все статусы',allPlans:'Все тарифы',prev:'← Назад',next:'Далее →',close:'Закрыть',viewExample:'Посмотреть пример',exampleNote:'Это примерный вид результата. Финальный материал зависит от введённой темы и требований.'
}};

function t(k){return dict[state.language][k] || k;}
function materialName(key=state.material,lang=state.language){return MATERIAL_CONFIG[key]?.name?.[lang]||MATERIAL_CONFIG[key]?.name?.kk||key;}
function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}

function accessTimeInfo(profile){
  if(!profile) return {date:'—',remaining:'—',expired:false};
  if(profile.plan==='admin') return {date:t('unlimited'),remaining:t('unlimited'),expired:false};
  if(!profile.paid_until) return {date:'—',remaining:'—',expired:false};
  const end=new Date(profile.paid_until), now=new Date();
  const ms=end-now, expired=ms<=0;
  const locale=state.language==='kk'?'kk-KZ':'ru-RU';
  const date=end.toLocaleString(locale,{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});
  if(expired) return {date,remaining:t('expiredStatus'),expired:true};
  const totalMinutes=Math.max(0,Math.floor(ms/60000));
  const days=Math.floor(totalMinutes/1440), hours=Math.floor((totalMinutes%1440)/60), minutes=totalMinutes%60;
  let remaining;
  if(state.language==='kk') remaining=days>0?`${days} күн ${hours} сағ`:hours>0?`${hours} сағ ${minutes} мин`:`${minutes} мин`;
  else remaining=days>0?`${days} дн. ${hours} ч.`:hours>0?`${hours} ч. ${minutes} мин.`:`${minutes} мин.`;
  return {date,remaining,expired:false};
}

function applyLanguage(lang){
  state.language=lang; document.documentElement.lang=lang;
  $('#languageBtn').textContent=lang==='kk'?'ҚАЗ / РУС':'РУС / ҚАЗ';
  $$('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(dict[lang][key]!=null)el.innerHTML=dict[lang][key];});
  $$('[data-i18n-placeholder]').forEach(el=>{const key=el.dataset.i18nPlaceholder;if(dict[lang][key]!=null)el.placeholder=dict[lang][key];});
  localStorage.setItem('apai_lang',lang); renderMaterialChoices(); renderMaterialFields(); updateAccessUI(); renderSaved(); updateAccountButton();
  if(!$('#adminPage').hidden) renderAdminUsers();
}

$('#languageBtn').addEventListener('click',()=>applyLanguage(state.language==='kk'?'ru':'kk'));
$('#themeBtn').addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('apai_theme',document.body.classList.contains('dark')?'dark':'light');$('#themeBtn').textContent=document.body.classList.contains('dark')?'☀':'☾';});
if(localStorage.getItem('apai_theme')==='dark'){document.body.classList.add('dark');$('#themeBtn').textContent='☀';}

function openModal(sel){$(sel)?.classList.add('show');$(sel)?.setAttribute('aria-hidden','false');}
function closeModal(sel){$(sel)?.classList.remove('show');$(sel)?.setAttribute('aria-hidden','true');}
$('#authClose').addEventListener('click',()=>closeModal('#authModal'));
$('#accountClose').addEventListener('click',()=>closeModal('#accountModal'));
$('#previewClose').addEventListener('click',()=>closeModal('#previewModal'));
$$('.modal-backdrop').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModal('#'+m.id);}));

function setAuthMessage(msg,type='info'){$('#authMessage').textContent=msg;$('#authMessage').className=`auth-message ${type}`;}
function switchAuthMode(mode){
  state.authMode=mode; const signup=mode==='signup';
  $('#loginTab').classList.toggle('active',!signup);$('#signupTab').classList.toggle('active',signup);
  $('#authName').required=signup;$('#authName').style.display=signup?'block':'none';
  $('#authTitle').textContent=signup?t('authSignupTitle'):t('authLoginTitle');$('#authDescription').textContent=signup?t('authSignupText'):t('authLoginText');$('#authSubmit').textContent=signup?t('signupTab'):t('loginTab');$('#authMessage').textContent='';
}
$('#loginTab').addEventListener('click',()=>switchAuthMode('login'));$('#signupTab').addEventListener('click',()=>switchAuthMode('signup'));$('#authName').style.display='none';switchAuthMode('login');

function accessAllowed(){return !!state.user && !!state.canGenerate;}
function updateAccessUI(){
  const note=$('#accessNote'),btn=$('.generate-btn'); if(!note||!btn)return;
  if(accessAllowed()){btn.disabled=false;note.textContent=t('accessApproved');note.className='access-note ok';return;}
  btn.disabled=false;
  if(!state.user){note.textContent=t('notRegistered');note.className='access-note locked';return;}
  const p=state.profile;
  if(p?.access_status==='blocked'){note.textContent=t('accessBlocked');note.className='access-note locked';return;}
  if(p?.access_status==='rejected'){note.textContent=t('accessRejected');note.className='access-note locked';return;}
  if(p?.plan==='free'){note.textContent=t('accessFree');note.className='access-note locked';return;}
  note.textContent=t('accessPending');note.className='access-note locked';
}
function guardGenerator(){if(!state.user){openModal('#authModal');switchAuthMode('login');return false;}if(!state.canGenerate){renderAccount();openModal('#accountModal');return false;}return true;}
$('#heroCreateBtn').addEventListener('click',e=>{if(!guardGenerator())e.preventDefault();});
$$('.desktop-nav a[href="#create"]').forEach(a=>a.addEventListener('click',e=>{if(!guardGenerator())e.preventDefault();}));

function renderMaterialChoices(){
  const box=$('#materialChoices'); if(!box)return;
  box.innerHTML=Object.entries(MATERIAL_CONFIG).map(([key,c])=>`<article class="choice ${state.material===key?'selected':''}" data-value="${key}" tabindex="0"><span class="icon">${c.icon}</span><div class="choice-copy"><strong>${escapeHtml(c.name[state.language])}</strong><small>${escapeHtml(c.subtitle[state.language])}</small></div><button class="preview-link" type="button" data-preview="${key}">${t('viewExample')}</button></article>`).join('');
  $$('.choice').forEach(c=>{const pick=()=>{if(!guardGenerator())return;state.material=c.dataset.value;renderMaterialChoices();renderMaterialFields();};c.addEventListener('click',e=>{if(e.target.closest('.preview-link'))return;pick();});c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick();}});});
  $$('.preview-link').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();showPreview(b.dataset.preview);}));
}

function renderField(key){
  const f=FIELD_DEFS[key],lang=state.language,label=f.label[lang]||f.label.kk,ph=f.placeholder?.[lang]||f.placeholder?.kk||'';const req=f.required?' <em>*</em>':'';const cls=f.full?'full':'';
  if(f.type==='select')return `<label class="${cls}"><span>${escapeHtml(label)}${req}</span><select data-field="${key}" ${f.required?'required':''}>${f.options.map((o,i)=>`<option value="${escapeHtml(o)}" ${i===0?'selected':''}>${escapeHtml(o)}</option>`).join('')}</select></label>`;
  if(f.type==='textarea')return `<label class="${cls}"><span>${escapeHtml(label)}${req}</span><textarea data-field="${key}" rows="${f.rows||3}" placeholder="${escapeHtml(ph)}" ${f.required?'required':''}></textarea></label>`;
  return `<label class="${cls}"><span>${escapeHtml(label)}${req}</span><input data-field="${key}" type="${f.type||'text'}" ${f.min!=null?`min="${f.min}"`:''} ${f.max!=null?`max="${f.max}"`:''} placeholder="${escapeHtml(ph)}" ${f.required?'required':''}></label>`;
}
function renderMaterialFields(){
  const cfg=MATERIAL_CONFIG[state.material]; if(!cfg)return;
  $('#primaryFields').innerHTML=cfg.primary.map(renderField).join('');$('#settingsFields').innerHTML=cfg.settings.map(renderField).join('');
}
function collectFormData(){const data={};$$('[data-field]').forEach(el=>data[el.dataset.field]=el.value);return data;}
function validateVisibleFields(containerSel){
  let first=null; $(`${containerSel}`).querySelectorAll('[required]').forEach(el=>{el.classList.remove('field-error');if(!String(el.value||'').trim()&&!first){first=el;el.classList.add('field-error');}});
  if(first){first.focus();return false;}return true;
}
function showStep(n){
  if(n>1&&!guardGenerator())return;
  if(n===3&&!validateVisibleFields('#primaryFields'))return;
  state.step=n;$$('.form-step').forEach(x=>x.classList.toggle('active',Number(x.dataset.panel)===n));$$('.step').forEach(x=>x.classList.toggle('active',Number(x.dataset.step)<=n));$('#create').scrollIntoView({behavior:'smooth',block:'start'});
}
$$('.next-btn').forEach(b=>b.onclick=()=>showStep(Number(b.dataset.next)));$$('.back-btn').forEach(b=>b.onclick=()=>showStep(Number(b.dataset.back)));

function makePrompt(){const data=collectFormData();const builder=PROMPT_BUILDERS[state.material];return builder?builder(data):'';}
$('.generate-btn').addEventListener('click',async()=>{
  if(!guardGenerator())return;if(!validateVisibleFields('#settingsFields'))return;
  const btn=$('.generate-btn');btn.disabled=true;const old=btn.innerHTML;btn.innerHTML='⏳';await new Promise(r=>setTimeout(r,280));
  state.prompt=makePrompt();$('#promptOutput').textContent=state.prompt;btn.disabled=false;btn.innerHTML=old;showStep(4);
});
$('#copyBtn').addEventListener('click',async()=>{if(!accessAllowed())return guardGenerator();await navigator.clipboard.writeText(state.prompt);$('#copyBtn').textContent=state.language==='kk'?'✓ Көшірілді':'✓ Скопировано';setTimeout(()=>$('#copyBtn').textContent=t('copyPrompt'),1600);});

const previewDefinitions={
 test:{title:'Тест',kind:'paper',tag:'8 сынып • Биология',headline:'Қанның құрамы',blocks:['5 тест сұрағы','Деңгейлік тапсырмалар','Сәйкестендіру','Бонус тапсырма']},
 bjb:{title:'БЖБ',kind:'paper',tag:'8 сынып • 2 тоқсан',headline:'Бөлім бойынша жиынтық бағалау',blocks:['Оқу мақсаттары','4–6 тапсырма','Жалпы балл','Жауап кілті']},
 tjb:{title:'ТЖБ',kind:'paper',tag:'9 сынып • 1 тоқсан',headline:'Тоқсан бойынша жиынтық бағалау',blocks:['Спецификация','Бөлімдер бойынша тапсырмалар','Балл қою кестесі','Дескрипторлар']},
 presentation:{title:'Презентация',kind:'slides',tag:'10 сынып • Информатика',headline:'Жасанды интеллект',blocks:['Оқу мақсаты','Жаңа тақырып','Практика','Рефлексия']},
 worksheet:{title:'Жұмыс парағы',kind:'worksheet',tag:'7 сынып • Информатика',headline:'Компьютерлік желілер',blocks:['Ассоциация','Суретпен жұмыс','Сәйкестендіру','Ойын элементі']},
 poster:{title:'Постер',kind:'poster',tag:'8 сынып • Биология',headline:'Қанның құрамы',blocks:['Бұл не?','Неліктен маңызды?','Білесің бе?','Есте сақта!']},
 infographic:{title:'Инфографика',kind:'infographic',tag:'7 сынып • География',headline:'Су айналымы',blocks:['Негізгі визуал','4–6 блок','Кезеңдік схема','Есте сақта!']},
 cards:{title:'Карточкалар',kind:'cards',tag:'6 сынып • Математика',headline:'Қатынас және пропорция',blocks:['№1','№2','№3','№4','№5','№6']},
 lessonPlan:{title:'Сабақ жоспары',kind:'plan',tag:'7 сынып • Информатика',headline:'Қысқа мерзімді жоспар',blocks:['Сабақтың басы','Сабақтың ортасы','Бағалау','Рефлексия']},
 banner:{title:'Баннер',kind:'banner',tag:'Онлайн практикум',headline:'ЖИ-ПРАКТИКУМ',blocks:['05.09.2026','19:00','2 000 ₸','ТІРКЕЛУ']}
};
function showPreview(key){const p=previewDefinitions[key];if(!p)return;$('#previewTitle').textContent=p.title;$('#previewNote').textContent=t('exampleNote');$('#previewCanvas').innerHTML=`<div class="sample ${p.kind}"><div class="sample-top"><span>${escapeHtml(p.tag)}</span><b>${MATERIAL_CONFIG[key].icon}</b></div><h4>${escapeHtml(p.headline)}</h4><div class="sample-blocks">${p.blocks.map((x,i)=>`<div class="sample-block"><i>${String(i+1).padStart(2,'0')}</i><span>${escapeHtml(x)}</span></div>`).join('')}</div></div>`;openModal('#previewModal');}

async function loadProfile(){
  if(!state.user){state.profile=null;state.canGenerate=false;updateAccessUI();renderSaved();return;}
  let {data,error}=await supabaseClient.from('profiles').select('*').eq('id',state.user.id).maybeSingle();if(error){console.error(error);return;}state.profile=data||null;
  const result=await supabaseClient.rpc('can_generate');state.canGenerate=!!result.data;
  if(state.profile?.plan==='paid' && state.profile?.paid_until && new Date(state.profile.paid_until)<=new Date()){
    const refreshed=await supabaseClient.from('profiles').select('*').eq('id',state.user.id).maybeSingle();
    if(!refreshed.error) state.profile=refreshed.data||state.profile;
  }
  updateAccessUI();renderSaved();$('#adminPanelBtn').hidden=state.profile?.plan!=='admin';
}
async function initAuth(){if(!supabaseClient){setAuthMessage('Supabase connection failed.','error');return;}const {data}=await supabaseClient.auth.getSession();state.user=data?.session?.user||null;await loadProfile();supabaseClient.auth.onAuthStateChange(async(_event,session)=>{state.user=session?.user||null;if(!state.user)state.profile=null;await loadProfile();updateAccountButton();});updateAccountButton();}
function updateAccountButton(){const b=$('#accountBtn');if(!state.user){b.textContent=t('login');return;}const name=state.profile?.full_name||state.user.email||'Аккаунт';b.textContent=name.length>20?name.slice(0,20)+'…':name;}
$('#accountBtn').addEventListener('click',()=>{if(!state.user){openModal('#authModal');switchAuthMode('login');}else{renderAccount();openModal('#accountModal');}});
$('#authForm').addEventListener('submit',async e=>{e.preventDefault();if(!supabaseClient)return;const email=$('#authEmail').value.trim(),password=$('#authPassword').value,fullName=$('#authName').value.trim();$('#authSubmit').disabled=true;setAuthMessage('…');try{if(state.authMode==='signup'){const {data,error}=await supabaseClient.auth.signUp({email,password,options:{data:{full_name:fullName}}});if(error)throw error;if(data.session){state.user=data.session.user;await loadProfile();setAuthMessage(t('signupSuccess'),'ok');setTimeout(()=>closeModal('#authModal'),900);}else setAuthMessage(t('signupSuccess'),'ok');}else{const {data,error}=await supabaseClient.auth.signInWithPassword({email,password});if(error)throw error;state.user=data.user;await loadProfile();setAuthMessage(t('loginSuccess'),'ok');setTimeout(()=>closeModal('#authModal'),600);}}catch(err){setAuthMessage(err.message||'Error','error');}finally{$('#authSubmit').disabled=false;updateAccountButton();}});
$('#logoutBtn').addEventListener('click',async()=>{await supabaseClient.auth.signOut();closeModal('#accountModal');state.user=null;state.profile=null;state.canGenerate=false;updateAccessUI();updateAccountButton();});
function renderAccount(){const box=$('#accountDetails');if(!state.user){box.innerHTML=`<p>${t('notRegistered')}</p>`;return;}const p=state.profile||{},time=accessTimeInfo(p);let status=t('freeStatus');if(p.plan==='admin')status=t('adminStatus');else if(time.expired)status=t('expiredStatus');else if(p.plan==='paid'&&p.access_status==='approved')status=t('paidStatus');else if(p.access_status==='pending')status=t('pendingStatus');else if(p.access_status==='blocked')status=t('accessBlocked');box.innerHTML=`<div class="account-line"><span>Email</span><b>${escapeHtml(state.user.email||'')}</b></div><div class="account-line"><span>${t('profile')}</span><b>${escapeHtml(p.full_name||'—')}</b></div><div class="account-line"><span>Status</span><b>${escapeHtml(status)}</b></div><div class="account-line"><span>Access</span><b>${state.canGenerate?'ACTIVE':'LOCKED'}</b></div><div class="account-line"><span>${t('accessUntil')}</span><b>${escapeHtml(time.date)}</b></div><div class="account-line"><span>${t('remainingTime')}</span><b>${escapeHtml(time.remaining)}</b></div>`;$('#adminPanelBtn').hidden=p.plan!=='admin';}

$('#adminPanelBtn').addEventListener('click',openAdminPage);$('#adminCloseBtn').addEventListener('click',closeAdminPage);$('#refreshUsers').addEventListener('click',loadUsers);
$('#adminSearch').addEventListener('input',e=>{adminState.search=e.target.value;adminState.page=1;renderAdminUsers();});
$('#adminStatusFilter').addEventListener('change',e=>{adminState.status=e.target.value;adminState.page=1;renderAdminUsers();});
$('#adminPlanFilter').addEventListener('change',e=>{adminState.plan=e.target.value;adminState.page=1;renderAdminUsers();});
$('#adminPrev').addEventListener('click',()=>{if(adminState.page>1){adminState.page--;renderAdminUsers();}});$('#adminNext').addEventListener('click',()=>{adminState.page++;renderAdminUsers();});
function openAdminPage(){if(state.profile?.plan!=='admin')return;closeModal('#accountModal');$('#adminPage').hidden=false;document.body.classList.add('admin-page-open');loadUsers();}
function closeAdminPage(){$('#adminPage').hidden=true;document.body.classList.remove('admin-page-open');}
async function loadUsers(){if(state.profile?.plan!=='admin')return;$('#adminUserList').innerHTML='<div class="empty">Loading…</div>';await supabaseClient.rpc('admin_expire_paid_users');const {data,error}=await supabaseClient.from('profiles').select('*').order('created_at',{ascending:false});if(error){$('#adminUserList').innerHTML=`<div class="empty">${escapeHtml(error.message)}</div>`;return;}adminState.users=data||[];adminState.page=1;renderAdminUsers();}
function renderAdminUsers(){
  const q=adminState.search.trim().toLowerCase();let rows=adminState.users.filter(p=>(!q||`${p.full_name||''} ${p.email||''}`.toLowerCase().includes(q))&&(adminState.status==='all'||p.access_status===adminState.status)&&(adminState.plan==='all'||p.plan===adminState.plan));
  const total=rows.length,pages=Math.max(1,Math.ceil(total/adminState.pageSize));adminState.page=Math.min(adminState.page,pages);const start=(adminState.page-1)*adminState.pageSize;rows=rows.slice(start,start+adminState.pageSize);
  $('#adminStats').innerHTML=`<div><b>${adminState.users.length}</b><span>${state.language==='kk'?'Барлығы':'Всего'}</span></div><div><b>${adminState.users.filter(x=>x.access_status==='pending').length}</b><span>Pending</span></div><div><b>${adminState.users.filter(x=>x.plan==='paid').length}</b><span>Paid</span></div><div><b>${adminState.users.filter(x=>x.access_status==='blocked').length}</b><span>Blocked</span></div>`;
  $('#adminPageInfo').textContent=`${adminState.page} / ${pages}`;$('#adminPrev').disabled=adminState.page<=1;$('#adminNext').disabled=adminState.page>=pages;
  const box=$('#adminUserList');if(!rows.length){box.innerHTML='<div class="empty">No users</div>';return;}
  box.innerHTML=rows.map(p=>{const time=accessTimeInfo(p);return `<article class="admin-user-row"><div class="admin-user-main"><strong>${escapeHtml(p.full_name||'Без имени')}</strong><small>${escapeHtml(p.email||p.id||'')}</small></div><div class="admin-chip">${escapeHtml(p.plan)}</div><div class="admin-chip status-${escapeHtml(p.access_status)}">${escapeHtml(p.access_status)}</div><div class="admin-access-time ${time.expired?'expired':''}"><b>${escapeHtml(time.remaining)}</b><small>${escapeHtml(time.date)}</small></div><div class="admin-date">${p.created_at?new Date(p.created_at).toLocaleDateString(state.language==='kk'?'kk-KZ':'ru-RU'):'—'}</div><div class="admin-row-actions">${p.plan!=='admin'?`<button class="mini-action add-month-user" data-id="${p.id}">${t('addMonth')}</button><button class="mini-action block-user" data-id="${p.id}">${t('blockNow')}</button>`:'<span class="admin-chip">ADMIN</span>'}</div></article>`}).join('');
  $$('.add-month-user').forEach(b=>b.onclick=()=>addOneMonth(b.dataset.id));
  $$('.block-user').forEach(b=>b.onclick=()=>blockUser(b.dataset.id));
}
async function addOneMonth(id){const {error}=await supabaseClient.rpc('admin_add_one_month',{target_user_id:id});if(error){alert(error.message);return;}await loadUsers();}
async function blockUser(id){const {error}=await supabaseClient.rpc('admin_block_user',{target_user_id:id});if(error){alert(error.message);return;}await loadUsers();}

async function saveCurrent(){if(!accessAllowed()){guardGenerator();return;}if(!state.prompt)return;const {error}=await supabaseClient.from('prompts').insert({user_id:state.user.id,title:materialName(state.material,'kk'),material:materialName(state.material,'kk'),prompt:state.prompt});$('#savedState').textContent=error?error.message:(state.language==='kk'?'Сақталды ✓':'Сохранено ✓');await renderSaved();}
$('#saveBtn').addEventListener('click',saveCurrent);$('#newBtn').addEventListener('click',()=>showStep(1));
async function renderSaved(){const box=$('#savedList');if(!box)return;if(!state.user){box.innerHTML=`<div class="empty">${t('notRegistered')}</div>`;return;}const {data,error}=await supabaseClient.from('prompts').select('*').eq('user_id',state.user.id).order('created_at',{ascending:false}).limit(30);if(error){box.innerHTML=`<div class="empty">${escapeHtml(error.message)}</div>`;return;}if(!data?.length){box.innerHTML=`<div class="empty">${t('savedEmpty')}</div>`;return;}box.innerHTML=data.map(x=>`<article class="saved-card"><h4>${escapeHtml(x.material)}</h4><div class="saved-meta">${new Date(x.created_at).toLocaleString(state.language==='kk'?'kk-KZ':'ru-RU')}</div><p>${escapeHtml(x.prompt)}</p><button class="btn btn-secondary reopen" data-id="${x.id}">${state.language==='kk'?'Ашу':'Открыть'}</button></article>`).join('');$$('.reopen').forEach(b=>b.onclick=async()=>{if(!accessAllowed())return guardGenerator();const {data}=await supabaseClient.from('prompts').select('*').eq('id',b.dataset.id).eq('user_id',state.user.id).single();if(data){state.prompt=data.prompt;$('#promptOutput').textContent=data.prompt;showStep(4);}});}

$('#menuBtn').addEventListener('click',()=>$('.desktop-nav').classList.toggle('open'));$$('.desktop-nav a').forEach(a=>a.addEventListener('click',()=>$('.desktop-nav').classList.remove('open')));
setInterval(()=>{if(state.user&&state.profile){renderAccount();}if(!$('#adminPage').hidden&&adminState.users.length){renderAdminUsers();}},60000);
setTimeout(()=>$('#splash')?.remove(),3000);
renderMaterialChoices();renderMaterialFields();applyLanguage(state.language);initAuth();

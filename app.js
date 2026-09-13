const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const SUPABASE_URL = 'https://aqqxxobwjwrffzilcmhr.supabase.co';

const SUPABASE_ANON_KEY = 'sb_publishable_vbR6qA7_lSCrwZDKvFIYGw_ve6xxDBb';

const supabaseClient = window.supabase.createClient( SUPABASE_URL, SUPABASE_ANON_KEY);
const state = {
  material: 'Тест', language: localStorage.getItem('apai_lang') || 'kk', step: 1,
  prompt: '', user: null, profile: null, canGenerate: false, authMode: 'login'
};

const dict = {
kk:{
navCreate:'Промпт жасау',navSaved:'Менің промпттарым',navAbout:'Жоба туралы',navHelp:'Көмек',login:'Кіру / Тіркелу',logout:'Шығу',adminPanel:'Админ панелі',adminUsers:'Қолданушылар',
eyebrow:'Мұғалімдерге арналған жаңа буын құралы',heroTitle:'Сабаққа дайындықты<br><span>ақылдырақ</span> жасаңыз.',heroText:'Сабақ, тест, викторина және көрнекі материалдарға арналған сапалы промпттарды бірнеше қадамда жасаңыз.',start:'Промпт жасау <span>↗</span>',learn:'Толығырақ',note:'Тегін • Көру ашық • Генератор ақылы қолданушыларға',preview:'Промпт дайын',copy:'Көшіру',quality:'Сапалы шаблондар',
createTitle:'Өзіңізге қажет промптты жасаңыз.',createText:'Төмендегі қадамдарды толтырыңыз. ApaI сізге көшіріп, кез келген AI құралында қолдануға дайын промпт береді.',
stepMaterial:'Материал',stepLesson:'Сабақ',stepSettings:'Баптаулар',stepResult:'Нәтиже',materialTitle:'Қандай материал керек?',test:'Тест',testSub:'Сұрақтар мен жауаптар',presentation:'Презентация',presentationSub:'Слайдтарға арналған құрылым',quiz:'Викторина',quizSub:'Қызықты тапсырмалар',poster:'Постер / плакат',posterSub:'Көрнекі материал',infographic:'Инфографика',infographicSub:'Деректерді визуалдау',cards:'Карточкалар',cardsSub:'Жеке / жұптық жұмыс',lessonPlan:'Сабақ жоспары',lessonPlanSub:'Толық сабақ құрылымы',banner:'Баннер',bannerSub:'Қысқа хабарлама',
continue:'Жалғастыру →',lessonTitle:'Сабақ туралы',subject:'Пән',grade:'Сынып',topic:'Тақырып',back:'← Артқа',settingsTitle:'Баптаулар',difficulty:'Күрделілік',promptLanguage:'Промпт тілі',quantity:'Саны',goal:'Мақсат',extra:'Қосымша талаптар',generate:'Промпт жасау ✦',resultTitle:'Дайын!',copyPrompt:'Промптты көшіру',savePrompt:'Сақтау',newPrompt:'Жаңа промпт',
tipsTitle:'ApaI қалай жұмыс істейді?',tipsText:'Дайын шаблондар сіздің таңдауларыңызды бір толық, нақты тапсырмаға айналдырады. ЖИ-ді сайтқа қоспай-ақ, дайын промптты кез келген сервиске жібере аласыз.',tip1:'Материал түрін таңдаңыз.',tip2:'Сынып пен тақырыпты жазыңыз.',tip3:'Нәтижені көшіріп алыңыз.',
savedTitle:'Менің промпттарым.',savedText:'Тек өз аккаунтыңызда сақталған промпттарды қайта ашыңыз.',aboutTitle:'Мұғалім уақытын үнемдейтін қарапайым құрал.',aboutText:'ApaI мұғалімге ЖИ-мен жұмыс істеуді оңай бастауға көмектеседі. Сіз параметрлерді таңдайсыз — сервис нақты әрі құрылымды промпт дайындайды.',helpTitle:'Көмек',helpText:'ApaI-де жасалған промптты ChatGPT, Gemini, Claude және басқа құралдарға көшіруге болады.',faq1Q:'ApaI өзі жауап жасай ма?',faq1A:'Жоқ. ApaI дайын сапалы промпт жасайды. Соңғы жауапты таңдаған AI сервисіңіз құрады.',faq2Q:'Кім промпт жасай алады?',faq2A:'Сайтты кез келген адам көре алады. Бірақ промпт генераторы тек аккаунты тіркелген, төлемі расталған және админ қабылдаған қолданушыға ашылады.',footerText:'Мұғалімдерге арналған ақылды көмекші.',
authLoginTitle:'Аккаунтқа кіру',authLoginText:'Промпт жасау үшін алдымен аккаунтқа кіріңіз немесе тіркеліңіз.',authSignupTitle:'ApaI-ге тіркелу',authSignupText:'Тіркелгеннен кейін төлеміңізді жасап, админнің қабылдауын күтіңіз. Қабылданғаннан кейін генератор ашылады.',loginTab:'Кіру',signupTab:'Тіркелу',fullName:'Аты-жөніңіз',password:'Құпиясөз',accountTitle:'Аккаунт',
accessPending:'Аккаунтыңыз тіркелді. Қазір админнің қабылдауын күтіңіз және төлемді растаңыз.',accessFree:'Аккаунт тіркелген, бірақ генераторды пайдалану үшін төлем қажет. Төлемнен кейін админ аккаунтты белсендіреді.',accessApproved:'Аккаунт белсенді. Генераторды пайдалана аласыз.',accessRejected:'Аккаунтты пайдалану рұқсат етілмеді. Админге хабарласыңыз.',accessBlocked:'Аккаунт бұғатталған.',notRegistered:'Промпт жасау үшін алдымен тіркелу немесе кіру керек.',paidOnly:'Генератор тек төлемі расталған және админ қабылдаған қолданушыларға ашық.',adminStatus:'Админ',paidStatus:'Ақылы аккаунт',freeStatus:'Төлем күтілуде',pendingStatus:'Қабылдау күтілуде',
savedEmpty:'Әзірге сақталған промпт жоқ.',profile:'Профиль',emailConfirmed:'Email расталды. Енді аккаунтқа кіріңіз.',signupSuccess:'Тіркелу сәтті өтті. Email-ді растаңыз (егер растау қосылған болса), содан кейін төлем жасап, админнің қабылдауын күтіңіз.',loginSuccess:'Сәтті кірдіңіз.',logoutSuccess:'Аккаунттан шықтыңыз.',saveLogin:'Сақтау үшін де аккаунтқа кіру қажет.',adminUpdated:'Статус жаңартылды.'
},
ru:{
navCreate:'Создать промпт',navSaved:'Мои промпты',navAbout:'О проекте',navHelp:'Помощь',login:'Войти / Регистрация',logout:'Выйти',adminPanel:'Админ-панель',adminUsers:'Пользователи',
eyebrow:'Инструмент нового поколения для учителей',heroTitle:'Готовьте уроки<br><span>умнее.</span>',heroText:'Создавайте качественные промпты для уроков, тестов, викторин и наглядных материалов за несколько шагов.',start:'Создать промпт <span>↗</span>',learn:'Подробнее',note:'Открытый сайт • Генератор для оплативших',preview:'Промпт готов',copy:'Копировать',quality:'Качественные шаблоны',
createTitle:'Создайте нужный вам промпт.',createText:'Заполните несколько шагов. ApaI подготовит готовый текстовый промпт, который можно скопировать в любой AI-сервис.',stepMaterial:'Материал',stepLesson:'Урок',stepSettings:'Настройки',stepResult:'Результат',materialTitle:'Какой материал нужен?',test:'Тест',testSub:'Вопросы и ответы',presentation:'Презентация',presentationSub:'Структура слайдов',quiz:'Викторина',quizSub:'Интересные задания',poster:'Постер / плакат',posterSub:'Наглядный материал',infographic:'Инфографика',infographicSub:'Визуализация данных',cards:'Карточки',cardsSub:'Индивидуальная / парная работа',lessonPlan:'План урока',lessonPlanSub:'Полная структура урока',banner:'Баннер',bannerSub:'Короткое объявление',
continue:'Продолжить →',lessonTitle:'О вашем уроке',subject:'Предмет',grade:'Класс',topic:'Тема',back:'← Назад',settingsTitle:'Настройки',difficulty:'Сложность',promptLanguage:'Язык промпта',quantity:'Количество',goal:'Цель',extra:'Дополнительные требования',generate:'Создать промпт ✦',resultTitle:'Готово!',copyPrompt:'Скопировать промпт',savePrompt:'Сохранить',newPrompt:'Новый промпт',tipsTitle:'Как работает ApaI?',tipsText:'Готовые шаблоны превращают ваши параметры в одну понятную задачу. Без встроенного AI: готовый промпт можно отправить в любой сервис.',tip1:'Выберите тип материала.',tip2:'Укажите класс и тему.',tip3:'Скопируйте результат.',savedTitle:'Мои промпты.',savedText:'Здесь отображаются только промпты вашего аккаунта.',aboutTitle:'Простой инструмент, который экономит время учителя.',aboutText:'ApaI помогает учителям начать работать с AI без сложностей. Вы задаёте параметры — сервис собирает точный и структурированный промпт.',helpTitle:'Помощь',helpText:'Промпты ApaI можно копировать в ChatGPT, Gemini, Claude и другие инструменты.',faq1Q:'ApaI сам генерирует ответы?',faq1A:'Нет. ApaI создаёт готовый качественный промпт. Финальный ответ формирует выбранный вами AI-сервис.',faq2Q:'Кто может создавать промпты?',faq2A:'Сайт открыт для всех. Но генератор доступен только зарегистрированному, оплатившему и одобренному администратором пользователю.',footerText:'Умный помощник для учителей.',
authLoginTitle:'Вход в аккаунт',authLoginText:'Чтобы создавать промпты, сначала войдите или зарегистрируйтесь.',authSignupTitle:'Регистрация в ApaI',authSignupText:'После регистрации оплатите доступ и дождитесь подтверждения администратора. После одобрения генератор откроется.',loginTab:'Войти',signupTab:'Регистрация',fullName:'Ваше имя',password:'Пароль',accountTitle:'Аккаунт',
accessPending:'Аккаунт зарегистрирован. Сейчас дождитесь одобрения администратора и подтверждения оплаты.',accessFree:'Аккаунт зарегистрирован, но генератор закрыт до оплаты. После оплаты администратор активирует доступ.',accessApproved:'Аккаунт активен. Генератор доступен.',notRegistered:'Сначала зарегистрируйтесь или войдите в аккаунт.',paidOnly:'Генератор доступен только оплатившим и одобренным администрацией пользователям.',accessRejected:'Доступ отклонён. Обратитесь к администратору.',accessBlocked:'Аккаунт заблокирован.',adminStatus:'Администратор',paidStatus:'Платный аккаунт',freeStatus:'Ожидается оплата',pendingStatus:'Ожидается одобрение',savedEmpty:'Пока сохранённых промптов нет.',profile:'Профиль',emailConfirmed:'Email подтверждён. Теперь войдите в аккаунт.',signupSuccess:'Регистрация прошла успешно. Подтвердите email (если включено подтверждение), затем оплатите доступ и дождитесь одобрения.',loginSuccess:'Вы вошли в аккаунт.',logoutSuccess:'Вы вышли из аккаунта.',saveLogin:'Чтобы сохранять промпты, войдите в аккаунт.',adminUpdated:'Статус обновлён.'
}};

function t(k){return dict[state.language][k] || k;}
function applyLanguage(lang){
  state.language=lang;
  document.documentElement.lang=lang;
  $('#languageBtn').textContent=lang==='kk'?'ҚАЗ / РУС':'РУС / ҚАЗ';
  $$('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(dict[lang][key]!=null)el.innerHTML=dict[lang][key];});
  localStorage.setItem('apai_lang',lang);
  updateAccessUI();
  renderSaved();
}

$('#languageBtn').addEventListener('click',()=>applyLanguage(state.language==='kk'?'ru':'kk'));
$('#themeBtn').addEventListener('click',()=>{
  document.body.classList.toggle('dark'); localStorage.setItem('apai_theme',document.body.classList.contains('dark')?'dark':'light'); $('#themeBtn').textContent=document.body.classList.contains('dark')?'☀':'☾';
});
if(localStorage.getItem('apai_theme')==='dark'){document.body.classList.add('dark');$('#themeBtn').textContent='☀';}
applyLanguage(state.language);

function openModal(id){const m=$(id);if(!m)return;m.classList.add('show');m.setAttribute('aria-hidden','false');}
function closeModal(id){const m=$(id);if(!m)return;m.classList.remove('show');m.setAttribute('aria-hidden','true');}
$('#authClose').addEventListener('click',()=>closeModal('#authModal'));
$('#accountClose').addEventListener('click',()=>closeModal('#accountModal'));
$$('.modal-backdrop').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('show');}));

function setAuthMessage(msg,type='info'){$('#authMessage').textContent=msg;$('#authMessage').className=`auth-message ${type}`;}
function switchAuthMode(mode){
  state.authMode=mode;
  const signup=mode==='signup';
  $('#loginTab').classList.toggle('active',!signup); $('#signupTab').classList.toggle('active',signup);
  $('#authName').required=signup; $('#authName').style.display=signup?'block':'none';
  $('#authTitle').textContent=signup?t('authSignupTitle'):t('authLoginTitle');
  $('#authDescription').textContent=signup?t('authSignupText'):t('authLoginText');
  $('#authSubmit').textContent=signup?t('signupTab'):t('loginTab');
  $('#authMessage').textContent='';
}
$('#loginTab').addEventListener('click',()=>switchAuthMode('login'));
$('#signupTab').addEventListener('click',()=>switchAuthMode('signup'));
$('#authName').style.display='none'; switchAuthMode('login');

function accessAllowed(){return !!state.user && !!state.canGenerate;}
function updateAccessUI(){
  const note=$('#accessNote'), btn=$('.generate-btn');
  if(!note||!btn)return;
  if(accessAllowed()){
    btn.disabled=false;
    note.textContent=t('accessApproved'); note.className='access-note ok';
    return;
  }
  btn.disabled=false;
  if(!state.user){note.textContent=t('notRegistered'); note.className='access-note locked';return;}
  const p=state.profile;
  if(p?.access_status==='blocked'){note.textContent=t('accessBlocked');note.className='access-note locked';return;}
  if(p?.access_status==='rejected'){note.textContent=t('accessRejected');note.className='access-note locked';return;}
  if(p?.plan==='free'){note.textContent=t('accessFree');note.className='access-note locked';return;}
  note.textContent=t('accessPending'); note.className='access-note locked';
}

function guardGenerator(){
  if(!state.user){openModal('#authModal');switchAuthMode('login');return false;}
  if(!state.canGenerate){
    openModal('#accountModal'); renderAccount();
    return false;
  }
  return true;
}

$('#heroCreateBtn').addEventListener('click',e=>{if(!guardGenerator())e.preventDefault();});
$$('.desktop-nav a[href="#create"]').forEach(a=>a.addEventListener('click',e=>{if(!guardGenerator())e.preventDefault();}));

function showStep(n){
  if(n>1 && !guardGenerator())return;
  state.step=n;
  $$('.form-step').forEach(x=>x.classList.toggle('active',Number(x.dataset.panel)===n));
  $$('.step').forEach(x=>x.classList.toggle('active',Number(x.dataset.step)<=n));
  document.querySelector('#create').scrollIntoView({behavior:'smooth',block:'start'});
}
$$('.next-btn').forEach(b=>b.onclick=()=>showStep(Number(b.dataset.next)));
$$('.back-btn').forEach(b=>b.onclick=()=>showStep(Number(b.dataset.back)));
$$('.choice').forEach(c=>c.onclick=()=>{if(!guardGenerator())return;$$('.choice').forEach(x=>x.classList.remove('selected'));c.classList.add('selected');state.material=c.dataset.value;});

function makePrompt(){
 const subject=$('#subject').value,grade=$('#grade').value,topic=$('#topic').value.trim()||(state.language==='kk'?'Белгілі бір тақырып':'Укажите тему');
 const difficulty=$('#difficulty').value,lang=$('#promptLanguage').value,qty=$('#quantity').value,goal=$('#goal').value,extra=$('#extra').value.trim();
 const isKk=lang==='kk';
 const tt=isKk?{role:'Сіз тәжірибелі мектеп мұғаліміне арналған әдістемелік материал дайындайтын мамансыз.',task:'Төмендегі параметрлерге сәйкес сапалы материал дайындаңыз.',mat:'Материал түрі',sub:'Пән',gr:'Сынып',tp:'Тақырып',dif:'Күрделілік',qu:'Саны',go:'Мақсат',ex:'Қосымша талаптар',out:'Жауапты анық құрылымдаңыз. Оқушы жасына сай, түсінікті және практикалық болсын. Қажет болса дұрыс жауаптарды, бағалау критерийлерін және нақты нұсқаулықтарды қосыңыз.',no:'Қосымша талап көрсетілмеген.'}:{role:'Вы — опытный методист, который разрабатывает качественные учебные материалы для школьного учителя.',task:'Создайте качественный материал по указанным параметрам.',mat:'Тип материала',sub:'Предмет',gr:'Класс',tp:'Тема',dif:'Сложность',qu:'Количество',go:'Цель',ex:'Дополнительные требования',out:'Структурируйте ответ максимально понятно. Учитывайте возраст учащихся, практичность и соответствие школьному уроку. При необходимости добавьте правильные ответы, критерии оценивания и точные инструкции.',no:'Дополнительных требований нет.'};
 return `${tt.role}\n\n${tt.task}\n\n${tt.mat}: ${state.material}\n${tt.sub}: ${subject}\n${tt.gr}: ${grade}\n${tt.tp}: ${topic}\n${tt.dif}: ${difficulty}\n${tt.qu}: ${qty}\n${tt.go}: ${goal}\n${tt.ex}: ${extra||tt.no}\n\n${tt.out}\n\nЯзык результата: ${isKk?'казахский':'русский'}.`;
}

$('.generate-btn').addEventListener('click',async()=>{
  if(!guardGenerator())return;
  const btn=$('.generate-btn');btn.disabled=true;const old=btn.innerHTML;btn.innerHTML='⏳';
  await new Promise(r=>setTimeout(r,500));
  state.prompt=makePrompt();$('#promptOutput').textContent=state.prompt;btn.disabled=false;btn.innerHTML=old;showStep(4);
});

$('#copyBtn').addEventListener('click',async()=>{
  if(!accessAllowed())return guardGenerator();
  await navigator.clipboard.writeText(state.prompt);$('#copyBtn').textContent=state.language==='kk'?'✓ Көшірілді':'✓ Скопировано';setTimeout(()=>$('#copyBtn').textContent=dict[state.language].copyPrompt,1600);
});

async function loadProfile(){
  if(!state.user){state.profile=null;state.canGenerate=false;updateAccessUI();renderSaved();return;}
  let {data,error}=await supabaseClient.from('profiles').select('*').eq('id',state.user.id).maybeSingle();
  if(error){console.error(error);return;}
  state.profile=data||null;
  const result=await supabaseClient.rpc('can_generate');
  state.canGenerate=!!result.data;
  updateAccessUI(); renderSaved();
  if(state.profile?.plan==='admin'){$('#adminPanelBtn').hidden=false;}
}

async function initAuth(){
  if(!supabaseClient){setAuthMessage('Supabase connection failed.','error');return;}
  const {data}=await supabaseClient.auth.getSession();
  state.user=data?.session?.user||null;
  await loadProfile();
  supabaseClient.auth.onAuthStateChange(async(_event,session)=>{
    state.user=session?.user||null;
    if(!state.user)state.profile=null;
    await loadProfile();
    updateAccountButton();
  });
  updateAccountButton();
}

function updateAccountButton(){
  const b=$('#accountBtn');
  if(!state.user){b.textContent=t('login');return;}
  const name=state.profile?.full_name||state.user.email||'Аккаунт';
  b.textContent=name.length>20?name.slice(0,20)+'…':name;
}

$('#accountBtn').addEventListener('click',()=>{
  if(!state.user){openModal('#authModal');switchAuthMode('login');}
  else{renderAccount();openModal('#accountModal');}
});

$('#authForm').addEventListener('submit',async e=>{
  e.preventDefault();if(!supabaseClient)return;
  const email=$('#authEmail').value.trim(),password=$('#authPassword').value,fullName=$('#authName').value.trim();
  $('#authSubmit').disabled=true;setAuthMessage('…');
  try{
    if(state.authMode==='signup'){
      const {data,error}=await supabaseClient.auth.signUp({email,password,options:{data:{full_name:fullName}}});
      if(error)throw error;
      if(data.session){state.user=data.session.user;await loadProfile();setAuthMessage(t('signupSuccess'),'ok');setTimeout(()=>closeModal('#authModal'),900);}
      else setAuthMessage(t('signupSuccess'),'ok');
    }else{
      const {data,error}=await supabaseClient.auth.signInWithPassword({email,password});
      if(error)throw error;
      state.user=data.user;await loadProfile();setAuthMessage(t('loginSuccess'),'ok');setTimeout(()=>closeModal('#authModal'),600);
    }
  }catch(err){setAuthMessage(err.message||'Error','error');}
  finally{$('#authSubmit').disabled=false;updateAccountButton();}
});

$('#logoutBtn').addEventListener('click',async()=>{await supabaseClient.auth.signOut();closeModal('#accountModal');state.user=null;state.profile=null;state.canGenerate=false;updateAccessUI();updateAccountButton();});

function renderAccount(){
  const box=$('#accountDetails');if(!state.user){box.innerHTML=`<p>${t('notRegistered')}</p>`;return;}
  const p=state.profile||{};
  let status=t('freeStatus'); if(p.plan==='admin')status=t('adminStatus'); else if(p.plan==='paid'&&p.access_status==='approved')status=t('paidStatus'); else if(p.access_status==='pending')status=t('pendingStatus');
  box.innerHTML=`<div class="account-line"><span>Email</span><b>${escapeHtml(state.user.email||'')}</b></div><div class="account-line"><span>${t('profile')}</span><b>${escapeHtml(p.full_name||'—')}</b></div><div class="account-line"><span>Status</span><b>${status}</b></div><div class="account-line"><span>Access</span><b>${state.canGenerate?'ACTIVE':'LOCKED'}</b></div>`;
  $('#adminPanelBtn').hidden=p.plan!=='admin';
}

$('#adminPanelBtn').addEventListener('click',async()=>{const panel=$('#adminPanel');panel.hidden=!panel.hidden;if(!panel.hidden)await loadUsers();});
$('#refreshUsers').addEventListener('click',loadUsers);

async function loadUsers(){
  if(state.profile?.plan!=='admin')return;
  const box=$('#userList');box.innerHTML='<div class="empty">Loading…</div>';
  const {data,error}=await supabaseClient.from('profiles').select('*').order('created_at',{ascending:false});
  if(error){box.innerHTML=`<div class="empty">${escapeHtml(error.message)}</div>`;return;}
  if(!data?.length){box.innerHTML='<div class="empty">No users</div>';return;}
  box.innerHTML=data.map(p=>`<article class="user-row"><div><strong>${escapeHtml(p.full_name||'Без имени')}</strong><small>${escapeHtml(p.email||p.id||'')}</small><div class="user-status">${p.plan} • ${p.access_status}</div></div><div class="user-actions"><button class="btn btn-primary approve-user" data-id="${p.id}">Paid + Approve</button><button class="btn btn-secondary reject-user" data-id="${p.id}">Reject</button><button class="btn btn-secondary block-user" data-id="${p.id}">Block</button></div></article>`).join('');
  $$('.approve-user').forEach(b=>b.onclick=()=>setUserAccess(b.dataset.id,'approved','paid'));
  $$('.reject-user').forEach(b=>b.onclick=()=>setUserAccess(b.dataset.id,'rejected','free'));
  $$('.block-user').forEach(b=>b.onclick=()=>setUserAccess(b.dataset.id,'blocked','free'));
}
async function setUserAccess(id,status,plan){
  const {error}=await supabaseClient.rpc('admin_set_user_access',{target_user_id:id,new_access_status:status,new_plan:plan,new_paid_until:null});
  if(error){alert(error.message);return;}
  await loadUsers();
}

async function saveCurrent(){
  if(!accessAllowed()){guardGenerator();return;}
  if(!state.prompt)return;
  const {error}=await supabaseClient.from('prompts').insert({user_id:state.user.id,title:state.material,material:state.material,prompt:state.prompt});
  $('#savedState').textContent=error?error.message:(state.language==='kk'?'Сақталды ✓':'Сохранено ✓');
  await renderSaved();
}
$('#saveBtn').addEventListener('click',saveCurrent);
$('#newBtn').addEventListener('click',()=>showStep(1));
async function renderSaved(){
  const box=$('#savedList');if(!box)return;
  if(!state.user){box.innerHTML=`<div class="empty">${t('notRegistered')}</div>`;return;}
  const {data,error}=await supabaseClient.from('prompts').select('*').eq('user_id',state.user.id).order('created_at',{ascending:false}).limit(30);
  if(error){box.innerHTML=`<div class="empty">${escapeHtml(error.message)}</div>`;return;}
  if(!data?.length){box.innerHTML=`<div class="empty">${t('savedEmpty')}</div>`;return;}
  box.innerHTML=data.map(x=>`<article class="saved-card"><h4>${escapeHtml(x.material)}</h4><div class="saved-meta">${new Date(x.created_at).toLocaleString(state.language==='kk'?'kk-KZ':'ru-RU')}</div><p>${escapeHtml(x.prompt)}</p><button class="btn btn-secondary reopen" data-id="${x.id}">${state.language==='kk'?'Ашу':'Открыть'}</button></article>`).join('');
  $$('.reopen').forEach(b=>b.onclick=async()=>{if(!accessAllowed())return guardGenerator();const {data}=await supabaseClient.from('prompts').select('*').eq('id',b.dataset.id).eq('user_id',state.user.id).single();if(data){state.prompt=data.prompt;$('#promptOutput').textContent=data.prompt;showStep(4);}});
}

function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}

$('#menuBtn').addEventListener('click',()=>document.querySelector('.desktop-nav').classList.toggle('open'));
document.querySelectorAll('.desktop-nav a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.desktop-nav').classList.remove('open')));
setTimeout(()=>$('#splash')?.remove(),3000);
initAuth();

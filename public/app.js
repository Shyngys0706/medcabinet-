/**
 * ==============================================================================
 * MedCabinet — Медициналық кабинеттерді брондау және қабылдау жүйесі
 * Жоба авторы: Жақсылық Шыңғысхан
 * 
 * 3 ДЕМО АККАУНТ:
 * 1. 👤 Науқас (Пациент) — Марат Жұмабаев
 * 2. 🩺 Дәрігер — Д-р Берік Ерболұлы (Кардиолог)
 * 3. 🛡️ Әкімші — Жақсылық Шыңғысхан (Клиника әкімшісі)
 * 
 * КУРСТЫҚ ЖҰМЫС (HTML5, CSS3, Pure JavaScript + LocalStorage)
 * Ешқандай сыртқы кітапханасыз, таза JavaScript (ES6) кодын пайдаланады.
 * 100% Локальды жұмыс істейді — index.html файлын қос басқанда бірден ашылады!
 * ==============================================================================
 */

// 1. Мәліметтер базасының кілттері
const DB_KEY = 'medcabinet_3demo_standalone_db';
const SESSION_KEY = 'medcabinet_3demo_standalone_session';

// 2. Тек 3 нақты демо аккаунттан тұратын таза база
const DEFAULT_DATABASE = {
  users: [
    {
      id: 'user-admin',
      role: 'admin',
      name: 'Жақсылық Шыңғысхан',
      email: 'syngyszaksylyk854@gmail.com',
      phone: '+7 (777) 777-88-99',
      position: 'Клиника бас әкімшісі & Жүйе әзірлеушісі',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'MedCabinet жүйесінің авторы және жетекші әзірлеушісі. Клиника бас әкімшісі.'
    },
    {
      id: 'user-doctor',
      role: 'doctor',
      name: 'Д-р Берік Ерболұлы',
      email: 'berik.doctor@densaulyq.kz',
      phone: '+7 (702) 555-12-34',
      specialty: 'Кардиолог-терапевт (Жоғары санат, М.ғ.к.)',
      department: 'Кардиология және функционалдық диагностика',
      assignedCabinet: '102',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
      bio: 'Кардиология бөлімінің жетекшісі, медицина ғылымдарының кандидаты, функционалды диагностика маманы.'
    },
    {
      id: 'user-patient',
      role: 'patient',
      name: 'Марат Жұмабаев',
      email: 'marat.patient@densaulyq.kz',
      phone: '+7 (775) 123-45-67',
      iin: '920415350124',
      insurance: 'KZ-998821',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'Тіркелген науқас. Медициналық міндетті сақтандыру полисі (МӘМС): KZ-998821'
    }
  ],
  cabinets: [
    {
      id: 'cab-101',
      number: '101',
      title: 'Жалпы терапия және қабылдау кабинеті',
      floor: 1,
      category: 'Терапия',
      status: 'available', // available | booked | sanitizing | maintenance
      equipment: ['ЭКГ аппараты (12-арналы)', 'Қан қысымын өлшегіш', 'Пульсоксиметр', 'Кушетка']
    },
    {
      id: 'cab-102',
      number: '102',
      title: 'Кардиология және функционалдық диагностика',
      floor: 1,
      category: 'Кардиология',
      status: 'booked',
      equipment: ['ЭхоКГ жүйесі', 'Холтер мониторы', 'Тредмил-тест кешені', 'Дефибриллятор', 'Кварцты шам']
    },
    {
      id: 'cab-201',
      number: '201',
      title: 'Ультрадыбыстық зерттеу (УЗИ) кабинеті',
      floor: 2,
      category: 'Диагностика',
      status: 'available',
      equipment: ['4D УЗИ аппараты (GE Voluson)', 'Допплер датчигі', 'Медициналық принтер']
    },
    {
      id: 'cab-202',
      number: '202',
      title: 'Офтальмология және көз тексеру кабинеті',
      floor: 2,
      category: 'Офтальмология',
      status: 'sanitizing',
      equipment: ['Саңылаулы шам (Щелевая лампа)', 'Авторефрактометр', 'Пневмотонометр']
    },
    {
      id: 'cab-301',
      number: '301',
      title: 'Хирургиялық манипуляция және таңу кабинеті',
      floor: 3,
      category: 'Хирургия',
      status: 'available',
      equipment: ['Операциялық үстел', 'Көлеңкесіз шам', 'Автоклав стерилизаторы', 'Электрокоагулятор']
    },
    {
      id: 'cab-302',
      number: '302',
      title: 'Стоматологиялық терапия кешені',
      floor: 3,
      category: 'Стоматология',
      status: 'available',
      equipment: ['Стоматологиялық қондырғы (KaVo)', 'Визиограф', 'Ультрадыбыстық скалер']
    },
    {
      id: 'cab-401',
      number: '401',
      title: 'Неврология және оңалту кабинеті',
      floor: 4,
      category: 'Неврология',
      status: 'available',
      equipment: ['ЭЭГ кешені', 'Рефлекс өлшеу жабдығы', 'Массаж үстелі']
    }
  ],
  bookings: [
    {
      id: 'book-1',
      cabinetId: 'cab-102',
      cabinetNumber: '102',
      doctorId: 'user-doctor',
      doctorName: 'Д-р Берік Ерболұлы',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '14:00',
      purpose: 'Жоспарлы кардиологиялық қабылдау және диагностика',
      needsSterilization: true,
      createdAt: new Date().toISOString()
    }
  ],
  appointments: [
    {
      id: 'app-1',
      patientId: 'user-patient',
      patientName: 'Марат Жұмабаев',
      patientPhone: '+7 (775) 123-45-67',
      patientIin: '920415350124',
      doctorId: 'user-doctor',
      doctorName: 'Д-р Берік Ерболұлы',
      cabinetNumber: '102',
      date: new Date().toISOString().split('T')[0],
      time: '10:30',
      symptoms: 'Жүрек тұсының қысып ауыруы, қан қысымының көтерілуі (150/95)',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }
  ],
  reminders: [
    {
      id: 'rem-1',
      recipientName: 'Марат Жұмабаев',
      recipientPhone: '+7 (775) 123-45-67',
      channel: 'SMS',
      title: 'Қабылдау туралы еске салғыш',
      message: 'Құрметті Марат Жұмабаев! Бүгін 10:30-да Д-р Берік Ерболұлы қабылдауына (№102 кабинет) жазылғансыз. Өзіңізбен бірге жеке куәлікті ала келіңіз.',
      status: 'sent',
      sentAt: '09:00'
    },
    {
      id: 'rem-2',
      recipientName: 'Д-р Берік Ерболұлы',
      recipientPhone: '+7 (702) 555-12-34',
      channel: 'SMS',
      title: 'Кабинет броны расталды',
      message: 'Құрметті Д-р Берік Ерболұлы! Бүгінгі күнге №102 кабинет (09:00 - 14:00) қабылдауға сәтті бекітілді. Санитарлық кварцтау орындалды.',
      status: 'sent',
      sentAt: '08:45'
    }
  ]
};

// ==============================================================================
// 2. ДЕРЕКТЕР БАЗАСЫ МЕН СЕССИЯНЫ БАСҚАРУ
// ==============================================================================

function getDatabase() {
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    saveDatabase(DEFAULT_DATABASE);
    return JSON.parse(JSON.stringify(DEFAULT_DATABASE));
  }
  try {
    const parsed = JSON.parse(data);
    // Егер базада 3 демо аккаунттан басқа ескі артық қолданушылар болса, тазарту
    if (!parsed.users || parsed.users.length !== 3 || !parsed.users.some(u => u.id === 'user-doctor')) {
      saveDatabase(DEFAULT_DATABASE);
      return JSON.parse(JSON.stringify(DEFAULT_DATABASE));
    }
    return parsed;
  } catch (e) {
    saveDatabase(DEFAULT_DATABASE);
    return JSON.parse(JSON.stringify(DEFAULT_DATABASE));
  }
}

function saveDatabase(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  updateStats();
}

function getCurrentUser() {
  const userJson = localStorage.getItem(SESSION_KEY);
  const db = getDatabase();
  if (userJson) {
    try {
      const parsed = JSON.parse(userJson);
      const found = db.users.find(u => u.id === parsed.id || u.role === parsed.role);
      if (found) return found;
    } catch (e) {}
  }
  // Әдепкіде әкімші Жақсылық Шыңғысхан
  const defaultUser = db.users.find(u => u.role === 'admin') || db.users[0];
  setCurrentUser(defaultUser);
  return defaultUser;
}

function setCurrentUser(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  renderCurrentUser();
}

// ==============================================================================
// 3. UI КӨРСЕТУ ЖӘНЕ ФИЛЬТРЛЕУ
// ==============================================================================

let currentFloor = 'all';
let currentSearch = '';
let currentTab = 'catalog';

function renderApp() {
  renderCurrentUser();
  renderRoleQuickBar();
  renderStats();
  renderCabinets();
  renderMyBookings();
  renderReminders();
}

function renderCurrentUser() {
  const user = getCurrentUser();
  const avatarEl = document.getElementById('user-avatar');
  const nameEl = document.getElementById('user-name');
  const roleEl = document.getElementById('user-role');

  if (nameEl) nameEl.textContent = user.name;
  if (roleEl) {
    const rolesMap = {
      admin: 'Клиника әкімшісі',
      doctor: 'Кардиолог дәрігер',
      patient: 'Тіркелген науқас'
    };
    roleEl.textContent = rolesMap[user.role] || user.role;
  }

  if (avatarEl) {
    if (user.avatar) {
      avatarEl.innerHTML = `<img src="${user.avatar}" class="user-avatar-img" alt="${user.name}" onerror="this.outerHTML='<div class=\\'user-avatar-img\\'>${user.name.charAt(0)}</div>'">`;
    } else {
      avatarEl.innerHTML = `<div class="user-avatar-img">${user.name.charAt(0)}</div>`;
    }
  }

  // Әкімшілік батырмалардың көрінуін реттеу
  const adminOnlyBtns = document.querySelectorAll('.admin-only-btn');
  adminOnlyBtns.forEach(el => {
    el.style.display = user.role === 'admin' ? 'inline-flex' : 'none';
  });
}

function renderRoleQuickBar() {
  const user = getCurrentUser();
  const pills = document.querySelectorAll('.role-pill');
  pills.forEach(pill => {
    if (pill.dataset.role === user.role) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });
}

// Тек 3 нақты демо аккаунт арасында ауысу (артық қолданушы жасамау)
function switchUserRole(role) {
  const db = getDatabase();
  const targetUser = db.users.find(u => u.role === role);
  if (targetUser) {
    setCurrentUser(targetUser);
    const roleTitles = {
      patient: 'Науқас (Марат Жұмабаев)',
      doctor: 'Дәрігер (Д-р Берік Ерболұлы)',
      admin: 'Әкімші (Жақсылық Шыңғысхан)'
    };
    showToast('Аккаунт ауыстырылды', `Қазіргі аккаунт: ${roleTitles[role]}`, 'info');
    renderApp();
  }
}

function updateStats() {
  const db = getDatabase();
  const total = db.cabinets.length;
  const available = db.cabinets.filter(c => c.status === 'available').length;
  const booked = db.cabinets.filter(c => c.status === 'booked').length;
  const appointmentsCount = db.appointments.filter(a => a.status === 'confirmed').length;

  const totalEl = document.getElementById('stat-total');
  const availEl = document.getElementById('stat-available');
  const bookedEl = document.getElementById('stat-booked');
  const appEl = document.getElementById('stat-appointments');

  if (totalEl) totalEl.textContent = total;
  if (availEl) availEl.textContent = available;
  if (bookedEl) bookedEl.textContent = booked;
  if (appEl) appEl.textContent = appointmentsCount;
}

function renderStats() {
  updateStats();
}

function renderCabinets() {
  const db = getDatabase();
  const container = document.getElementById('cabinets-container');
  if (!container) return;

  const user = getCurrentUser();

  let filtered = db.cabinets.filter(cab => {
    const matchFloor = currentFloor === 'all' || cab.floor.toString() === currentFloor;
    const q = currentSearch.toLowerCase().trim();
    const matchSearch = !q || 
      cab.number.toLowerCase().includes(q) || 
      cab.title.toLowerCase().includes(q) ||
      cab.category.toLowerCase().includes(q) ||
      cab.equipment.some(eq => eq.toLowerCase().includes(q));
    return matchFloor && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 48px; text-align: center; background: white; border-radius: 16px; border: 1px dashed #cbd5e1;">
        <h4 style="font-size: 15px; font-weight: 700; color: #334155;">Кабинеттер табылмады</h4>
        <p style="font-size: 13px; color: #64748b; margin-top: 6px;">Іздеу параметрлерін немесе қабатты өзгертіп көріңіз.</p>
      </div>
    `;
    return;
  }

  const statusLabels = {
    available: { label: 'Бос (Қолжетімді)', cls: 'status-available' },
    booked: { label: 'Брондалған', cls: 'status-booked' },
    sanitizing: { label: 'Санитарлық өңдеуде', cls: 'status-sanitizing' },
    maintenance: { label: 'Жөндеуде', cls: 'status-maintenance' }
  };

  container.innerHTML = filtered.map(cab => {
    const statusInfo = statusLabels[cab.status] || { label: cab.status, cls: 'status-available' };

    let actionButtons = '';
    if (user.role === 'doctor') {
      actionButtons = `
        <button class="btn btn-primary btn-sm" onclick="openBookingModal('${cab.id}')" ${cab.status !== 'available' ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
          ${cab.status === 'available' ? 'Кабинетті брондау' : 'Қазір бос емес'}
        </button>
      `;
    } else if (user.role === 'patient') {
      actionButtons = `
        <button class="btn btn-primary btn-sm" onclick="openAppointmentModal('${cab.id}')">
          Дәрігерге жазылу
        </button>
      `;
    } else {
      // Әкімші
      actionButtons = `
        <button class="btn btn-outline btn-sm" onclick="toggleCabinetStatus('${cab.id}')" title="Күйін ауыстыру">
          Күйін өзгерту
        </button>
        <button class="btn btn-primary btn-sm" onclick="openBookingModal('${cab.id}')">
          Брондау
        </button>
        <button class="btn btn-danger btn-sm" onclick="deleteCabinet('${cab.id}')" title="Өшіру">
          🗑️
        </button>
      `;
    }

    return `
      <div class="cabinet-card">
        <div class="cabinet-head">
          <div>
            <span class="cabinet-number">№${cab.number} кабинет</span>
            <h3 class="cabinet-title">${cab.title}</h3>
          </div>
          <span class="status-badge ${statusInfo.cls}">${statusInfo.label}</span>
        </div>
        <div class="cabinet-body">
          <div class="cabinet-info-row">
            <span>🏢 <strong>${cab.floor}-қабат</strong></span>
            <span>•</span>
            <span>📁 ${cab.category}</span>
          </div>
          <div style="font-size: 11px; font-weight: 700; color: #475569; margin-top: 10px;">Медициналық жабдықтар:</div>
          <div class="cabinet-equipment-list">
            ${cab.equipment.map(eq => `<span class="equipment-tag">✓ ${eq}</span>`).join('')}
          </div>
        </div>
        <div class="cabinet-footer">
          ${actionButtons}
        </div>
      </div>
    `;
  }).join('');
}

function renderMyBookings() {
  const db = getDatabase();
  const user = getCurrentUser();
  const container = document.getElementById('my-bookings-container');
  if (!container) return;

  if (user.role === 'patient') {
    const patientAppointments = db.appointments.filter(a => a.patientId === user.id || a.patientName === user.name);
    if (patientAppointments.length === 0) {
      container.innerHTML = `<p style="padding: 32px; text-align: center; color: #64748b;">Сізде белсенді дәрігерге жазылу талондары жоқ.</p>`;
      return;
    }
    container.innerHTML = `
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Дәрігер</th>
              <th>Кабинет</th>
              <th>Күні мен уақыты</th>
              <th>Шағым / Мақсат</th>
              <th>Күйі</th>
              <th style="text-align: right;">Әрекеттер</th>
            </tr>
          </thead>
          <tbody>
            ${patientAppointments.map(a => `
              <tr>
                <td>
                  <strong>${a.doctorName}</strong>
                  <div style="font-size: 11px; color: #0d9488;">Кардиолог-терапевт</div>
                </td>
                <td><strong style="color: #0d9488;">№${a.cabinetNumber || '102'}</strong></td>
                <td><strong>${a.date}</strong> | <span style="font-family: monospace;">${a.time}</span></td>
                <td><span style="font-size: 12px; color: #475569;">${a.symptoms || 'Тексеру'}</span></td>
                <td>
                  <span class="status-badge ${a.status === 'confirmed' ? 'status-available' : 'status-sanitizing'}">
                    ${a.status === 'confirmed' ? 'Расталған ✓' : 'Аяқталды'}
                  </span>
                </td>
                <td style="text-align: right;">
                  <button class="btn btn-outline btn-sm" onclick="printPass('${a.id}')" title="Талонды басып шығару">
                    🖨️ Талон
                  </button>
                  ${a.status === 'confirmed' ? `
                    <button class="btn btn-danger btn-sm" onclick="cancelAppointment('${a.id}')">
                      Бас тарту
                    </button>
                  ` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (user.role === 'doctor') {
    const doctorBookings = db.bookings.filter(b => b.doctorId === user.id || b.doctorName.includes(user.name));
    const doctorAppointments = db.appointments.filter(a => a.doctorId === user.id || a.doctorName.includes(user.name));

    container.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 10px;">1. Менің брондалған кабинеттерім</h3>
        ${doctorBookings.length === 0 ? '<p style="padding: 16px; background: #f8fafc; border-radius: 8px; color: #64748b; font-size: 13px;">Сізде брондалған кабинеттер жоқ.</p>' : `
          <div class="data-table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Кабинет</th>
                  <th>Күні</th>
                  <th>Уақыты</th>
                  <th>Мақсаты</th>
                  <th>Стерилизация</th>
                  <th style="text-align: right;">Әрекет</th>
                </tr>
              </thead>
              <tbody>
                ${doctorBookings.map(b => `
                  <tr>
                    <td><strong>№${b.cabinetNumber}</strong></td>
                    <td>${b.date}</td>
                    <td>${b.startTime} - ${b.endTime}</td>
                    <td>${b.purpose}</td>
                    <td>${b.needsSterilization ? '<span style="color:#0d9488;font-weight:bold;">Қажет (+Кварц)</span>' : 'Стандартты'}</td>
                    <td style="text-align: right;">
                      <button class="btn btn-danger btn-sm" onclick="cancelBooking('${b.id}')">Босату</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>

      <div>
        <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 10px;">2. Қабылдауға жазылған науқастар кезегі</h3>
        ${doctorAppointments.length === 0 ? '<p style="padding: 16px; background: #f8fafc; border-radius: 8px; color: #64748b; font-size: 13px;">Қабылдауға жазылған науқастар жоқ.</p>' : `
          <div class="data-table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Науқас</th>
                  <th>Телефон</th>
                  <th>Күні мен уақыты</th>
                  <th>Шағымы</th>
                  <th>Күйі</th>
                  <th style="text-align: right;">Әрекеттер</th>
                </tr>
              </thead>
              <tbody>
                ${doctorAppointments.map(a => `
                  <tr>
                    <td><strong>${a.patientName}</strong></td>
                    <td><span style="font-family: monospace;">${a.patientPhone}</span></td>
                    <td>${a.date} | ${a.time}</td>
                    <td>${a.symptoms}</td>
                    <td>
                      <span class="status-badge ${a.status === 'confirmed' ? 'status-available' : 'status-sanitizing'}">
                        ${a.status === 'confirmed' ? 'Күтілуде' : 'Қабылданды'}
                      </span>
                    </td>
                    <td style="text-align: right;">
                      ${a.status === 'confirmed' ? `
                        <button class="btn btn-primary btn-sm" onclick="completeAppointment('${a.id}')">
                          Қабылданды ✓
                        </button>
                      ` : ''}
                      <button class="btn btn-outline btn-sm" onclick="printPass('${a.id}')">
                        🖨️
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;
  } else {
    // Әкімші барлық жазбаларды көреді
    container.innerHTML = `
      <div style="display: flex; gap: 10px; margin-bottom: 14px;">
        <span class="badge" style="background:#0d9488; color:white; padding: 4px 10px;">Барлық брондар: ${db.bookings.length}</span>
        <span class="badge" style="background:#2563eb; color:white; padding: 4px 10px;">Барлық қабылдаулар: ${db.appointments.length}</span>
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Кабинет броньдары</h3>
        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Кабинет</th>
                <th>Дәрігер</th>
                <th>Күні мен уақыты</th>
                <th>Мақсаты</th>
                <th style="text-align: right;">Басқару</th>
              </tr>
            </thead>
            <tbody>
              ${db.bookings.map(b => `
                <tr>
                  <td><strong>№${b.cabinetNumber}</strong></td>
                  <td>${b.doctorName}</td>
                  <td>${b.date} (${b.startTime} - ${b.endTime})</td>
                  <td>${b.purpose}</td>
                  <td style="text-align: right;">
                    <button class="btn btn-danger btn-sm" onclick="cancelBooking('${b.id}')">Броньды жою</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Науқастардың қабылдаулары</h3>
        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Науқас</th>
                <th>Телефон</th>
                <th>Дәрігер</th>
                <th>Кабинет</th>
                <th>Уақыты</th>
                <th style="text-align: right;">Әрекет</th>
              </tr>
            </thead>
            <tbody>
              ${db.appointments.map(a => `
                <tr>
                  <td><strong>${a.patientName}</strong></td>
                  <td>${a.patientPhone}</td>
                  <td>${a.doctorName}</td>
                  <td><strong>№${a.cabinetNumber}</strong></td>
                  <td>${a.date} | ${a.time}</td>
                  <td style="text-align: right;">
                    <button class="btn btn-outline btn-sm" onclick="printPass('${a.id}')">Талон</button>
                    <button class="btn btn-danger btn-sm" onclick="cancelAppointment('${a.id}')">Жою</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

function renderReminders() {
  const db = getDatabase();
  const user = getCurrentUser();
  const list = document.getElementById('reminders-list');
  if (!list) return;

  const filteredReminders = user.role === 'admin'
    ? db.reminders
    : db.reminders.filter(r => r.recipientName.includes(user.name) || r.recipientPhone === user.phone);

  if (filteredReminders.length === 0) {
    list.innerHTML = `<p style="padding: 24px; text-align: center; color: #64748b;">Еске салғыш хабарламалар жоқ.</p>`;
    return;
  }

  list.innerHTML = filteredReminders.map(rem => `
    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start; gap: 14px;">
      <div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <span class="badge" style="background: ${rem.channel === 'WhatsApp' ? '#22c55e' : '#0ea5e9'}; color: white;">${rem.channel}</span>
          <strong style="font-size: 13px; color: #0f172a;">${rem.recipientName} (${rem.recipientPhone})</strong>
          <span style="font-size: 11px; color: #94a3b8;">${rem.sentAt || 'Жаңа'}</span>
        </div>
        <p style="font-size: 12px; color: #475569; line-height: 1.4;">${rem.message}</p>
      </div>
      <span class="badge" style="background: #ecfdf5; color: #059669; padding: 4px 8px;">Жеткізілді ✓</span>
    </div>
  `).join('');
}

// ==============================================================================
// 4. МОДАЛЬДАР ЖӘНЕ ОҚИҒАЛАР
// ==============================================================================

function openBookingModal(cabinetId) {
  const db = getDatabase();
  const cab = db.cabinets.find(c => c.id === cabinetId);
  if (!cab) return;

  document.getElementById('booking-cab-id').value = cab.id;
  document.getElementById('booking-cab-number').textContent = `№${cab.number} кабинет — ${cab.title}`;
  document.getElementById('booking-date').value = new Date().toISOString().split('T')[0];

  openModal('booking-modal');
}

function submitBooking(event) {
  event.preventDefault();
  const db = getDatabase();
  const user = getCurrentUser();

  const cabId = document.getElementById('booking-cab-id').value;
  const date = document.getElementById('booking-date').value;
  const startTime = document.getElementById('booking-start').value;
  const endTime = document.getElementById('booking-end').value;
  const purpose = document.getElementById('booking-purpose').value;
  const sterilize = document.getElementById('booking-sterilize').checked;

  const cab = db.cabinets.find(c => c.id === cabId);
  if (!cab) return;

  const newBooking = {
    id: 'book-' + Date.now(),
    cabinetId: cab.id,
    cabinetNumber: cab.number,
    doctorId: user.id,
    doctorName: user.name,
    date: date,
    startTime: startTime,
    endTime: endTime,
    purpose: purpose,
    needsSterilization: sterilize,
    createdAt: new Date().toISOString()
  };

  cab.status = 'booked';
  db.bookings.unshift(newBooking);

  const reminder = {
    id: 'rem-' + Date.now(),
    recipientName: user.name,
    recipientPhone: user.phone || '+7 (702) 555-12-34',
    channel: 'SMS',
    title: 'Кабинет броны расталды',
    message: `Құрметті ${user.name}! Сіз №${cab.number} кабинетті ${date} күні (${startTime}-${endTime}) сәтті брондадыңыз. Мақсаты: ${purpose}`,
    status: 'sent',
    sentAt: new Date().toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' })
  };
  db.reminders.unshift(reminder);

  saveDatabase(db);
  closeModal('booking-modal');
  showToast('Сәтті брондалды!', `№${cab.number} кабинет брондалды және SMS еске салғыш жіберілді`, 'success');
  renderApp();
}

function cancelBooking(bookingId) {
  if (!confirm('Бұл броньды босатуға сенімдісіз бе?')) return;
  const db = getDatabase();
  const booking = db.bookings.find(b => b.id === bookingId);
  if (booking) {
    const cab = db.cabinets.find(c => c.id === booking.cabinetId);
    if (cab) cab.status = 'available';
    db.bookings = db.bookings.filter(b => b.id !== bookingId);
    saveDatabase(db);
    showToast('Бронь жойылды', 'Кабинет босатылды', 'info');
    renderApp();
  }
}

function openAppointmentModal(cabinetId) {
  const db = getDatabase();
  const selectDoctor = document.getElementById('appointment-doctor');
  const doctors = db.users.filter(u => u.role === 'doctor');

  selectDoctor.innerHTML = doctors.map(d => `
    <option value="${d.id}">${d.name} (${d.specialty || 'Кардиолог'}) — №${d.assignedCabinet || '102'} каб.</option>
  `).join('');

  const cab = db.cabinets.find(c => c.id === cabinetId);
  document.getElementById('appointment-cab-id').value = cab ? cab.number : '102';
  document.getElementById('appointment-date').value = new Date().toISOString().split('T')[0];

  openModal('appointment-modal');
}

function submitAppointment(event) {
  event.preventDefault();
  const db = getDatabase();
  const user = getCurrentUser();

  const doctorId = document.getElementById('appointment-doctor').value;
  const doctor = db.users.find(u => u.id === doctorId) || db.users.find(u => u.role === 'doctor');
  const date = document.getElementById('appointment-date').value;
  const time = document.getElementById('appointment-time').value;
  const symptoms = document.getElementById('appointment-symptoms').value;
  const cabNumber = document.getElementById('appointment-cab-id').value || '102';

  const newApp = {
    id: 'app-' + Date.now(),
    patientId: user.id,
    patientName: user.name,
    patientPhone: user.phone || '+7 (775) 123-45-67',
    patientIin: user.iin || '920415350124',
    doctorId: doctor.id,
    doctorName: doctor.name,
    cabinetNumber: cabNumber,
    date: date,
    time: time,
    symptoms: symptoms,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  db.appointments.unshift(newApp);

  const reminder = {
    id: 'rem-' + Date.now(),
    recipientName: user.name,
    recipientPhone: user.phone || '+7 (775) 123-45-67',
    channel: 'SMS',
    title: 'Қабылдауға жазылу расталды',
    message: `Құрметті ${user.name}! Сіз ${date} сағат ${time}-де ${doctor.name} қабылдауына (№${cabNumber} каб.) жазылдыңыз. Кешікпей келуіңізді сұраймыз.`,
    status: 'sent',
    sentAt: new Date().toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' })
  };
  db.reminders.unshift(reminder);

  saveDatabase(db);
  closeModal('appointment-modal');
  showToast('Қабылдауға сәтті жазылдыңыз!', `SMS хабарлама тіркелді. Талоныңыз экранда ашылды.`, 'success');
  renderApp();
  // Экранда талон модалін ашу (принтерге бірден лақтырмай, алдымен экранға шығарамыз)
  openTicketModal(newApp.id);
}

function cancelAppointment(appId) {
  if (!confirm('Қабылдаудан бас тартуды растайсыз ба?')) return;
  const db = getDatabase();
  db.appointments = db.appointments.filter(a => a.id !== appId);
  saveDatabase(db);
  showToast('Қабылдау жойылды', 'Жазылу тізімнен өшірілді', 'info');
  renderApp();
}

function completeAppointment(appId) {
  const db = getDatabase();
  const app = db.appointments.find(a => a.id === appId);
  if (app) {
    app.status = 'completed';
    saveDatabase(db);
    showToast('Қабылдау аяқталды', 'Науқас сәтті қабылданды деп белгіленді', 'success');
    renderApp();
  }
}

function openTicketModal(appId) {
  const db = getDatabase();
  const app = db.appointments.find(a => a.id === appId);
  if (!app) return;

  const container = document.getElementById('ticket-print-body');
  if (container) {
    container.innerHTML = `
      <div style="border: 2px dashed #0d9488; padding: 22px; border-radius: 12px; background: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 14px;">
          <div style="font-size: 26px; color: #0d9488; font-weight: bold; margin-bottom: 2px;">✚</div>
          <h2 style="font-size: 17px; color: #0f172a; font-weight: 800; margin: 0;">MedCabinet — Ресми Қабылдау Талоны</h2>
          <p style="font-size: 11px; color: #64748b; margin-top: 2px;">Қазақстан Республикасы · Денсаулық сақтау орталығы</p>
        </div>
        <div style="font-size: 13px; line-height: 1.8; color: #1e293b;">
          <div><strong>Науқас:</strong> ${app.patientName}</div>
          <div><strong>ЖСН:</strong> ${app.patientIin || '920415350124'}</div>
          <div><strong>Байланыс телефоны:</strong> ${app.patientPhone}</div>
          <div><strong>Дәрігер:</strong> <span style="color: #0d9488; font-weight: bold;">${app.doctorName}</span> (Кардиолог-терапевт)</div>
          <div><strong>Кабинет:</strong> <span style="font-size: 16px; font-weight: 800; color: #0d9488;">№${app.cabinetNumber}</span></div>
          <div><strong>Күні мен уақыты:</strong> <strong>${app.date}</strong> сағат <strong>${app.time}</strong></div>
          <div><strong>Шағымы:</strong> <em>«${app.symptoms}»</em></div>
        </div>
        <div style="margin-top: 16px; padding-top: 12px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 10px; color: #64748b; font-family: monospace;">
            КОД: #${app.id.toUpperCase()}<br>
            БЕКІТІЛДІ: MEDCABINET-KZ
          </div>
          <div style="border: 2px solid #0d9488; border-radius: 50%; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: bold; color: #0d9488; text-align: center; transform: rotate(-10deg);">
            DENSAULYQ<br>МӨРІ
          </div>
        </div>
      </div>
    `;
  }
  openModal('ticket-modal');
}

function printPass(appId) {
  openTicketModal(appId);
}

function triggerPrintFromModal() {
  window.print();
}

function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    alert('Сурет өлшемі 2MB-тан аспауы тиіс!');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64Image = e.target.result;
    const db = getDatabase();
    const user = getCurrentUser();

    user.avatar = base64Image;
    const found = db.users.find(u => u.id === user.id);
    if (found) found.avatar = base64Image;

    saveDatabase(db);
    setCurrentUser(user);

    const preview = document.getElementById('modal-avatar-preview');
    if (preview) preview.src = base64Image;
    showToast('Сурет сақталды', 'Профиль суреті сәтті жаңартылды', 'success');
  };
  reader.readAsDataURL(file);
}

function handleAvatarDelete() {
  if (!confirm('Профиль суретін өшіруге сенімдісіз бе?')) return;
  const db = getDatabase();
  const user = getCurrentUser();

  user.avatar = '';
  const found = db.users.find(u => u.id === user.id);
  if (found) found.avatar = '';

  saveDatabase(db);
  setCurrentUser(user);

  const preview = document.getElementById('modal-avatar-preview');
  if (preview) preview.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
  showToast('Сурет өшірілді', 'Профиль суреті алынып тасталды', 'info');
}

function toggleCabinetStatus(cabinetId) {
  const db = getDatabase();
  const cab = db.cabinets.find(c => c.id === cabinetId);
  if (!cab) return;

  const order = ['available', 'booked', 'sanitizing', 'maintenance'];
  const nextIdx = (order.indexOf(cab.status) + 1) % order.length;
  cab.status = order[nextIdx];

  const statusNames = {
    available: 'Бос (Қолжетімді)',
    booked: 'Брондалған',
    sanitizing: 'Санитарлық өңдеуде',
    maintenance: 'Жөндеуде'
  };

  saveDatabase(db);
  renderCabinets();
  showToast('Күй өзгертілді', `№${cab.number} кабинет жаңа күйі: ${statusNames[cab.status]}`, 'info');
}

function deleteCabinet(cabinetId) {
  const db = getDatabase();
  const cab = db.cabinets.find(c => c.id === cabinetId);
  if (!cab) return;
  if (!confirm(`№${cab.number} кабинетті өшіруді растайсыз ба?`)) return;

  db.cabinets = db.cabinets.filter(c => c.id !== cabinetId);
  saveDatabase(db);
  renderCabinets();
  showToast('Кабинет өшірілді', `№${cab.number} кабинет жойылды`, 'info');
}

function submitNewCabinet(event) {
  event.preventDefault();
  const db = getDatabase();

  const number = document.getElementById('new-cab-num').value.trim();
  const title = document.getElementById('new-cab-title').value.trim();
  const floor = parseInt(document.getElementById('new-cab-floor').value, 10);
  const category = document.getElementById('new-cab-category').value.trim();
  const equipment = document.getElementById('new-cab-equipment').value.split(',').map(s => s.trim()).filter(Boolean);

  if (db.cabinets.some(c => c.number === number)) {
    alert('Бұл нөмірлі кабинет базада бар!');
    return;
  }

  const newCab = {
    id: 'cab-' + Date.now(),
    number,
    title,
    floor,
    category,
    status: 'available',
    equipment: equipment.length ? equipment : ['Жалпы медициналық жабдық']
  };

  db.cabinets.push(newCab);
  saveDatabase(db);
  closeModal('new-cabinet-modal');
  showToast('Жаңа кабинет қосылды!', `№${number} кабинет базаға тіркелді`, 'success');
  renderApp();
}

function saveAllChanges() {
  const db = getDatabase();
  saveDatabase(db);
  const user = getCurrentUser();
  setCurrentUser(user);

  const btn = document.getElementById('save-db-btn');
  const icon = document.getElementById('save-btn-icon');
  const text = document.getElementById('save-btn-text');

  if (btn) {
    btn.style.backgroundColor = '#059669';
    if (text) text.textContent = 'Сақталды ✓';
    if (icon) icon.textContent = '✓';

    setTimeout(() => {
      btn.style.backgroundColor = '#0d9488';
      if (text) text.textContent = 'Сақтау';
      if (icon) icon.textContent = '💾';
    }, 2000);
  }

  showToast('Сәтті сақталды!', 'Барлық өзгерістер (брондар, кабинеттер, күйлер, профиль) браузер жадында толық сақталды. Қайта ашқанда да сақталып тұрады.', 'success');
}

function exportDatabase() {
  const data = localStorage.getItem(DB_KEY) || JSON.stringify(DEFAULT_DATABASE);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `medcabinet_database_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('База жүктелді', 'Деректер JSON файлы ретінде сақталды', 'success');
}

function resetDatabase() {
  if (!confirm('Мәліметтер базасын бастапқы 3 таза демо аккаунтқа қайтаруға сенімдісіз бе?')) return;
  saveDatabase(DEFAULT_DATABASE);
  const admin = DEFAULT_DATABASE.users.find(u => u.role === 'admin') || DEFAULT_DATABASE.users[0];
  setCurrentUser(admin);
  renderApp();
  showToast('База жаңартылды', 'Бастапқы 3 демо аккаунт қалпына келтірілді', 'info');
}

function openModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('active');
    if (id === 'profile-modal') {
      const user = getCurrentUser();
      const nameVal = document.getElementById('profile-name-val');
      const emailVal = document.getElementById('profile-email-val');
      const phoneVal = document.getElementById('profile-phone-val');
      const preview = document.getElementById('modal-avatar-preview');
      if (nameVal) nameVal.value = user.name;
      if (emailVal) emailVal.value = user.email;
      if (phoneVal) phoneVal.value = user.phone;
      if (preview && user.avatar) preview.src = user.avatar;
    }
  }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
}

function showToast(title, message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div>
      <div style="font-size: 13px; font-weight: 800;">${title}</div>
      <div style="font-size: 11px; opacity: 0.9; margin-top: 2px;">${message}</div>
    </div>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity 0.25s, transform 0.25s';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}

// ==============================================================================
// 5. БАСТАПҚЫ ОҚИҒАЛАРДЫ БАЙЛАУ (DOM READY)
// ==============================================================================
function initApp() {
  renderApp();

  document.querySelectorAll('.floor-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.floor-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFloor = btn.dataset.floor;
      renderCabinets();
    });
  });

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      renderCabinets();
    });
  }

  document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetView = tab.dataset.view;
      document.getElementById('view-catalog').style.display = targetView === 'catalog' ? 'block' : 'none';
      document.getElementById('view-bookings').style.display = targetView === 'bookings' ? 'block' : 'none';
      document.getElementById('view-reminders').style.display = targetView === 'reminders' ? 'block' : 'none';

      if (targetView === 'bookings') renderMyBookings();
      if (targetView === 'reminders') renderReminders();
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

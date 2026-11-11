/**
 * ==============================================================================
 * MedCabinet — Медициналық кабинеттерді брондау және қабылдау жүйесі
 * Жоба авторы: Жақсылық Шыңғысхан
 * 
 * КУРСТЫҚ ЖҰМЫС (HTML5, CSS3, Pure JavaScript + LocalStorage)
 * Ешқандай сыртқы кітапханасыз, таза JavaScript (ES6) кодын пайдаланады.
 * 
 * МАЗМҰНЫ:
 * 1. Мәліметтер базасы мен LocalStorage конфигурациясы
 * 2. Бастапқы демо-деректер (Бастапқы кабинеттер, дәрігерлер, брондар)
 * 3. Сессия және авторизация (Кіру / Тіркелу / Профиль / Суретті өзгерту және өшіру)
 * 4. Кабинеттерді брондау (Дәрігерлер үшін)
 * 5. Қабылдауға жазылу (Науқастар үшін)
 * 6. Автоматты еске салғыштар (SMS / WhatsApp хабарламалары)
 * 7. Клиника әкімшілігінің функционалы
 * 8. Интерфейсті жаңарту және оқиғалар (DOM Event Handlers)
 * ==============================================================================
 */

// 1. Мәліметтер базасының LocalStorage кілттері
const DB_KEY = 'medcabinet_course_db';
const SESSION_KEY = 'medcabinet_course_session';

// 2. Бастапқы деректер жинағы (Егер LocalStorage бос болса жүктеледі)
const DEFAULT_DATABASE = {
  users: [
    {
      id: 'user-creator',
      name: 'Жақсылық Шыңғысхан',
      email: 'syngyszaksylyk854@gmail.com',
      phone: '+7 (777) 777-88-99',
      role: 'admin',
      domain: 'densaulyq.kz',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'MedCabinet жүйесінің авторы және жетекші әзірлеушісі. Клиника бас әкімшісі.'
    },
    {
      id: 'doc-1',
      name: 'Д-р Айгүл Серікқызы',
      email: 'aigul.serik@densaulyq.kz',
      phone: '+7 (701) 456-78-90',
      role: 'doctor',
      specialty: 'Терапевт (Жоғары санат)',
      domain: 'densaulyq.kz',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
      bio: 'Жұмыс өтілі 12 жыл. Жалпы диагностика және превентивті медицина маманы.'
    },
    {
      id: 'doc-2',
      name: 'Д-р Берік Ерболұлы',
      email: 'berik.erbol@densaulyq.kz',
      phone: '+7 (702) 555-12-34',
      role: 'doctor',
      specialty: 'Кардиолог (М.ғ.к.)',
      domain: 'densaulyq.kz',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
      bio: 'Кардиология бөлімінің жетекшісі, функционалды диагностика сарапшысы.'
    },
    {
      id: 'pat-1',
      name: 'Марат Жұмабаев',
      email: 'marat.zh@gmail.com',
      phone: '+7 (775) 123-45-67',
      role: 'patient',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'Тіркелген науқас. Медициналық сақтандыру полисі: KZ-998821'
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
      equipment: ['ЭКГ аппараты', 'Қан қысымын өлшегіш', 'Офтальмоскоп', 'Кушетка']
    },
    {
      id: 'cab-102',
      number: '102',
      title: 'Кардиология және функционалдық диагностика',
      floor: 1,
      category: 'Кардиология',
      status: 'booked',
      equipment: ['ЭхоКГ жүйесі', 'Холтер мониторы', 'Тредмил-тест кешені', 'Дефибриллятор']
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
      doctorId: 'doc-2',
      doctorName: 'Д-р Берік Ерболұлы',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '13:00',
      purpose: 'Жоспарлы кардиологиялық қабылдау',
      needsSterilization: true,
      createdAt: new Date().toISOString()
    }
  ],
  appointments: [
    {
      id: 'app-1',
      patientId: 'pat-1',
      patientName: 'Марат Жұмабаев',
      patientPhone: '+7 (775) 123-45-67',
      doctorId: 'doc-2',
      doctorName: 'Д-р Берік Ерболұлы',
      cabinetNumber: '102',
      date: new Date().toISOString().split('T')[0],
      time: '10:30',
      symptoms: 'Жүрек тұсының қысып ауыруы, қан қысымының көтерілуі',
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
      message: 'Құрметті Марат! Бүгін 10:30-да Д-р Берік Ерболұлы қабылдауына №102 кабинетке жазылғансыз. Өзіңізбен бірге жеке куәлікті ала келіңіз.',
      status: 'sent',
      sentAt: new Date().toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' })
    }
  ]
};

// ==============================================================================
// 2. ДЕРЕКТЕР БАЗАСЫН БАСҚАРУ ФУНКЦИЯЛАРЫ (LOCALSTORAGE)
// ==============================================================================

function getDatabase() {
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    saveDatabase(DEFAULT_DATABASE);
    return JSON.parse(JSON.stringify(DEFAULT_DATABASE));
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('LocalStorage оқу қатесі, база қалпына келтірілді', e);
    saveDatabase(DEFAULT_DATABASE);
    return JSON.parse(JSON.stringify(DEFAULT_DATABASE));
  }
}

function saveDatabase(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  updateStats();
}

// Сессиядағы пайдаланушыны басқару
function getCurrentUser() {
  const userJson = localStorage.getItem(SESSION_KEY);
  const db = getDatabase();
  if (userJson) {
    try {
      const parsed = JSON.parse(userJson);
      const found = db.users.find(u => u.id === parsed.id);
      return found || parsed;
    } catch (e) {}
  }
  const defaultUser = db.users[0];
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
    const rolesMap = { admin: 'Клиника әкімшісі', doctor: 'Дәрігер', patient: 'Науқас' };
    roleEl.textContent = rolesMap[user.role] || user.role;
  }

  if (avatarEl) {
    if (user.avatar) {
      avatarEl.innerHTML = `<img src="${user.avatar}" class="user-avatar-img" alt="${user.name}" onerror="this.outerHTML='<div class=\\'user-avatar-img\\'>${user.name.charAt(0)}</div>'">`;
    } else {
      avatarEl.innerHTML = `<div class="user-avatar-img">${user.name.charAt(0)}</div>`;
    }
  }
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

function switchUserRole(role) {
  const db = getDatabase();
  let targetUser = db.users.find(u => u.role === role);
  if (!targetUser) {
    targetUser = {
      id: 'user-' + role + '-' + Date.now(),
      name: role === 'doctor' ? 'Д-р Бақытжан Нұрланұлы' : (role === 'patient' ? 'Сәуле Қасымова' : 'Жақсылық Шыңғысхан'),
      email: role + '@densaulyq.kz',
      phone: '+7 (705) 111-22-33',
      role: role,
      avatar: ''
    };
    db.users.push(targetUser);
    saveDatabase(db);
  }
  setCurrentUser(targetUser);
  showToast('Рөл ауыстырылды', `Қазіргі рөл: ${role.toUpperCase()}`, 'info');
  renderApp();
}

function updateStats() {
  const db = getDatabase();
  const total = db.cabinets.length;
  const available = db.cabinets.filter(c => c.status === 'available').length;
  const booked = db.cabinets.filter(c => c.status === 'booked').length;
  const appointmentsCount = db.appointments.length;

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
        <h4 style="font-size: 16px; font-weight: 700; color: #334155;">Кабинеттер табылмады</h4>
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
          Кабинетті брондау
        </button>
      `;
    } else if (user.role === 'patient') {
      actionButtons = `
        <button class="btn btn-primary btn-sm" onclick="openAppointmentModal('${cab.id}')">
          Дәрігерге жазылу
        </button>
      `;
    } else {
      actionButtons = `
        <button class="btn btn-outline btn-sm" onclick="toggleCabinetStatus('${cab.id}')">
          Күйін өзгерту
        </button>
        <button class="btn btn-primary btn-sm" onclick="openBookingModal('${cab.id}')">
          Брондау
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
          <div style="font-size: 11px; font-weight: 700; color: #475569; margin-top: 10px;">Жабдықтар:</div>
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

  if (user.role === 'doctor') {
    const doctorBookings = db.bookings.filter(b => b.doctorId === user.id || user.role === 'admin');
    if (doctorBookings.length === 0) {
      container.innerHTML = `<p style="padding: 24px; text-align: center; color: #64748b;">Сізде белсенді брондалған кабинеттер жоқ.</p>`;
      return;
    }
    container.innerHTML = `
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Кабинет</th>
              <th>Күні</th>
              <th>Уақыты</th>
              <th>Мақсаты</th>
              <th>Стерилизация</th>
              <th>Әрекет</th>
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
                <td>
                  <button class="btn btn-danger btn-sm" onclick="cancelBooking('${b.id}')">Босату</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (user.role === 'patient') {
    const patientAppointments = db.appointments.filter(a => a.patientId === user.id || a.patientName === user.name);
    if (patientAppointments.length === 0) {
      container.innerHTML = `<p style="padding: 24px; text-align: center; color: #64748b;">Сізде дәрігерге жазылулар жоқ.</p>`;
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
              <th>Әрекет</th>
            </tr>
          </thead>
          <tbody>
            ${patientAppointments.map(a => `
              <tr>
                <td><strong>${a.doctorName}</strong></td>
                <td>№${a.cabinetNumber || '101'}</td>
                <td>${a.date} | ${a.time}</td>
                <td>${a.symptoms || 'Консультация'}</td>
                <td><span class="status-badge status-available">Расталған</span></td>
                <td>
                  <button class="btn btn-outline btn-sm" onclick="printPass('${a.id}')">🖨️ Талон</button>
                  <button class="btn btn-danger btn-sm" onclick="cancelAppointment('${a.id}')">Бас тарту</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div style="display: flex; gap: 10px; margin-bottom: 12px;">
        <span class="badge" style="background:#0d9488; color:white;">Барлық брондар: ${db.bookings.length}</span>
        <span class="badge" style="background:#2563eb; color:white;">Барлық қабылдаулар: ${db.appointments.length}</span>
      </div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Кабинет</th>
              <th>Дәрігер</th>
              <th>Күні мен уақыты</th>
              <th>Мақсаты</th>
              <th>Басқару</th>
            </tr>
          </thead>
          <tbody>
            ${db.bookings.map(b => `
              <tr>
                <td><strong>№${b.cabinetNumber}</strong></td>
                <td>${b.doctorName}</td>
                <td>${b.date} (${b.startTime} - ${b.endTime})</td>
                <td>${b.purpose}</td>
                <td><button class="btn btn-danger btn-sm" onclick="cancelBooking('${b.id}')">Броньды жою</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}

function renderReminders() {
  const db = getDatabase();
  const list = document.getElementById('reminders-list');
  if (!list) return;

  if (db.reminders.length === 0) {
    list.innerHTML = `<p style="padding: 20px; text-align: center; color: #64748b;">Еске салғыш хабарламалар тізімі бос.</p>`;
    return;
  }

  list.innerHTML = db.reminders.map(rem => `
    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start; gap: 14px;">
      <div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <span class="badge" style="background: ${rem.channel === 'WhatsApp' ? '#22c55e' : '#0ea5e9'}; color: white;">${rem.channel}</span>
          <strong style="font-size: 13px; color: #0f172a;">${rem.recipientName} (${rem.recipientPhone})</strong>
          <span style="font-size: 11px; color: #94a3b8;">${rem.sentAt || 'Жаңа'}</span>
        </div>
        <p style="font-size: 12px; color: #475569; line-height: 1.4;">${rem.message}</p>
      </div>
      <span class="badge" style="background: #ecfdf5; color: #059669;">Жеткізілді ✓</span>
    </div>
  `).join('');
}

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
  db.bookings.push(newBooking);

  const reminder = {
    id: 'rem-' + Date.now(),
    recipientName: user.name,
    recipientPhone: user.phone || '+7 (701) 456-78-90',
    channel: 'SMS',
    title: 'Кабинет броны расталды',
    message: `Құрметті ${user.name}! Сіз №${cab.number} кабинетті ${date} күні ${startTime}-${endTime} аралығына брондадыңыз. Мақсаты: ${purpose}`,
    status: 'sent',
    sentAt: new Date().toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' })
  };
  db.reminders.unshift(reminder);

  saveDatabase(db);
  closeModal('booking-modal');
  showToast('Сәтті брондалды!', `№${cab.number} кабинет брондалды және SMS еске салғыш тіркелді`, 'success');
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
    <option value="${d.id}">${d.name} (${d.specialty || 'Маман'})</option>
  `).join('');

  const cab = db.cabinets.find(c => c.id === cabinetId);
  document.getElementById('appointment-cab-id').value = cab ? cab.number : '101';
  document.getElementById('appointment-date').value = new Date().toISOString().split('T')[0];

  openModal('appointment-modal');
}

function submitAppointment(event) {
  event.preventDefault();
  const db = getDatabase();
  const user = getCurrentUser();

  const doctorId = document.getElementById('appointment-doctor').value;
  const doctor = db.users.find(u => u.id === doctorId) || { name: 'Кезекші дәрігер' };
  const date = document.getElementById('appointment-date').value;
  const time = document.getElementById('appointment-time').value;
  const symptoms = document.getElementById('appointment-symptoms').value;
  const cabNumber = document.getElementById('appointment-cab-id').value || '101';

  const newApp = {
    id: 'app-' + Date.now(),
    patientId: user.id,
    patientName: user.name,
    patientPhone: user.phone || '+7 (775) 000-00-00',
    doctorId: doctorId,
    doctorName: doctor.name,
    cabinetNumber: cabNumber,
    date: date,
    time: time,
    symptoms: symptoms,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  db.appointments.push(newApp);

  const reminder = {
    id: 'rem-' + Date.now(),
    recipientName: user.name,
    recipientPhone: user.phone || '+7 (775) 000-00-00',
    channel: 'SMS',
    title: 'Қабылдауға жазылу расталды',
    message: `Құрметті ${user.name}! Сіз ${date} сағат ${time}-де ${doctor.name} қабылдауына (№${cabNumber} каб.) жазылдыңыз. Кешікпей келуіңізді сұраймыз.`,
    status: 'sent',
    sentAt: new Date().toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' })
  };
  db.reminders.unshift(reminder);

  saveDatabase(db);
  closeModal('appointment-modal');
  showToast('Қабылдауға сәтті жазылдыңыз!', `SMS хабарлама жіберілді. Талонды «Менің брондарым» бөлімінен көре аласыз.`, 'success');
  renderApp();
}

function cancelAppointment(appId) {
  if (!confirm('Қабылдаудан бас тартуды растайсыз ба?')) return;
  const db = getDatabase();
  db.appointments = db.appointments.filter(a => a.id !== appId);
  saveDatabase(db);
  showToast('Қабылдау жойылды', 'Жазылу тізімнен өшірілді', 'info');
  renderApp();
}

function printPass(appId) {
  const db = getDatabase();
  const app = db.appointments.find(a => a.id === appId);
  if (!app) return;

  const printArea = document.getElementById('print-pass-area');
  printArea.innerHTML = `
    <div style="border: 2px dashed #0d9488; padding: 24px; border-radius: 12px; background: white; max-width: 480px; margin: 20px auto; font-family: sans-serif;">
      <div style="text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 14px;">
        <h2 style="font-size: 20px; color: #0d9488; font-weight: 800;">MedCabinet — Қабылдау талоны</h2>
        <p style="font-size: 11px; color: #64748b;">Densaulyq Medical Center • Автор: Жақсылық Шыңғысхан</p>
      </div>
      <div style="font-size: 13px; line-height: 1.8;">
        <div><strong>Науқас:</strong> ${app.patientName}</div>
        <div><strong>Телефон:</strong> ${app.patientPhone}</div>
        <div><strong>Дәрігер:</strong> ${app.doctorName}</div>
        <div><strong>Кабинет:</strong> №${app.cabinetNumber}</div>
        <div><strong>Күні мен уақыты:</strong> ${app.date} | ${app.time}</div>
        <div><strong>Себебі:</strong> ${app.symptoms}</div>
      </div>
      <div style="margin-top: 16px; padding-top: 10px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #0d9488;">
        Талон коды: #${app.id.toUpperCase()} • Сәтті сауығып кетуіңізге тілектеспіз!
      </div>
    </div>
  `;
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

    document.getElementById('modal-avatar-preview').src = base64Image;
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

  document.getElementById('modal-avatar-preview').src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
  showToast('Сурет өшірілді', 'Профиль суреті алынып тасталды', 'info');
}

function toggleCabinetStatus(cabinetId) {
  const db = getDatabase();
  const cab = db.cabinets.find(c => c.id === cabinetId);
  if (!cab) return;

  const order = ['available', 'booked', 'sanitizing', 'maintenance'];
  const nextIdx = (order.indexOf(cab.status) + 1) % order.length;
  cab.status = order[nextIdx];

  saveDatabase(db);
  renderCabinets();
  showToast('Күй өзгертілді', `№${cab.number} кабинет жаңа күйі: ${cab.status}`, 'info');
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

function exportDatabase() {
  const data = localStorage.getItem(DB_KEY) || JSON.stringify(DEFAULT_DATABASE);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `medcabinet_database_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('База жүктелді', 'Деректер компьютеріңізге JSON файлы ретінде сақталды', 'success');
}

function resetDatabase() {
  if (!confirm('Мәліметтер базасын бастапқы күйге қайтаруға сенімдісіз бе? Барлық жаңа енгізілген брондар жойылады.')) return;
  saveDatabase(DEFAULT_DATABASE);
  setCurrentUser(DEFAULT_DATABASE.users[0]);
  renderApp();
  showToast('База жаңартылды', 'Бастапқы демо-деректер қалпына келтірілді', 'info');
}

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
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
    toast.style.transition = 'opacity 0.3s';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

document.addEventListener('DOMContentLoaded', () => {
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
});

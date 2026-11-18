const fs = require('fs');
const { execSync } = require('child_process');

// 1. ER Diagram SVG
const svg_er = `
<svg width="800" height="420" viewBox="0 0 800 420" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; font-family:'DejaVu Sans',Arial,sans-serif;">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Title -->
  <text x="400" y="30" font-size="16" font-weight="bold" text-anchor="middle" fill="#0f172a">1.1-сурет. «MedCabinet» жүйесінің концептуалды ER-моделі</text>

  <!-- Entity: USERS -->
  <g transform="translate(40, 70)" filter="url(#shadow)">
    <rect width="200" height="150" rx="8" fill="#f8fafc" stroke="#0284c7" stroke-width="2"/>
    <rect width="200" height="32" rx="8" fill="#0284c7"/>
    <text x="100" y="21" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">USERS (Пайдаланушылар)</text>
    <text x="12" y="55" font-size="11" fill="#0f172a" font-weight="bold">PK: id (string)</text>
    <text x="12" y="73" font-size="11" fill="#334155">• role (admin/doctor/patient)</text>
    <text x="12" y="91" font-size="11" fill="#334155">• name, login, phone</text>
    <text x="12" y="109" font-size="11" fill="#334155">• password (hash)</text>
    <text x="12" y="127" font-size="11" fill="#334155">• specialty, iin, assignedCabinet</text>
  </g>

  <!-- Entity: CABINETS -->
  <g transform="translate(560, 70)" filter="url(#shadow)">
    <rect width="200" height="150" rx="8" fill="#f8fafc" stroke="#059669" stroke-width="2"/>
    <rect width="200" height="32" rx="8" fill="#059669"/>
    <text x="100" y="21" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">CABINETS (Кабинеттер)</text>
    <text x="12" y="55" font-size="11" fill="#0f172a" font-weight="bold">PK: id (string)</text>
    <text x="12" y="73" font-size="11" fill="#334155">• number, title, floor</text>
    <text x="12" y="91" font-size="11" fill="#334155">• category (бөлімі)</text>
    <text x="12" y="109" font-size="11" fill="#334155">• status (бос/брондалған)</text>
    <text x="12" y="127" font-size="11" fill="#334155">• equipment (жабдықтар)</text>
  </g>

  <!-- Entity: APPOINTMENTS -->
  <g transform="translate(40, 260)" filter="url(#shadow)">
    <rect width="200" height="140" rx="8" fill="#f8fafc" stroke="#7c3aed" stroke-width="2"/>
    <rect width="200" height="32" rx="8" fill="#7c3aed"/>
    <text x="100" y="21" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">APPOINTMENTS (Жазылулар)</text>
    <text x="12" y="55" font-size="11" fill="#0f172a" font-weight="bold">PK: id (string)</text>
    <text x="12" y="73" font-size="11" fill="#334155">FK: patientId → Users.id</text>
    <text x="12" y="91" font-size="11" fill="#334155">FK: doctorId → Users.id</text>
    <text x="12" y="109" font-size="11" fill="#334155">• cabinetNumber, date, time</text>
    <text x="12" y="127" font-size="11" fill="#334155">• symptoms, status, barcode</text>
  </g>

  <!-- Entity: BOOKINGS -->
  <g transform="translate(560, 260)" filter="url(#shadow)">
    <rect width="200" height="140" rx="8" fill="#f8fafc" stroke="#d97706" stroke-width="2"/>
    <rect width="200" height="32" rx="8" fill="#d97706"/>
    <text x="100" y="21" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">BOOKINGS (Брондар)</text>
    <text x="12" y="55" font-size="11" fill="#0f172a" font-weight="bold">PK: id (string)</text>
    <text x="12" y="73" font-size="11" fill="#334155">FK: cabinetId → Cabinets.id</text>
    <text x="12" y="91" font-size="11" fill="#334155">FK: doctorId → Users.id</text>
    <text x="12" y="109" font-size="11" fill="#334155">• date, startTime, endTime</text>
    <text x="12" y="127" font-size="11" fill="#334155">• purpose, needsSterilization</text>
  </g>

  <!-- Entity: REMINDERS (Center) -->
  <g transform="translate(300, 160)" filter="url(#shadow)">
    <rect width="200" height="120" rx="8" fill="#f8fafc" stroke="#e11d48" stroke-width="2"/>
    <rect width="200" height="32" rx="8" fill="#e11d48"/>
    <text x="100" y="21" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">REMINDERS (Еске салғыш)</text>
    <text x="12" y="55" font-size="11" fill="#0f172a" font-weight="bold">PK: id (string)</text>
    <text x="12" y="73" font-size="11" fill="#334155">• recipientName, phone</text>
    <text x="12" y="91" font-size="11" fill="#334155">• channel (SMS/WhatsApp)</text>
    <text x="12" y="109" font-size="11" fill="#334155">• message, sentAt, status</text>
  </g>

  <!-- Connectors -->
  <!-- Users to Appointments (1:N) -->
  <line x1="140" y1="220" x2="140" y2="260" stroke="#7c3aed" stroke-width="2"/>
  <text x="150" y="245" font-size="10" font-weight="bold" fill="#7c3aed">1 : N</text>

  <!-- Users to Bookings (1:N) -->
  <path d="M 240 140 L 400 140 L 560 300" stroke="#d97706" stroke-width="1.5" stroke-dasharray="4,4" fill="none"/>
  <text x="350" y="132" font-size="10" font-weight="bold" fill="#d97706">1 : N (Doctor)</text>

  <!-- Cabinets to Bookings (1:N) -->
  <line x1="660" y1="220" x2="660" y2="260" stroke="#059669" stroke-width="2"/>
  <text x="670" y="245" font-size="10" font-weight="bold" fill="#059669">1 : N</text>

  <!-- Appointments to Reminders -->
  <line x1="240" y1="320" x2="300" y2="250" stroke="#e11d48" stroke-width="1.5"/>
  <text x="245" y="280" font-size="10" font-weight="bold" fill="#e11d48">1 : 1</text>
</svg>
`;

// 2. Architecture SVG
const svg_arch = `
<svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; font-family:'DejaVu Sans',Arial,sans-serif;">
  <defs>
    <filter id="sh2" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.12"/>
    </filter>
  </defs>

  <text x="400" y="28" font-size="16" font-weight="bold" text-anchor="middle" fill="#0f172a">2.2-сурет. «MedCabinet» жүйесінің клиент-серверлік архитектурасы</text>

  <!-- Client Side Box -->
  <rect x="30" y="60" width="220" height="310" rx="10" fill="#f0fdf4" stroke="#16a34a" stroke-width="2" filter="url(#sh2)"/>
  <rect x="30" y="60" width="220" height="36" rx="10" fill="#16a34a"/>
  <text x="140" y="84" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">КЛИЕНТ (REACT SPA)</text>
  <text x="45" y="120" font-size="11" font-weight="bold" fill="#14532d">• React 19 + TypeScript</text>
  <text x="45" y="145" font-size="11" fill="#166534">• Tailwind CSS стилдері</text>
  <text x="45" y="170" font-size="11" fill="#166534">• AuthScreen (Кіру/Тіркелу)</text>
  <text x="45" y="195" font-size="11" fill="#166534">• PatientPortal (Жазылу)</text>
  <text x="45" y="220" font-size="11" fill="#166534">• DoctorPortal (Брондау)</text>
  <text x="45" y="245" font-size="11" fill="#166534">• AdminPortal (Басқару)</text>
  <text x="45" y="270" font-size="11" fill="#166534">• PrintPassModal (Талон)</text>
  <text x="45" y="295" font-size="11" fill="#166534">• Toast Notification</text>
  <text x="45" y="325" font-size="11" font-weight="bold" fill="#047857">Fetch API (HTTP / JSON)</text>

  <!-- Arrow Client -> Server -->
  <g transform="translate(255, 170)">
    <line x1="0" y1="0" x2="80" y2="0" stroke="#0284c7" stroke-width="3" marker-end="url(#arr)"/>
    <polygon points="80,-5 90,0 80,5" fill="#0284c7"/>
    <text x="45" y="-10" font-size="10" font-weight="bold" fill="#0369a1" text-anchor="middle">HTTP Requests</text>
    <line x1="90" y1="30" x2="10" y2="30" stroke="#059669" stroke-width="3"/>
    <polygon points="10,25 0,30 10,35" fill="#059669"/>
    <text x="45" y="48" font-size="10" font-weight="bold" fill="#047857" text-anchor="middle">JSON Response</text>
  </g>

  <!-- Server Side Box -->
  <rect x="350" y="60" width="220" height="310" rx="10" fill="#f0f9ff" stroke="#0284c7" stroke-width="2" filter="url(#sh2)"/>
  <rect x="350" y="60" width="220" height="36" rx="10" fill="#0284c7"/>
  <text x="460" y="84" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">СЕРВЕР (EXPRESS / NODE)</text>
  <text x="365" y="120" font-size="11" font-weight="bold" fill="#0c4a6e">• Node.js + Express 5</text>
  <text x="365" y="145" font-size="11" fill="#0369a1">• REST API маршрутизациясы</text>
  <text x="365" y="170" font-size="11" fill="#0369a1">• /api/auth (Login, Register)</text>
  <text x="365" y="195" font-size="11" fill="#0369a1">• /api/users (Delete, List)</text>
  <text x="365" y="220" font-size="11" fill="#0369a1">• /api/cabinets (CRUD)</text>
  <text x="365" y="245" font-size="11" fill="#0369a1">• /api/appointments</text>
  <text x="365" y="270" font-size="11" fill="#0369a1">• /api/bookings & reminders</text>
  <text x="365" y="295" font-size="11" fill="#0369a1">• Қауіпсіздік & Хэштеу</text>
  <text x="365" y="325" font-size="11" font-weight="bold" fill="#0284c7">CORS & JSON Middleware</text>

  <!-- Arrow Server -> Database -->
  <g transform="translate(575, 170)">
    <line x1="0" y1="0" x2="45" y2="0" stroke="#7c3aed" stroke-width="3"/>
    <polygon points="45,-5 55,0 45,5" fill="#7c3aed"/>
    <text x="25" y="-10" font-size="10" font-weight="bold" fill="#6d28d9" text-anchor="middle">fs.writeFile</text>
    <line x1="55" y1="30" x2="10" y2="30" stroke="#7c3aed" stroke-width="3"/>
    <polygon points="10,25 0,30 10,35" fill="#7c3aed"/>
    <text x="25" y="48" font-size="10" font-weight="bold" fill="#6d28d9" text-anchor="middle">fs.readFile</text>
  </g>

  <!-- Database Box -->
  <rect x="635" y="60" width="135" height="310" rx="10" fill="#faf5ff" stroke="#7c3aed" stroke-width="2" filter="url(#sh2)"/>
  <rect x="635" y="60" width="135" height="36" rx="10" fill="#7c3aed"/>
  <text x="702" y="84" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">JSON ДБ (ФАЙЛ)</text>
  <text x="645" y="130" font-size="11" font-weight="bold" fill="#4c1d95">Тұрақты жад:</text>
  <text x="645" y="160" font-size="10" fill="#5b21b6">• users[]</text>
  <text x="645" y="185" font-size="10" fill="#5b21b6">• cabinets[]</text>
  <text x="645" y="210" font-size="10" fill="#5b21b6">• appointments[]</text>
  <text x="645" y="235" font-size="10" fill="#5b21b6">• bookings[]</text>
  <text x="645" y="260" font-size="10" fill="#5b21b6">• reminders[]</text>
  <text x="645" y="310" font-size="9" fill="#7c3aed" font-weight="bold">medcabinet_db.json</text>
</svg>
`;

// 3. Flowchart SVG
const svg_flowchart = `
<svg width="600" height="500" viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; font-family:'DejaVu Sans',Arial,sans-serif;">
  <defs>
    <filter id="sh3" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="2" dy="2" stdDeviation="2" flood-opacity="0.15"/>
    </filter>
  </defs>

  <text x="300" y="25" font-size="15" font-weight="bold" text-anchor="middle" fill="#0f172a">2.3-сурет. Дәрігер қабылдауына жазылу алгоритмінің блок-схемасы</text>

  <!-- Start -->
  <rect x="230" y="45" width="140" height="36" rx="18" fill="#10b981" filter="url(#sh3)"/>
  <text x="300" y="68" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">Басы (Старт)</text>

  <!-- Arrow -->
  <line x1="300" y1="81" x2="300" y2="105" stroke="#334155" stroke-width="2"/>
  <polygon points="296,105 300,113 304,105" fill="#334155"/>

  <!-- Step 1 -->
  <rect x="180" y="115" width="240" height="40" rx="6" fill="#f1f5f9" stroke="#64748b" stroke-width="1.5" filter="url(#sh3)"/>
  <text x="300" y="139" font-size="11" fill="#0f172a" text-anchor="middle">Пациент жүйеге кіреді / Дәрігерді таңдайды</text>

  <!-- Arrow -->
  <line x1="300" y1="155" x2="300" y2="180" stroke="#334155" stroke-width="2"/>
  <polygon points="296,180 300,188 304,180" fill="#334155"/>

  <!-- Step 2 -->
  <rect x="180" y="190" width="240" height="40" rx="6" fill="#f1f5f9" stroke="#64748b" stroke-width="1.5" filter="url(#sh3)"/>
  <text x="300" y="214" font-size="11" fill="#0f172a" text-anchor="middle">Күнін, уақытын және шағымын енгізеді</text>

  <!-- Arrow -->
  <line x1="300" y1="230" x2="300" y2="255" stroke="#334155" stroke-width="2"/>
  <polygon points="296,255 300,263 304,255" fill="#334155"/>

  <!-- Decision: Is Slot Free? -->
  <polygon points="300,265 420,305 300,345 180,305" fill="#fef3c7" stroke="#d97706" stroke-width="2" filter="url(#sh3)"/>
  <text x="300" y="302" font-size="11" font-weight="bold" fill="#78350f" text-anchor="middle">Кабинет пен уақыт</text>
  <text x="300" y="316" font-size="11" font-weight="bold" fill="#78350f" text-anchor="middle">бос па?</text>

  <!-- NO branch -->
  <line x1="180" y1="305" x2="100" y2="305" stroke="#dc2626" stroke-width="2"/>
  <line x1="100" y1="305" x2="100" y2="210" stroke="#dc2626" stroke-width="2"/>
  <line x1="100" y1="210" x2="175" y2="210" stroke="#dc2626" stroke-width="2"/>
  <polygon points="175,206 180,210 175,214" fill="#dc2626"/>
  <text x="130" y="298" font-size="10" font-weight="bold" fill="#dc2626">Жоқ (Бос емес)</text>

  <!-- YES branch -->
  <line x1="300" y1="345" x2="300" y2="375" stroke="#16a34a" stroke-width="2"/>
  <polygon points="296,375 300,383 304,375" fill="#16a34a"/>
  <text x="310" y="365" font-size="10" font-weight="bold" fill="#16a34a">Иә</text>

  <!-- Step 3: Success -->
  <rect x="170" y="385" width="260" height="45" rx="6" fill="#ecfdf5" stroke="#059669" stroke-width="2" filter="url(#sh3)"/>
  <text x="300" y="405" font-size="11" font-weight="bold" fill="#065f46" text-anchor="middle">Серверде жазу жасалады, SMS жіберіледі,</text>
  <text x="300" y="421" font-size="11" font-weight="bold" fill="#065f46" text-anchor="middle">ресми электронды талон генерацияланады</text>

  <!-- Arrow -->
  <line x1="300" y1="430" x2="300" y2="455" stroke="#334155" stroke-width="2"/>
  <polygon points="296,455 300,463 304,455" fill="#334155"/>

  <!-- End -->
  <rect x="230" y="465" width="140" height="30" rx="15" fill="#64748b" filter="url(#sh3)"/>
  <text x="300" y="485" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">Соңы (Аяқтау)</text>
</svg>
`;

// 4. Site Map SVG
const svg_sitemap = `
<svg width="750" height="360" viewBox="0 0 750 360" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; font-family:'DejaVu Sans',Arial,sans-serif;">
  <defs>
    <filter id="sh4" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="2" dy="2" stdDeviation="2" flood-opacity="0.12"/>
    </filter>
  </defs>

  <text x="375" y="25" font-size="16" font-weight="bold" text-anchor="middle" fill="#0f172a">2.1-сурет. «MedCabinet» веб-қосымшасының сайт картасы мен модульдер құрылымы</text>

  <!-- Level 0: Main Auth Entry -->
  <rect x="275" y="45" width="200" height="42" rx="8" fill="#0f172a" filter="url(#sh4)"/>
  <text x="375" y="70" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">Авторизация (Кіру / Тіркелу)</text>

  <!-- Tree branches -->
  <line x1="375" y1="87" x2="375" y2="115" stroke="#64748b" stroke-width="2"/>
  <line x1="120" y1="115" x2="630" y2="115" stroke="#64748b" stroke-width="2"/>
  <line x1="120" y1="115" x2="120" y2="135" stroke="#64748b" stroke-width="2"/>
  <line x1="375" y1="115" x2="375" y2="135" stroke="#64748b" stroke-width="2"/>
  <line x1="630" y1="115" x2="630" y2="135" stroke="#64748b" stroke-width="2"/>

  <!-- Level 1: Roles -->
  <!-- Patient -->
  <rect x="30" y="135" width="180" height="40" rx="8" fill="#10b981" filter="url(#sh4)"/>
  <text x="120" y="160" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">Пациент порталы</text>

  <!-- Doctor -->
  <rect x="285" y="135" width="180" height="40" rx="8" fill="#0284c7" filter="url(#sh4)"/>
  <text x="375" y="160" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">Дәрігер порталы</text>

  <!-- Admin -->
  <rect x="540" y="135" width="180" height="40" rx="8" fill="#7c3aed" filter="url(#sh4)"/>
  <text x="630" y="160" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">Бас Әкімші (Админ)</text>

  <!-- Sub-features: Patient -->
  <rect x="20" y="195" width="200" height="150" rx="6" fill="#f0fdf4" stroke="#10b981" stroke-width="1.5"/>
  <text x="30" y="220" font-size="11" fill="#065f46" font-weight="bold">• Кабинеттер каталогы</text>
  <text x="30" y="245" font-size="11" fill="#065f46">• Қабаттар бойынша сүзгі</text>
  <text x="30" y="270" font-size="11" fill="#065f46">• Дәрігерге жазылу формасы</text>
  <text x="30" y="295" font-size="11" fill="#065f46">• Менің жазылуларым</text>
  <text x="30" y="320" font-size="11" fill="#065f46" font-weight="bold">★ Талонды басып шығару</text>

  <!-- Sub-features: Doctor -->
  <rect x="275" y="195" width="200" height="150" rx="6" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.5"/>
  <text x="285" y="220" font-size="11" fill="#0369a1" font-weight="bold">• Науқастар кезегі (Live)</text>
  <text x="285" y="245" font-size="11" fill="#0369a1">• Қабылдауды аяқтау ✓</text>
  <text x="285" y="270" font-size="11" fill="#0369a1">• Кабинет брондау модулі</text>
  <text x="285" y="295" font-size="11" fill="#0369a1" font-weight="bold">★ Кварцтау сұранысы</text>
  <text x="285" y="320" font-size="11" fill="#0369a1">• Жеке кабинетті босату</text>

  <!-- Sub-features: Admin -->
  <rect x="530" y="195" width="200" height="150" rx="6" fill="#faf5ff" stroke="#7c3aed" stroke-width="1.5"/>
  <text x="540" y="220" font-size="11" fill="#5b21b6" font-weight="bold">• Клиника статистикасы</text>
  <text x="540" y="245" font-size="11" fill="#5b21b6">• Кабинет қосу / өңдеу</text>
  <text x="540" y="270" font-size="11" fill="#5b21b6">• Күйді басқару (4 күй)</text>
  <text x="540" y="295" font-size="11" fill="#5b21b6" font-weight="bold">★ Тіркелгендерді өшіру</text>
  <text x="540" y="320" font-size="11" fill="#5b21b6">• Барлық қабылдауларды бақылау</text>
</svg>
`;

fs.writeFileSync('figures/fig_1_1_er.svg', svg_er);
fs.writeFileSync('figures/fig_2_2_arch.svg', svg_arch);
fs.writeFileSync('figures/fig_2_3_flowchart.svg', svg_flowchart);
fs.writeFileSync('figures/fig_2_1_sitemap.svg', svg_sitemap);

console.log('SVGs written. Converting to PNG...');
execSync('convert -density 150 figures/fig_1_1_er.svg figures/fig_1_1_er.png');
execSync('convert -density 150 figures/fig_2_2_arch.svg figures/fig_2_2_arch.png');
execSync('convert -density 150 figures/fig_2_3_flowchart.svg figures/fig_2_3_flowchart.png');
execSync('convert -density 150 figures/fig_2_1_sitemap.svg figures/fig_2_1_sitemap.png');

console.log('All figures converted to PNG successfully!');

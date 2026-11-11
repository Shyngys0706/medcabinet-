import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const app = express();
app.use(express.json({ limit: '10mb' }));

// ==============================================================================
// 1. СЕРВЕРЛІК ДЕРЕКТЕР ҚОРЫ (FILE-BASED PERSISTENT DATABASE)
// ==============================================================================
const DATA_DIR = path.resolve('server-data');
const DB_FILE = path.join(DATA_DIR, 'medcabinet_db.json');

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password.trim()).digest('hex');
}

function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9+]/g, '');
}

function normalizeLogin(login: string): string {
  return login.trim().toLowerCase();
}

// Бастапқы база үлгісі
const DEFAULT_SERVER_DB = {
  users: [
    {
      id: 'usr-admin-1',
      name: 'Жақсылық Шыңғысхан',
      login: 'admin',
      phone: '+77777778899',
      passwordHash: hashPassword('admin123'),
      role: 'admin',
      email: 'syngyszaksylyk854@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      createdAt: '2026-11-11T00:00:00.000Z',
    },
    {
      id: 'usr-doc-1',
      name: 'Д-р Берік Ерболұлы',
      login: 'dr_berik',
      phone: '+77011112233',
      passwordHash: hashPassword('doctor123'),
      role: 'doctor',
      specialty: 'Кардиолог-терапевт',
      assignedCabinet: '102',
      email: 'berik.cardio@medcabinet.kz',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
      createdAt: '2026-11-11T00:00:00.000Z',
    },
    {
      id: 'usr-pat-1',
      name: 'Марат Жұмабаев',
      login: 'marat',
      phone: '+77051234567',
      passwordHash: hashPassword('patient123'),
      role: 'patient',
      iin: '920415350124',
      email: 'marat.zh@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      createdAt: '2026-11-11T00:00:00.000Z',
    },
  ],
  cabinets: [
    {
      id: 'cab-101',
      number: '101',
      title: 'Жалпы терапия және тексеру',
      floor: 1,
      category: 'Терапия',
      status: 'available',
      equipment: ['ЭКГ аппараты', 'Сфигмоманометр', 'Кушетка', 'Дәрігерлік үстел'],
    },
    {
      id: 'cab-102',
      number: '102',
      title: 'Кардиология және ЭКГ кабинеті',
      floor: 1,
      category: 'Кардиология',
      status: 'booked',
      equipment: ['12-арналы ЭКГ', 'Холтер мониторы', 'Дефибриллятор', 'ЭхоКГ аппараты'],
    },
    {
      id: 'cab-201',
      number: '201',
      title: 'Ультрадыбыстық зерттеу (УДЗ / УЗИ)',
      floor: 2,
      category: 'Диагностика',
      status: 'available',
      equipment: ['УДЗ аппараты (3D/4D)', 'Допплер датчигі', 'Медициналық гель жылытқыш'],
    },
    {
      id: 'cab-202',
      number: '202',
      title: 'Рентген-диагностикалық кешен',
      floor: 2,
      category: 'Рентгенология',
      status: 'sanitizing',
      equipment: ['Сандық рентген', 'Қорғаныш экрандары', 'Автоматты басқару пульті'],
    },
    {
      id: 'cab-301',
      number: '301',
      title: 'Офтальмология және көз тексеру',
      floor: 3,
      category: 'Офтальмология',
      status: 'available',
      equipment: ['Щелевая лампа', 'Авторефрактометр', 'Сивцев кестесі'],
    },
    {
      id: 'cab-302',
      number: '302',
      title: 'Стоматологиялық емдеу кабинеті',
      floor: 3,
      category: 'Стоматология',
      status: 'available',
      equipment: ['Стоматологиялық қондырғы', 'Ультрадыбыстық скалер', 'Автоклав'],
    },
    {
      id: 'cab-401',
      number: '401',
      title: 'Хирургиялық таңу және манипуляциялық',
      floor: 4,
      category: 'Хирургия',
      status: 'available',
      equipment: ['Стерильдеу шкафы', 'Операциялық шам', 'Манипуляциялық үстел'],
    },
  ],
  bookings: [
    {
      id: 'book-1',
      cabinetId: 'cab-102',
      cabinetNumber: '102',
      doctorId: 'usr-doc-1',
      doctorName: 'Д-р Берік Ерболұлы',
      date: '2026-11-12',
      startTime: '09:00',
      endTime: '13:00',
      purpose: 'Жоспарлы кардиологиялық қабылдау',
      needsSterilization: true,
      createdAt: '2026-11-11T09:00:00.000Z',
    },
  ],
  appointments: [
    {
      id: 'app-1',
      patientId: 'usr-pat-1',
      patientName: 'Марат Жұмабаев',
      patientPhone: '+77051234567',
      patientIin: '920415350124',
      doctorId: 'usr-doc-1',
      doctorName: 'Д-р Берік Ерболұлы',
      cabinetNumber: '102',
      date: '2026-11-12',
      time: '10:00',
      symptoms: 'Жүрек соғысының жиілеуі, қан қысымын тексеру',
      status: 'confirmed',
      createdAt: '2026-11-11T09:15:00.000Z',
    },
  ],
  reminders: [
    {
      id: 'rem-1',
      recipientName: 'Марат Жұмабаев',
      recipientPhone: '+77051234567',
      channel: 'SMS',
      title: 'Қабылдауға жазылу расталды',
      message: 'Құрметті Марат Жұмабаев! 2026-11-12 сағат 10:00-де Д-р Берік Ерболұлы қабылдауына (№102 каб.) жазылдыңыз.',
      status: 'sent',
      sentAt: '10:05',
    },
  ],
};

function getDb(): typeof DEFAULT_SERVER_DB {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_SERVER_DB, null, 2), 'utf-8');
    return JSON.parse(JSON.stringify(DEFAULT_SERVER_DB));
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading db file, resetting to default', e);
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_SERVER_DB, null, 2), 'utf-8');
    return JSON.parse(JSON.stringify(DEFAULT_SERVER_DB));
  }
}

function saveDb(data: typeof DEFAULT_SERVER_DB) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function sanitizeUser(user: any) {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
}

// ==============================================================================
// 2. АУТЕНТИФИКАЦИЯ ЖӘНЕ РЕГИСТРАЦИЯ API РОУТТАРЫ
// ==============================================================================

// Тіркелу: Пациент немесе Дәрігер (Админ рөлін таңдау қатаң тыйым салынған!)
app.post('/api/auth/register', (req: Request, res: Response): any => {
  const { name, login, phone, password, role, specialty, assignedCabinet, iin, email } = req.body;

  if (!name || !login || !phone || !password || !role) {
    return res.status(400).json({ error: 'Барлық міндетті өрістерді (аты-жөні, логин, телефон, құпия сөз, рөл) толтырыңыз!' });
  }

  // Админге деген опция болмауы керек!
  if (role === 'admin') {
    return res.status(403).json({ error: 'Әкімші (Админ) ретінде өздігінен тіркелуге рұқсат жоқ! Тек Пациент немесе Дәрігер рөлін таңдаңыз.' });
  }

  if (role !== 'patient' && role !== 'doctor') {
    return res.status(400).json({ error: 'Қате рөл таңдалды. Тек «patient» (Пациент) немесе «doctor» (Дәрігер) рұқсат етілген.' });
  }

  if (password.length < 4) {
    return res.status(400).json({ error: 'Құпия сөз кемінде 4 таңбадан тұруы қажет!' });
  }

  const normLogin = normalizeLogin(login);
  const normPhone = normalizePhone(phone);

  const db = getDb();

  // Логин мен телефонның бірегейлігін тексеру (Бір ғана нөмір мен логинмен сақталуы керек)
  const loginExists = db.users.some(u => normalizeLogin(u.login) === normLogin);
  if (loginExists) {
    return res.status(400).json({ error: `«${login}» логині жүйеде бұрыннан бар! Өтінеміз, басқа логин таңдаңыз.` });
  }

  const phoneExists = db.users.some(u => normalizePhone(u.phone) === normPhone);
  if (phoneExists) {
    return res.status(400).json({ error: `«${phone}» телефон нөмірі жүйеде тіркелген! Бір нөмірмен тек бір ғана аккаунт сақталады.` });
  }

  const newUser = {
    id: 'usr-' + Date.now(),
    name: name.trim(),
    login: normLogin,
    phone: normPhone,
    passwordHash: hashPassword(password),
    role,
    specialty: role === 'doctor' ? (specialty || 'Жалпы тәжірибелік дәрігер') : undefined,
    assignedCabinet: role === 'doctor' ? (assignedCabinet || '101') : undefined,
    iin: role === 'patient' ? (iin || '') : undefined,
    email: email ? email.trim() : `${normLogin}@medcabinet.kz`,
    avatar: '',
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDb(db);

  return res.status(201).json({
    message: 'Тіркелу сәтті аяқталды!',
    user: sanitizeUser(newUser),
    token: newUser.id,
  });
});

// Кіру: Логин немесе телефон нөмірі және құпия сөз арқылы
app.post('/api/auth/login', (req: Request, res: Response): any => {
  const { loginOrPhone, password } = req.body;

  if (!loginOrPhone || !password) {
    return res.status(400).json({ error: 'Логин (немесе телефон) мен құпия сөзді енгізіңіз!' });
  }

  const trimmed = loginOrPhone.trim();
  const normLogin = normalizeLogin(trimmed);
  const normPhone = normalizePhone(trimmed);
  const hash = hashPassword(password);

  const db = getDb();
  const user = db.users.find(
    u => (normalizeLogin(u.login) === normLogin || normalizePhone(u.phone) === normPhone) && u.passwordHash === hash
  );

  if (!user) {
    return res.status(401).json({ error: 'Логин/телефон немесе құпия сөз қате!' });
  }

  return res.json({
    message: 'Жүйеге сәтті кірдіңіз!',
    user: sanitizeUser(user),
    token: user.id,
  });
});

// Қазіргі қолданушы деректерін алу
app.get('/api/auth/me', (req: Request, res: Response): any => {
  const token = req.headers.authorization?.replace('Bearer ', '') || (req.query.token as string);
  if (!token) {
    return res.status(401).json({ error: 'Авторизация қажет' });
  }

  const db = getDb();
  const user = db.users.find(u => u.id === token);
  if (!user) {
    return res.status(404).json({ error: 'Пайдаланушы табылмады' });
  }

  return res.json({ user: sanitizeUser(user) });
});

// Профильді (аватар, телефон, т.б.) жаңарту
app.put('/api/users/:id', (req: Request, res: Response): any => {
  const { id } = req.params;
  const { name, phone, email, avatar, specialty } = req.body;

  const db = getDb();
  const user = db.users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'Пайдаланушы табылмады' });
  }

  if (name) user.name = name.trim();
  if (phone) {
    const normPhone = normalizePhone(phone);
    const existing = db.users.find(u => u.id !== id && normalizePhone(u.phone) === normPhone);
    if (existing) {
      return res.status(400).json({ error: 'Бұл телефон нөмірі басқа аккаунтқа тіркелген!' });
    }
    user.phone = normPhone;
  }
  if (email) user.email = email.trim();
  if (avatar !== undefined) user.avatar = avatar;
  if (specialty && user.role === 'doctor') user.specialty = specialty.trim();

  saveDb(db);
  return res.json({ message: 'Профиль сәтті жаңартылды!', user: sanitizeUser(user) });
});

// Пайдаланушылар тізімі (Админ көреді)
app.get('/api/users', (req: Request, res: Response): any => {
  const db = getDb();
  return res.json(db.users.map(sanitizeUser));
});

// Дәрігерлер тізімі (Барлық қолданушылар дәрігер таңдау үшін көреді)
app.get('/api/doctors', (req: Request, res: Response): any => {
  const db = getDb();
  const doctors = db.users.filter(u => u.role === 'doctor').map(sanitizeUser);
  return res.json(doctors);
});

// ==============================================================================
// 3. КАБИНЕТТЕР API
// ==============================================================================

app.get('/api/cabinets', (req: Request, res: Response): any => {
  const db = getDb();
  return res.json(db.cabinets);
});

app.post('/api/cabinets', (req: Request, res: Response): any => {
  const { number, title, floor, category, equipment } = req.body;
  if (!number || !title) {
    return res.status(400).json({ error: 'Кабинет нөмірі мен атауы міндетті!' });
  }

  const db = getDb();
  if (db.cabinets.some(c => c.number === number.toString().trim())) {
    return res.status(400).json({ error: `№${number} кабинет базада бар!` });
  }

  const newCab = {
    id: 'cab-' + Date.now(),
    number: number.toString().trim(),
    title: title.trim(),
    floor: parseInt(floor, 10) || 1,
    category: category ? category.trim() : 'Жалпы бөлім',
    status: 'available',
    equipment: Array.isArray(equipment) ? equipment : [equipment || 'Жалпы жабдық'],
  };

  db.cabinets.push(newCab);
  saveDb(db);
  return res.status(201).json(newCab);
});

app.put('/api/cabinets/:id', (req: Request, res: Response): any => {
  const { id } = req.params;
  const { status, title, equipment } = req.body;

  const db = getDb();
  const cab = db.cabinets.find(c => c.id === id);
  if (!cab) {
    return res.status(404).json({ error: 'Кабинет табылмады' });
  }

  if (status) cab.status = status;
  if (title) cab.title = title;
  if (equipment) cab.equipment = equipment;

  saveDb(db);
  return res.json(cab);
});

app.delete('/api/cabinets/:id', (req: Request, res: Response): any => {
  const { id } = req.params;
  const db = getDb();
  const beforeCount = db.cabinets.length;
  db.cabinets = db.cabinets.filter(c => c.id !== id);

  if (db.cabinets.length === beforeCount) {
    return res.status(404).json({ error: 'Кабинет табылмады' });
  }

  saveDb(db);
  return res.json({ message: 'Кабинет өшірілді' });
});

// ==============================================================================
// 4. ҚАБЫЛДАУЛАР (APPOINTMENTS) API
// ==============================================================================

app.get('/api/appointments', (req: Request, res: Response): any => {
  const db = getDb();
  return res.json(db.appointments);
});

app.post('/api/appointments', (req: Request, res: Response): any => {
  const { patientId, patientName, patientPhone, patientIin, doctorId, doctorName, cabinetNumber, date, time, symptoms } = req.body;

  if (!patientName || !doctorName || !date || !time) {
    return res.status(400).json({ error: 'Қабылдаудың барлық міндетті деректерін толтырыңыз!' });
  }

  const db = getDb();
  const newApp = {
    id: 'app-' + Date.now(),
    patientId: patientId || 'usr-pat-anon',
    patientName,
    patientPhone: patientPhone || '+77000000000',
    patientIin: patientIin || '920415350124',
    doctorId,
    doctorName,
    cabinetNumber: cabinetNumber || '102',
    date,
    time,
    symptoms: symptoms || 'Дәрігерлік тексеру және консультация',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  db.appointments.unshift(newApp);

  // Автоматты SMS еске салғыш генерациялау
  const reminder = {
    id: 'rem-' + Date.now(),
    recipientName: patientName,
    recipientPhone: patientPhone,
    channel: 'SMS',
    title: 'Қабылдауға жазылу расталды',
    message: `Құрметті ${patientName}! Сіз ${date} күні сағат ${time}-де ${doctorName} (№${cabinetNumber || '102'} каб.) қабылдауына сәтті жазылдыңыз. Кешікпей келуіңізді сұраймыз.`,
    status: 'sent',
    sentAt: new Date().toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' }),
  };
  db.reminders.unshift(reminder);

  saveDb(db);
  return res.status(201).json({ appointment: newApp, reminder });
});

app.put('/api/appointments/:id/status', (req: Request, res: Response): any => {
  const { id } = req.params;
  const { status } = req.body;

  const db = getDb();
  const appItem = db.appointments.find(a => a.id === id);
  if (!appItem) {
    return res.status(404).json({ error: 'Қабылдау табылмады' });
  }

  appItem.status = status;
  saveDb(db);
  return res.json(appItem);
});

app.delete('/api/appointments/:id', (req: Request, res: Response): any => {
  const { id } = req.params;
  const db = getDb();
  db.appointments = db.appointments.filter(a => a.id !== id);
  saveDb(db);
  return res.json({ message: 'Қабылдау жойылды' });
});

// ==============================================================================
// 5. ДӘРІГЕРЛЕРДІҢ КАБИНЕТ БРОНДАРЫ API
// ==============================================================================

app.get('/api/bookings', (req: Request, res: Response): any => {
  const db = getDb();
  return res.json(db.bookings);
});

app.post('/api/bookings', (req: Request, res: Response): any => {
  const { cabinetId, cabinetNumber, doctorId, doctorName, date, startTime, endTime, purpose, needsSterilization } = req.body;

  const db = getDb();
  const cab = db.cabinets.find(c => c.id === cabinetId || c.number === cabinetNumber);
  if (cab) {
    cab.status = 'booked';
  }

  const newBooking = {
    id: 'book-' + Date.now(),
    cabinetId: cab ? cab.id : cabinetId,
    cabinetNumber: cab ? cab.number : cabinetNumber,
    doctorId,
    doctorName,
    date,
    startTime,
    endTime,
    purpose: purpose || 'Қабылдау жүргізу',
    needsSterilization: !!needsSterilization,
    createdAt: new Date().toISOString(),
  };

  db.bookings.unshift(newBooking);

  // SMS еске салғыш
  db.reminders.unshift({
    id: 'rem-' + Date.now(),
    recipientName: doctorName,
    recipientPhone: '+7 (701) 111-22-33',
    channel: 'SMS',
    title: 'Кабинет броны расталды',
    message: `Дәрігер ${doctorName}! №${newBooking.cabinetNumber} кабинет ${date} күні сағат ${startTime}-${endTime} аралығында брондалды.`,
    status: 'sent',
    sentAt: new Date().toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' }),
  });

  saveDb(db);
  return res.status(201).json(newBooking);
});

app.delete('/api/bookings/:id', (req: Request, res: Response): any => {
  const { id } = req.params;
  const db = getDb();
  const booking = db.bookings.find(b => b.id === id);
  if (booking) {
    const cab = db.cabinets.find(c => c.id === booking.cabinetId || c.number === booking.cabinetNumber);
    if (cab) cab.status = 'available';
    db.bookings = db.bookings.filter(b => b.id !== id);
    saveDb(db);
    return res.json({ message: 'Бронь босатылды' });
  }
  return res.status(404).json({ error: 'Бронь табылмады' });
});

// ==============================================================================
// 6. ЕСКЕ САЛҒЫШТАР (REMINDERS) API
// ==============================================================================

app.get('/api/reminders', (req: Request, res: Response): any => {
  const db = getDb();
  return res.json(db.reminders);
});

// ==============================================================================
// 7. VITE DEV ЖӘНЕ STATIC MIDDLEWARE ТЕҢШЕУІ
// ==============================================================================

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`MedCabinet Server running on http://0.0.0.0:${port}`);
  });
}

startServer();

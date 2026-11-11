import { DatabaseState, User } from './types';

export const DEMO_ACCOUNTS: User[] = [
  {
    id: 'user-patient',
    role: 'patient',
    name: 'Марат Жұмабаев',
    email: 'marat.patient@densaulyq.kz',
    phone: '+7 (775) 123-45-67',
    iin: '920415350124',
    insuranceNumber: 'KZ-998821',
    birthDate: '1992-04-15',
    bloodType: 'A(II) Rh+',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bio: 'Тіркелген науқас. Медициналық міндетті сақтандыру полисі (МӘМС): KZ-998821.'
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
    experience: '14 жыл',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
    bio: 'Кардиология бөлімінің меңгерушісі, медицина ғылымдарының кандидаты, функционалдық диагностика маманы.'
  },
  {
    id: 'user-admin',
    role: 'admin',
    name: 'Жақсылық Шыңғысхан',
    email: 'syngyszaksylyk854@gmail.com',
    phone: '+7 (777) 777-88-99',
    position: 'Клиника бас әкімшісі & Жүйе әзірлеушісі',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'MedCabinet басқару жүйесінің бас әкімшісі. Кабинеттер мен брондар қорын толық бақылаушы.'
  }
];

export const INITIAL_DATABASE: DatabaseState = {
  users: DEMO_ACCOUNTS,
  cabinets: [
    {
      id: 'cab-101',
      number: '101',
      title: 'Жалпы терапия және алғашқы қабылдау',
      floor: 1,
      category: 'Терапия',
      status: 'available',
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
      equipment: ['Операциялық үстел', 'Көлеңкесіз хирургиялық шам', 'Автоклав стерилизаторы', 'Электрокоагулятор']
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
      purpose: 'Жоспарлы кардиологиялық қабылдау мен функционалдық тексеру',
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
      userId: 'user-patient',
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
      userId: 'user-doctor',
      recipientName: 'Д-р Берік Ерболұлы',
      recipientPhone: '+7 (702) 555-12-34',
      channel: 'SMS',
      title: 'Кабинет брондауы расталды',
      message: 'Құрметті Д-р Берік Ерболұлы! Бүгінгі күнге №102 кабинет (09:00 - 14:00) қабылдауға сәтті бекітілді. Санитарлық кварцтау орындалды.',
      status: 'sent',
      sentAt: '08:45'
    }
  ]
};

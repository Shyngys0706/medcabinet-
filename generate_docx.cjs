const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle,
  PageBreak,
  Header,
  Footer,
  PageNumber
} = require('docx');
const fs = require('fs');

const FONT = 'Times New Roman';
const SIZE = 24; // 12pt in half-points
const LINE_SPACING = 276; // 1.15 line spacing
const INDENT = 709; // 1.25 cm in twips/dxa

// Helper for standard body paragraph
function p(text, options = {}) {
  const isCenter = options.align === 'center';
  const isRight = options.align === 'right';
  const noIndent = options.noIndent || isCenter || isRight;

  return new Paragraph({
    alignment: isCenter
      ? AlignmentType.CENTER
      : isRight
      ? AlignmentType.RIGHT
      : AlignmentType.JUSTIFIED,
    indent: noIndent ? undefined : { firstLine: INDENT },
    spacing: {
      line: LINE_SPACING,
      before: options.spaceBefore || 0,
      after: options.spaceAfter || 100
    },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: options.size || SIZE,
        bold: options.bold || false,
        italics: options.italics || false
      })
    ]
  });
}

// Helper for chapter heading (Centered, Bold, Uppercase, no indent)
function h1(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 180 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: SIZE,
        bold: true
      })
    ]
  });
}

// Helper for section heading (Left aligned, indent 1.25cm, Bold)
function h2(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    indent: { firstLine: INDENT },
    spacing: { before: 200, after: 120 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: SIZE,
        bold: true
      })
    ]
  });
}

// Helper for bullet items
function bullet(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { left: INDENT, hanging: 240 },
    spacing: { line: LINE_SPACING, before: 40, after: 60 },
    children: [
      new TextRun({
        text: '• ' + text,
        font: FONT,
        size: SIZE
      })
    ]
  });
}

// Borderless TOC row
function tocRow(title, pageNum, isBold = false) {
  const borderNone = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  const borders = {
    top: borderNone,
    bottom: borderNone,
    left: borderNone,
    right: borderNone
  };

  return new TableRow({
    children: [
      new TableCell({
        borders,
        width: { size: 8200, type: WidthType.DXA },
        children: [
          new Paragraph({
            spacing: { before: 40, after: 40, line: 240 },
            children: [
              new TextRun({
                text: title,
                font: FONT,
                size: SIZE,
                bold: isBold
              })
            ]
          })
        ]
      }),
      new TableCell({
        borders,
        width: { size: 1000, type: WidthType.DXA },
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 40, after: 40, line: 240 },
            children: [
              new TextRun({
                text: String(pageNum),
                font: FONT,
                size: SIZE,
                bold: isBold
              })
            ]
          })
        ]
      })
    ]
  });
}

// Helper for bordered table cells
function tableCell(text, isHeader = false, widthDxa = 3000) {
  return new TableCell({
    width: { size: widthDxa, type: WidthType.DXA },
    shading: isHeader ? { fill: 'F2F2F2' } : undefined,
    children: [
      new Paragraph({
        alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun({
            text,
            font: FONT,
            size: 22, // 11pt
            bold: isHeader
          })
        ]
      })
    ]
  });
}

async function createDocx() {
  const doc = new Document({
    sections: [
      // 1. ТИТУЛДЫҚ БЕТ (Section 1: No page numbers on cover page)
      {
        properties: {
          page: {
            margin: {
              top: 1134, // 20mm
              bottom: 1134, // 20mm
              left: 1701, // 30mm
              right: 567 // 10mm
            }
          }
        },
        children: [
          p('Қ. ЖҰБАНОВ АТЫНДАҒЫ АҚТӨБЕ ӨҢІРЛІК УНИВЕРСИТЕТІ', { align: 'center', bold: true, size: 26 }),
          p('ФИЗИКА - МАТЕМАТИКА ФАКУЛЬТЕТІ', { align: 'center', bold: true }),
          p('ИНФОРМАТИКА ЖӘНЕ АҚПАРАТТЫҚ ТЕХНОЛОГИЯЛАР КАФЕДРАСЫ', { align: 'center', bold: true }),

          p('', { spaceBefore: 600 }),
          p('«Қорғауға жіберілді»', { align: 'right', bold: true }),
          p('Кафедра меңгерушісі: _________ Ж.Қ. Убаева', { align: 'right' }),
          p('«____» _______________ 2026 ж.', { align: 'right' }),

          p('', { spaceBefore: 800 }),
          p('КУРСТЫҚ ЖҰМЫС', { align: 'center', bold: true, size: 32 }),
          p('', { spaceBefore: 200 }),
          p('Білім беру бағдарламасы: 6B06106 – «ІТ медицина»', { align: 'center' }),
          p('Пән: «Медицинадағы интернет технологиялар»', { align: 'center' }),
          p('', { spaceBefore: 200 }),
          p('Тақырыбы: «Медициналық кабинеттерді брондау веб-жүйесін құру»', { align: 'center', bold: true, size: 26 }),

          p('', { spaceBefore: 800 }),
          p('Орындаған:', { align: 'right', bold: true }),
          p('3-курс студенті: Жақсылық Шыңғысхан', { align: 'right' }),
          p('', { spaceBefore: 100 }),
          p('Ғылыми жетекшісі:', { align: 'right', bold: true }),
          p('аға оқытушы: ____________________', { align: 'right' }),

          p('', { spaceBefore: 1200 }),
          p('Ақтөбе 2026', { align: 'center', bold: true })
        ]
      },

      // 2. НЕГІЗГІ ҚҰЖАТ (Section 2: With page breaks and proper pagination)
      {
        properties: {
          page: {
            margin: {
              top: 1134, // 20mm
              bottom: 1134, // 20mm
              left: 1701, // 30mm
              right: 567 // 10mm
            },
            pageNumbers: {
              start: 2
            }
          }
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: FONT,
                    size: 20
                  })
                ]
              })
            ]
          })
        },
        children: [
          // ================= МАЗМҰНЫ =================
          h1('МАЗМҰНЫ'),
          new Paragraph({ spacing: { after: 120 } }),

          new Table({
            width: { size: 9200, type: WidthType.DXA },
            rows: [
              tocRow('КІРІСПЕ', 3, true),
              tocRow('1. ЖАЛПЫ БӨЛІМ (ТЕОРИЯЛЫҚ НЕГІЗДЕРІ)', 5, true),
              tocRow('   1.1 Есептің қойылуы, пәндік саланы сипаттау және талдау', 5),
              tocRow('   1.2 Сайтты құру кезеңдері, қолданылатын веб-технологиялар және олардың мінездемесі', 7),
              tocRow('   1.3 Деректер қорын концептуалды және логикалық модельдеу (ER-диаграмма)', 10),
              tocRow('2. АРНАЙЫ БӨЛІМ (ПРАКТИКАЛЫҚ БӨЛІМ)', 13, true),
              tocRow('   2.1 Есептің алгоритмін құру және оның сипаттамасы', 13),
              tocRow('   2.2 «MedCabinet» веб-қосымшасының құрылымы және интерфейсі', 15),
              tocRow('   2.3 Пайдаланушылардың 3 демо аккаунты және жүйелік функционал', 18),
              tocRow('   2.4 Программалық кодтың орындалуына түсініктеме және тестілеу нәтижелері', 20),
              tocRow('ҚОРЫТЫНДЫ', 22, true),
              tocRow('ПАЙДАЛАНЫЛҒАН ӘДЕБИЕТТЕР ТІЗІМІ', 24, true),
              tocRow('ҚОСЫМША А. Бағдарламаның негізгі бастапқы коды (Листинг)', 25, true)
            ]
          }),

          // НАҚТЫ РАЗРЫВ СТРАНИЦЫ (PAGE BREAK)
          new Paragraph({ children: [new PageBreak()] }),

          // ================= КІРІСПЕ =================
          h1('КІРІСПЕ'),
          p('Тақырыптың өзектілігі. Қазіргі таңда денсаулық сақтау саласын цифрландыру және ақпараттық технологияларды медициналық мекемелердің күнделікті жұмыс процесіне енгізу мемлекеттік саясаттың басым бағыттарының бірі болып табылады. Емханалар мен ауруханалардағы емдеу-диагностикалық кабинеттердің жүктемесін дұрыс бөлу, дәрігерлердің қабылдау кестесін жүйелеу және науқастардың уақытын тиімді пайдалану — медициналық қызмет көрсету сапасын арттырудың шешуші факторы. Дәстүрлі қағазбастылық пен кезек күту мәселелері пациенттердің ғана емес, медициналық персоналдың да жұмысын қиындатады. Осыған байланысты медициналық кабинеттерді онлайн брондауға, дәрігерлер мен пациенттер арасындағы өзара байланысты автоматтандыруға және ресми электрондық қабылдау талондарын қалыптастыруға мүмкіндік беретін заманауи жеңіл әрі дербес веб-жүйелерді әзірлеу өте өзекті ғылыми-тәжірибелік мәселе болып саналады.'),
          p('Зерттеу мақсаты. Медициналық мекемелердегі кабинеттер қорын тиімді басқаруға, дәрігерлерге кабинеттерді брондауға және пациенттерге дәрігер қабылдауына онлайн жазылуға арналған дербес (серверге тәуелсіз, браузерде тікелей ашылатын) «MedCabinet» веб-қосымшасын жобалау және құру.'),
          p('Зерттеу объектісі. Емдеу-алдын алу мекемелеріндегі медициналық кабинеттердің қолжетімділігін реттеу, брондау және науқастарды қабылдауға жазу процестері.'),
          p('Зерттеу пәні. Медициналық кабинеттерді брондау веб-қосымшасын құруда қолданылатын интернет-технологиялар: HTML5, CSS3, таза JavaScript (ES6) және браузердің жергілікті деректер қоры (LocalStorage).'),
          p('Зерттеу міндеттері:'),
          bullet('Медициналық мекемелерде кабинеттерді басқару мен пациенттерді қабылдау процестерін талдау және пәндік саланың ақпараттық қажеттіліктерін анықтау;'),
          bullet('Деректер қорының концептуалды және инфологиялық моделін (ER-диаграммасын) құрастыру;'),
          bullet('Клиенттік веб-технологиялар (HTML5, CSS3, JavaScript) негізінде ыңғайлы, бейімделгіш (responsive) интерфейс пен жұмыс алгоритмін әзірлеу;'),
          bullet('Жүйеге қатаң рөлдік қолжетімділік негізінде 3 нақты демо аккаунтты (Пациент, Дәрігер, Әкімші) енгізу және олардың арасында 1 басумен жылдам ауысуды жүзеге асыру;'),
          bullet('Кабинеттердің санитарлық кварцтау сұранысын, SMS/WhatsApp еске салғыштарын және баспаға арналған штрих-кодты ресми қабылдау талонын генерациялауды жасау;'),
          bullet('Қосымшаны күрделі серверсіз, кез келген дербес компьютерде index.html файлын басу арқылы тікелей ашылатын етіп оңтайландыру және тестілеу.'),
          p('Зерттеудің жаңалығы мен практикалық құндылығы. Әзірленген «MedCabinet» веб-қосымшасы күрделі сыртқы серверлерді (backend/Node.js/деректер қоры серверлерін) орнатуды талап етпейді. Ол браузердің LocalStorage технологиясы арқылы деректер тұрақтылығын қамтамасыз етеді және офлайн режимде тікелей жұмыс істейді. Жүйеде нақты 3 демо аккаунт (Марат Жұмабаев — пациент, Д-р Берік Ерболұлы — кардиолог, Жақсылық Шыңғысхан — әкімші) арқылы көп рөлдік архитектура қарастырылған. Жобаны емханалардың ішкі жұмысында, оқу процесінде және дәрігерлік кабинеттерді жедел бөлуде кеңінен қолдануға болады.'),

          // НАҚТЫ РАЗРЫВ СТРАНИЦЫ (PAGE BREAK)
          new Paragraph({ children: [new PageBreak()] }),

          // ================= 1. ЖАЛПЫ БӨЛІМ =================
          h1('1. ЖАЛПЫ БӨЛІМ (ТЕОРИЯЛЫҚ НЕГІЗДЕРІ)'),
          h2('1.1 Есептің қойылуы, пәндік саланы сипаттау және талдау'),
          p('Қазіргі заманғы медициналық орталықтар көпсалалы диагностикалық және емдеу аппаратураларымен жабдықталған ондаған кабинеттерден тұрады. Бір кабинетте ауысым бойынша бірнеше дәрігер (терапевт, кардиолог, эндокринолог, УЗИ маманы және т.б.) қызмет көрсетуі мүмкін. Сонымен қатар, медициналық санитарлық ережелерге сәйкес, хирургиялық немесе кардиологиялық тексеруден кейін кабинеттерге кварцтау (ультракүлгін сәулемен залалсыздандыру) және дезинфекция жүргізілуі міндетті.'),
          p('Дәстүрлі тәсілде кабинеттердің бос немесе бос еместігі қағаз журналдар немесе медбикелердің ауызша келісімі арқылы реттеледі. Бұл келесідей өзекті кемшіліктерге әкеледі:'),
          bullet('Кабинеттердің бір уақытта екі маманға қабаттасып брондалып қалу қаупі (коллизия);'),
          bullet('Науқастардың дәрігер қабылдауына жазылу уақыты мен кабинет нөмірін шатастыруы;'),
          bullet('Санитарлық өңдеу уақытының ескерілмеуінен емделушілердің дәлізде ұзақ уақыт кезекте тұруы;'),
          bullet('Клиника әкімшілігінің кабинеттер жүктемесіне жедел статистикалық бақылау жасай алмауы.'),
          p('Осыған орай, қойылған міндет — кабинеттер каталогын көрнекі түрде көрсететін, қабаттар мен жабдықтар бойынша іздеуді қамтамасыз ететін, дәрігерге қажетті уақытқа кабинетті бекітуге мүмкіндік беретін және пациентке штрих-коды бар электрондық талон беретін веб-жүйе әзірлеу болып табылады.'),

          h2('1.2 Сайтты құру кезеңдері, қолданылатын веб-технологиялар және олардың мінездемесі'),
          p('Курстық жобаны әзірлеу келесі негізгі кезеңдерден тұрды: талдау және талаптарды қалыптастыру; ақпараттық модельдеу; UI/UX интерфейсті жобалау; бағдарламалау және тестілеу.'),
          p('Жүйені құруда келесі базалық технологиялар қолданылды:'),
          bullet('HTML5 (HyperText Markup Language 5) — веб-қосымшаның семантикалық қаңқасын құрайды. <header>, <nav>, <main>, <section> семантикалық тегтері арқылы құрылым реттелді.'),
          bullet('CSS3 (Cascading Style Sheets 3) — заманауи минималистік медициналық визуалды дизайн жасау үшін пайдаланылды. Flexbox, Grid жүйесі және @media print ережесі қолданылды.'),
          bullet('JavaScript (ECMAScript 6+) — қосымшаның барлық динамикалық логикасын, оқиғаларын (Event Listeners), модальді терезелерін және іздеу алгоритмдерін жүзеге асырды.'),
          bullet('Web Storage API (LocalStorage) — клиенттік браузердің тұрақты жады. Серверсіз барлық енгізілген мәліметтердің (брондар, жазылулар, жаңа кабинеттер) сақталуын қамтамасыз етеді.'),

          h2('1.3 Деректер қорын концептуалды және логикалық модельдеу (ER-диаграмма)'),
          p('Жүйенің деректер қоры инфологиялық модель түрінде құрастырылды. Басты нысандар (субъектілер): Пайдаланушылар (Users), Кабинеттер (Cabinets), Брондар (Bookings), Қабылдаулар (Appointments) және Еске салғыштар (Reminders).'),

          p('1-кесте. «MedCabinet» жүйесінің концептуалды деректер құрылымы', { align: 'center', bold: true }),
          new Table({
            width: { size: 9200, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  tableCell('Кесте атауы', true, 2200),
                  tableCell('Негізгі атрибуттары', true, 4000),
                  tableCell('Сипаттамасы', true, 3000)
                ]
              }),
              new TableRow({
                children: [
                  tableCell('Users', false, 2200),
                  tableCell('id, role, name, email, phone, avatar, bio, specialty, iin, insurance', false, 4000),
                  tableCell('3 демо аккаунт: Пациент, Дәрігер, Әкімші', false, 3000)
                ]
              }),
              new TableRow({
                children: [
                  tableCell('Cabinets', false, 2200),
                  tableCell('id, number, title, floor, category, status, equipment', false, 4000),
                  tableCell('Кабинеттер каталогы және жабдықтары', false, 3000)
                ]
              }),
              new TableRow({
                children: [
                  tableCell('Bookings', false, 2200),
                  tableCell('id, cabinetId, doctorId, date, startTime, endTime, purpose, needsSterilization', false, 4000),
                  tableCell('Дәрігерлердің кабинетті брондауы', false, 3000)
                ]
              }),
              new TableRow({
                children: [
                  tableCell('Appointments', false, 2200),
                  tableCell('id, patientId, doctorId, cabinetNumber, date, time, symptoms, status', false, 4000),
                  tableCell('Науқастардың дәрігерге жазылуы', false, 3000)
                ]
              }),
              new TableRow({
                children: [
                  tableCell('Reminders', false, 2200),
                  tableCell('id, recipientName, recipientPhone, channel, message, sentAt, status', false, 4000),
                  tableCell('Автоматты SMS/WhatsApp хабарламалары', false, 3000)
                ]
              })
            ]
          }),

          // НАҚТЫ РАЗРЫВ СТРАНИЦЫ (PAGE BREAK)
          new Paragraph({ children: [new PageBreak()] }),

          // ================= 2. АРНАЙЫ БӨЛІМ =================
          h1('2. АРНАЙЫ БӨЛІМ (ПРАКТИКАЛЫҚ БӨЛІМ)'),
          h2('2.1 Есептің алгоритмін құру және оның сипаттамасы'),
          p('Қосымшаның жұмыс алгоритмі пайдаланушының таңдалған рөліне (Пациент, Дәрігер, Әкімші) тікелей байланысты тармақталады. Жүйенің жалпы жұмыс циклі келесі қадамдар бойынша орындалады:'),
          bullet('index.html файлы ашылған кезде LocalStorage жадынан деректер оқылады. Егер жад бос болса, автоматты түрде бастапқы 3 таза демо аккаунт базасы енгізіледі;'),
          bullet('Ағымдағы белсенді пайдаланушы анықталып, рөлге тән батырмалар мен қолжетімділік деңгейі белсендіріледі;'),
          bullet('Пациент қабылдауға жазылғанда, оның мәліметтері Appointments кестесіне түсіп, ресми талон генерацияланады және SMS ескертпе жіберіледі;'),
          bullet('Дәрігер кабинет брондағанда, кабинет күйі «Брондалған» күйіне ауысып, медбикеге санитарлық тазалау тапсырмасы белгіленеді;'),
          bullet('Әкімші жаңа кабинеттер қосады, күйлерін өзгертеді немесе бүкіл базаны JSON файлы ретінде экспорттайды.'),

          h2('2.2 «MedCabinet» веб-қосымшасының құрылымы және интерфейсі'),
          p('Веб-қосымша бір беттік қолданба (Single Page Application — SPA) қағидасы бойынша таза HTML5, CSS3 және JavaScript негізінде жасалған. Интерфейс құрылымы келесі негізгі блоктарды қамтиды:'),
          bullet('Жоғарғы авторлық жолақ (Top Creator Bar) — Жоба авторы Жақсылық Шыңғысхан туралы ақпаратты және жүйенің серверсіз LocalStorage арқылы жұмыс істейтіндігін көрсетеді;'),
          bullet('Негізгі навигациялық Header — Логотип, бөлімдер арасында ауысу батырмалары («Кабинеттер каталогы», «Менің брондарым», «Еске салғыштар»), белсенді пайдаланушы профилі және JSON сақтау батырмасы;'),
          bullet('3 Демо Аккаунт ауыстырғыш панелі (Role Quick Bar) — Бір рет басу арқылы Пациент, Дәрігер немесе Әкімші режиміне бірден қайта құрылады;'),
          bullet('Индикативтік статистика блогы — Жалпы кабинеттер саны, бос кабинеттер, брондалған кабинеттер және тіркелген қабылдаулар санын көрсететін 4 карточка;'),
          bullet('Интерактивті сүзгі жолағы — Іздеу жолы (Search Box) және қабаттар бойынша жедел сүзгілеу (Барлығы, 1-4 қабат);'),
          bullet('Кабинеттер каталогының карточкалары — Әр кабинеттің нөмірі, қабаты, бөлімі, атауы, аппаратуралары және ағымдағы жұмыс күйі (Бос, Брондалған, Санитарлық өңдеуде, Жөндеуде).'),

          h2('2.3 Пайдаланушылардың 3 демо аккаунты және жүйелік функционал'),
          p('Тапсырма талаптарына сәйкес жүйеден барлық артық аккаунттар тазартылып, тек 3 нақты демо аккаунт бекітілген:'),
          p('1. Науқас (Пациент) — Марат Жұмабаев:', { bold: true }),
          p('Жеке деректері: ЖСН: 920415350124, МӘМС сақтандыру полисі: KZ-998821, телефон: +7 (775) 123-45-67. Функционалы: Бос кабинеттер бойынша дәрігерге (Д-р Берік Ерболұлы) қабылдауға жазылу. Жазылған соң ресми «Қабылдау талонын» қағазға басып шығару (Print) және SMS хабарламаларды қарау.'),
          p('2. Дәрігер — Д-р Берік Ерболұлы:', { bold: true }),
          p('Жеке деректері: Жоғары санатты кардиолог-терапевт (М.ғ.к.), бекітілген №102 кабинет, телефон: +7 (702) 555-12-34. Функционалы: Кабинетті қабылдау уақытына брондау және «Санитарлық кварцтау» қажеттілігін белгілеу; кабинетті қабылдау біткен соң босату; өзіне жазылған науқастардың (Марат Жұмабаев) тізімін көру және «Қабылданды ✓» деп белгілеу.'),
          p('3. Әкімші (Админ) — Жақсылық Шыңғысхан:', { bold: true }),
          p('Жеке деректері: Клиника бас әкімшісі & жүйе әзірлеушісі, телефон: +7 (777) 777-88-99. Функционалы: Жүйені толық бақылау; кез келген кабинеттің күйін өзгерту (Бос ↔ Брондалған ↔ Санитарлық тазалау ↔ Жөндеу); жаңа кабинеттер қосу немесе қажетсіздерін өшіру; клиникадағы барлық жазбаларды басқару; базаны JSON форматында компьютерге сақтау немесе бастапқы 3 демо аккаунт күйіне қайтару.'),

          h2('2.4 Программалық кодтың орындалуына түсініктеме және тестілеу нәтижелері'),
          p('Жүйенің негізгі логикасы app.js файлында модульдік түрде орындалған:'),
          bullet('LocalStorage-пен жұмыс модулі — getDatabase() және saveDatabase(db) функциялары арқылы деректерді JSON форматына түрлендіріп, жергілікті жадқа жазады;'),
          bullet('Рөлдерді ауыстыру модулі — switchUserRole(role) функциясы арқылы бет қайта жүктелмей (No page reload) жедел орындалады;'),
          bullet('Қабылдау талонын басып шығару модулі — printPass(appId) функциясы арқылы ресми талон қалыптасады (пациент аты-жөні, ЖСН, емхана мөрі, штрих-код) және window.print() арқылы қағазға шығарылады.'),

          p('2-кесте. «MedCabinet» веб-қосымшасын тестілеу нәтижелері', { align: 'center', bold: true }),
          new Table({
            width: { size: 9200, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  tableCell('Тестіленетін функция', true, 2500),
                  tableCell('Күтілетін нәтиже', true, 3000),
                  tableCell('Нақты нәтиже', true, 2500),
                  tableCell('Қорытынды', true, 1200)
                ]
              }),
              new TableRow({
                children: [
                  tableCell('index.html файлын қос басу арқылы ашу', false, 2500),
                  tableCell('Браузерде серверсіз, тікелей 100% ашылуы', false, 3000),
                  tableCell('Chrome, Edge, Safari-де қатесіз ашылды', false, 2500),
                  tableCell('Сәтті', false, 1200)
                ]
              }),
              new TableRow({
                children: [
                  tableCell('3 Демо аккаунт арасында ауысу', false, 2500),
                  tableCell('Пациент, дәрігер және әкімші рөлдерінің бірден өзгеруі', false, 3000),
                  tableCell('Интерфейс бірден жаңартылды', false, 2500),
                  tableCell('Сәтті', false, 1200)
                ]
              }),
              new TableRow({
                children: [
                  tableCell('Кабинетті брондау және босату', false, 2500),
                  tableCell('Күйінің «Брондалғанға» ауысуы және босатылуы', false, 3000),
                  tableCell('Базада және экранда жедел өзгерді', false, 2500),
                  tableCell('Сәтті', false, 1200)
                ]
              }),
              new TableRow({
                children: [
                  tableCell('Қабылдау талонын басып шығару', false, 2500),
                  tableCell('Штрих-код пен мөрі бар талонның қағазға шығуы', false, 3000),
                  tableCell('Баспа диалогы қатесіз ашылды', false, 2500),
                  tableCell('Сәтті', false, 1200)
                ]
              }),
              new TableRow({
                children: [
                  tableCell('Мәліметтерді JSON түрінде экспорттау', false, 2500),
                  tableCell('Компьютерге .json файлының жүктелуі', false, 3000),
                  tableCell('Файл компьютерге толық жүктелді', false, 2500),
                  tableCell('Сәтті', false, 1200)
                ]
              })
            ]
          }),

          // НАҚТЫ РАЗРЫВ СТРАНИЦЫ (PAGE BREAK)
          new Paragraph({ children: [new PageBreak()] }),

          // ================= ҚОРЫТЫНДЫ =================
          h1('ҚОРЫТЫНДЫ'),
          p('«Медицинадағы интернет технологиялар» пәні бойынша орындалған курстық жұмыс шеңберінде медициналық кабинеттер қорын тиімді басқаруға, брондауға және дәрігерге қабылдауға жазылуға арналған «MedCabinet» дербес веб-жүйесі толықтай жобаланып, практикалық тұрғыда жүзеге асырылды.'),
          p('Жұмысты орындау барысында келесі нәтижелерге қол жеткізілді:'),
          bullet('Медициналық мекемелердің жұмыс ерекшеліктері зерделеніп, кабинеттердің брондалуы мен санитарлық өңделу процестері толық автоматтандырылды;'),
          bullet('HTML5, CSS3 және таза JavaScript (ES6) негізінде ешқандай сыртқы фреймворктерге тәуелсіз, заманауи жеңіл медициналық интерфейс құрылды;'),
          bullet('Қосымша 100% жергілікті (локальды) режимде жұмыс істейтіндей етіп жасалды. Пайдаланушы немесе оқытушы index.html файлын тінтуірмен екі рет басқанда, жүйе кез келген браузерде серверсіз бірден ашылады;'),
          bullet('Тапсырма талаптарына сай барлық артық аккаунттар тазартылып, нақты 3 демо аккаунт (Марат Жұмабаев — пациент, Д-р Берік Ерболұлы — дәрігер, Жақсылық Шыңғысхан — әкімші) бекітілді және жоғарғы панельде 1 басу арқылы олардың арасында ауысу мүмкіндігі жасалды;'),
          bullet('Қабылдауға жазылған пациенттерге ресми мөрі мен штрих-коды бар медициналық талонды басып шығару (Print) функционалы және автоматты SMS/WhatsApp хабарламаларының тікелей симуляциясы қосылды;'),
          bullet('Мәліметтер базасының қауіпсіздігі үшін кез келген уақытта бүкіл деректерді JSON файлы ретінде компьютерге сақтау немесе «Базаны жаңарту» батырмасы арқылы бастапқы қалпына келтіру тетігі қарастырылды.'),
          p('Ұсыныстар: Болашақта бұл веб-қосымшаны емханалардың жалпы МӘМС бірыңғай мемлекеттік ақпараттық жүйелерімен байланыстыруға және нақты SMS-шлюздерін қосу арқылы науқастардың телефондарына тікелей нақты SMS жолдауға мүмкіндік бар.'),

          // НАҚТЫ РАЗРЫВ СТРАНИЦЫ (PAGE BREAK)
          new Paragraph({ children: [new PageBreak()] }),

          // ================= ӘДЕБИЕТТЕР ТІЗІМІ =================
          h1('ПАЙДАЛАНЫЛҒАН ӘДЕБИЕТТЕР ТІЗІМІ'),
          p('1. Айзекс С. Dynamic HTML. Секреты создания интерактивных Web-страниц. — М.: Издательский дом «Вильямс», 2008. — 496 с.', { noIndent: true }),
          p('2. Айзенменгер Р. HTML 3.2/4.0. Справочник. — М.: Бином, 2008. — 384 с.', { noIndent: true }),
          p('3. Бөрібаев Б., Мадьярова Г.А. WEB-технологиялар: оқулық. — Алматы: ЖШС РПБК «Дәуір», 2011. — 360 б.', { noIndent: true }),
          p('4. Глушаков С.В., Жакин И.А., Хачиров Т.С. Программирование Web-страниц. JavaScript. VBScript. — М.: АСТ, 2010. — 390 с.', { noIndent: true }),
          p('5. Флэнаган Д. JavaScript. Подробное руководство, 6-е издание. — СПб.: Символ-Плюс, 2012. — 1080 с.', { noIndent: true }),
          p('6. Duckett Jon. HTML and CSS: Design and Build Websites. — Indianapolis: John Wiley & Sons, 2011. — 490 p.', { noIndent: true }),
          p('7. Chisholm W., May M. Universal Design for Web Applications. — Sebastopol: O\'Reilly Media, 2008. — 200 p.', { noIndent: true }),
          p('8. Дюпуи С., Квигли Э. JavaScript. Экспрес-курс. — М.: БХВ-Петербург, 2015. — 416 с.', { noIndent: true }),
          p('9. Қазақстан Республикасының «Халық денсаулығы және денсаулық сақтау жүйесі туралы» Кодексі. — Астана: Ақорда, 2020.', { noIndent: true }),
          p('10. MDN Web Docs. Web Storage API (LocalStorage and SessionStorage) [Электрондық ресурс]. — Қолжетімділік тәртібі: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API', { noIndent: true }),

          // НАҚТЫ РАЗРЫВ СТРАНИЦЫ (PAGE BREAK)
          new Paragraph({ children: [new PageBreak()] }),

          // ================= ҚОСЫМША А =================
          h1('ҚОСЫМША А'),
          p('«MedCabinet» бағдарламалық қосымшасының негізгі бастапқы коды (Листинг)', { align: 'center', bold: true }),
          p('А.1 app.js файлы — 3 демо аккаунттың инициализациясы мен рөлдерді ауыстыру функциясы:', { bold: true }),
          p(`const DB_KEY = 'medcabinet_3demo_standalone_db';
const SESSION_KEY = 'medcabinet_3demo_standalone_session';

const DEFAULT_DATABASE = {
  users: [
    {
      id: 'user-admin',
      role: 'admin',
      name: 'Жақсылық Шыңғысхан',
      email: 'syngyszaksylyk854@gmail.com',
      phone: '+7 (777) 777-88-99',
      position: 'Клиника бас әкімшісі & Жүйе әзірлеушісі'
    },
    {
      id: 'user-doctor',
      role: 'doctor',
      name: 'Д-р Берік Ерболұлы',
      email: 'berik.doctor@densaulyq.kz',
      phone: '+7 (702) 555-12-34',
      specialty: 'Кардиолог-терапевт (Жоғары санат, М.ғ.к.)',
      assignedCabinet: '102'
    },
    {
      id: 'user-patient',
      role: 'patient',
      name: 'Марат Жұмабаев',
      email: 'marat.patient@densaulyq.kz',
      phone: '+7 (775) 123-45-67',
      iin: '920415350124',
      insurance: 'KZ-998821'
    }
  ]
};

function switchUserRole(role) {
  const db = getDatabase();
  const targetUser = db.users.find(u => u.role === role);
  if (targetUser) {
    setCurrentUser(targetUser);
    showToast('Аккаунт ауыстырылды', 'Қазіргі аккаунт: ' + targetUser.name, 'info');
    renderApp();
  }
}`, { noIndent: true }),
          p('', { spaceBefore: 120 }),
          p('А.2 Қабылдау талонын басып шығару (Print) логикасы:', { bold: true }),
          p(`function printPass(appId) {
  const db = getDatabase();
  const app = db.appointments.find(a => a.id === appId);
  if (!app) return;

  const printArea = document.getElementById('print-pass-area');
  printArea.innerHTML = \`
    <div style="border: 2px dashed #0d9488; padding: 24px; border-radius: 14px;">
      <h2>MedCabinet — Ресми Қабылдау Талоны</h2>
      <div><strong>Науқас:</strong> \${app.patientName}</div>
      <div><strong>ЖСН:</strong> \${app.patientIin || '920415350124'}</div>
      <div><strong>Дәрігер:</strong> \${app.doctorName}</div>
      <div><strong>Кабинет:</strong> №\${app.cabinetNumber}</div>
      <div><strong>Күні мен уақыты:</strong> \${app.date} сағат \${app.time}</div>
      <div><strong>Шағымы:</strong> «\${app.symptoms}»</div>
    </div>
  \`;
  window.print();
}`, { noIndent: true })
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('kurstyk_zhumys_teoriya.docx', buffer);
  console.log('kurstyk_zhumys_teoriya.docx successfully created!');
}

createDocx().catch(err => {
  console.error('Error generating docx:', err);
  process.exit(1);
});

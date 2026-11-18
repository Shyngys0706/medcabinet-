import React, { useState } from 'react';
import { X, Download, BookOpen, Printer } from 'lucide-react';

interface CourseworkViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FigureBlock: React.FC<{ src: string; num: string; caption: string }> = ({ src, num, caption }) => (
  <figure className="my-5 flex flex-col items-center">
    <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-slate-50 p-2 shadow-xs overflow-hidden">
      <img src={src} alt={caption} className="w-full h-auto rounded-lg" />
    </div>
    <figcaption className="mt-2 text-center text-xs sm:text-sm font-bold text-slate-800">
      {num}-сурет – {caption}
    </figcaption>
  </figure>
);

export const CourseworkViewerModal: React.FC<CourseworkViewerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'intro' | 'chap1' | 'chap2' | 'conclusion' | 'biblio' | 'appendix'>('all');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight flex items-center gap-2">
                <span>Курстық жұмыс: Теориялық құжат (25 бет · 9 сурет)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-normal">
                  Қ.Жұбанов атындағы АӨУ
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Орындаған: <strong className="text-teal-300">Жақсылық Шыңғысхан</strong> · Жетекші: <strong className="text-slate-200">Ташимова А.К.</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/kurstyk_zhumys_teoriya.docx"
              download="Жақсылық_Шыңғысхан_Курстық_жұмыс.docx"
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title="Суреттерімен бірге 25 беттік Word (.docx) құжатын жүктеу"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Word (.docx) жүктеу</span>
            </a>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition hidden sm:flex items-center gap-1.5"
              title="Баспаға шығару"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Баспа</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="bg-slate-100 px-5 py-2 border-b border-slate-200 flex flex-wrap gap-1.5 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-lg font-medium transition ${activeTab === 'all' ? 'bg-teal-700 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'}`}
          >
            Барлық бөлімдер (25 бет)
          </button>
          <button
            onClick={() => setActiveTab('intro')}
            className={`px-3 py-1 rounded-lg font-medium transition ${activeTab === 'intro' ? 'bg-teal-700 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'}`}
          >
            Кіріспе
          </button>
          <button
            onClick={() => setActiveTab('chap1')}
            className={`px-3 py-1 rounded-lg font-medium transition ${activeTab === 'chap1' ? 'bg-teal-700 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'}`}
          >
            1. Жалпы бөлім
          </button>
          <button
            onClick={() => setActiveTab('chap2')}
            className={`px-3 py-1 rounded-lg font-medium transition ${activeTab === 'chap2' ? 'bg-teal-700 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'}`}
          >
            2. Арнайы бөлім (Суреттер)
          </button>
          <button
            onClick={() => setActiveTab('conclusion')}
            className={`px-3 py-1 rounded-lg font-medium transition ${activeTab === 'conclusion' ? 'bg-teal-700 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'}`}
          >
            Қорытынды
          </button>
          <button
            onClick={() => setActiveTab('biblio')}
            className={`px-3 py-1 rounded-lg font-medium transition ${activeTab === 'biblio' ? 'bg-teal-700 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'}`}
          >
            Әдебиеттер (21)
          </button>
          <button
            onClick={() => setActiveTab('appendix')}
            className={`px-3 py-1 rounded-lg font-medium transition ${activeTab === 'appendix' ? 'bg-teal-700 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'}`}
          >
            Қосымша А (Код)
          </button>
        </div>

        {/* Paper Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200/60 font-serif leading-relaxed text-slate-900 text-sm sm:text-base">
          <div className="max-w-3xl mx-auto bg-white p-6 sm:p-12 shadow-md rounded-xl border border-slate-300 space-y-6">

            {/* 1. ТИТУЛДЫҚ БЕТ */}
            {(activeTab === 'all' || activeTab === 'intro') && (
              <div className="text-center border-b pb-8 mb-8 space-y-3 font-serif">
                <p className="font-bold text-xs sm:text-sm tracking-wide">
                  ҚАЗАҚСТАН РЕСПУБЛИКАСЫ ҒЫЛЫМ ЖӘНЕ ЖОҒАРЫ БІЛІМ МИНИСТРЛІГІ<br />
                  Қ. ЖҰБАНОВ АТЫНДАҒЫ АҚТӨБЕ ӨҢІРЛІК УНИВЕРСИТЕТІ<br />
                  ФИЗИКА-МАТЕМАТИКА ФАКУЛЬТЕТІ<br />
                  ИНФОРМАТИКА ЖӘНЕ АҚПАРАТТЫҚ ТЕХНОЛОГИЯЛАР КАФЕДРАСЫ
                </p>
                <div className="pt-4 text-right text-xs">
                  <p className="font-bold">«Қорғауға жіберілді»</p>
                  <p>Кафедра меңгерушісі: _________ Ж.Қ. Убаева</p>
                  <p>«____» _______________ 2026 ж.</p>
                </div>
                <div className="py-8">
                  <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-900">
                    КУРСТЫҚ ЖҰМЫС
                  </h1>
                  <p className="text-xs sm:text-sm mt-2">
                    <strong>Білім беру бағдарламасы:</strong> 6B06106 – «ІТ медицина»<br />
                    <strong>Пән:</strong> «Медицинадағы интернет технологиялар»
                  </p>
                  <h2 className="text-base sm:text-lg font-bold text-teal-900 mt-4 px-4 py-2 bg-teal-50 rounded-lg inline-block">
                    Тақырыбы: «Медициналық клиникаға арналған веб-ақпараттық жүйе құру»<br />
                    <span className="text-xs font-normal italic">(Кабинеттерді брондау және дәрігерге жазылу веб-жүйесі — «MedCabinet»)</span>
                  </h2>
                </div>
                <div className="text-right text-xs sm:text-sm pt-4 space-y-1">
                  <p><strong>Орындады:</strong> 3-курс студенті Жақсылық Шыңғысхан</p>
                  <p><strong>Ғылыми жетекшісі:</strong> аға оқытушы Ташимова А.К.</p>
                </div>
                <div className="pt-10 font-bold text-xs sm:text-sm">
                  Ақтөбе 2026
                </div>
              </div>
            )}

            {/* 2. МАЗМҰНЫ */}
            {activeTab === 'all' && (
              <div className="border-b pb-8 space-y-3">
                <h2 className="text-center font-bold text-lg uppercase tracking-wide">МАЗМҰНЫ</h2>
                <div className="text-xs sm:text-sm space-y-1.5 text-slate-800">
                  <div className="flex justify-between border-b border-dotted pb-1">
                    <span className="font-bold">КІРІСПЕ</span>
                    <span>3</span>
                  </div>
                  <div className="flex justify-between border-b border-dotted pb-1">
                    <span className="font-bold">1 ЖАЛПЫ БӨЛІМ</span>
                    <span>5</span>
                  </div>
                  <div className="flex justify-between pl-4 text-slate-600">
                    <span>1.1 Есептің қойылуы</span>
                    <span>5</span>
                  </div>
                  <div className="flex justify-between pl-4 text-slate-600">
                    <span>1.2 Сайтты құру кезеңдері, қолданылатын веб-технологиялар және пайдаланылатын программалау тілі мінездемесі</span>
                    <span>7</span>
                  </div>
                  <div className="flex justify-between border-b border-dotted pb-1">
                    <span className="font-bold">2 АРНАЙЫ БӨЛІМ</span>
                    <span>11</span>
                  </div>
                  <div className="flex justify-between pl-4 text-slate-600">
                    <span>2.1 Есептің алгоритмін құру және оның сипаттамасы</span>
                    <span>11</span>
                  </div>
                  <div className="flex justify-between pl-4 text-slate-600">
                    <span>2.2 Программа</span>
                    <span>14</span>
                  </div>
                  <div className="flex justify-between pl-4 text-slate-600">
                    <span>2.3 Программаның орындалуына арналған түсініктеме</span>
                    <span>16</span>
                  </div>
                  <div className="flex justify-between border-b border-dotted pb-1">
                    <span className="font-bold">ҚОРЫТЫНДЫ</span>
                    <span>20</span>
                  </div>
                  <div className="flex justify-between border-b border-dotted pb-1">
                    <span className="font-bold">ҚОЛДАНЫЛҒАН ӘДЕБИЕТТЕР ТІЗІМІ</span>
                    <span>22</span>
                  </div>
                  <div className="flex justify-between border-b border-dotted pb-1">
                    <span className="font-bold">ҚОСЫМША А. Бағдарлама мәтіні</span>
                    <span>23</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3-4. КІРІСПЕ (2 бет) */}
            {(activeTab === 'all' || activeTab === 'intro') && (
              <div className="space-y-3">
                <h2 className="text-center font-bold text-lg uppercase tracking-wide">КІРІСПЕ</h2>
                <p className="indent-8 text-justify">
                  Қазіргі таңда денсаулық сақтау саласы ақпараттық технологиялармен тығыз байланыста қарқынды дамып келеді. Қазақстан Республикасында медициналық ұйымдардың қызметін цифрландыру, электрондық денсаулық сақтау экожүйесін дамыту және пациентке бағдарланған цифрлық сервистерді енгізу мемлекеттік саясаттың басым бағыттарының бірі болып табылады. «Халық денсаулығы және денсаулық сақтау жүйесі туралы» Кодексте медициналық көмектің қолжетімділігі мен сапасын арттыруда заманауи медициналық ақпараттық жүйелердің рөлі ерекше атап өтілген [6].
                </p>
                <p className="indent-8 text-justify">
                  Бүгінде ірі республикалық орталықтармен қатар шағын және орта жеке меншік медициналық клиникалар да пациенттерге қызмет көрсету үдерістерін автоматтандыруға мұқтаж. Көптеген емдеу мекемелерінде науқастарды дәрігер қабылдауына жазу әлі күнге дейін телефон қоңырауы немесе тіркеу орнындағы қағаз журналы арқылы жүргізіледі. Мұндай дәстүрлі тәсілде тіркеуші мамандарға шамадан тыс жүктеме түседі, пациенттер дәрігердің нақты бос уақытын алдын ала көре алмайды, ал кезек күту уақыты негізсіз созылады.
                </p>
                <p className="indent-8 text-justify">
                  Бұдан бөлек, көпсалалы клиникаларда емдеу-диагностикалық кабинеттер қорын тиімді бөлу мәселесі аса өзекті. Санитарлық-эпидемиологиялық талаптарға сәйкес, әрбір күрделі манипуляциядан немесе пациенттерді қабылдау ауысымынан кейін кабинеттерді кварцтау және дезинфекциялау үзілістерін міндетті түрде жоспарлау қажет. Алайда бұл үдерістер ортақ цифрлық жүйеде есепке алынбаған жағдайда дәрігерлер арасында кабинет уақытының қабаттасуы, жабдықтардың бос тұрып қалуы немесе санитарлық регламенттің бұзылуы сияқты келеңсіздіктер туындайды.
                </p>
                <p className="indent-8 text-justify">
                  Қолданыстағы кейбір веб-жүйелер сыртқы бұлтты платформалар мен бөгде проприетарлық сервистерге тәуелді болғандықтан, клиниканың дербес серверінде немесе қарапайым хостингте автономды түрде жұмыс істей алмайды. Сонымен қатар көптеген шешімдерде клиника әкімшісіне серверге тіркелген пайдаланушыларды тікелей бақылау және жалған не қажетсіз аккаунттарды базадан жедел өшіру мүмкіндігі толық қарастырылмаған.
                </p>
                <p className="indent-8 text-justify">
                  <strong>Курстық жұмыстың мақсаты</strong> — медициналық клиникаға арналған, кабинеттер қорын тиімді бөлуді, дәрігерлерге кабинеттерді кварцтау режимімен брондауды, пациенттерді онлайн жазуды, QR-кодты ресми қабылдау талондарын беруді және әкімшілік бақылауды қамтамасыз ететін дербес «MedCabinet» веб-ақпараттық жүйесін жобалау және әзірлеу.
                </p>
                <p className="indent-8 text-justify">
                  <strong>Зерттеу объектісі</strong> — көпсалалы медициналық клиниканың (Ақтөбе қ.) пациенттерге амбулаториялық-емханалық қызмет көрсету және емдеу-диагностикалық кабинеттер қорын жоспарлау үдерістері. <strong>Зерттеу пәні</strong> — Node.js (Express), TypeScript, React, Tailwind CSS және REST API технологиялары негізінде медициналық веб-ақпараттық жүйені жобалау мен іске асыру әдістері.
                </p>
                <p className="indent-8 text-justify font-semibold">Қойылған мақсатқа қол жеткізу үшін келесі міндеттер айқындалып, толық орындалды:</p>
                <ul className="list-disc pl-10 space-y-1 text-slate-800 text-sm">
                  <li>Пәндік саланы жан-жақты талдау, жүйе рөлдерін (Келуші, Пациент, Дәрігер, Әкімші) және функционалдық талаптарды белгілеу;</li>
                  <li>Мәліметтер қорының концептуалды (ER-диаграмма) және логикалық моделін жобалау, қатынастарды 3НФ пішініне келтіру;</li>
                  <li>Қосымшаның сайт картасын, үш деңгейлі клиент-серверлік архитектурасын және алгоритмдердің блок-схемасын құру;</li>
                  <li>Пациент, дәрігер және әкімші кабинеттері бар толық функционалды Full-Stack веб-қосымшаны әзірлеу;</li>
                  <li>Пациенттерге ресми мөрі мен QR-коды бар қабылдау талондарын басып шығару және автоматты SMS ескертпелер жүйесін құру;</li>
                  <li>Әкімшіге серверлік базадағы пайдаланушыларды бақылау және қажетсіз тіркелгілерді біржола өшіру механизмін іске асыру;</li>
                  <li>Ақпараттық қауіпсіздік шараларын (SHA-256 хэштеу, рөлдік шектеу, деректер валидациясы) енгізу;</li>
                  <li>Қосымшаны сыртқы платформаларға (Google AI Studio) тәуелсіз, кез келген компьютер мен смартфонда істейтіндей етіп тестілеу.</li>
                </ul>
                <p className="indent-8 text-justify">
                  Жұмыстың жаңалығы мен практикалық құндылығы: әзірленген «MedCabinet» жүйесі ешқандай сыртқы бұлтты орталарға тәуелді емес, дербес Node.js серверінде автономды түрде жұмыс істейді, кез келген смартфон мен компьютерден қолжетімді және клиниканың нақты бизнес-үдерістерін цифрландырады.
                </p>
              </div>
            )}

            {/* 4. 1 ЖАЛПЫ БӨЛІМ */}
            {(activeTab === 'all' || activeTab === 'chap1') && (
              <div className="space-y-4 pt-4 border-t">
                <h2 className="text-center font-bold text-lg uppercase tracking-wide">1 ЖАЛПЫ БӨЛІМ</h2>

                <h3 className="font-bold text-base">1.1 Есептің қойылуы</h3>
                <p className="indent-8 text-justify">
                  Медициналық клиникада кардиология, терапия, УДЗ, рентгенология, офтальмология, стоматология және хирургия бейінді кабинеттері жұмыс істейді. Электрондық жүйе пациенттерге арналған сыртқы порталды және дәрігерлер мен әкімшілікке арналған ішкі басқару ортасын біріктіруі тиіс.
                </p>

                <div className="my-3">
                  <p className="text-center font-bold text-xs mb-1">1-кесте – Жүйе рөлдері және олардың мүмкіндіктері</p>
                  <table className="w-full border-collapse border border-slate-300 text-xs">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 p-2 text-left">Рөл атауы</th>
                        <th className="border border-slate-300 p-2 text-left">Жүйедегі негізгі мүмкіндіктері мен рұқсат деңгейі</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 p-2 font-bold">Келуші</td>
                        <td className="border border-slate-300 p-2">«Пациент» немесе «Дәрігер» рөлін таңдап тіркелу, логин/телефон арқылы кіру, теория мен кодты жүктеу</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 font-bold text-emerald-800">Пациент (patient)</td>
                        <td className="border border-slate-300 p-2">Кабинеттер каталогын қарау, онлайн жазылу, шағым енгізу, QR-кодты ресми талон басу, SMS хабарлама алу</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 font-bold text-blue-800">Дәрігер (doctor)</td>
                        <td className="border border-slate-300 p-2">Пациенттер кезегін жүргізу, «Қабылданды ✓» мәртебесін қою, кабинетті кварцтаумен брондау</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 font-bold text-purple-800">Әкімші (admin)</td>
                        <td className="border border-slate-300 p-2">4 KPI көрсеткішін бақылау, кабинет қосу/өзгерту, тіркелген пайдаланушыларды көру және серверден біржола өшіру</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="font-bold text-base mt-4">1.2 Сайтты құру кезеңдері, қолданылатын веб-технологиялар және пайдаланылатын программалау тілі мінездемесі</h3>
                <p className="indent-8 text-justify">
                  П. Чен нотациясы бойынша жүйеде бес негізгі мән анықталды: Users, Cabinets, Appointments, Bookings және Reminders [13]. Олардың концептуалды байланыстары 1.1-суретте, ал кілттер мен дерек типтері көрсетілген логикалық моделі 1.2-суретте берілген.
                </p>

                <FigureBlock
                  src="/docs-images/fig1_1_er.png"
                  num="1.1"
                  caption="«MedCabinet» ақпараттық жүйесінің концептуалды моделі (ER-диаграмма)"
                />
                <FigureBlock
                  src="/docs-images/fig1_2_logical.png"
                  num="1.2"
                  caption="Мәліметтер қорының логикалық моделі (кестелер, кілттер және дерек типтері)"
                />

                <div className="my-3">
                  <p className="text-center font-bold text-xs mb-1">2-кесте – Мәліметтер қоры кестелерінің сипаттамасы</p>
                  <table className="w-full border-collapse border border-slate-300 text-xs">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 p-2 text-left">Кесте</th>
                        <th className="border border-slate-300 p-2 text-left">Негізгі атрибуттары мен кілттері</th>
                        <th className="border border-slate-300 p-2 text-left">Мақсаты</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 p-2 font-mono font-bold">Users</td>
                        <td className="border border-slate-300 p-2">id (PK), name, login (UQ), phone (UQ), passwordHash, role, specialty, assignedCabinet, iin</td>
                        <td className="border border-slate-300 p-2">Пайдаланушылар мен рөлдік бақылау</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 font-mono font-bold">Cabinets</td>
                        <td className="border border-slate-300 p-2">id (PK), number (UQ), title, floor, category, status, equipment[], currentDoctor</td>
                        <td className="border border-slate-300 p-2">Кабинеттер каталогы және санитарлық күй</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 font-mono font-bold">Appointments</td>
                        <td className="border border-slate-300 p-2">id (PK), patientId (FK), doctorId (FK), cabinetNumber, date, time, symptoms, status</td>
                        <td className="border border-slate-300 p-2">Онлайн жазылу және ресми талон</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 font-mono font-bold">Bookings</td>
                        <td className="border border-slate-300 p-2">id (PK), cabinetId (FK), doctorId (FK), date, startTime, endTime, needsSterilization</td>
                        <td className="border border-slate-300 p-2">Кабинетті кварцтаумен брондау</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 font-mono font-bold">Reminders</td>
                        <td className="border border-slate-300 p-2">id (PK), recipientName, recipientPhone, channel, message, status, sentAt</td>
                        <td className="border border-slate-300 p-2">Автоматты SMS ескертпелер журналы</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="indent-8 text-justify">
                  Жүйені әзірлеуде <strong>TypeScript 7, React 19, Tailwind CSS v4, Vite 8</strong> және серверлік бөлікте <strong>Node.js + Express 4.21</strong> таңдалды [12, 14, 16, 18, 20, 21]. Бұл стек сыртқы бұлтты орталарға тәуелсіз, жалғыз 3000-портта дербес жұмыс істеуге және кез келген смартфоннан (390px+) кіруге мүмкіндік береді.
                </p>
              </div>
            )}

            {/* 5. 2 АРНАЙЫ БӨЛІМ */}
            {(activeTab === 'all' || activeTab === 'chap2') && (
              <div className="space-y-4 pt-4 border-t">
                <h2 className="text-center font-bold text-lg uppercase tracking-wide">2 АРНАЙЫ БӨЛІМ</h2>

                <h3 className="font-bold text-base">2.1 Есептің алгоритмін құру және оның сипаттамасы</h3>
                <p className="indent-8 text-justify">
                  «MedCabinet» жүйесі бірыңғай көп рөлдік архитектурамен жұмыс істейді. Қосымшаның сайт картасы (2.1-сурет), үш деңгейлі клиент-серверлік өзара әрекеттесу сұлбасы (2.2-сурет) және дәрігер қабылдауына онлайн жазылу алгоритмінің блок-схемасы (2.3-сурет) жүйенің толық жұмыс логикасын бейнелейді.
                </p>

                <FigureBlock
                  src="/docs-images/fig2_1_sitemap.png"
                  num="2.1"
                  caption="«MedCabinet» веб-қосымшасының құрылымы (сайт картасы)"
                />
                <FigureBlock
                  src="/docs-images/fig2_2_arch.png"
                  num="2.2"
                  caption="Клиент-серверлік модульдердің өзара әрекеттесу архитектурасы"
                />
                <FigureBlock
                  src="/docs-images/fig2_3_flowchart.png"
                  num="2.3"
                  caption="Дәрігер қабылдауына онлайн жазылу алгоритмінің блок-схемасы"
                />

                <h3 className="font-bold text-base mt-4">2.2 Программа</h3>
                <p className="indent-8 text-justify">
                  Серверлік бөлік `server.ts` файлында іске асырылған және 16 REST API маршрутын қамтиды (`POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `GET/DELETE /api/users/:id`, `GET/POST/PUT/DELETE /api/cabinets`, `/api/appointments`, `/api/bookings`, `/api/reminders`). Құпиясөздер SHA-256 алгоритмімен хэштеліп, API жауаптарында `sanitizeUser()` арқылы тазартылады. Әкімшінің `DELETE /api/users/:id` сұранысы пайдаланушыны және оған тиесілі жазбаларды каскадты түрде өшіреді (бас әкімші аккаунты 403 статусымен қорғалған).
                </p>

                <h3 className="font-bold text-base mt-4">2.3 Программаның орындалуына арналған түсініктеме</h3>
                <p className="indent-8 text-justify">
                  Жүйені локальді іске қосу үшін `npm install` және `npm run dev` командаларын орындау жеткілікті. Сондай-ақ жоба GitHub арқылы Render бұлтты хостингінде смартфоннан ашуға толық бейімделген. Жүйенің негізгі экрандары мен интерфейстік мүмкіндіктері 2.4–2.7-суреттерде көрсетілген.
                </p>

                <FigureBlock
                  src="/docs-images/fig2_4_auth.png"
                  num="2.4"
                  caption="Жүйеге кіру және жаңа пайдаланушыны тіркеу терезесі (AuthScreen)"
                />
                <FigureBlock
                  src="/docs-images/fig2_5_patient_ticket.png"
                  num="2.5"
                  caption="Пациент порталы, кабинеттер каталогы және QR-кодты ресми қабылдау талоны"
                />
                <FigureBlock
                  src="/docs-images/fig2_6_doctor.png"
                  num="2.6"
                  caption="Дәрігер кабинеті: пациенттер кезегі және кабинетті кварцтаумен брондау"
                />
                <FigureBlock
                  src="/docs-images/fig2_7_admin.png"
                  num="2.7"
                  caption="Әкімші басқару панелі: статистика және пайдаланушыларды серверден өшіру кестесі"
                />

                <div className="my-3">
                  <p className="text-center font-bold text-xs mb-1">7-кесте – Функционалдық тестілеу сценарийлері мен нәтижелері</p>
                  <table className="w-full border-collapse border border-slate-300 text-xs">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 p-2 text-center">№</th>
                        <th className="border border-slate-300 p-2 text-left">Тест сценарийі</th>
                        <th className="border border-slate-300 p-2 text-left">Күтілетін нәтиже</th>
                        <th className="border border-slate-300 p-2 text-center">Нәтиже</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 p-2 text-center">1</td>
                        <td className="border border-slate-300 p-2">Жаңа науқасты тіркеу</td>
                        <td className="border border-slate-300 p-2">Серверде сақталып, токен беріледі</td>
                        <td className="border border-slate-300 p-2 text-center font-bold text-emerald-700">Өтті ✓</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 text-center">2</td>
                        <td className="border border-slate-300 p-2">Бірдей логин/телефонмен тіркелу</td>
                        <td className="border border-slate-300 p-2">Сервер 400 қатесін және ескерту қайтарады</td>
                        <td className="border border-slate-300 p-2 text-center font-bold text-emerald-700">Өтті ✓</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 text-center">3</td>
                        <td className="border border-slate-300 p-2">Онлайн жазылу және талон басу</td>
                        <td className="border border-slate-300 p-2">Талон мен SMS құрылып, баспаға шығады</td>
                        <td className="border border-slate-300 p-2 text-center font-bold text-emerald-700">Өтті ✓</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 text-center">4</td>
                        <td className="border border-slate-300 p-2">Дәрігердің кварцтаумен брондауы</td>
                        <td className="border border-slate-300 p-2">Кабинет мәртебесі «Брондалған» болып өзгереді</td>
                        <td className="border border-slate-300 p-2 text-center font-bold text-emerald-700">Өтті ✓</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 text-center">5</td>
                        <td className="border border-slate-300 p-2">Әкімшінің пайдаланушыны өшіруі</td>
                        <td className="border border-slate-300 p-2">Пайдаланушы базадан біржола жойылады</td>
                        <td className="border border-slate-300 p-2 text-center font-bold text-emerald-700">Өтті ✓</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 text-center">6</td>
                        <td className="border border-slate-300 p-2">Смартфоннан (390px) ашу</td>
                        <td className="border border-slate-300 p-2">Интерфейс көлденең жылжусыз толық бейімделеді</td>
                        <td className="border border-slate-300 p-2 text-center font-bold text-emerald-700">Өтті ✓</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. ҚОРЫТЫНДЫ (2 бет) */}
            {(activeTab === 'all' || activeTab === 'conclusion') && (
              <div className="space-y-3 pt-4 border-t">
                <h2 className="text-center font-bold text-lg uppercase tracking-wide">ҚОРЫТЫНДЫ</h2>
                <p className="indent-8 text-justify">
                  Осы курстық жұмыс медициналық ақпараттық жүйелерді жобалау мен заманауи веб-бағдарламалаудың толық өмірлік циклін тәжірибе жүзінде меңгеруге мүмкіндік берді. Жұмыстың басты мақсаты — медициналық клиникаға арналған кабинеттерді брондау және дәрігерге онлайн жазылу «MedCabinet» веб-ақпараттық жүйесін құру — толық көлемде іске асырылды:
                </p>
                <ol className="list-decimal pl-10 space-y-1.5 text-xs sm:text-sm text-slate-800">
                  <li>Көпсалалы клиниканың амбулаториялық-қабылдау үдерістері талданып, Келуші, Пациент, Дәрігер және Әкімші рөлдеріне арналған талаптар жүйеленді;</li>
                  <li>П. Чен нотациясы бойынша ER-диаграмма және 5 негізгі кестеден (Users, Cabinets, Appointments, Bookings, Reminders) тұратын логикалық модель 3НФ талаптарына сай жобаланды;</li>
                  <li>Қосымшаның сайт картасы, үш деңгейлі клиент-серверлік архитектурасы және уақыт қабаттасуын болдырмайтын онлайн жазылу алгоритмінің блок-схемасы құрылды;</li>
                  <li>React 19, TypeScript 7, Tailwind CSS v4 және Vite 8 негізінде компьютер мен смартфон экрандарына (390px+) толық бейімделгіш SPA қосымшасы жасалды;</li>
                  <li>Node.js + Express 4.21 ортасында сыртқы платформаларға (Google AI Studio) тәуелсіз дербес серверлік REST API және файлдық JSON деректер базасы құрылды;</li>
                  <li>Пациенттерге QR-кодты ресми талон басып шығару (@media print), автоматты SMS ескертпелер және дәрігерлерге санитарлық кварцтаумен брондау жүзеге асырылды;</li>
                  <li>Клиника әкімшісіне серверлік базадағы барлық тіркелген пайдаланушыларды бақылау және қажетсіз аккаунттарды каскадты түрде біржола өшіру (DELETE /api/users/:id) құралы енгізілді;</li>
                  <li>SHA-256 криптографиялық хэштеу, рөлдік шектеу (RBAC) және бірегей логин/телефон тексерісі тестілеуден сәтті өткізілді.</li>
                </ol>
                <p className="indent-8 text-justify">
                  Әзірленген «MedCabinet» жүйесі клиника тіркеушілерінің жүктемесін азайтады, науқастардың кезек күту уақытын қысқартады, санитарлық-кварцтау үзілістерін реттейді және басшылыққа нақты уақыттағы бақылау мүмкіндігін береді.
                </p>
                <p className="indent-8 text-justify">
                  Болашақта жүйені одан әрі жетілдіру бағыттары ретінде: ҚР ұлттық «Damumed» және eGov порталдарымен HL7 FHIR стандарты арқылы интеграция орнату, Kaspi QR онлайн төлем жүйесін қосу, WebRTC негізінде телемедициналық бейнеконсультация модулін енгізу және PostgreSQL базасына масштабтау ұсынылады.
                </p>
              </div>
            )}

            {/* 7. ӘДЕБИЕТТЕР ТІЗІМІ */}
            {(activeTab === 'all' || activeTab === 'biblio') && (
              <div className="space-y-2 pt-4 border-t">
                <h2 className="text-center font-bold text-base uppercase tracking-wide">ҚОЛДАНЫЛҒАН ӘДЕБИЕТТЕР ТІЗІМІ</h2>
                <ol className="list-decimal pl-8 space-y-1 text-xs text-slate-700">
                  <li>Бен-Ган И. Microsoft SQL Server. Основы T-SQL. – М.: Эксмо, 2015. – 400 с.</li>
                  <li>Бөрібаев Б. WEB-технологиялар: оқулық. – Алматы: ЖШС РПБК «Дәуір», 2011. – 360 б.</li>
                  <li>Дейт К. Дж. Введение в системы баз данных. – 8-е изд. – М.: Вильямс, 2005. – 1328 с.</li>
                  <li>Коннолли Т., Бегг К. Базы данных. Проектирование, реализация и сопровождение. – 3-е изд. – М.: Вильямс, 2003. – 1440 с.</li>
                  <li>Қазақстан Республикасының 2013 жылғы 21 мамырдағы № 94-V «Дербес деректер және оларды қорғау туралы» Заңы.</li>
                  <li>Қазақстан Республикасының 2020 жылғы 7 шілдедегі № 360-VI «Халық денсаулығы және денсаулық сақтау жүйесі туралы» Кодексі.</li>
                  <li>Бэнкс А., Порчелло Е. React и Redux: функциональная веб-разработка. – СПб.: Питер, 2018. – 336 с.</li>
                  <li>МКБ-10 [Электрондық ресурс] // ДДСҰ. – URL: https://icd.who.int</li>
                  <li>Флэнаган Д. JavaScript. Подробное руководство. – 7-е изд. – СПб.: Символ-Плюс, 2021. – 1080 с.</li>
                  <li>Браун Э. Веб-разработка с применением Node и Express. – СПб.: Питер, 2021. – 336 с.</li>
                  <li>«Электрондық үкімет» порталы [Электрондық ресурс]. – URL: https://egov.kz</li>
                  <li>Node.js Documentation [Электрондық ресурс]. – URL: https://nodejs.org</li>
                  <li>Chen P. P. The Entity-Relationship Model // ACM TODS. – 1976. – Vol. 1. – P. 9–36.</li>
                  <li>React Official Documentation [Электрондық ресурс]. – URL: https://react.dev</li>
                  <li>HL7 FHIR Release 4 Specification [Электрондық ресурс]. – URL: https://hl7.org/fhir/R4/</li>
                  <li>Express.js Documentation [Электрондық ресурс]. – URL: https://expressjs.com</li>
                  <li>Moriarty K. RFC 8018. PKCS #5: Password-Based Cryptography Specification. – IETF, 2017.</li>
                  <li>TypeScript Language Specification [Электрондық ресурс]. – URL: https://www.typescriptlang.org</li>
                  <li>OWASP Top 10: Web Application Security Risks [Электрондық ресурс]. – URL: https://owasp.org/Top10/</li>
                  <li>Tailwind CSS Documentation [Электрондық ресурс]. – URL: https://tailwindcss.com</li>
                  <li>Vite: Next Generation Frontend Tooling [Электрондық ресурс]. – URL: https://vitejs.dev</li>
                </ol>
              </div>
            )}

            {/* 8. ҚОСЫМША А */}
            {(activeTab === 'all' || activeTab === 'appendix') && (
              <div className="space-y-3 pt-4 border-t">
                <h2 className="text-center font-bold text-base uppercase tracking-wide">ҚОСЫМША А. Бағдарлама мәтіні</h2>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-[11px] font-mono overflow-x-auto space-y-3">
                  <div>
                    <p className="text-teal-400 font-bold mb-1">// А.1 server.ts — Әкімшінің пайдаланушыны өшіру контроллері</p>
                    <pre>{`app.delete('/api/users/:id', (req: Request, res: Response): any => {
  const { id } = req.params;
  const db = getDb();
  const userIndex = db.users.findIndex(u => u.id === id);
  if (userIndex === -1) return res.status(404).json({ error: 'Пайдаланушы табылмады' });

  const user = db.users[userIndex];
  if (user.role === 'admin' || user.login === 'admin') {
    return res.status(403).json({ error: 'Бас әкімші аккаунтын өшіруге болмайды!' });
  }
  db.users.splice(userIndex, 1);
  db.appointments = db.appointments.filter(a => a.patientId !== id && a.doctorId !== id);
  db.bookings = db.bookings.filter(b => b.doctorId !== id);
  saveDb(db);
  return res.json({ message: \`«\${user.name}» серверлік базадан сәтті өшірілді!\` });
});`}</pre>
                  </div>
                  <div>
                    <p className="text-teal-400 font-bold mb-1">// А.2 src/api.ts — Клиенттік өшіру функциясы</p>
                    <pre>{`export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(\`/api/users/\${id}\`, { method: 'DELETE' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Пайдаланушыны өшіру қатесі');
}`}</pre>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Файл: <strong className="text-slate-800">Жақсылық_Шыңғысхан_Курстық_жұмыс.docx</strong> (25 бет · 9 сурет)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              Жабу
            </button>
            <a
              href="/kurstyk_zhumys_teoriya.docx"
              download="Жақсылық_Шыңғысхан_Курстық_жұмыс.docx"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Word құжатын жүктеп алу (.docx)</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

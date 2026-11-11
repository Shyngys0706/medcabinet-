import React, { useState } from 'react';
import { User, Cabinet, Appointment, Booking, Reminder } from '../types';
import { Stethoscope, Calendar, Clock, CheckCircle, Printer, XCircle, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface DoctorPortalProps {
  currentUser: User;
  cabinets: Cabinet[];
  appointments: Appointment[];
  bookings: Booking[];
  reminders: Reminder[];
  onCompleteAppointment: (id: string) => void;
  onCancelAppointment: (id: string) => void;
  onViewTicket: (app: Appointment) => void;
  onCreateBooking: (booking: {
    cabinetId: string;
    cabinetNumber: string;
    date: string;
    startTime: string;
    endTime: string;
    purpose: string;
    needsSterilization: boolean;
  }) => void;
  onCancelBooking: (id: string) => void;
}

export const DoctorPortal: React.FC<DoctorPortalProps> = ({
  currentUser,
  cabinets,
  appointments,
  bookings,
  reminders,
  onCompleteAppointment,
  onCancelAppointment,
  onViewTicket,
  onCreateBooking,
  onCancelBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'book-cabinet' | 'my-bookings'>('queue');

  // Booking room form
  const [selectedCabId, setSelectedCabId] = useState(cabinets[0]?.id || '');
  const [bookDate, setBookDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [bookStart, setBookStart] = useState('09:00');
  const [bookEnd, setBookEnd] = useState('13:00');
  const [bookPurpose, setBookPurpose] = useState('Жоспарлы қабылдау және диагностика');
  const [sterilize, setSterilize] = useState(true);

  // Filter appointments for this doctor
  const myQueue = appointments.filter(
    (a) => a.doctorId === currentUser.id || a.doctorName.toLowerCase().includes(currentUser.name.toLowerCase())
  );

  // Filter bookings for this doctor
  const myBookings = bookings.filter(
    (b) => b.doctorId === currentUser.id || b.doctorName.toLowerCase().includes(currentUser.name.toLowerCase())
  );

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cab = cabinets.find((c) => c.id === selectedCabId) || cabinets[0];
    onCreateBooking({
      cabinetId: cab.id,
      cabinetNumber: cab.number,
      date: bookDate,
      startTime: bookStart,
      endTime: bookEnd,
      purpose: bookPurpose,
      needsSterilization: sterilize,
    });
    setActiveTab('my-bookings');
  };

  return (
    <div className="space-y-6">
      {/* Doctor Header Banner */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-2xl shrink-0">
              🩺
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-blue-100 uppercase tracking-wider mb-1">
                Дәрігердің жұмыс кабинеті
              </span>
              <h2 className="text-xl md:text-2xl font-black">{currentUser.name}</h2>
              <p className="text-xs text-blue-200">
                Мамандығы: <strong className="text-white">{currentUser.specialty || 'Кардиолог-терапевт'}</strong> · 
                Бекітілген кабинет: <strong className="text-white">№{currentUser.assignedCabinet || '102'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20 shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-blue-200">Кезектегі науқастар:</div>
              <div className="text-xl font-extrabold text-white">{myQueue.filter((a) => a.status === 'confirmed').length} адам</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('queue')}
          className={`pb-3 px-4 font-bold text-xs border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'queue'
              ? 'border-blue-600 text-blue-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>👥 Науқастар қабылдау кезегі</span>
          <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {myQueue.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('book-cabinet')}
          className={`pb-3 px-4 font-bold text-xs border-b-2 transition-colors ${
            activeTab === 'book-cabinet'
              ? 'border-blue-600 text-blue-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          🏢 Кабинетті брондау
        </button>
        <button
          onClick={() => setActiveTab('my-bookings')}
          className={`pb-3 px-4 font-bold text-xs border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'my-bookings'
              ? 'border-blue-600 text-blue-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>📅 Брондалған кабинеттер</span>
          <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {myBookings.length}
          </span>
        </button>
      </div>

      {/* TAB 1: PATIENTS QUEUE */}
      {activeTab === 'queue' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Қабылдауға жазылған науқастар тізімі</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Науқас келген соң «Қабылданды ✓» батырмасын басып күйін бекітіңіз немесе ресми талонын басып шығарыңыз.
              </p>
            </div>
          </div>

          {myQueue.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              <p className="text-xs">Қабылдауға жазылған науқастар әзірге жоқ.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Науқас</th>
                    <th className="py-3 px-4">Телефон / ЖСН</th>
                    <th className="py-3 px-4">Күні мен уақыты</th>
                    <th className="py-3 px-4">Шағымы</th>
                    <th className="py-3 px-4">Күйі</th>
                    <th className="py-3 px-4 text-right">Әрекеттер</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myQueue.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {app.patientName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono">
                        <div>{app.patientPhone}</div>
                        {app.patientIin && <div className="text-[10px] text-slate-400">ЖСН: {app.patientIin}</div>}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <span className="font-semibold">{app.date}</span> | <span className="font-mono font-bold">{app.time}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {app.symptoms}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            app.status === 'confirmed'
                              ? 'bg-amber-100 text-amber-800'
                              : app.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {app.status === 'confirmed' ? 'Күтілуде' : app.status === 'completed' ? 'Қабылданды ✓' : 'Бас тартылды'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {app.status === 'confirmed' && (
                            <button
                              onClick={() => onCompleteAppointment(app.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition"
                              title="Науқас қабылданды деп белгілеу"
                            >
                              Қабылданды ✓
                            </button>
                          )}
                          <button
                            onClick={() => onViewTicket(app)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                            title="Талонды көру"
                          >
                            🖨️ Талон
                          </button>
                          {app.status === 'confirmed' && (
                            <button
                              onClick={() => onCancelAppointment(app.id)}
                              className="px-2 py-1 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Қабылдауды жою"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BOOK CABINET */}
      {activeTab === 'book-cabinet' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-xl shadow-xs">
          <h3 className="font-extrabold text-sm text-slate-900 mb-1">Медициналық кабинетті алдын ала брондау</h3>
          <p className="text-xs text-slate-500 mb-4">
            Қабылдау сағаттарыңызға сай кабинетті таңдаңыз. Стерилизация мен кварцтау қызметі автоматты түрде жүйеге тіркеледі.
          </p>

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Кабинетті таңдаңыз *</label>
              <select
                value={selectedCabId}
                onChange={(e) => setSelectedCabId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {cabinets.map((cab) => (
                  <option key={cab.id} value={cab.id}>
                    №{cab.number} — {cab.title} ({cab.floor}-қабат, {cab.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Брондау күні *</label>
              <input
                type="date"
                required
                value={bookDate}
                onChange={(e) => setBookDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Басталу уақыты</label>
                <select
                  value={bookStart}
                  onChange={(e) => setBookStart(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                >
                  <option value="08:00">08:00</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="14:00">14:00</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Аяқталу уақыты</label>
                <select
                  value={bookEnd}
                  onChange={(e) => setBookEnd(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                >
                  <option value="12:00">12:00</option>
                  <option value="13:00">13:00</option>
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Брондау мақсаты *</label>
              <input
                type="text"
                required
                value={bookPurpose}
                onChange={(e) => setBookPurpose(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <label className="flex items-center gap-2 text-xs font-bold text-blue-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sterilize}
                  onChange={(e) => setSterilize(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span>Санитарлық кварцтау және дезинфекция сұранысы</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              Кабинетті растап брондау ✓
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: MY BOOKINGS */}
      {activeTab === 'my-bookings' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900">Менің брондалған кабинеттерім</h3>
          </div>

          {myBookings.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              <p className="text-xs">Сізде белсенді брондалған кабинеттер жоқ.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Кабинет</th>
                    <th className="py-3 px-4">Күні</th>
                    <th className="py-3 px-4">Уақыт аралығы</th>
                    <th className="py-3 px-4">Мақсаты</th>
                    <th className="py-3 px-4">Стерилизация</th>
                    <th className="py-3 px-4 text-right">Басқару</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">№{b.cabinetNumber} кабинет</td>
                      <td className="py-3.5 px-4 text-slate-700">{b.date}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-800">
                        {b.startTime} - {b.endTime}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{b.purpose}</td>
                      <td className="py-3.5 px-4">
                        {b.needsSterilization ? (
                          <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold">
                            Қажет (+Кварц)
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Стандартты</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onCancelBooking(b.id)}
                          className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 font-bold rounded-lg hover:bg-rose-100 transition"
                        >
                          Босату
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { User, Cabinet, Appointment, Booking, Reminder } from '../types';
import { Shield, Building2, Users, CalendarCheck, Trash2, Plus, RefreshCw, Printer, AlertTriangle } from 'lucide-react';

interface AdminPortalProps {
  currentUser: User;
  cabinets: Cabinet[];
  users: User[];
  appointments: Appointment[];
  bookings: Booking[];
  reminders: Reminder[];
  onAddCabinet: (cab: { number: string; title: string; floor: number; category: string; equipment: string[] }) => void;
  onToggleCabinetStatus: (cabId: string, currentStatus: string) => void;
  onDeleteCabinet: (cabId: string) => void;
  onDeleteAppointment: (appId: string) => void;
  onDeleteBooking: (bookId: string) => void;
  onViewTicket: (app: Appointment) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  cabinets,
  users,
  appointments,
  bookings,
  reminders,
  onAddCabinet,
  onToggleCabinetStatus,
  onDeleteCabinet,
  onDeleteAppointment,
  onDeleteBooking,
  onViewTicket,
}) => {
  const [activeTab, setActiveTab] = useState<'cabinets' | 'users' | 'appointments' | 'reminders'>('cabinets');
  const [newCabModalOpen, setNewCabModalOpen] = useState(false);

  // New cabinet form
  const [cabNum, setCabNum] = useState('');
  const [cabTitle, setCabTitle] = useState('');
  const [cabFloor, setCabFloor] = useState(1);
  const [cabCat, setCabCat] = useState('Терапия');
  const [cabEquipment, setCabEquipment] = useState('Жалпы медициналық кушетка, Дәрігер үстелі, Тонометр');

  const handleAddCabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCabinet({
      number: cabNum.trim(),
      title: cabTitle.trim(),
      floor: cabFloor,
      category: cabCat.trim(),
      equipment: cabEquipment.split(',').map((s) => s.trim()).filter(Boolean),
    });
    setCabNum('');
    setCabTitle('');
    setNewCabModalOpen(false);
  };

  const doctorsCount = users.filter((u) => u.role === 'doctor').length;
  const patientsCount = users.filter((u) => u.role === 'patient').length;

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-2xl p-6 text-white shadow-md border border-teal-800/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center font-bold text-2xl shrink-0 text-teal-300">
              🛡️
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/30 text-teal-200 uppercase tracking-wider mb-1">
                Клиниканың бас әкімшісі
              </span>
              <h2 className="text-xl md:text-2xl font-black">{currentUser.name}</h2>
              <p className="text-xs text-teal-200">
                Серверлік деректер базасы · Толық әкімшілік бақылау мен басқару орталығы
              </p>
            </div>
          </div>

          <button
            onClick={() => setNewCabModalOpen(true)}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl transition shadow-md shadow-teal-500/20 flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Жаңа кабинет қосу</span>
          </button>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 font-semibold">Кабинеттер саны</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{cabinets.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-lg">
            🏢
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 font-semibold">Тіркелген дәрігерлер</div>
            <div className="text-2xl font-black text-blue-700 mt-0.5">{doctorsCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg">
            🩺
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 font-semibold">Тіркелген пациенттер</div>
            <div className="text-2xl font-black text-emerald-700 mt-0.5">{patientsCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg">
            👤
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 font-semibold">Белсенді қабылдаулар</div>
            <div className="text-2xl font-black text-amber-700 mt-0.5">{appointments.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg">
            📅
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('cabinets')}
          className={`pb-3 px-4 font-bold text-xs border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'cabinets'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>🏢 Кабинеттерді басқару</span>
          <span className="bg-teal-100 text-teal-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {cabinets.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 font-bold text-xs border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>👥 Пайдаланушылар базасы (Сервер)</span>
          <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {users.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 px-4 font-bold text-xs border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'appointments'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>📅 Барлық қабылдаулар мен брондар</span>
          <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {appointments.length + bookings.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('reminders')}
          className={`pb-3 px-4 font-bold text-xs border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'reminders'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>💬 Хабарламалар журналы</span>
        </button>
      </div>

      {/* TAB 1: CABINETS MANAGEMENT */}
      {activeTab === 'cabinets' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Клиника кабинеттерінің тізімі</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Күйін өзгерту арқылы бос, дезинфекция немесе жөндеу режимдеріне ауыстыруға болады.
              </p>
            </div>
            <button
              onClick={() => setNewCabModalOpen(true)}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Кабинет қосу</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Кабинет №</th>
                  <th className="py-3 px-4">Атауы</th>
                  <th className="py-3 px-4">Қабат / Бөлім</th>
                  <th className="py-3 px-4">Медициналық жабдықтары</th>
                  <th className="py-3 px-4">Күйі</th>
                  <th className="py-3 px-4 text-right">Әрекеттер</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cabinets.map((cab) => (
                  <tr key={cab.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-teal-700">№{cab.number}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{cab.title}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {cab.floor}-қабат · {cab.category}
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                      {cab.equipment.join(', ')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          cab.status === 'available'
                            ? 'bg-emerald-100 text-emerald-800'
                            : cab.status === 'booked'
                            ? 'bg-blue-100 text-blue-800'
                            : cab.status === 'sanitizing'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {cab.status === 'available'
                          ? 'Бос (Қолжетімді)'
                          : cab.status === 'booked'
                          ? 'Брондалған'
                          : cab.status === 'sanitizing'
                          ? 'Санитарлық өңдеуде'
                          : 'Жөндеуде'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onToggleCabinetStatus(cab.id, cab.status)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
                          title="Күйін ауыстыру"
                        >
                          Күйін өзгерту
                        </button>
                        <button
                          onClick={() => onDeleteCabinet(cab.id)}
                          className="px-2 py-1 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Кабинетті жою"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: REGISTERED USERS FROM SERVER DATABASE */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900">Серверде тіркелген пайдаланушылар базасы</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Әрбір қолданушы бірегей логин және телефон нөмірімен серверлік базада сақталған.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Аты-жөні</th>
                  <th className="py-3 px-4">Рөлі</th>
                  <th className="py-3 px-4">Логин (Бірегей)</th>
                  <th className="py-3 px-4">Телефон нөмірі (Бірегей)</th>
                  <th className="py-3 px-4">Мамандық / ЖСН</th>
                  <th className="py-3 px-4">Тіркелген күні</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-[10px]">
                        {u.name.charAt(0)}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'doctor'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {u.role === 'admin' ? '🛡️ Әкімші' : u.role === 'doctor' ? '🩺 Дәрігер' : '👤 Пациент'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-800 font-semibold">{u.login || 'admin'}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{u.phone}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {u.role === 'doctor'
                        ? `${u.specialty || 'Дәрігер'} (№${u.assignedCabinet || '101'} каб.)`
                        : u.iin
                        ? `ЖСН: ${u.iin}`
                        : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('kk-KZ') : '2026-11-11'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: APPOINTMENTS & ROOM BOOKINGS */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900">Науқастардың қабылдау кестелері</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Науқас</th>
                    <th className="py-3 px-4">Телефон</th>
                    <th className="py-3 px-4">Дәрігер</th>
                    <th className="py-3 px-4">Кабинет</th>
                    <th className="py-3 px-4">Күні & Уақыты</th>
                    <th className="py-3 px-4">Күйі</th>
                    <th className="py-3 px-4 text-right">Әрекет</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">{a.patientName}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{a.patientPhone}</td>
                      <td className="py-3 px-4 text-slate-800">{a.doctorName}</td>
                      <td className="py-3 px-4 font-bold text-teal-700">№{a.cabinetNumber}</td>
                      <td className="py-3 px-4 text-slate-600">{a.date} | {a.time}</td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onViewTicket(a)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold"
                          >
                            Талон
                          </button>
                          <button
                            onClick={() => onDeleteAppointment(a.id)}
                            className="px-2 py-1 text-rose-600 hover:bg-rose-50 rounded-lg"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900">Дәрігерлердің кабинет броньдары</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Кабинет</th>
                    <th className="py-3 px-4">Дәрігер</th>
                    <th className="py-3 px-4">Күні & Уақыты</th>
                    <th className="py-3 px-4">Мақсаты</th>
                    <th className="py-3 px-4 text-right">Жою</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-4 font-bold text-teal-700">№{b.cabinetNumber}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{b.doctorName}</td>
                      <td className="py-3 px-4 text-slate-600">{b.date} ({b.startTime} - {b.endTime})</td>
                      <td className="py-3 px-4 text-slate-600">{b.purpose}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onDeleteBooking(b.id)}
                          className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 font-bold rounded-lg"
                        >
                          Босату
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REMINDERS LOG */}
      {activeTab === 'reminders' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h3 className="font-extrabold text-sm text-slate-900 mb-1">Жүйелік хабарламалар мониторингі</h3>
          <p className="text-xs text-slate-500 mb-4">Клиника бойынша жіберілген SMS/WhatsApp хабарламаларының толық журналы.</p>
          <div className="space-y-2.5">
            {reminders.map((r) => (
              <div key={r.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-teal-700">{r.recipientName}</span>
                    <span className="font-mono text-slate-500 text-[11px]">({r.recipientPhone})</span>
                    <span className="text-[10px] text-slate-400 font-mono">{r.sentAt}</span>
                  </div>
                  <p className="text-slate-600">{r.message}</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                  Жеткізілді ✓
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Cabinet Modal */}
      {newCabModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-extrabold text-sm text-slate-900">Жаңа кабинет қосу</h3>
              <button
                onClick={() => setNewCabModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddCabSubmit} className="p-6 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Кабинет № *</label>
                  <input
                    type="text"
                    required
                    value={cabNum}
                    onChange={(e) => setCabNum(e.target.value)}
                    placeholder="205"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Қабат</label>
                  <select
                    value={cabFloor}
                    onChange={(e) => setCabFloor(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value={1}>1-қабат</option>
                    <option value={2}>2-қабат</option>
                    <option value={3}>3-қабат</option>
                    <option value={4}>4-қабат</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Кабинет атауы *</label>
                <input
                  type="text"
                  required
                  value={cabTitle}
                  onChange={(e) => setCabTitle(e.target.value)}
                  placeholder="Эндокринология кабинеті"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Бөлім / Санат</label>
                <input
                  type="text"
                  value={cabCat}
                  onChange={(e) => setCabCat(e.target.value)}
                  placeholder="Терапия"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Жабдықтар (үтірмен бөліңіз)</label>
                <textarea
                  rows={2}
                  value={cabEquipment}
                  onChange={(e) => setCabEquipment(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewCabModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Бас тарту
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Серверге сақтау ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

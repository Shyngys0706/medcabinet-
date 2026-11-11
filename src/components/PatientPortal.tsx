import React, { useState } from 'react';
import { User, Cabinet, Appointment, Reminder } from '../types';
import { Calendar, Clock, MapPin, Printer, AlertCircle, Plus, CheckCircle, FileText, X } from 'lucide-react';

interface PatientPortalProps {
  currentUser: User;
  cabinets: Cabinet[];
  doctors: User[];
  appointments: Appointment[];
  reminders: Reminder[];
  onBookAppointment: (appData: {
    doctorId: string;
    doctorName: string;
    cabinetNumber: string;
    date: string;
    time: string;
    symptoms: string;
  }) => void;
  onCancelAppointment: (id: string) => void;
  onViewTicket: (appointment: Appointment) => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({
  currentUser,
  cabinets,
  doctors,
  appointments,
  reminders,
  onBookAppointment,
  onCancelAppointment,
  onViewTicket,
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'my-appointments' | 'reminders'>('catalog');
  const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(null);

  // Booking Form State
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');
  const [appDate, setAppDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [appTime, setAppTime] = useState('10:00');
  const [symptoms, setSymptoms] = useState('Жалпы тексеру және дәрігерлік кеңес');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const myAppointments = appointments.filter(
    (a) => a.patientId === currentUser.id || a.patientPhone === currentUser.phone
  );

  const myReminders = reminders.filter(
    (r) => r.recipientName === currentUser.name || r.recipientPhone === currentUser.phone
  );

  const handleOpenBooking = (cab: Cabinet) => {
    setSelectedCabinet(cab);
    // Find doctor assigned to this cabinet or pick first
    const assignedDoc = doctors.find((d) => d.assignedCabinet === cab.number);
    if (assignedDoc) {
      setSelectedDoctorId(assignedDoc.id);
    } else if (doctors.length > 0) {
      setSelectedDoctorId(doctors[0].id);
    }
    setBookingModalOpen(true);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];
    onBookAppointment({
      doctorId: doc?.id || 'doc-1',
      doctorName: doc?.name || 'Кезекші дәрігер',
      cabinetNumber: selectedCabinet?.number || '101',
      date: appDate,
      time: appTime,
      symptoms,
    });
    setBookingModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Patient Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-700 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-teal-100 uppercase tracking-wider mb-2">
              👤 Пациент жеке кабинеті
            </span>
            <h2 className="text-xl md:text-2xl font-black">Қош келдіңіз, {currentUser.name}!</h2>
            <p className="text-xs text-teal-100 mt-1 max-w-xl">
              Медициналық кабинеттер мен дәрігерлер кестесін көріп, онлайн қабылдауға жазылыңыз және электронды талон алыңыз.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20 shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-teal-200">Белсенді жазылулар:</div>
              <div className="text-xl font-extrabold text-white">{myAppointments.length} талон</div>
            </div>
            <button
              onClick={() => setActiveTab('catalog')}
              className="px-3.5 py-2 bg-white text-teal-800 hover:bg-teal-50 font-bold text-xs rounded-lg transition shadow-xs"
            >
              ➕ Жазылу
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 px-4 font-bold text-xs border-b-2 transition-colors ${
            activeTab === 'catalog'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          🏢 Кабинеттер және дәрігерлер каталогы
        </button>
        <button
          onClick={() => setActiveTab('my-appointments')}
          className={`pb-3 px-4 font-bold text-xs border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'my-appointments'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>📅 Менің қабылдауларым & Талондар</span>
          {myAppointments.length > 0 && (
            <span className="bg-teal-100 text-teal-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {myAppointments.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('reminders')}
          className={`pb-3 px-4 font-bold text-xs border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'reminders'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>💬 SMS хабарламалар</span>
          {myReminders.length > 0 && (
            <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {myReminders.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: CATALOG OF CABINETS */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cabinets.map((cab) => {
            const assignedDoctor = doctors.find((d) => d.assignedCabinet === cab.number);
            return (
              <div
                key={cab.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-md font-extrabold text-xs">
                      №{cab.number} кабинет
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        cab.status === 'available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : cab.status === 'booked'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {cab.status === 'available' ? 'Қолжетімді ✓' : cab.status === 'booked' ? 'Брондалған' : 'Өңдеуде'}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 mb-1">{cab.title}</h3>
                  <div className="text-xs text-slate-500 mb-3">
                    🏢 {cab.floor}-қабат · {cab.category}
                  </div>

                  {assignedDoctor ? (
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-3 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs">
                        {assignedDoctor.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{assignedDoctor.name}</div>
                        <div className="text-[10px] text-teal-700">{assignedDoctor.specialty || 'Дәрігер'}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 italic mb-3">Дәрігерді таңдап жазылуға болады</div>
                  )}

                  <div className="text-[11px] font-semibold text-slate-600 mb-1.5">Жабдықтары:</div>
                  <div className="flex flex-wrap gap-1">
                    {cab.equipment.map((eq, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        ✓ {eq}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenBooking(cab)}
                    className="w-full py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Дәрігерге жазылу</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: MY APPOINTMENTS & PASSES */}
      {activeTab === 'my-appointments' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900">Менің қабылдау кестелерім және талондарым</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Қабылдауға белгіленген уақытта кешікпей келуіңізді сұраймыз.
            </p>
          </div>

          {myAppointments.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-xs">Сізде әзірге жазылған қабылдаулар жоқ.</p>
              <button
                onClick={() => setActiveTab('catalog')}
                className="mt-3 px-4 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl hover:bg-teal-700 transition"
              >
                Дәрігерлер каталогын ашу
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {myAppointments.map((app) => (
                <div key={app.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        №{app.cabinetNumber} каб.
                      </span>
                      <span className="font-bold text-sm text-slate-900">{app.doctorName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          app.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {app.status === 'confirmed' ? 'Расталған ✓' : app.status === 'completed' ? 'Қабылданды' : 'Бас тартылды'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <strong>{app.date}</strong>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono font-bold text-slate-800">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {app.time}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 italic">Шағым: «{app.symptoms}»</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onViewTicket(app)}
                      className="px-3 py-1.5 bg-teal-600 text-white font-bold text-xs rounded-xl hover:bg-teal-700 transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Талонды көру / Басу</span>
                    </button>
                    {app.status === 'confirmed' && (
                      <button
                        onClick={() => onCancelAppointment(app.id)}
                        className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl hover:bg-rose-100 transition"
                      >
                        Бас тарту
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SMS REMINDERS */}
      {activeTab === 'reminders' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs p-5">
          <h3 className="font-extrabold text-sm text-slate-900 mb-1">Келген хабарламалар және еске салғыштар</h3>
          <p className="text-xs text-slate-500 mb-4">
            Жүйе қабылдауға жазылғанда сіздің телефоныңызға автоматты SMS хабарлама жолдайды.
          </p>

          {myReminders.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">Хабарламалар тарихы бос.</p>
          ) : (
            <div className="space-y-3">
              {myReminders.map((rem) => (
                <div key={rem.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    SMS
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{rem.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{rem.sentAt}</span>
                    </div>
                    <p className="text-xs text-slate-600">{rem.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Modal */}
      {bookingModalOpen && selectedCabinet && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-extrabold text-sm text-slate-900">
                №{selectedCabinet.number} кабинет — Қабылдауға жазылу
              </h3>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitBooking} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Дәрігерді таңдаңыз *
                </label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty || 'Терапевт'}) — №{d.assignedCabinet || '101'} каб.
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Күні *</label>
                  <input
                    type="date"
                    required
                    value={appDate}
                    onChange={(e) => setAppDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Уақыты *</label>
                  <select
                    value={appTime}
                    onChange={(e) => setAppTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  >
                    <option value="09:00">09:00</option>
                    <option value="09:30">09:30</option>
                    <option value="10:00">10:00</option>
                    <option value="10:30">10:30</option>
                    <option value="11:00">11:00</option>
                    <option value="11:30">11:30</option>
                    <option value="14:00">14:00</option>
                    <option value="14:30">14:30</option>
                    <option value="15:00">15:00</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Шағымыңыз немесе қабылдау мақсаты *
                </label>
                <textarea
                  required
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Мысалы: Жүрек соғысының жиілеуі, кеңес алу"
                ></textarea>
              </div>

              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-[11px] text-teal-900">
                ✓ Жазылу расталған соң экранда ресми қабылдау талоныңыз ашылады.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Бас тарту
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Жазылуды растау ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

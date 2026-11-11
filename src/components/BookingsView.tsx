import React from 'react';
import { Booking, Appointment, User } from '../types';
import { CalendarCheck, Clock, Printer, XCircle, CheckCircle2, ShieldCheck, Stethoscope, UserRound } from 'lucide-react';

interface BookingsViewProps {
  currentUser: User;
  bookings: Booking[];
  appointments: Appointment[];
  onCancelBooking: (bookingId: string) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onCompleteAppointment: (appointmentId: string) => void;
  onPrintAppointment: (appointment: Appointment) => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  currentUser,
  bookings,
  appointments,
  onCancelBooking,
  onCancelAppointment,
  onCompleteAppointment,
  onPrintAppointment,
}) => {
  // If role is Patient
  if (currentUser.role === 'patient') {
    const myAppointments = appointments.filter(
      (a) => a.patientId === currentUser.id || a.patientName === currentUser.name
    );

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserRound className="w-5 h-5 text-teal-600" />
                Менің дәрігерге жазылуларым (Қабылдау талондары)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Науқас: <strong>{currentUser.name}</strong> · ЖСН: {currentUser.iin || '920415350124'}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200/80 rounded-lg self-start sm:self-auto">
              Жалпы: {myAppointments.length} жазылу
            </span>
          </div>

          {myAppointments.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <CalendarCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">Сізде белсенді жазылулар жоқ</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Кабинеттер каталогынан дәрігер қабылдауына жазыла аласыз.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500">
                    <th className="py-3 px-3 font-bold">Дәрігер</th>
                    <th className="py-3 px-3 font-bold">Кабинет</th>
                    <th className="py-3 px-3 font-bold">Күні мен уақыты</th>
                    <th className="py-3 px-3 font-bold">Шағым / Мақсат</th>
                    <th className="py-3 px-3 font-bold">Күйі</th>
                    <th className="py-3 px-3 font-bold text-right">Әрекеттер</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myAppointments.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <strong className="text-slate-900 block font-bold">{app.doctorName}</strong>
                        <span className="text-[11px] text-teal-600">Кардиолог-терапевт</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                          №{app.cabinetNumber}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-mono text-slate-800 font-semibold">{app.date}</div>
                        <div className="font-mono text-[11px] text-slate-500">{app.time}</div>
                      </td>
                      <td className="py-3.5 px-3 max-w-xs">
                        <p className="truncate text-slate-700" title={app.symptoms}>
                          {app.symptoms}
                        </p>
                      </td>
                      <td className="py-3.5 px-3">
                        {app.status === 'confirmed' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Расталды
                          </span>
                        ) : app.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            Аяқталды
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            Бас тартылды
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onPrintAppointment(app)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors cursor-pointer"
                            title="Қабылдау талонын басып шығару"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Талон</span>
                          </button>

                          {app.status === 'confirmed' && (
                            <button
                              onClick={() => onCancelAppointment(app.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                              title="Қабылдаудан бас тарту"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Бас тарту</span>
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
      </div>
    );
  }

  // If role is Doctor
  if (currentUser.role === 'doctor') {
    const myBookings = bookings.filter((b) => b.doctorId === currentUser.id || b.doctorName.includes(currentUser.name));
    const doctorAppointments = appointments.filter(
      (a) => a.doctorId === currentUser.id || a.doctorName.includes(currentUser.name)
    );

    return (
      <div className="space-y-6">
        {/* Section 1: Doctor's Booked Cabinets */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-600" />
                Менің брондаған кабинеттерім
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Дәрігер: <strong>{currentUser.name}</strong> · Бекітілген сағаттар
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg">
              {myBookings.length} белсенді бронь
            </span>
          </div>

          {myBookings.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-xs font-semibold text-slate-700">Қазіргі уақытта брондалған кабинеттеріңіз жоқ</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Кабинеттер каталогынан қажетті кабинетті брондаңыз.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500">
                    <th className="py-3 px-3 font-bold">Кабинет</th>
                    <th className="py-3 px-3 font-bold">Күні</th>
                    <th className="py-3 px-3 font-bold">Уақыт аралығы</th>
                    <th className="py-3 px-3 font-bold">Брондау мақсаты</th>
                    <th className="py-3 px-3 font-bold">Стерилизация</th>
                    <th className="py-3 px-3 font-bold text-right">Әрекет</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <span className="font-extrabold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
                          №{b.cabinetNumber} кабинет
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-medium">{b.date}</td>
                      <td className="py-3.5 px-3 font-mono font-semibold text-slate-800">
                        {b.startTime} — {b.endTime}
                      </td>
                      <td className="py-3.5 px-3 text-slate-700">{b.purpose}</td>
                      <td className="py-3.5 px-3">
                        {b.needsSterilization ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                            ✓ Кварцталған
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500">Стандартты</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => onCancelBooking(b.id)}
                          className="px-3 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                        >
                          Кабинетті босату
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 2: Patient Queue for Doctor */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600" />
                Қабылдауға жазылған науқастар кезегі
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Дәрігердің бүгінгі қабылдау кестесі
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg">
              {doctorAppointments.length} науқас
            </span>
          </div>

          {doctorAppointments.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-xs font-semibold text-slate-700">Қазіргі таңда қабылдау кезегі бос</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500">
                    <th className="py-3 px-3 font-bold">Науқас аты-жөні</th>
                    <th className="py-3 px-3 font-bold">Байланыс телефоны</th>
                    <th className="py-3 px-3 font-bold">Күні мен уақыты</th>
                    <th className="py-3 px-3 font-bold">Шағым / Себеп</th>
                    <th className="py-3 px-3 font-bold">Күйі</th>
                    <th className="py-3 px-3 font-bold text-right">Әрекеттер</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {doctorAppointments.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-slate-900">{app.patientName}</td>
                      <td className="py-3.5 px-3 font-mono text-slate-700">{app.patientPhone}</td>
                      <td className="py-3.5 px-3 font-mono font-semibold text-slate-800">
                        {app.date} · {app.time}
                      </td>
                      <td className="py-3.5 px-3 text-slate-700 max-w-xs">{app.symptoms}</td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            app.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {app.status === 'confirmed' ? 'Күтілуде' : 'Қабылданды'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {app.status === 'confirmed' && (
                            <button
                              onClick={() => onCompleteAppointment(app.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                            >
                              Қабылданды ✓
                            </button>
                          )}
                          <button
                            onClick={() => onPrintAppointment(app)}
                            className="p-1 text-slate-500 hover:text-slate-800 transition-colors"
                            title="Талонды көру"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If role is Admin (Full Clinic Records)
  return (
    <div className="space-y-6">
      {/* Admin Bookings Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Клиникадағы барлық кабинеттердің броньдары
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Әкімшілік бақылау журналы · Барлық броньдарды басқару
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg border border-slate-200">
            Барлығы: {bookings.length} бронь
          </span>
        </div>

        {bookings.length === 0 ? (
          <p className="text-center py-6 text-xs text-slate-500">Клиникада белсенді броньдар жоқ.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500">
                  <th className="py-3 px-3 font-bold">Кабинет</th>
                  <th className="py-3 px-3 font-bold">Дәрігер</th>
                  <th className="py-3 px-3 font-bold">Күні</th>
                  <th className="py-3 px-3 font-bold">Уақыты</th>
                  <th className="py-3 px-3 font-bold">Мақсаты</th>
                  <th className="py-3 px-3 font-bold text-right">Әрекет</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-extrabold text-teal-700">№{b.cabinetNumber}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{b.doctorName}</td>
                    <td className="py-3 px-3 font-mono">{b.date}</td>
                    <td className="py-3 px-3 font-mono text-slate-800">
                      {b.startTime} — {b.endTime}
                    </td>
                    <td className="py-3 px-3 text-slate-700">{b.purpose}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onCancelBooking(b.id)}
                        className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Жою
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin Appointments Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-teal-600" />
              Клиникадағы барлық науқастардың қабылдаулары
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Науқастардың дәрігерлерге жазылу кестесі
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-teal-50 text-teal-800 rounded-lg border border-teal-200">
            Барлығы: {appointments.length} қабылдау
          </span>
        </div>

        {appointments.length === 0 ? (
          <p className="text-center py-6 text-xs text-slate-500">Тіркелген қабылдаулар жоқ.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500">
                  <th className="py-3 px-3 font-bold">Науқас</th>
                  <th className="py-3 px-3 font-bold">Телефон</th>
                  <th className="py-3 px-3 font-bold">Дәрігер</th>
                  <th className="py-3 px-3 font-bold">Кабинет</th>
                  <th className="py-3 px-3 font-bold">Уақыты</th>
                  <th className="py-3 px-3 font-bold">Күйі</th>
                  <th className="py-3 px-3 font-bold text-right">Әрекеттер</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{a.patientName}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{a.patientPhone}</td>
                    <td className="py-3 px-3 text-teal-800 font-semibold">{a.doctorName}</td>
                    <td className="py-3 px-3 font-extrabold text-teal-700">№{a.cabinetNumber}</td>
                    <td className="py-3 px-3 font-mono">
                      {a.date} | {a.time}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {a.status === 'confirmed' ? 'Расталған' : a.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPrintAppointment(a)}
                          className="px-2 py-1 text-xs text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg cursor-pointer"
                        >
                          Талон
                        </button>
                        <button
                          onClick={() => onCancelAppointment(a.id)}
                          className="px-2 py-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg cursor-pointer"
                        >
                          Жою
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

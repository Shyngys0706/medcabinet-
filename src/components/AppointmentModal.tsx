import React, { useState } from 'react';
import { Cabinet, User } from '../types';
import { X, Calendar, Clock, Stethoscope, UserCheck, FileText } from 'lucide-react';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cabinet: Cabinet | null;
  currentUser: User;
  doctors: User[];
  onConfirmAppointment: (appointmentData: {
    patientId: string;
    patientName: string;
    patientPhone: string;
    patientIin: string;
    doctorId: string;
    doctorName: string;
    cabinetNumber: string;
    date: string;
    time: string;
    symptoms: string;
  }) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  cabinet,
  currentUser,
  doctors,
  onConfirmAppointment,
}) => {
  const defaultDoctor = doctors.find((d) => d.role === 'doctor') || doctors[0];
  const [selectedDoctorId, setSelectedDoctorId] = useState(defaultDoctor?.id || '');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:30');
  const [symptoms, setSymptoms] = useState('Қан қысымын тексеру, кеңес алу және кардиограмма');

  if (!isOpen) return null;

  const currentSelectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || defaultDoctor;
  const targetCabinetNumber = cabinet ? cabinet.number : currentSelectedDoctor?.assignedCabinet || '102';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmAppointment({
      patientId: currentUser.id,
      patientName: currentUser.name,
      patientPhone: currentUser.phone,
      patientIin: currentUser.iin || '920415350124',
      doctorId: currentSelectedDoctor?.id || 'user-doctor',
      doctorName: currentSelectedDoctor?.name || 'Д-р Берік Ерболұлы',
      cabinetNumber: targetCabinetNumber,
      date,
      time,
      symptoms,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Дәрігердің қабылдауына жазылу</h3>
            <p className="text-xs text-slate-500">
              Науқас: <strong className="text-teal-700">{currentUser.name}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Doctor Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                Дәрігерді таңдаңыз
              </label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-teal-600 focus:border-teal-600 bg-white"
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} — {doc.specialty || 'Маман дәрігер'} (№{doc.assignedCabinet || '102'} каб.)
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor & Cabinet Context Summary */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Тағайындалған кабинет:</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  №{targetCabinetNumber} кабинет
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Санат:</span>
                <span className="font-semibold text-teal-700">
                  {currentSelectedDoctor?.specialty || 'Кардиолог-терапевт'}
                </span>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Қабылдау күні
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-teal-600 focus:border-teal-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Уақыты
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-teal-600 focus:border-teal-600 bg-white"
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
                  <option value="15:30">15:30</option>
                </select>
              </div>
            </div>

            {/* Symptoms / Complaints */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                Шағым немесе қабылдау себебі
              </label>
              <textarea
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Мысалы: Бас ауруы, қан қысымын тексеру, жалпы тексеру..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-teal-600 focus:border-teal-600"
                required
              />
            </div>

            {/* Patient Credentials Confirmation */}
            <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-xl text-xs space-y-1">
              <span className="font-bold text-teal-900 block flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-teal-700" />
                Тіркелген науқас мәліметтері:
              </span>
              <p className="text-teal-800 text-[11px]">
                Аты-жөні: <strong>{currentUser.name}</strong> · Тел: <span className="font-mono">{currentUser.phone}</span>
              </p>
              <p className="text-teal-700 text-[11px]">
                ЖСН: <span className="font-mono">{currentUser.iin || '920415350124'}</span> · Сақтандыру полисі: <span className="font-mono">{currentUser.insuranceNumber || 'KZ-998821'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-4 bg-slate-50 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer"
            >
              Бас тарту
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs cursor-pointer"
            >
              Қабылдауға жазылуды растау
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

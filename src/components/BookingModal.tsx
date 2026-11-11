import React, { useState } from 'react';
import { Cabinet, User } from '../types';
import { X, Calendar, Clock, Sparkles } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  cabinet: Cabinet | null;
  currentUser: User;
  onConfirmBooking: (bookingData: {
    cabinetId: string;
    cabinetNumber: string;
    doctorId: string;
    doctorName: string;
    date: string;
    startTime: string;
    endTime: string;
    purpose: string;
    needsSterilization: boolean;
  }) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  cabinet,
  currentUser,
  onConfirmBooking,
}) => {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('14:00');
  const [purpose, setPurpose] = useState('Жоспарлы пациенттерді қабылдау және диагностика');
  const [needsSterilization, setNeedsSterilization] = useState(true);

  if (!isOpen || !cabinet) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmBooking({
      cabinetId: cabinet.id,
      cabinetNumber: cabinet.number,
      doctorId: currentUser.id,
      doctorName: currentUser.name,
      date,
      startTime,
      endTime,
      purpose,
      needsSterilization,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Кабинетті брондау</h3>
            <p className="text-xs text-slate-500">
              Дәрігер: <strong className="text-teal-700">{currentUser.name}</strong>
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
          <div className="p-6 space-y-4">
            {/* Cabinet Target Info */}
            <div className="p-3 bg-teal-50 border border-teal-200/80 rounded-xl">
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
                Таңдалған кабинет
              </span>
              <p className="text-sm font-extrabold text-teal-950 mt-0.5">
                №{cabinet.number} — {cabinet.title}
              </p>
              <p className="text-xs text-teal-700 mt-0.5">
                {cabinet.floor}-қабат · {cabinet.category}
              </p>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Брондау күні
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-teal-600 focus:border-teal-600"
                required
              />
            </div>

            {/* Start and End Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Басталу уақыты
                </label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-teal-600 focus:border-teal-600 bg-white"
                >
                  <option value="08:00">08:00</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Аяқталу уақыты
                </label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-teal-600 focus:border-teal-600 bg-white"
                >
                  <option value="12:00">12:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="16:00">16:00</option>
                  <option value="18:00">18:00</option>
                  <option value="20:00">20:00</option>
                </select>
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Брондау мақсаты / Қабылдау кестесі
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Мысалы: Пациенттерді қабылдау"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-teal-600 focus:border-teal-600"
                required
              />
            </div>

            {/* Quartz and Sterilization Request */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={needsSterilization}
                  onChange={(e) => setNeedsSterilization(e.target.checked)}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    Санитарлық кварцтау және стерилизация сұранысы
                  </span>
                  <span className="text-slate-500 block text-[11px] mt-0.5">
                    Қабылдау алдында кабинетті ультракүлгін шаммен дезинфекциялау тапсырмасы медбикеге жіберіледі.
                  </span>
                </div>
              </label>
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
              Растап брондау
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

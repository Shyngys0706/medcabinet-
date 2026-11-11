import React from 'react';
import { Appointment, User } from '../types';
import { X, Printer, ShieldCheck } from 'lucide-react';

interface PrintPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  patientUser?: User;
  doctorUser?: User;
}

export const PrintPassModal: React.FC<PrintPassModalProps> = ({
  isOpen,
  onClose,
  appointment,
  patientUser,
  doctorUser,
}) => {
  if (!isOpen || !appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-slate-50/50 no-print">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">Ресми қабылдау талоны</span>
            <span className="text-[10px] bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded">
              №{appointment.id.toUpperCase().slice(-6)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Pass Container */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          <div
            id="printable-pass"
            className="border-2 border-teal-700/80 rounded-2xl p-6 bg-white relative shadow-xs"
          >
            {/* Top Seal & Heading */}
            <div className="text-center pb-4 border-b-2 border-dashed border-teal-200">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-teal-700 text-white font-black text-lg mb-2 shadow-xs">
                ✚
              </div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800">
                Қазақстан Республикасы · Денсаулық сақтау
              </h2>
              <h1 className="text-base font-extrabold text-slate-900 mt-0.5">
                «MEDCABINET» КЛИНИКАЛЫҚ ОРТАЛЫҒЫ
              </h1>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Дәрігердің қабылдауына жазылу талоны (Ресми құжат)
              </p>
            </div>

            {/* Date & Time Highlight Box */}
            <div className="my-4 p-3 bg-teal-50/70 border border-teal-200 rounded-xl flex items-center justify-between text-center">
              <div className="flex-1 border-r border-teal-200">
                <span className="text-[10px] font-bold text-teal-800 uppercase block">Қабылдау күні</span>
                <span className="text-sm font-extrabold text-teal-950 font-mono">{appointment.date}</span>
              </div>
              <div className="flex-1 border-r border-teal-200">
                <span className="text-[10px] font-bold text-teal-800 uppercase block">Уақыты</span>
                <span className="text-sm font-extrabold text-teal-950 font-mono">{appointment.time}</span>
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-teal-800 uppercase block">Кабинет</span>
                <span className="text-base font-black text-teal-700">№{appointment.cabinetNumber}</span>
              </div>
            </div>

            {/* Patient & Doctor Table */}
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Науқас:</span>
                <strong className="text-slate-900">{appointment.patientName}</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">ЖСН (ИИН):</span>
                <span className="font-mono font-semibold text-slate-800">
                  {appointment.patientIin || patientUser?.iin || '920415350124'}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Телефон:</span>
                <span className="font-mono text-slate-800">{appointment.patientPhone}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">МӘМС сақтандыру полисі:</span>
                <span className="font-mono text-slate-800">
                  {patientUser?.insuranceNumber || 'KZ-998821'} (Белсенді)
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Қабылдаушы дәрігер:</span>
                <strong className="text-teal-800">{appointment.doctorName}</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Мамандығы:</span>
                <span className="text-slate-800">{doctorUser?.specialty || 'Кардиолог-терапевт'}</span>
              </div>

              <div className="py-1">
                <span className="text-slate-500 font-medium block mb-0.5">Шағым / Мақсат:</span>
                <p className="text-slate-800 italic bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px]">
                  «{appointment.symptoms}»
                </p>
              </div>
            </div>

            {/* Bottom: Stamp & Barcode Simulation */}
            <div className="mt-5 pt-4 border-t border-dashed border-teal-200 flex items-center justify-between">
              {/* Barcode graphic */}
              <div>
                <div className="flex items-center gap-[2px] h-8">
                  {[2, 4, 1, 3, 5, 2, 1, 4, 2, 3, 1, 4, 5, 2, 3, 2, 4, 1, 2, 3].map((w, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800 h-full"
                      style={{ width: `${w * 1.5}px` }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[9px] text-slate-400 block mt-1">
                  ID: {appointment.id.toUpperCase()}
                </span>
              </div>

              {/* Official Stamp */}
              <div className="border-2 border-teal-700 text-teal-800 rounded-full w-20 h-20 flex flex-col items-center justify-center p-1 text-center -rotate-6 select-none opacity-90">
                <ShieldCheck className="w-4 h-4 text-teal-700 mb-0.5" />
                <span className="text-[7px] font-black uppercase tracking-tighter leading-none">
                  MEDCABINET
                </span>
                <span className="text-[6px] font-bold text-teal-600 uppercase leading-none mt-0.5">
                  БЕКІТІЛДІ
                </span>
                <span className="text-[6px] text-slate-500 font-mono leading-none mt-0.5">
                  KZ-DENSAULYQ
                </span>
              </div>
            </div>

            <div className="text-center mt-3 pt-2 text-[10px] text-slate-400">
              * Қабылдауға 10 минут бұрын келуіңізді және жеке куәлікті ұсынуыңызды сұраймыз.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50 border-t border-slate-100 no-print">
          <span className="text-xs text-slate-500">
            Баспадан шығару немесе PDF түрінде сақтау
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer"
            >
              Жабу
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Басып шығару (Print)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

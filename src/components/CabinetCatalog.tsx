import React, { useState } from 'react';
import { Cabinet, CabinetStatus, User } from '../types';
import { Search, Building, CheckCircle2, Clock, Sparkles, Wrench, CalendarPlus, UserCheck, RefreshCw, Trash2 } from 'lucide-react';

interface CabinetCatalogProps {
  cabinets: Cabinet[];
  currentUser: User;
  onOpenBooking: (cabinet: Cabinet) => void;
  onOpenAppointment: (cabinet: Cabinet) => void;
  onCycleStatus: (cabinetId: string) => void;
  onDeleteCabinet: (cabinetId: string) => void;
  totalCabinets: number;
  availableCount: number;
  bookedCount: number;
  appointmentsCount: number;
}

export const CabinetCatalog: React.FC<CabinetCatalogProps> = ({
  cabinets,
  currentUser,
  onOpenBooking,
  onOpenAppointment,
  onCycleStatus,
  onDeleteCabinet,
  totalCabinets,
  availableCount,
  bookedCount,
  appointmentsCount,
}) => {
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCabinets = cabinets.filter((cab) => {
    const matchFloor = selectedFloor === 'all' || cab.floor === selectedFloor;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      cab.number.toLowerCase().includes(q) ||
      cab.title.toLowerCase().includes(q) ||
      cab.category.toLowerCase().includes(q) ||
      cab.equipment.some((eq) => eq.toLowerCase().includes(q));
    return matchFloor && matchSearch;
  });

  const getStatusBadge = (status: CabinetStatus) => {
    switch (status) {
      case 'available':
        return {
          label: 'Бос (Қолжетімді)',
          cls: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
        };
      case 'booked':
        return {
          label: 'Брондалған',
          cls: 'bg-sky-50 text-sky-700 border-sky-200/80',
          icon: <Clock className="w-3.5 h-3.5 text-sky-600" />,
        };
      case 'sanitizing':
        return {
          label: 'Санитарлық өңдеуде',
          cls: 'bg-amber-50 text-amber-700 border-amber-200/80',
          icon: <Sparkles className="w-3.5 h-3.5 text-amber-600" />,
        };
      case 'maintenance':
        return {
          label: 'Жөндеуде',
          cls: 'bg-rose-50 text-rose-700 border-rose-200/80',
          icon: <Wrench className="w-3.5 h-3.5 text-rose-600" />,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* 4-Item Statistics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Жалпы кабинеттер</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5 tabular-nums">{totalCabinets}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            🏢
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Қолжетімді бос</p>
            <h3 className="text-2xl font-extrabold text-emerald-600 mt-0.5 tabular-nums">{availableCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            ✓
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Брондалған кабинеттер</p>
            <h3 className="text-2xl font-extrabold text-sky-600 mt-0.5 tabular-nums">{bookedCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            📅
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Тіркелген қабылдаулар</p>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-0.5 tabular-nums">{appointmentsCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            👥
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Кабинет нөмірі, атауы, аппаратура бойынша іздеу..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-teal-600 focus:border-teal-600 bg-slate-50/50"
          />
        </div>

        {/* Floor Segmented Control */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Building className="w-3.5 h-3.5" />
            Қабат:
          </span>

          {(['all', 1, 2, 3, 4] as const).map((floor) => {
            const isSelected = selectedFloor === floor;
            return (
              <button
                key={String(floor)}
                onClick={() => setSelectedFloor(floor)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {floor === 'all' ? 'Барлығы' : `${floor}-қабат`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cabinets Grid */}
      {filteredCabinets.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
          <h4 className="text-sm font-bold text-slate-700">Кабинеттер табылмады</h4>
          <p className="text-xs text-slate-500 mt-1">Іздеу сөзін немесе қабатты өзгертіп көріңіз.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCabinets.map((cab) => {
            const statusObj = getStatusBadge(cab.status);
            return (
              <div
                key={cab.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden"
              >
                {/* Header of Card */}
                <div className="p-5 pb-3 border-b border-slate-100">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100">
                      №{cab.number} кабинет
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusObj.cls}`}
                    >
                      {statusObj.icon}
                      <span>{statusObj.label}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{cab.title}</h3>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5">
                    <span>🏢 {cab.floor}-қабат</span>
                    <span aria-hidden="true">·</span>
                    <span>📁 {cab.category}</span>
                  </div>
                </div>

                {/* Body of Card: Equipment */}
                <div className="p-5 pt-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Медициналық жабдықтар:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cab.equipment.map((eq, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/70"
                        >
                          ✓ {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions - customized per active Demo Role */}
                <div className="p-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2">
                  {currentUser.role === 'patient' && (
                    <button
                      onClick={() => onOpenAppointment(cab)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Дәрігерге жазылу</span>
                    </button>
                  )}

                  {currentUser.role === 'doctor' && (
                    <button
                      onClick={() => onOpenBooking(cab)}
                      disabled={cab.status !== 'available'}
                      className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        cab.status === 'available'
                          ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      }`}
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                      <span>{cab.status === 'available' ? 'Кабинетті брондау' : 'Қазір бос емес'}</span>
                    </button>
                  )}

                  {currentUser.role === 'admin' && (
                    <>
                      <button
                        onClick={() => onCycleStatus(cab.id)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Кабинеттің жұмыс күйін ауыстыру"
                      >
                        <RefreshCw className="w-3 h-3 text-slate-500" />
                        <span>Күйін өзгерту</span>
                      </button>

                      <button
                        onClick={() => onOpenBooking(cab)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-colors cursor-pointer"
                      >
                        <span>Брондау</span>
                      </button>

                      <button
                        onClick={() => onDeleteCabinet(cab.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                        title="Кабинетті базадан өшіру"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

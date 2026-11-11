import React, { useState } from 'react';
import { X, Building2, Stethoscope, Plus } from 'lucide-react';

interface NewCabinetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCabinet: (cabData: {
    number: string;
    title: string;
    floor: number;
    category: string;
    equipment: string[];
  }) => void;
  existingNumbers: string[];
}

export const NewCabinetModal: React.FC<NewCabinetModalProps> = ({
  isOpen,
  onClose,
  onAddCabinet,
  existingNumbers,
}) => {
  const [number, setNumber] = useState('');
  const [floor, setFloor] = useState<number>(2);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [equipmentInput, setEquipmentInput] = useState('Кушетка, Қан қысымын өлшегіш, Дәрігерлік үстел');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNum = number.trim();
    if (!trimmedNum) {
      setError('Кабинет нөмірін енгізіңіз');
      return;
    }
    if (existingNumbers.includes(trimmedNum)) {
      setError(`№${trimmedNum} кабинет базада бар. Басқа нөмір таңдаңыз.`);
      return;
    }

    const equipmentList = equipmentInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    onAddCabinet({
      number: trimmedNum,
      title: title.trim() || `№${trimmedNum} медициналық кабинет`,
      floor,
      category: category.trim() || 'Жалпы бөлім',
      equipment: equipmentList.length > 0 ? equipmentList : ['Стандартты медициналық жабдық'],
    });

    // Reset form
    setNumber('');
    setTitle('');
    setCategory('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-teal-600" />
              Жаңа кабинет қосу
            </h3>
            <p className="text-xs text-slate-500">Клиника әкімшісінің басқару панелі</p>
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
            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Кабинет нөмірі
                </label>
                <input
                  type="text"
                  value={number}
                  onChange={(e) => {
                    setNumber(e.target.value);
                    setError('');
                  }}
                  placeholder="Мысалы: 204"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-teal-600 focus:border-teal-600 font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Қабаты
                </label>
                <select
                  value={floor}
                  onChange={(e) => setFloor(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-teal-600 focus:border-teal-600 bg-white"
                >
                  <option value={1}>1-қабат</option>
                  <option value={2}>2-қабат</option>
                  <option value={3}>3-қабат</option>
                  <option value={4}>4-қабат</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Кабинет атауы
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Мысалы: Эндокринология және диабет орталығы"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-teal-600 focus:border-teal-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Бөлім / Санат
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Мысалы: Терапия, Хирургия, Диагностика"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-teal-600 focus:border-teal-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Жабдықтар (үтір арқылы жазыңыз)
              </label>
              <textarea
                rows={2}
                value={equipmentInput}
                onChange={(e) => setEquipmentInput(e.target.value)}
                placeholder="ЭКГ аппараты, Кушетка, Бой өлшегіш..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-teal-600 focus:border-teal-600"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Мысалы: ЭКГ аппараты, Тонометр, Стетоскоп, Небулайзер
              </span>
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
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Базаға сақтау</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { User } from '../types';
import { Building2, CalendarDays, Bell, ShieldCheck, Save, Check, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  activeTab: 'catalog' | 'bookings' | 'reminders' | 'admin-records';
  onSelectTab: (tab: 'catalog' | 'bookings' | 'reminders' | 'admin-records') => void;
  onOpenProfile: () => void;
  onSaveDatabase: () => void;
  bookingsCount: number;
  remindersCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  onSelectTab,
  onOpenProfile,
  onSaveDatabase,
  bookingsCount,
  remindersCount,
}) => {
  const [justSaved, setJustSaved] = useState(false);

  const handleSaveClick = () => {
    onSaveDatabase();
    setJustSaved(true);
    setTimeout(() => {
      setJustSaved(false);
    }, 2000);
  };
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Клиника әкімшісі';
      case 'doctor':
        return 'Кардиолог дәрігер';
      case 'patient':
        return 'Тіркелген науқас';
      default:
        return role;
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 no-print">
      {/* Top author & status strip */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-teal-400 font-semibold">👨‍💻 Жоба авторы:</span>
            <span className="font-bold text-white">Жақсылық Шыңғысхан</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300">Курстық жұмыс: Медициналық кабинеттерді брондау веб-жүйесі</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-0.5 rounded text-[10px] text-teal-300">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block"></span>
              3 Демо аккаунт: Пациент · Дәрігер · Админ
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <a
              href="/kurstyk_zhumys_teoriya.docx"
              download
              className="text-teal-400 hover:text-teal-300 font-semibold underline decoration-teal-500/50"
              title="Курстық жұмыстың ресми Word теориясын жүктеп алу (.docx)"
            >
              📄 Курстық жұмыс (.docx)
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              ✚
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900">MedCabinet</span>
                <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-200 font-semibold px-1.5 py-0.5 rounded">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                by <strong className="text-teal-700 font-medium">Жақсылық Ш.</strong> · Дәрігерлік портал
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onSelectTab('catalog')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-teal-50 text-teal-700 border border-teal-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Кабинеттер каталогы</span>
            </button>

            <button
              onClick={() => onSelectTab('bookings')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-teal-50 text-teal-700 border border-teal-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>
                {currentUser.role === 'patient'
                  ? 'Менің қабылдауларым'
                  : currentUser.role === 'doctor'
                  ? 'Кабинеттер & Кесте'
                  : 'Брондар мен қабылдаулар'}
              </span>
              {bookingsCount > 0 && (
                <span className="bg-teal-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {bookingsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('reminders')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'reminders'
                  ? 'bg-teal-50 text-teal-700 border border-teal-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>SMS еске салғыштар</span>
              {remindersCount > 0 && (
                <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {remindersCount}
                </span>
              )}
            </button>

            {currentUser.role === 'admin' && (
              <button
                onClick={() => onSelectTab('admin-records')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'admin-records'
                    ? 'bg-teal-50 text-teal-700 border border-teal-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Әкімшілік бақылау</span>
              </button>
            )}
          </nav>

          {/* Right actions: Profile & Export */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSaveClick}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer ${
                justSaved
                  ? 'bg-emerald-600 text-white border border-emerald-500 scale-105'
                  : 'bg-teal-600 hover:bg-teal-700 text-white border border-teal-600'
              }`}
              title="Барлық өзгерістерді браузер жадында бірден сақтау"
            >
              {justSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Сақталды ✓</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Сақтау</span>
                </>
              )}
            </button>

            {/* Profile trigger button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-slate-200 bg-slate-50/80 hover:bg-slate-100 hover:border-teal-400 transition-all cursor-pointer group"
              title="Жеке кабинет және профильді баптау"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-slate-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div
                className={`w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold text-xs items-center justify-center border border-teal-200 ${
                  currentUser.avatar ? 'hidden' : 'flex'
                }`}
              >
                {currentUser.name.charAt(0)}
              </div>

              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight group-hover:text-teal-700 transition-colors">
                  {currentUser.name}
                </div>
                <div className="text-[10px] font-medium text-teal-600 leading-tight">
                  {getRoleLabel(currentUser.role)}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav tabs bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-2 py-1.5 bg-slate-50/70">
        <button
          onClick={() => onSelectTab('catalog')}
          className={`px-2 py-1 text-xs font-semibold rounded ${
            activeTab === 'catalog' ? 'text-teal-700 font-bold' : 'text-slate-600'
          }`}
        >
          Кабинеттер
        </button>
        <button
          onClick={() => onSelectTab('bookings')}
          className={`px-2 py-1 text-xs font-semibold rounded ${
            activeTab === 'bookings' ? 'text-teal-700 font-bold' : 'text-slate-600'
          }`}
        >
          Брондар ({bookingsCount})
        </button>
        <button
          onClick={() => onSelectTab('reminders')}
          className={`px-2 py-1 text-xs font-semibold rounded ${
            activeTab === 'reminders' ? 'text-teal-700 font-bold' : 'text-slate-600'
          }`}
        >
          SMS ({remindersCount})
        </button>
        {currentUser.role === 'admin' && (
          <button
            onClick={() => onSelectTab('admin-records')}
            className={`px-2 py-1 text-xs font-semibold rounded ${
              activeTab === 'admin-records' ? 'text-teal-700 font-bold' : 'text-slate-600'
            }`}
          >
            Әкімшілік
          </button>
        )}
      </div>
    </header>
  );
};

import React from 'react';
import { User, UserRole } from '../types';
import { ShieldCheck, Stethoscope, UserRound, Plus, RotateCcw } from 'lucide-react';

interface RoleQuickBarProps {
  currentUser: User;
  allUsers: User[];
  onSwitchUser: (role: UserRole) => void;
  onOpenNewCabinet: () => void;
  onResetDatabase: () => void;
}

export const RoleQuickBar: React.FC<RoleQuickBarProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
  onOpenNewCabinet,
  onResetDatabase,
}) => {
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'doctor':
        return <Stethoscope className="w-4 h-4 text-teal-600" />;
      case 'patient':
        return <UserRound className="w-4 h-4 text-sky-600" />;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Клиника бас әкімшісі';
      case 'doctor':
        return 'Дәрігер (Кардиолог)';
      case 'patient':
        return 'Науқас (Пациент)';
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Left: 3 Demo Accounts Switcher */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
              3 Демо аккаунт:
            </span>

            {allUsers.map((user) => {
              const isActive = currentUser.id === user.id;
              return (
                <button
                  key={user.id}
                  onClick={() => onSwitchUser(user.role)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs ring-2 ring-slate-900/10'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                  }`}
                  title={`${getRoleBadge(user.role)}: ${user.name}`}
                >
                  <span className={isActive ? 'text-white' : ''}>
                    {getRoleIcon(user.role)}
                  </span>
                  <span className="font-semibold whitespace-nowrap">{user.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium whitespace-nowrap ${
                      isActive
                        ? 'bg-slate-800 text-slate-200'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {user.role === 'admin' ? 'Әкімші' : user.role === 'doctor' ? 'Дәрігер' : 'Пациент'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Quick Context Actions */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            {currentUser.role === 'admin' && (
              <button
                onClick={onOpenNewCabinet}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Жаңа кабинет қосу</span>
              </button>
            )}

            <button
              onClick={onResetDatabase}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              title="Базаны 3 таза демо аккаунтқа қалпына келтіру"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Базаны жаңарту</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

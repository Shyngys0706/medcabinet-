import React, { useState } from 'react';
import { registerUser, loginUser } from '../api';
import { User } from '../types';
import { ShieldCheck, User as UserIcon, Stethoscope, Lock, Phone, UserCheck, AlertCircle, CheckCircle2, Building2 } from 'lucide-react';

interface AuthScreenProps {
  onSuccess: (user: User, token: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');

  // Form states
  const [name, setName] = useState('');
  const [login, setLogin] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [specialty, setSpecialty] = useState('Кардиолог-терапевт');
  const [assignedCabinet, setAssignedCabinet] = useState('102');
  const [iin, setIin] = useState('');

  // Login form states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await registerUser({
        name,
        login,
        phone,
        password,
        role,
        specialty: role === 'doctor' ? specialty : undefined,
        assignedCabinet: role === 'doctor' ? assignedCabinet : undefined,
        iin: role === 'patient' ? iin : undefined,
      });

      setSuccessMsg('Тіркелу сәтті өтті! Жүйеге қосылуда...');
      setTimeout(() => {
        onSuccess(res.user, res.token);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Тіркелу барысында қате орын алды');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginUser(loginIdentifier, loginPassword);
      onSuccess(res.user, res.token);
    } catch (err: any) {
      setError(err.message || 'Кіру сәтсіз аяқталды');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background grid and blur */}
      <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>

      {/* Header Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white shadow-xl shadow-teal-500/20 mb-3">
          <span className="text-3xl font-extrabold">✚</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">MedCabinet</h1>
        <p className="mt-1 text-xs sm:text-sm text-teal-200">
          Медициналық кабинеттерді брондау және дәрігерге жазылу жүйесі
        </p>
        <div className="mt-2 text-[11px] text-slate-400">
          Серверлік деректер базасы · Автор: <strong className="text-teal-400">Жақсылық Шыңғысхан</strong>
        </div>
      </div>

      {/* Main Auth Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl border border-slate-100 sm:px-10">
          {/* Tab Switcher: Login / Register */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 pb-3 text-center text-sm font-bold border-b-2 transition-colors ${
                mode === 'login'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Кіру (Вход)
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 pb-3 text-center text-sm font-bold border-b-2 transition-colors ${
                mode === 'register'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Жаңа тіркелу (Регистрация)
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* Success Alert */}
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>{successMsg}</div>
            </div>
          )}

          {/* 1. РЕГИСТРАЦИЯ ФОРМАСЫ */}
          {mode === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Рөлді таңдау: Тек Пациент немесе Дәрігер (Админ опциясы жоқ!) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Рөлді таңдаңыз (Кім ретінде тіркелесіз?):
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRole('patient')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      role === 'patient'
                        ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <UserIcon className="w-4 h-4 text-teal-600" />
                      <span>Пациент (Науқас)</span>
                    </div>
                    <span className="text-[10px] text-slate-500 leading-tight">
                      Дәрігерге жазылу, талон алу
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('doctor')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      role === 'doctor'
                        ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Stethoscope className="w-4 h-4 text-teal-600" />
                      <span>Дәрігер (Врач)</span>
                    </div>
                    <span className="text-[10px] text-slate-500 leading-tight">
                      Кабинетті брондау, қабылдау кезегі
                    </span>
                  </button>
                </div>
                <div className="mt-1 text-[10px] text-slate-400 italic">
                  * Ескертпе: Әкімші (Админ) ретінде тіркелуге болмайды. Бас әкімші жүйеде бекітілген.
                </div>
              </div>

              {/* Толық аты-жөні */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Аты-жөніңіз (ФИО) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Мысалы: Бақыт Қайратұлы"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              {/* Бірегей логин */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Бірегей логин (Қайталанбайды) *
                </label>
                <input
                  type="text"
                  required
                  value={login}
                  onChange={(e) => setLogin(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="Мысалы: bakhyt_99"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono"
                />
                <span className="text-[10px] text-slate-400">Тек ағылшын кіші әріптері мен сандар</span>
              </div>

              {/* Бірегей телефон нөмірі */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Телефон нөмірі (Бір ғана аккаунт үшін) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (705) 123-45-67"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              {/* Дәрігер өрістері */}
              {role === 'doctor' && (
                <div className="grid grid-cols-2 gap-2 bg-teal-50/50 p-2.5 rounded-xl border border-teal-100">
                  <div>
                    <label className="block text-[11px] font-bold text-teal-900 mb-1">Мамандығы</label>
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="Кардиолог"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-teal-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-teal-900 mb-1">Кабинет №</label>
                    <input
                      type="text"
                      value={assignedCabinet}
                      onChange={(e) => setAssignedCabinet(e.target.value)}
                      placeholder="102"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-teal-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>
              )}

              {/* Пациент үшін ЖСН */}
              {role === 'patient' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ЖСН (ИИН - 12 сан)
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    value={iin}
                    onChange={(e) => setIin(e.target.value.replace(/\D/g, ''))}
                    placeholder="950312300456"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono tracking-wider"
                  />
                </div>
              )}

              {/* Құпия сөз */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Құпия сөз (Пароль) *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Кемінде 4 таңба"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              {/* Тіркелу батырмасы */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/20 transition-all disabled:opacity-50 mt-2"
              >
                {loading ? 'Серверге жазылуда...' : 'Тіркелу және жүйеге кіру ✓'}
              </button>
            </form>
          ) : (
            /* 2. КІРУ (LOGIN) ФОРМАСЫ */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Логин немесе телефон нөмірі
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Логин немесе телефон"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Құпия сөз (Пароль)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Құпия сөз"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/20 transition-all disabled:opacity-50"
              >
                {loading ? 'Тексерілуде...' : 'Жүйеге кіру'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

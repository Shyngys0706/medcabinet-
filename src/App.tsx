import React, { useState, useEffect, useCallback } from 'react';
import { User, Cabinet, Booking, Appointment, Reminder } from './types';
import { AuthScreen } from './components/AuthScreen';
import { PatientPortal } from './components/PatientPortal';
import { DoctorPortal } from './components/DoctorPortal';
import { AdminPortal } from './components/AdminPortal';
import { PrintPassModal } from './components/PrintPassModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import {
  fetchCabinets,
  fetchAppointments,
  fetchBookings,
  fetchReminders,
  fetchUsers,
  fetchDoctors,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  createBooking,
  deleteBooking,
  createCabinet,
  updateCabinet,
  deleteCabinet,
  updateUserProfile,
} from './api';
import { LogOut, User as UserIcon, Shield, Stethoscope, FileText, CheckCircle2 } from 'lucide-react';

const TOKEN_KEY = 'medcabinet_server_token';
const USER_KEY = 'medcabinet_server_user';

export default function App() {
  // 1. Session State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY) || null;
  });

  // 2. Data State (Loaded from server database)
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);

  // 3. UI State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [ticketAppointment, setTicketAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);

  const addToast = useCallback((title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 4. Load Data from Server
  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [cabs, apps, books, rems, docs] = await Promise.all([
        fetchCabinets(),
        fetchAppointments(),
        fetchBookings(),
        fetchReminders(),
        fetchDoctors(),
      ]);

      setCabinets(cabs);
      setAppointments(apps);
      setBookings(books);
      setReminders(rems);
      setDoctors(docs);

      // If admin, load full user list
      if (currentUser?.role === 'admin') {
        const allUsers = await fetchUsers();
        setUsers(allUsers);
      }
    } catch (err: any) {
      console.error('Серверден деректерді жүктеу қатесі:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.role]);

  useEffect(() => {
    if (currentUser) {
      loadAllData();
    }
  }, [currentUser, loadAllData]);

  // Auth Success Handler
  const handleAuthSuccess = (user: User, userToken: string) => {
    setCurrentUser(user);
    setToken(userToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, userToken);
    addToast('Қош келдіңіз!', `${user.name} жүйеге сәтті кірді`, 'success');
  };

  // Logout Handler
  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    addToast('Жүйеден шықтыңыз', 'Кіру парақшасына қайта бағытталдыңыз', 'info');
  };

  // ============================================================================
  // PATIENT ACTIONS
  // ============================================================================
  const handleBookAppointment = async (appData: {
    doctorId: string;
    doctorName: string;
    cabinetNumber: string;
    date: string;
    time: string;
    symptoms: string;
  }) => {
    if (!currentUser) return;
    try {
      const res = await createAppointment({
        patientId: currentUser.id,
        patientName: currentUser.name,
        patientPhone: currentUser.phone,
        patientIin: currentUser.iin || '920415350124',
        ...appData,
      });

      setAppointments((prev) => [res.appointment, ...prev]);
      if (res.reminder) {
        setReminders((prev) => [res.reminder, ...prev]);
      }
      addToast('Сәтті жазылдыңыз!', `Талон тіркелді және SMS хабарлама жіберілді`, 'success');
      // Экранда талон модалін ашу (принтерге өздігінен лақтырмай, экранға шығарады)
      setTicketAppointment(res.appointment);
    } catch (err: any) {
      addToast('Қате орын алды', err.message || 'Қабылдауға жазылу сәтсіз аяқталды', 'error');
    }
  };

  const handleCancelAppointment = async (id: string) => {
    if (!confirm('Қабылдаудан бас тартуды растайсыз ба?')) return;
    try {
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      addToast('Қабылдау жойылды', 'Жазылу тізімнен өшірілді', 'info');
    } catch (err: any) {
      addToast('Қате', err.message || 'Жою мүмкін болмады', 'error');
    }
  };

  // ============================================================================
  // DOCTOR ACTIONS
  // ============================================================================
  const handleCompleteAppointment = async (id: string) => {
    try {
      const updated = await updateAppointmentStatus(id, 'completed');
      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
      addToast('Қабылдау аяқталды', 'Науқас сәтті қабылданды деп белгіленді ✓', 'success');
    } catch (err: any) {
      addToast('Қате', err.message || 'Күйді жаңарту сәтсіз аяқталды', 'error');
    }
  };

  const handleCreateBooking = async (bookingData: {
    cabinetId: string;
    cabinetNumber: string;
    date: string;
    startTime: string;
    endTime: string;
    purpose: string;
    needsSterilization: boolean;
  }) => {
    if (!currentUser) return;
    try {
      const newBook = await createBooking({
        ...bookingData,
        doctorId: currentUser.id,
        doctorName: currentUser.name,
      });
      setBookings((prev) => [newBook, ...prev]);
      // Update cabinet status
      setCabinets((prev) =>
        prev.map((c) => (c.id === bookingData.cabinetId ? { ...c, status: 'booked' } : c))
      );
      addToast('Кабинет брондалды', `№${bookingData.cabinetNumber} кабинет сізге бекітілді`, 'success');
      loadAllData();
    } catch (err: any) {
      addToast('Қате', err.message || 'Брондау қатесі', 'error');
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!confirm('Кабинет бронын босатуды растайсыз ба?')) return;
    try {
      await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      addToast('Бронь жойылды', 'Кабинет босатылды', 'info');
      loadAllData();
    } catch (err: any) {
      addToast('Қате', err.message || 'Босату қатесі', 'error');
    }
  };

  // ============================================================================
  // ADMIN ACTIONS
  // ============================================================================
  const handleAddCabinet = async (cabData: {
    number: string;
    title: string;
    floor: number;
    category: string;
    equipment: string[];
  }) => {
    try {
      const created = await createCabinet(cabData);
      setCabinets((prev) => [...prev, created]);
      addToast('Кабинет қосылды', `№${created.number} кабинет серверлік базаға енгізілді`, 'success');
    } catch (err: any) {
      addToast('Қате', err.message || 'Кабинетті қосу қатесі', 'error');
    }
  };

  const handleToggleCabinetStatus = async (cabId: string, currentStatus: string) => {
    const order = ['available', 'booked', 'sanitizing', 'maintenance'];
    const nextIdx = (order.indexOf(currentStatus) + 1) % order.length;
    const nextStatus = order[nextIdx] as any;

    try {
      const updated = await updateCabinet(cabId, { status: nextStatus });
      setCabinets((prev) => prev.map((c) => (c.id === cabId ? updated : c)));
      addToast('Күй жаңартылды', `Кабинет жаңа күйі: ${nextStatus}`, 'info');
    } catch (err: any) {
      addToast('Қате', err.message || 'Күйді жаңарту қатесі', 'error');
    }
  };

  const handleDeleteCabinet = async (cabId: string) => {
    if (!confirm('Бұл кабинетті серверден өшіруді растайсыз ба?')) return;
    try {
      await deleteCabinet(cabId);
      setCabinets((prev) => prev.filter((c) => c.id !== cabId));
      addToast('Кабинет өшірілді', 'Кабинет базадан жойылды', 'info');
    } catch (err: any) {
      addToast('Қате', err.message || 'Өшіру мүмкін болмады', 'error');
    }
  };

  // 5. IF NOT LOGGED IN -> RENDER AUTH SCREEN (Register/Login)
  if (!currentUser) {
    return (
      <>
        <AuthScreen onSuccess={handleAuthSuccess} />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  // 6. LOGGED IN PORTAL VIEW
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <Shield className="w-3 h-3 text-purple-600" />
            Бас әкімші (Админ)
          </span>
        );
      case 'doctor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Stethoscope className="w-3 h-3 text-blue-600" />
            Дәрігер ({currentUser.specialty || 'Маман'})
          </span>
        );
      case 'patient':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <UserIcon className="w-3 h-3 text-emerald-600" />
            Пациент (Науқас)
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Universal Strip */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800 no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-teal-400 font-semibold">👨‍💻 Жоба авторы:</span>
            <span className="font-bold text-white">Жақсылық Шыңғысхан</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300">Курстық жұмыс (Медициналық интернет технологиялар)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 bg-slate-800 px-2 py-0.5 rounded text-[10px] text-teal-300">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block animate-pulse"></span>
              Серверлік деректер базасы белсенді
            </span>
            <span className="text-slate-600">|</span>
            <a
              href="/kurstyk_zhumys_teoriya.docx"
              download
              className="text-teal-400 hover:text-teal-300 font-bold underline decoration-teal-500/50 flex items-center gap-1"
              title="Курстық жұмыстың ресми Word құжатын жүктеп алу (.docx)"
            >
              <FileText className="w-3 h-3" />
              <span>Курстық жұмыс (.docx)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white flex items-center justify-center font-extrabold text-xl shadow-xs">
              ✚
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-slate-900">MedCabinet</span>
                <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-200 font-bold px-1.5 py-0.2 rounded">
                  v3.0 Server
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Дәрігерлік портал · <strong className="text-teal-700">Жақсылық Ш.</strong>
              </p>
            </div>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 pl-3 py-1 pr-1 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</div>
                <div className="mt-0.5">{getRoleBadge(currentUser.role)}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-xl border border-slate-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
              title="Жүйеден шығу"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Шығу</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area based on User Role */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentUser.role === 'patient' && (
          <PatientPortal
            currentUser={currentUser}
            cabinets={cabinets}
            doctors={doctors}
            appointments={appointments}
            reminders={reminders}
            onBookAppointment={handleBookAppointment}
            onCancelAppointment={handleCancelAppointment}
            onViewTicket={(app) => setTicketAppointment(app)}
          />
        )}

        {currentUser.role === 'doctor' && (
          <DoctorPortal
            currentUser={currentUser}
            cabinets={cabinets}
            appointments={appointments}
            bookings={bookings}
            reminders={reminders}
            onCompleteAppointment={handleCompleteAppointment}
            onCancelAppointment={handleCancelAppointment}
            onViewTicket={(app) => setTicketAppointment(app)}
            onCreateBooking={handleCreateBooking}
            onCancelBooking={handleCancelBooking}
          />
        )}

        {currentUser.role === 'admin' && (
          <AdminPortal
            currentUser={currentUser}
            cabinets={cabinets}
            users={users}
            appointments={appointments}
            bookings={bookings}
            reminders={reminders}
            onAddCabinet={handleAddCabinet}
            onToggleCabinetStatus={handleToggleCabinetStatus}
            onDeleteCabinet={handleDeleteCabinet}
            onDeleteAppointment={handleCancelAppointment}
            onDeleteBooking={handleCancelBooking}
            onViewTicket={(app) => setTicketAppointment(app)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4">
          «MedCabinet» — Медициналық кабинеттерді брондау веб-жүйесі · Автор: <strong>Жақсылық Шыңғысхан</strong> (2026)
        </div>
      </footer>

      {/* Printable Ticket Modal */}
      <PrintPassModal
        isOpen={!!ticketAppointment}
        onClose={() => setTicketAppointment(null)}
        appointment={ticketAppointment}
        patientUser={currentUser.role === 'patient' ? currentUser : undefined}
        doctorUser={doctors.find((d) => d.id === ticketAppointment?.doctorId)}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

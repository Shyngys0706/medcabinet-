import { User, Cabinet, Booking, Appointment, Reminder } from './types';

const API_BASE = '/api';

export async function registerUser(data: {
  name: string;
  login: string;
  phone: string;
  password: string;
  role: 'patient' | 'doctor';
  specialty?: string;
  assignedCabinet?: string;
  iin?: string;
  email?: string;
}): Promise<{ user: User; token: string }> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Тіркелу кезінде қате кетті');
  }
  return json;
}

export async function loginUser(
  loginOrPhone: string,
  password: string
): Promise<{ user: User; token: string }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginOrPhone, password }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Кіру кезінде қате кетті');
  }
  return json;
}

export async function getMe(token: string): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Сессия мерзімі аяқталды');
  }
  return json.user;
}

export async function fetchCabinets(): Promise<Cabinet[]> {
  const res = await fetch(`${API_BASE}/cabinets`);
  if (!res.ok) throw new Error('Кабинеттер тізімін алу мүмкін болмады');
  return res.json();
}

export async function createCabinet(cabinet: Partial<Cabinet>): Promise<Cabinet> {
  const res = await fetch(`${API_BASE}/cabinets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cabinet),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Кабинетті қосу қатесі');
  return json;
}

export async function updateCabinet(id: string, updates: Partial<Cabinet>): Promise<Cabinet> {
  const res = await fetch(`${API_BASE}/cabinets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Кабинетті жаңарту қатесі');
  return json;
}

export async function deleteCabinet(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/cabinets/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Кабинетті өшіру қатесі');
}

export async function fetchAppointments(): Promise<Appointment[]> {
  const res = await fetch(`${API_BASE}/appointments`);
  if (!res.ok) throw new Error('Қабылдаулар тізімін алу мүмкін болмады');
  return res.json();
}

export async function createAppointment(appData: Partial<Appointment>): Promise<{ appointment: Appointment; reminder: Reminder }> {
  const res = await fetch(`${API_BASE}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appData),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Қабылдауға жазылу қатесі');
  return json;
}

export async function updateAppointmentStatus(id: string, status: 'confirmed' | 'completed' | 'cancelled'): Promise<Appointment> {
  const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Күйді жаңарту қатесі');
  return json;
}

export async function deleteAppointment(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/appointments/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Қабылдауды өшіру мүмкін болмады');
}

export async function fetchBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_BASE}/bookings`);
  if (!res.ok) throw new Error('Брондарды алу мүмкін болмады');
  return res.json();
}

export async function createBooking(booking: Partial<Booking>): Promise<Booking> {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Брондау қатесі');
  return json;
}

export async function deleteBooking(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/bookings/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Броньды жою мүмкін болмады');
}

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error('Пайдаланушыларды алу мүмкін болмады');
  return res.json();
}

export async function fetchDoctors(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/doctors`);
  if (!res.ok) throw new Error('Дәрігерлерді алу мүмкін болмады');
  return res.json();
}

export async function fetchReminders(): Promise<Reminder[]> {
  const res = await fetch(`${API_BASE}/reminders`);
  if (!res.ok) throw new Error('Еске салғыштарды алу мүмкін болмады');
  return res.json();
}

export async function updateUserProfile(id: string, updates: Partial<User>): Promise<User> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Профильді жаңарту қатесі');
  return json.user;
}

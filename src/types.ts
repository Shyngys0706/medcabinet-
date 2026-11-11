export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  login?: string;
  email: string;
  phone: string;
  avatar: string;
  bio?: string;
  // Doctor specific
  specialty?: string;
  department?: string;
  assignedCabinet?: string;
  experience?: string;
  // Patient specific
  iin?: string;
  insuranceNumber?: string;
  birthDate?: string;
  bloodType?: string;
  // Admin specific
  position?: string;
  createdAt?: string;
}

export type CabinetStatus = 'available' | 'booked' | 'sanitizing' | 'maintenance';

export interface Cabinet {
  id: string;
  number: string;
  title: string;
  floor: number;
  category: string;
  status: CabinetStatus;
  equipment: string[];
}

export interface Booking {
  id: string;
  cabinetId: string;
  cabinetNumber: string;
  doctorId: string;
  doctorName: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  needsSterilization: boolean;
  createdAt: string;
}

export interface Appointment {
  id: string;
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
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Reminder {
  id: string;
  userId: string;
  recipientName: string;
  recipientPhone: string;
  channel: 'SMS' | 'WhatsApp';
  title: string;
  message: string;
  status: 'sent' | 'delivered';
  sentAt: string;
}

export interface DatabaseState {
  users: User[];
  cabinets: Cabinet[];
  bookings: Booking[];
  appointments: Appointment[];
  reminders: Reminder[];
}

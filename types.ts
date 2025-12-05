export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  RECEPTIONIST = 'RECEPTIONIST'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  assignedDoctorId?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string; // Denormalized for simpler UI display in mock
  doctorId: string;
  doctorName: string; // Denormalized
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  type: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  doctorId: string;
  doctorName: string;
  diagnosis: string;
  prescription: string;
  notes: string;
}

export interface DashboardStats {
  totalPatients: number;
  totalAppointments: number;
  totalDoctors: number;
  todaysAppointments: Appointment[];
}
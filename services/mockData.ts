import { User, UserRole, Patient, Appointment, MedicalRecord, DashboardStats } from '../types';

// --- Initial Mock Data ---

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Dr. Sarah Bennett', email: 'doctor@medicare.pro', role: UserRole.DOCTOR, avatar: 'https://picsum.photos/id/64/150/150' },
  { id: 'u2', name: 'James Wilson', email: 'admin@medicare.pro', role: UserRole.ADMIN, avatar: 'https://picsum.photos/id/55/150/150' },
  { id: 'u3', name: 'Emily Clark', email: 'reception@medicare.pro', role: UserRole.RECEPTIONIST, avatar: 'https://picsum.photos/id/42/150/150' },
];

let patients: Patient[] = [
  { id: 'p1', name: 'John Doe', email: 'john@example.com', phone: '555-0123', dob: '1985-04-12', gender: 'Male', address: '123 Maple St', assignedDoctorId: 'u1', createdAt: '2023-01-15' },
  { id: 'p2', name: 'Jane Smith', email: 'jane@example.com', phone: '555-0198', dob: '1990-08-22', gender: 'Female', address: '456 Oak Ave', assignedDoctorId: 'u1', createdAt: '2023-02-10' },
  { id: 'p3', name: 'Robert Brown', email: 'bob@example.com', phone: '555-0456', dob: '1978-11-05', gender: 'Male', address: '789 Pine Ln', assignedDoctorId: 'u1', createdAt: '2023-03-01' },
];

let appointments: Appointment[] = [
  { id: 'a1', patientId: 'p1', patientName: 'John Doe', doctorId: 'u1', doctorName: 'Dr. Sarah Bennett', date: new Date().toISOString().split('T')[0], time: '09:00', status: 'Scheduled', type: 'Checkup' },
  { id: 'a2', patientId: 'p2', patientName: 'Jane Smith', doctorId: 'u1', doctorName: 'Dr. Sarah Bennett', date: new Date().toISOString().split('T')[0], time: '10:30', status: 'Completed', type: 'Consultation' },
  { id: 'a3', patientId: 'p3', patientName: 'Robert Brown', doctorId: 'u1', doctorName: 'Dr. Sarah Bennett', date: '2023-11-20', time: '14:00', status: 'Scheduled', type: 'Follow-up' },
];

let medicalRecords: MedicalRecord[] = [
  { id: 'm1', patientId: 'p1', date: '2023-05-10', doctorId: 'u1', doctorName: 'Dr. Sarah Bennett', diagnosis: 'Seasonal Allergies', prescription: 'Cetirizine 10mg', notes: 'Patient reported sneezing and itchy eyes.' },
];

// --- Service Methods ---

export const AuthService = {
  login: async (email: string): Promise<User | null> => {
    // Simulating API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = MOCK_USERS.find(u => u.email === email);
    return user || null;
  }
};

export const PatientService = {
  getAll: async (): Promise<Patient[]> => {
    return [...patients];
  },
  getById: async (id: string): Promise<Patient | undefined> => {
    return patients.find(p => p.id === id);
  },
  create: async (patientData: Omit<Patient, 'id' | 'createdAt'>): Promise<Patient> => {
    const newPatient: Patient = {
      ...patientData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    patients = [...patients, newPatient];
    return newPatient;
  },
  update: async (id: string, patientData: Partial<Patient>): Promise<Patient> => {
    const index = patients.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Patient not found");
    
    patients[index] = { ...patients[index], ...patientData };
    return patients[index];
  }
};

export const AppointmentService = {
  getAll: async (): Promise<Appointment[]> => {
    return [...appointments].sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime());
  },
  create: async (data: Omit<Appointment, 'id' | 'status' | 'patientName' | 'doctorName'>): Promise<Appointment> => {
    const patient = patients.find(p => p.id === data.patientId);
    const doctor = MOCK_USERS.find(u => u.id === data.doctorId);
    
    if (!patient || !doctor) throw new Error("Invalid patient or doctor");

    const newAppointment: Appointment = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Scheduled',
      patientName: patient.name,
      doctorName: doctor.name
    };
    appointments = [...appointments, newAppointment];
    return newAppointment;
  }
};

export const MedicalRecordService = {
  getByPatientId: async (patientId: string): Promise<MedicalRecord[]> => {
    return medicalRecords.filter(m => m.patientId === patientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  create: async (data: Omit<MedicalRecord, 'id'>): Promise<MedicalRecord> => {
    const newRecord: MedicalRecord = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    };
    medicalRecords = [newRecord, ...medicalRecords];
    return newRecord;
  }
};

export const DashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const today = new Date().toISOString().split('T')[0];
    const todaysApps = appointments.filter(a => a.date === today);
    
    return {
      totalPatients: patients.length,
      totalAppointments: appointments.length,
      totalDoctors: MOCK_USERS.filter(u => u.role === UserRole.DOCTOR).length,
      todaysAppointments: todaysApps
    };
  }
};

export const UserService = {
  getDoctors: async (): Promise<User[]> => {
    return MOCK_USERS.filter(u => u.role === UserRole.DOCTOR);
  }
};
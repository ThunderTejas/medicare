import React, { useEffect, useState } from 'react';
import { Plus, Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { AppointmentService, PatientService, UserService } from '../services/mockData';
import { Appointment, Patient, User as UserType } from '../types';

export const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<UserType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newAppt, setNewAppt] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    type: 'Checkup'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const appts = await AppointmentService.getAll();
    setAppointments(appts);
    const patientList = await PatientService.getAll();
    setPatients(patientList);
    const doctorList = await UserService.getDoctors();
    setDoctors(doctorList);
    
    if (doctorList.length > 0) {
        setNewAppt(prev => ({...prev, doctorId: doctorList[0].id}));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await AppointmentService.create(newAppt);
    setIsModalOpen(false);
    loadData();
    setNewAppt(prev => ({ ...prev, patientId: '', date: '', time: '' }));
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-[#1e1b4b] tracking-tight">Appointments</h1>
          <p className="text-gray-500 font-medium mt-1">Manage scheduled visits and consultations</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1e1b4b] text-white px-6 py-3.5 rounded-2xl hover:bg-violet-900 transition-all shadow-xl shadow-violet-900/20 hover:shadow-2xl flex items-center gap-2 font-bold transform hover:-translate-y-1"
        >
          <Plus size={20} />
          Schedule Visit
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
          {appointments.map((apt) => (
             <div key={apt.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between group hover:shadow-lg transition-all duration-300 hover:border-violet-100">
                <div className="flex items-center gap-6">
                    {/* Date Block */}
                    <div className="flex flex-col items-center justify-center w-20 h-20 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-[#1e1b4b] group-hover:text-white transition-colors duration-300">
                        <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                            {new Date(apt.date).toLocaleDateString(undefined, { month: 'short' })}
                        </span>
                        <span className="text-2xl font-black">
                             {new Date(apt.date).toLocaleDateString(undefined, { day: 'numeric' })}
                        </span>
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-gray-900">{apt.patientName}</h3>
                        <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <Clock size={16} className="text-violet-500" />
                                {apt.time}
                            </span>
                             <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                             <span className="flex items-center gap-1.5">
                                <User size={16} className="text-fuchsia-500" />
                                {apt.doctorName}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 mt-4 md:mt-0 pl-26 md:pl-0">
                    <span className="px-4 py-1.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl border border-gray-200 uppercase tracking-wide">
                        {apt.type}
                    </span>
                    
                    <span className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide border
                      ${apt.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        apt.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 
                        'bg-orange-50 text-orange-600 border-orange-100'}`}>
                      {apt.status}
                    </span>

                    <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#1e1b4b] hover:text-white transition-all">
                        <ArrowRight size={18} />
                    </button>
                </div>
             </div>
          ))}
      </div>

      {/* New Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0f0e24]/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-8 shadow-2xl">
            <h2 className="text-2xl font-black text-[#1e1b4b] mb-6">Book Appointment</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Patient</label>
                <select 
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 focus:ring-2 focus:ring-violet-500 focus:bg-white outline-none transition-all font-medium" 
                  value={newAppt.patientId} 
                  onChange={e => setNewAppt({...newAppt, patientId: e.target.value})}
                >
                  <option value="">Select Patient</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Doctor</label>
                <select 
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 focus:ring-2 focus:ring-violet-500 focus:bg-white outline-none transition-all font-medium" 
                  value={newAppt.doctorId} 
                  onChange={e => setNewAppt({...newAppt, doctorId: e.target.value})}
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Date</label>
                  <input required type="date" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 focus:ring-2 focus:ring-violet-500 focus:bg-white outline-none transition-all font-medium text-gray-500" value={newAppt.date} onChange={e => setNewAppt({...newAppt, date: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Time</label>
                  <input required type="time" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 focus:ring-2 focus:ring-violet-500 focus:bg-white outline-none transition-all font-medium text-gray-500" value={newAppt.time} onChange={e => setNewAppt({...newAppt, time: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Type</label>
                <div className="grid grid-cols-2 gap-3">
                    {['Checkup', 'Consultation', 'Follow-up', 'Emergency'].map((t) => (
                        <button 
                            key={t}
                            type="button"
                            onClick={() => setNewAppt({...newAppt, type: t})}
                            className={`py-2.5 rounded-xl font-bold text-xs uppercase tracking-wide transition-all ${newAppt.type === t ? 'bg-[#1e1b4b] text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
              </div>
              
              <div className="flex justify-end pt-4 gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-colors">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-[#1e1b4b] text-white rounded-2xl hover:bg-violet-900 font-bold shadow-lg shadow-violet-900/20 transition-all">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
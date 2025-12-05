import React, { useEffect, useState } from 'react';
import { Plus, Search, MoreHorizontal, Filter, ChevronRight } from 'lucide-react';
import { PatientService } from '../services/mockData';
import { Patient } from '../types';
import { Link } from 'react-router-dom';

export const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    address: ''
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    const data = await PatientService.getAll();
    setPatients(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await PatientService.create({
      ...newPatient,
      assignedDoctorId: 'u1'
    });
    setIsModalOpen(false);
    loadPatients();
    setNewPatient({ name: '', email: '', phone: '', dob: '', gender: 'Male', address: '' });
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#1e1b4b] tracking-tight">Patients</h1>
          <p className="text-gray-500 font-medium mt-1">Directory of {patients.length} active patients</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1e1b4b] text-white px-6 py-3.5 rounded-2xl hover:bg-violet-900 transition-all shadow-xl shadow-violet-900/20 hover:shadow-2xl flex items-center gap-2 font-bold transform hover:-translate-y-1"
        >
          <Plus size={20} />
          Add New Patient
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 items-center bg-white p-2 rounded-[20px] shadow-sm border border-gray-100 max-w-2xl">
        <div className="flex-1 flex items-center px-4 gap-3">
            <Search className="text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search patients..." 
              className="w-full py-2 bg-transparent text-gray-700 font-medium focus:outline-none placeholder:text-gray-400"
            />
        </div>
        <button className="p-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition-colors">
            <Filter size={20} />
        </button>
      </div>

      {/* Patient List */}
      <div className="space-y-3">
         {/* Table Header (Visual only) */}
         <div className="grid grid-cols-12 px-6 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
             <div className="col-span-4">Patient Info</div>
             <div className="col-span-3">Contact</div>
             <div className="col-span-2">Date of Birth</div>
             <div className="col-span-2">Status</div>
             <div className="col-span-1 text-right">Action</div>
         </div>

         {patients.map((patient) => (
             <div key={patient.id} className="group grid grid-cols-12 items-center bg-white p-4 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-violet-100 transition-all duration-300">
                 <div className="col-span-4 flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-50 flex items-center justify-center text-violet-700 font-bold text-lg shadow-inner">
                         {patient.name.charAt(0)}
                     </div>
                     <div>
                         <h3 className="font-bold text-gray-900 text-lg">{patient.name}</h3>
                         <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">{patient.gender}</span>
                     </div>
                 </div>
                 
                 <div className="col-span-3">
                     <p className="text-sm font-bold text-gray-700">{patient.email}</p>
                     <p className="text-xs font-medium text-gray-400">{patient.phone}</p>
                 </div>
                 
                 <div className="col-span-2 text-sm font-semibold text-gray-600">
                     {new Date(patient.dob).toLocaleDateString()}
                 </div>
                 
                 <div className="col-span-2">
                     <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                         Active
                     </span>
                 </div>
                 
                 <div className="col-span-1 flex justify-end">
                     <Link to={`/patients/${patient.id}`} className="p-3 rounded-xl text-gray-300 hover:text-violet-600 hover:bg-violet-50 transition-all">
                         <ChevronRight size={20} />
                     </Link>
                 </div>
             </div>
         ))}
      </div>

      {/* Add Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0f0e24]/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] max-w-2xl w-full p-10 shadow-2xl transform transition-all scale-100 border border-white/20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-black text-[#1e1b4b]">New Patient</h2>
                    <p className="text-gray-500 font-medium">Create a new patient record</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Plus size={24} className="rotate-45" />
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                  <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 focus:ring-2 focus:ring-violet-500 focus:bg-white outline-none transition-all font-medium" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} placeholder="e.g. John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Date of Birth</label>
                  <input required type="date" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 focus:ring-2 focus:ring-violet-500 focus:bg-white outline-none transition-all font-medium text-gray-500" value={newPatient.dob} onChange={e => setNewPatient({...newPatient, dob: e.target.value})} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
                  <input required type="email" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 focus:ring-2 focus:ring-violet-500 focus:bg-white outline-none transition-all font-medium" value={newPatient.email} onChange={e => setNewPatient({...newPatient, email: e.target.value})} placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Phone</label>
                  <input required type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 focus:ring-2 focus:ring-violet-500 focus:bg-white outline-none transition-all font-medium" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} placeholder="(555) 000-0000" />
                </div>
              </div>

               <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Address</label>
                  <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 focus:ring-2 focus:ring-violet-500 focus:bg-white outline-none transition-all font-medium" value={newPatient.address} onChange={e => setNewPatient({...newPatient, address: e.target.value})} placeholder="123 Main St, City" />
                </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Gender</label>
                <div className="grid grid-cols-3 gap-4">
                    {['Male', 'Female', 'Other'].map((g) => (
                        <button 
                            key={g}
                            type="button"
                            onClick={() => setNewPatient({...newPatient, gender: g as any})}
                            className={`py-3 rounded-2xl font-bold text-sm transition-all ${newPatient.gender === g ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <button type="submit" className="px-8 py-3.5 bg-[#1e1b4b] text-white rounded-2xl hover:bg-violet-900 font-bold shadow-xl shadow-violet-900/20 transition-all transform active:scale-95">Save Patient Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
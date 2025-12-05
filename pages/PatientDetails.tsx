import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, FileText, Calendar, MapPin, Mail, Phone, Clock, User, ArrowRight, Edit3 } from 'lucide-react';
import { PatientService, MedicalRecordService } from '../services/mockData';
import { Patient, MedicalRecord, UserRole, User as UserType } from '../types';

interface PatientDetailsProps {
  user: UserType;
}

export const PatientDetails: React.FC<PatientDetailsProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | undefined>(undefined);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  
  // Modals
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  
  const [newRecord, setNewRecord] = useState({
    diagnosis: '',
    prescription: '',
    notes: '',
  });

  const [editForm, setEditForm] = useState<Partial<Patient>>({});

  useEffect(() => {
    if (id) {
      loadData(id);
    }
  }, [id]);

  useEffect(() => {
    if (patient) {
        setEditForm(patient);
    }
  }, [patient]);

  const loadData = async (patientId: string) => {
    const p = await PatientService.getById(patientId);
    setPatient(p);
    const r = await MedicalRecordService.getByPatientId(patientId);
    setRecords(r);
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !patient) return;

    await MedicalRecordService.create({
      patientId: id,
      date: new Date().toISOString().split('T')[0],
      doctorId: user.id, 
      doctorName: user.name,
      ...newRecord
    });
    
    setIsAddNoteOpen(false);
    setNewRecord({ diagnosis: '', prescription: '', notes: '' });
    loadData(id);
  };

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !patient) return;

    await PatientService.update(id, editForm);
    setIsEditProfileOpen(false);
    loadData(id);
  }

  if (!patient) return <div className="p-8 flex justify-center text-violet-500 font-medium">Loading details...</div>;

  const canAddRecords = user.role === UserRole.DOCTOR || user.role === UserRole.ADMIN;

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <Link to="/patients" className="inline-flex items-center text-gray-400 hover:text-[#1e1b4b] transition-colors font-bold text-sm mb-4">
        <ArrowLeft size={16} className="mr-2" /> BACK TO DIRECTORY
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-4">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-100/50 overflow-hidden sticky top-8">
                {/* Visual Header */}
                <div className="h-32 bg-[#1e1b4b] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500 rounded-full blur-[50px] opacity-50 transform translate-x-10 -translate-y-10"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-500 rounded-full blur-[50px] opacity-40 transform -translate-x-10 translate-y-10"></div>
                    
                    <button 
                        onClick={() => setIsEditProfileOpen(true)}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white backdrop-blur-md transition-colors"
                        title="Edit Profile"
                    >
                        <Edit3 size={18} />
                    </button>
                </div>
                
                <div className="px-8 pb-8 relative">
                    {/* Avatar */}
                    <div className="w-28 h-28 bg-white rounded-3xl p-1.5 absolute -top-14 shadow-lg">
                        <div className="w-full h-full bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-2xl flex items-center justify-center text-[#1e1b4b] text-4xl font-black">
                            {patient.name.charAt(0)}
                        </div>
                    </div>

                    <div className="mt-16">
                        <h1 className="text-3xl font-black text-[#1e1b4b] leading-tight">{patient.name}</h1>
                        <p className="text-sm font-bold text-violet-500 mt-1 uppercase tracking-wide">Patient ID: #{patient.id}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-6">
                            <span className="px-4 py-1.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl border border-gray-100">{patient.gender}</span>
                            <span className="px-4 py-1.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl border border-gray-100">{new Date().getFullYear() - new Date(patient.dob).getFullYear()} Years Old</span>
                            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-xl border border-emerald-100">Active</span>
                        </div>
                    </div>

                    <div className="mt-8 space-y-5">
                        <div className="flex items-center gap-4 text-gray-600 group">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
                                <Mail size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Email</p>
                                <p className="font-semibold text-sm">{patient.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-gray-600 group">
                             <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
                                <Phone size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Phone</p>
                                <p className="font-semibold text-sm">{patient.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-gray-600 group">
                             <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Address</p>
                                <p className="font-semibold text-sm">{patient.address}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Medical History */}
        <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-[#1e1b4b]">Medical History</h2>
                {/* Role Based Access Control: Hide for Receptionists */}
                {canAddRecords && (
                    <button 
                    onClick={() => setIsAddNoteOpen(true)}
                    className="bg-white text-[#1e1b4b] border-2 border-gray-100 px-5 py-2.5 rounded-xl hover:border-[#1e1b4b] transition-all flex items-center gap-2 font-bold text-sm"
                    >
                    <Plus size={18} />
                    Add Record
                    </button>
                )}
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                {records.length === 0 ? (
                     <div className="bg-white rounded-[2rem] p-12 text-center border-2 border-dashed border-gray-200 relative z-10">
                        <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900">No Records Found</h3>
                        <p className="text-gray-400">This patient has no medical history recorded.</p>
                     </div>
                ) : (
                    records.map((record) => (
                        <div key={record.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                             {/* Icon on Timeline */}
                             <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-gray-50 bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-violet-600">
                                <FileText size={18} />
                            </div>
                            
                            {/* Content Card */}
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-violet-200 transition-all duration-300">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="px-3 py-1 bg-violet-50 text-violet-700 rounded-lg text-xs font-bold uppercase">{record.date}</span>
                                    <div className="flex items-center gap-1 text-gray-400 text-xs font-bold">
                                        <User size={12} />
                                        Dr. {record.doctorName.split(' ')[1]}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-[#1e1b4b] mb-1">{record.diagnosis}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{record.notes}</p>
                                
                                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Prescription</p>
                                    <p className="font-semibold text-[#1e1b4b] text-sm">{record.prescription}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>

      {/* Add Note Modal */}
      {isAddNoteOpen && (
        <div className="fixed inset-0 bg-[#0f0e24]/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-8 shadow-2xl">
            <h2 className="text-2xl font-black text-[#1e1b4b] mb-6">Add Medical Record</h2>
            <form onSubmit={handleAddRecord} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Diagnosis</label>
                <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 focus:ring-2 focus:ring-violet-500 focus:bg-white outline-none transition-all font-medium" value={newRecord.diagnosis} onChange={e => setNewRecord({...newRecord, diagnosis: e.target.value})} placeholder="Medical diagnosis" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Prescription</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 focus:ring-2 focus:ring-violet-500 focus:bg-white outline-none transition-all font-medium" value={newRecord.prescription} onChange={e => setNewRecord({...newRecord, prescription: e.target.value})} placeholder="Medication details" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Clinical Notes</label>
                <textarea required className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 h-32 focus:ring-2 focus:ring-violet-500 focus:bg-white outline-none resize-none font-medium" value={newRecord.notes} onChange={e => setNewRecord({...newRecord, notes: e.target.value})} placeholder="Detailed observations..." />
              </div>
              <div className="flex justify-end pt-4 gap-3">
                 <button type="button" onClick={() => setIsAddNoteOpen(false)} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-colors">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-[#1e1b4b] text-white rounded-2xl hover:bg-violet-900 font-bold shadow-lg shadow-violet-900/20 transition-all">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 bg-[#0f0e24]/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] max-w-2xl w-full p-10 shadow-2xl transform transition-all scale-100 border border-white/20">
            <h2 className="text-3xl font-black text-[#1e1b4b] mb-2">Edit Profile</h2>
            <p className="text-gray-500 font-medium mb-8">Update patient details.</p>
            
            <form onSubmit={handleEditProfile} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                  <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 focus:ring-2 focus:ring-violet-500 focus:bg-white outline-none transition-all font-medium" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Date of Birth</label>
                  <input required type="date" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 focus:ring-2 focus:ring-violet-500 focus:bg-white outline-none transition-all font-medium text-gray-500" value={editForm.dob || ''} onChange={e => setEditForm({...editForm, dob: e.target.value})} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
                  <input required type="email" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 focus:ring-2 focus:ring-violet-500 focus:bg-white outline-none transition-all font-medium" value={editForm.email || ''} onChange={e => setEditForm({...editForm, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Phone</label>
                  <input required type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 focus:ring-2 focus:ring-violet-500 focus:bg-white outline-none transition-all font-medium" value={editForm.phone || ''} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                </div>
              </div>

               <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Address</label>
                  <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 focus:ring-2 focus:ring-violet-500 focus:bg-white outline-none transition-all font-medium" value={editForm.address || ''} onChange={e => setEditForm({...editForm, address: e.target.value})} />
                </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Gender</label>
                <div className="grid grid-cols-3 gap-4">
                    {['Male', 'Female', 'Other'].map((g) => (
                        <button 
                            key={g}
                            type="button"
                            onClick={() => setEditForm({...editForm, gender: g as any})}
                            className={`py-3 rounded-2xl font-bold text-sm transition-all ${editForm.gender === g ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
              </div>
              
              <div className="flex justify-end pt-4 gap-3">
                <button type="button" onClick={() => setIsEditProfileOpen(false)} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-colors">Cancel</button>
                <button type="submit" className="px-8 py-3.5 bg-[#1e1b4b] text-white rounded-2xl hover:bg-violet-900 font-bold shadow-xl shadow-violet-900/20 transition-all transform active:scale-95">Update Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
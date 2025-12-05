import React, { useEffect, useState } from 'react';
import { Users, Calendar, Stethoscope, Clock, ArrowUpRight } from 'lucide-react';
import { DashboardService } from '../services/mockData';
import { DashboardStats, User } from '../types';

interface DashboardProps {
  user: User;
}

const StatCard = ({ title, value, icon: Icon, color, subColor }: any) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-100/50 group hover:-translate-y-1 transition-transform duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3.5 rounded-2xl ${subColor} ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
          +12% <ArrowUpRight size={12} className="ml-1"/>
      </span>
    </div>
    <div>
      <p className="text-4xl font-extrabold text-gray-900 mb-1 tracking-tight">{value}</p>
      <p className="text-sm font-medium text-gray-400">{title}</p>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      const data = await DashboardService.getStats();
      setStats(data);
    };
    loadStats();
  }, []);

  if (!stats) return <div className="p-10 flex items-center justify-center h-full text-violet-400 font-medium animate-pulse">Loading dashboard insights...</div>;

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#1e1b4b] tracking-tight mb-2">Good Morning, {user.name.split(' ')[0]}</h1>
          <p className="text-gray-500 font-medium text-lg">Here's your daily practice overview.</p>
        </div>
        <div className="bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2 text-sm font-bold text-gray-600">
            <Calendar size={16} className="text-violet-500" />
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Patients" 
          value={stats.totalPatients} 
          icon={Users}
          color="text-violet-600"
          subColor="bg-violet-50"
        />
        <StatCard 
          title="Appointments" 
          value={stats.totalAppointments} 
          icon={Calendar}
          color="text-fuchsia-600"
          subColor="bg-fuchsia-50"
        />
        <StatCard 
          title="Active Doctors" 
          value={stats.totalDoctors} 
          icon={Stethoscope}
          color="text-indigo-600"
          subColor="bg-indigo-50"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Schedule Section */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-100/50 border border-gray-100/50">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Today's Schedule</h2>
            <button className="text-sm font-bold text-violet-600 hover:text-violet-800 transition-colors">View Calendar</button>
          </div>
          
          {stats.todaysAppointments.length === 0 ? (
            <div className="bg-gray-50 rounded-3xl p-10 text-center border border-dashed border-gray-200">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No appointments for today</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.todaysAppointments.map((apt, index) => (
                <div key={apt.id} className="group flex items-center gap-6 p-4 rounded-3xl hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-gray-100">
                  <div className="flex-shrink-0 w-20 flex flex-col items-center">
                    <span className="text-lg font-bold text-gray-900">{apt.time}</span>
                    <span className="text-xs font-semibold text-gray-400 uppercase">{parseInt(apt.time) >= 12 ? 'PM' : 'AM'}</span>
                  </div>
                  
                  <div className="w-1 h-12 rounded-full bg-gray-100 group-hover:bg-violet-500 transition-colors relative">
                    {index !== stats.todaysAppointments.length - 1 && (
                         <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-100 group-hover:bg-violet-100"></div>
                    )}
                  </div>

                  <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm group-hover:shadow-md transition-all flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">{apt.patientName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md uppercase tracking-wide">{apt.type}</span>
                            <span className="text-xs text-gray-400 font-medium">with {apt.doctorName}</span>
                        </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                        apt.status === 'Completed' ? 'bg-emerald-400' : 
                        apt.status === 'Cancelled' ? 'bg-red-400' : 'bg-orange-400'
                    } shadow-[0_0_10px_rgba(0,0,0,0.2)]`}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions / Side Panel */}
        <div className="bg-gradient-to-b from-violet-900 to-[#1e1b4b] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
           
           <h2 className="text-xl font-bold mb-6 relative z-10">Quick Actions</h2>
           
           <div className="space-y-4 relative z-10">
              <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-2xl flex items-center gap-4 transition-all border border-white/5 group">
                  <div className="bg-white text-violet-900 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                      <Users size={20} />
                  </div>
                  <div className="text-left">
                      <p className="font-bold text-sm">Register Patient</p>
                      <p className="text-xs text-violet-200 opacity-70">Add new record</p>
                  </div>
              </button>

               <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-2xl flex items-center gap-4 transition-all border border-white/5 group">
                  <div className="bg-white text-violet-900 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                      <Calendar size={20} />
                  </div>
                  <div className="text-left">
                      <p className="font-bold text-sm">New Appointment</p>
                      <p className="text-xs text-violet-200 opacity-70">Schedule visit</p>
                  </div>
              </button>
           </div>

           <div className="mt-12 relative z-10">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-sm font-bold text-violet-200 mb-4 uppercase tracking-wider">Next Up</h3>
                  {stats.todaysAppointments.length > 0 ? (
                      <div>
                          <p className="text-2xl font-bold">{stats.todaysAppointments[0].patientName}</p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-violet-300">
                             <Clock size={14} />
                             {stats.todaysAppointments[0].time} • {stats.todaysAppointments[0].type}
                          </div>
                      </div>
                  ) : (
                      <p className="text-sm text-violet-300">No upcoming appointments</p>
                  )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
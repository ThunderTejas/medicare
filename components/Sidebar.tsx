import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  LogOut, 
  HeartPulse
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, isOpen, onClose }) => {
  const linkClass = ({ isActive }: { isActive: boolean }) => 
    `relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group overflow-hidden ${
      isActive 
        ? 'bg-white text-violet-900 shadow-lg shadow-black/10 font-bold' 
        : 'text-violet-200 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Content */}
      <div className={`w-72 bg-[#1e1b4b] h-screen flex flex-col fixed left-0 top-0 shadow-2xl z-50 rounded-r-3xl border-r border-white/5 transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo Section */}
        <div className="p-8 pb-8 flex items-center gap-4">
          <div className="relative">
              <div className="absolute inset-0 bg-violet-500 blur-lg opacity-40 rounded-full"></div>
              <div className="bg-gradient-to-br from-violet-500 to-fuchsia-600 p-2.5 rounded-2xl shadow-xl relative z-10">
                <HeartPulse className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
          </div>
          <div>
              <span className="block text-xl font-extrabold text-white tracking-tight leading-none">MediCare</span>
              <span className="block text-xs font-medium text-violet-300 tracking-widest uppercase mt-0.5">Pro System</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-5 space-y-2 py-4">
          <p className="px-4 text-[10px] font-bold text-violet-400/60 uppercase tracking-widest mb-4 ml-1">Main Menu</p>
          
          <NavLink to="/" className={linkClass} onClick={() => window.innerWidth < 768 && onClose()}>
            {({ isActive }) => (
              <>
                <LayoutDashboard size={20} className={isActive ? 'text-violet-600' : ''} />
                <span>Dashboard</span>
              </>
            )}
          </NavLink>
          
          <NavLink to="/patients" className={linkClass} onClick={() => window.innerWidth < 768 && onClose()}>
            {({ isActive }) => (
              <>
                <Users size={20} className={isActive ? 'text-violet-600' : ''} />
                <span>Patients</span>
              </>
            )}
          </NavLink>
          
          <NavLink to="/appointments" className={linkClass} onClick={() => window.innerWidth < 768 && onClose()}>
            {({ isActive }) => (
              <>
                <Calendar size={20} className={isActive ? 'text-violet-600' : ''} />
                <span>Appointments</span>
              </>
            )}
          </NavLink>
        </nav>

        {/* User Profile */}
        <div className="p-5">
          <div className="bg-[#2e2a63] rounded-3xl p-4 shadow-xl border border-white/5">
              <div className="flex items-center gap-3 mb-4">
              {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full ring-2 ring-violet-400 ring-offset-2 ring-offset-[#2e2a63]" />
              ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                  {user.name.charAt(0)}
                  </div>
              )}
              <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  <p className="text-xs text-violet-300 truncate capitalize">{user.role.toLowerCase()}</p>
              </div>
              </div>
              <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1e1b4b] hover:bg-violet-900 text-violet-200 hover:text-white rounded-xl transition-all text-xs font-bold uppercase tracking-wide border border-white/5"
              >
              <LogOut size={14} />
              Sign Out
              </button>
          </div>
        </div>
      </div>
    </>
  );
};
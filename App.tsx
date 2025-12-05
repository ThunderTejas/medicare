import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { PatientDetails } from './pages/PatientDetails';
import { Appointments } from './pages/Appointments';
import { User } from './types';
import { Menu } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-[#f8fafc] font-sans selection:bg-violet-200 selection:text-violet-900">
        <Sidebar 
          user={user} 
          onLogout={handleLogout} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        <main className="flex-1 md:ml-72 overflow-y-auto">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center p-4 bg-white border-b border-gray-100 sticky top-0 z-30">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-gray-600 hover:bg-gray-50"
            >
              <Menu size={24} />
            </button>
            <span className="ml-2 font-bold text-[#1e1b4b]">MediCare Pro</span>
          </div>

          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/:id" element={<PatientDetails user={user} />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
import React, { useState } from 'react';
import { HeartPulse, Lock, Mail, ArrowRight } from 'lucide-react';
import { AuthService } from '../services/mockData';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('doctor@medicare.pro');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await AuthService.login(email);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid credentials.');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0e24] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-violet-900/30 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] bg-fuchsia-900/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-4xl w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10">
        
        {/* Left Side - Hero */}
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-gradient-to-br from-violet-600 to-fuchsia-700 p-12 text-white relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                 <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-extrabold mb-4 leading-tight">Healthcare Simplified.</h1>
              <p className="text-violet-100 text-lg opacity-90">Manage patients, appointments, and records with a modern touch.</p>
           </div>
           <div className="relative z-10 text-xs font-medium text-violet-200/60 uppercase tracking-widest">
              © 2024 MediCare Pro
           </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-10 md:p-12 bg-white flex flex-col justify-center">
          <div className="mb-8">
             <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
             <p className="text-gray-500">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all font-medium"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm text-center font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-[#1e1b4b] hover:bg-violet-900 text-white rounded-2xl font-bold transition-all shadow-xl shadow-violet-900/20 transform active:scale-[0.98]"
            >
              {isLoading ? 'Processing...' : 'Sign In'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100">
             <p className="text-xs text-center font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Demo Access</p>
             <div className="grid grid-cols-3 gap-3">
               <button onClick={() => {setEmail('admin@medicare.pro'); setPassword('password')}} className="p-2 rounded-xl bg-gray-50 hover:bg-violet-50 text-xs font-bold text-gray-600 hover:text-violet-700 transition-colors">Admin</button>
               <button onClick={() => {setEmail('doctor@medicare.pro'); setPassword('password')}} className="p-2 rounded-xl bg-gray-50 hover:bg-violet-50 text-xs font-bold text-gray-600 hover:text-violet-700 transition-colors">Doctor</button>
               <button onClick={() => {setEmail('reception@medicare.pro'); setPassword('password')}} className="p-2 rounded-xl bg-gray-50 hover:bg-violet-50 text-xs font-bold text-gray-600 hover:text-violet-700 transition-colors">Reception</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
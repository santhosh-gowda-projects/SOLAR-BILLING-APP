
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TenantManagement from './components/TenantManagement';
import BillGenerator from './components/BillGenerator';
import History from './components/History';
import Pricing from './components/Pricing';
import OwnerManagement from './components/OwnerManagement';
import { UserRole, Tenant, Bill } from './types';
import { MOCK_TENANTS, MOCK_BILLS } from './constants';
import { ShieldAlert, Sun, Smartphone, Key, ShieldCheck, User, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role, setRole] = useState<UserRole>('GUEST');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Global State
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem('solar_tenants');
    return saved ? JSON.parse(saved) : MOCK_TENANTS;
  });

  const [bills, setBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem('solar_bills');
    return saved ? JSON.parse(saved) : MOCK_BILLS;
  });

  const [rates, setRates] = useState({
    residential: 8.50,
    commercial: 12.00,
    gst: 18,
    fixedCharge: 150
  });

  // Persist data
  useEffect(() => {
    localStorage.setItem('solar_tenants', JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    localStorage.setItem('solar_bills', JSON.stringify(bills));
  }, [bills]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (step === 1) {
        setStep(2);
      } else {
        if (phone.startsWith('99')) {
          setRole('ADMIN');
          setActiveTab('admin-dashboard');
        } else {
          setRole('OWNER');
          setActiveTab('dashboard');
        }
      }
    }, 800);
  };

  const loginAs = (targetRole: UserRole) => {
    setRole(targetRole);
    setActiveTab(targetRole === 'ADMIN' ? 'admin-dashboard' : 'dashboard');
  };

  if (role === 'GUEST') {
    return (
      <div className="min-h-screen solar-gradient flex items-center justify-center p-6 overflow-hidden relative">
        <div className="sunbeam-bg" />
        <div className="max-w-md w-full glass-card p-10 rounded-[2.5rem] shadow-2xl border-white/30 animate-in fade-in zoom-in-95 duration-500 relative z-10">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="p-4 bg-white/20 backdrop-blur-xl rounded-[1.5rem] text-white shadow-xl mb-6">
              <Sun size={48} />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight leading-none">SolarBill</h1>
            <p className="text-white/80 font-medium mt-2">Sustainable Tenant Management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {step === 1 ? (
              <div className="space-y-4">
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
                  <input type="tel" placeholder="Phone Number" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:outline-none transition-all font-medium" />
                </div>
                <button type="submit" disabled={isLoading} className="w-full py-4 bg-white text-amber-600 rounded-2xl font-bold shadow-xl shadow-amber-900/20 hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center justify-center gap-2">
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
                  <input type="text" placeholder="Enter OTP" required maxLength={4} value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:outline-none tracking-[0.5em] text-center font-black text-2xl transition-all" />
                </div>
                <button type="submit" disabled={isLoading} className="w-full py-4 bg-white text-amber-600 rounded-2xl font-bold shadow-xl shadow-amber-900/20 hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center justify-center gap-2">
                  {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                </button>
                <button type="button" onClick={() => setStep(1)} className="w-full text-white/60 text-sm font-bold hover:text-white transition-colors">Change phone number</button>
              </div>
            )}
          </form>

          <div className="mt-10 pt-8 border-t border-white/10 space-y-4">
            <p className="text-center text-white/40 text-[10px] font-bold uppercase tracking-widest mb-4">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => loginAs('OWNER')} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all text-white group">
                <div className="p-2 bg-amber-500/20 rounded-xl group-hover:scale-110 transition-transform"><User size={20} /></div>
                <span className="text-xs font-bold">Landlord</span>
              </button>
              <button onClick={() => loginAs('ADMIN')} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all text-white group">
                <div className="p-2 bg-emerald-500/20 rounded-xl group-hover:scale-110 transition-transform"><ShieldCheck size={20} /></div>
                <span className="text-xs font-bold">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': 
        return <Dashboard bills={bills} tenants={tenants} />;
      case 'tenants': 
        return <TenantManagement tenants={tenants} setTenants={setTenants} />;
      case 'billing': 
        return <BillGenerator tenants={tenants} bills={bills} setBills={setBills} rates={rates} />;
      case 'history': 
        return <History bills={bills} setBills={setBills} />;
      case 'pricing': 
        return <Pricing rates={rates} setRates={setRates} />;
      case 'owner-management': 
        return <OwnerManagement />;
      case 'admin-dashboard':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
            <div className="p-8 bg-slate-100 rounded-full text-slate-400 shadow-inner"><ShieldAlert size={80} /></div>
            <div className="max-w-xl">
              <h2 className="text-4xl font-black text-slate-100 tracking-tight">System Analytics</h2>
              <p className="text-slate-500 mt-2">High-level control panel for global solar network oversight.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
              <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Owners</p>
                <div className="flex items-end gap-2 mt-2">
                  <p className="text-4xl font-black text-white">1,245</p>
                </div>
              </div>
              <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Revenue</p>
                <div className="flex items-end gap-2 mt-2">
                  <p className="text-4xl font-black text-emerald-400">₹12.4M</p>
                </div>
              </div>
              <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Grid Capacity</p>
                <div className="flex items-end gap-2 mt-2">
                  <p className="text-4xl font-black text-amber-500">842</p>
                  <span className="text-lg font-bold text-amber-400/60 mb-1">kWp</span>
                </div>
              </div>
            </div>
            <button onClick={() => setActiveTab('owner-management')} className="flex items-center gap-2 text-sm font-bold text-amber-500 hover:text-amber-400 group pt-4">
              Manage Registered Owners <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} role={role} onLogout={() => { setRole('GUEST'); setStep(1); setPhone(''); setOtp(''); }}>
      {renderContent()}
    </Layout>
  );
};

export default App;

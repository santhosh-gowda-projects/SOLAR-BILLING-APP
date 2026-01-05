
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import Dashboard from './components/Dashboard.tsx';
import TenantManagement from './components/TenantManagement.tsx';
import BillGenerator from './components/BillGenerator.tsx';
import History from './components/History.tsx';
import Pricing from './components/Pricing.tsx';
import OwnerManagement from './components/OwnerManagement.tsx';
import TenantPortal from './components/TenantPortal.tsx';
import SystemHealth from './components/SystemHealth.tsx';
import Onboarding from './components/Onboarding.tsx';
import SolarLogo from './components/SolarLogo.tsx';
import { UserRole, Tenant, Bill, Owner } from './types.ts';
import { MOCK_TENANTS, MOCK_BILLS } from './constants.tsx';
import { Smartphone, Key, ShieldCheck, User, ArrowRight, Zap, ArrowLeft, UserPlus } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role, setRole] = useState<UserRole>('GUEST');
  const [isRegistering, setIsRegistering] = useState(false);
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
        } else if (phone.startsWith('88')) {
          setRole('TENANT_VIEWER');
          setActiveTab('tenant-dashboard');
        } else {
          setRole('OWNER');
          setActiveTab('dashboard');
        }
      }
    }, 800);
  };

  const loginAs = (targetRole: UserRole) => {
    setRole(targetRole);
    if (targetRole === 'ADMIN') setActiveTab('admin-dashboard');
    else if (targetRole === 'TENANT_VIEWER') setActiveTab('tenant-dashboard');
    else setActiveTab('dashboard');
  };

  const handleOnboardingComplete = (data: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsRegistering(false);
      setRole('OWNER');
      setActiveTab('dashboard');
    }, 1500);
  };

  if (isRegistering) {
    return <Onboarding onComplete={handleOnboardingComplete} onCancel={() => setIsRegistering(false)} />;
  }

  if (role === 'GUEST') {
    return (
      <div className="min-h-screen solar-gradient flex items-center justify-center p-6 overflow-hidden relative">
        <div className="sunbeam-bg opacity-30" />
        <div className="max-w-md w-full glass-card p-10 rounded-[2.5rem] shadow-2xl border-white/20 animate-in fade-in zoom-in-95 duration-500 relative z-10 backdrop-blur-3xl">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="p-1 mb-6">
              <SolarLogo size={100} />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight leading-none">SolarBill</h1>
            <p className="text-white/60 font-semibold mt-3 uppercase tracking-widest text-[10px]">Premium Energy Management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {step === 1 ? (
              <div className="space-y-4">
                <div className="relative group">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-amber-400 transition-colors" size={20} />
                  <input type="tel" placeholder="Phone Number" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/20 border border-white/10 text-white placeholder:text-white/20 focus:bg-black/40 focus:border-amber-500/50 focus:outline-none transition-all font-bold" />
                </div>
                <button type="submit" disabled={isLoading} className="w-full py-4 bg-white text-amber-600 rounded-2xl font-black shadow-xl shadow-amber-950/20 hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center justify-center gap-2">
                  {isLoading ? 'Processing...' : 'Send Access Key'}
                </button>
                <button type="button" onClick={() => setIsRegistering(true)} className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-sm">
                  <UserPlus size={18} />
                  New Landlord? Register
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div className="relative group">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-amber-400 transition-colors" size={20} />
                  <input type="text" placeholder="Enter OTP" required maxLength={4} value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/20 border border-white/10 text-white placeholder:text-white/20 focus:bg-black/40 focus:border-amber-500/50 focus:outline-none tracking-[0.5em] text-center font-black text-2xl transition-all" />
                </div>
                <button type="submit" disabled={isLoading} className="w-full py-4 bg-white text-amber-600 rounded-2xl font-black shadow-xl shadow-amber-950/20 hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center justify-center gap-2">
                  {isLoading ? 'Authenticating...' : 'Confirm Identity'}
                </button>
                <button type="button" onClick={() => setStep(1)} className="w-full text-white/40 text-xs font-bold hover:text-white transition-colors">Wrong number? Edit</button>
              </div>
            )}
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
            <p className="text-center text-white/20 text-[9px] font-black uppercase tracking-[0.3em] mb-4">Select Simulation Mode</p>
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => loginAs('TENANT_VIEWER')} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-white group">
                <div className="p-2 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform"><Zap size={18} className="text-blue-400" /></div>
                <span className="text-[9px] font-black uppercase">Tenant</span>
              </button>
              <button onClick={() => loginAs('OWNER')} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-white group">
                <div className="p-2 bg-amber-500/10 rounded-xl group-hover:scale-110 transition-transform"><User size={18} className="text-amber-400" /></div>
                <span className="text-[9px] font-black uppercase">Landlord</span>
              </button>
              <button onClick={() => loginAs('ADMIN')} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-white group">
                <div className="p-2 bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform"><ShieldCheck size={18} className="text-emerald-400" /></div>
                <span className="text-[9px] font-black uppercase">Admin</span>
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
        return <TenantManagement tenants={tenants} setTenants={setTenants} onBack={() => setActiveTab('dashboard')} />;
      case 'billing': 
        return <BillGenerator tenants={tenants} bills={bills} setBills={setBills} rates={rates} onBack={() => setActiveTab('dashboard')} />;
      case 'history': 
        return <History bills={bills} setBills={setBills} onBack={() => role === 'TENANT_VIEWER' ? setActiveTab('tenant-dashboard') : setActiveTab('dashboard')} />;
      case 'pricing': 
        return <Pricing rates={rates} setRates={setRates} onBack={() => setActiveTab('dashboard')} />;
      
      case 'owner-management': 
        return <OwnerManagement onBack={() => setActiveTab('admin-dashboard')} />;
      case 'system-health':
        return <SystemHealth onBack={() => setActiveTab('admin-dashboard')} />;
      case 'admin-dashboard':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in">
            <div className="p-8 bg-white/5 rounded-full text-white/20 shadow-inner border border-white/5"><ShieldCheck size={80} /></div>
            <div className="max-w-xl">
              <h2 className="text-5xl font-black text-white tracking-tight">Command Center</h2>
              <p className="text-white/40 mt-2 text-lg">High-level governance for the global solar real-estate network.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
              <div className="bg-[#111317] p-8 rounded-[40px] border border-white/5 text-left group hover:border-amber-500/50 transition-all cursor-pointer" onClick={() => setActiveTab('owner-management')}>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Total Portfolios</p>
                <p className="text-4xl font-black text-white mt-2">1,245</p>
                <div className="mt-6 text-xs font-bold text-amber-500 flex items-center gap-2">Manage Entities <ArrowRight size={14} /></div>
              </div>
              <div className="bg-[#111317] p-8 rounded-[40px] border border-white/5 text-left group hover:border-emerald-500/50 transition-all cursor-pointer" onClick={() => setActiveTab('system-health')}>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">System Status</p>
                <p className="text-4xl font-black text-emerald-400 mt-2">Nominal</p>
                <div className="mt-6 text-xs font-bold text-emerald-500 flex items-center gap-2">Diagnostics <ArrowRight size={14} /></div>
              </div>
              <div className="bg-[#111317] p-8 rounded-[40px] border border-white/5 text-left group hover:border-blue-500/50 transition-all">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Global Revenue</p>
                <p className="text-4xl font-black text-blue-400 mt-2">₹12.4M</p>
                <div className="mt-6 text-xs font-bold text-blue-500 flex items-center gap-2">Audit Ledger <ArrowRight size={14} /></div>
              </div>
            </div>
          </div>
        );

      case 'tenant-dashboard':
        return <TenantPortal bills={bills} name="Suresh Raina" />;
      case 'tenant-bills':
        return <History bills={bills} setBills={setBills} onBack={() => setActiveTab('tenant-dashboard')} />;
      case 'tenant-support': 
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in fade-in">
             <button 
               onClick={() => setActiveTab('tenant-dashboard')}
               className="self-start flex items-center gap-2 text-white/40 hover:text-amber-400 transition-colors group mb-12"
             >
               <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to My Portal</span>
             </button>
             <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500"><Zap size={48} /></div>
             <h2 className="text-4xl font-black">Support Assistant</h2>
             <p className="text-white/40 text-center max-w-sm text-lg font-medium leading-relaxed">Need help with your bill or solar meter? Our AI-powered assistant is here to resolve technical issues instantly.</p>
             <button className="px-12 py-5 bg-[#FFD335] text-black rounded-[2rem] font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all">Start Conversation</button>
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

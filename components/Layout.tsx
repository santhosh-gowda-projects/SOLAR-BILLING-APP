
import React, { useState } from 'react';
import { Menu, X, LogOut, ShieldCheck, PieChart, Users, Receipt, History as HistoryIcon, Settings, PlusCircle } from 'lucide-react';
import { NAV_ITEMS, ADMIN_NAV_ITEMS } from '../constants';
import { UserRole } from '../types';
import SolarLogo from './SolarLogo.tsx';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, role, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const items = role === 'ADMIN' ? [...ADMIN_NAV_ITEMS, ...NAV_ITEMS] : NAV_ITEMS;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#08090A] text-white">
      {/* Mobile Top Header (Fixed) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#111317]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <SolarLogo size={32} />
          <span className="font-extrabold text-lg tracking-tight">SolarBill</span>
        </div>
        <button onClick={onLogout} className="p-2 text-white/30 hover:text-red-400">
          <LogOut size={20} />
        </button>
      </div>

      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex w-72 bg-[#111317] border-r border-white/5 flex-col p-8">
        <div className="flex items-center gap-4 mb-12">
          <SolarLogo size={44} />
          <div>
            <h1 className="font-extrabold text-xl leading-none">SolarBill</h1>
            <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">Smart Grid Hub</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-black mb-6 px-4">Core Systems</p>
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[13px] font-bold transition-all group
                ${activeTab === item.id 
                  ? 'bg-[#FFD335] text-black shadow-lg shadow-amber-500/20' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'}
              `}
            >
              <item.icon size={18} className={activeTab === item.id ? 'text-black' : 'group-hover:text-amber-400'} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8">
           <div className="p-4 rounded-3xl bg-white/5 border border-white/5 mb-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                <ShieldCheck size={18} />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black truncate">Rajesh Kumar</p>
                <p className="text-[8px] text-white/30 uppercase tracking-[0.2em] font-black">Authorized Owner</p>
              </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-400 hover:bg-red-400/5 transition-colors">
            <LogOut size={16} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto pb-24 md:pb-0">
        <div className="max-w-7xl mx-auto p-4 md:p-14 animate-fade-up">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation (Visible only on Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111317]/90 backdrop-blur-3xl border-t border-white/5 px-6 py-4 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
        <BottomNavItem icon={PieChart} label="Home" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <BottomNavItem icon={Users} label="Nodes" active={activeTab === 'tenants'} onClick={() => setActiveTab('tenants')} />
        
        {/* Central Action Button */}
        <button 
          onClick={() => setActiveTab('billing')}
          className={`
            -translate-y-8 w-16 h-16 solar-gradient rounded-full flex items-center justify-center text-black shadow-2xl shadow-amber-500/40 ring-[10px] ring-[#08090A] transition-all active:scale-90
            ${activeTab === 'billing' ? 'scale-110' : ''}
          `}
        >
          <PlusCircle size={36} />
        </button>

        <BottomNavItem icon={HistoryIcon} label="Audit" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
        <BottomNavItem icon={Settings} label="Gov" active={activeTab === 'pricing'} onClick={() => setActiveTab('pricing')} />
      </nav>
    </div>
  );
};

const BottomNavItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 transition-all ${active ? 'text-[#FFD335]' : 'text-white/20'}`}
  >
    <Icon size={18} className={active ? 'scale-110' : ''} />
    <span className="text-[8px] font-black uppercase tracking-[0.2em]">{label}</span>
  </button>
);

export default Layout;

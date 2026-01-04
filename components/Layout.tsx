
import React, { useState } from 'react';
import { Menu, X, Sun, LogOut, ShieldCheck, PieChart, Users, Receipt, History as HistoryIcon, Settings, PlusCircle } from 'lucide-react';
import { NAV_ITEMS, ADMIN_NAV_ITEMS } from '../constants';
import { UserRole } from '../types';

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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 solar-gradient rounded-lg flex items-center justify-center text-black">
            {/* Fix: Lucide icons do not have a 'weight' property. Using only 'size' */}
            <Sun size={18} />
          </div>
          <span className="font-extrabold text-lg tracking-tight">SolarBill</span>
        </div>
        <button onClick={onLogout} className="p-2 text-white/30 hover:text-red-400">
          <LogOut size={20} />
        </button>
      </div>

      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex w-72 bg-[#111317] border-r border-white/5 flex-col p-8">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 solar-gradient rounded-2xl flex items-center justify-center text-black shadow-lg shadow-amber-500/20">
            <Sun size={28} />
          </div>
          <div>
            <h1 className="font-extrabold text-xl leading-none">SolarBill</h1>
            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Smart Energy</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="text-[11px] text-white/30 uppercase tracking-[0.2em] font-bold mb-4 px-4">Management</p>
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[14px] font-semibold transition-all group
                ${activeTab === item.id 
                  ? 'bg-[#FFD335] text-black shadow-lg shadow-amber-500/10' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'}
              `}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-black' : 'group-hover:text-amber-400'} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8">
           <div className="p-4 rounded-3xl bg-white/5 border border-white/5 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500">
                <ShieldCheck size={16} />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">Rajesh Kumar</p>
                <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Landlord</p>
              </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-red-400 hover:bg-red-400/10 transition-colors">
            <LogOut size={16} />
            <span>Sign Out</span>
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111317]/90 backdrop-blur-2xl border-t border-white/5 px-6 py-3 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <BottomNavItem icon={PieChart} label="Home" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <BottomNavItem icon={Users} label="Tenants" active={activeTab === 'tenants'} onClick={() => setActiveTab('tenants')} />
        
        {/* Central Action Button */}
        <button 
          onClick={() => setActiveTab('billing')}
          className={`
            -translate-y-6 w-14 h-14 solar-gradient rounded-full flex items-center justify-center text-black shadow-xl shadow-amber-500/30 ring-8 ring-[#08090A] transition-transform active:scale-90
            ${activeTab === 'billing' ? 'scale-110' : ''}
          `}
        >
          <PlusCircle size={32} />
        </button>

        <BottomNavItem icon={HistoryIcon} label="Bills" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
        <BottomNavItem icon={Settings} label="Admin" active={activeTab === 'pricing'} onClick={() => setActiveTab('pricing')} />
      </nav>
    </div>
  );
};

const BottomNavItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-[#FFD335]' : 'text-white/30'}`}
  >
    <Icon size={20} className={active ? 'animate-pulse' : ''} />
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

export default Layout;

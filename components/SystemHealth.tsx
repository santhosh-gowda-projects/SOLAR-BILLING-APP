
import React from 'react';
import { Activity, ShieldCheck, Cpu, Database, Globe, AlertTriangle, ArrowLeft } from 'lucide-react';

interface SystemHealthProps {
  onBack: () => void;
}

const SystemHealth: React.FC<SystemHealthProps> = ({ onBack }) => {
  const metrics = [
    { label: 'Core Engine', status: 'Online', latency: '24ms', icon: Cpu, color: 'text-emerald-400' },
    { label: 'Database Mesh', status: 'Optimal', latency: '12ms', icon: Database, color: 'text-emerald-400' },
    { label: 'Gemini AI Node', status: 'Stable', latency: '840ms', icon: Globe, color: 'text-amber-400' },
    { label: 'Billing Queue', status: 'Processing', latency: 'N/A', icon: Activity, color: 'text-blue-400' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white/40 hover:text-amber-400 transition-colors group mb-4"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Command Center</span>
      </button>

      <div>
        <h2 className="text-5xl font-black text-white tracking-tight">System Infrastructure</h2>
        <p className="text-white/40 text-lg">Global node status and connectivity audit.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {metrics.map((m, i) => (
          <div key={i} className="bg-[#111317] p-8 rounded-[40px] border border-white/5 space-y-6">
            <div className={`w-14 h-14 bg-white/5 ${m.color} rounded-2xl flex items-center justify-center`}>
              <m.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">{m.label}</p>
              <h4 className="text-2xl font-black tracking-tight">{m.status}</h4>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Latency</span>
              <span className="text-xs font-mono font-bold text-white/40">{m.latency}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#111317] rounded-[40px] border border-white/5 p-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-10 opacity-5">
            <ShieldCheck size={200} />
          </div>
          <h3 className="text-2xl font-bold mb-8">Security Audit Log</h3>
          <div className="space-y-6">
            {[
              { event: 'Super Admin Login', user: 'System (192.168.1.1)', time: '2 mins ago', type: 'INFO' },
              { event: 'Global Pricing Shift', user: 'Admin User', time: '1 hour ago', type: 'WARN' },
              { event: 'New Entity Onboarding', user: 'Landlord-721', time: '4 hours ago', type: 'INFO' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[#08090A] rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${log.type === 'WARN' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <div>
                    <p className="text-sm font-bold text-white">{log.event}</p>
                    <p className="text-[10px] text-white/30">{log.user}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-white/20">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111317] rounded-[40px] border border-white/5 p-10 space-y-8">
          <h3 className="text-2xl font-bold">Maintenance</h3>
          <p className="text-white/40 text-sm leading-relaxed">System-wide maintenance operations for the global solar network.</p>
          <div className="space-y-4">
            <button className="w-full py-4 bg-white/5 border border-white/5 text-white/60 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">Flush System Cache</button>
            <button className="w-full py-4 bg-white/5 border border-white/5 text-white/60 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">Re-Index Ledger</button>
            <button className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3">
              <AlertTriangle size={16} /> Global Maintenance Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;


import React, { useState } from 'react';
import { Users, MoreHorizontal, UserPlus, ShieldCheck, Mail, Building, PieChart, Activity, ShieldAlert, X, ArrowLeft } from 'lucide-react';
import { MOCK_OWNERS } from '../constants';

interface OwnerManagementProps {
  onBack: () => void;
}

const OwnerManagement: React.FC<OwnerManagementProps> = ({ onBack }) => {
  const [owners, setOwners] = useState(MOCK_OWNERS);
  const [selectedOwner, setSelectedOwner] = useState<any>(null);

  const toggleStatus = (id: string) => {
    setOwners(prev => prev.map(o => 
      o.id === id ? { ...o, status: o.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : o
    ));
    setSelectedOwner(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white/40 hover:text-amber-400 transition-colors group mb-4"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Command Center</span>
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tight">Portfolio Entities</h2>
          <p className="text-white/40 text-lg">Governance oversight for registered property networks.</p>
        </div>
        <button className="flex items-center justify-center gap-3 solar-gradient text-black px-10 py-5 rounded-[2rem] font-black text-lg shadow-2xl transition-all hover:scale-[1.03]">
          <UserPlus size={24} />
          Onboard New Entity
        </button>
      </div>

      <div className="bg-[#111317] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] text-white/20 text-[10px] font-black uppercase tracking-[0.25em]">
                <th className="px-10 py-8">Entity Profile</th>
                <th className="px-10 py-8">Asset Count</th>
                <th className="px-10 py-8">Ledger Volume</th>
                <th className="px-10 py-8">Status</th>
                <th className="px-10 py-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {owners.map((owner) => (
                <tr key={owner.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-[#08090A] text-white/40 font-black text-xl flex items-center justify-center border border-white/5 group-hover:border-amber-500/50 transition-all">
                        {owner.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-white text-lg leading-tight">{owner.name}</p>
                        <p className="text-[10px] text-white/30 font-black uppercase tracking-wider mt-1">{owner.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 font-bold text-white/60">{owner.tenantCount} Units</td>
                  <td className="px-10 py-8 font-black text-white text-xl">₹{owner.totalRevenue.toLocaleString()}</td>
                  <td className="px-10 py-8">
                    <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${owner.status === 'ACTIVE' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/10' : 'text-red-400 bg-red-400/10 border-red-400/10'}`}>
                      {owner.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button 
                      onClick={() => setSelectedOwner(owner)}
                      className="p-3 text-white/20 hover:text-white bg-white/5 rounded-2xl transition-all"
                    >
                      <MoreHorizontal size={24} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOwner && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in">
          <div className="bg-[#111317] w-full max-w-md rounded-[48px] border border-white/10 p-12 relative">
             <button onClick={() => setSelectedOwner(null)} className="absolute top-8 right-8 text-white/20"><X size={24} /></button>
             <h3 className="text-3xl font-black mb-2">Entity Control</h3>
             <p className="text-white/40 mb-10">Portfolio: <span className="text-white font-bold">{selectedOwner.name}</span></p>
             
             <div className="space-y-4">
                <button className="w-full py-5 bg-white/5 border border-white/5 rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-white/10">Audit Transaction History</button>
                <button className="w-full py-5 bg-white/5 border border-white/5 rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-white/10">Export Portfolio Data</button>
                <button 
                  onClick={() => toggleStatus(selectedOwner.id)}
                  className={`w-full py-5 rounded-3xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 ${selectedOwner.status === 'ACTIVE' ? 'bg-red-500/10 text-red-500 border border-red-500/10' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10'}`}
                >
                  <ShieldAlert size={18} />
                  {selectedOwner.status === 'ACTIVE' ? 'Suspend Portfolio' : 'Restore Access'}
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerManagement;

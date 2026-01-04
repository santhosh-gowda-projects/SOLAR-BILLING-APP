
import React from 'react';
import { Users, MoreHorizontal, UserPlus, ShieldCheck, Mail, Building, PieChart, Activity } from 'lucide-react';
import { MOCK_OWNERS } from '../constants';

const OwnerManagement: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">System Entities</h2>
          <p className="text-slate-400 mt-1 font-medium text-lg">Super Admin oversight for all registered property owners.</p>
        </div>
        <button className="flex items-center justify-center gap-3 bg-white text-slate-950 px-10 py-5 rounded-[2rem] font-black text-lg shadow-2xl transition-all hover:scale-[1.03] active:scale-95">
          <UserPlus size={24} />
          Register Entity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl flex items-center gap-6 backdrop-blur-md">
          <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center border border-blue-500/10">
            <Users size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none mb-2">Entities</p>
            <p className="text-4xl font-black text-white tracking-tighter">1,245</p>
          </div>
        </div>
        <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl flex items-center gap-6 backdrop-blur-md">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/10">
            <PieChart size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none mb-2">Total Tenants</p>
            <p className="text-4xl font-black text-white tracking-tighter">4,892</p>
          </div>
        </div>
        <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl flex items-center gap-6 backdrop-blur-md">
          <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center border border-amber-500/10">
            <Activity size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none mb-2">Stability</p>
            <p className="text-4xl font-black text-white tracking-tighter">99.9%</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/40 rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-md">
        <div className="p-10 border-b border-slate-800 bg-slate-950/30 flex justify-between items-center">
          <h3 className="text-2xl font-black text-white flex items-center gap-4">
            <Building className="text-amber-500" size={28} />
            Owner Directory
          </h3>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">Audit filters</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/30 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-10 py-8">Entity Profile</th>
                <th className="px-10 py-8">Managed Units</th>
                <th className="px-10 py-8">Ledger Revenue</th>
                <th className="px-10 py-8">Security</th>
                <th className="px-10 py-8 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {MOCK_OWNERS.map((owner) => (
                <tr key={owner.id} className="hover:bg-slate-800/20 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-slate-950 text-slate-400 font-black text-xl flex items-center justify-center border border-slate-800 group-hover:border-amber-500/50 transition-all">
                        {owner.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-100 group-hover:text-white text-lg leading-tight">{owner.name}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-600 font-black uppercase tracking-wider mt-1">
                          <Mail size={12} className="text-slate-700" /> {owner.name.toLowerCase().replace(' ', '.')}@solar-cloud.io
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="text-sm">
                      <p className="font-black text-slate-200 text-lg tracking-tight">{owner.tenantCount} Tenants</p>
                      <p className="text-[10px] text-slate-600 font-black uppercase mt-1 tracking-widest">3 Active Nodes</p>
                    </div>
                  </td>
                  <td className="px-10 py-8 font-black text-white text-2xl tracking-tighter">₹{owner.totalRevenue.toLocaleString()}</td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-2xl text-[10px] font-black uppercase w-fit border border-emerald-500/10 tracking-[0.2em]">
                      <ShieldCheck size={14} /> Full Trust
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <button className="p-3 text-slate-600 hover:text-white group-hover:bg-slate-800 rounded-2xl transition-all">
                      <MoreHorizontal size={24} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwnerManagement;

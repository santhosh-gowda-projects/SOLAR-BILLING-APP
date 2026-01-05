
import React from 'react';
import { Zap, CreditCard, Sparkles, ArrowUpRight, TrendingDown, Receipt, Clock } from 'lucide-react';
import { Bill } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TenantPortalProps {
  bills: Bill[];
  name: string;
}

const TenantPortal: React.FC<TenantPortalProps> = ({ bills, name }) => {
  const pendingBill = bills.find(b => b.status === 'PENDING' && b.tenantName === name);
  const paidBills = bills.filter(b => b.status === 'PAID' && b.tenantName === name);
  
  const chartData = [
    { month: 'Aug', units: 120 },
    { month: 'Sep', units: 145 },
    { month: 'Oct', units: 95 },
    { month: 'Nov', units: 110 },
  ];

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Welcome, {name}</h2>
          <p className="text-white/40 text-lg">Real-time solar consumption overview.</p>
        </div>
        <div className="bg-[#34D399]/10 px-6 py-4 rounded-[2rem] border border-[#34D399]/10 flex items-center gap-3">
          <TrendingDown size={20} className="text-[#34D399]" />
          <p className="text-sm font-bold text-[#34D399]">Usage down 12% from last month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-[#111317] rounded-[40px] border border-white/5 p-10 space-y-8 shadow-2xl">
           <div className="flex justify-between items-center">
             <h3 className="text-2xl font-bold">Usage Analysis</h3>
             <span className="text-[10px] bg-white/5 px-4 py-2 rounded-xl text-white/40 font-bold uppercase tracking-widest">Unit History</span>
           </div>
           <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.2)', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#111317', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px'}}
                  itemStyle={{color: '#34D399'}}
                />
                <Area type="monotone" dataKey="units" stroke="#34D399" strokeWidth={3} fillOpacity={1} fill="url(#colorUnits)" />
              </AreaChart>
            </ResponsiveContainer>
           </div>
        </div>

        <div className="space-y-8">
          <div className={`p-8 rounded-[40px] border flex flex-col justify-between min-h-[300px] transition-all ${pendingBill ? 'bg-[#FFD335] text-black shadow-2xl shadow-amber-500/20' : 'bg-[#111317] border-white/5 shadow-xl'}`}>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">{pendingBill ? 'Current Dues' : 'Up to Date'}</p>
              <h4 className="text-5xl font-black tracking-tighter">₹{pendingBill?.totalAmount || 0}</h4>
            </div>
            {pendingBill ? (
              <button className="w-full py-5 bg-black text-white rounded-3xl font-black text-lg flex items-center justify-center gap-3 group">
                Pay Securely <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            ) : (
              <div className="p-4 bg-white/5 rounded-3xl flex items-center gap-3">
                <Clock size={20} className="text-[#34D399]" />
                <p className="text-xs font-bold text-white/50">Next bill in 14 days</p>
              </div>
            )}
          </div>

          <div className="bg-[#111317] rounded-[40px] border border-white/5 p-8 shadow-xl">
             <h4 className="text-lg font-bold mb-6 flex items-center gap-3"><Sparkles className="text-amber-500" size={18} /> Smart Insights</h4>
             <p className="text-white/40 text-sm leading-relaxed italic">"Your peak consumption is between 7PM and 10PM. Shift laundry to 1PM to leverage direct solar output."</p>
          </div>
        </div>
      </div>

      <div className="bg-[#111317] rounded-[40px] border border-white/5 p-10 overflow-hidden shadow-2xl">
        <h3 className="text-2xl font-bold mb-8">Payment Records</h3>
        <div className="space-y-4">
          {paidBills.length > 0 ? paidBills.map(bill => (
            <div key={bill.id} className="flex items-center justify-between p-6 bg-[#08090A] rounded-3xl border border-white/5 hover:border-amber-500/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#34D399]">
                  <Receipt size={24} />
                </div>
                <div>
                  <p className="font-bold text-white">{bill.billingMonth}</p>
                  <p className="text-[10px] font-black font-mono text-white/20 uppercase tracking-tighter">{bill.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-black">₹{bill.totalAmount}</p>
                <p className="text-[10px] font-black text-[#34D399] uppercase tracking-widest">Succeeded</p>
              </div>
            </div>
          )) : (
            <div className="p-10 text-center text-white/20 font-bold border-2 border-dashed border-white/5 rounded-[2rem]">
              No payment history found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantPortal;

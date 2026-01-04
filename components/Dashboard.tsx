
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Zap, Wallet, Sparkles, ArrowUpRight } from 'lucide-react';
import { Bill, Tenant } from '../types';
import { getBillingSummary } from '../services/geminiService';

interface DashboardProps {
  bills: Bill[];
  tenants: Tenant[];
}

const Dashboard: React.FC<DashboardProps> = ({ bills, tenants }) => {
  const [insight, setInsight] = useState<string>("Analyzing your grid performance...");

  useEffect(() => {
    const fetchInsight = async () => {
      if (bills.length > 0) {
        const summary = await getBillingSummary(bills.slice(0, 5));
        setInsight(summary);
      }
    };
    fetchInsight();
  }, [bills]);

  const totalRevenue = bills.filter(b => b.status === 'PAID').reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalUnits = bills.reduce((acc, curr) => acc + curr.unitsConsumed, 0);
  const activeTenantsCount = tenants.filter(t => t.status === 'ACTIVE').length;
  const paymentRate = bills.length > 0 ? Math.round((bills.filter(b => b.status === 'PAID').length / bills.length) * 100) : 0;

  const chartData = [
    { name: 'Jan', val: 4000 },
    { name: 'Feb', val: 3000 },
    { name: 'Mar', val: 5000 },
    { name: 'Apr', val: 2780 },
    { name: 'May', val: 1890 },
    { name: 'Jun', val: 2390 },
    { name: 'Jul', val: 3490 },
  ];

  return (
    <div className="space-y-6 md:space-y-12 pb-4">
      {/* Mobile Adaptive Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-1">Hello, Rajesh</h2>
          <p className="text-white/40 font-medium text-sm md:text-lg">Your solar real-estate overview.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/5 p-3 md:px-6 md:py-4 rounded-2xl md:rounded-3xl">
          <Sparkles size={16} className="text-amber-400 shrink-0" />
          <p className="text-[11px] md:text-sm font-semibold text-white/70 italic line-clamp-2 md:line-clamp-none">"{insight}"</p>
        </div>
      </div>

      {/* Vertical Stats on Mobile, Grid on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard label="Revenue" value={`₹${(totalRevenue/1000).toFixed(1)}k`} trend="+14%" icon={Wallet} color="text-[#34D399]" />
        <StatCard label="Tenants" value={activeTenantsCount.toString()} trend="OK" icon={Users} color="text-blue-400" />
        <StatCard label="Energy" value={`${(totalUnits / 1000).toFixed(1)}k`} trend="+8%" icon={Zap} color="text-[#FFD335]" />
        <StatCard label="Rate" value={`${paymentRate}%`} trend="Good" icon={TrendingUp} color="text-purple-400" />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-[#111317] p-6 md:p-10 rounded-3xl md:rounded-[40px] border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg md:text-2xl font-bold">Revenue Flux</h3>
            <span className="text-[10px] bg-white/5 px-2 py-1 rounded-lg text-white/40 font-bold uppercase tracking-widest">6M</span>
          </div>
          <div className="h-[200px] md:h-[350px] -ml-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFD335" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#FFD335" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.2)', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#111317', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                  itemStyle={{color: '#FFD335'}}
                />
                <Area type="monotone" dataKey="val" stroke="#FFD335" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#111317] p-6 md:p-10 rounded-3xl md:rounded-[40px] border border-white/5">
          <h3 className="text-lg md:text-2xl font-bold mb-6">Recent Ledger</h3>
          <div className="space-y-6">
            {bills.slice(-3).reverse().map((bill) => (
              <div key={bill.id} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bill.status === 'PAID' ? 'bg-[#34D399]/10 text-[#34D399]' : 'bg-amber-500/10 text-amber-500'}`}>
                  {bill.status === 'PAID' ? <Wallet size={18} /> : <Zap size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs truncate">{bill.tenantName}</p>
                  <p className="text-[9px] text-white/30 font-black uppercase tracking-widest">₹{bill.totalAmount}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${bill.status === 'PAID' ? 'bg-[#34D399]' : 'bg-amber-500'}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, trend, icon: Icon, color }: any) => (
  <div className="bg-[#111317] p-4 md:p-8 rounded-2xl md:rounded-[32px] border border-white/5 active:bg-white/5 transition-all">
    <div className={`w-8 h-8 md:w-12 md:h-12 bg-white/5 ${color} rounded-lg md:rounded-2xl flex items-center justify-center mb-3 md:mb-6`}>
      <Icon size={18} className="md:size-24" />
    </div>
    <p className="text-[9px] md:text-[11px] font-black text-white/30 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-1">
      <h4 className="text-xl md:text-3xl font-extrabold tracking-tight">{value}</h4>
      <span className={`text-[8px] md:text-[10px] font-black px-1.5 py-0.5 rounded-md w-fit ${trend.includes('+') ? 'text-[#34D399]' : 'text-white/40'}`}>
        {trend}
      </span>
    </div>
  </div>
);

export default Dashboard;

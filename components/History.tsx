
import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, Clock, Search, Printer, X, Receipt, Filter } from 'lucide-react';
import { Bill } from '../types';

interface HistoryProps {
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
}

const History: React.FC<HistoryProps> = ({ bills, setBills }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING'>('ALL');
  const [showReceipt, setShowReceipt] = useState<Bill | null>(null);

  const filteredBills = bills.filter(b => 
    (b.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     b.billingMonth.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'ALL' || b.status === statusFilter)
  ).reverse();

  const handleMarkAsPaid = (id: string) => {
    setBills(prev => prev.map(b => b.id === id ? { ...b, status: 'PAID' } : b));
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Tenant', 'Month', 'Units', 'Amount', 'Status', 'Date'];
    const rows = bills.map(b => [b.id, b.tenantName, b.billingMonth, b.unitsConsumed, b.totalAmount, b.status, b.generatedAt]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `solar_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-6 md:space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-1">Ledger Records</h2>
          <p className="text-white/40 font-medium text-sm md:text-lg">Audit trail of energy and payments.</p>
        </div>
        <button onClick={exportToCSV} className="hidden md:flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/5 rounded-[20px] text-sm font-bold text-white transition-all">
          <Download size={20} className="text-amber-400" />
          Export CSV
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-3">
         <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text" 
            placeholder="Search bills..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-[#111317] border border-white/5 text-white text-sm font-medium outline-none focus:border-amber-500/50"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setStatusFilter('ALL')} className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 ${statusFilter === 'ALL' ? 'bg-[#FFD335] text-black' : 'bg-[#111317] text-white/30'}`}>All</button>
          <button onClick={() => setStatusFilter('PENDING')} className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 ${statusFilter === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 'bg-[#111317] text-white/30'}`}>Unpaid</button>
          <button onClick={() => setStatusFilter('PAID')} className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 ${statusFilter === 'PAID' ? 'bg-[#34D399]/10 text-[#34D399]' : 'bg-[#111317] text-white/30'}`}>Paid</button>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-4">
        {filteredBills.map((bill) => (
          <div key={bill.id} className="bg-[#111317] p-5 rounded-3xl border border-white/5 active:bg-white/[0.02] transition-colors">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-[#08090A] rounded-xl flex items-center justify-center border border-white/5 text-amber-400">
                    <FileText size={18} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{bill.id}</p>
                    <p className="font-bold text-sm">{bill.billingMonth}</p>
                 </div>
               </div>
               <div className="text-right">
                 <p className="text-xl font-extrabold">₹{bill.totalAmount}</p>
               </div>
            </div>
            
            <div className="flex items-center justify-between py-4 border-t border-white/5">
              <div>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Resident</p>
                <p className="text-sm font-bold text-white/70">{bill.tenantName}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Status</p>
                <div className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${bill.status === 'PAID' ? 'text-[#34D399] bg-[#34D399]/10' : 'text-amber-500 bg-amber-500/10'}`}>
                  {bill.status}
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-2">
              {bill.status === 'PENDING' ? (
                <button onClick={() => handleMarkAsPaid(bill.id)} className="flex-1 py-3 bg-[#34D399] text-black rounded-xl text-xs font-black uppercase tracking-widest">Settle Bill</button>
              ) : (
                <button onClick={() => setShowReceipt(bill)} className="flex-1 py-3 bg-white/5 text-white/50 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"><Printer size={14} /> Receipt</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-[#111317] rounded-[32px] border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-white/30 text-[10px] font-black uppercase tracking-[0.25em] border-b border-white/5 bg-white/[0.01]">
              <th className="px-10 py-8">Reference</th>
              <th className="px-10 py-8">Consumer</th>
              <th className="px-10 py-8">Grid Usage</th>
              <th className="px-10 py-8">Net Total</th>
              <th className="px-10 py-8">Status</th>
              <th className="px-10 py-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredBills.map((bill) => (
              <tr key={bill.id} className="hover:bg-white/[0.02] transition-all group">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#08090A] text-white/40 flex items-center justify-center rounded-2xl border border-white/5 group-hover:border-amber-500/50 transition-colors">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{bill.billingMonth}</p>
                      <p className="text-[10px] font-black font-mono text-amber-500/60 uppercase">{bill.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8 font-semibold text-white/70">{bill.tenantName}</td>
                <td className="px-10 py-8">
                  <p className="text-sm font-black">{bill.unitsConsumed} <span className="text-white/30 text-[10px]">kWh</span></p>
                </td>
                <td className="px-10 py-8 text-lg font-extrabold">₹{bill.totalAmount}</td>
                <td className="px-10 py-8">
                  {bill.status === 'PAID' ? (
                    <span className="flex items-center gap-2 text-[#34D399] bg-[#34D399]/10 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#34D399]/10"><CheckCircle2 size={12} /> Paid</span>
                  ) : (
                    <span className="flex items-center gap-2 text-amber-500 bg-amber-500/10 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-500/10"><Clock size={12} /> Pending</span>
                  )}
                </td>
                <td className="px-10 py-8 text-right">
                  {bill.status === 'PENDING' ? (
                    <button onClick={() => handleMarkAsPaid(bill.id)} className="px-5 py-2.5 bg-[#34D399] text-black rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-[1.05] active:scale-95 transition-all shadow-lg shadow-[#34D399]/10">Settle</button>
                  ) : (
                    <button onClick={() => setShowReceipt(bill)} className="px-5 py-2.5 bg-white/5 text-white/70 hover:text-white rounded-xl text-[11px] font-black uppercase tracking-widest border border-white/5 flex items-center gap-2 ml-auto"><Printer size={14} /> Receipt</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modern Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in">
          <div className="bg-[#111317] w-full max-w-lg rounded-t-[40px] md:rounded-[48px] shadow-2xl border-t md:border border-white/10 overflow-hidden relative">
            <div className="solar-gradient p-10 md:p-12 text-black text-center relative">
              <button onClick={() => setShowReceipt(null)} className="absolute top-6 right-6 p-2 bg-black/10 rounded-xl"><X size={20} /></button>
              <div className="w-16 h-16 bg-black/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Receipt size={32} />
              </div>
              <h3 className="text-3xl font-black italic tracking-tighter">Paid Invoice</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mt-1">Verified Transaction</p>
            </div>
            <div className="p-8 md:p-14 space-y-8">
              <div className="text-center">
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">Settled Amount</p>
                <h4 className="text-6xl font-black tracking-tighter">₹{showReceipt.totalAmount}</h4>
              </div>
              <div className="grid grid-cols-2 gap-y-6 pt-8 border-t border-white/5">
                <div>
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">Consumer</p>
                  <p className="font-bold text-base">{showReceipt.tenantName}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">Receipt ID</p>
                  <p className="font-mono text-amber-500 font-black text-sm">#{showReceipt.id}</p>
                </div>
              </div>
              <button onClick={() => alert('Opening PDF...')} className="w-full py-4 bg-[#34D399] text-black rounded-2xl font-black text-lg shadow-lg">Download Receipt</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;

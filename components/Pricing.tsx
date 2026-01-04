
import React from 'react';
import { Settings, Save, History as HistoryIcon, TrendingUp, TrendingDown, Info } from 'lucide-react';

interface PricingProps {
  rates: { residential: number, commercial: number, gst: number, fixedCharge: number };
  setRates: React.Dispatch<React.SetStateAction<{ residential: number, commercial: number, gst: number, fixedCharge: number }>>;
}

const Pricing: React.FC<PricingProps> = ({ rates, setRates }) => {
  const handleSave = () => {
    alert('Global Tariff updated and applied to system.');
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-right-6 duration-700">
      <div>
        <h2 className="text-4xl font-black text-white tracking-tight">Tariff Governance</h2>
        <p className="text-slate-400 mt-1 font-medium text-lg">Define unit pricing, local taxes, and fixed infrastructure costs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-slate-800 shadow-2xl backdrop-blur-md">
            <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/10"><Settings size={28} /></div>
              Core Rate Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Res. Base Rate (₹)</label>
                <input type="number" step="0.01" value={rates.residential} onChange={(e) => setRates({...rates, residential: parseFloat(e.target.value)})} className="w-full px-8 py-5 rounded-3xl bg-slate-950/50 border border-slate-700 text-white font-black text-2xl" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Com. Base Rate (₹)</label>
                <input type="number" step="0.01" value={rates.commercial} onChange={(e) => setRates({...rates, commercial: parseFloat(e.target.value)})} className="w-full px-8 py-5 rounded-3xl bg-slate-950/50 border border-slate-700 text-white font-black text-2xl" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tax Provision (%)</label>
                <input type="number" value={rates.gst} onChange={(e) => setRates({...rates, gst: parseInt(e.target.value)})} className="w-full px-8 py-5 rounded-3xl bg-slate-950/50 border border-slate-700 text-white font-black text-2xl" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fixed Maintenance (₹)</label>
                <input type="number" value={rates.fixedCharge} onChange={(e) => setRates({...rates, fixedCharge: parseInt(e.target.value)})} className="w-full px-8 py-5 rounded-3xl bg-slate-950/50 border border-slate-700 text-white font-black text-2xl" />
              </div>
            </div>

            <button onClick={handleSave} className="mt-12 w-full md:w-auto px-12 py-5 solar-gradient text-slate-900 rounded-[2rem] font-black text-lg shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
              <Save size={24} /> Apply Global Tariff
            </button>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
            <h3 className="text-xl font-black text-white mb-8">System Projection</h3>
            <p className="text-sm text-slate-500 font-bold">Current Res. Rate: ₹{rates.residential}/kWh</p>
            <p className="text-sm text-slate-500 font-bold">Current Com. Rate: ₹{rates.commercial}/kWh</p>
            <div className="mt-8 p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
              <div className="flex justify-between text-xs font-black mb-3"><span>Yield Efficiency</span><span className="text-emerald-400">+22.4%</span></div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[78%] rounded-full shadow-lg" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

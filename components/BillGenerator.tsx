
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Zap, Send, FileText, Smartphone, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { Tenant, Bill } from '../types';
import { getEnergyInsights } from '../services/geminiService';

interface BillGeneratorProps {
  tenants: Tenant[];
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
  rates: { residential: number, commercial: number, gst: number };
}

const BillGenerator: React.FC<BillGeneratorProps> = ({ tenants, bills, setBills, rates }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [readings, setReadings] = useState({ prev: 0, present: '' });
  const [insights, setInsights] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-detect previous reading when tenant is selected
  useEffect(() => {
    if (selectedTenant) {
      const tenantBills = bills.filter(b => b.tenantId === selectedTenant.id);
      if (tenantBills.length > 0) {
        const lastBill = tenantBills.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())[0];
        setReadings(prev => ({ ...prev, prev: lastBill.presentReading }));
      } else {
        setReadings(prev => ({ ...prev, prev: 1000 })); // Default start for new tenants
      }
    }
  }, [selectedTenant, bills]);

  useEffect(() => {
    if (currentStep === 3 && readings.present) {
      const fetchInsights = async () => {
        const units = parseFloat(readings.present) - readings.prev;
        if (units > 0) {
          const res = await getEnergyInsights(units, "current cycle");
          setInsights(res);
        }
      };
      fetchInsights();
    }
  }, [currentStep, readings]);

  const calculateTotal = () => {
    if (!selectedTenant || !readings.present) return 0;
    const units = parseFloat(readings.present) - readings.prev;
    const rate = selectedTenant.propertyType === 'RESIDENTIAL' ? rates.residential : rates.commercial;
    const subtotal = units * rate;
    const tax = subtotal * (rates.gst / 100);
    return parseFloat((subtotal + tax).toFixed(2));
  };

  const handleFinish = () => {
    if (!selectedTenant) return;
    setIsGenerating(true);
    
    const newBill: Bill = {
      id: `BL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      tenantId: selectedTenant.id,
      tenantName: selectedTenant.name,
      billingMonth: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      previousReading: readings.prev,
      presentReading: parseFloat(readings.present),
      unitsConsumed: parseFloat(readings.present) - readings.prev,
      ratePerUnit: selectedTenant.propertyType === 'RESIDENTIAL' ? rates.residential : rates.commercial,
      taxAmount: calculateTotal() * (rates.gst / (100 + rates.gst)),
      totalAmount: calculateTotal(),
      status: 'PENDING',
      generatedAt: new Date().toISOString()
    };

    setTimeout(() => {
      setBills(prev => [...prev, newBill]);
      setIsGenerating(false);
      setCurrentStep(1);
      setSelectedTenant(null);
      setReadings({ prev: 0, present: '' });
      alert('Ledger generated successfully and notification sent!');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-6 duration-700">
      <div className="mb-14 text-center">
        <h2 className="text-4xl font-black text-white tracking-tight leading-none mb-3">Billing Wizard</h2>
        <p className="text-slate-500 font-medium text-lg">Generate energy invoices in seconds using our smart ledger.</p>
      </div>

      <div className="flex items-center justify-between mb-16 px-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-900 -translate-y-1/2 z-0 rounded-full" />
        {[1, 2, 3].map((s) => (
          <div key={s} className="relative z-10 flex flex-col items-center">
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all ${currentStep >= s ? 'solar-gradient text-slate-900' : 'bg-slate-900 border-2 border-slate-800 text-slate-600'}`}>
              {currentStep > s ? <CheckCircle2 size={32} /> : s === 1 ? <Zap size={28} /> : s === 2 ? <FileText size={28} /> : <Send size={28} />}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/40 rounded-[3rem] border border-slate-800 shadow-2xl p-12 min-h-[500px] flex flex-col backdrop-blur-md">
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in">
            <h3 className="text-2xl font-black text-white">Identify Meter</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tenants.filter(t => t.status === 'ACTIVE').map(tenant => (
                <button key={tenant.id} onClick={() => setSelectedTenant(tenant)} className={`p-8 rounded-[2rem] border-2 text-left transition-all ${selectedTenant?.id === tenant.id ? 'border-amber-500 bg-amber-500/5' : 'border-slate-800 hover:border-slate-700'}`}>
                  <div className="flex items-center gap-5">
                    <img src={tenant.photoUrl} alt="" className="w-14 h-14 rounded-2xl object-cover" />
                    <div>
                      <p className="font-black text-white">{tenant.name}</p>
                      <p className="text-xs font-mono font-bold text-amber-500">{tenant.meterNumber}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-10 animate-in slide-in-from-right-4">
             <div className="flex items-center gap-6 p-6 bg-slate-950/50 rounded-[2.5rem] border border-slate-800">
              <img src={selectedTenant?.photoUrl} alt="" className="w-20 h-20 rounded-[1.5rem] object-cover" />
              <div>
                <p className="text-2xl font-black text-white">{selectedTenant?.name}</p>
                <p className="text-xs font-mono font-bold text-amber-500">{selectedTenant?.meterNumber}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Previous Reading</label>
                <input type="number" readOnly value={readings.prev} className="w-full px-8 py-6 rounded-3xl bg-slate-950/50 border border-slate-800 text-slate-600 font-black text-3xl outline-none" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Present Reading</label>
                <input type="number" autoFocus value={readings.present} onChange={(e) => setReadings({...readings, present: e.target.value})} className="w-full px-8 py-6 rounded-3xl bg-slate-950/80 border-2 border-slate-700 text-white focus:border-amber-500 font-black text-3xl outline-none" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-10 animate-in fade-in">
             <div className="bg-slate-950/50 rounded-[2.5rem] p-10 border border-slate-800 space-y-6">
              <div className="flex justify-between border-b border-slate-800/50 pb-6"><span className="text-slate-500 font-bold uppercase text-xs">Tenant</span><span className="font-black text-white text-lg">{selectedTenant?.name}</span></div>
              <div className="flex justify-between border-b border-slate-800/50 pb-6"><span className="text-slate-500 font-bold uppercase text-xs">Consumption</span><span className="font-black text-white text-lg">{parseFloat(readings.present) - readings.prev} kWh</span></div>
              <div className="flex justify-between pt-4"><span className="text-lg font-black text-slate-400 uppercase">Grand Total</span><span className="text-5xl font-black text-amber-500 tracking-tighter">₹{calculateTotal()}</span></div>
            </div>
            <div className="p-8 bg-slate-800/30 rounded-[2rem] flex items-start gap-5">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl"><Sparkles size={24} /></div>
              <div>
                <p className="text-[10px] font-black text-amber-500 uppercase mb-2 tracking-widest">Smart Billing Insights (AI)</p>
                <p className="text-slate-300 italic font-bold">"{insights || "Processing patterns..."}"</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto pt-12 flex items-center gap-6">
          {currentStep > 1 && <button onClick={() => setCurrentStep(prev => prev - 1)} className="px-8 py-5 bg-slate-800 text-slate-200 rounded-[2rem] font-black">Back</button>}
          {currentStep < 3 ? (
            <button disabled={currentStep === 1 && !selectedTenant || currentStep === 2 && (!readings.present || parseFloat(readings.present) <= readings.prev)} onClick={() => setCurrentStep(prev => prev + 1)} className={`flex-1 py-5 rounded-[2rem] font-black text-lg transition-all ${((currentStep === 1 && !selectedTenant) || (currentStep === 2 && (!readings.present || parseFloat(readings.present) <= readings.prev))) ? 'bg-slate-900 text-slate-700' : 'solar-gradient text-slate-900 shadow-xl'}`}>Next Step</button>
          ) : (
            <button onClick={handleFinish} disabled={isGenerating} className="flex-1 py-5 solar-gradient text-slate-900 rounded-[2rem] font-black text-lg shadow-xl">
              {isGenerating ? 'Generating Ledger...' : 'Confirm & WhatsApp Bill'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillGenerator;

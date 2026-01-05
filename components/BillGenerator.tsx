
import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Zap, Send, FileText, Smartphone, ChevronRight, ChevronLeft, Sparkles, Camera, X, ArrowLeft } from 'lucide-react';
import { Tenant, Bill } from '../types';
import { getEnergyInsights } from '../services/geminiService';

interface BillGeneratorProps {
  tenants: Tenant[];
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
  rates: { residential: number, commercial: number, gst: number };
  onBack: () => void;
}

const BillGenerator: React.FC<BillGeneratorProps> = ({ tenants, bills, setBills, rates, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [readings, setReadings] = useState({ prev: 0, present: '' });
  const [insights, setInsights] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (selectedTenant) {
      const tenantBills = bills.filter(b => b.tenantId === selectedTenant.id);
      if (tenantBills.length > 0) {
        const lastBill = tenantBills.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())[0];
        setReadings(prev => ({ ...prev, prev: lastBill.presentReading }));
      } else {
        setReadings(prev => ({ ...prev, prev: 1000 })); 
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

  const startScanner = async () => {
    try {
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setTimeout(() => {
        const randomReading = readings.prev + Math.floor(Math.random() * 200) + 50;
        setReadings(prev => ({ ...prev, present: randomReading.toString() }));
        stopScanner();
      }, 3500);
    } catch (err) {
      console.error("Camera error:", err);
      alert("Please allow camera access to use the scanner.");
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

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
    
    const units = parseFloat(readings.present) - readings.prev;
    const total = calculateTotal();
    const newBill: Bill = {
      id: `BL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      tenantId: selectedTenant.id,
      tenantName: selectedTenant.name,
      billingMonth: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      previousReading: readings.prev,
      presentReading: parseFloat(readings.present),
      unitsConsumed: units,
      ratePerUnit: selectedTenant.propertyType === 'RESIDENTIAL' ? rates.residential : rates.commercial,
      taxAmount: total * (rates.gst / (100 + rates.gst)),
      totalAmount: total,
      status: 'PENDING',
      generatedAt: new Date().toISOString()
    };

    setTimeout(() => {
      setBills(prev => [...prev, newBill]);
      setIsGenerating(false);
      
      const message = `Hello ${selectedTenant.name}, your Solar Bill for ${newBill.billingMonth} is ready.\n\nMeter: ${selectedTenant.meterNumber}\nUnits: ${units} kWh\nTotal: ₹${total}\n\nPlease settle via the app dashboard. Thank you!`;
      const encodedMsg = encodeURIComponent(message);
      window.open(`https://wa.me/${selectedTenant.phone}?text=${encodedMsg}`, '_blank');
      
      setCurrentStep(1);
      setSelectedTenant(null);
      setReadings({ prev: 0, present: '' });
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-6 duration-700 pb-20">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white/40 hover:text-amber-400 transition-colors group mb-8"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Dashboard</span>
      </button>

      <div className="mb-14 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-4">Billing Wizard</h2>
        <p className="text-white/40 font-medium text-lg">Generate precise energy invoices with AI insights.</p>
      </div>

      <div className="flex items-center justify-between mb-16 px-6 md:px-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 z-0 rounded-full" />
        {[1, 2, 3].map((s) => (
          <div key={s} className="relative z-10 flex flex-col items-center">
            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center transition-all ${currentStep >= s ? 'solar-gradient text-black shadow-lg shadow-amber-500/20' : 'bg-[#111317] border border-white/5 text-white/20'}`}>
              {currentStep > s ? <CheckCircle2 size={24} /> : s === 1 ? <Zap size={24} /> : s === 2 ? <FileText size={24} /> : <Send size={24} />}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#111317] rounded-[32px] md:rounded-[48px] border border-white/5 shadow-2xl p-8 md:p-14 min-h-[500px] flex flex-col relative overflow-hidden">
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in">
            <h3 className="text-2xl font-bold text-white">Select Resident</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tenants.filter(t => t.status === 'ACTIVE').map(tenant => (
                <button key={tenant.id} onClick={() => setSelectedTenant(tenant)} className={`p-6 rounded-3xl border transition-all text-left group ${selectedTenant?.id === tenant.id ? 'border-amber-500 bg-amber-500/5' : 'border-white/5 hover:bg-white/5'}`}>
                  <div className="flex items-center gap-4">
                    <img src={tenant.photoUrl} alt="" className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white group-hover:text-amber-400 truncate transition-colors">{tenant.name}</p>
                      <p className="text-[10px] font-mono font-black text-white/30 tracking-tight uppercase">{tenant.meterNumber}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-10 animate-in slide-in-from-right-4">
             <div className="flex items-center gap-6 p-6 bg-[#08090A] rounded-3xl border border-white/5">
              <img src={selectedTenant?.photoUrl} alt="" className="w-16 h-16 rounded-2xl object-cover" />
              <div>
                <p className="text-xl font-bold text-white">{selectedTenant?.name}</p>
                <p className="text-[10px] font-mono font-black text-amber-500 uppercase">{selectedTenant?.meterNumber}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Previous Unit Count</label>
                <div className="px-8 py-6 rounded-3xl bg-[#08090A] border border-white/5 text-white/40 font-black text-3xl">
                  {readings.prev}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Present Reading</label>
                <div className="relative group">
                  <input 
                    type="number" 
                    autoFocus 
                    value={readings.present} 
                    onChange={(e) => setReadings({...readings, present: e.target.value})} 
                    placeholder="0.00"
                    className="w-full px-8 py-6 rounded-3xl bg-[#08090A] border border-white/10 text-white focus:border-amber-500/50 font-black text-3xl outline-none transition-all placeholder:text-white/10" 
                  />
                  <button 
                    onClick={startScanner}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-amber-500 text-black rounded-2xl shadow-lg hover:scale-105 transition-all"
                  >
                    <Camera size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-10 animate-in fade-in">
             <div className="bg-[#08090A] rounded-[32px] p-10 border border-white/5 space-y-6">
              <div className="flex justify-between border-b border-white/5 pb-6">
                <span className="text-white/30 font-black uppercase text-[10px] tracking-widest">Resident</span>
                <span className="font-bold text-white">{selectedTenant?.name}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-6">
                <span className="text-white/30 font-black uppercase text-[10px] tracking-widest">Usage</span>
                <span className="font-black text-white">{parseFloat(readings.present) - readings.prev} kWh</span>
              </div>
              <div className="flex justify-between pt-4 items-end">
                <span className="text-xs font-black text-white/20 uppercase tracking-[0.4em]">Total Payable</span>
                <span className="text-5xl font-black text-amber-500 tracking-tighter">₹{calculateTotal()}</span>
              </div>
            </div>
            <div className="p-6 bg-amber-500/5 rounded-3xl border border-amber-500/10 flex items-start gap-4">
              <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl"><Sparkles size={20} /></div>
              <div>
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">AI Recommendation</p>
                <p className="text-white/60 italic text-sm font-medium leading-relaxed">"{insights || "Calculating optimal grid usage patterns..."}"</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto pt-12 flex flex-col md:flex-row items-center gap-4">
          {currentStep > 1 && (
            <button 
              onClick={() => setCurrentStep(prev => prev - 1)} 
              className="w-full md:w-auto px-10 py-5 bg-white/5 text-white/50 rounded-2xl font-black text-sm uppercase tracking-widest hover:text-white transition-colors"
            >
              Back
            </button>
          )}
          
          {currentStep < 3 ? (
            <button 
              disabled={currentStep === 1 && !selectedTenant || currentStep === 2 && (!readings.present || parseFloat(readings.present) <= readings.prev)} 
              onClick={() => setCurrentStep(prev => prev + 1)} 
              className={`flex-1 w-full py-5 rounded-2xl font-black text-lg transition-all ${((currentStep === 1 && !selectedTenant) || (currentStep === 2 && (!readings.present || parseFloat(readings.present) <= readings.prev))) ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'solar-gradient text-black shadow-xl'}`}
            >
              Continue
            </button>
          ) : (
            <button 
              onClick={handleFinish} 
              disabled={isGenerating} 
              className="flex-1 w-full py-5 solar-gradient text-black rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-3"
            >
              {isGenerating ? 'Processing...' : (
                <>
                  <Smartphone size={24} />
                  <span>Confirm & WhatsApp Bill</span>
                </>
              )}
            </button>
          )}
        </div>

        {isScanning && (
          <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 animate-in fade-in">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-2xl shadow-amber-500/20">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="scanner-line" />
              <div className="absolute inset-0 border-[40px] border-black/60 pointer-events-none" />
              <div className="absolute top-6 left-0 right-0 text-center">
                <span className="bg-amber-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Analyzing Meter</span>
              </div>
            </div>
            <p className="mt-8 text-white/40 font-bold animate-pulse">Position meter reading within frame</p>
            <button onClick={stopScanner} className="mt-12 p-5 bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"><X size={32} /></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillGenerator;

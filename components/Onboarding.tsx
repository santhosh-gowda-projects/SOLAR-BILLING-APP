
import React, { useState } from 'react';
import { User, Home, Zap, ShieldCheck, Camera, Building, MapPin, Phone, Mail, CreditCard, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    houseName: '',
    address: '',
    aadhaar: '',
    phone: '',
    email: '',
    photo: null as File | null,
    buildingPhotos: [] as File[],
    rrNumber: '',
    projectCost: ''
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const renderProgress = () => (
    <div className="flex items-center gap-2 mb-10">
      {[1, 2, 3].map((s) => (
        <div 
          key={s} 
          className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'solar-gradient' : 'bg-white/10'}`} 
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen solar-gradient flex items-center justify-center p-6 overflow-hidden relative">
      <div className="sunbeam-bg" />
      <div className="max-w-2xl w-full glass-card p-8 md:p-12 rounded-[3rem] shadow-2xl border-white/30 animate-in fade-in zoom-in-95 duration-500 relative z-10">
        
        <div className="flex justify-between items-center mb-6">
          <button onClick={onCancel} className="p-2 text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </button>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Landlord Onboarding</span>
        </div>

        {renderProgress()}

        <form onSubmit={handleSubmit} className="space-y-8">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-white">Personal Identity</h2>
                <p className="text-white/60">Legal and contact verification</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup icon={User} label="Full Legal Name" placeholder="e.g. Rajesh Kumar" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
                <InputGroup icon={CreditCard} label="Aadhaar Number" placeholder="XXXX XXXX XXXX" value={formData.aadhaar} onChange={v => setFormData({...formData, aadhaar: v})} />
                <InputGroup icon={Phone} label="WhatsApp Number" placeholder="+91 XXXX-XXXXXX" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
                <InputGroup icon={Mail} label="Email Address" placeholder="rajesh@example.com" value={formData.email} onChange={v => setFormData({...formData, email: v})} />
              </div>

              <div className="pt-4">
                <button type="button" onClick={nextStep} disabled={!formData.name || !formData.phone} className="w-full py-5 bg-white text-amber-600 rounded-3xl font-black text-lg shadow-xl flex items-center justify-center gap-3 group transition-all disabled:opacity-30">
                  Next: Asset Details <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-white">Asset Profile</h2>
                <p className="text-white/60">Property and location information</p>
              </div>

              <div className="space-y-4">
                <InputGroup icon={Home} label="House/Building Name" placeholder="e.g. Solar Heights" value={formData.houseName} onChange={v => setFormData({...formData, houseName: v})} />
                <InputGroup icon={MapPin} label="Full Property Address" placeholder="Street, City, PIN" value={formData.address} onChange={v => setFormData({...formData, address: v})} />
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block ml-2">Owner Profile Photo</label>
                  <div className="flex items-center gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 border-dashed hover:bg-white/10 transition-colors cursor-pointer">
                    <Camera className="text-amber-400" size={32} />
                    <span className="text-sm font-bold text-white/40">Tap to upload passport photo</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={prevStep} className="flex-1 py-5 bg-white/5 text-white/60 rounded-3xl font-black transition-all">Back</button>
                <button type="button" onClick={nextStep} disabled={!formData.houseName} className="flex-[2] py-5 bg-white text-amber-600 rounded-3xl font-black text-lg shadow-xl flex items-center justify-center gap-3 disabled:opacity-30">
                  Next: Solar Setup <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-white">Grid & Infrastructure</h2>
                <p className="text-white/60">Utility and solar project details</p>
              </div>

              <div className="space-y-4">
                <InputGroup icon={Zap} label="BESCOM-RR Number" placeholder="MTR-XXXX-XXXX" value={formData.rrNumber} onChange={v => setFormData({...formData, rrNumber: v})} />
                <InputGroup icon={Building} label="Solar Project Cost (₹)" placeholder="e.g. 450000" type="number" value={formData.projectCost} onChange={v => setFormData({...formData, projectCost: v})} />
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block ml-2">Building/Installation Photos</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="aspect-square rounded-3xl bg-white/5 border border-white/10 border-dashed flex items-center justify-center text-white/20 hover:text-white/40 transition-colors cursor-pointer"><Camera size={32} /></div>
                    <div className="aspect-square rounded-3xl bg-white/5 border border-white/10 border-dashed flex items-center justify-center text-white/20"><ShieldCheck size={32} /></div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={prevStep} className="flex-1 py-5 bg-white/5 text-white/60 rounded-3xl font-black transition-all">Back</button>
                <button type="submit" className="flex-[2] py-5 solar-gradient text-black rounded-3xl font-black text-lg shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all">
                  <CheckCircle size={24} />
                  Activate Owner Account
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const InputGroup = ({ icon: Icon, label, placeholder, value, onChange, type = "text" }: any) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block ml-2">{label}</label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-400 transition-colors" size={20} />
      <input 
        type={type} 
        placeholder={placeholder} 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        className="w-full pl-12 pr-6 py-4 rounded-3xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:bg-white/10 focus:border-amber-500/50 focus:outline-none transition-all font-bold" 
      />
    </div>
  </div>
);

export default Onboarding;

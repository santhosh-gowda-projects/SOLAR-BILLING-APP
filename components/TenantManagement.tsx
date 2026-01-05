
import React, { useState, useRef } from 'react';
import { UserPlus, Search, Home, Building2, Phone, Shield, Archive, Edit3, X, Filter, MoreVertical, ArrowLeft, Camera, FileText, MapPin, Hash, CreditCard, Zap, CheckCircle2, ChevronRight, UploadCloud } from 'lucide-react';
import { Tenant } from '../types';

interface TenantManagementProps {
  tenants: Tenant[];
  setTenants: React.Dispatch<React.SetStateAction<Tenant[]>>;
  onBack: () => void;
}

const TenantManagement: React.FC<TenantManagementProps> = ({ tenants, setTenants, onBack }) => {
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'RESIDENTIAL' | 'COMMERCIAL'>('ALL');
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  
  // Wizard Local State
  const [formData, setFormData] = useState<Partial<Tenant>>({
    id: '',
    houseId: '',
    name: '',
    phone: '',
    aadhaar: '',
    address: '',
    propertyType: 'RESIDENTIAL',
    meterNumber: '',
    baseRate: 8.5,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const agreementRef = useRef<HTMLInputElement>(null);

  const filteredTenants = tenants.filter(t => 
    (t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     t.meterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
     t.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filter === 'ALL' || t.propertyType === filter) &&
    t.status === 'ACTIVE'
  );

  const handleStartOnboarding = () => {
    setEditingTenant(null);
    setFormData({
      id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
      houseId: '',
      name: '',
      phone: '',
      aadhaar: '',
      address: '',
      propertyType: 'RESIDENTIAL',
      meterNumber: '',
      baseRate: 8.5,
    });
    setWizardStep(1);
    setShowWizard(true);
  };

  const handleNext = () => setWizardStep(s => s + 1);
  const handlePrev = () => setWizardStep(s => s - 1);

  const finalizeOnboarding = () => {
    const newTenant: Tenant = {
      ...(formData as Tenant),
      ownerId: 'o1',
      status: 'ACTIVE',
      onboardedDate: new Date().toISOString().split('T')[0],
      photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
    };

    if (editingTenant) {
      setTenants(prev => prev.map(t => t.id === editingTenant.id ? newTenant : t));
    } else {
      setTenants(prev => [...prev, newTenant]);
    }

    setShowWizard(false);
  };

  const archiveTenant = (id: string) => {
    if (confirm('Archive this resident? Current billing cycles will be finalized.')) {
      setTenants(prev => prev.map(t => t.id === id ? { ...t, status: 'ARCHIVED' } : t));
    }
  };

  const renderWizardStep = () => {
    switch(wizardStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="bg-amber-500/5 p-6 rounded-3xl border border-amber-500/10 mb-8">
              <h4 className="text-xl font-black text-white flex items-center gap-3">
                <Hash className="text-amber-500" /> Grid Assignment
              </h4>
              <p className="text-white/40 text-xs mt-1">Define the physical and logical location in your property.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="House ID / Unit #" placeholder="e.g. FLAT-402" value={formData.houseId} onChange={v => setFormData({...formData, houseId: v})} />
              <InputGroup label="System Tenant ID" value={formData.id} onChange={v => setFormData({...formData, id: v})} readOnly />
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 block">Occupancy Class</label>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setFormData({...formData, propertyType: 'RESIDENTIAL'})} className={`p-4 rounded-2xl border flex items-center justify-center gap-3 transition-all font-bold ${formData.propertyType === 'RESIDENTIAL' ? 'bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/20' : 'bg-white/5 border-white/10 text-white/40'}`}>
                    <Home size={18} /> Residential
                  </button>
                  <button onClick={() => setFormData({...formData, propertyType: 'COMMERCIAL'})} className={`p-4 rounded-2xl border flex items-center justify-center gap-3 transition-all font-bold ${formData.propertyType === 'COMMERCIAL' ? 'bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/20' : 'bg-white/5 border-white/10 text-white/40'}`}>
                    <Building2 size={18} /> Commercial
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
             <div className="bg-blue-500/5 p-6 rounded-3xl border border-blue-500/10 mb-8">
              <h4 className="text-xl font-black text-white flex items-center gap-3">
                <Shield className="text-blue-400" /> Consumer Identity
              </h4>
              <p className="text-white/40 text-xs mt-1">Legal verification and contact information.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup icon={UserPlus} label="Full Legal Name" placeholder="As per Aadhaar" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
              <InputGroup icon={Phone} label="WhatsApp Number" placeholder="+91 XXXX-XXXXXX" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
              <InputGroup icon={CreditCard} label="Aadhaar Number" placeholder="XXXX XXXX XXXX" value={formData.aadhaar} onChange={v => setFormData({...formData, aadhaar: v})} />
              <InputGroup icon={MapPin} label="Address (As per Aadhaar)" placeholder="Permanent Residence" value={formData.address} onChange={v => setFormData({...formData, address: v})} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
             <div className="bg-purple-500/5 p-6 rounded-3xl border border-purple-500/10 mb-8">
              <h4 className="text-xl font-black text-white flex items-center gap-3">
                <FileText className="text-purple-400" /> Documentation Hub
              </h4>
              <p className="text-white/40 text-xs mt-1">Securely archive tenant photos and legal agreements.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block">Tenant Profile Photo</label>
                <div onClick={() => fileInputRef.current?.click()} className="h-48 rounded-3xl bg-white/5 border-2 border-dashed border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group">
                  <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-white/20 group-hover:scale-110 transition-transform">
                    <Camera size={28} />
                  </div>
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Capture or Upload</span>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block">Rental Agreement (Optional)</label>
                <div onClick={() => agreementRef.current?.click()} className="h-48 rounded-3xl bg-white/5 border-2 border-dashed border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group">
                  <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-white/20 group-hover:scale-110 transition-transform">
                    <UploadCloud size={28} />
                  </div>
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Select PDF/Doc</span>
                  <input type="file" ref={agreementRef} className="hidden" accept=".pdf,.doc,.docx" />
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
             <div className="bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/10 mb-8 text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                <Zap size={32} />
              </div>
              <h4 className="text-2xl font-black text-white">Meter Calibration</h4>
              <p className="text-white/40 text-sm mt-1">Finalize energy parameters for this consumer.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup icon={Zap} label="Meter Serial Number" placeholder="MTR-XXXXX" value={formData.meterNumber} onChange={v => setFormData({...formData, meterNumber: v})} />
              <InputGroup icon={CreditCard} label="Billing Rate (₹/kWh)" type="number" step="0.1" value={formData.baseRate} onChange={v => setFormData({...formData, baseRate: parseFloat(v)})} />
            </div>
            <div className="p-6 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 mt-8">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-amber-500" />
                <div>
                  <p className="text-xs font-black text-white">System Ready</p>
                  <p className="text-[10px] text-white/40">Activation will enable automated bill generation for this tenant.</p>
                </div>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-6 md:space-y-12 pb-10">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white/40 hover:text-amber-400 transition-colors group mb-4"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Dashboard</span>
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-1">Grid Directory</h2>
          <p className="text-white/40 font-medium text-sm md:text-lg">Manage consumers and solar nodes.</p>
        </div>
        <button 
          onClick={handleStartOnboarding}
          className="md:flex hidden items-center justify-center gap-3 solar-gradient text-black px-8 py-4 rounded-[20px] font-extrabold shadow-lg transition-all hover:scale-[1.02]"
        >
          <UserPlus size={20} />
          <span>Execute Onboarding</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text" 
            placeholder="Search name, Tenant ID or House ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-[#111317] border border-white/5 text-white text-sm font-medium outline-none focus:border-amber-500/50 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button onClick={() => setFilter('ALL')} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${filter === 'ALL' ? 'bg-[#FFD335] text-black' : 'bg-[#111317] text-white/30 border border-white/5'}`}>All Nodes</button>
          <button onClick={() => setFilter('RESIDENTIAL')} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${filter === 'RESIDENTIAL' ? 'bg-[#FFD335] text-black' : 'bg-[#111317] text-white/30 border border-white/5'}`}>Residential</button>
          <button onClick={() => setFilter('COMMERCIAL')} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${filter === 'COMMERCIAL' ? 'bg-[#FFD335] text-black' : 'bg-[#111317] text-white/30 border border-white/5'}`}>Commercial</button>
        </div>
      </div>

      <div className="bg-[#111317] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-white/30 text-[10px] font-black uppercase tracking-[0.25em] border-b border-white/5 bg-white/[0.01]">
                <th className="px-10 py-8">Resident Identity</th>
                <th className="px-10 py-8">House ID & Node</th>
                <th className="px-10 py-8">Aadhaar & Address</th>
                <th className="px-10 py-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-white/[0.02] transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <img src={tenant.photoUrl} alt="" className="w-12 h-12 rounded-2xl object-cover ring-1 ring-white/10" />
                      <div>
                        <p className="font-bold text-white group-hover:text-amber-400 transition-colors">{tenant.name}</p>
                        <p className="text-xs text-white/30 font-medium">{tenant.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-white/20 uppercase">Unit:</span>
                        <span className="font-mono text-xs font-black text-amber-500/70">{tenant.houseId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-white/20 uppercase">ID:</span>
                        <span className="font-mono text-xs font-black text-white/60">{tenant.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="max-w-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <CreditCard size={12} className="text-emerald-400" />
                        <span className="text-[10px] font-mono text-white/60">{tenant.aadhaar}</span>
                      </div>
                      <p className="text-[10px] text-white/40 leading-tight line-clamp-1">{tenant.address}</p>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditingTenant(tenant); setFormData(tenant); setWizardStep(1); setShowWizard(true); }} className="p-2 text-white/30 hover:text-white rounded-xl transition-all"><Edit3 size={18} /></button>
                      <button onClick={() => archiveTenant(tenant.id)} className="p-2 text-white/30 hover:text-red-400 rounded-xl transition-all"><Archive size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button onClick={handleStartOnboarding} className="md:hidden fixed bottom-24 right-6 w-16 h-16 solar-gradient rounded-full flex items-center justify-center text-black shadow-2xl z-40 active:scale-90 transition-transform">
        <UserPlus size={28} />
      </button>

      {/* Onboarding Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/90 backdrop-blur-xl p-0 md:p-6 animate-in fade-in">
          <div className="bg-[#111317] w-full max-w-2xl rounded-t-[3rem] md:rounded-[3rem] border-t md:border border-white/10 p-8 md:p-12 relative max-h-[90vh] overflow-y-auto scrollbar-hide flex flex-col">
            <button onClick={() => setShowWizard(false)} className="absolute top-8 right-8 p-2 text-white/20 bg-white/5 rounded-xl hover:text-white transition-colors"><X size={24} /></button>
            
            <div className="mb-10">
              <h3 className="text-3xl font-black text-white">{editingTenant ? 'Update Member Profile' : 'Tenant Onboarding Wizard'}</h3>
              <div className="flex items-center gap-2 mt-6">
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${wizardStep >= s ? 'bg-amber-500 shadow-[0_0_10px_rgba(255,211,53,0.3)]' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>

            <div className="flex-1">
              {renderWizardStep()}
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 flex gap-4">
              {wizardStep > 1 && (
                <button onClick={handlePrev} className="flex-1 py-5 bg-white/5 text-white/60 rounded-3xl font-black text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <ArrowLeft size={20} /> Back
                </button>
              )}
              {wizardStep < 4 ? (
                <button 
                  onClick={handleNext} 
                  disabled={wizardStep === 1 && !formData.houseId} 
                  className="flex-[2] py-5 solar-gradient text-black rounded-3xl font-black text-lg shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-30 transition-all"
                >
                  Continue <ChevronRight size={20} />
                </button>
              ) : (
                <button onClick={finalizeOnboarding} className="flex-[2] py-5 bg-[#34D399] text-black rounded-3xl font-black text-lg shadow-xl shadow-[#34D399]/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
                  <CheckCircle2 size={24} /> Activate Resident Node
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InputGroup = ({ icon: Icon, label, placeholder, value, onChange, type = "text", readOnly = false }: any) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block ml-2">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-400 transition-colors" size={18} />}
      <input 
        type={type} 
        placeholder={placeholder} 
        value={value} 
        readOnly={readOnly}
        onChange={e => onChange(e.target.value)} 
        className={`w-full ${Icon ? 'pl-12' : 'px-6'} pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:bg-white/10 focus:border-amber-500/50 focus:outline-none transition-all font-bold ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`} 
      />
    </div>
  </div>
);

export default TenantManagement;


import React, { useState } from 'react';
import { UserPlus, Search, Home, Building2, Phone, Shield, Archive, Edit3, X, Filter, MoreVertical } from 'lucide-react';
import { Tenant } from '../types';

interface TenantManagementProps {
  tenants: Tenant[];
  setTenants: React.Dispatch<React.SetStateAction<Tenant[]>>;
}

const TenantManagement: React.FC<TenantManagementProps> = ({ tenants, setTenants }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'RESIDENTIAL' | 'COMMERCIAL'>('ALL');
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  const filteredTenants = tenants.filter(t => 
    (t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     t.meterNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filter === 'ALL' || t.propertyType === filter) &&
    t.status === 'ACTIVE'
  );

  const handleAddTenant = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTenant: Tenant = {
      id: editingTenant ? editingTenant.id : Math.random().toString(36).substr(2, 9),
      ownerId: 'o1',
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      aadhaar: formData.get('aadhaar') as string,
      photoUrl: `https://picsum.photos/seed/${formData.get('name')}/200/200`,
      propertyType: formData.get('propertyType') as 'RESIDENTIAL' | 'COMMERCIAL',
      meterNumber: formData.get('meterNumber') as string,
      baseRate: parseFloat(formData.get('baseRate') as string),
      status: 'ACTIVE',
      onboardedDate: new Date().toISOString().split('T')[0],
    };

    if (editingTenant) {
      setTenants(prev => prev.map(t => t.id === editingTenant.id ? newTenant : t));
    } else {
      setTenants(prev => [...prev, newTenant]);
    }

    setShowAddModal(false);
    setEditingTenant(null);
  };

  const archiveTenant = (id: string) => {
    if (confirm('Archive this resident? Records will be kept for history.')) {
      setTenants(prev => prev.map(t => t.id === id ? { ...t, status: 'ARCHIVED' } : t));
    }
  };

  return (
    <div className="space-y-6 md:space-y-12">
      {/* Responsive Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-1">Grid Directory</h2>
          <p className="text-white/40 font-medium text-sm md:text-lg">Manage consumers and meter IDs.</p>
        </div>
        <button 
          onClick={() => { setEditingTenant(null); setShowAddModal(true); }}
          className="md:flex hidden items-center justify-center gap-3 solar-gradient text-black px-8 py-4 rounded-[20px] font-extrabold shadow-lg transition-all"
        >
          <UserPlus size={20} />
          <span>Register New</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text" 
            placeholder="Search name or meter..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-[#111317] border border-white/5 text-white text-sm font-medium outline-none focus:border-amber-500/50 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button onClick={() => setFilter('ALL')} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${filter === 'ALL' ? 'bg-[#FFD335] text-black' : 'bg-[#111317] text-white/30 border border-white/5'}`}>All</button>
          <button onClick={() => setFilter('RESIDENTIAL')} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${filter === 'RESIDENTIAL' ? 'bg-[#FFD335] text-black' : 'bg-[#111317] text-white/30 border border-white/5'}`}>Residential</button>
          <button onClick={() => setFilter('COMMERCIAL')} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${filter === 'COMMERCIAL' ? 'bg-[#FFD335] text-black' : 'bg-[#111317] text-white/30 border border-white/5'}`}>Commercial</button>
        </div>
      </div>

      {/* Mobile Card List (< md) / Desktop Table (>= md) */}
      <div className="md:hidden space-y-3">
        {filteredTenants.map((tenant) => (
          <div key={tenant.id} className="bg-[#111317] p-4 rounded-2xl border border-white/5 flex items-center gap-4 active:bg-white/5">
            <img src={tenant.photoUrl} alt="" className="w-14 h-14 rounded-xl object-cover ring-1 ring-white/10" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-bold text-sm truncate">{tenant.name}</p>
                {tenant.propertyType === 'RESIDENTIAL' ? <Home size={10} className="text-blue-400" /> : <Building2 size={10} className="text-purple-400" />}
              </div>
              <p className="text-[10px] font-mono text-amber-500/70 font-bold tracking-tighter uppercase">{tenant.meterNumber}</p>
              <p className="text-[10px] text-white/30 font-medium">Tariff: ₹{tenant.baseRate}/kWh</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => { setEditingTenant(tenant); setShowAddModal(true); }} className="p-2 bg-white/5 rounded-lg text-white/50"><Edit3 size={16} /></button>
              <button onClick={() => archiveTenant(tenant.id)} className="p-2 bg-white/5 rounded-lg text-red-400/50"><Archive size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block bg-[#111317] rounded-[32px] border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-white/30 text-[10px] font-black uppercase tracking-[0.25em] border-b border-white/5 bg-white/[0.01]">
              <th className="px-10 py-6">Resident Identity</th>
              <th className="px-10 py-6">Energy ID</th>
              <th className="px-10 py-6">Tariff</th>
              <th className="px-10 py-6">Compliance</th>
              <th className="px-10 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredTenants.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-white/[0.02] transition-colors group">
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
                  <div className="flex items-center gap-3">
                    {tenant.propertyType === 'RESIDENTIAL' ? <Home size={16} className="text-blue-400" /> : <Building2 size={16} className="text-purple-400" />}
                    <span className="font-mono text-xs font-black text-amber-500/70">{tenant.meterNumber}</span>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <p className="font-extrabold text-sm">₹{tenant.baseRate}<span className="text-[10px] text-white/30 font-black">/kWh</span></p>
                </td>
                <td className="px-10 py-8">
                   <div className="flex items-center gap-2 text-[#34D399] bg-[#34D399]/10 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest w-fit">
                    <Shield size={12} /> Verified
                  </div>
                </td>
                <td className="px-10 py-8 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setEditingTenant(tenant); setShowAddModal(true); }} className="p-2 text-white/30 hover:text-white rounded-xl transition-all"><Edit3 size={18} /></button>
                    <button onClick={() => archiveTenant(tenant.id)} className="p-2 text-white/30 hover:text-red-400 rounded-xl transition-all"><Archive size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Floating Action Button for Mobile Add */}
      <button 
        onClick={() => { setEditingTenant(null); setShowAddModal(true); }}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 solar-gradient rounded-full flex items-center justify-center text-black shadow-2xl z-40 active:scale-90 transition-transform"
      >
        <UserPlus size={24} />
      </button>

      {/* Modal / Mobile Bottom Sheet */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-6 animate-in fade-in">
          <div className="bg-[#111317] w-full max-w-2xl rounded-t-[32px] md:rounded-[40px] border-t md:border border-white/10 p-8 md:p-12 relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 p-2 text-white/20 bg-white/5 rounded-xl"><X size={20} /></button>
            <h3 className="text-2xl font-extrabold mb-8">{editingTenant ? 'Update Member' : 'Member Onboarding'}</h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleAddTenant}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Legal Name</label>
                <input name="name" defaultValue={editingTenant?.name} type="text" className="w-full px-5 py-4 rounded-xl bg-[#08090A] border border-white/5 text-white font-bold outline-none focus:border-amber-500/50" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Phone Number</label>
                <input name="phone" defaultValue={editingTenant?.phone} type="tel" className="w-full px-5 py-4 rounded-xl bg-[#08090A] border border-white/5 text-white font-bold outline-none focus:border-amber-500/50" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Meter ID</label>
                <input name="meterNumber" defaultValue={editingTenant?.meterNumber} type="text" className="w-full px-5 py-4 rounded-xl bg-[#08090A] border border-white/5 text-white font-mono font-bold outline-none focus:border-amber-500/50" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Rate (₹)</label>
                <input name="baseRate" defaultValue={editingTenant?.baseRate} type="number" step="0.1" className="w-full px-5 py-4 rounded-xl bg-[#08090A] border border-white/5 text-white font-bold outline-none focus:border-amber-500/50" required />
              </div>
              <div className="md:col-span-2 pt-4">
                <button type="submit" className="w-full py-4 solar-gradient text-black rounded-2xl font-black text-lg shadow-lg">Confirm Onboarding</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantManagement;

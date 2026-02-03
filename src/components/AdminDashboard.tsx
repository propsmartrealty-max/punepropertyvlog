import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  LogOut,
  ShieldCheck,
  Globe,
  Pencil,
  Lock,
  Zap,
  AlertCircle,
  MapPin,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const AdminDashboard: React.FC<{
  onLogout: () => void,
  leads: any[],
  siteContent: any,
  setSiteContent: (c: any) => void,
  isMaintenanceMode: boolean,
  setIsMaintenanceMode: (b: boolean) => void
}> = ({ onLogout, leads, siteContent, setSiteContent, isMaintenanceMode, setIsMaintenanceMode }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <aside className="w-64 bg-slate-900 border-r border-white/5 flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <ShieldCheck size={24} className="text-teal-500" />
            <div className="flex flex-col">
              <span className="font-black text-base uppercase leading-none">PUNE PROPERTY VLOG</span>
              <span className="text-[8px] font-black text-teal-500 uppercase tracking-widest mt-1">HQ Console</span>
            </div>
          </div>
          <nav className="space-y-1">
            {[
              { id: 'overview', icon: <LayoutDashboard size={18} />, label: 'Analytics' },
              { id: 'leads', icon: <Users size={18} />, label: 'Lead CRM' },
              { id: 'cms', icon: <Pencil size={18} />, label: 'CMS' },
              { id: 'seo', icon: <Globe size={18} />, label: 'SEO' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-teal-500 text-white' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-white/5 space-y-2">
          <button onClick={() => setIsMaintenanceMode(!isMaintenanceMode)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:text-white">
            <AlertCircle size={18} /> {isMaintenanceMode ? 'Live' : 'Maintenance'}
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl text-[10px] font-black uppercase">
            <LogOut size={18} /> Exit
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">{activeTab}</h1>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Pune Property Vlog Admin</p>
          </div>
          <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 flex items-center gap-2">
            <Zap size={14} className="text-teal-500" />
            <span className="text-[8px] font-black uppercase tracking-widest">Secure Node</span>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-4 gap-6">
              {[
                { label: 'Total Leads', val: leads.length },
                { label: 'Conversion', val: '14.2%' },
                { label: 'Active', val: '100%' },
                { label: 'Rank', val: '#1' },
              ].map((kpi, idx) => (
                <div key={idx} className="bg-slate-900 border border-white/5 p-6 rounded-3xl">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">{kpi.label}</p>
                  <h3 className="text-2xl font-black">{kpi.val}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h4 className="text-sm font-black uppercase">Developer Leads</h4>
              <Filter size={16} className="text-slate-500" />
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="text-[9px] font-black text-slate-500 uppercase border-b border-white/5">
                  <th className="p-6">Partner</th><th className="p-6">Region</th><th className="p-6 text-right">Recency</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-6">
                      <p className="text-xs font-bold">{lead.name}</p>
                      <p className="text-[8px] text-slate-500 uppercase">{lead.company}</p>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                        <MapPin size={10} /> {lead.location}
                      </div>
                    </td>
                    <td className="p-6 text-right text-[9px] font-black uppercase text-slate-500">{lead.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
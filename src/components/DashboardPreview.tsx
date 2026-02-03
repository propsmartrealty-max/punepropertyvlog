import React, { useState, useEffect } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { BrainCircuit, Zap } from 'lucide-react';

const INITIAL_SALES_DATA = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 4780 },
  { month: 'May', sales: 6890 },
  { month: 'Jun', sales: 8390 },
];

const DashboardPreview: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [liveStats, setLiveStats] = useState({
    aiQualified: 88,
    leadScore: 92.4,
    predictiveRev: 14.2
  });
  const [feed, setFeed] = useState<{ id: number, text: string, time: string, icon: React.ReactNode }[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        aiQualified: Math.min(100, prev.aiQualified + (Math.random() > 0.8 ? 1 : 0)),
        leadScore: Math.min(98, prev.leadScore + (Math.random() > 0.5 ? 0.05 : -0.05)),
        predictiveRev: prev.predictiveRev + (Math.random() > 0.9 ? 0.2 : 0),
      }));

      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      setFeed(prev => [{
        id: Date.now(),
        text: `AI Lead Scored: ${Math.floor(Math.random() * 15 + 85)}%`,
        time: timeStr,
        icon: <BrainCircuit size={12} className="text-teal-400" />
      }, ...prev].slice(0, 4));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Return a skeleton if not mounted to prevent hydration errors
  if (!isMounted) return <div className="h-[450px] w-full bg-slate-900 rounded-[2.5rem] animate-pulse" />;

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 h-full flex flex-col min-h-[450px]">
      <div className="bg-slate-900 px-8 py-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
          <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">PUNE PROPERTY VLOG v1.0</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
          <span className="text-teal-500 text-[10px] font-black uppercase tracking-widest">Live Engine</span>
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col gap-6 overflow-hidden">
        <div className="h-40 w-full shrink-0 min-h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={INITIAL_SALES_DATA}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#14B8A6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSales)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <p className="text-[7px] font-black text-slate-400 uppercase mb-1">AI Match</p>
            <p className="text-xs font-bold text-slate-900">{liveStats.aiQualified}%</p>
          </div>
          <div className="p-4 bg-teal-500 text-white rounded-2xl text-center shadow-lg">
            <p className="text-[7px] font-black text-white/70 uppercase mb-1">Mandate S.</p>
            <p className="text-xs font-bold">{liveStats.leadScore.toFixed(1)}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <p className="text-[7px] font-black text-slate-400 uppercase mb-1">Rev. Val</p>
            <p className="text-xs font-bold text-slate-900">₹{liveStats.predictiveRev.toFixed(1)}Cr</p>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-hidden">
          <h4 className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2">
            <Zap size={12} className="text-teal-500" /> Operational Feed
          </h4>
          <div className="space-y-2 overflow-y-auto max-h-32">
            {feed.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="shrink-0 text-teal-500">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold text-slate-800 truncate">{item.text}</p>
                </div>
                <p className="text-[8px] text-slate-400 font-bold whitespace-nowrap">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
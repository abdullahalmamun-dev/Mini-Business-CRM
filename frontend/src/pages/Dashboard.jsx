import React, { useEffect, useState } from 'react';
import { 
  Users, CheckCircle2, Clock, AlertCircle, 
  ArrowUpRight, ArrowDownRight, TrendingUp,
  Calendar, MoreHorizontal
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import api from '../utils/axios';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/reports/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const stats = [
    { label: 'Total Customers', value: data?.summary?.totalCustomers || 0, trend: '+12%', icon: Users, color: 'text-blue-500' },
    { label: 'Pending Tasks', value: data?.summary?.pendingTasks || 0, trend: '-5%', icon: Clock, color: 'text-amber-500' },
    { label: 'Conversion Rate', value: `${data?.summary?.conversionRate || 0}%`, trend: '+2.4%', icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Active Projects', value: data?.summary?.activeCampaigns || 0, trend: 'Stable', icon: CheckCircle2, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-8 pb-10 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Overview</p>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Business Metrics</h1>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-1">
          <button className="px-4 py-1.5 text-xs font-medium text-white bg-white/10 rounded-md shadow-sm">All Time</button>
          <button className="px-4 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition">30 Days</button>
          <button className="px-4 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition">7 Days</button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#111827] border border-white/5 p-6 rounded-xl hover:border-white/10 transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-slate-500'}`}>
                {stat.trend}
                {stat.trend.startsWith('+') ? <ArrowUpRight size={14} /> : null}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">{stat.value}</h3>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111827] border border-white/5 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-semibold text-white tracking-tight">Revenue Growth</h3>
            <button className="text-slate-500 hover:text-white transition"><MoreHorizontal size={20} /></button>
          </div>
          <div className="h-80 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.growthStats || []}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 11}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 11}}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorVal)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#111827] border border-white/5 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-white tracking-tight mb-8">Lead Sources</h3>
          <div className="h-80 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.statusStats || []} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="status" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11}}
                  width={100}
                />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #ffffff10', borderRadius: '12px' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={12}>
                  {data?.statusStats?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#1e293b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white tracking-tight">Recent Activity</h3>
            <button className="text-xs font-bold text-blue-500 uppercase tracking-widest hover:text-blue-400 transition">View All</button>
          </div>
          <div className="divide-y divide-white/5">
            {(data?.recentCustomers || []).map((customer, i) => (
              <div key={i} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-sm">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{customer.name}</p>
                    <p className="text-xs text-slate-500">{customer.company || 'Private Client'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                    {customer.status_name || 'Active'}
                  </span>
                  <p className="text-[10px] text-slate-600 mt-1 uppercase font-bold tracking-tighter">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white tracking-tight">Priority Pipeline</h3>
            <AlertCircle size={18} className="text-slate-600" />
          </div>
          <div className="space-y-4">
            {(data?.tasksDueToday || []).length > 0 ? (data.tasksDueToday.map((task, i) => (
              <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${task.priority === 'High' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                  <span className="text-sm font-medium text-white">{task.notes || 'Unnamed Task'}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{task.priority}</span>
              </div>
            ))) : (
              <div className="flex flex-col items-center justify-center py-10 opacity-30">
                <CheckCircle2 size={40} className="mb-2" />
                <p className="text-sm font-medium">All caught up</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, CheckSquare, Clock, BarChart3, PieChart as PieChartIcon, 
  TrendingUp, ArrowUpRight, ArrowDownRight, AlertCircle, Calendar, CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { Spinner } from '../components/common/Loaders';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reports/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) return null;

  const { 
    summary = {}, 
    statusStats = [], 
    staffStats = [], 
    recentCustomers = [], 
    priorityStats = [], 
    staffProductivity = [], 
    tasksDueToday = [], 
    growthStats = [] 
  } = data;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400 text-sm">Real-time business performance and task tracking.</p>
        </div>
        <div className="text-xs text-slate-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Customers" 
          value={summary.totalCustomers} 
          icon={<Users className="text-blue-400" />}
          trend="+12.5%"
          trendUp={true}
        />
        <StatCard 
          title="Total Tasks" 
          value={summary.totalTasks} 
          icon={<CheckSquare className="text-emerald-400" />}
          trend="+8.2%"
          trendUp={true}
        />
        <StatCard 
          title="Pending Tasks" 
          value={summary.pendingTasks} 
          icon={<Clock className="text-amber-400" />}
          trend="-4.1%"
          trendUp={false}
        />
      </div>

      {/* Growth Chart & Due Today Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-400" />
              Customer Growth Trend
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthStats}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff10', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Calendar size={18} className="text-amber-400" />
              Due Today
            </h3>
            <span className="text-[10px] font-bold bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-full uppercase">
              {tasksDueToday.length} Tasks
            </span>
          </div>
          <div className="space-y-4 flex-1">
            {tasksDueToday.length > 0 ? tasksDueToday.map((task) => (
              <div key={task.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-all">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white line-clamp-1">{task.task_type}</p>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Users size={10} /> {task.customer_name}
                    </p>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                    task.priority === 'High' ? 'text-red-400 bg-red-400/10' :
                    task.priority === 'Medium' ? 'text-amber-400 bg-amber-400/10' :
                    'text-blue-400 bg-blue-400/10'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2 py-10">
                <CheckCircle2 size={32} className="opacity-20" />
                <p className="text-sm italic">Clear for today!</p>
              </div>
            )}
          </div>
          <button className="w-full mt-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all border border-transparent hover:border-white/5">
            View All Tasks
          </button>
        </div>
      </div>

      {/* Grid Row: Priority, Staff Productivity, Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tasks by Priority */}
        <div className="glass-panel p-6">
          <h3 className="font-semibold text-white mb-6 flex items-center gap-2 text-sm">
            <PieChartIcon size={16} className="text-purple-400" />
            Open Tasks by Priority
          </h3>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="priority"
                >
                  {priorityStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff10', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
            {priorityStats.map((item, i) => (
              <div key={item.priority} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <span className="text-[10px] text-slate-400">{item.priority} ({item.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Tasks by Staff */}
        <div className="glass-panel p-6">
          <h3 className="font-semibold text-white mb-6 flex items-center gap-2 text-sm">
            <BarChart3 size={16} className="text-emerald-400" />
            Staff Productivity (Completed)
          </h3>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={staffProductivity} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={70} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff10', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Status Breakdown */}
        <div className="glass-panel p-6">
          <h3 className="font-semibold text-white mb-6 flex items-center gap-2 text-sm">
            <Users size={16} className="text-blue-400" />
            Pipeline Status
          </h3>
          <div className="space-y-4">
            {statusStats.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-medium">
                  <span className="text-slate-400">{item.name}</span>
                  <span className="text-white">{item.count}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000"
                    style={{ width: `${(item.count / summary.totalCustomers) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, trendUp }) => (
  <div className="glass-panel p-6 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      {React.cloneElement(icon, { size: 48 })}
    </div>
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
    </div>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
      <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${trendUp ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
        {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {trend}
      </div>
    </div>
  </div>
);

export default Dashboard;

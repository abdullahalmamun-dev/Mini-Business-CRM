import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, CheckSquare, Clock, BarChart3, PieChart, 
  TrendingUp, UserPlus, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
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

  const { summary, statusStats, staffStats, recentCustomers } = data;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-slate-400 text-sm">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Customers" 
          value={summary.totalCustomers} 
          icon={<Users className="text-blue-400" />}
          trend="+12%"
          trendUp={true}
        />
        <StatCard 
          title="Total Tasks" 
          value={summary.totalTasks} 
          icon={<CheckSquare className="text-emerald-400" />}
          trend="+5%"
          trendUp={true}
        />
        <StatCard 
          title="Pending Tasks" 
          value={summary.pendingTasks} 
          icon={<Clock className="text-amber-400" />}
          trend="-2%"
          trendUp={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <PieChart size={18} className="text-purple-400" />
              Customers by Status
            </h3>
          </div>
          <div className="space-y-4">
            {statusStats.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">{item.name}</span>
                  <span className="text-white font-medium">{item.count}</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-1000"
                    style={{ width: `${(item.count / summary.totalCustomers) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <BarChart3 size={18} className="text-indigo-400" />
              Assignment Distribution
            </h3>
          </div>
          <div className="space-y-4">
            {staffStats.length > 0 ? staffStats.map((item) => (
              <div key={item.name} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-white/5">
                  {item.name.charAt(0)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">{item.name}</span>
                    <span className="text-slate-400 text-xs">{item.count} Leads</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-1000"
                      style={{ width: `${(item.count / summary.totalCustomers) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-slate-500 text-sm text-center py-8">No staff assignments recorded.</p>
            )}
          </div>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-400" />
            Recent Leads
          </h3>
          <button className="text-xs text-blue-400 hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-white/[0.02]">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-xs">
                        {cust.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{cust.name}</p>
                        <p className="text-xs text-slate-500">{cust.company || 'Individual'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-slate-400">
                      {cust.status_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(cust.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <span className="text-sm font-medium text-slate-400">{title}</span>
    </div>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-bold text-white">{value}</span>
      <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
        {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </div>
    </div>
  </div>
);

export default Dashboard;

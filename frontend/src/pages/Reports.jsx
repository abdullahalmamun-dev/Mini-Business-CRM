import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, FileText, Download, Calendar, 
  Filter, ChevronRight, UserPlus, Clock, X, Check
} from 'lucide-react';
import { Spinner } from '../components/common/Loaders';
import Button from '../components/common/Button';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All Time');

  const filters = ['All Time', 'Last 30 Days', 'Last 90 Days', 'This Year'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reports/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await axios.get('http://localhost:5000/api/customers/export', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CRM_Export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Business Intelligence</h1>
          <p className="text-slate-400 text-sm">Detailed performance metrics and assignment reports.</p>
        </div>
        <div className="flex gap-3 relative">
          <div className="relative">
            <Button 
              variant="ghost" 
              className={`w-auto transition-all ${isFilterOpen ? 'bg-white/10 text-white' : ''}`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter size={18} />
              <span>{activeFilter}</span>
            </Button>
            
            {isFilterOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsFilterOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 glass-panel border border-white/10 p-2 z-20 animate-fade-in shadow-2xl">
                  {filters.map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setActiveFilter(f);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeFilter === f 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {f}
                      {activeFilter === f && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <Button 
            className="w-auto px-6" 
            onClick={handleExport}
            isLoading={isExporting}
          >
            <Download size={18} />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="glass-panel p-6">
          <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
            <BarChart3 size={18} className="text-blue-400" />
            Lead Lifecycle Report
          </h3>
          <div className="space-y-6">
            {data.statusStats.map((item) => (
              <div key={item.name} className="group cursor-default">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{Math.round((item.count / data.summary.totalCustomers) * 100)}%</span>
                    <span className="text-sm font-bold text-white">{item.count}</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-slate-800/50 rounded-full border border-white/5 overflow-hidden p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000"
                    style={{ width: `${(item.count / data.summary.totalCustomers) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
            <UserPlus size={18} className="text-emerald-400" />
            Staff Load Distribution
          </h3>
          <div className="space-y-4">
            {data.staffStats.map((item) => (
              <div key={item.name} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 font-bold">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-slate-500">Active Pipeline: {item.count} Leads</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard title="Avg Lead Response" value={`${data.summary.avgResponse}h`} icon={<Clock className="text-blue-400" />} />
        <ReportCard title="Conversion Rate" value={`${data.summary.conversionRate}%`} icon={<TrendingUpIcon className="text-emerald-400" />} />
        <ReportCard title="Active Campaigns" value={data.summary.activeCampaigns} icon={<FileText className="text-purple-400" />} />
        <ReportCard title="Retention Score" value={data.summary.retentionScore} icon={<BarChart3 className="text-amber-400" />} />
      </div>
    </div>
  );
};

const ReportCard = ({ title, value, icon }) => (
  <div className="glass-panel p-5 border-l-4 border-l-blue-500/50">
    <div className="flex items-center gap-3 mb-2">
      <div className="text-slate-400">{icon}</div>
      <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{title}</span>
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
  </div>
);

const TrendingUpIcon = ({ className, size = 18 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

export default Reports;

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  CheckCircle2, Clock, AlertCircle, Filter, 
  Search, Calendar, User, ChevronRight, Check
} from 'lucide-react';
import { Spinner } from '../components/common/Loaders';
import Button from '../components/common/Button';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://mini-business-crm-backend.vercel.app/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await axios.put(`https://mini-business-crm-backend.vercel.app/api/tasks/${task.id}`, {
        status: newStatus
      });
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    } catch (error) {
      alert('Failed to update task status');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.task_type.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         task.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Task Management</h1>
          <p className="text-slate-400 text-sm">Track and manage your team's assignments.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks or customers..."
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900/50 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none appearance-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-900/50 border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:outline-none appearance-none cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-white/[0.02]">
                <th className="px-6 py-4">Task</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTasks.length > 0 ? filteredTasks.map((task) => (
                <tr key={task.id} className={`hover:bg-white/[0.02] transition-colors group ${task.status === 'Completed' ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleToggleStatus(task)}
                        className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${
                          task.status === 'Completed' 
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : 'border-white/20 hover:border-blue-500'
                        }`}
                      >
                        {task.status === 'Completed' && <Check size={14} />}
                      </button>
                      <span className={`text-sm font-medium ${task.status === 'Completed' ? 'line-through text-slate-500' : 'text-white'}`}>
                        {task.task_type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Link to={`/customers/${task.customer_id}`} className="text-sm text-blue-400 hover:underline">
                      {task.customer_name}
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar size={14} />
                      {new Date(task.due_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      task.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        task.status === 'Completed' ? 'bg-emerald-500' :
                        task.status === 'In Progress' ? 'bg-blue-500' : 'bg-amber-500'
                      }`}></div>
                      <span className="text-xs text-slate-300">{task.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link 
                      to={`/customers/${task.customer_id}`}
                      className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 transition-all inline-block"
                    >
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-slate-500 italic">
                    No tasks found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tasks;

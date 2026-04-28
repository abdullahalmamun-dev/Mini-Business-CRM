import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  User, Mail, Phone, Building2, Globe, Share2, Tag, Calendar, 
  Plus, CheckCircle2, Clock, AlertCircle, History, ArrowLeft,
  ChevronRight, MessageSquare
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import DataTable from '../components/common/DataTable';
import { Spinner } from '../components/common/Loaders';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Task Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskForm, setTaskForm] = useState({
    task_type: '',
    priority: 'Medium',
    due_date: '',
    notes: ''
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [custRes, tasksRes, activitiesRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/customers/${id}`),
        axios.get(`http://localhost:5000/api/customers/${id}/tasks`),
        axios.get(`http://localhost:5000/api/customers/${id}/activities`)
      ]);
      setCustomer(custRes.data);
      setTasks(tasksRes.data);
      setActivities(activitiesRes.data);
    } catch (error) {
      console.error('Error fetching customer details:', error);
      if (error.response?.status === 404) {
        navigate('/customers');
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`http://localhost:5000/api/customers/${id}/tasks`, taskForm);
      setIsTaskModalOpen(false);
      setTaskForm({ task_type: '', priority: 'Medium', due_date: '', notes: '' });
      fetchData();
    } catch (error) {
      alert('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (error) {
      alert('Failed to update task status');
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/customers')}
            className="p-2 rounded-lg bg-slate-900/50 border border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{customer.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                customer.status_name === 'New' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                customer.status_name === 'Qualified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                customer.status_name === 'Lost' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                'bg-slate-500/10 text-slate-400 border border-slate-500/20'
              }`}>
                {customer.status_name}
              </span>
              <span className="text-slate-500 text-sm">•</span>
              <span className="text-slate-400 text-sm">{customer.company || 'Private Individual'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="w-auto">
            <MessageSquare size={18} />
            <span>Log Activity</span>
          </Button>
          <Button className="w-auto px-6" onClick={() => setIsTaskModalOpen(true)}>
            <Plus size={18} />
            <span>New Task</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 space-y-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email Address</p>
                  <p className="text-sm font-medium">{customer.email || 'No email provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Phone Number</p>
                  <p className="text-sm font-medium">{customer.phone || 'No phone provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <Globe size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Location</p>
                  <p className="text-sm font-medium">{customer.country || 'International'}</p>
                </div>
              </div>
            </div>

            <hr className="border-white/5" />

            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Lead Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Share2 size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Lead Source</p>
                  <p className="text-sm font-medium">{customer.source || 'Direct Inquiry'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Assigned Agent</p>
                  <p className="text-sm font-medium text-white">{customer.assigned_staff_name || 'Unassigned'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tasks & History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs Navigation */}
          <div className="flex gap-1 p-1 bg-slate-900/50 rounded-xl border border-white/10 w-fit">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'tasks' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tasks ({tasks.length})
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Timeline
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* Upcoming Tasks Widget */}
              <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Clock size={18} className="text-amber-400" />
                    Upcoming Tasks
                  </h3>
                  <button onClick={() => setActiveTab('tasks')} className="text-xs text-blue-400 hover:underline">View All</button>
                </div>
                <div className="space-y-3">
                  {tasks.filter(t => t.status !== 'Completed').slice(0, 3).map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleToggleTaskStatus(task.id, task.status)}
                          className="w-5 h-5 rounded-full border-2 border-slate-600 flex items-center justify-center text-transparent hover:border-emerald-500 transition-colors"
                        >
                          <CheckCircle2 size={12} />
                        </button>
                        <div>
                          <p className="text-sm text-slate-200 font-medium">{task.task_type}</p>
                          <p className="text-xs text-slate-500">Due {new Date(task.due_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        task.priority === 'High' ? 'text-red-400 bg-red-400/10' :
                        task.priority === 'Medium' ? 'text-amber-400 bg-amber-400/10' :
                        'text-blue-400 bg-blue-400/10'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                  {tasks.filter(t => t.status !== 'Completed').length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4 italic">No pending tasks for this lead.</p>
                  )}
                </div>
              </div>

              {/* Recent Activity Widget */}
              <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <History size={18} className="text-blue-400" />
                    Recent Activity
                  </h3>
                  <button onClick={() => setActiveTab('history')} className="text-xs text-blue-400 hover:underline">View Timeline</button>
                </div>
                <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                  {activities.slice(0, 3).map(activity => (
                    <div key={activity.id} className="flex gap-4 relative">
                      <div className="w-6 h-6 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center z-10 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-200 font-medium">{activity.activity_type}</p>
                        <p className="text-xs text-slate-500">{activity.notes}</p>
                        <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-tighter">
                          {new Date(activity.created_at).toLocaleString()} • {activity.staff_name || 'System'}
                        </p>
                      </div>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4 italic">No activity recorded yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="animate-fade-in space-y-4">
              <DataTable 
                columns={[
                  { header: 'Task', key: 'task_type', render: (row) => (
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleToggleTaskStatus(row.id, row.status)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          row.status === 'Completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-600 text-transparent hover:border-emerald-500'
                        }`}
                      >
                        <CheckCircle2 size={12} />
                      </button>
                      <span className={row.status === 'Completed' ? 'line-through text-slate-500' : 'text-slate-200'}>
                        {row.task_type}
                      </span>
                    </div>
                  )},
                  { header: 'Priority', key: 'priority', render: (row) => (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      row.priority === 'High' ? 'text-red-400 bg-red-400/10' :
                      row.priority === 'Medium' ? 'text-amber-400 bg-amber-400/10' :
                      'text-blue-400 bg-blue-400/10'
                    }`}>
                      {row.priority}
                    </span>
                  )},
                  { header: 'Due Date', key: 'due_date', render: (row) => (
                    <span className="text-xs text-slate-400">{new Date(row.due_date).toLocaleDateString()}</span>
                  )},
                  { header: 'Status', key: 'status', render: (row) => (
                    <span className={`text-xs ${row.status === 'Completed' ? 'text-emerald-400' : 'text-slate-500'}`}>{row.status}</span>
                  )}
                ]}
                data={tasks}
              />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="animate-fade-in glass-panel p-8">
              <div className="space-y-8 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                {activities.map((activity, idx) => (
                  <div key={activity.id} className="flex gap-6 relative group">
                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center z-10 flex-shrink-0 group-hover:border-blue-500 transition-colors">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white">{activity.activity_type}</h4>
                        <span className="text-xs text-slate-500 font-medium bg-white/5 px-2 py-1 rounded-md">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">{activity.notes}</p>
                      <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                        <User size={12} />
                        Logged by <span className="text-blue-400">{activity.staff_name || 'System Auto-Log'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Add New Task"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsTaskModalOpen(false)} className="w-auto">
              Cancel
            </Button>
            <Button onClick={handleTaskSubmit} isLoading={isSubmitting} className="w-auto px-8">
              Create Task
            </Button>
          </>
        }
      >
        <form onSubmit={handleTaskSubmit} className="space-y-4">
          <Input 
            label="Task Description"
            placeholder="e.g. Follow up on proposal"
            value={taskForm.task_type}
            onChange={(e) => setTaskForm({...taskForm, task_type: e.target.value})}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1 block">Priority</label>
              <select 
                value={taskForm.priority}
                onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <Input 
              label="Due Date"
              type="date"
              value={taskForm.due_date}
              onChange={(e) => setTaskForm({...taskForm, due_date: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1 block">Additional Notes</label>
            <textarea 
              rows={3}
              value={taskForm.notes}
              onChange={(e) => setTaskForm({...taskForm, notes: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
              placeholder="Enter task details..."
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CustomerDetail;

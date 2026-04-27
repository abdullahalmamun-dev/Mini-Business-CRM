import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, Filter, UserPlus, Mail, Phone, Building2, User, Globe, Share2, Tag } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    company: '', 
    country: '', 
    source: '', 
    status_id: 1 
  });
  const [formError, setFormError] = useState('');

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/customers', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search,
          status: statusFilter
        }
      });
      setCustomers(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, statusFilter]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchCustomers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'status_id' ? parseInt(value) : value });
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    try {
      await axios.post('http://localhost:5000/api/customers', formData);
      setIsModalOpen(false);
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        company: '', 
        country: '', 
        source: '', 
        status_id: 1 
      });
      fetchCustomers(); 
    } catch (err) {
      setFormError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to add customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: 'Name', key: 'name', render: (row) => (
      <div className="flex flex-col">
        <span className="font-medium text-white">{row.name}</span>
        <span className="text-xs text-slate-500">{row.email}</span>
      </div>
    )},
    { header: 'Company', key: 'company', render: (row) => (
      <div className="flex flex-col">
        <span className="text-slate-300">{row.company || '—'}</span>
        <span className="text-xs text-slate-500">{row.country || ''}</span>
      </div>
    )},
    { header: 'Status', key: 'status_name', render: (row) => (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
        row.status_name === 'New' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
        row.status_name === 'Qualified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
        row.status_name === 'Lost' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
        'bg-slate-500/10 text-slate-400 border border-slate-500/20'
      }`}>
        {row.status_name}
      </span>
    )},
    { header: 'Assigned To', key: 'assigned_staff_name', render: (row) => (
      <span className="text-slate-400">{row.assigned_staff_name || 'Unassigned'}</span>
    )},
    { header: 'Created At', key: 'created_at', render: (row) => (
      <span className="text-slate-500 text-xs">
        {new Date(row.created_at).toLocaleDateString()}
      </span>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Customers</h1>
          <p className="text-slate-400 text-sm">Manage and track your business leads</p>
        </div>
        <Button 
          className="md:w-auto px-6" 
          onClick={() => setIsModalOpen(true)}
        >
          <UserPlus size={18} />
          <span>Add Customer</span>
        </Button>
      </div>

      <div className="glass-panel p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input 
            placeholder="Search by name, email or phone..." 
            icon={Search}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
          />
        </div>
        <div className="w-full md:w-48">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Filter size={16} />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Qualified">Qualified</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed">Closed</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
        </div>
      </div>

      <DataTable 
        columns={columns}
        data={customers}
        isLoading={loading}
        pagination={pagination}
        onPageChange={(newPage) => setPagination(prev => ({ ...prev, page: newPage }))}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Customer"
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="w-auto">
              Cancel
            </Button>
            <Button onClick={handleAddCustomer} isLoading={isSubmitting} className="w-auto px-8">
              Create Lead
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddCustomer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formError && (
            <div className="col-span-full p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {formError}
            </div>
          )}
          <Input
            label="Full Name"
            name="name"
            icon={User}
            placeholder="e.g. John Doe"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            icon={Mail}
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Phone Number"
            name="phone"
            icon={Phone}
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <Input
            label="Company Name"
            name="company"
            icon={Building2}
            placeholder="Acme Corp"
            value={formData.company}
            onChange={handleInputChange}
          />
          <Input
            label="Country"
            name="country"
            icon={Globe}
            placeholder="e.g. USA"
            value={formData.country}
            onChange={handleInputChange}
          />
          <Input
            label="Lead Source"
            name="source"
            icon={Share2}
            placeholder="e.g. Website, Referral"
            value={formData.source}
            onChange={handleInputChange}
          />
          <div className="space-y-2 col-span-full md:col-span-1">
            <label className="text-sm font-medium text-slate-300 ml-1 block">Initial Status</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Tag size={16} />
              </div>
              <select 
                name="status_id"
                value={formData.status_id}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value={1}>New</option>
                <option value={2}>Qualified</option>
                <option value={3}>Negotiation</option>
                <option value={4}>Closed</option>
                <option value={5}>Lost</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;


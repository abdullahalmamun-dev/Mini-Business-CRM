import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/axios';
import { Search, Filter, UserPlus, Mail, Phone, Building2, User, Globe, Share2, Tag, Edit2, Trash2, Eye, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/common/DataTable';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';

const Customers = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    company: '', 
    country: '', 
    source: '', 
    status_id: 1,
    assigned_staff_id: ''
  });
  const [formError, setFormError] = useState('');

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/customers', {
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

  const fetchStaff = async () => {
    if (currentUser?.role === 'Admin' || currentUser?.role === 'Manager') {
      try {
        const response = await api.get('/users/staff');
        setStaff(response.data);
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [currentUser]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchCustomers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: (name === 'status_id' || name === 'assigned_staff_id') 
        ? (value === '' ? null : parseInt(value)) 
        : value 
    });
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    try {
      if (editId) {
        await api.put(`/customers/${editId}`, formData);
      } else {
        await api.post('/customers', formData);
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchCustomers(); 
    } catch (err) {
      setFormError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCustomer = async () => {
    setIsSubmitting(true);
    try {
      await api.delete(`/customers/${deleteId}`);
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (customer) => {
    setEditId(customer.id);
    setFormData({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      company: customer.company || '',
      country: customer.country || '',
      source: customer.source || '',
      status_id: customer.status_id || 1,
      assigned_staff_id: customer.assigned_staff_id || ''
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      company: '', 
      country: '', 
      source: '', 
      status_id: 1,
      assigned_staff_id: ''
    });
    setFormError('');
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await api.get('/customers/export', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'customers.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Failed to download CSV');
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
    { header: 'Actions', key: 'actions', render: (row) => (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => navigate(`/customers/${row.id}`)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
          title="View Details"
        >
          <Eye size={18} />
        </button>
        <button 
          onClick={() => openEditModal(row)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
          title="Edit"
        >
          <Edit2 size={18} />
        </button>
        {(currentUser?.role === 'Admin') && (
          <button 
            onClick={() => {
              setDeleteId(row.id);
              setIsDeleteModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Customers</h1>
          <p className="text-slate-400 text-sm">Manage and track your business leads</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            className="md:w-auto px-4" 
            onClick={handleDownloadCSV}
          >
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button 
            className="md:w-auto px-6" 
            onClick={() => setIsModalOpen(true)}
          >
            <UserPlus size={18} />
            <span>Add Customer</span>
          </Button>
        </div>
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
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editId ? "Edit Customer" : "Add New Customer"}
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button variant="ghost" onClick={() => {
              setIsModalOpen(false);
              resetForm();
            }} className="w-auto">
              Cancel
            </Button>
            <Button onClick={handleSaveCustomer} isLoading={isSubmitting} className="w-auto px-8">
              {editId ? "Update Lead" : "Create Lead"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveCustomer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {(currentUser?.role === 'Admin' || currentUser?.role === 'Manager') && (
            <div className="space-y-2 col-span-full md:col-span-1">
              <label className="text-sm font-medium text-slate-300 ml-1 block">Assign To Staff</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User size={16} />
                </div>
                <select 
                  name="assigned_staff_id"
                  value={formData.assigned_staff_id || ''}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Unassigned</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} className="w-auto">
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteCustomer} isLoading={isSubmitting} className="w-auto">
              Delete Permanently
            </Button>
          </>
        }
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={32} />
          </div>
          <p className="text-slate-300">Are you sure you want to delete this customer? This action cannot be undone and all associated data will be lost.</p>
        </div>
      </Modal>
    </div>
  );
};

export default Customers;


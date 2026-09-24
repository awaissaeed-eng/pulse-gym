import { useCallback, useEffect, useState } from 'react';
import api from '../libraries/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    plan: '',
    joinDate: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (searchTerm) query.append('search', searchTerm);
      if (statusFilter !== 'all') query.append('status', statusFilter);

      const [membersRes, plansRes] = await Promise.all([
        api.get(`/members?${query}`),
        api.get('/plans'),
      ]);
      setMembers(membersRes.data);
      setPlans(plansRes.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const loadData = async () => {
      await fetchData();
    };
    loadData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/members/${editingId}`, formData);
      } else {
        await api.post('/members', formData);
      }
      setShowModal(false);
      setFormData({ name: '', phone: '', email: '', plan: '', joinDate: new Date().toISOString().split('T')[0] });
      setEditingId(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this member?')) return;
    try {
      await api.delete(`/members/${id}`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete');
    }
  };

  const handleEdit = (member) => {
    setFormData({
      name: member.name,
      phone: member.phone,
      email: member.email || '',
      plan: typeof member.plan === 'string' ? member.plan : member.plan._id,
      joinDate: member.joinDate,
    });
    setEditingId(member._id);
    setShowModal(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-pad" style={{ padding: '32px 24px', maxWidth: 1200 }}>
      {/* Header & Actions */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase text-white mb-1">Members</h1>
          <p className="text-sm" style={{ color: '#666' }}>{members.length} total members</p>
        </div>
        <Button variant="primary" onClick={() => { setEditingId(null); setShowModal(true); }}>
          + Add Member
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            background: '#1A1A1A',
            border: '1px solid #2A2A2A',
            borderRadius: 8,
            color: '#fff',
            padding: '12px 16px',
            fontSize: 13,
          }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#1A1A1A', border: '1px solid #222', borderRadius: 10, overflow: 'hidden' }} className="card-shadow">
        <table className="responsive-table w-full">
          <thead style={{ background: '#111', borderBottom: '1px solid #222' }}>
            <tr>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase' }}>Name</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase' }} className="hide-sm">Phone</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase' }} className="hide-sm">Plan</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member._id} className="table-row-hover" style={{ borderBottom: '1px solid #1E1E1E' }}>
                <td data-label="Name" style={{ padding: '16px' }} className="td-main">
                  <div>
                    <p className="text-white font-semibold text-sm">{member.name}</p>
                    <p className="text-xs" style={{ color: '#666' }}>{member.email || 'No email'}</p>
                  </div>
                </td>
                <td data-label="Phone" style={{ padding: '16px' }} className="hide-sm">{member.phone}</td>
                <td data-label="Plan" style={{ padding: '16px', color: '#888', fontSize: 13 }} className="hide-sm">
                  {typeof member.plan === 'string' ? 'N/A' : member.plan.name}
                </td>
                <td data-label="Status" style={{ padding: '16px' }}>
                  <Badge status={member.computedStatus || 'active'}>
                    {member.computedStatus === 'active' ? 'Active' : 'Expired'}
                  </Badge>
                </td>
                <td data-label="Actions" className="td-actions" style={{ padding: '16px', textAlign: 'right' }}>
                  <button onClick={() => handleEdit(member)} style={{ background: 'none', border: 'none', color: '#E5232D', cursor: 'pointer', fontSize: 12, marginRight: 8 }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(member._id)} style={{ background: 'none', border: 'none', color: '#E5232D', cursor: 'pointer', fontSize: 12 }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Member' : 'Add Member'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <div>
            <label htmlFor="member-plan" className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#888' }}>Plan</label>
            <select
              id="member-plan"
              name="plan"
              value={formData.plan}
              onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
              style={{
                width: '100%',
                background: '#111',
                border: '1px solid #2A2A2A',
                borderRadius: 8,
                color: '#fff',
                padding: '12px 16px',
              }}
              required
            >
              <option value="">Select a plan</option>
              {plans.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
          <Input
            label="Join Date"
            type="date"
            value={formData.joinDate}
            onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
            required
          />
          {error && <p className="text-xs" style={{ color: '#E5232D' }}>{error}</p>}
          <Button variant="primary" type="submit">Save Member</Button>
        </form>
      </Modal>
    </div>
  );
}
import { useCallback, useEffect, useState } from 'react';
import api from '../libraries/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';

export default function FeesPage() {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    member: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    periodCovered: '',
    status: 'pending',
  });
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const query = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const [paymentsRes, membersRes] = await Promise.all([
        api.get(`/payments${query}`),
        api.get('/members'),
      ]);
      setPayments(paymentsRes.data);
      setMembers(membersRes.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

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
      await api.post('/payments', formData);
      setShowModal(false);
      setFormData({ member: '', amount: '', date: new Date().toISOString().split('T')[0], periodCovered: '', status: 'pending' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      await api.patch(`/payments/${id}/mark-paid`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update');
    }
  };

  if (loading) return <LoadingSpinner />;

  const fmt = (n) => `$${n.toLocaleString()}`;

  return (
    <div className="page-pad" style={{ padding: '32px 24px', maxWidth: 1200 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase text-white mb-1">Fees & Payments</h1>
          <p className="text-sm" style={{ color: '#666' }}>{payments.length} total payments</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Add Payment
        </Button>
      </div>

      {/* Filter */}
      <div className="mb-6">
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
          <option value="all">All Payments</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#1A1A1A', border: '1px solid #222', borderRadius: 10, overflow: 'hidden' }} className="card-shadow">
        <table className="responsive-table w-full">
          <thead style={{ background: '#111', borderBottom: '1px solid #222' }}>
            <tr>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase' }}>Member</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase' }} className="hide-sm">Amount</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase' }} className="hide-sm">Date</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="table-row-hover" style={{ borderBottom: '1px solid #1E1E1E' }}>
                <td data-label="Member" style={{ padding: '16px' }} className="td-main">
                  {payment.memberNameSnapshot}
                </td>
                <td data-label="Amount" style={{ padding: '16px' }} className="hide-sm">
                  {fmt(payment.amount)}
                </td>
                <td data-label="Date" style={{ padding: '16px', color: '#888', fontSize: 13 }} className="hide-sm">
                  {new Date(payment.date).toLocaleDateString()}
                </td>
                <td data-label="Status" style={{ padding: '16px' }}>
                  <Badge status={payment.status}>
                    {payment.status === 'paid' ? 'Paid' : 'Pending'}
                  </Badge>
                </td>
                <td data-label="Action" className="td-actions" style={{ padding: '16px', textAlign: 'right' }}>
                  {payment.status === 'pending' && (
                    <button
                      onClick={() => handleMarkPaid(payment._id)}
                      style={{ background: 'none', border: 'none', color: '#22c55e', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                    >
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Payment">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#888' }}>Member</label>
            <select
              value={formData.member}
              onChange={(e) => setFormData({ ...formData, member: e.target.value })}
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
              <option value="">Select a member</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          </div>
          <Input
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="3000"
            required
          />
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <Input
            label="Period Covered"
            value={formData.periodCovered}
            onChange={(e) => setFormData({ ...formData, periodCovered: e.target.value })}
            placeholder="e.g., October 2026"
          />
          {error && <p className="text-xs" style={{ color: '#E5232D' }}>{error}</p>}
          <Button variant="primary" type="submit">Add Payment</Button>
        </form>
      </Modal>
    </div>
  );
}
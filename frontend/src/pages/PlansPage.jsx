import { useCallback, useEffect, useState } from 'react';
import api from '../libraries/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: 'monthly',
    description: '',
  });
  const [error, setError] = useState('');

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/plans');
      setPlans(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load plans');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadPlans = async () => {
      await fetchPlans();
    };
    loadPlans();
  }, [fetchPlans]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/plans/${editingId}`, formData);
      } else {
        await api.post('/plans', formData);
      }
      setShowModal(false);
      setFormData({ name: '', price: '', duration: 'monthly', description: '' });
      setEditingId(null);
      fetchPlans();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this plan?')) return;
    try {
      await api.delete(`/plans/${id}`);
      fetchPlans();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete');
    }
  };

  const handleEdit = (plan) => {
    setFormData({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      description: plan.description || '',
    });
    setEditingId(plan._id);
    setShowModal(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-pad" style={{ padding: '32px 24px', maxWidth: 1200 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase text-white mb-1">Membership Plans</h1>
          <p className="text-sm" style={{ color: '#666' }}>{plans.length} active plans</p>
        </div>
        <Button variant="primary" onClick={() => { setEditingId(null); setShowModal(true); }}>
          + Add Plan
        </Button>
      </div>

      {/* Grid */}
      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {plans.map((plan) => (
          <div
            key={plan._id}
            style={{
              background: '#1A1A1A',
              border: '1px solid #222',
              borderRadius: 12,
              padding: '28px',
              position: 'relative',
            }}
            className="card-shadow"
          >
            <h3 className="font-heading text-lg font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-4xl font-bold text-white mb-2">PKR {plan.price.toLocaleString('en-PK')}</p>
            <p className="text-xs mb-6" style={{ color: '#666' }}>per {plan.duration}</p>
            {plan.description && (
              <p className="text-sm mb-6" style={{ color: '#888' }}>{plan.description}</p>
            )}
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => handleEdit(plan)}>
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(plan._id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Plan' : 'Add Plan'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Plan Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Monthly Basic"
            required
          />
          <Input
            label="Price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="3000"
            required
          />
          <div>
            <label htmlFor="plan-duration" className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#888' }}>Duration</label>
            <select
              id="plan-duration"
              name="duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              style={{
                width: '100%',
                background: '#111',
                border: '1px solid #2A2A2A',
                borderRadius: 8,
                color: '#fff',
                padding: '12px 16px',
              }}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="e.g., Full gym access"
          />
          {error && <p className="text-xs" style={{ color: '#E5232D' }}>{error}</p>}
          <Button variant="primary" type="submit">Save Plan</Button>
        </form>
      </Modal>
    </div>
  );
}
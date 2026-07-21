import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import GlassCard from '../components/GlassCard';
import EwasteChart from '../components/EwasteChart';

const Dashboard = ({ user, setUser }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    category: 'Computers',
    description: '',
    weight: '',
    address: '',
    pickupDate: ''
  });

  const fetchUserRequests = async () => {
    try {
      const res = await API.get('/pickups');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await API.get('/auth/user');
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      console.error('Error updating user profile:', err);
    }
  };

  useEffect(() => {
    fetchUserRequests();
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await API.post('/pickups', formData);
      setRequests([res.data, ...requests]);
      setMsg({ type: 'success', text: 'Pickup request submitted successfully! Our collector will review it soon.' });
      setFormData({
        category: 'Computers',
        description: '',
        weight: '',
        address: '',
        pickupDate: ''
      });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.msg || 'Failed to submit request' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRedeem = async (points, title, code) => {
    if ((user?.ecoPoints || 0) < points) {
      alert(`Insufficient Eco Points! You need ${points} points to redeem "${title}".`);
      return;
    }

    if (!window.confirm(`Redeem ${points} points for "${title}"?`)) {
      return;
    }

    try {
      const res = await API.post('/auth/redeem', { points });
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      alert(`🎉 Voucher Redeemed! Your code for ${title} is: ${code}`);
    } catch (err) {
      alert(err.response?.data?.msg || 'Redemption failed.');
    }
  };

  const totalWeight = requests.reduce((acc, req) => acc + (req.weight || 0), 0);
  const recycledCount = requests.filter(r => r.status === 'recycled').length;

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Welcome Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>
              Citizen Dashboard
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage your e-waste requests & track eco-rewards</p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '1rem 1.5rem',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem'
          }}>
            <div style={{ fontSize: '2rem' }}>🌱</div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Available Eco Points</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#34d399' }}>{user?.ecoPoints || 0} Pts</div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <GlassCard>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Requests</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', marginTop: '0.25rem' }}>{requests.length}</div>
          </GlassCard>

          <GlassCard>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Submitted Weight</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#38bdf8', marginTop: '0.25rem' }}>{totalWeight.toFixed(1)} kg</div>
          </GlassCard>

          <GlassCard>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Completed Recycles</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#34d399', marginTop: '0.25rem' }}>{recycledCount}</div>
          </GlassCard>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
          {/* Schedule Form */}
          <div>
            <GlassCard>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📦</span> Request E-Waste Pickup
              </h3>

              {msg.text && (
                <div style={{
                  background: msg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                  border: `1px solid ${msg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                  color: msg.type === 'success' ? '#34d399' : '#f87171',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  marginBottom: '1rem'
                }}>
                  {msg.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="category" className="form-select" value={formData.category} onChange={handleChange} required>
                    <option value="Computers">Computers & Laptops</option>
                    <option value="Mobile Phones">Mobile Devices & Tablets</option>
                    <option value="Batteries">Batteries & Power Supplies</option>
                    <option value="Appliances">Home Appliances (Microwave, Fridge, etc.)</option>
                    <option value="Others">Accessories, Cables & Others</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated Weight (in kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    name="weight"
                    className="form-input"
                    placeholder="e.g. 2.5"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                  />
                  <small style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                    💡 You earn ~10 Eco Points per kg recycled!
                  </small>
                </div>

                <div className="form-group">
                  <label className="form-label">Description / Items</label>
                  <input
                    type="text"
                    name="description"
                    className="form-input"
                    placeholder="e.g. 1 broken Dell laptop & charger"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pickup Address</label>
                  <textarea
                    name="address"
                    className="form-textarea"
                    rows="2"
                    placeholder="House number, street, landmark, city"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Pickup Date</label>
                  <input
                    type="date"
                    name="pickupDate"
                    className="form-input"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
                  {submitting ? 'Submitting Request...' : 'Confirm Pickup Request'}
                </button>
              </form>
            </GlassCard>
          </div>

          {/* History & Analytics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <GlassCard>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
                Your Waste Breakdown
              </h3>
              <EwasteChart requests={requests} />
            </GlassCard>

            <GlassCard>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem' }}>
                Pickup Requests History
              </h3>

              {loading ? (
                <p style={{ color: 'var(--text-muted)' }}>Loading history...</p>
              ) : requests.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                  No pickup requests created yet. Submit your first request on the left!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                  {requests.map((req) => (
                    <div
                      key={req._id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '12px',
                        padding: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                          <strong style={{ fontSize: '1rem' }}>{req.category}</strong>
                          <span className={`badge badge-${req.status}`}>{req.status}</span>
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {req.description} • {req.weight} kg
                        </div>
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                          Requested: {new Date(req.pickupDate).toLocaleDateString()}
                        </div>
                      </div>

                      {req.status === 'recycled' && (
                        <div style={{ color: '#34d399', fontWeight: '700', fontSize: '0.9rem' }}>
                          +{req.pointsAwarded} Pts
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        </div>

        {/* Eco Rewards Store */}
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>🎁 Redeem Eco Rewards</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <GlassCard>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🪴</div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Organic Plant Voucher</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Get 1 indoor plant at local nurseries.</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#34d399', fontWeight: '700' }}>100 Points</span>
                <button
                  className="btn-outline-emerald"
                  onClick={() => handleRedeem(100, 'Organic Plant Voucher', 'ECOPLANT100')}
                >
                  Redeem
                </button>
              </div>
            </GlassCard>

            <GlassCard>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🛒</div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>₹200 Green Supermarket Coupon</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Valid on organic produce & groceries.</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#34d399', fontWeight: '700' }}>200 Points</span>
                <button
                  className="btn-outline-emerald"
                  onClick={() => handleRedeem(200, '₹200 Green Supermarket Coupon', 'GREEN200')}
                >
                  Redeem
                </button>
              </div>
            </GlassCard>

            <GlassCard>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚡</div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Solar Accessory Discount</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>20% OFF solar powerbanks & lights.</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#34d399', fontWeight: '700' }}>300 Points</span>
                <button
                  className="btn-outline-emerald"
                  onClick={() => handleRedeem(300, 'Solar Accessory Discount', 'SOLAR20')}
                >
                  Redeem
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

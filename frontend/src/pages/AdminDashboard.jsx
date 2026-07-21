import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import GlassCard from '../components/GlassCard';
import EwasteChart from '../components/EwasteChart';

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updateMsg, setUpdateMsg] = useState('');

  const fetchAllRequests = async () => {
    try {
      const res = await API.get('/pickups');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching admin requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      setUpdateMsg('Updating status...');
      const res = await API.put(`/pickups/${requestId}/status`, { status: newStatus });
      setRequests(requests.map(r => r._id === requestId ? res.data : r));
      setUpdateMsg(`Status updated to "${newStatus}"! Points awarded if recycled.`);
      setTimeout(() => setUpdateMsg(''), 4000);
    } catch (err) {
      setUpdateMsg(err.response?.data?.msg || 'Failed to update status');
    }
  };

  const filteredRequests = requests.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const totalWeightRecycled = requests
    .filter(r => r.status === 'recycled')
    .reduce((acc, r) => acc + (r.weight || 0), 0);

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem', color: '#38bdf8' }}>
              Admin & Collector Console ⚡
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage incoming pickup requests & certify recycling</p>
          </div>
        </div>

        {/* Global Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <GlassCard>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total System Requests</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.25rem' }}>{requests.length}</div>
          </GlassCard>

          <GlassCard>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Recycled Volume</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#34d399', marginTop: '0.25rem' }}>{totalWeightRecycled.toFixed(1)} kg</div>
          </GlassCard>

          <GlassCard>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Pending Requests</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#fbbf24', marginTop: '0.25rem' }}>
              {requests.filter(r => r.status === 'pending').length}
            </div>
          </GlassCard>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Main Pickup Requests Table */}
          <div>
            <GlassCard style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>E-Waste Pickup Queue</h3>
                
                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', background: '#111827', padding: '0.3rem', borderRadius: '8px' }}>
                  {['all', 'pending', 'scheduled', 'collected', 'recycled'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      style={{
                        background: filter === f ? 'var(--primary)' : 'transparent',
                        color: filter === f ? '#fff' : 'var(--text-muted)',
                        border: 'none',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {updateMsg && (
                <div style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38bdf8',
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  marginBottom: '1rem'
                }}>
                  {updateMsg}
                </div>
              )}

              {loading ? (
                <p style={{ color: 'var(--text-muted)' }}>Loading requests...</p>
              ) : filteredRequests.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                  No requests found matching status filter "{filter}".
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {filteredRequests.map(req => (
                    <div
                      key={req._id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <strong style={{ fontSize: '1.1rem' }}>{req.category}</strong>
                            <span className={`badge badge-${req.status}`}>{req.status}</span>
                          </div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                            {req.description} ({req.weight} kg)
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fff' }}>👤 {req.userName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            Date: {new Date(req.pickupDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                        📍 <strong>Address:</strong> {req.address}
                      </div>

                      {/* Status Control Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Update Status:</span>
                        
                        {['pending', 'scheduled', 'collected', 'recycled'].map(st => (
                          <button
                            key={st}
                            disabled={req.status === st}
                            onClick={() => handleStatusChange(req._id, st)}
                            style={{
                              background: req.status === st ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                              border: req.status === st ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
                              color: req.status === st ? '#fff' : 'var(--text-muted)',
                              opacity: req.status === st ? 0.6 : 1,
                              padding: '0.3rem 0.6rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              cursor: req.status === st ? 'default' : 'pointer',
                              textTransform: 'capitalize'
                            }}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>

          {/* System Analytics */}
          <div>
            <GlassCard>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Overall Recycling Mix</h3>
              <EwasteChart requests={requests} />
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

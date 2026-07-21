import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import GlassCard from '../components/GlassCard';

const Centers = () => {
  const [centers, setCenters] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await API.get('/centers');
        setCenters(res.data);
      } catch (err) {
        console.error('Error loading centers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  const filteredCenters = centers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
            E-Waste Drop-off Centers
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2rem' }}>
            Find official certified collection hubs near you to safely drop off your old electronic devices.
          </p>

          <input
            type="text"
            className="form-input"
            placeholder="🔍 Search by center name, street, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '0.9rem 1.25rem', fontSize: '1rem' }}
          />
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Loading collection centers...</p>
        ) : filteredCenters.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No centers found matching your search.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
            {filteredCenters.map((center) => (
              <GlassCard key={center._id || center.name}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem'
                  }}>
                    🏢
                  </div>
                  <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>{center.name}</h3>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  📍 {center.address}
                </p>

                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justify: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Hours:</span>
                    <strong style={{ color: '#fff' }}>{center.operatingHours}</strong>
                  </div>
                  <div style={{ display: 'flex', justify: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Phone:</span>
                    <strong style={{ color: '#34d399' }}>{center.phone}</strong>
                  </div>
                </div>

                <button
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '1.25rem', fontSize: '0.85rem' }}
                  onClick={() => alert(`Directions to ${center.name}: ${center.address}`)}
                >
                  📍 Get Directions
                </button>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Centers;

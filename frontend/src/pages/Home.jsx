import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import API from '../utils/api';

const Home = ({ user }) => {
  const [stats, setStats] = useState({
    totalWeightRecycled: 0,
    totalPickups: 0,
    totalPointsAwarded: 0,
    activeCenters: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching live stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in" style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Hero Section */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: '#34d399',
            fontSize: '0.875rem',
            fontWeight: '600',
            marginBottom: '1.5rem'
          }}>
            🌱 Sustainable Future Starts Here
          </div>

          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1.15, marginBottom: '1.5rem' }}>
            Dispose E-Waste Responsibly, <br />
            <span className="gradient-text">Earn Eco Rewards</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Turn your old electronics into environmental impact. Schedule easy doorstep pickup, 
            ensure certified safe recycling, and get rewarded with Eco Points!
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
                  Schedule Pickup Now
                </Link>
                <Link to="/centers" className="btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
                  Find Drop-off Centers
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Live Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          <GlassCard>
            <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#10b981', marginBottom: '0.25rem' }}>
              {stats.totalWeightRecycled.toFixed(1)} kg
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Total E-Waste Recycled</div>
          </GlassCard>
          
          <GlassCard>
            <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#06b6d4', marginBottom: '0.25rem' }}>
              {stats.totalPickups}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Total Pickup Requests</div>
          </GlassCard>

          <GlassCard>
            <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#f59e0b', marginBottom: '0.25rem' }}>
              {stats.totalPointsAwarded}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Eco Points Awarded</div>
          </GlassCard>

          <GlassCard>
            <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#a855f7', marginBottom: '0.25rem' }}>
              {stats.activeCenters}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Certified Drop-off Centers</div>
          </GlassCard>
        </div>

        {/* How It Works */}
        <div style={{ marginTop: '5rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: '3rem' }}>
            How <span className="gradient-text">EcoWaste</span> Works
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            <GlassCard>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📅</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>1. Request Pickup</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Fill out a simple form specifying your old devices, estimated weight, and preferred date.
              </p>
            </GlassCard>

            <GlassCard>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚚</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>2. Doorstep Collection</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Our authorized green collectors arrive at your doorstep to weigh and collect the e-waste.
              </p>
            </GlassCard>

            <GlassCard>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>♻️</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>3. Eco-Friendly Processing</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Hazardous materials are safely isolated, and valuable metals are recovered cleanly.
              </p>
            </GlassCard>

            <GlassCard>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎁</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>4. Earn Rewards</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Get 10 Eco Points per kg recycled, redeemable for green discounts & gift vouchers!
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

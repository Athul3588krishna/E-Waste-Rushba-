import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="glass-nav" style={{ padding: '1rem 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            ♻️
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>
            Eco<span className="gradient-text">Waste</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }}>
            Home
          </Link>
          <Link to="/centers" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }}>
            Collection Centers
          </Link>

          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '600' }}>
                  Admin Panel ⚡
                </Link>
              ) : (
                <Link to="/dashboard" style={{ color: '#34d399', textDecoration: 'none', fontWeight: '600' }}>
                  My Dashboard 📋
                </Link>
              )}

              {user.role === 'citizen' && (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#34d399'
                }}>
                  🌱 {user.ecoPoints || 0} Points
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: '500' }}>
                  Hi, {user.name}
                </span>
                <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.9rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.9rem' }}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

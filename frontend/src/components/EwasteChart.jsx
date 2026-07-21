import React from 'react';

const EwasteChart = ({ requests = [] }) => {
  // Compute category statistics from requests
  const categories = ['Computers', 'Mobile Phones', 'Batteries', 'Appliances', 'Others'];
  
  const counts = categories.map(cat => {
    return requests.filter(r => r.category === cat || (cat === 'Others' && !categories.slice(0, 4).includes(r.category))).length;
  });

  const total = requests.length || 1;
  const colors = ['#10b981', '#06b6d4', '#f59e0b', '#a855f7', '#ec4899'];

  return (
    <div style={{ marginTop: '1rem' }}>
      <h4 style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Recycling Category Breakdown
      </h4>
      
      <div style={{ display: 'flex', height: '14px', borderRadius: '8px', overflow: 'hidden', background: '#1f2937', marginBottom: '1.25rem' }}>
        {categories.map((cat, idx) => {
          const widthPercent = (counts[idx] / total) * 100;
          return (
            <div
              key={cat}
              style={{
                width: `${widthPercent || 20}%`,
                background: colors[idx],
                transition: 'width 0.5s ease-in-out'
              }}
              title={`${cat}: ${counts[idx]} items`}
            />
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
        {categories.map((cat, idx) => (
          <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: colors[idx] }} />
            <span style={{ color: 'var(--text-muted)' }}>{cat}:</span>
            <strong style={{ color: '#fff' }}>{counts[idx]}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EwasteChart;

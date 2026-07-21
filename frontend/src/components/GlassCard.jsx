import React from 'react';

const GlassCard = ({ children, className = '', style = {} }) => {
  return (
    <div className={`glass-panel ${className}`} style={{ padding: '1.75rem', ...style }}>
      {children}
    </div>
  );
};

export default GlassCard;

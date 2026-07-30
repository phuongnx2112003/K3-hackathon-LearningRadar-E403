import React from 'react';

const Widget = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={`card shadow-sm border-0 mb-4 ${className}`}>
      {title && (
        <div className="card-header bg-white border-bottom-0 pt-3 pb-1">
          <h5 className="card-title font-weight-bold mb-1">{title}</h5>
          {subtitle && <p className="card-subtitle text-muted small mb-0">{subtitle}</p>}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
};

export default Widget;

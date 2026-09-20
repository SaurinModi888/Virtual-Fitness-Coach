import React from 'react';

const StatCard = ({ title, value, unit = '', icon: Icon, color = 'primary', subtext, trend }) => {
  return (
    <div className={`card h-100 border-0 rounded-4 shadow-sm bg-dark-glass overflow-hidden position-relative hover-lift glow-${color}`}>
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span className="text-muted fw-medium fs-7 text-uppercase tracking-wider">{title}</span>
          {Icon && (
            <div className={`p-2 rounded-3 bg-${color} bg-opacity-15 text-${color} d-flex align-items-center justify-content-center`}>
              <Icon size={22} color="currentColor" />
            </div>
          )}
        </div>
        <div className="d-flex align-items-baseline gap-2 mb-2">
          <h2 className="display-6 fw-bold mb-0 text-white">{value}</h2>
          {unit && <span className="fs-6 fw-semibold text-muted">{unit}</span>}
        </div>
        {subtext && <p className="mb-0 text-secondary fs-7">{subtext}</p>}
        {trend && (
          <div className="mt-2">
            <span className={`badge bg-${trend.type === 'up' ? 'success' : 'warning'} bg-opacity-25 text-${trend.type === 'up' ? 'success' : 'warning'} fw-semibold`}>
              {trend.value}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

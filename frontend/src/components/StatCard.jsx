import React from 'react';

const StatCard = ({ title, value, unit = '', icon: Icon, color = 'primary', subtext, trend }) => {
  return (
    <div className="card card-theme h-100 p-3 hover-lift border-0 shadow-sm">
      <div className="card-body p-2 d-flex flex-column justify-content-between">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="text-secondary fw-semibold fs-7 text-uppercase tracking-wide">{title}</span>
          {Icon && (
            <div className="p-2 rounded-circle bg-light text-dark d-flex align-items-center justify-content-center border">
              <Icon size={18} />
            </div>
          )}
        </div>
        <div>
          <div className="d-flex align-items-baseline gap-2">
            <h3 className="fw-bold mb-0 text-dark display-7">{value}</h3>
            {unit && <span className="fs-7 fw-semibold text-secondary">{unit}</span>}
          </div>
          {subtext && <p className="mb-0 text-muted fs-8 mt-1">{subtext}</p>}
        </div>
        {trend && (
          <div className="mt-2">
            <span className="badge bg-light text-dark border fw-semibold fs-8">
              {trend.value}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

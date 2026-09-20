import React from 'react';
import { Dumbbell, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-4 bg-dark-glass border-top border-secondary border-opacity-25 text-center text-light-50 fs-7">
      <div className="container">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2 fw-semibold text-white">
            <Dumbbell size={18} className="text-primary" />
            <span>Virtual Fitness Coach AI</span>
          </div>
          <p className="mb-0 text-muted">
            Empowering your daily workouts, biometric goals, and mental resilience.
          </p>
          <div className="d-flex align-items-center gap-1 text-muted">
            <span>Built with</span>
            <Heart size={14} className="text-danger fill-danger" />
            <span>Flask & React</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

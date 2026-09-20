import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, Activity, HeartPulse, LineChart, User, LogOut, Flame } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-dark-glass border-bottom border-secondary border-opacity-25 px-lg-4 py-3">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4" to="/">
          <div className="brand-icon-wrapper bg-primary bg-gradient p-2 rounded-3 d-flex align-items-center justify-content-center text-white shadow">
            <Dumbbell size={22} className="text-white" />
          </div>
          <span className="text-gradient">FITPulse<span className="text-primary fs-6 ms-1">AI</span></span>
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          {isAuthenticated && (
            <>
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-2">
                <li className="nav-item">
                  <NavLink to="/dashboard" className={({ isActive }) => `nav-link px-3 py-2 rounded-3 d-flex align-items-center gap-2 ${isActive ? 'active bg-primary bg-opacity-25 text-primary fw-semibold' : 'text-light-50'}`}>
                    <Activity size={18} />
                    <span>Dashboard</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/workout-generator" className={({ isActive }) => `nav-link px-3 py-2 rounded-3 d-flex align-items-center gap-2 ${isActive ? 'active bg-primary bg-opacity-25 text-primary fw-semibold' : 'text-light-50'}`}>
                    <Flame size={18} />
                    <span>AI Workouts</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/wellness" className={({ isActive }) => `nav-link px-3 py-2 rounded-3 d-flex align-items-center gap-2 ${isActive ? 'active bg-primary bg-opacity-25 text-primary fw-semibold' : 'text-light-50'}`}>
                    <HeartPulse size={18} />
                    <span>Wellness Studio</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/progress" className={({ isActive }) => `nav-link px-3 py-2 rounded-3 d-flex align-items-center gap-2 ${isActive ? 'active bg-primary bg-opacity-25 text-primary fw-semibold' : 'text-light-50'}`}>
                    <LineChart size={18} />
                    <span>Progress Tracker</span>
                  </NavLink>
                </li>
              </ul>

              <div className="d-flex align-items-center gap-3">
                <Link to="/profile" className="text-decoration-none d-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-dark border border-secondary border-opacity-50 text-light hover-glow">
                  <div className="avatar-circle bg-primary bg-opacity-25 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                    <User size={16} color="currentColor" />
                  </div>
                  <div className="d-none d-xl-block text-start" style={{ lineHeight: '1.2' }}>
                    <div className="fw-semibold text-white fs-7">{user?.username || 'Member'}</div>
                    <div className="text-muted fs-8">{user?.goal || 'General Fitness'}</div>
                  </div>
                </Link>

                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center" title="Log Out">
                  <LogOut size={16} />
                </button>
              </div>
            </>
          )}

          {!isAuthenticated && (
            <div className="d-flex align-items-center ms-auto gap-2">
              <Link to="/login" className="btn btn-outline-light rounded-pill px-4">Sign In</Link>
              <Link to="/register" className="btn btn-primary rounded-pill px-4 shadow">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

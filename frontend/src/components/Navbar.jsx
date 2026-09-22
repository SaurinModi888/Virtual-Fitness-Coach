import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top py-2 px-lg-4 border-bottom border-dark">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="/NavBar-Logo.jpg"
            alt="FITNESS COACH"
            className="rounded bg-white p-1"
            style={{ height: '42px', objectFit: 'contain' }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <span className="fw-bold fs-4 text-white text-uppercase tracking-wider ms-2" style={{ display: 'none' }}>
            FITNESS COACH
          </span>
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none text-white"
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
          {isAuthenticated ? (
            <>
              <ul className="navbar-nav ms-auto me-4 mb-2 mb-lg-0 gap-lg-3 text-uppercase fw-semibold fs-7">
                <li className="nav-item">
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `nav-link px-3 py-2 text-uppercase ${
                        isActive ? 'text-white border-bottom border-2 border-info fw-bold' : 'text-light opacity-75'
                      }`
                    }
                  >
                    DASHBOARD
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/workout-generator"
                    className={({ isActive }) =>
                      `nav-link px-3 py-2 text-uppercase ${
                        isActive ? 'text-white border-bottom border-2 border-info fw-bold' : 'text-light opacity-75'
                      }`
                    }
                  >
                    WORKOUT
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/wellness"
                    className={({ isActive }) =>
                      `nav-link px-3 py-2 text-uppercase ${
                        isActive ? 'text-white border-bottom border-2 border-info fw-bold' : 'text-light opacity-75'
                      }`
                    }
                  >
                    WELLNESS
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/progress"
                    className={({ isActive }) =>
                      `nav-link px-3 py-2 text-uppercase ${
                        isActive ? 'text-white border-bottom border-2 border-info fw-bold' : 'text-light opacity-75'
                      }`
                    }
                  >
                    PROGRESS
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `nav-link px-3 py-2 text-uppercase ${
                        isActive ? 'text-white border-bottom border-2 border-info fw-bold' : 'text-light opacity-75'
                      }`
                    }
                  >
                    PROFILE
                  </NavLink>
                </li>
              </ul>

              <div className="d-flex align-items-center gap-3 ms-auto ms-lg-0">
                <Link to="/profile" className="text-decoration-none d-flex align-items-center gap-2 px-3 py-1-5 rounded-pill bg-secondary bg-opacity-25 text-white">
                  <div className="avatar-circle bg-white text-dark rounded-circle d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }}>
                    <User size={16} />
                  </div>
                  <span className="fw-semibold fs-7 text-white">{user?.username || 'Member'}</span>
                </Link>

                <button onClick={handleLogout} className="btn btn-blue-pill btn-sm text-uppercase px-4 py-2" title="Log Out">
                  LOGOUT
                </button>
              </div>
            </>
          ) : (
            <div className="d-flex align-items-center ms-auto gap-3 text-uppercase fw-semibold fs-7">
              <Link to="/workout-generator" className="nav-link text-light opacity-75 px-2">WORKOUT</Link>
              <Link to="/profile" className="nav-link text-light opacity-75 px-2">PROFILE</Link>
              <Link to="/login" className="btn btn-blue-pill px-4 py-2 text-uppercase">LOGIN</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

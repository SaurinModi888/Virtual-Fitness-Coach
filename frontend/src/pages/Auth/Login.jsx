import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, Lock, Mail, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login({ email, password });
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setEmail('demo@fitness.com');
    setPassword('demo1234');
    const result = await login({ email: 'demo@fitness.com', password: 'demo1234' });
    if (result.success) {
      navigate('/dashboard');
    } else {
      const regResult = await register({
        username: 'DemoAthlete',
        email: 'demo@fitness.com',
        password: 'demo1234',
        age: 26,
        weight: 72,
        height: 175,
        fitness_level: 'Intermediate',
        goal: 'Muscle Gain'
      });
      if (regResult.success) {
        navigate('/dashboard');
      } else {
        setError('Demo login failed: ' + regResult.message);
      }
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3 bg-light">
      <div className="card card-theme border-0 shadow-lg overflow-hidden w-100 bg-white" style={{ maxWidth: '440px' }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <img
              src="/NavBar-Logo.jpg"
              alt="FITNESS COACH"
              className="rounded bg-white p-1 border mb-3"
              style={{ height: '60px', objectFit: 'contain' }}
            />
            <h3 className="fw-bold text-dark text-uppercase mb-1">WELCOME BACK</h3>
            <p className="text-secondary fs-7">Sign in to access your personalized fitness dashboard</p>
          </div>

          {error && (
            <div className="alert alert-danger bg-light text-danger border rounded-3 fs-7 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-dark fs-7 fw-semibold">Email or Username</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-secondary">
                  <Mail size={18} />
                </span>
                <input
                  type="text"
                  className="form-control bg-white border border-start-0 text-dark"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-dark fs-7 fw-semibold">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-secondary">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  className="form-control bg-white border border-start-0 text-dark"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-blue-action w-100 py-2-5 fw-bold text-uppercase d-flex align-items-center justify-content-center gap-2 mb-3 shadow-sm" disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : (
                <>
                  <span>SIGN IN</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <button type="button" onClick={handleDemoLogin} className="btn btn-white-pill w-100 py-2-5 fw-semibold d-flex align-items-center justify-content-center gap-2 mb-4 text-dark border">
              <Sparkles size={18} className="text-primary" />
              <span>QUICK DEMO SIGN IN</span>
            </button>
          </form>

          <div className="text-center fs-7 text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary text-decoration-none fw-bold">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

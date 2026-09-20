import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Dumbbell, ArrowRight, Lock, Mail, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
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
    // Attempt login or register demo user
    const result = await login({ email: 'demo@fitness.com', password: 'demo1234' });
    if (result.success) {
      navigate('/dashboard');
    } else {
      // Auto register demo user if not created yet
      const { register } = useAuth();
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
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3 bg-gradient-dark">
      <div className="card border-0 rounded-4 shadow-lg bg-dark-glass overflow-hidden w-100" style={{ maxWidth: '440px' }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <div className="d-inline-flex bg-primary bg-opacity-25 text-primary p-3 rounded-circle mb-3 shadow-glow">
              <Dumbbell size={32} />
            </div>
            <h3 className="fw-bold text-white mb-1">Welcome Back</h3>
            <p className="text-muted fs-7">Sign in to resume your personal fitness journey</p>
          </div>

          {error && (
            <div className="alert alert-danger bg-danger bg-opacity-15 border-danger border-opacity-25 text-danger rounded-3 fs-7 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-secondary fs-7 fw-semibold">Email or Username</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary border-opacity-50 text-muted">
                  <Mail size={18} />
                </span>
                <input
                  type="text"
                  className="form-control bg-dark border-secondary border-opacity-50 text-white"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-secondary fs-7 fw-semibold">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary border-opacity-50 text-muted">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  className="form-control bg-dark border-secondary border-opacity-50 text-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 rounded-pill py-2-5 fw-semibold d-flex align-items-center justify-content-center gap-2 mb-3 shadow" disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <button type="button" onClick={handleDemoLogin} className="btn btn-outline-info w-100 rounded-pill py-2-5 fw-semibold d-flex align-items-center justify-content-center gap-2 mb-4">
              <Sparkles size={18} />
              <span>Quick Demo Sign In</span>
            </button>
          </form>

          <div className="text-center fs-7 text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary text-decoration-none fw-semibold">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

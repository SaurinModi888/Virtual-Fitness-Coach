import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Dumbbell, ArrowRight, User, Mail, Lock, Activity, Target, Weight, Ruler } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: 25,
    weight: 70,
    height: 170,
    fitness_level: 'Beginner',
    goal: 'Weight Loss'
  });

  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await register({
      ...formData,
      age: parseInt(formData.age, 10),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height)
    });
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3 bg-gradient-dark">
      <div className="card border-0 rounded-4 shadow-lg bg-dark-glass overflow-hidden w-100" style={{ maxWidth: '640px' }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <div className="d-inline-flex bg-primary bg-opacity-25 text-primary p-3 rounded-circle mb-3 shadow-glow">
              <Dumbbell size={32} />
            </div>
            <h3 className="fw-bold text-white mb-1">Create Your Profile</h3>
            <p className="text-muted fs-7">Tailor your workouts and biometrics with Virtual Fitness Coach</p>
          </div>

          {error && (
            <div className="alert alert-danger bg-danger bg-opacity-15 border-danger border-opacity-25 text-danger rounded-3 fs-7 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-6">
                <label className="form-label text-secondary fs-7 fw-semibold">Username</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-50 text-muted">
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    name="username"
                    className="form-control bg-dark border-secondary border-opacity-50 text-white"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label text-secondary fs-7 fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-50 text-muted">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    className="form-control bg-dark border-secondary border-opacity-50 text-white"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-12">
                <label className="form-label text-secondary fs-7 fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-50 text-muted">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    name="password"
                    className="form-control bg-dark border-secondary border-opacity-50 text-white"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <hr className="my-3 border-secondary border-opacity-25" />

              <div className="col-4">
                <label className="form-label text-secondary fs-7 fw-semibold">Age</label>
                <input
                  type="number"
                  name="age"
                  className="form-control bg-dark border-secondary border-opacity-50 text-white"
                  min="12"
                  max="100"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-4">
                <label className="form-label text-secondary fs-7 fw-semibold">Weight (kg)</label>
                <div className="input-group">
                  <input
                    type="number"
                    step="0.5"
                    name="weight"
                    className="form-control bg-dark border-secondary border-opacity-50 text-white"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-4">
                <label className="form-label text-secondary fs-7 fw-semibold">Height (cm)</label>
                <div className="input-group">
                  <input
                    type="number"
                    name="height"
                    className="form-control bg-dark border-secondary border-opacity-50 text-white"
                    value={formData.height}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label text-secondary fs-7 fw-semibold">Fitness Level</label>
                <select
                  name="fitness_level"
                  className="form-select bg-dark border-secondary border-opacity-50 text-white"
                  value={formData.fitness_level}
                  onChange={handleChange}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label text-secondary fs-7 fw-semibold">Primary Health Goal</label>
                <select
                  name="goal"
                  className="form-select bg-dark border-secondary border-opacity-50 text-white"
                  value={formData.goal}
                  onChange={handleChange}
                >
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Endurance">Endurance</option>
                  <option value="Flexibility & Wellness">Flexibility & Wellness</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 rounded-pill py-2-5 fw-semibold d-flex align-items-center justify-content-center gap-2 mb-4 shadow" disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="text-center fs-7 text-muted">
            Already registered?{' '}
            <Link to="/login" className="text-primary text-decoration-none fw-semibold">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

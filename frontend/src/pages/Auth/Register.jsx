import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, User, Mail, Lock } from 'lucide-react';

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
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3 bg-light">
      <div className="card card-theme border-0 shadow-lg overflow-hidden w-100 bg-white" style={{ maxWidth: '640px' }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <img
              src="/NavBar-Logo.jpg"
              alt="FITNESS COACH"
              className="rounded bg-white p-1 border mb-3"
              style={{ height: '60px', objectFit: 'contain' }}
            />
            <h3 className="fw-bold text-dark text-uppercase mb-1">CREATE YOUR PROFILE</h3>
            <p className="text-secondary fs-7">Personalized workout planning with Virtual Fitness Coach</p>
          </div>

          {error && (
            <div className="alert alert-danger bg-light text-danger border rounded-3 fs-7 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-6">
                <label className="form-label text-dark fs-7 fw-semibold">Username</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-secondary">
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    name="username"
                    className="form-control bg-white border border-start-0 text-dark"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label text-dark fs-7 fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-secondary">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    className="form-control bg-white border border-start-0 text-dark"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-12">
                <label className="form-label text-dark fs-7 fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-secondary">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    name="password"
                    className="form-control bg-white border border-start-0 text-dark"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <hr className="my-3 text-secondary" />

              <div className="col-4">
                <label className="form-label text-dark fs-7 fw-semibold">Age</label>
                <input
                  type="number"
                  name="age"
                  className="form-control bg-white border text-dark"
                  min="12"
                  max="100"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-4">
                <label className="form-label text-dark fs-7 fw-semibold">Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  name="weight"
                  className="form-control bg-white border text-dark"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-4">
                <label className="form-label text-dark fs-7 fw-semibold">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  className="form-control bg-white border text-dark"
                  value={formData.height}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label text-dark fs-7 fw-semibold">Fitness Level</label>
                <select
                  name="fitness_level"
                  className="form-select bg-white border text-dark"
                  value={formData.fitness_level}
                  onChange={handleChange}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label text-dark fs-7 fw-semibold">Primary Goal</label>
                <select
                  name="goal"
                  className="form-select bg-white border text-dark"
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

            <button type="submit" className="btn btn-blue-action w-100 py-2-5 fw-bold text-uppercase d-flex align-items-center justify-content-center gap-2 mb-4 shadow-sm" disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : (
                <>
                  <span>CREATE ACCOUNT</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="text-center fs-7 text-secondary">
            Already registered?{' '}
            <Link to="/login" className="text-primary text-decoration-none fw-bold">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

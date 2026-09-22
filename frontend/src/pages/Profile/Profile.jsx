import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Save, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    age: user?.age || 25,
    weight: user?.weight || 70,
    height: user?.height || 170,
    fitness_level: user?.fitness_level || 'Beginner',
    goal: user?.goal || 'Weight Loss'
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateBMILocal = () => {
    const w = parseFloat(formData.weight);
    const h = parseFloat(formData.height) / 100.0;
    if (h > 0 && w > 0) {
      return (w / (h * h)).toFixed(1);
    }
    return 22.0;
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { cat: 'Underweight', color: 'bg-info text-white' };
    if (bmi < 25.0) return { cat: 'Normal weight', color: 'bg-success text-white' };
    if (bmi < 30.0) return { cat: 'Overweight', color: 'bg-warning text-dark' };
    return { cat: 'Obese', color: 'bg-danger text-white' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    const res = await updateProfile({
      age: parseInt(formData.age, 10),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      fitness_level: formData.fitness_level,
      goal: formData.goal
    });

    if (res.success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
    setSaving(false);
  };

  const bmiVal = calculateBMILocal();
  const bmiInfo = getBMICategory(bmiVal);

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold text-uppercase text-purple-theme mb-1 d-flex align-items-center gap-2">
            <User className="text-primary" size={28} /> MEMBER PROFILE & BIOMETRICS
          </h2>
          <p className="text-secondary fs-7 mb-0">
            Manage your personal parameters to calibrate AI workout recommendations.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* Profile Edit Form */}
        <div className="col-12 col-lg-8">
          <div className="card card-theme p-4 border-0 shadow-sm">
            <h5 className="fw-bold text-uppercase text-dark mb-4">Update Biometrics</h5>

            {savedSuccess && (
              <div className="alert alert-success bg-light text-success border rounded-3 p-3 mb-4 d-flex align-items-center gap-2 fs-7">
                <CheckCircle2 size={18} />
                <span>Biometrics updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <label className="form-label text-dark fs-7 fw-semibold">Username</label>
                  <input
                    type="text"
                    className="form-control bg-light border text-secondary"
                    value={user?.username || ''}
                    disabled
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label text-dark fs-7 fw-semibold">Email Address</label>
                  <input
                    type="email"
                    className="form-control bg-light border text-secondary"
                    value={user?.email || ''}
                    disabled
                  />
                </div>

                <div className="col-4">
                  <label className="form-label text-dark fs-7 fw-semibold">Age</label>
                  <input
                    type="number"
                    name="age"
                    className="form-control bg-white border text-dark"
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

              <button
                type="submit"
                className="btn btn-blue-action px-5 py-2-5 fw-bold text-uppercase d-inline-flex align-items-center gap-2 shadow-sm"
                disabled={saving}
              >
                {saving ? (
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                ) : (
                  <>
                    <Save size={18} />
                    <span>SAVE BIOMETRIC PROFILE</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Live BMI Calculation Badge */}
        <div className="col-12 col-lg-4">
          <div className="card card-theme p-4 text-center h-100 d-flex flex-column justify-content-center border-0 shadow-sm">
            <h5 className="fw-bold text-uppercase text-dark mb-2">Live BMI Score</h5>
            <p className="text-secondary fs-7 mb-4">Calculated from your weight and height metrics</p>

            <div className="my-auto">
              <div className="display-3 fw-bold text-dark mb-2">{bmiVal}</div>
              <span className={`badge ${bmiInfo.color} fs-6 px-4 py-2 rounded-pill fw-semibold`}>
                {bmiInfo.cat}
              </span>
            </div>

            <div className="mt-4 pt-3 border-top text-start text-secondary fs-7">
              <div className="d-flex justify-content-between mb-1">
                <span>Healthy Range:</span>
                <span className="text-dark fw-semibold">18.5 – 24.9</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Daily Target Calories:</span>
                <span className="text-success fw-semibold">~2,100 kcal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

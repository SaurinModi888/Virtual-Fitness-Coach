import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { trackerAPI, wellnessAPI, workoutAPI } from '../../services/api';
import StatCard from '../../components/StatCard';
import { Flame, Trophy, Activity, Heart, Sparkles, Play, ArrowRight, Smile, Meh, Frown, CheckCircle, LayoutGrid } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [moodLogged, setMoodLogged] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [sumRes, historyRes] = await Promise.all([
        trackerAPI.getSummary(),
        workoutAPI.getHistory()
      ]);
      setSummary(sumRes.data);
      setRecentLogs(historyRes.data.slice(0, 4));
    } catch (err) {
      console.error("Dashboard data load error:", err);
    }
  };

  const handleQuickMoodLog = async (score) => {
    try {
      await wellnessAPI.logMood({ mood_rating: score, stress_level: 'Moderate' });
      setMoodLogged(true);
      setTimeout(() => setMoodLogged(false), 3000);
    } catch (err) {
      console.error("Failed to log mood:", err);
    }
  };

  return (
    <div className="container py-4">
      {/* 1. MAIN HERO SECTION (Exact layout from user screenshot) */}
      <div className="card card-theme p-4 p-md-5 mb-4 border-0 shadow-sm overflow-hidden bg-white">
        <div className="row align-items-center g-4">
          {/* Left Hero Content */}
          <div className="col-12 col-lg-6">
            <h1 className="fw-extrabold text-dark display-6 text-uppercase mb-3 tracking-tight" style={{ letterSpacing: '-0.02em', lineHeight: '1.2' }}>
              SOLUTIONS FOR PERSONALIZED FITNESS GROWTH
            </h1>
            <p className="text-secondary fw-medium fs-7 text-uppercase mb-4 pe-lg-3" style={{ lineHeight: '1.6', color: '#475569' }}>
              "GUIDING YOU TO A STRONGER, HEALTHIER YOU WITH PERSONALIZED PLANS, EXPERT ADVICE, AND THE DEDICATION TO ACHIEVE YOUR GOALS."
            </p>
            <div className="d-flex flex-wrap align-items-center gap-3">
              <Link to="/workout-generator" className="btn btn-blue-pill shadow-sm d-inline-flex align-items-center gap-2">
                <Play size={16} fill="currentColor" /> Generate Today's Routine
              </Link>
              <Link to="/profile" className="btn btn-white-pill d-inline-flex align-items-center gap-2">
                <span>View Biometrics ({user?.bmi || '22.0'} BMI)</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Graphic */}
          <div className="col-12 col-lg-6 text-center">
            <div className="p-2 rounded-4 bg-light border border-light shadow-sm d-inline-block w-100 max-w-lg">
              <img
                src="/Hero Section-2.png"
                alt="FITNESS COACH"
                className="img-fluid rounded-3"
                style={{ maxHeight: '280px', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.src = '/Hero Section-1.jpeg';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. CALL-TO-ACTION LIME HIGHLIGHT BANNER */}
      <div className="lime-banner-card p-3 p-md-4 mb-4 shadow-sm d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-3">
          <img
            src="/NavBar-Logo.jpg"
            alt="Logo"
            className="rounded bg-white p-1 border"
            style={{ height: '48px', objectFit: 'contain' }}
          />
          <h4 className="fw-bold text-uppercase mb-0 text-dark" style={{ letterSpacing: '0.02em' }}>
            CONVERT YOUR DREAMS INTO ACTIONS
          </h4>
        </div>
        <Link to="/workout-generator" className="btn btn-white-pill text-nowrap d-flex align-items-center gap-2 shadow-sm">
          <LayoutGrid size={16} className="text-primary" />
          <span>Get started</span>
        </Link>
      </div>

      {/* 3. THREE CORE HUB CARDS (From user screenshot) */}
      <div className="row g-4 mb-4">
        {/* Card 1: FITNESS PLANNING */}
        <div className="col-12 col-md-4">
          <div className="card card-theme-subtle h-100 p-4 text-center d-flex flex-column hover-lift">
            <h5 className="fw-bold text-uppercase text-purple-theme mb-3 text-decoration-underline" style={{ letterSpacing: '0.05em' }}>
              FITNESS PLANNING
            </h5>
            <p className="text-secondary fs-7 mb-4 flex-grow-1" style={{ color: '#475569' }}>
              Utilize the power of "FITNESS COACH" that meets your "LIFE GOALS".
            </p>
            <Link to="/workout-generator" className="btn btn-white-pill w-100 fw-semibold text-uppercase fs-7">
              Explore Generator
            </Link>
          </div>
        </div>

        {/* Card 2: MIND AND BODY WELLNESS */}
        <div className="col-12 col-md-4">
          <div className="card card-theme-subtle h-100 p-4 text-center d-flex flex-column hover-lift">
            <h5 className="fw-bold text-uppercase text-purple-theme mb-3 text-decoration-underline" style={{ letterSpacing: '0.05em' }}>
              MIND AND BODY WELLNESS
            </h5>
            <p className="text-secondary fs-7 mb-4 flex-grow-1" style={{ color: '#475569' }}>
              Holistic approach integrating both mental and physical wellness, including meditation and recovery plans.
            </p>
            <Link to="/wellness" className="btn btn-white-pill w-100 fw-semibold text-uppercase fs-7">
              Open Wellness Studio
            </Link>
          </div>
        </div>

        {/* Card 3: FITNESS RESOURCE */}
        <div className="col-12 col-md-4">
          <div className="card card-theme-subtle h-100 p-4 text-center d-flex flex-column hover-lift">
            <h5 className="fw-bold text-uppercase text-purple-theme mb-3 text-decoration-underline" style={{ letterSpacing: '0.05em' }}>
              FITNESS RESOURCE
            </h5>
            <p className="text-secondary fs-7 mb-4 flex-grow-1" style={{ color: '#475569' }}>
              Blog posts with expert tips, analytics trajectory, and advice.
            </p>
            <Link to="/progress" className="btn btn-white-pill w-100 fw-semibold text-uppercase fs-7">
              View Analytics Log
            </Link>
          </div>
        </div>
      </div>

      {/* 4. USER METRICS ROW */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Current Streak"
            value={summary?.current_streak_days || 0}
            unit="Days"
            icon={Flame}
            color="danger"
            subtext="Consistent workout activity"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Workouts"
            value={summary?.total_workouts || 0}
            unit="Sessions"
            icon={Trophy}
            color="primary"
            subtext="Lifetime completed routines"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Calories Burned"
            value={summary?.total_calories || 0}
            unit="kcal"
            icon={Activity}
            color="warning"
            subtext="Estimated expenditure"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Weekly Progress"
            value={`${summary?.weekly_progress_pct || 0}%`}
            unit={`(${summary?.weekly_workouts_completed || 0}/4)`}
            icon={Sparkles}
            color="info"
            subtext="Target target completion"
          />
        </div>
      </div>

      {/* 5. RECENT ACTIVITY LOG & MOOD CHECK-IN */}
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card card-theme p-4 h-100 border-0 shadow-sm">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h5 className="fw-bold text-uppercase text-purple-theme mb-0">Recent Activity Logs</h5>
              <Link to="/progress" className="text-primary text-decoration-none fs-7 fw-bold">View History →</Link>
            </div>

            {recentLogs.length === 0 ? (
              <div className="text-center py-4 text-muted fs-7">
                No workouts logged yet. Generate your first routine above!
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light fs-7 text-uppercase text-secondary">
                    <tr>
                      <th>Date</th>
                      <th>Routine Name</th>
                      <th>Target Muscle</th>
                      <th>Duration</th>
                      <th>Calories</th>
                    </tr>
                  </thead>
                  <tbody className="fs-7">
                    {recentLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="text-secondary">{log.date}</td>
                        <td className="fw-semibold text-dark">{log.workout_name}</td>
                        <td>
                          <span className="badge bg-light text-dark border rounded-pill px-3">
                            {log.target_muscle}
                          </span>
                        </td>
                        <td className="text-secondary">{log.duration_minutes} mins</td>
                        <td className="fw-semibold text-success">🔥 {log.calories_burned} kcal</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Quick Mood Logger */}
        <div className="col-12 col-lg-4">
          <div className="card card-theme p-4 h-100 border-0 shadow-sm text-center d-flex flex-column justify-content-between">
            <div>
              <h5 className="fw-bold text-uppercase text-purple-theme mb-2 d-flex align-items-center justify-content-center gap-2">
                <Heart className="text-danger" size={20} /> Daily Mood Check-In
              </h5>
              <p className="text-secondary fs-7 mb-3">
                Log your state of mind to tune recovery plans.
              </p>
            </div>

            {moodLogged ? (
              <div className="alert alert-success bg-light text-success border rounded-3 p-3 my-auto">
                <CheckCircle size={24} className="mb-1" />
                <div className="fw-bold fs-7">Mood Logged!</div>
              </div>
            ) : (
              <div className="d-flex justify-content-around my-auto py-3 bg-light rounded-3 border">
                {[
                  { score: 1, label: 'Low', icon: Frown, color: 'text-danger' },
                  { score: 3, label: 'Balanced', icon: Meh, color: 'text-warning' },
                  { score: 5, label: 'Great', icon: Smile, color: 'text-success' }
                ].map((item) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.score}
                      onClick={() => handleQuickMoodLog(item.score)}
                      className="btn btn-link text-decoration-none p-1 hover-lift"
                    >
                      <div className={`p-2 rounded-circle bg-white shadow-sm ${item.color} mb-1 mx-auto`}>
                        <IconComp size={22} />
                      </div>
                      <div className="text-dark fs-8 fw-semibold">{item.label}</div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-3 text-muted fs-8">
              Weekly Avg: <strong className="text-dark">{summary?.average_mood_score || 4.0} / 5.0</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { trackerAPI, wellnessAPI, workoutAPI } from '../../services/api';
import StatCard from '../../components/StatCard';
import { Flame, Trophy, Activity, Heart, Sparkles, Play, ArrowRight, Smile, Meh, Frown, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [moodRating, setMoodRating] = useState(4);
  const [moodLogged, setMoodLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [sumRes, historyRes] = await Promise.all([
        trackerAPI.getSummary(),
        workoutAPI.getHistory()
      ]);
      setSummary(sumRes.data);
      setRecentLogs(historyRes.data.slice(0, 4));
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickMoodLog = async (score) => {
    setMoodRating(score);
    try {
      await wellnessAPI.logMood({ mood_rating: score, stress_level: 'Moderate' });
      setMoodLogged(true);
      setTimeout(() => setMoodLogged(false), 3000);
    } catch (err) {
      console.error("Failed to log mood:", err);
    }
  };

  const getBMIBadgeColor = (cat) => {
    if (cat === 'Normal weight') return 'success';
    if (cat === 'Overweight') return 'warning';
    return 'info';
  };

  return (
    <div className="container py-4">
      {/* Header Banner */}
      <div className="card border-0 rounded-4 shadow-lg bg-gradient-primary text-white p-4 p-md-5 mb-4 position-relative overflow-hidden">
        <div className="position-relative z-1 row align-items-center">
          <div className="col-lg-8">
            <span className="badge bg-white bg-opacity-25 text-white mb-2 px-3 py-1 rounded-pill fs-7 fw-semibold">
              <Sparkles size={14} className="me-1" color="currentColor" /> Virtual Coach Active
            </span>
            <h1 className="display-5 fw-bold mb-2">Welcome, {user?.username || 'Athlete'}!</h1>
            <p className="fs-6 opacity-90 mb-3" style={{ maxWidth: '580px' }}>
              Your current health target is set to <strong className="text-warning">{user?.goal}</strong>. You are on a <span className="fw-bold">{summary?.current_streak_days || 0}-day streak</span>!
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/workout-generator" className="btn btn-light text-primary rounded-pill px-4 py-2 fw-bold shadow hover-lift d-inline-flex align-items-center gap-2">
                <Play size={18} color="currentColor" /> Generate Today's Workout
              </Link>
              <Link to="/wellness" className="btn btn-outline-light rounded-pill px-4 py-2 fw-semibold hover-lift d-inline-flex align-items-center gap-2">
                <Heart size={18} color="currentColor" /> Mindful Reset
              </Link>
            </div>
          </div>
          <div className="col-lg-4 d-none d-lg-block text-center position-relative">
            <div className="p-4 bg-white bg-opacity-10 rounded-4 backdrop-blur border border-white border-opacity-25 shadow text-start">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-white opacity-75 fs-7 fw-semibold">Biometrics Index</span>
                <span className={`badge bg-${getBMIBadgeColor(user?.bmi_category)} rounded-pill`}>
                  {user?.bmi_category}
                </span>
              </div>
              <div className="d-flex align-items-baseline gap-2">
                <span className="display-6 fw-bold">{user?.bmi || 22.0}</span>
                <span className="fs-7 opacity-75">BMI Score</span>
              </div>
              <div className="mt-3 pt-2 border-top border-white border-opacity-15 d-flex justify-content-between text-white fs-7 opacity-90">
                <span>Weight: {user?.weight} kg</span>
                <span>Height: {user?.height} cm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
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
            subtext="Estimated total expenditure"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Weekly Goal"
            value={`${summary?.weekly_progress_pct || 0}%`}
            unit={`(${summary?.weekly_workouts_completed || 0}/4)`}
            icon={Sparkles}
            color="info"
            subtext="Weekly target progress"
          />
        </div>
      </div>

      {/* Middle Grid: Recommended Workout + Mood Check-In */}
      <div className="row g-4 mb-4">
        {/* Recommended Today's Workout */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 rounded-4 shadow-sm bg-dark-glass h-100 p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold text-white mb-0 d-flex align-items-center gap-2">
                <Flame className="text-primary" size={22} color="currentColor" /> Today's AI Recommendation
              </h5>
              <span className="badge bg-primary bg-opacity-25 text-primary rounded-pill px-3 py-1">
                {user?.fitness_level || 'Intermediate'} Level
              </span>
            </div>
            <p className="text-secondary fs-7 mb-4">
              Based on your goal ({user?.goal}), our AI coach recommends a high-efficiency session targeting full body stability.
            </p>
            <div className="bg-dark p-3 rounded-3 border border-secondary border-opacity-25 mb-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="fw-bold text-white mb-1">Full Body Power & Core Burn</h6>
                  <span className="text-muted fs-7 me-3">⏱ 20 Minutes</span>
                  <span className="text-muted fs-7 me-3">🔥 ~170 kcal</span>
                  <span className="text-muted fs-7">🏋️ Bodyweight</span>
                </div>
                <Link to="/workout-generator" className="btn btn-primary rounded-circle p-3 d-flex align-items-center justify-content-center shadow">
                  <Play size={20} />
                </Link>
              </div>
            </div>
            <div className="mt-auto d-flex justify-content-between align-items-center text-muted fs-7">
              <span>Ready to transform your day?</span>
              <Link to="/workout-generator" className="text-primary text-decoration-none fw-semibold d-flex align-items-center gap-1">
                Customize Workout <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Mood Check-In */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 rounded-4 shadow-sm bg-dark-glass h-100 p-4">
            <h5 className="fw-bold text-white mb-2 d-flex align-items-center gap-2">
              <Heart className="text-danger" size={22} /> Daily Mood Check-In
            </h5>
            <p className="text-secondary fs-7 mb-3">
              Mental resilience is key to athletic performance. How are you feeling right now?
            </p>

            {moodLogged ? (
              <div className="alert alert-success bg-success bg-opacity-20 text-success border-0 rounded-3 p-3 text-center my-auto">
                <CheckCircle size={28} className="mb-2" />
                <div className="fw-bold">Mood Logged!</div>
                <div className="fs-7">Your mental wellness stats have been updated.</div>
              </div>
            ) : (
              <div className="d-flex justify-content-around my-auto py-3 bg-dark rounded-3 border border-secondary border-opacity-25">
                {[
                  { score: 1, label: 'Exhausted', icon: Frown, color: 'danger' },
                  { score: 3, label: 'Balanced', icon: Meh, color: 'warning' },
                  { score: 5, label: 'Energized', icon: Smile, color: 'success' }
                ].map((item) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.score}
                      onClick={() => handleQuickMoodLog(item.score)}
                      className="btn btn-link text-decoration-none text-center p-2 hover-scale"
                    >
                      <div className={`p-3 rounded-circle bg-${item.color} bg-opacity-15 text-${item.color} mb-1 mx-auto`}>
                        <IconComp size={24} />
                      </div>
                      <div className="text-muted fs-8 fw-semibold">{item.label}</div>
                    </button>
                  );
                })}
              </div>
            )}
            <div className="mt-3 text-center text-muted fs-7">
              Average weekly mood score: <strong className="text-white">{summary?.average_mood_score || 4.0} / 5.0</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="card border-0 rounded-4 shadow-sm bg-dark-glass p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="fw-bold text-white mb-0">Recent Activity Logs</h5>
          <Link to="/progress" className="text-primary text-decoration-none fs-7 fw-semibold">View All History</Link>
        </div>

        {recentLogs.length === 0 ? (
          <div className="text-center py-4 text-muted fs-7">
            No workouts logged yet. Generate your first routine above!
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0 bg-transparent">
              <thead>
                <tr className="text-muted fs-7">
                  <th>Date</th>
                  <th>Workout Name</th>
                  <th>Target Muscle</th>
                  <th>Duration</th>
                  <th>Calories</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="text-secondary fs-7">{log.date}</td>
                    <td className="fw-semibold text-white">{log.workout_name}</td>
                    <td>
                      <span className="badge bg-secondary bg-opacity-25 text-light rounded-pill">
                        {log.target_muscle}
                      </span>
                    </td>
                    <td className="text-secondary fs-7">{log.duration_minutes} mins</td>
                    <td className="text-warning fw-semibold fs-7">🔥 {log.calories_burned} kcal</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

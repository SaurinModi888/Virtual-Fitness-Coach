import React, { useState, useEffect } from 'react';
import { trackerAPI, workoutAPI, wellnessAPI } from '../../services/api';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { LineChart, Activity, Flame, Calendar, Trophy } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ProgressTracker = () => {
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [moodLogs, setMoodLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrackerData();
  }, []);

  const fetchTrackerData = async () => {
    try {
      setLoading(true);
      const [sumRes, chartsRes, historyRes, moodRes] = await Promise.all([
        trackerAPI.getSummary(),
        trackerAPI.getCharts(),
        workoutAPI.getHistory(),
        wellnessAPI.getMoodHistory()
      ]);
      setSummary(sumRes.data);
      setChartData(chartsRes.data);
      setWorkoutLogs(historyRes.data);
      setMoodLogs(moodRes.data);
    } catch (err) {
      console.error("Failed to load progress tracker data:", err);
    } finally {
      setLoading(false);
    }
  };

  const calorieLineChartConfig = {
    labels: chartData?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Calories Burned (kcal)',
        data: chartData?.calories_series || [0, 150, 220, 180, 310, 250, 290],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointRadius: 5
      }
    ]
  };

  const muscleBarChartConfig = {
    labels: chartData?.muscle_distribution?.labels || ['Chest', 'Legs', 'Core', 'Full Body'],
    datasets: [
      {
        label: 'Workouts Completed',
        data: chartData?.muscle_distribution?.counts || [3, 4, 2, 5],
        backgroundColor: [
          'rgba(16, 185, 129, 0.75)',
          'rgba(6, 182, 212, 0.75)',
          'rgba(99, 102, 241, 0.75)',
          'rgba(245, 158, 11, 0.75)'
        ],
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#adb5bd' }
      }
    },
    scales: {
      x: {
        ticks: { color: '#adb5bd' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      },
      y: {
        ticks: { color: '#adb5bd' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      }
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
            <LineChart className="text-primary" size={28} /> Analytics & Progress Tracker
          </h2>
          <p className="text-secondary fs-7 mb-0">
            Visualize your consistency, calorie expenditure trajectory, and workout log breakdown.
          </p>
        </div>
      </div>

      {/* Top Stat Badges */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 rounded-4 bg-dark-glass p-3 text-center">
            <div className="text-muted fs-8 text-uppercase">Total Workout Volume</div>
            <div className="fs-3 fw-bold text-white mt-1">{summary?.total_workouts || 0} <span className="fs-7 text-muted">Sessions</span></div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 rounded-4 bg-dark-glass p-3 text-center">
            <div className="text-muted fs-8 text-uppercase">Total Calories Burned</div>
            <div className="fs-3 fw-bold text-warning mt-1">{summary?.total_calories || 0} <span className="fs-7 text-muted">kcal</span></div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 rounded-4 bg-dark-glass p-3 text-center">
            <div className="text-muted fs-8 text-uppercase">Active Streak</div>
            <div className="fs-3 fw-bold text-danger mt-1">{summary?.current_streak_days || 0} <span className="fs-7 text-muted">Days</span></div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 rounded-4 bg-dark-glass p-3 text-center">
            <div className="text-muted fs-8 text-uppercase">Avg Mental Wellness</div>
            <div className="fs-3 fw-bold text-info mt-1">{summary?.average_mood_score || 4.0} <span className="fs-7 text-muted">/ 5.0</span></div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-7">
          <div className="card border-0 rounded-4 shadow-sm bg-dark-glass p-4 h-100">
            <h5 className="fw-bold text-white mb-3">7-Day Calorie Expenditure Trajectory</h5>
            <Line data={calorieLineChartConfig} options={chartOptions} />
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card border-0 rounded-4 shadow-sm bg-dark-glass p-4 h-100">
            <h5 className="fw-bold text-white mb-3">Target Muscle Distribution</h5>
            <Bar data={muscleBarChartConfig} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Full Workout Logs Table */}
      <div className="card border-0 rounded-4 shadow-sm bg-dark-glass p-4 mb-4">
        <h5 className="fw-bold text-white mb-3">Complete Workout History</h5>
        {workoutLogs.length === 0 ? (
          <div className="text-center py-4 text-muted fs-7">
            No workout sessions logged yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0 bg-transparent">
              <thead>
                <tr className="text-muted fs-7">
                  <th>#</th>
                  <th>Date & Time</th>
                  <th>Workout Title</th>
                  <th>Target Muscle</th>
                  <th>Duration</th>
                  <th>Calories Burned</th>
                </tr>
              </thead>
              <tbody>
                {workoutLogs.map((log, idx) => (
                  <tr key={log.id}>
                    <td className="text-muted fs-7">{idx + 1}</td>
                    <td className="text-secondary fs-7">{log.date}</td>
                    <td className="fw-semibold text-white">{log.workout_name}</td>
                    <td>
                      <span className="badge bg-primary bg-opacity-25 text-primary rounded-pill">
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

export default ProgressTracker;

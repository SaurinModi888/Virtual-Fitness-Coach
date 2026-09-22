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
import { LineChart } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrackerData();
  }, []);

  const fetchTrackerData = async () => {
    try {
      setLoading(true);
      const [sumRes, chartsRes, historyRes] = await Promise.all([
        trackerAPI.getSummary(),
        trackerAPI.getCharts(),
        workoutAPI.getHistory()
      ]);
      setSummary(sumRes.data);
      setChartData(chartsRes.data);
      setWorkoutLogs(historyRes.data);
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
        borderColor: '#8cc63f',
        backgroundColor: 'rgba(140, 198, 63, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#8cc63f',
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
          'rgba(90, 33, 135, 0.85)',
          'rgba(0, 132, 255, 0.85)',
          'rgba(140, 198, 63, 0.85)',
          'rgba(245, 158, 11, 0.85)'
        ],
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#475569', font: { family: 'Outfit' } }
      }
    },
    scales: {
      x: {
        ticks: { color: '#64748b' },
        grid: { color: '#e2e8f0' }
      },
      y: {
        ticks: { color: '#64748b' },
        grid: { color: '#e2e8f0' }
      }
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold text-uppercase text-purple-theme mb-1 d-flex align-items-center gap-2">
            <LineChart className="text-primary" size={28} /> FITNESS RESOURCE & ANALYTICS
          </h2>
          <p className="text-secondary fs-7 mb-0">
            Track calorie trajectory, workout distribution, and lifetime activity history.
          </p>
        </div>
      </div>

      {/* Top Stat Summary Badges */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card card-theme p-3 text-center border-0 shadow-sm">
            <div className="text-secondary fs-8 text-uppercase fw-semibold">Total Workout Volume</div>
            <div className="fs-3 fw-bold text-dark mt-1">{summary?.total_workouts || 0} <span className="fs-7 text-muted">Sessions</span></div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card card-theme p-3 text-center border-0 shadow-sm">
            <div className="text-secondary fs-8 text-uppercase fw-semibold">Total Calories Burned</div>
            <div className="fs-3 fw-bold text-success mt-1">{summary?.total_calories || 0} <span className="fs-7 text-muted">kcal</span></div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card card-theme p-3 text-center border-0 shadow-sm">
            <div className="text-secondary fs-8 text-uppercase fw-semibold">Active Streak</div>
            <div className="fs-3 fw-bold text-danger mt-1">{summary?.current_streak_days || 0} <span className="fs-7 text-muted">Days</span></div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card card-theme p-3 text-center border-0 shadow-sm">
            <div className="text-secondary fs-8 text-uppercase fw-semibold">Avg Mental Score</div>
            <div className="fs-3 fw-bold text-primary mt-1">{summary?.average_mood_score || 4.0} <span className="fs-7 text-muted">/ 5.0</span></div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-7">
          <div className="card card-theme p-4 h-100 border-0 shadow-sm">
            <h5 className="fw-bold text-uppercase text-purple-theme mb-3">7-Day Calorie Burn Trajectory</h5>
            <Line data={calorieLineChartConfig} options={chartOptions} />
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card card-theme p-4 h-100 border-0 shadow-sm">
            <h5 className="fw-bold text-uppercase text-purple-theme mb-3">Target Muscle Distribution</h5>
            <Bar data={muscleBarChartConfig} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Full Workout Logs Table */}
      <div className="card card-theme p-4 border-0 shadow-sm">
        <h5 className="fw-bold text-uppercase text-purple-theme mb-3">Complete Workout History</h5>
        {workoutLogs.length === 0 ? (
          <div className="text-center py-4 text-muted fs-7">
            No workout sessions logged yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light fs-7 text-uppercase text-secondary">
                <tr>
                  <th>#</th>
                  <th>Date & Time</th>
                  <th>Workout Title</th>
                  <th>Target Muscle</th>
                  <th>Duration</th>
                  <th>Calories Burned</th>
                </tr>
              </thead>
              <tbody className="fs-7">
                {workoutLogs.map((log, idx) => (
                  <tr key={log.id}>
                    <td className="text-muted fs-8">{idx + 1}</td>
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
  );
};

export default ProgressTracker;

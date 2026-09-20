import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import WorkoutGenerator from './pages/WorkoutGenerator/WorkoutGenerator';
import WellnessStudio from './pages/Wellness/WellnessStudio';
import ProgressTracker from './pages/ProgressTracker/ProgressTracker';
import Profile from './pages/Profile/Profile';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

function AppLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100 bg-app-dark text-light">
      <Navbar />
      <main className="flex-grow-1">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Application Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={
                <AppLayout>
                  <Navigate to="/dashboard" replace />
                </AppLayout>
              }
            />
            <Route
              path="/dashboard"
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              }
            />
            <Route
              path="/workout-generator"
              element={
                <AppLayout>
                  <WorkoutGenerator />
                </AppLayout>
              }
            />
            <Route
              path="/wellness"
              element={
                <AppLayout>
                  <WellnessStudio />
                </AppLayout>
              }
            />
            <Route
              path="/progress"
              element={
                <AppLayout>
                  <ProgressTracker />
                </AppLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <AppLayout>
                  <Profile />
                </AppLayout>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fitness_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for global error response handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('fitness_token');
      localStorage.removeItem('fitness_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

export const workoutAPI = {
  getExercises: (targetMuscle) => api.get('/workouts/exercises', { params: { target_muscle: targetMuscle } }),
  generateWorkout: (params) => api.post('/workouts/generate', params),
  getRoutines: () => api.get('/workouts/routines'),
  logWorkout: (workoutData) => api.post('/workouts/log', workoutData),
  getHistory: () => api.get('/workouts/history'),
};

export const wellnessAPI = {
  getSessions: (type) => api.get('/wellness/sessions', { params: { type } }),
  logMood: (moodData) => api.post('/wellness/log-mood', moodData),
  getMoodHistory: () => api.get('/wellness/mood-history'),
};

export const trackerAPI = {
  getSummary: () => api.get('/progress/summary'),
  getCharts: () => api.get('/progress/charts'),
};

export default api;

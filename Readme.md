PROJECT BLUEPRINT & IMPLEMENTATION GUIDE: VIRTUAL FITNESS COACH

PROJECT OVERVIEW & METRICS

Project Name: Virtual Fitness Coach
Description: A personalized, responsive web application delivering dynamic
workout routines, mental wellness modules, and gamified progress
tracking tailored to user profiles, health goals, and metrics.


Tech Stack Architecture:

Backend: Python, Flask, Flask-RESTful, Flask-JWT-Extended

Database & ORM: SQLite, SQLAlchemy ORM

Frontend: React.js (Node.js runtime), JavaScript (ES6+), HTML5, CSS3, Bootstrap 5

Authentication: JWT (JSON Web Tokens) & bcrypt password hashing

API Communication: RESTful JSON APIs via Axios 

================================================================================
2. SYSTEM ARCHITECTURE & FOLDER STRUCTURE

virtual-fitness-coach/
│
├── backend/
│   ├── app/
│   │   ├── init.py               # Flask app factory, extensions init
│   │   ├── config.py                 # Secret keys, database URI, JWT expiry
│   │   ├── models/                   # SQLAlchemy DB Schema definitions
│   │   │   ├── init.py
│   │   │   ├── user.py               # User, profile, health metrics
│   │   │   ├── workout.py            # Exercises, workout plans, logs
│   │   │   ├── wellness.py           # Meditation sessions, mood localStorage

│   │   ├── routes/                   # REST API Endpoints
│   │   │   ├── init.py
│   │   │   ├── auth_routes.py        # /api/auth (signup, login, profile)
│   │   │   ├── workout_routes.py     # /api/workouts (generator, logs)
│   │   │   ├── wellness_routes.py    # /api/wellness (meditation, stress)
│   │   │   └── tracker_routes.py     # /api/progress (analytics, history)
│   │   └── services/                 # Core Business Logic
│   │       ├── LLM.py                # Geminie API recommendation engine
│   │       └── analytics_engine.py   # Aggregation & progress metrics
│   ├── run.py                        # Entry point to launch Flask server
│   ├── requirements.txt              # Backend dependencies
│   └── instance/
│       └── fitness_coach.db          # SQLite database storage
│
└── frontend/
├── public/
│   └── index.html                # Single-page HTML entry point
├── src/
│   ├── assets/                   # Images, icons, static files
│   ├── components/               # Reusable UI components
│   │   ├── Navbar.jsx            # Responsive navigation header
│   │   ├── Footer.jsx            # Platform footer
│   │   ├── ProtectedRoute.jsx    # Auth route guard
│   │   └── StatCard.jsx          # Reusable analytics metric card
│   ├── pages/                    # Core view pages
│   │   ├── Auth/                 # Login & Registration views
│   │   ├── Dashboard/            # Overview, quick stats, today's plan
│   │   ├── WorkoutGenerator/     # Dynamic routine builder UI
│   │   ├── Wellness/             # Mindfulness, guided breathing, audio
│   │   ├── ProgressTracker/      # Charts, weekly trends, history logs

│   ├── services/
│   │   └── api.js                # Axios instance & centralized API calls
│   ├── App.jsx                   # Router switch & global context
│   └── index.js                  # React DOM mounting
└── package.json                  # Frontend dependencies and scripts

================================================================================
3. STEP-BY-STEP IMPLEMENTATION ROADMAP

PHASE 1: ENVIRONMENT SETUP & BACKEND SCAFFOLDING

//the boilerplate setup for flask and react  is comlpeted   

Step 1.1: Initialize project root repository and Python virtual environment.
mkdir virtual-fitness-coach && cd virtual-fitness-coach
python -m venv venv
# Windows: venv\Scripts\activate | Unix/Mac: source venv/bin/activate

Step 1.2: Install Flask dependencies in backend/requirements.txt:
Flask3.0.0
Flask-Cors4.0.0
Flask-SQLAlchemy3.1.1
Flask-JWT-Extended4.6.0
Flask-Bcrypt1.0.1
marshmallow3.20.1

Step 1.3: Configure backend/app/config.py with:
- SECRET_KEY
- SQLALCHEMY_DATABASE_URI = "sqlite:///fitness_coach.db"
- SQLALCHEMY_TRACK_MODIFICATIONS = False
- JWT_SECRET_KEY

PHASE 2: DATABASE DESIGN & ORM MODELING

Step 2.1: Implement User & Profile Schema:
- Fields: id, username, email, password_hash, age, weight, height,
fitness_level ('Beginner', 'Intermediate', 'Advanced'),
goal ('Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility'),
created_at.

Step 2.2: Implement Workout & Exercise Schema:
- Exercise: id, name, target_muscle, equipment, difficulty, instructions.
- Routine: id, user_id (FK), title, total_duration, difficulty_level.
- WorkoutLog: id, user_id (FK), date, duration_minutes, calories_burned.

Step 2.3: Implement Wellness & Mind Module Schema:
- WellnessSession: id, title, type ('Meditation', 'Breathing', 'Mindfulness'),
duration_minutes, media_url, difficulty.
- MoodLog: id, user_id (FK), mood_rating (1-5), stress_level, date.

PHASE 3: CORE LOGIC & RESTful API DEVELOPMENT

Step 3.1: Build JWT-Protected Authentication:
- POST /api/auth/register : Validate inputs, hash password, create user record.
- POST /api/auth/login    : Verify password, issue signed JWT token.
- GET  /api/auth/profile  : Return active user metrics and preferences.

Step 3.2: Workout Generator Engine (workout_engine.py):
- Input: user fitness level, available equipment, target goals, duration.
- Algorithm: Based on all the data user provides in the above module we will send an prompt to send to get the response from the gemini API in a JSON format that we can save in the exsercise table for the user.
- Endpoints:
* POST /api/workouts/generate  (create customized routine)
* POST /api/workouts/log       (record completed session)
* GET  /api/workouts/history   (retrieve historical logs)

Step 3.3: Wellness & Mind Engine:
- GET  /api/wellness/sessions    (list meditation and breathwork exercises)
- POST /api/wellness/log-mood    (save daily mental wellness score)

Step 3.4: Progress & Analytics Tracker:
- GET  /api/progress/summary     (calculate total workouts, streak count,
calorie expenditure, and weekly progress percentage).

PHASE 4: FRONTEND DEVELOPMENT (REACT.JS & BOOTSTRAP)

Step 4.1: Initialize React Application:
npx create-react-app frontend
cd frontend && npm install bootstrap react-bootstrap axios react-router-dom chart.js react-chartjs-2

Step 4.2: Global API Layer:
- Configure Axios interceptors in src/services/api.js to automatically
attach JWT Bearer tokens from localStorage to outgoing requests.

Step 4.3: Develop Core Views:
- Dashboard: At-a-glance cards showing current streak, BMI calculation,
today's scheduled workout, and wellness quote.
- Dynamic Workout Generator: Form controls for workout length, muscle target,
and intensity, presenting dynamic exercise cards with timers and instructions.
- Wellness Studio: Embedded audio/visual players for guided meditation sessions
and interactive breathing rhythm circles.
- Progress Visualizer: Interactive Chart.js graphs displaying consistency,
weight trajectories, and logged intensity.

PHASE 5: TESTING, INTEGRATION & OPTIMIZATION

Step 5.1: Cross-origin configuration:
- Ensure CORS headers allow frontend consumption (CORS(app, resources={r"/api/*": {"origins": "*"}}))

Step 5.2: UI/UX Responsiveness Testing:
- Test viewport break points (Bootstrap grid) across mobile (375px+), tablet,
and desktop monitors.

Step 5.3: End-to-End Flow Verification:
1. Sign up user -> 2. Input biometric profile -> 3. Generate customized
plan -> 4. Execute and log workout -> 5. Complete 5-minute cooldown meditation
-> 6. Confirm real-time updates on the Progress Dashboard.

================================================================================
4. KEY DATABASE SCHEMAS (REFERENCE CODE)

backend/app/models/user.py

from app import db
from datetime import datetime

class User(db.Model):
tablename = 'users'

id = db.Column(db.Integer, primary_key=True)
username = db.Column(db.String(64), unique=True, nullable=False)
email = db.Column(db.String(120), unique=True, nullable=False)
password_hash = db.Column(db.String(128), nullable=False)
fitness_level = db.Column(db.String(32), default='Beginner')
goal = db.Column(db.String(64), default='General Fitness')
created_at = db.Column(db.DateTime, default=datetime.utcnow)

workouts = db.relationship('WorkoutLog', backref='user', lazy=True)
mood_logs = db.relationship('MoodLog', backref='user', lazy=True)


backend/app/models/workout.py

class WorkoutLog(db.Model):
tablename = 'workout_logs'

id = db.Column(db.Integer, primary_key=True)
user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
date = db.Column(db.DateTime, default=datetime.utcnow)
workout_name = db.Column(db.String(100), nullable=False)
duration_minutes = db.Column(db.Integer, nullable=False)
calories_burned = db.Column(db.Integer, nullable=False)


================================================================================
5. DEPLOYMENT & EXECUTION INSTRUCTIONS

RUNNING BACKEND LOCALLY:

cd backend

source venv/bin/activate (or venv\Scripts\activate on Windows)

pip install -r requirements.txt

python run.py
-> Server starts on http://127.0.0.1:5000

RUNNING FRONTEND LOCALLY:

cd frontend

npm install

npm start
-> Application accessible on http://localhost:3000

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from app.config import Config

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Import routes/blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.workout_routes import workout_bp
    from app.routes.wellness_routes import wellness_bp
    from app.routes.tracker_routes import tracker_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(workout_bp, url_prefix='/api/workouts')
    app.register_blueprint(wellness_bp, url_prefix='/api/wellness')
    app.register_blueprint(tracker_bp, url_prefix='/api/progress')

    with app.app_context():
        db.create_all()
        seed_initial_data()

    return app

def seed_initial_data():
    from app.models.workout import Exercise
    from app.models.wellness import WellnessSession

    # Seed Exercises if empty
    if Exercise.query.count() == 0:
        exercises = [
            # Chest & Arms
            Exercise(name="Push-ups", target_muscle="Chest", equipment="Bodyweight", difficulty="Beginner", instructions="Keep body straight, lower chest to floor, push up steadily.", calories_per_min=7.0),
            Exercise(name="Dumbbell Chest Press", target_muscle="Chest", equipment="Dumbbells", difficulty="Intermediate", instructions="Lie on bench, press dumbbells up overhead until arms extend.", calories_per_min=8.5),
            Exercise(name="Tricep Dips", target_muscle="Arms", equipment="Bodyweight", difficulty="Beginner", instructions="Use bench edge, lower hips by bending elbows to 90 degrees.", calories_per_min=6.0),
            Exercise(name="Bicep Curls", target_muscle="Arms", equipment="Dumbbells", difficulty="Beginner", instructions="Keep elbows close to torso, curl weights while contracting biceps.", calories_per_min=5.5),
            
            # Legs & Core
            Exercise(name="Bodyweight Squats", target_muscle="Legs", equipment="Bodyweight", difficulty="Beginner", instructions="Feet shoulder-width apart, sit back into hips, return to standing.", calories_per_min=8.0),
            Exercise(name="Walking Lunges", target_muscle="Legs", equipment="Bodyweight", difficulty="Intermediate", instructions="Step forward, lower rear knee toward floor, push through front heel.", calories_per_min=9.0),
            Exercise(name="Plank Hold", target_muscle="Core", equipment="Bodyweight", difficulty="Beginner", instructions="Hold forearm plank, maintaining flat back and engaged core.", calories_per_min=5.0),
            Exercise(name="Russian Twists", target_muscle="Core", equipment="Bodyweight", difficulty="Intermediate", instructions="Sit with knees bent, lean back slightly, rotate torso side to side.", calories_per_min=7.5),
            
            # Back & Full Body
            Exercise(name="Dumbbell Rows", target_muscle="Back", equipment="Dumbbells", difficulty="Intermediate", instructions="Hinge at hips, pull dumbbell to ribs squeezing shoulder blade.", calories_per_min=7.5),
            Exercise(name="Jumping Jacks", target_muscle="Full Body", equipment="Bodyweight", difficulty="Beginner", instructions="Jump spreading legs and raising arms overhead rhythmically.", calories_per_min=10.0),
            Exercise(name="Burpees", target_muscle="Full Body", equipment="Bodyweight", difficulty="Advanced", instructions="Drop into plank, perform push-up, jump feet in, explosion jump.", calories_per_min=12.0),
            Exercise(name="Mountain Climbers", target_muscle="Full Body", equipment="Bodyweight", difficulty="Intermediate", instructions="High plank position, rapidly drive knees toward chest alternately.", calories_per_min=11.0)
        ]
        db.session.bulk_save_objects(exercises)
        db.session.commit()

    # Seed Wellness Sessions if empty
    if WellnessSession.query.count() == 0:
        sessions = [
            WellnessSession(
                title="Mindful Morning Reset",
                type="Meditation",
                duration_minutes=5,
                difficulty="Beginner",
                description="Start your day with focused clarity, gentle breathwork, and positive intent.",
                media_url="https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3"
            ),
            WellnessSession(
                title="Box Breathing Technique",
                type="Breathing",
                duration_minutes=4,
                difficulty="Beginner",
                description="4 seconds inhale, 4 seconds hold, 4 seconds exhale, 4 seconds hold to quickly reduce acute stress.",
                media_url="https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3"
            ),
            WellnessSession(
                title="Post-Workout Muscle Decompress",
                type="Mindfulness",
                duration_minutes=8,
                difficulty="Intermediate",
                description="Guided body scan meditation designed to release physical tension after intense exercise.",
                media_url="https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3"
            ),
            WellnessSession(
                title="Deep Sleep Wind Down",
                type="Meditation",
                duration_minutes=10,
                difficulty="Beginner",
                description="Relaxing evening audio session with soothing ambient soundscapes to promote deep restful sleep.",
                media_url="https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3"
            )
        ]
        db.session.bulk_save_objects(sessions)
        db.session.commit()

from app import db
from datetime import datetime
import json

class Exercise(db.Model):
    __tablename__ = 'exercises'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    target_muscle = db.Column(db.String(50), nullable=False) # e.g., Chest, Legs, Core, Back, Arms, Full Body
    equipment = db.Column(db.String(50), default='Bodyweight') # Bodyweight, Dumbbells, Resistance Bands, Barbell
    difficulty = db.Column(db.String(32), default='Beginner')  # Beginner, Intermediate, Advanced
    instructions = db.Column(db.Text, nullable=True)
    calories_per_min = db.Column(db.Float, default=7.0)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "target_muscle": self.target_muscle,
            "equipment": self.equipment,
            "difficulty": self.difficulty,
            "instructions": self.instructions,
            "calories_per_min": self.calories_per_min
        }

class Routine(db.Model):
    __tablename__ = 'routines'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    target_muscle = db.Column(db.String(50), nullable=False)
    difficulty_level = db.Column(db.String(32), default='Intermediate')
    total_duration = db.Column(db.Integer, default=20) # in minutes
    exercises_json = db.Column(db.Text, nullable=False) # JSON list of exercise items
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def get_exercises(self):
        try:
            return json.loads(self.exercises_json)
        except Exception:
            return []

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "target_muscle": self.target_muscle,
            "difficulty_level": self.difficulty_level,
            "total_duration": self.total_duration,
            "exercises": self.get_exercises(),
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class WorkoutLog(db.Model):
    __tablename__ = 'workout_logs'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    workout_name = db.Column(db.String(100), nullable=False)
    target_muscle = db.Column(db.String(50), default='Full Body')
    duration_minutes = db.Column(db.Integer, nullable=False)
    calories_burned = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "date": self.date.strftime("%Y-%m-%d %H:%M:%S") if self.date else None,
            "workout_name": self.workout_name,
            "target_muscle": self.target_muscle,
            "duration_minutes": self.duration_minutes,
            "calories_burned": self.calories_burned
        }

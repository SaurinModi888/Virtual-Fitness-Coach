from app import db, bcrypt
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    age = db.Column(db.Integer, default=25)
    weight = db.Column(db.Float, default=70.0)  # in kg
    height = db.Column(db.Float, default=170.0) # in cm
    fitness_level = db.Column(db.String(32), default='Beginner')
    goal = db.Column(db.String(64), default='General Fitness')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    workouts = db.relationship('WorkoutLog', backref='user', lazy=True, cascade='all, delete-orphan')
    routines = db.relationship('Routine', backref='user', lazy=True, cascade='all, delete-orphan')
    mood_logs = db.relationship('MoodLog', backref='user', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    @property
    def bmi(self):
        if self.height and self.height > 0 and self.weight:
            height_m = self.height / 100.0
            return round(self.weight / (height_m * height_m), 1)
        return 22.0

    @property
    def bmi_category(self):
        bmi_val = self.bmi
        if bmi_val < 18.5:
            return "Underweight"
        elif 18.5 <= bmi_val < 25.0:
            return "Normal weight"
        elif 25.0 <= bmi_val < 30.0:
            return "Overweight"
        else:
            return "Obese"

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "age": self.age,
            "weight": self.weight,
            "height": self.height,
            "fitness_level": self.fitness_level,
            "goal": self.goal,
            "bmi": self.bmi,
            "bmi_category": self.bmi_category,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

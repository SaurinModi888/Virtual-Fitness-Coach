from app import db
from datetime import datetime

class WellnessSession(db.Model):
    __tablename__ = 'wellness_sessions'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    type = db.Column(db.String(50), nullable=False) # Meditation, Breathing, Mindfulness
    duration_minutes = db.Column(db.Integer, default=5)
    difficulty = db.Column(db.String(32), default='Beginner')
    description = db.Column(db.Text, nullable=True)
    media_url = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "type": self.type,
            "duration_minutes": self.duration_minutes,
            "difficulty": self.difficulty,
            "description": self.description,
            "media_url": self.media_url
        }

class MoodLog(db.Model):
    __tablename__ = 'mood_logs'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    mood_rating = db.Column(db.Integer, nullable=False) # 1 (Very Low) to 5 (Excellent)
    stress_level = db.Column(db.String(32), default='Moderate') # Low, Moderate, High
    note = db.Column(db.String(255), nullable=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "mood_rating": self.mood_rating,
            "stress_level": self.stress_level,
            "note": self.note,
            "date": self.date.strftime("%Y-%m-%d %H:%M:%S") if self.date else None
        }

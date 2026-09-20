import os
from datetime import timedelta
from dotenv import load_dotenv

BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
load_dotenv(os.path.join(BASE_DIR, '.env'))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'virtual-fitness-coach-secret-key-2026')
    
    # SQLite Database Configuration
    INSTANCE_DIR = os.path.join(BASE_DIR, 'instance')
    os.makedirs(INSTANCE_DIR, exist_ok=True)
    
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL', 
        f"sqlite:///{os.path.join(INSTANCE_DIR, 'fitness_coach.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-super-secret-fitness-key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    
    # Gemini AI Configuration
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')


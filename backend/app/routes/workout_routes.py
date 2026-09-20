from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from app.models.workout import Exercise, Routine, WorkoutLog
from app.services.llm_service import LLMRecommendationEngine
from flask_jwt_extended import jwt_required, get_jwt_identity
import json

workout_bp = Blueprint('workout', __name__)
llm_engine = LLMRecommendationEngine()

@workout_bp.route('/exercises', methods=['GET'])
def get_exercises():
    target_muscle = request.args.get('target_muscle')
    query = Exercise.query
    if target_muscle:
        query = query.filter_by(target_muscle=target_muscle)
    exercises = query.all()
    return jsonify([ex.to_dict() for ex in exercises]), 200

@workout_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_workout():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json() or {}
    target_muscle = data.get('target_muscle', 'Full Body')
    equipment = data.get('equipment', 'Bodyweight')
    duration_minutes = int(data.get('duration_minutes', 20))
    fitness_level = data.get('fitness_level', user.fitness_level)

    routine_data = llm_engine.generate_routine(
        user_profile=user.to_dict(),
        target_muscle=target_muscle,
        equipment=equipment,
        duration_minutes=duration_minutes,
        fitness_level=fitness_level
    )

    # Save generated routine into DB
    routine = Routine(
        user_id=user.id,
        title=routine_data.get('title', f"{target_muscle} Routine"),
        target_muscle=target_muscle,
        difficulty_level=fitness_level,
        total_duration=duration_minutes,
        exercises_json=json.dumps(routine_data.get('exercises', []))
    )
    db.session.add(routine)
    db.session.commit()

    res_dict = routine.to_dict()
    res_dict['estimated_calories'] = routine_data.get('estimated_calories', duration_minutes * 8)
    return jsonify(res_dict), 201

@workout_bp.route('/routines', methods=['GET'])
@jwt_required()
def get_routines():
    current_user_id = get_jwt_identity()
    routines = Routine.query.filter_by(user_id=int(current_user_id)).order_by(Routine.created_at.desc()).all()
    return jsonify([r.to_dict() for r in routines]), 200

@workout_bp.route('/log', methods=['POST'])
@jwt_required()
def log_workout():
    current_user_id = get_jwt_identity()
    data = request.get_json() or {}

    workout_name = data.get('workout_name', 'Quick Workout')
    target_muscle = data.get('target_muscle', 'Full Body')
    duration_minutes = int(data.get('duration_minutes', 20))
    calories_burned = int(data.get('calories_burned', duration_minutes * 8))

    log = WorkoutLog(
        user_id=int(current_user_id),
        workout_name=workout_name,
        target_muscle=target_muscle,
        duration_minutes=duration_minutes,
        calories_burned=calories_burned
    )
    db.session.add(log)
    db.session.commit()

    return jsonify({
        "message": "Workout session logged successfully",
        "workout_log": log.to_dict()
    }), 201

@workout_bp.route('/history', methods=['GET'])
@jwt_required()
def get_workout_history():
    current_user_id = get_jwt_identity()
    logs = WorkoutLog.query.filter_by(user_id=int(current_user_id)).order_by(WorkoutLog.date.desc()).all()
    return jsonify([l.to_dict() for l in logs]), 200

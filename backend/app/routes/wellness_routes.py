from flask import Blueprint, request, jsonify
from app import db
from app.models.wellness import WellnessSession, MoodLog
from flask_jwt_extended import jwt_required, get_jwt_identity

wellness_bp = Blueprint('wellness', __name__)

@wellness_bp.route('/sessions', methods=['GET'])
def get_wellness_sessions():
    session_type = request.args.get('type')
    query = WellnessSession.query
    if session_type:
        query = query.filter_by(type=session_type)
    sessions = query.all()
    return jsonify([s.to_dict() for s in sessions]), 200

@wellness_bp.route('/log-mood', methods=['POST'])
@jwt_required()
def log_mood():
    current_user_id = get_jwt_identity()
    data = request.get_json() or {}

    mood_rating = int(data.get('mood_rating', 3))
    stress_level = data.get('stress_level', 'Moderate')
    note = data.get('note', '')

    mood_log = MoodLog(
        user_id=int(current_user_id),
        mood_rating=mood_rating,
        stress_level=stress_level,
        note=note
    )
    db.session.add(mood_log)
    db.session.commit()

    return jsonify({
        "message": "Mood logged successfully",
        "mood_log": mood_log.to_dict()
    }), 201

@wellness_bp.route('/mood-history', methods=['GET'])
@jwt_required()
def get_mood_history():
    current_user_id = get_jwt_identity()
    logs = MoodLog.query.filter_by(user_id=int(current_user_id)).order_by(MoodLog.date.desc()).all()
    return jsonify([l.to_dict() for l in logs]), 200

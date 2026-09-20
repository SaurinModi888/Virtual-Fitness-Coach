from flask import Blueprint, jsonify
from app.services.analytics_engine import AnalyticsEngine
from flask_jwt_extended import jwt_required, get_jwt_identity

tracker_bp = Blueprint('tracker', __name__)

@tracker_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_progress_summary():
    current_user_id = get_jwt_identity()
    summary = AnalyticsEngine.get_user_summary(int(current_user_id))
    return jsonify(summary), 200

@tracker_bp.route('/charts', methods=['GET'])
@jwt_required()
def get_progress_charts():
    current_user_id = get_jwt_identity()
    charts = AnalyticsEngine.get_chart_data(int(current_user_id))
    return jsonify(charts), 200

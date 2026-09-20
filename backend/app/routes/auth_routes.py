from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"message": "Username, email, and password are required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists"}), 409

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 409

    user = User(
        username=username,
        email=email,
        age=int(data.get('age', 25)),
        weight=float(data.get('weight', 70.0)),
        height=float(data.get('height', 170.0)),
        fitness_level=data.get('fitness_level', 'Beginner'),
        goal=data.get('goal', 'General Fitness')
    )
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "message": "User registered successfully",
        "access_token": access_token,
        "user": user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email_or_username = data.get('email') or data.get('username')
    password = data.get('password')

    if not email_or_username or not password:
        return jsonify({"message": "Credentials required"}), 400

    user = User.query.filter(
        (User.email == email_or_username) | (User.username == email_or_username)
    ).first()

    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid email/username or password"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user": user.to_dict()
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify(user.to_dict()), 200

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json() or {}
    if 'age' in data: user.age = int(data['age'])
    if 'weight' in data: user.weight = float(data['weight'])
    if 'height' in data: user.height = float(data['height'])
    if 'fitness_level' in data: user.fitness_level = data['fitness_level']
    if 'goal' in data: user.goal = data['goal']

    db.session.commit()
    return jsonify({
        "message": "Profile updated successfully",
        "user": user.to_dict()
    }), 200

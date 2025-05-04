from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.auth_service import unified_login, get_user_by_id

auth_bp = Blueprint('auth', __name__)

from services.auth_service import register_user

@auth_bp.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "Auth blueprint is working"})

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    return unified_login(data)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    return register_user(data)

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user_data = get_user_by_id(user_id)
    if user_data:
        return jsonify(user_data), 200
    return jsonify({"error": "User not found"}), 404

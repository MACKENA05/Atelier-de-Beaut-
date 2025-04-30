from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, unset_jwt_cookies
from services.auth_service import unified_login, register_user, get_user_by_id

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Authenticate any user (customer, admin, etc.)"""
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 415
    data = request.get_json()
    return unified_login(data)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new customer user"""
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 415
    data = request.get_json()
    return register_user(data)

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    """Get current authenticated user info"""
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id)
    if user:
        return jsonify({"user": user.to_dict()})
    else:
        return jsonify({"error": "User not found"}), 404

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout user by clearing JWT cookies"""
    response = jsonify({"msg": "Logout successful"})
    unset_jwt_cookies(response)
    return response, 200

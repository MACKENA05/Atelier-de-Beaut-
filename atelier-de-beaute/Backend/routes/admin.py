from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from models.user import User
from services.adminuser_service import create_user_as_admin, get_all_users, update_user, delete_user
from utils.decorators import admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@admin_required
def get_all_users_route():
    """Get paginated list of all users (Admin only)"""
    user_id = get_jwt_identity()
    current_user = User.query.get(int(user_id))
    if not current_user:
        return jsonify({"error": "Invalid user"}), 401
    result, status_code = get_all_users(current_user, request.args)
    return jsonify(result), status_code

@admin_bp.route('/users', methods=['POST'])
@jwt_required()
@admin_required
def admin_create_user():
    """Create a new user (Admin only)"""
    user_id = get_jwt_identity()
    creator = User.query.get(int(user_id))
    if not creator:
        return jsonify({"error": "Invalid user"}), 401
    data = request.get_json()
    result, status_code = create_user_as_admin(creator, data)
    return jsonify(result), status_code

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_user_route(user_id):
    """Update a user’s information (Admin only)"""
    user_id_jwt = get_jwt_identity()
    current_user = User.query.get(int(user_id_jwt))
    if not current_user:
        return jsonify({"error": "Invalid user"}), 401
    data = request.get_json()
    result, status_code = update_user(current_user, user_id, data)
    return jsonify(result), status_code

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_user_route(user_id):
    """Delete a user account (Admin only)"""
    user_id_jwt = get_jwt_identity()
    current_user = User.query.get(int(user_id_jwt))
    if not current_user:
        return jsonify({"error": "Invalid user"}), 401
    data = request.get_json() or {}
    result, status_code = delete_user(current_user, user_id, data)
    return jsonify(result), status_code

@admin_bp.route('/admin-dashboard')
@jwt_required()
@admin_required
def admin_dashboard():
    """Admin dashboard access"""
    claims = get_jwt()
    if claims.get('role') != 'admin':
        return jsonify({"error": "Admin role required"}), 403
    return jsonify({"message": "Welcome to the admin panel!"}), 200
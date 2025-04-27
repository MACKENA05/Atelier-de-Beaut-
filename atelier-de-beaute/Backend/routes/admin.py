from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User
from services.adminuser_service import create_user_as_admin
from services.admin_service import admin_login
from utils.decorators import admin_required,manager_required,sales_rep_required


admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_all_users():
    """Get all users (Admin only)"""
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

@admin_bp.route('/users', methods=['POST'])
@jwt_required()
@admin_required
def admin_create_user():
    creator = User.query.get(get_jwt_identity()['id'])
    data = request.get_json()
    result, status_code = create_user_as_admin(creator, data)
    return jsonify(result), status_code


@admin_bp.route('/admin/dashboard')
@jwt_required()
@admin_required
def admin_dashboard():
    current_user = get_jwt_identity()
    
    if current_user['role'] != 'admin':
        return jsonify({"error": "Admin role required"}), 403
    
    return jsonify({"message": "Welcome to the admin panel!"}), 200

@admin_bp.route('/login', methods=['POST'])
def admin_login_route():
    """Endpoint for admin authentication"""
    if not request.is_json:
        return jsonify({"error": "JSON content type required"}), 415
    return admin_login()




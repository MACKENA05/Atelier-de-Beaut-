from flask import Blueprint, request, jsonify,make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User
from services.adminuser_service import AdminUserService
from services.admin_service import admin_login
from schemas.user import UserUpdateSchema, UserDeleteSchema
from utils.decorators import admin_required


admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['POST'])
@jwt_required()
@admin_required
def admin_create_user():
    def admin_create_user():
    # Get identity and ensure proper type handling
        identity = get_jwt_identity()
        if not identity or 'id' not in identity:
            return jsonify({"error": "Invalid token format"}), 401
        
        # Convert ID to string if needed
        creator = User.query.get(str(identity['id']))
        if not creator:
            return jsonify({"error": "User not found"}), 404
            
        data = request.get_json()
        result, status_code = AdminUserService.create_user_as_admin(creator, data)
        return make_response(result), status_code
    
@admin_bp.route('/dashboard')
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

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@admin_required
def get_all_users():
    try:
        current_user = User.query.get(get_jwt_identity()['id'])
        if not current_user:
            return jsonify({"error": "User not found"}), 404
            
        result, status_code = AdminUserService.get_all_users(current_user, request.args)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_user(user_id):
    # Get current user object
    current_user = User.query.get(get_jwt_identity()['id'])
    if not current_user:
        return jsonify({"error": "Current user not found"}), 404

    # Validate request
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    # Call service
    result, status_code = AdminUserService.update_user(
        current_user=current_user,
        user_id=user_id,
        data=request.get_json()
    )
    return jsonify(result), status_code

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_user(user_id):
    current_user = User.query.get(get_jwt_identity()['id'])
    if not current_user:
        return jsonify({"error": "User not found"}), 404
    
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400
        
    result, status_code = AdminUserService.delete_user(current_user, user_id, request.get_json())
    return jsonify(result), status_code





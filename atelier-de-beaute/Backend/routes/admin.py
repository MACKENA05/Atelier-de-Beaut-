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




# # Product Management Endpoints
# @admin_bp.route('/products', methods=['POST'])
# @manager_required  # Both admin and manager can access
# def create_product():
#     """Create new product (Admin or Manager)"""
#     data = request.get_json()
#     # ... product creation logic ...
#     return jsonify({"message": "Product created"}), 201

# @admin_bp.route('/products', methods=['POST'])
# @manager_required
# def create_product():
#     """Create product (Admin/Manager)"""
#     try:
#         data = product_schema.load(request.get_json())
#     except ValidationError as err:
#         return jsonify({"error": err.messages}), 400
    
#     new_product = Product(**data)
#     db.session.add(new_product)
#     db.session.commit()
#     return jsonify(product_schema.dump(new_product)), 201

# # Order Management Endpoints
# @admin_bp.route('/orders', methods=['GET'])
# @sales_rep_required  # Admin, manager, and sales-rep can access
# def get_all_orders():
#     """Get all orders (Admin/Manager/Sales Rep)"""
#     # ... order retrieval logic ...
#     return jsonify({"orders": []}), 200

# # System Settings Endpoint
# @admin_bp.route('/settings', methods=['PUT'])
# @admin_required  # Admin only
# def update_system_settings():
#     """Update system settings (Admin only)"""
#     data = request.get_json()
#     # ... settings update logic ...
#     return jsonify({"message": "Settings updated"}), 200



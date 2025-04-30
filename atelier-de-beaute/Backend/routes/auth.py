from flask import Blueprint, request, jsonify
from services.auth_service import unified_login, register_user

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

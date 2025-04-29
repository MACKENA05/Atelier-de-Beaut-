from flask import Blueprint, request, jsonify, session
from Backend.services.auth_service import register_user, login_user, logout_user, get_current_user
from Backend.utils.helpers import login_required

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    try:
        user = register_user(data)
        return jsonify({'message': 'User registered successfully', 'user': user}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    try:
        user = login_user(data)
        session['user_id'] = user['id']
        return jsonify({'message': 'Login successful', 'user': user}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 401

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    session.pop('user_id', None)
    return jsonify({'message': 'Logout successful'}), 200

@auth_bp.route('/me', methods=['GET'])
@login_required
def me():
    user = get_current_user()
    return jsonify({'user': user}), 200

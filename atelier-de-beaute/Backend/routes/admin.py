from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from services.adminuser_service import create_user_as_admin, get_all_users, get_user, update_user, delete_user
from utils.decorators import admin_required
import logging
import jwt

logger = logging.getLogger(__name__)
admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/users', methods=['POST'])
@jwt_required()
@admin_required
def create_user():
    """Admin creates a new user"""
    try:
        creator_id = get_jwt_identity()
        creator = User.query.get(creator_id)
        data = request.get_json()
        return create_user_as_admin(creator, data)
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid token in create_user from {request.remote_addr}: {str(e)}")
        return {"error": "Invalid token", "details": str(e), "status": 401}, 401
    except Exception as e:
        logger.error(f"Error in create_user from {request.remote_addr}: {str(e)}")
        return {"error": "Server error", "details": str(e), "status": 500}, 500

@admin_bp.route('/admin/users', methods=['GET'])
@jwt_required()
@admin_required
def list_users():
    """Admin retrieves paginated list of users"""
    try:
        creator_id = get_jwt_identity()
        creator = User.query.get(creator_id)
        query_args = request.args
        return get_all_users(creator, query_args)
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid token in list_users from {request.remote_addr}: {str(e)}")
        return {"error": "Invalid token", "details": str(e), "status": 401}, 401
    except Exception as e:
        logger.error(f"Error in list_users from {request.remote_addr}: {str(e)}")
        return {"error": "Server error", "details": str(e), "status": 500}, 500

@admin_bp.route('/admin/users/<int:user_id>', methods=['GET'])
@jwt_required()
@admin_required
def get_single_user(user_id):
    """Admin retrieves a single user"""
    try:
        creator_id = get_jwt_identity()
        creator = User.query.get(creator_id)
        return get_user(creator, user_id)
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid token in get_single_user from {request.remote_addr}: {str(e)}")
        return {"error": "Invalid token", "details": str(e), "status": 401}, 401
    except Exception as e:
        logger.error(f"Error in get_single_user from {request.remote_addr}: {str(e)}")
        return {"error": "Server error", "details": str(e), "status": 500}, 500

@admin_bp.route('/admin/users/<int:user_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_single_user(user_id):
    """Admin updates a user"""
    try:
        creator_id = get_jwt_identity()
        creator = User.query.get(creator_id)
        data = request.get_json()
        return update_user(creator, user_id, data)
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid token in update_single_user from {request.remote_addr}: {str(e)}")
        return {"error": "Invalid token", "details": str(e), "status": 401}, 401
    except Exception as e:
        logger.error(f"Error in update_single_user from {request.remote_addr}: {str(e)}")
        return {"error": "Server error", "details": str(e), "status": 500}, 500

@admin_bp.route('/admin/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_single_user(user_id):
    """Admin deletes a user"""
    try:
        creator_id = get_jwt_identity()
        creator = User.query.get(creator_id)
        data = request.get_json() or {}
        return delete_user(creator, user_id, data)
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid token in delete_single_user from {request.remote_addr}: {str(e)}")
        return {"error": "Invalid token", "details": str(e), "status": 401}, 401
    except Exception as e:
        logger.error(f"Error in delete_single_user from {request.remote_addr}: {str(e)}")
        return {"error": "Server error", "details": str(e), "status": 500}, 500
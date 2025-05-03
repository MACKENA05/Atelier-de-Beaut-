from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import jsonify
from app import db
from models.user import User, UserRole
from app import db
from typing import Tuple, Dict, Any
import string
import secrets
from flask import request, jsonify, current_app
from flask_jwt_extended import get_jwt_identity
import jwt
from schemas.user import AdminUserCreateSchema, AdminUserUpdateSchema, UserResponseSchema
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
import logging
import marshmallow

logger = logging.getLogger(__name__)

def generate_temp_password(length: int = 12) -> str:
    """Generate secure random temporary password"""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def create_user_as_admin(creator: User, user_data: dict) -> Tuple[Dict[str, Any], int]:
    """Admin creates user with role management and temp passwords."""
    try:
        if creator is None:
            logger.warning(f"Invalid user creation attempt from {request.remote_addr}: No user found for JWT identity")
            return {"error": "Invalid or missing authentication token", "details": {}, "status": 401}, 401

        if creator.role != UserRole.ADMIN:
            logger.warning(f"Unauthorized user creation attempt by {creator.username} from {request.remote_addr}")
            return {"error": "Only admins can add users", "details": {}, "status": 403}, 403

        schema = AdminUserCreateSchema()
        errors = schema.validate(user_data)
        if errors:
            logger.warning(f"Validation failed for user creation by {creator.username} from {request.remote_addr}: {errors}")
            return {"error": "Validation failed", "details": errors, "status": 400}, 400

        requested_role = UserRole.validate(user_data['role'])
        
        phone = user_data.get('phone')
        if phone and (not phone.isdigit() or len(phone) != 10):
            logger.warning(f"Invalid phone number in user creation by {creator.username} from {request.remote_addr}")
            return {"error": "Phone number must be 10 digits", "details": {}, "status": 400}, 400

        new_user = User(
            username=user_data['username'],
            email=user_data['email'].lower(),
            first_name=user_data.get('first_name', ''),
            last_name=user_data.get('last_name', ''),
            phone=phone,
            role=requested_role,
            is_active=user_data.get('is_active', True)
        )

        password = user_data.get('password') or generate_temp_password()
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        response = {
            "message": "User created successfully",
            "user": {
                "id": new_user.id,
                "username": new_user.username,
                "email": new_user.email,
                "phone": new_user.phone,
                "role": new_user.role.value,
                "is_active": new_user.is_active
            }
        }

        if 'password' not in user_data:
            response['temporary_password'] = password

        logger.info(f"User {creator.username} created user {new_user.username} from {request.remote_addr}")
        return response, 201

    except jwt.InvalidTokenError:
        logger.warning(f"Invalid token in user creation attempt from {request.remote_addr}")
        return {"error": "Invalid or missing authentication token", "details": {}, "status": 401}, 401
    except ValueError as e:
        return {"error": str(e), "details": {}, "status": 400}, 400
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Database error in user creation by {creator.username} from {request.remote_addr}: {str(e)}", exc_info=True)
        return {"error": "Database error", "details": str(e), "status": 500}, 500
    except Exception as e:
        db.session.rollback()
        logger.error(f"Server error in user creation by {creator.username} from {request.remote_addr}: {str(e)}", exc_info=True)
        return {"error": "Server error", "details": str(e), "status": 500}, 500

def get_all_users(current_user: User, query_args: dict) -> Tuple[Dict[str, Any], int]:
    try:
        # Authorization check
        if current_user.role != UserRole.ADMIN:
            logger.warning(f"Unauthorized user list access attempt by {current_user.username}")
            return {"error": "Only admins can view user lists"}, 403

        # Ensure pagination parameters are integers and within bounds
        page = max(1, int(query_args.get('page', 1)))
        per_page = min(max(1, int(query_args.get('per_page', 10))), 100)  # Clamp between 1-100

        # Debug log the received parameters
        logger.debug(f"Pagination params - page: {page}, per_page: {per_page}")

        # Get paginated results
        users_query = User.query.filter(User.deleted_at == None)
        users = users_query.order_by(User.created_at.desc()).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )

        # Verify pagination is working
        logger.debug(f"Total items: {users.total}, Items on page: {len(users.items)}")

        response = {
            "users": UserResponseSchema(many=True).dump(users.items),
            "pagination": {
                "total": users.total,
                "pages": users.pages,
                "current_page": users.page,
                "per_page": users.per_page,
                "has_next": users.has_next,
                "has_prev": users.has_prev
            }
        }

        return response, 200

    except ValueError as ve:
        logger.error(f"Invalid pagination parameters: {ve}")
        return {"error": "Invalid pagination parameters"}, 400
    except Exception as e:
        logger.error(f"Error in get_all_users: {str(e)}", exc_info=True)
        return {"error": "Server error"}, 500

def get_user(current_user: User, user_id: int) -> Tuple[Dict[str, Any], int]:
    """Get a single active user by ID (excluding soft-deleted)"""
    try:
        if current_user.role != UserRole.ADMIN:
            logger.warning(f"Unauthorized user access attempt by {current_user.username} for user ID {user_id} from {request.remote_addr}")
            return {"error": "Only admins can view user details", "details": {}, "status": 403}, 403

        user = User.query.filter(User.id == user_id, User.deleted_at == None).first()
        if not user:
            logger.warning(f"User ID {user_id} not found or deleted, requested by {current_user.username} from {request.remote_addr}")
            return {"error": "User not found or deleted", "details": {}, "status": 404}, 404

        logger.info(f"User {current_user.username} retrieved user ID {user_id} from {request.remote_addr}")
        return {
            "user": UserResponseSchema().dump(user)
        }, 200

    except Exception as e:
        logger.error(f"Error retrieving user ID {user_id} by {current_user.username} from {request.remote_addr}: {str(e)}", exc_info=True)
        return {"error": "Server error", "details": str(e), "status": 500}, 500

def update_user(current_user: User, user_id: int, data: dict) -> Tuple[Dict[str, Any], int]:
    """Update user information"""
    try:
        user = User.query.get_or_404(user_id)

        if current_user.role != UserRole.ADMIN:
            logger.warning(f"Unauthorized user update attempt by {current_user.username} from {request.remote_addr}")
            return {"error": "Only admins can update users", "details": {}, "status": 403}, 403

        try:
            version = getattr(marshmallow, '__version__', '0.0.0')
            major_version = int(version.split('.')[0]) if version != '0.0.0' else 0
            if major_version < 3:
                return {"error": "Marshmallow version 3.0.0 or higher required for context support", "details": {}, "status": 500}, 500
        except Exception as e:
            logger.error(f"Failed to check Marshmallow version from {request.remote_addr}: {str(e)}")
            return {"error": "Marshmallow version check failed", "details": str(e), "status": 500}, 500

        schema = AdminUserUpdateSchema()
        schema.context = {'user_id': user_id}
        errors = schema.validate(data)
        if errors:
            return {"error": "Validation failed", "details": errors, "status": 400}, 400

        for field in ['username', 'email', 'is_active', 'first_name', 'last_name', 'phone']:
            if field in data:
                setattr(user, field, data[field])

        if 'role' in data:
            requested_role = UserRole(data['role'])
            user.role = requested_role

        db.session.commit()

        logger.info(f"User {current_user.username} updated user ID {user_id} from {request.remote_addr}")
        return {
            "message": "User updated successfully",
            "user": UserResponseSchema().dump(user)
        }, 200

    except ValueError as e:
        db.session.rollback()
        logger.error(f"Invalid data in user update by {current_user.username} from {request.remote_addr}: {str(e)}")
        return {"error": "Invalid data", "details": str(e), "status": 400}, 400
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Database error in user update by {current_user.username} from {request.remote_addr}: {str(e)}", exc_info=True)
        return {"error": "Database error", "details": str(e), "status": 500}, 500
    except Exception as e:
        db.session.rollback()
        logger.error(f"Server error in user update by {current_user.username} from {request.remote_addr}: {str(e)}", exc_info=True)
        return {"error": "Server error", "details": str(e), "status": 500}, 500

def delete_user(current_user: User, user_id: int, data: dict = None) -> Tuple[Dict[str, Any], int]:
    """Soft-delete a user account and return updated user details"""
    try:
        if current_user.role != UserRole.ADMIN:
            logger.warning(f"Unauthorized user deletion attempt by {current_user.username} from {request.remote_addr}")
            return {"error": "Only admins can delete users", "details": {}, "status": 403}, 403

        user = User.query.filter(User.id == user_id, User.deleted_at == None).first()
        if not user:
            logger.warning(f"User ID {user_id} not found or already deleted, deletion attempted by {current_user.username} from {request.remote_addr}")
            return {"error": "User not found or already deleted", "details": {}, "status": 404}, 404

        if user.id == current_user.id:
            logger.warning(f"Self-deletion attempt by {current_user.username} from {request.remote_addr}")
            return {"error": "Cannot delete your own account", "details": {}, "status": 403}, 403

        user.is_active = False
        user.deleted_at = datetime.utcnow()
        db.session.commit()

        logger.info(f"User {current_user.username} deleted user ID {user_id} from {request.remote_addr}")
        return {
            "message": "User deleted successfully",
            "user": UserResponseSchema().dump(user)
        }, 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error in user deletion by {current_user.username} from {request.remote_addr}: {str(e)}", exc_info=True)
        return {"error": "Server error", "details": str(e), "status": 500}, 500
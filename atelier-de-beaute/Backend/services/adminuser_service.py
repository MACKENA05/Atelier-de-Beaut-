from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import jsonify
from app import db
from models.user import User, UserRole
from app import db
from typing import Tuple, Dict, Any
from flask import request, jsonify, current_app
from flask_jwt_extended import get_jwt_identity
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
    schema = AdminUserCreateSchema()
    errors = schema.validate(user_data)
    if errors:
        return {"error": "Validation failed", "details": errors}, 400

    try:
        if creator.role != UserRole.ADMIN:
            return {"error": "Admin privileges required"}, 403

        requested_role = UserRole.validate(user_data['role'])
        
        phone = user_data.get('phone')
        if phone and (not phone.isdigit() or len(phone) != 10):
            return {"error": "Phone number must be 10 digits"}, 400

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

        logger.info(f"User {creator.username} created user {new_user.username}")
        return response, 201

    except ValueError as e:
        return {"error": str(e)}, 400
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Create user error: {str(e)}", exc_info=True)
        return {"error": "Database error", "details": str(e)}, 500
    except Exception as e:
        db.session.rollback()
        logger.error(f"Create user error: {str(e)}", exc_info=True)
        return {"error": f"Server error: {str(e)}"}, 500

@staticmethod
def get_all_users(current_user: User, query_args: dict) -> Tuple[Dict[str, Any], int]:
    """Get paginated list of all users"""
    try:
        if current_user.role != UserRole.ADMIN:
            return {"error": "Admin privileges required"}, 403

        page = query_args.get('page', 1, type=int)
        per_page = min(query_args.get('per_page', 10, type=int), 100)

        users = User.query.order_by(User.created_at.desc()).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )

        response = {
            "users": UserResponseSchema(many=True).dump(users.items),
            "pagination": {
                "total": users.total,
                "pages": users.pages,
                "current_page": users.page,
                "per_page": users.per_page
            }
        }

        logger.debug(f"User {current_user.username} retrieved {users.total} users for page {page}")
        return response, 200

    except Exception as e:
        logger.error(f"Error in get_all_users: {str(e)}", exc_info=True)
        return {"error": "Server error", "details": str(e)}, 500

@staticmethod
def update_user(current_user: User, user_id: int, data: dict) -> Tuple[Dict[str, Any], int]:
    """Update user information"""
    try:
        user = User.query.get_or_404(user_id)

        if current_user.role != UserRole.ADMIN:
            return {"error": "Admin privileges required"}, 403

        # Check Marshmallow version for context support
        if int(marshmallow.__version__.split('.')[0]) < 3:
            return {"error": "Marshmallow version 3.0.0 or higher required for context support"}, 500

        # Validate input with context
        schema = AdminUserUpdateSchema()
        schema.context = {'user_id': user_id}  # Set context directly
        errors = schema.validate(data)
        if errors:
            return {"error": "Validation failed", "details": errors}, 400

        for field in ['username', 'email', 'is_active', 'first_name', 'last_name', 'phone']:
            if field in data:
                setattr(user, field, data[field])

        if 'role' in data:
            requested_role = UserRole(data['role'])
            user.role = requested_role

        db.session.commit()

        logger.info(f"User {current_user.username} updated user ID {user_id}")
        return {
            "message": "User updated successfully",
            "user": UserResponseSchema().dump(user)
        }, 200

    except ValueError as e:
        db.session.rollback()
        logger.error(f"Update user error: {str(e)}", exc_info=True)
        return {"error": "Invalid data", "details": str(e)}, 400
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Update user error: {str(e)}", exc_info=True)
        return {"error": "Database error", "details": str(e)}, 500
    except Exception as e:
        db.session.rollback()
        logger.error(f"Update user error: {str(e)}", exc_info=True)
        return {"error": "Server error", "details": str(e)}, 500

@staticmethod
def delete_user(current_user: User, user_id: int, data: dict = None) -> Tuple[Dict[str, Any], int]:
    """Delete a user account"""
    try:
        if current_user.role != UserRole.ADMIN:
            return {"error": "Admin privileges required"}, 403

        user = User.query.get_or_404(user_id)

        if user.id == current_user.id:
            return {"error": "Cannot delete your own account"}, 403

        user.is_active = False
        user.deleted_at = datetime.utcnow()
        db.session.commit()

        logger.info(f"User {current_user.username} deleted user ID {user_id}")
        return {"message": "User deleted successfully"}, 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Delete user error: {str(e)}", exc_info=True)
        return {"error": "Server error", "details": str(e)}, 500
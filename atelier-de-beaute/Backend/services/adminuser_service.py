from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import jsonify
from app import db
from models.user import User, UserRole
from schemas.user import AdminUserCreateSchema, UserUpdateSchema, UserDeleteSchema, UserResponseSchema
import secrets
import string
from datetime import datetime
from typing import Tuple, Dict, Any
import logging
from sqlalchemy.exc import SQLAlchemyError

class AdminUserService:
    @staticmethod
    def generate_temp_password(length: int = 12) -> str:
        """Generate secure random temporary password with guaranteed complexity"""
        if length < 8:
            raise ValueError("Password length must be at least 8 characters")

        # Ensure password contains at least one of each character type
        uppercase = secrets.choice(string.ascii_uppercase)
        lowercase = secrets.choice(string.ascii_lowercase)
        digit = secrets.choice(string.digits)
        special = secrets.choice("!@#$%^&*")
        
        # Fill the rest with random characters
        remaining = ''.join(secrets.choice(string.ascii_letters + string.digits + "!@#$%^&*") 
                          for _ in range(length - 4))
        
        # Combine and shuffle
        password = uppercase + lowercase + digit + special + remaining
        return ''.join(secrets.SystemRandom().sample(password, len(password)))

    @staticmethod
    def create_user_as_admin(creator: User, user_data: dict) -> Tuple[Dict[str, Any], int]:
        """Admin creates user with role management and temp passwords."""
        try:
            # Validate input
            schema = AdminUserCreateSchema()
            errors = schema.validate(user_data)
            if errors:
                return {"error": "Invalid user data", "details": errors}, 400

            # Verify admin privileges
            if creator.role != UserRole.ADMIN:
                return {"error": "Admin privileges required"}, 403

            # Validate role assignment
            requested_role = UserRole(user_data['role'])
            if requested_role == UserRole.ADMIN and creator.role != UserRole.SUPER_ADMIN:
                return {"error": "Only super admins can create admin users"}, 403

            # Create user
            password = user_data.get('password') 
            if not password:
                try:
                    password = AdminUserService.generate_temp_password()
                except ValueError as e:
                    return {"error": str(e)}, 400
            
            new_user = User(
                username=user_data['username'],
                email=user_data['email'].lower(),
                first_name=user_data.get('first_name', ''),
                last_name=user_data.get('last_name', ''),
                phone=user_data.get('phone', ''),
                role=requested_role,
                is_active=user_data.get('is_active', True)
            )
            new_user.set_password(password)

            db.session.add(new_user)
            db.session.commit()

            # Prepare response
            response_data = {
                "message": "User created successfully",
                "user": UserResponseSchema().dump(new_user)
            }

            if 'password' not in user_data:
                response_data['temporary_password'] = password

            return response_data, 201

        except ValueError as e:
            db.session.rollback()
            return {"error": "Validation error", "details": str(e)}, 400
        except SQLAlchemyError as e:
            db.session.rollback()
            return {"error": "Database error", "details": str(e)}, 500
        except Exception as e:
            db.session.rollback()
            logging.error(f"Unexpected error in create_user_as_admin: {str(e)}", exc_info=True)
            return {"error": "Unexpected server error", "details": str(e)}, 500

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

            return {
                "users": UserResponseSchema(many=True).dump(users.items),
                "pagination": {
                    "total": users.total,
                    "pages": users.pages,
                    "current_page": users.page,
                    "per_page": users.per_page
                }
            }, 200

        except Exception as e:
            logging.error(f"Error in get_all_users: {str(e)}", exc_info=True)
            return {"error": "Server error", "details": str(e)}, 500

    @staticmethod
    def update_user(current_user: User, user_id: int, data: dict) -> Tuple[Dict[str, Any], int]:
        """Update user information"""
        try:
            # Get user to update
            user = User.query.get_or_404(user_id)

            # Verify permissions
            if current_user.role != UserRole.ADMIN:
                return {"error": "Admin privileges required"}, 403

            # Prevent modifying other admins unless super admin
            if (user.role == UserRole.ADMIN and 
                user.id != current_user.id and 
                current_user.role != UserRole.SUPER_ADMIN):
                return {"error": "Cannot modify other admin accounts"}, 403

            # Update basic fields
            for field in ['username', 'email', 'is_active']:
                if field in data:
                    setattr(user, field, data[field])

            # Handle role changes
            if 'role' in data:
                requested_role = UserRole(data['role'])
                if (requested_role == UserRole.ADMIN and 
                    current_user.role != UserRole.SUPER_ADMIN):
                    return {"error": "Only super admins can assign admin role"}, 403
                user.role = requested_role

            db.session.commit()

            return {
                "message": "User updated successfully",
                "user": UserResponseSchema().dump(user)
            }, 200

        except ValueError as e:
            db.session.rollback()
            return {"error": "Invalid data", "details": str(e)}, 400
        except SQLAlchemyError as e:
            db.session.rollback()
            return {"error": "Database error", "details": str(e)}, 500
        except Exception as e:
            db.session.rollback()
            # app.logger.error(f"Update user error: {str(e)}", exc_info=True)
            return {"error": "Server error", "details": str(e)}, 500
        
        
    @staticmethod
    def delete_user(current_user: User, user_id: int, data: dict) -> Tuple[Dict[str, Any], int]:
        """Delete a user account"""
        try:
            if current_user.role != UserRole.ADMIN:
                return {"error": "Admin privileges required"}, 403

            user = User.query.get_or_404(user_id)

            # Prevent self-deletion
            if user.id == current_user.id:
                return {"error": "Cannot delete your own account"}, 403

            # Prevent deleting other admins unless super admin
            if (user.role == UserRole.ADMIN and 
                current_user.role != UserRole.SUPER_ADMIN):
                return {"error": "Cannot delete admin accounts"}, 403

            # soft delete
            user.is_active = False
            user.deleted_at = datetime.utcnow()
            db.session.commit()
            return {"message": "User deleted successfully"}, 200

        except Exception as e:
            db.session.rollback()
            # app.logger.error(f"Delete user error: {str(e)}", exc_info=True)
            return {"error": "Server error", "details": str(e)}, 500
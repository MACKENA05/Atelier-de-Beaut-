import secrets
import string
from models.user import User, UserRole
from app import db
from typing import Tuple, Dict, Any
import secrets
import string
from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from schemas.user import AdminUserCreateSchema



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
        # Verify admin privileges
        if creator.role != UserRole.ADMIN:
            return {"error": "Admin privileges required"}, 403

        # Validate role hierarchy
        requested_role = UserRole.validate(user_data['role'])
        if requested_role == UserRole.ADMIN and creator.role != UserRole.ADMIN:
            return {"error": "Only super admins can create admin users"}, 403
        
        # Validate phone number if provided
        phone = user_data.get('phone')
        if phone:
            if not phone.isdigit() or len(phone) != 10:
                return {"error": "Phone number must be 10 digits"}, 400

        # Create user
        new_user = User(
            username=user_data['username'],
            email=user_data['email'].lower(),
            first_name=user_data.get('first_name', ''),
            last_name=user_data.get('last_name', ''),
            phone=phone,
            role=requested_role,
            is_active=user_data.get('is_active', True)
        )


        # Handle password generation
        password = user_data.get('password') or generate_temp_password()
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        # Prepare response
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

        # Include temp password only if generated
        if 'password' not in user_data:
            response['temporary_password'] = password

        return response, 201

    except ValueError as e:
        return {"error": str(e)}, 400
    except Exception as e:
        db.session.rollback()
        return {"error": f"Server error: {str(e)}"}, 500
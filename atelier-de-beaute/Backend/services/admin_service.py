from flask import request, jsonify, current_app
from flask_jwt_extended import create_access_token
from models.user import User, UserRole
from datetime import datetime, timezone,timedelta
from app import db
from schemas.user import AdminLoginSchema

def admin_login():
    schema = AdminLoginSchema()
    errors = schema.validate(request.get_json())
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 400

    data = request.get_json()
    
    try:
        # Finding admin_user by username or email
        user = User.query.filter(
            (User.username == data['username']) | 
            (User.email == data['username'].lower())
        ).first()

        # Authentication 
        if not user or not user.check_password(data['password']):
            return jsonify({"error": "Invalid credentials"}), 401

        # Role verification
        if user.role != UserRole.ADMIN:
            return jsonify({
                "error": "Admins only",
                "hint": "This endpoint is restricted to admin users only"
            }), 403

        if not user.is_active:
            return jsonify({
                "error": "Account deactivated",
                "hint": "Contact super admin for account reactivation"
            }), 403

        # Updating last login timestamp using function defined in models
        user.update_last_login()

        # Generates JWT token with admin claims
        access_token = create_access_token(
            identity={
                "id": user.id,
                "username": user.username,
                "role": user.role.value,
                "is_admin": True
            },
            expires_delta=timedelta(hours=1)  # expiry for admin tokens
        )

        return jsonify({
            "access_token": access_token,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role.value,
                "is_admin": True
            },
            "token_expiry": (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat()
        }), 200

    except Exception as e:
        # Log the error for security monitoring
        current_app.logger.error(f"Admin login error: {str(e)}")
        return jsonify({
            "error": "Authentication service unavailable",
            "hint": "Please try again later"
        }), 500
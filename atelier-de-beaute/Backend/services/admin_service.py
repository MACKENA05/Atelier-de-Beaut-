from flask import request, jsonify, current_app
from flask_jwt_extended import create_access_token
from models.user import User, UserRole
from datetime import datetime, timezone,timedelta
from app import db
from schemas.user import AdminLoginSchema

def admin_login():
    """Secure admin authentication with JWT token generation."""
    schema = AdminLoginSchema()
    errors = schema.validate(request.get_json())
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 400

    data = request.get_json()
    
    try:
        # Find admin user by username or email
        user = User.query.filter(
            (User.username == data['username']) | 
            (User.email == data['username'].lower())
        ).first()

        # Authentication checks
        if not user or not user.check_password(data['password']):
            return jsonify({"error": "Invalid credentials"}), 401

        # Role verification
        if user.role != UserRole.ADMIN:
            return jsonify({
                "error": "Admin privileges required",
                "hint": "This endpoint is restricted to admin users only"
            }), 403

        if not user.is_active:
            return jsonify({
                "error": "Account deactivated",
                "hint": "Contact super admin for account reactivation"
            }), 403

        # Update last login timestamp
        user.update_last_login()

        # Generate JWT token with admin claims
        access_token = create_access_token(
            identity={
                "id": user.id,
                "username": user.username,
                "role": user.role.value,
                "is_admin": True
            },
            expires_delta=timedelta(hours=1)  # Shorter expiry for admin tokens
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
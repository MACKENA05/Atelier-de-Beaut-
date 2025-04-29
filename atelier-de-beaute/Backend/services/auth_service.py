from datetime import datetime, timezone
from flask import jsonify
from flask_jwt_extended import create_access_token
from models.user import User, UserRole
from app import db
from email_validator import validate_email, EmailNotValidError
from schemas.user import LoginSchema, RegisterSchema, UserResponseSchema
import logging
from datetime import timedelta

# Set up logging for debugging
logger = logging.getLogger(__name__)

def unified_login(data: dict):
    """Authenticate any user (customer, admin, etc.) with role-specific token generation."""
    schema = LoginSchema()
    errors = schema.validate(data)
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 400

    user = User.query.filter(
        (User.username == data['username']) | 
        (User.email == data['username'].lower())
    ).filter(User.is_active == True, User.deleted_at == None).first()

    if not user or not user.check_password(data['password']):
        return jsonify({"error": "Invalid credentials"}), 401

    if not user.is_active:
        return jsonify({"error": "Account is inactive"}), 403

    user.update_last_login()

    # Prepare token claims based on role
    identity = str(user.id)
    claims = {
        "username": user.username,
        "role": user.role.value
    }
    
    # Add admin-specific claims if applicable
    if user.role == UserRole.ADMIN:
        claims["is_admin"] = True
    
    logger.debug(f"Generating login token with identity: {identity}, claims: {claims}")

    # Shorter expiry for admin tokens (1 hour), longer for others (24 hours)
    expiry = timedelta(hours=1) if user.role == UserRole.ADMIN else timedelta(hours=24)
    
    access_token = create_access_token(
        identity=identity,
        additional_claims=claims,
        expires_delta=expiry
    )

    # Prepare response
    response = {
        "access_token": access_token,
        "user": UserResponseSchema().dump(user),
        "token_expiry": (datetime.now(timezone.utc) + expiry).isoformat()
    }

    logger.info(f"User {user.username} logged in successfully")
    return jsonify(response), 200

def register_user(data: dict):
    """Register user with comprehensive validation"""
    schema = RegisterSchema()
    errors = schema.validate(data)
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 400

    try:
        valid_email = validate_email(data['email']).email.lower()
        new_user = User(
            username=data['username'],
            email=valid_email,
            first_name=data.get('first_name', '').strip(),
            last_name=data.get('last_name', '').strip(),
            phone=data.get('phone', '').strip() or None,
            role=UserRole.CUSTOMER
        )

        new_user.set_password(data['password'])
        
        db.session.add(new_user)
        db.session.commit()
        
        logger.info(f"New user registered: {new_user.username}")
        
        identity = str(new_user.id)
        claims = {
            "username": new_user.username,
            "role": new_user.role.value,
            "fresh": True
        }
        logger.debug(f"Generating register token with identity: {identity}, claims: {claims}")

        access_token = create_access_token(
            identity=identity,
            additional_claims=claims
        )
        
        return jsonify({
            "message": "User created successfully",
            "access_token": access_token,
            "user": UserResponseSchema().dump(new_user)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Register user error: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500
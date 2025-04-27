from datetime import datetime, timezone
from flask import jsonify
from flask_jwt_extended import create_access_token
from models.user import User, UserRole
from app import db
from email_validator import validate_email, EmailNotValidError
from schemas.user import LoginSchema, RegisterSchema, UserResponseSchema


def login_user(data: dict):
    """Authenticate user with enhanced validation"""
    schema = LoginSchema()
    errors = schema.validate(data)
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 400

    user = User.query.filter(
        (User.username == data['username']) | 
        (User.email == data['username'].lower())
    ).first()

    if not user or not user.check_password(data['password']):
        return jsonify({"error": "Invalid credentials"}), 401

    if not user.is_active:
        return jsonify({"error": "Account is inactive"}), 403

    user.update_last_login()
    
    access_token = create_access_token(identity={
        "id": user.id,
        "username": user.username,
        "role": user.role.value
    })

    return jsonify({
        "access_token": access_token,
        "user": UserResponseSchema().dump(user)
    }), 200

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
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            role=UserRole.CUSTOMER
        )
        new_user.set_password(data['password'])
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            "message": "User created successfully",
            "user": UserResponseSchema().dump(new_user)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
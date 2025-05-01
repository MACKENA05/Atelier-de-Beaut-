# utils/auth_utils.py
from flask_jwt_extended import get_jwt_identity
from flask import jsonify

def get_validated_identity():
    """Centralized identity validation"""
    identity = get_jwt_identity()
    
    # Basic validation
    if not identity or not isinstance(identity, dict):
        return None, jsonify({"error": "Invalid token format"}), 401
    
    # Ensure required fields exist and are proper types
    if 'sub' not in identity or not isinstance(identity['sub'], str):
        return None, jsonify({"error": "Invalid subject claim"}), 401
        
    if 'id' not in identity or not isinstance(identity['id'], (str, int)):
        return None, jsonify({"error": "Invalid user ID"}), 401
    
    # Convert ID to string if it's a number
    identity['id'] = str(identity['id'])
    
    return identity, None, None
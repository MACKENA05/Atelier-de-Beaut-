from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask import jsonify
from models.user import User, UserRole

# Role hierarchy mapping (updated to match UserRole enum values)
ROLE_HIERARCHY = {
    'admin': ['admin', 'manager', 'sales-representative', 'customer'],
    'manager': ['manager', 'sales-representative', 'customer'],
    'sales-representative': ['sales-representative'],
    'customer': ['customer']
}

def role_required(required_role: str):
    """Factory function to create role-based decorators"""
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            # Get the user ID from the identity
            user_id = get_jwt_identity()
            if not user_id:
                return jsonify({"error": "Invalid token"}), 401

            # Get the JWT claims to access additional_claims
            claims = get_jwt()
            user_role = claims.get('role')

            # Verify the role exists and is valid
            if not user_role:
                return jsonify({"error": "Role information missing in token"}), 401

            # Ensure the role hierarchy uses consistent role names
            if user_role not in ROLE_HIERARCHY.get(required_role, []):
                return jsonify({
                    "error": f"{required_role.replace('_', ' ').title()} privileges required",
                    "allowed_roles": ROLE_HIERARCHY.get(required_role, [])
                }), 403

            return fn(*args, **kwargs)
        return wrapper
    return decorator

# Specific role decorators
admin_required = role_required('admin')
manager_required = role_required('manager')
sales_representative_required = role_required('sales-representative') 
customer_required = role_required('customer')
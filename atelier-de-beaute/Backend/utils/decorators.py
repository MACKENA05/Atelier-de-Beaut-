from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import jsonify

# Role hierarchy mapping
ROLE_HIERARCHY = {
    'admin': ['admin'],
    'manager': ['admin', 'manager'],
    'sales-representative': ['admin', 'manager', 'sales-representative'],
    'customer': ['admin', 'manager', 'sales-representative', 'customer']
}

def role_required(required_role: str):
    """Factory function to create role-based decorators"""
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            current_user = get_jwt_identity()
            
            if current_user.get('role') not in ROLE_HIERARCHY[required_role]:
                return jsonify({
                    "error": f"{required_role.replace('-', ' ').title()} privileges required",
                    "allowed_roles": ROLE_HIERARCHY[required_role]
                }), 403
                
            return fn(*args, **kwargs)
        return wrapper
    return decorator

# Specific role decorators
admin_required = role_required('admin')
manager_required = role_required('manager')
sales_rep_required = role_required('sales-representative')
customer_required = role_required('customer')
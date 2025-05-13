from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask import jsonify
from models.user import UserRole
import logging

logger = logging.getLogger(__name__)

ROLE_HIERARCHY = {
    UserRole.ADMIN: [UserRole.ADMIN],
    UserRole.MANAGER: [UserRole.MANAGER],
    UserRole.SALES_REPRESENTATIVE: [UserRole.SALES_REPRESENTATIVE],
    UserRole.CUSTOMER: [UserRole.CUSTOMER]
}

def role_required(*required_roles: UserRole):
    """
    Decorator factory for role-based access control.
    Accepts multiple allowed roles and checks hierarchy.
    """
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            current_user = get_jwt_identity()
            claims = get_jwt()
            
            logger.debug(f"Validating role for user_id: {current_user}, claims: {claims}")
            
            if not current_user:
                logger.warning("Invalid token: missing identity")
                return jsonify({"error": "Invalid token: missing identity"}), 401
                
            if 'role' not in claims:
                logger.warning("Authorization information missing in token")
                return jsonify({"error": "Authorization information missing"}), 401
                
            try:
                user_role = UserRole(claims['role'].lower())
                logger.debug(f"User role: {user_role.value}")
            except ValueError:
                logger.warning(f"Invalid role in token: {claims.get('role')}")
                return jsonify({"error": "Invalid role in token"}), 401

            authorized = any(
                user_role in ROLE_HIERARCHY[required_role]
                for required_role in required_roles
            )
            
            if not authorized:
                logger.warning(f"Unauthorized access: user_role={user_role.value}, required_roles={[r.value for r in required_roles]}")
                return jsonify({
                    "error": "Insufficient privileges",
                    "required_roles": [role.value for role in required_roles],
                    "user_role": user_role.value
                }), 403

            logger.info(f"Authorized access for user_id: {current_user}, role: {user_role.value}")
            return fn(*args, **kwargs)
        return wrapper
    return decorator

admin_required = role_required(UserRole.ADMIN)
manager_required = role_required(UserRole.MANAGER)
sales_representative_required = role_required(UserRole.SALES_REPRESENTATIVE)
customer_required = role_required(UserRole.CUSTOMER)
admin_or_manager_required = role_required(UserRole.ADMIN, UserRole.MANAGER)
staff_required = role_required(UserRole.ADMIN, UserRole.MANAGER, UserRole.SALES_REPRESENTATIVE)
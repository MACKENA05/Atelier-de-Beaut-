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

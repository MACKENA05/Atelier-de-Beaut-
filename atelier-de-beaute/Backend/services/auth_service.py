from Backend.models.user import User
from Backend.extension import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask import session

def register_user(data):
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        raise ValueError("Name, email, and password are required")

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        raise ValueError("Email already registered")

    hashed_password = generate_password_hash(password)
    new_user = User(name=name, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return {'id': new_user.id, 'name': new_user.name, 'email': new_user.email}

def login_user(data):
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        raise ValueError("Email and password are required")

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        raise ValueError("Invalid email or password")

    session['user_id'] = user.id
    return {'id': user.id, 'name': user.name, 'email': user.email}

def logout_user():
    session.pop('user_id', None)

def get_current_user():
    user_id = session.get('user_id')
    if not user_id:
        return None
    user = User.query.get(user_id)
    if not user:
        return None
    return {'id': user.id, 'name': user.name, 'email': user.email}

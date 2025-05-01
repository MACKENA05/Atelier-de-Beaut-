from datetime import datetime, timezone
from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import Index, func
from sqlalchemy.dialects.postgresql import ENUM as PGEnum
import enum
from email_validator import validate_email, EmailNotValidError
from sqlalchemy.orm import validates
from flask_bcrypt import Bcrypt
from typing import Optional


bcrypt = Bcrypt()

class UserRole(enum.Enum):
    CUSTOMER = 'customer'
    ADMIN = 'admin'
    MANAGER = 'manager'
    SALES_REPRESENTATIVE = 'sales-representative'

    @classmethod
    def validate(cls, role_input: str):
        """Validate role input and return Enum member or error"""
        try:
            return cls(role_input.lower().strip())
        except ValueError:
            valid_roles = [e.value for e in cls]
            raise ValueError(
                f"Invalid role. Must be one of: {', '.join(valid_roles)}"
            )


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(128))
    role = db.Column(PGEnum(UserRole), default=UserRole.CUSTOMER, nullable=False)
    username= db.Column(db.String(100),  nullable=False)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, server_default=func.now(), onupdate=func.now())
    last_login = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    deleted_at = db.Column(db.DateTime)
    


    __table_args__ = (
        Index('ix_user_email_lower', func.lower(email)),  # Case-insensitive email index
    )

     # Relationships
    # addresses = db.relationship('Address', backref='user', lazy=True, cascade='all, delete-orphan')
    # orders = db.relationship('Order', backref='user', lazy='dynamic')
    # reviews = db.relationship('Review', backref='user', lazy=True)
    carts = db.relationship('Cart', back_populates='user', lazy='dynamic')

    @validates('email')
    def validate_email(self, key, email):
        try:
            # Validate the email address
            valid = validate_email(email)
            return valid.email.lower()  # Normalize email
        except EmailNotValidError as e:
            raise ValueError(str(e))

    def set_password(self, password: str) -> None:
        """Hashes the given password and stores it."""
        if not password:
            raise ValueError("Password cannot be empty")
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters")
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password: str) -> bool:
        """Checks if the given password matches the stored hash."""
        return bcrypt.check_password_hash(self.password_hash, password)


    def get_full_name(self) -> str:
        """Returns the user's full name."""
        return f"{self.first_name} {self.last_name}".strip()

    def activate(self) -> None:
        """Activates the user account."""
        self.is_active = True

    def deactivate(self) -> None:
        """Deactivates the user account."""
        self.is_active = False

    def update_last_login(self) -> None:
        """Updates the last login timestamp."""
        self.last_login = datetime.now(timezone.utc)
        db.session.commit()


    def __repr__(self) -> str:
        return f'<User id={self.id} username={self.username} role={self.role}>'
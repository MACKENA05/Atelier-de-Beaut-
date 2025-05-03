from marshmallow import Schema, fields, validate, ValidationError, validates, validates_schema
from models.user import User, UserRole
from email_validator import validate_email, EmailNotValidError
from datetime import datetime

class LoginSchema(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)

    @validates('username')
    def validate_username(self, value):
        if not value.strip():
            raise ValidationError("Username cannot be empty")
        if len(value) > 80:
            raise ValidationError("Username cannot exceed 80 characters")
    
    @validates('password')
    def validate_password(self, value):
        if len(value) < 8:
            raise ValidationError("Password must be at least 8 characters")
        if len(value) > 256:
            raise ValidationError("Password cannot exceed 256 characters")

class RegisterSchema(Schema):
    username = fields.Str(required=True, validate=[
        validate.Length(min=3, max=80),
        validate.Regexp(r'^[a-zA-Z0-9_]+$', 
                      error="Only letters, numbers and underscores allowed")
    ])
    email = fields.Str(required=True)
    password = fields.Str(required=True, validate=[
        validate.Length(min=8),
        validate.Regexp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$',
                      error="Must contain uppercase, lowercase and numbers")
    ], load_only=True)
    first_name = fields.Str(validate=[
        validate.Length(max=50),
        validate.Regexp(r'^[a-zA-Z\- ]+$', 
                       error="Only letters, spaces and hyphens allowed")
    ])
    last_name = fields.Str(validate=[
        validate.Length(max=50),
        validate.Regexp(r'^[a-zA-Z\- ]+$',
                       error="Only letters, spaces and hyphens allowed")
    ])
    phone = fields.Str(validate=[
        validate.Length(min=10, max=15, error="Phone number must be 13 digits"),
        validate.Regexp(r'^[0-9]+$', error="Phone number must contain only digits")
    ])
    
    @validates('email')
    def validate_email(self, value, **kwargs):
        try:
            validate_email(value)
        except EmailNotValidError as e:
            raise ValidationError(str(e))
        if User.query.filter_by(email=value.lower()).first():
            raise ValidationError("Email already registered")

    @validates('username')
    def validate_username(self, value, **kwargs):
        if User.query.filter_by(username=value).first():
            raise ValidationError("Username already taken")

class AdminUserCreateSchema(Schema):
    username = fields.Str(required=True, validate=[
        validate.Length(min=3, max=50),
        validate.Regexp(r'^[a-zA-Z0-9_]+$', 
                       error="Only letters, numbers and underscores allowed")
    ])
    email = fields.Email(required=True)
    role = fields.Str(required=True, validate=lambda x: UserRole.validate(x))
    first_name = fields.Str(validate=[
        validate.Length(max=50),
        validate.Regexp(r'^[a-zA-Z\- ]+$')
    ])
    last_name = fields.Str(validate=[
        validate.Length(max=50),
        validate.Regexp(r'^[a-zA-Z\- ]+$')
    ])
    phone = fields.Str(validate=[
        validate.Length(min=10, max=15, error="Phone number must be 13 digits"),
        validate.Regexp(r'^[0-9]+$', error="Phone number must contain only digits")
    ])
    is_active = fields.Boolean(load_default=True)
    password = fields.Str(validate=[
        validate.Length(min=8),
        validate.Regexp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$',
                       error="Must contain uppercase, lowercase, number and special character")
    ], load_only=True)
    phone = fields.Str(
        required=False,
        validate=[
            validate.Length(max=20),
            validate.Regexp(r'^[0-9+\-() ]+$', error="Invalid phone number format")
        ]
    )

    @validates('email')
    def validate_email_unique(self, value, **kwargs):
        try:
            valid_email = validate_email(value).email.lower()
            if User.query.filter(User.email == valid_email).first():
                raise ValidationError("Email already registered")
        except EmailNotValidError as e:
            raise ValidationError(str(e))
        if User.query.filter_by(email=value.lower()).first():
            raise ValidationError("Email already registered")

    @validates('username')
    def validate_username_unique(self, value, **kwargs):
        if User.query.filter_by(username=value).first():
            raise ValidationError("Username already taken")

class AdminUserUpdateSchema(Schema):
    username = fields.Str(validate=[
        validate.Length(min=3, max=80),
        validate.Regexp(r'^[a-zA-Z0-9_]+$')
    ])
    email = fields.Email()
    role = fields.Str(validate=lambda x: UserRole.validate(x))
    is_active = fields.Boolean()
    first_name = fields.Str(validate=[
        validate.Length(max=50),
        validate.Regexp(r'^[a-zA-Z\- ]+$')
    ])
    last_name = fields.Str(validate=[
        validate.Length(max=50),
        validate.Regexp(r'^[a-zA-Z\- ]+$')
    ])
    phone = fields.Str(validate=[
        validate.Length(min=10, max=15, error="Phone number must be 13 digits"),
        validate.Regexp(r'^[0-9]+$', error="Phone number must contain only digits")
    ])

    @validates('email')
    def validate_email_unique(self, value, **kwargs):
        try:
            validate_email(value)
        except EmailNotValidError as e:
            raise ValidationError(str(e))
        existing_user = User.query.filter_by(email=value.lower()).first()
        if existing_user and existing_user.id != self.context.get('user_id'):
            raise ValidationError("Email already registered")

    @validates('username')
    def validate_username_unique(self, value, **kwargs):
        existing_user = User.query.filter_by(username=value).first()
        if existing_user and existing_user.id != self.context.get('user_id'):
            raise ValidationError("Username already taken")

class UserResponseSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(dump_only=True)
    email = fields.Email(dump_only=True)
    first_name = fields.Str(dump_only=True)
    last_name = fields.Str(dump_only=True)
    phone = fields.Str(dump_only=True)
    role = fields.Str(dump_only=True)
    is_active = fields.Boolean(dump_only=True)
    created_at = fields.DateTime(dump_only=True, format='iso8601')
    last_login = fields.DateTime(dump_only=True, format='iso8601', allow_none=True)

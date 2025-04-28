from marshmallow import Schema, fields, validate, ValidationError, validates
from models.user import User, UserRole
from email_validator import validate_email, EmailNotValidError

class LoginSchema(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)

class RegisterSchema(Schema):
    username = fields.Str(required=True, validate=[
        validate.Length(min=3, max=80),
        validate.Regexp(r'^[a-zA-Z0-9_]+$', 
                      error="Only letters, numbers and underscores allowed")
    ])
    email = fields.Email(required=True)
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
        validate.Length(min=10, max=10, error="Phone number must be 10 digits"),
        validate.Regexp(r'^[0-9]+$', error="Phone number must contain only digits")
    ])
    
    @validates('email')
    def validate_email(self, value):
        """Validate email format and uniqueness"""
        try:
            # Validate email format
            validate_email(value)
        except EmailNotValidError as e:
            raise ValidationError(str(e))
        
        # Check for uniqueness
        if User.query.filter_by(email=value.lower()).first():
            raise ValidationError("Email already registered")

    @validates('username')
    def validate_username(self, value):
        """Validate username uniqueness"""
        if User.query.filter_by(username=value).first():
            raise ValidationError("Username already taken")

class AdminLoginSchema(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)
    
class AdminUserCreateSchema(Schema):
    username = fields.Str(required=True, validate=[
        validate.Length(min=3, max=80),
        validate.Regexp(r'^[a-zA-Z0-9_]+$')
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
        validate.Length(min=10, max=10, error="Phone number must be 10 digits"),
        validate.Regexp(r'^[0-9]+$', error="Phone number must contain only digits")
    ])

    is_active = fields.Boolean(load_default=True)
    password = fields.Str(validate=validate.Length(min=8))

    @validates('email')
    def validate_email_unique(self, value):
        try:
            validate_email(value)
        except EmailNotValidError as e:
            raise ValidationError(str(e))
            
        if User.query.filter_by(email=value.lower()).first():
            raise ValidationError("Email already registered")

    @validates('username')
    def validate_username_unique(self, value):
        if User.query.filter_by(username=value).first():
            raise ValidationError("Username already taken")
        

class UserResponseSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(dump_only=True)
    email = fields.Email(dump_only=True)
    first_name = fields.Str(dump_only=True)
    last_name = fields.Str(dump_only=True)
    phone = fields.Str(dump_only=True)
    role = fields.Str(dump_only=True)
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
    email = fields.Str(required=True)
    password = fields.Str(required=True, validate=[
        validate.Length(min=8),
        validate.Regexp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$',
                      error="Must contain uppercase, lowercase and numbers")
    ], load_only=True)
    first_name = fields.Str()
    last_name = fields.Str()
    
    @validates('email')
    def validate_email(self, value):
        try:
            valid = validate_email(value).email.lower()
            if User.query.filter_by(email=valid).first():
                raise ValidationError("Email already registered")
        except EmailNotValidError as e:
            raise ValidationError(str(e))
        
        @validates('username')
        def validate_username(self, value):
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
    first_name = fields.Str()
    last_name = fields.Str()
    is_active = fields.Boolean(load_default=True)
    password = fields.Str(validate=validate.Length(min=8))   

    @validates('email')
    def validate_email_unique(self, value):
        if User.query.filter_by(email=value.lower()).first():
            raise ValidationError("Email already registered")

    @validates('username')
    def validate_username_unique(self, value):
        if User.query.filter_by(username=value).first():
            raise ValidationError("Username already taken")

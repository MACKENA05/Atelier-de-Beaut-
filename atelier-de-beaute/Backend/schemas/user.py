from marshmallow import Schema, fields, validate, ValidationError, validates, validates_schema
from models.user import User, UserRole
from email_validator import validate_email, EmailNotValidError
from datetime import datetime

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
        validate.Length(min=3, max=50),
        validate.Regexp(r'^[a-zA-Z0-9_]+$', 
                       error="Only letters, numbers and underscores allowed")
    ])
    email = fields.Str(required=True)
    role = fields.Str(required=True, 
                     validate=validate.OneOf([role.value for role in UserRole]))
    first_name = fields.Str(validate=validate.Length(max=50))
    last_name = fields.Str(validate=validate.Length(max=50))
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
    def validate_email(self, value):
        try:
            valid_email = validate_email(value).email.lower()
            if User.query.filter(User.email == valid_email).first():
                raise ValidationError("Email already registered")
        except EmailNotValidError as e:
            raise ValidationError("Invalid email address")

    @validates('username')
    def validate_username(self, value):
        if User.query.filter(User.username == value).first():
            raise ValidationError("Username already taken")

class UserUpdateSchema(Schema):
    username = fields.Str(validate=[
        validate.Length(min=3, max=50),
        validate.Regexp(r'^[a-zA-Z0-9_]+$')
    ])
    email = fields.Str()
    role = fields.Str(validate=validate.OneOf([role.value for role in UserRole]))
    first_name = fields.Str(validate=validate.Length(max=50))
    last_name = fields.Str(validate=validate.Length(max=50))
    is_active = fields.Boolean()
    password = fields.Str(validate=[
        validate.Length(min=8),
        validate.Regexp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$')
    ], load_only=True)

    @validates('email')
    def validate_email(self, value):
        if not value:
            return
        try:
            valid_email = validate_email(value).email.lower()
            # Check if email exists for another user
            if User.query.filter(
                User.email == valid_email,
                User.id != self.context.get('user_id')
            ).first():
                raise ValidationError("Email already registered")
        except EmailNotValidError:
            raise ValidationError("Invalid email address")

    @validates('username')
    def validate_username(self, value):
        if not value:
            return
        # Check if username exists for another user
        if User.query.filter(
            User.username == value,
            User.id != self.context.get('user_id')
        ).first():
            raise ValidationError("Username already taken")

    @validates_schema
    def validate_role_change(self, data, **kwargs):
        if 'role' in data:
            current_user = self.context.get('current_user')
            if not current_user or current_user.role != UserRole.SUPER_ADMIN:
                raise ValidationError(
                    "Only super admins can change roles",
                    field_name="role"
                )

class UserDeleteSchema(Schema):
    confirm = fields.Boolean(
        required=True,
        truthy={True},
        error_messages={
            "required": "Confirmation is required",
            "invalid": "Must confirm deletion"
        }
    )
    transfer_data_to = fields.Int(
        required=False,
        validate=validate.Range(min=1)
    )

    @validates('transfer_data_to')
    def validate_transfer_user(self, value):
        if not value:
            return
        if not User.query.get(value):
            raise ValidationError("Target user for data transfer not found")
        if value == self.context.get('user_id'):
            raise ValidationError("Cannot transfer data to the same user")

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

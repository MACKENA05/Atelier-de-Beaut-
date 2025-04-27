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
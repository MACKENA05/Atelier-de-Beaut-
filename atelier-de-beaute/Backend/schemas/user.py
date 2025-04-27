from marshmallow import Schema, fields, validate, ValidationError, validates
from models.user import User, UserRole
from email_validator import validate_email, EmailNotValidError

class LoginSchema(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)

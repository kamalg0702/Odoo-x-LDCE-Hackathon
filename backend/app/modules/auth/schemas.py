from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    email = fields.Email(required=True)
    avatar_url = fields.Str(allow_none=True)
    role = fields.Str(dump_only=True)
    bio = fields.Str(allow_none=True)
    preferred_currency = fields.Str(dump_default="USD")
    created_at = fields.DateTime(dump_only=True)

class RegisterSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))
    avatar_url = fields.Str(allow_none=True, required=False)

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)

class UpdateProfileSchema(Schema):
    name = fields.Str(required=False, validate=validate.Length(min=2, max=100))
    avatar_url = fields.Str(allow_none=True, required=False)
    bio = fields.Str(allow_none=True, required=False)
    preferred_currency = fields.Str(required=False)
    password = fields.Str(required=False, validate=validate.Length(min=6))

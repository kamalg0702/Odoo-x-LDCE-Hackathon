from marshmallow import Schema, fields, validate

class TripSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=150))
    description = fields.Str(allow_none=True)
    start_date = fields.Date(required=True)
    end_date = fields.Date(required=True)
    cover_photo_url = fields.Str(allow_none=True)
    is_public = fields.Bool(dump_default=False)
    share_slug = fields.Str(dump_only=True, allow_none=True)
    total_budget = fields.Float(dump_default=0.0)
    status = fields.Str(dump_default="planning")
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class CreateTripSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=150))
    description = fields.Str(allow_none=True, required=False)
    start_date = fields.Date(required=True)
    end_date = fields.Date(required=True)
    cover_photo_url = fields.Str(allow_none=True, required=False)
    total_budget = fields.Float(required=False, allow_none=True)
    is_public = fields.Bool(required=False)

class UpdateTripSchema(Schema):
    name = fields.Str(required=False, validate=validate.Length(min=1, max=150))
    description = fields.Str(allow_none=True, required=False)
    start_date = fields.Date(required=False)
    end_date = fields.Date(required=False)
    cover_photo_url = fields.Str(allow_none=True, required=False)
    total_budget = fields.Float(required=False, allow_none=True)
    is_public = fields.Bool(required=False)
    status = fields.Str(required=False)

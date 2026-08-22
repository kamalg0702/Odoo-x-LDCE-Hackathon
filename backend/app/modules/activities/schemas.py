from marshmallow import Schema, fields, validate

class ActivitySchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=150))
    description = fields.Str(allow_none=True)
    category = fields.Str(required=True)
    cost = fields.Float(required=True)
    duration_hours = fields.Float(dump_default=2.0)
    city_id = fields.Int(required=True)
    image_url = fields.Str(allow_none=True)
    rating = fields.Float(dump_default=4.5)
    created_at = fields.DateTime(dump_only=True)

class StopActivitySchema(Schema):
    id = fields.Int(dump_only=True)
    stop_id = fields.Int(required=True)
    activity_id = fields.Int(required=True)
    scheduled_date = fields.Date(allow_none=True)
    scheduled_time = fields.Str(allow_none=True)
    custom_cost = fields.Float(allow_none=True)
    notes = fields.Str(allow_none=True)
    is_completed = fields.Bool(dump_default=False)
    activity = fields.Nested(ActivitySchema, dump_only=True)
    created_at = fields.DateTime(dump_only=True)

class AddStopActivitySchema(Schema):
    activity_id = fields.Int(required=True)
    scheduled_date = fields.Date(allow_none=True, required=False)
    scheduled_time = fields.Str(allow_none=True, required=False)
    custom_cost = fields.Float(allow_none=True, required=False)
    notes = fields.Str(allow_none=True, required=False)

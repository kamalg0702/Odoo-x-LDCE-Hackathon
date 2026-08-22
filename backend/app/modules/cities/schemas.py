from marshmallow import Schema, fields, validate

class CitySchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    country = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    region = fields.Str(required=True)
    cost_index = fields.Int(validate=validate.Range(min=1, max=10))
    popularity_score = fields.Float(validate=validate.Range(min=0.0, max=10.0))
    lat = fields.Float(required=True)
    lng = fields.Float(required=True)
    image_url = fields.Str(allow_none=True)
    description = fields.Str(allow_none=True)
    currency = fields.Str(dump_default="USD")
    avg_daily_cost = fields.Float(dump_default=120.0)
    created_at = fields.DateTime(dump_only=True)

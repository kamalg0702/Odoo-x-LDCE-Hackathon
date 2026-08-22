from marshmallow import Schema, fields, validate

class CityInfoSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    country = fields.Str()
    region = fields.Str()
    cost_index = fields.Int()
    popularity_score = fields.Float()
    lat = fields.Float()
    lng = fields.Float()
    image_url = fields.Str()
    description = fields.Str()

class StopSchema(Schema):
    id = fields.Int(dump_only=True)
    trip_id = fields.Int(required=True)
    city_id = fields.Int(required=True)
    arrival_date = fields.Date(required=True)
    departure_date = fields.Date(required=True)
    order_index = fields.Int(dump_default=0)
    notes = fields.Str(allow_none=True)
    transport_mode = fields.Str(dump_default="Flight")
    budget_estimate = fields.Float(dump_default=0.0)
    city = fields.Nested(CityInfoSchema, dump_only=True)
    created_at = fields.DateTime(dump_only=True)

class CreateStopSchema(Schema):
    city_id = fields.Int(required=True)
    arrival_date = fields.Date(required=True)
    departure_date = fields.Date(required=True)
    order_index = fields.Int(required=False)
    notes = fields.Str(allow_none=True, required=False)
    transport_mode = fields.Str(required=False)
    budget_estimate = fields.Float(required=False)

class UpdateStopSchema(Schema):
    city_id = fields.Int(required=False)
    arrival_date = fields.Date(required=False)
    departure_date = fields.Date(required=False)
    order_index = fields.Int(required=False)
    notes = fields.Str(allow_none=True, required=False)
    transport_mode = fields.Str(required=False)
    budget_estimate = fields.Float(required=False)

class ReorderStopsSchema(Schema):
    order = fields.List(fields.Int(), required=True)

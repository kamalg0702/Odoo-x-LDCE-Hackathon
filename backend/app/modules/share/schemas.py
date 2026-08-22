from marshmallow import Schema, fields

class SharedLinkSchema(Schema):
    id = fields.Int(dump_only=True)
    trip_id = fields.Int(required=True)
    slug = fields.Str(dump_only=True)
    is_active = fields.Bool()
    views_count = fields.Int(dump_only=True)
    created_at = fields.DateTime(dump_only=True)

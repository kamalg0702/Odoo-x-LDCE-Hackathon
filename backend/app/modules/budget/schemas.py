from marshmallow import Schema, fields, validate

class ExpenseSchema(Schema):
    id = fields.Int(dump_only=True)
    trip_id = fields.Int(required=True)
    stop_id = fields.Int(allow_none=True)
    category = fields.Str(required=True, validate=validate.OneOf(["transport", "stay", "activities", "meals", "other"]))
    amount = fields.Float(required=True, validate=validate.Range(min=0.01))
    label = fields.Str(required=True, validate=validate.Length(min=1, max=150))
    date = fields.Date(allow_none=True)
    created_at = fields.DateTime(dump_only=True)

class CreateExpenseSchema(Schema):
    stop_id = fields.Int(allow_none=True, required=False)
    category = fields.Str(required=True, validate=validate.OneOf(["transport", "stay", "activities", "meals", "other"]))
    amount = fields.Float(required=True, validate=validate.Range(min=0.01))
    label = fields.Str(required=True, validate=validate.Length(min=1, max=150))
    date = fields.Date(allow_none=True, required=False)

from ...core.database import BaseModel
from ...core.extensions import db

class Expense(BaseModel):
    __tablename__ = "expenses"

    trip_id = db.Column(db.Integer, nullable=False, index=True)
    stop_id = db.Column(db.Integer, nullable=True, index=True) # Optional link to a specific stop
    category = db.Column(db.String(50), nullable=False) # transport, stay, activities, meals, other
    amount = db.Column(db.Float, nullable=False)
    label = db.Column(db.String(150), nullable=False)
    date = db.Column(db.Date, nullable=True)

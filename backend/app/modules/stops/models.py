from ...core.database import BaseModel
from ...core.extensions import db

class Stop(BaseModel):
    __tablename__ = "stops"

    trip_id = db.Column(db.Integer, nullable=False, index=True)
    city_id = db.Column(db.Integer, nullable=False, index=True)
    arrival_date = db.Column(db.Date, nullable=False)
    departure_date = db.Column(db.Date, nullable=False)
    order_index = db.Column(db.Integer, default=0, nullable=False)
    notes = db.Column(db.Text, nullable=True)
    transport_mode = db.Column(db.String(50), default="Flight", nullable=True) # Flight, Train, Bus, Drive, Ferry
    budget_estimate = db.Column(db.Float, default=0.0, nullable=False)

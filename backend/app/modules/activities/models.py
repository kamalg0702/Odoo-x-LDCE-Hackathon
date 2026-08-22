from ...core.database import BaseModel
from ...core.extensions import db

class Activity(BaseModel):
    __tablename__ = "activities"

    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(50), nullable=False, default="Sightseeing") # Culture, Food, Adventure, Sightseeing, Nature, Nightlife
    cost = db.Column(db.Float, nullable=False, default=0.0)
    duration_hours = db.Column(db.Float, nullable=False, default=2.0)
    city_id = db.Column(db.Integer, nullable=False, index=True)
    image_url = db.Column(db.String(500), nullable=True)
    rating = db.Column(db.Float, default=4.5, nullable=False)

class StopActivity(BaseModel):
    __tablename__ = "stop_activities"

    stop_id = db.Column(db.Integer, nullable=False, index=True)
    activity_id = db.Column(db.Integer, nullable=False, index=True)
    scheduled_date = db.Column(db.Date, nullable=True)
    scheduled_time = db.Column(db.String(10), nullable=True) # e.g. "10:00"
    custom_cost = db.Column(db.Float, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    is_completed = db.Column(db.Boolean, default=False, nullable=False)

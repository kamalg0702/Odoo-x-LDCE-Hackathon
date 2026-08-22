from ...core.database import BaseModel
from ...core.extensions import db

class City(BaseModel):
    __tablename__ = "cities"

    name = db.Column(db.String(100), nullable=False, index=True)
    country = db.Column(db.String(100), nullable=False, index=True)
    region = db.Column(db.String(100), nullable=False) # e.g. Europe, Asia, Americas, Africa, Oceania
    cost_index = db.Column(db.Integer, nullable=False, default=5) # 1 (budget) to 10 (luxury)
    popularity_score = db.Column(db.Float, nullable=False, default=8.0) # 1.0 to 10.0
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(500), nullable=True)
    description = db.Column(db.Text, nullable=True)
    currency = db.Column(db.String(10), default="USD", nullable=False)
    avg_daily_cost = db.Column(db.Float, default=120.0, nullable=False)

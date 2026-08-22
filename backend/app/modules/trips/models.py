import secrets
from ...core.database import BaseModel
from ...core.extensions import db

class Trip(BaseModel):
    __tablename__ = "trips"

    user_id = db.Column(db.Integer, nullable=False, index=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    cover_photo_url = db.Column(db.String(500), nullable=True)
    is_public = db.Column(db.Boolean, default=False, nullable=False)
    share_slug = db.Column(db.String(64), unique=True, nullable=True, index=True)
    total_budget = db.Column(db.Float, default=0.0, nullable=False)
    status = db.Column(db.String(30), default="planning", nullable=False) # planning, confirmed, completed

    def generate_slug(self):
        if not self.share_slug:
            self.share_slug = secrets.token_urlsafe(10)
        return self.share_slug

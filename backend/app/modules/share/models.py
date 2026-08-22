import secrets
from datetime import datetime
from ...core.database import BaseModel
from ...core.extensions import db

class SharedLink(BaseModel):
    __tablename__ = "shared_links"

    trip_id = db.Column(db.Integer, nullable=False, index=True)
    slug = db.Column(db.String(64), unique=True, nullable=False, index=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    views_count = db.Column(db.Integer, default=0, nullable=False)
    last_viewed_at = db.Column(db.DateTime, nullable=True)

    @classmethod
    def generate_unique_slug(cls):
        while True:
            slug = secrets.token_urlsafe(8)
            if not cls.query.filter_by(slug=slug).first():
                return slug

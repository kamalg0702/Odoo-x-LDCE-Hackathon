import bcrypt
from ...core.database import BaseModel
from ...core.extensions import db

class User(BaseModel):
    __tablename__ = "users"

    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    avatar_url = db.Column(db.String(500), nullable=True)
    role = db.Column(db.String(20), default="user", nullable=False) # 'user' or 'admin'
    bio = db.Column(db.Text, nullable=True)
    preferred_currency = db.Column(db.String(10), default="USD", nullable=False)

    def set_password(self, password: str):
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

    def check_password(self, password: str) -> bool:
        if not self.password_hash:
            return False
        return bcrypt.checkpw(password.encode("utf-8"), self.password_hash.encode("utf-8"))

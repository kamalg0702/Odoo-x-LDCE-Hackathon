from flask_jwt_extended import create_access_token, create_refresh_token
from .models import User

def register_user(name: str, email: str, password: str, avatar_url: str = None, role: str = "user"):
    email = email.lower().strip()
    existing = User.query.filter_by(email=email).first()
    if existing:
        return None, "Email address already registered"

    user = User(
        name=name.strip(),
        email=email,
        avatar_url=avatar_url or f"https://api.dicebear.com/7.x/bottts/svg?seed={email}",
        role=role
    )
    user.set_password(password)
    user.save()

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))
    return {
        "user": user,
        "access_token": access_token,
        "refresh_token": refresh_token
    }, None

def authenticate_user(email: str, password: str):
    email = email.lower().strip()
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return None, "Invalid email or password"

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))
    return {
        "user": user,
        "access_token": access_token,
        "refresh_token": refresh_token
    }, None

def get_user_by_id(user_id):
    return User.query.get(user_id)

def update_user_profile(user_id, data):
    user = User.query.get(user_id)
    if not user:
        return None, "User not found"

    if "name" in data and data["name"]:
        user.name = data["name"].strip()
    if "avatar_url" in data:
        user.avatar_url = data["avatar_url"]
    if "bio" in data:
        user.bio = data["bio"]
    if "preferred_currency" in data and data["preferred_currency"]:
        user.preferred_currency = data["preferred_currency"]
    if "password" in data and data["password"]:
        user.set_password(data["password"])

    user.save()
    return user, None

def list_all_users():
    return User.query.order_by(User.created_at.desc()).all()

def update_user_role(user_id, role):
    user = User.query.get(user_id)
    if not user:
        return None, "User not found"
    if role not in ["user", "admin"]:
        return None, "Invalid role"
    user.role = role
    user.save()
    return user, None

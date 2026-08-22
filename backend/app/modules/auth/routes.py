from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from ...core.middleware import api_response
from .schemas import UserSchema, RegisterSchema, LoginSchema, UpdateProfileSchema
from .service import register_user, authenticate_user, get_user_by_id, update_user_profile

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

user_schema = UserSchema()
register_schema = RegisterSchema()
login_schema = LoginSchema()
update_profile_schema = UpdateProfileSchema()

@auth_bp.route("/register", methods=["POST"])
def register():
    data = register_schema.load(request.get_json() or {})
    result, error = register_user(
        name=data["name"],
        email=data["email"],
        password=data["password"],
        avatar_url=data.get("avatar_url")
    )
    if error:
        return api_response(error=error, status_code=400)
    
    return api_response(
        data={
            "user": user_schema.dump(result["user"]),
            "access_token": result["access_token"],
            "refresh_token": result["refresh_token"]
        },
        status_code=201
    )

@auth_bp.route("/login", methods=["POST"])
def login():
    data = login_schema.load(request.get_json() or {})
    result, error = authenticate_user(
        email=data["email"],
        password=data["password"]
    )
    if error:
        return api_response(error=error, status_code=401)
    
    return api_response(
        data={
            "user": user_schema.dump(result["user"]),
            "access_token": result["access_token"],
            "refresh_token": result["refresh_token"]
        }
    )

@auth_bp.route("/google", methods=["POST"])
def google_auth():
    data = request.get_json() or {}
    email = data.get("email")
    name = data.get("name")
    avatar_url = data.get("avatar_url")

    if not email:
        return api_response(error="Google email required", status_code=400)

    from .service import authenticate_google_user
    result, error = authenticate_google_user(email=email, name=name, avatar_url=avatar_url)
    if error:
        return api_response(error=error, status_code=400)

    return api_response(
        data={
            "user": user_schema.dump(result["user"]),
            "access_token": result["access_token"],
            "refresh_token": result["refresh_token"]
        }
    )

@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id)
    if not user:
        return api_response(error="User not found", status_code=404)
    
    new_access_token = create_access_token(identity=str(user_id))
    return api_response(
        data={
            "access_token": new_access_token,
            "user": user_schema.dump(user)
        }
    )

@auth_bp.route("/logout", methods=["POST"])
def logout():
    # Stateless JWT logout acknowledged
    return api_response(data={"message": "Logged out successfully"})

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id)
    if not user:
        return api_response(error="User not found", status_code=404)
    return api_response(data={"user": user_schema.dump(user)})

@auth_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = update_profile_schema.load(request.get_json() or {})
    user, error = update_user_profile(user_id, data)
    if error:
        return api_response(error=error, status_code=400)
    return api_response(data={"user": user_schema.dump(user)})

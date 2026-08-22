from flask import Blueprint, request
from ...core.middleware import api_response, admin_required
from ..auth.service import list_all_users, update_user_role
from .service import get_admin_dashboard_stats

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

@admin_bp.route("/stats", methods=["GET"])
@admin_required()
def get_stats():
    stats = get_admin_dashboard_stats()
    return api_response(data={"stats": stats})

@admin_bp.route("/users", methods=["GET"])
@admin_required()
def get_users_list():
    users = list_all_users()
    users_data = [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "avatar_url": u.avatar_url,
            "bio": u.bio,
            "preferred_currency": u.preferred_currency,
            "created_at": u.created_at.isoformat()
        }
        for u in users
    ]
    return api_response(data={"users": users_data})

@admin_bp.route("/users/<int:user_id>/role", methods=["PATCH"])
@admin_required()
def change_role(user_id):
    data = request.get_json() or {}
    role = data.get("role")
    user, error = update_user_role(user_id, role)
    if error:
        return api_response(error=error, status_code=400)
    return api_response(data={"user": {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }})

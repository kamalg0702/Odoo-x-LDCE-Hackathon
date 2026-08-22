from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...core.middleware import api_response
from .service import create_or_get_share_link, get_public_trip_by_slug

share_bp = Blueprint("share", __name__, url_prefix="/api")

@share_bp.route("/trips/<int:trip_id>/share", methods=["POST"])
@jwt_required()
def share_trip(trip_id):
    user_id = int(get_jwt_identity())
    link, error = create_or_get_share_link(trip_id, user_id)
    if error:
        return api_response(error=error, status_code=400)
    
    # Construct share URL relative to host
    base_url = request.host_url.rstrip("/")
    public_url = f"/share/{link.slug}"
    return api_response(data={
        "slug": link.slug,
        "public_url": public_url,
        "is_active": link.is_active,
        "views_count": link.views_count
    })

@share_bp.route("/share/<string:slug>", methods=["GET"])
def get_shared_trip(slug):
    trip_data, error = get_public_trip_by_slug(slug)
    if error:
        return api_response(error=error, status_code=404)
    return api_response(data={"trip": trip_data})

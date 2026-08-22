from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from ...core.middleware import api_response
from .schemas import ActivitySchema, StopActivitySchema, AddStopActivitySchema
from .service import (
    list_activities, get_activity_by_id, create_activity,
    get_activities_for_stop, add_activity_to_stop,
    update_stop_activity, delete_stop_activity
)

activities_bp = Blueprint("activities", __name__, url_prefix="/api")

activity_schema = ActivitySchema()
activities_schema = ActivitySchema(many=True)
add_stop_activity_schema = AddStopActivitySchema()

@activities_bp.route("/activities", methods=["GET"])
def get_activities():
    city_id = request.args.get("city_id", type=int)
    category = request.args.get("category")
    min_cost = request.args.get("min_cost")
    max_cost = request.args.get("max_cost")
    search = request.args.get("search")
    limit = request.args.get("limit", default=100, type=int)

    acts = list_activities(
        city_id=city_id,
        category=category,
        min_cost=min_cost,
        max_cost=max_cost,
        search=search,
        limit=limit
    )
    return api_response(data={"activities": activities_schema.dump(acts)})

@activities_bp.route("/activities/<int:activity_id>", methods=["GET"])
def get_activity(activity_id):
    act = get_activity_by_id(activity_id)
    if not act:
        return api_response(error="Activity not found", status_code=404)
    return api_response(data={"activity": activity_schema.dump(act)})

@activities_bp.route("/activities", methods=["POST"])
@jwt_required()
def create_new_activity():
    data = activity_schema.load(request.get_json() or {})
    act, error = create_activity(data)
    if error:
        return api_response(error=error, status_code=400)
    return api_response(data={"activity": activity_schema.dump(act)}, status_code=201)

@activities_bp.route("/stops/<int:stop_id>/activities", methods=["GET"])
@jwt_required()
def list_stop_activities(stop_id):
    activities = get_activities_for_stop(stop_id)
    return api_response(data={"activities": activities})

@activities_bp.route("/stops/<int:stop_id>/activities", methods=["POST"])
@jwt_required()
def add_activity_to_stop_route(stop_id):
    data = add_stop_activity_schema.load(request.get_json() or {})
    stop_act, error = add_activity_to_stop(stop_id, data)
    if error:
        return api_response(error=error, status_code=400)
    
    # Return enriched list or enriched item
    activities = get_activities_for_stop(stop_id)
    created = next((a for a in activities if a["id"] == stop_act.id), None)
    return api_response(data={"stop_activity": created}, status_code=201)

@activities_bp.route("/stops/<int:stop_id>/activities/<int:activity_id>", methods=["PUT"])
@jwt_required()
def update_stop_activity_route(stop_id, activity_id):
    data = request.get_json() or {}
    sa, error = update_stop_activity(activity_id, data)
    if error:
        return api_response(error=error, status_code=400)
    activities = get_activities_for_stop(stop_id)
    updated = next((a for a in activities if a["id"] == sa.id), None)
    return api_response(data={"stop_activity": updated})

@activities_bp.route("/stops/<int:stop_id>/activities/<int:activity_id>", methods=["DELETE"])
@jwt_required()
def delete_stop_activity_route(stop_id, activity_id):
    success, error = delete_stop_activity(activity_id, stop_id=stop_id)
    if error:
        return api_response(error=error, status_code=404)
    return api_response(data={"message": "Activity removed from stop"})

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...core.middleware import api_response
from .schemas import StopSchema, CreateStopSchema, UpdateStopSchema, ReorderStopsSchema
from .service import get_stops_for_trip, create_stop, update_stop, delete_stop, reorder_stops

stops_bp = Blueprint("stops", __name__, url_prefix="/api/trips/<int:trip_id>/stops")

stop_schema = StopSchema()
stops_schema = StopSchema(many=True)
create_stop_schema = CreateStopSchema()
update_stop_schema = UpdateStopSchema()
reorder_schema = ReorderStopsSchema()

@stops_bp.route("", methods=["GET"])
@jwt_required()
def list_stops(trip_id):
    user_id = int(get_jwt_identity())
    stops, error = get_stops_for_trip(trip_id, user_id)
    if error:
        return api_response(error=error, status_code=404)
    return api_response(data={"stops": stops})

@stops_bp.route("", methods=["POST"])
@jwt_required()
def add_stop(trip_id):
    user_id = int(get_jwt_identity())
    data = create_stop_schema.load(request.get_json() or {})
    stop, error = create_stop(trip_id, user_id, data)
    if error:
        return api_response(error=error, status_code=400)
    # Refresh enriched stop
    all_stops, _ = get_stops_for_trip(trip_id, user_id)
    created = next((s for s in all_stops if s["id"] == stop.id), None)
    return api_response(data={"stop": created or stop_schema.dump(stop)}, status_code=201)

@stops_bp.route("/<int:stop_id>", methods=["PUT"])
@jwt_required()
def update_stop_item(trip_id, stop_id):
    user_id = int(get_jwt_identity())
    data = update_stop_schema.load(request.get_json() or {})
    stop, error = update_stop(trip_id, stop_id, user_id, data)
    if error:
        return api_response(error=error, status_code=400)
    all_stops, _ = get_stops_for_trip(trip_id, user_id)
    updated = next((s for s in all_stops if s["id"] == stop.id), None)
    return api_response(data={"stop": updated or stop_schema.dump(stop)})

@stops_bp.route("/<int:stop_id>", methods=["DELETE"])
@jwt_required()
def delete_stop_item(trip_id, stop_id):
    user_id = int(get_jwt_identity())
    success, error = delete_stop(trip_id, stop_id, user_id)
    if error:
        return api_response(error=error, status_code=404)
    return api_response(data={"message": "Stop removed successfully"})

@stops_bp.route("/reorder", methods=["PATCH"])
@jwt_required()
def reorder_stop_items(trip_id):
    user_id = int(get_jwt_identity())
    data = reorder_schema.load(request.get_json() or {})
    stops, error = reorder_stops(trip_id, user_id, data["order"])
    if error:
        return api_response(error=error, status_code=400)
    return api_response(data={"stops": stops})

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...core.middleware import api_response
from .schemas import TripSchema, CreateTripSchema, UpdateTripSchema
from .service import list_user_trips, create_trip, get_trip_by_id, update_trip, delete_trip

trips_bp = Blueprint("trips", __name__, url_prefix="/api/trips")

trip_schema = TripSchema()
trips_schema = TripSchema(many=True)
create_trip_schema = CreateTripSchema()
update_trip_schema = UpdateTripSchema()

@trips_bp.route("", methods=["GET"])
@jwt_required()
def get_trips():
    user_id = int(get_jwt_identity())
    trips = list_user_trips(user_id)
    return api_response(data={"trips": trips_schema.dump(trips)})

@trips_bp.route("", methods=["POST"])
@jwt_required()
def create_new_trip():
    user_id = int(get_jwt_identity())
    data = create_trip_schema.load(request.get_json() or {})
    trip, error = create_trip(user_id, data)
    if error:
        return api_response(error=error, status_code=400)
    return api_response(data={"trip": trip_schema.dump(trip)}, status_code=201)

@trips_bp.route("/<int:trip_id>", methods=["GET"])
@jwt_required()
def get_trip(trip_id):
    user_id = int(get_jwt_identity())
    trip = get_trip_by_id(trip_id, user_id)
    if not trip:
        return api_response(error="Trip not found", status_code=404)
    return api_response(data={"trip": trip_schema.dump(trip)})

@trips_bp.route("/<int:trip_id>", methods=["PUT"])
@jwt_required()
def update_existing_trip(trip_id):
    user_id = int(get_jwt_identity())
    data = update_trip_schema.load(request.get_json() or {})
    trip, error = update_trip(trip_id, user_id, data)
    if error:
        return api_response(error=error, status_code=400)
    return api_response(data={"trip": trip_schema.dump(trip)})

@trips_bp.route("/<int:trip_id>", methods=["DELETE"])
@jwt_required()
def delete_existing_trip(trip_id):
    user_id = int(get_jwt_identity())
    success, error = delete_trip(trip_id, user_id)
    if error:
        return api_response(error=error, status_code=404)
    return api_response(data={"message": "Trip deleted successfully"})

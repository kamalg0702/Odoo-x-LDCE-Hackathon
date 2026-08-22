from flask import Blueprint, request
from ...core.middleware import api_response, admin_required
from .schemas import CitySchema
from .service import search_cities, get_city_by_id, create_city, update_city, delete_city

cities_bp = Blueprint("cities", __name__, url_prefix="/api/cities")

city_schema = CitySchema()
cities_schema = CitySchema(many=True)

@cities_bp.route("", methods=["GET"])
def get_cities():
    q = request.args.get("q")
    country = request.args.get("country")
    region = request.args.get("region")
    max_cost = request.args.get("max_cost")
    limit = request.args.get("limit", default=100, type=int)

    cities = search_cities(query=q, country=country, region=region, max_cost=max_cost, limit=limit)
    return api_response(data={"cities": cities_schema.dump(cities)})

@cities_bp.route("/<int:city_id>", methods=["GET"])
def get_city(city_id):
    city = get_city_by_id(city_id)
    if not city:
        return api_response(error="City not found", status_code=404)
    return api_response(data={"city": city_schema.dump(city)})

@cities_bp.route("", methods=["POST"])
@admin_required()
def create_new_city():
    data = city_schema.load(request.get_json() or {})
    city, error = create_city(data)
    if error:
        return api_response(error=error, status_code=400)
    return api_response(data={"city": city_schema.dump(city)}, status_code=201)

@cities_bp.route("/<int:city_id>", methods=["PUT"])
@admin_required()
def update_existing_city(city_id):
    data = request.get_json() or {}
    city, error = update_city(city_id, data)
    if error:
        return api_response(error=error, status_code=400)
    return api_response(data={"city": city_schema.dump(city)})

@cities_bp.route("/<int:city_id>", methods=["DELETE"])
@admin_required()
def delete_existing_city(city_id):
    success, error = delete_city(city_id)
    if error:
        return api_response(error=error, status_code=404)
    return api_response(data={"message": "City deleted successfully"})

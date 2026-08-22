from ..cities.service import get_city_by_id
from ..trips.service import get_trip_by_id
from .models import Stop

def get_stops_for_trip(trip_id, user_id=None):
    if user_id is not None:
        trip = get_trip_by_id(trip_id, user_id)
        if not trip:
            return None, "Trip not found or unauthorized"
    
    stops = Stop.query.filter_by(trip_id=trip_id).order_by(Stop.order_index.asc(), Stop.arrival_date.asc()).all()
    
    # Enrich with city info
    enriched = []
    for s in stops:
        city = get_city_by_id(s.city_id)
        city_data = None
        if city:
            city_data = {
                "id": city.id,
                "name": city.name,
                "country": city.country,
                "region": city.region,
                "cost_index": city.cost_index,
                "popularity_score": city.popularity_score,
                "lat": city.lat,
                "lng": city.lng,
                "image_url": city.image_url,
                "description": city.description
            }
        stop_dict = {
            "id": s.id,
            "trip_id": s.trip_id,
            "city_id": s.city_id,
            "arrival_date": s.arrival_date,
            "departure_date": s.departure_date,
            "order_index": s.order_index,
            "notes": s.notes,
            "transport_mode": s.transport_mode,
            "budget_estimate": s.budget_estimate,
            "city": city_data,
            "created_at": s.created_at
        }
        enriched.append(stop_dict)

    return enriched, None

def create_stop(trip_id, user_id, data):
    trip = get_trip_by_id(trip_id, user_id)
    if not trip:
        return None, "Trip not found or unauthorized"

    if data["arrival_date"] > data["departure_date"]:
        return None, "Departure date cannot be before arrival date"

    city = get_city_by_id(data["city_id"])
    if not city:
        return None, "Invalid city ID"

    # Default order index is last + 1
    existing_count = Stop.query.filter_by(trip_id=trip_id).count()
    order_index = data.get("order_index", existing_count)

    stop = Stop(
        trip_id=trip_id,
        city_id=data["city_id"],
        arrival_date=data["arrival_date"],
        departure_date=data["departure_date"],
        order_index=order_index,
        notes=data.get("notes"),
        transport_mode=data.get("transport_mode", "Flight"),
        budget_estimate=float(data.get("budget_estimate") or 0.0)
    )
    stop.save()

    return stop, None

def update_stop(trip_id, stop_id, user_id, data):
    trip = get_trip_by_id(trip_id, user_id)
    if not trip:
        return None, "Trip not found or unauthorized"

    stop = Stop.query.filter_by(id=stop_id, trip_id=trip_id).first()
    if not stop:
        return None, "Stop not found"

    arrival = data.get("arrival_date", stop.arrival_date)
    departure = data.get("departure_date", stop.departure_date)
    if arrival > departure:
        return None, "Departure date cannot be before arrival date"

    if "city_id" in data and data["city_id"]:
        city = get_city_by_id(data["city_id"])
        if not city:
            return None, "Invalid city ID"
        stop.city_id = data["city_id"]

    if "arrival_date" in data:
        stop.arrival_date = data["arrival_date"]
    if "departure_date" in data:
        stop.departure_date = data["departure_date"]
    if "order_index" in data:
        stop.order_index = data["order_index"]
    if "notes" in data:
        stop.notes = data["notes"]
    if "transport_mode" in data:
        stop.transport_mode = data["transport_mode"]
    if "budget_estimate" in data and data["budget_estimate"] is not None:
        stop.budget_estimate = float(data["budget_estimate"])

    stop.save()
    return stop, None

def delete_stop(trip_id, stop_id, user_id):
    trip = get_trip_by_id(trip_id, user_id)
    if not trip:
        return False, "Trip not found or unauthorized"

    stop = Stop.query.filter_by(id=stop_id, trip_id=trip_id).first()
    if not stop:
        return False, "Stop not found"

    stop.delete()
    return True, None

def reorder_stops(trip_id, user_id, ordered_stop_ids):
    trip = get_trip_by_id(trip_id, user_id)
    if not trip:
        return None, "Trip not found or unauthorized"

    stops = Stop.query.filter_by(trip_id=trip_id).all()
    stop_map = {s.id: s for s in stops}

    for idx, stop_id in enumerate(ordered_stop_ids):
        if stop_id in stop_map:
            stop_map[stop_id].order_index = idx
            stop_map[stop_id].save()

    return get_stops_for_trip(trip_id, user_id)

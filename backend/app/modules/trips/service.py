from .models import Trip

def list_user_trips(user_id):
    return Trip.query.filter_by(user_id=user_id).order_by(Trip.start_date.asc()).all()

def create_trip(user_id, data):
    if data["start_date"] > data["end_date"]:
        return None, "End date cannot be earlier than start date"

    trip = Trip(
        user_id=user_id,
        name=data["name"].strip(),
        description=data.get("description"),
        start_date=data["start_date"],
        end_date=data["end_date"],
        cover_photo_url=data.get("cover_photo_url") or "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
        total_budget=float(data.get("total_budget") or 0.0),
        is_public=bool(data.get("is_public", False))
    )
    trip.generate_slug()
    trip.save()
    return trip, None

def get_trip_by_id(trip_id, user_id=None):
    trip = Trip.query.get(trip_id)
    if not trip:
        return None
    if user_id is not None and trip.user_id != user_id:
        return None
    return trip

def update_trip(trip_id, user_id, data):
    trip = get_trip_by_id(trip_id, user_id)
    if not trip:
        return None, "Trip not found or unauthorized"

    start_date = data.get("start_date", trip.start_date)
    end_date = data.get("end_date", trip.end_date)
    if start_date > end_date:
        return None, "End date cannot be earlier than start date"

    if "name" in data and data["name"]:
        trip.name = data["name"].strip()
    if "description" in data:
        trip.description = data["description"]
    if "start_date" in data:
        trip.start_date = data["start_date"]
    if "end_date" in data:
        trip.end_date = data["end_date"]
    if "cover_photo_url" in data:
        trip.cover_photo_url = data["cover_photo_url"]
    if "total_budget" in data and data["total_budget"] is not None:
        trip.total_budget = float(data["total_budget"])
    if "is_public" in data:
        trip.is_public = bool(data["is_public"])
    if "status" in data:
        trip.status = data["status"]

    trip.save()
    return trip, None

def delete_trip(trip_id, user_id):
    trip = get_trip_by_id(trip_id, user_id)
    if not trip:
        return False, "Trip not found or unauthorized"
    
    trip.delete()
    return True, None

def get_trip_by_slug(slug):
    return Trip.query.filter_by(share_slug=slug).first()

def list_all_trips():
    return Trip.query.order_by(Trip.created_at.desc()).all()

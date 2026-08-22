from datetime import datetime
from app.core.extensions import db
from ..trips.service import get_trip_by_id, get_trip_by_slug
from ..stops.service import get_stops_for_trip
from ..activities.service import get_activities_for_stop
# FIXED: Replaced cross-module User model import with auth.service.get_user_by_id
from ..auth.service import get_user_by_id
from .models import SharedLink

def create_or_get_share_link(trip_id, user_id):
    trip = get_trip_by_id(trip_id, user_id)
    if not trip:
        return None, "Trip not found or unauthorized"

    # Ensure trip is flagged public and has share_slug
    trip.is_public = True
    if not trip.share_slug:
        trip.generate_slug()
    trip.save()

    link = SharedLink.query.filter_by(trip_id=trip_id).first()
    if not link:
        link = SharedLink(trip_id=trip_id, slug=trip.share_slug, is_active=True)
        link.save()
    elif not link.is_active:
        link.is_active = True
        link.save()

    return link, None

def get_public_trip_by_slug(slug):
    link = SharedLink.query.filter_by(slug=slug, is_active=True).first()
    trip = None
    if link:
        trip = get_trip_by_id(link.trip_id)
    else:
        trip = get_trip_by_slug(slug)

    if not trip or not trip.is_public:
        return None, "Shared trip not found or link has expired"

    # Track view count
    if link:
        link.views_count += 1
        link.last_viewed_at = datetime.utcnow()
        link.save()

    # Author
    # FIXED: Replaced direct cross-module User.query.get with get_user_by_id service call
    author = get_user_by_id(trip.user_id)
    author_data = {
        "name": author.name if author else "Traveler",
        "avatar_url": author.avatar_url if author else None
    }

    # Fetch stops
    stops, _ = get_stops_for_trip(trip.id)
    enriched_stops = []
    for s in stops:
        acts = get_activities_for_stop(s["id"])
        s_copy = dict(s)
        s_copy["activities"] = acts
        enriched_stops.append(s_copy)

    trip_data = {
        "id": trip.id,
        "name": trip.name,
        "description": trip.description,
        "start_date": trip.start_date.isoformat(),
        "end_date": trip.end_date.isoformat(),
        "cover_photo_url": trip.cover_photo_url,
        "total_budget": trip.total_budget,
        "share_slug": trip.share_slug,
        "author": author_data,
        "stops": enriched_stops
    }

    return trip_data, None

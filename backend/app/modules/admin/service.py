# NOTE: Admin module intentionally imports models from other
# modules for read-only analytics aggregation only.
# No write operations are performed here.
# This is an accepted architectural exception for admin views.

from ..auth.models import User
from ..trips.models import Trip
from ..stops.models import Stop
from ..cities.models import City
from ..activities.models import Activity

def get_admin_dashboard_stats():
    total_users = User.query.count()
    total_trips = Trip.query.count()
    total_stops = Stop.query.count()
    total_cities = City.query.count()
    total_activities = Activity.query.count()

    recent_users = User.query.order_by(User.created_at.desc()).limit(10).all()
    recent_trips = Trip.query.order_by(Trip.created_at.desc()).limit(10).all()

    # Popular cities (by popularity score and stop frequency)
    popular_cities = City.query.order_by(City.popularity_score.desc()).limit(8).all()

    return {
        "metrics": {
            "total_users": total_users,
            "total_trips": total_trips,
            "total_stops": total_stops,
            "total_cities": total_cities,
            "total_activities": total_activities
        },
        "recent_users": [
            {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "role": u.role,
                "avatar_url": u.avatar_url,
                "created_at": u.created_at.isoformat()
            }
            for u in recent_users
        ],
        "recent_trips": [
            {
                "id": t.id,
                "user_id": t.user_id,
                "name": t.name,
                "start_date": t.start_date.isoformat(),
                "end_date": t.end_date.isoformat(),
                "status": t.status,
                "is_public": t.is_public,
                "created_at": t.created_at.isoformat()
            }
            for t in recent_trips
        ],
        "popular_cities": [
            {
                "id": c.id,
                "name": c.name,
                "country": c.country,
                "region": c.region,
                "popularity_score": c.popularity_score,
                "cost_index": c.cost_index,
                "image_url": c.image_url
            }
            for c in popular_cities
        ]
    }

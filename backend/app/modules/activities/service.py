from sqlalchemy import or_
from app.core.extensions import db
from .models import Activity, StopActivity

def list_activities(city_id=None, category=None, min_cost=None, max_cost=None, search=None, limit=100):
    q = Activity.query
    if city_id:
        q = q.filter_by(city_id=city_id)
    if category and category != "All":
        q = q.filter(Activity.category.ilike(f"%{category.strip()}%"))
    if min_cost is not None:
        try:
            q = q.filter(Activity.cost >= float(min_cost))
        except ValueError:
            pass
    if max_cost is not None:
        try:
            q = q.filter(Activity.cost <= float(max_cost))
        except ValueError:
            pass
    if search:
        term = f"%{search.strip()}%"
        q = q.filter(or_(Activity.name.ilike(term), Activity.description.ilike(term)))

    return q.order_by(Activity.rating.desc(), Activity.name.asc()).limit(limit).all()

def get_activity_by_id(activity_id):
    # FIXED: Replaced deprecated Query.get() with db.session.get()
    return db.session.get(Activity, activity_id)

def create_activity(data):
    activity = Activity(
        name=data["name"].strip(),
        description=data.get("description"),
        category=data.get("category", "Sightseeing"),
        cost=float(data.get("cost", 0.0)),
        duration_hours=float(data.get("duration_hours", 2.0)),
        city_id=int(data["city_id"]),
        image_url=data.get("image_url"),
        rating=float(data.get("rating", 4.5))
    )
    activity.save()
    return activity, None

def get_activities_for_stop(stop_id):
    stop_activities = StopActivity.query.filter_by(stop_id=stop_id).order_by(StopActivity.scheduled_date.asc(), StopActivity.scheduled_time.asc()).all()
    enriched = []
    for sa in stop_activities:
        # FIXED: Replaced deprecated Query.get() with db.session.get()
        act = db.session.get(Activity, sa.activity_id)
        act_dict = None
        if act:
            act_dict = {
                "id": act.id,
                "name": act.name,
                "description": act.description,
                "category": act.category,
                "cost": act.cost,
                "duration_hours": act.duration_hours,
                "city_id": act.city_id,
                "image_url": act.image_url,
                "rating": act.rating
            }
        enriched.append({
            "id": sa.id,
            "stop_id": sa.stop_id,
            "activity_id": sa.activity_id,
            "scheduled_date": sa.scheduled_date,
            "scheduled_time": sa.scheduled_time,
            "custom_cost": sa.custom_cost,
            "effective_cost": sa.custom_cost if sa.custom_cost is not None else (act.cost if act else 0.0),
            "notes": sa.notes,
            "is_completed": sa.is_completed,
            "activity": act_dict,
            "created_at": sa.created_at
        })
    return enriched

def add_activity_to_stop(stop_id, data):
    # FIXED: Replaced deprecated Query.get() with db.session.get()
    activity = db.session.get(Activity, data["activity_id"])
    if not activity:
        return None, "Activity not found"

    stop_act = StopActivity(
        stop_id=stop_id,
        activity_id=data["activity_id"],
        scheduled_date=data.get("scheduled_date"),
        scheduled_time=data.get("scheduled_time"),
        custom_cost=data.get("custom_cost"),
        notes=data.get("notes")
    )
    stop_act.save()
    return stop_act, None

def update_stop_activity(stop_activity_id, data):
    # FIXED: Replaced deprecated Query.get() with db.session.get()
    sa = db.session.get(StopActivity, stop_activity_id)
    if not sa:
        return None, "Scheduled activity not found"
    
    if "scheduled_date" in data:
        sa.scheduled_date = data["scheduled_date"]
    if "scheduled_time" in data:
        sa.scheduled_time = data["scheduled_time"]
    if "custom_cost" in data:
        sa.custom_cost = data["custom_cost"]
    if "notes" in data:
        sa.notes = data["notes"]
    if "is_completed" in data:
        sa.is_completed = bool(data["is_completed"])

    sa.save()
    return sa, None

def delete_stop_activity(stop_activity_id, stop_id=None):
    q = StopActivity.query.filter_by(id=stop_activity_id)
    if stop_id:
        q = q.filter_by(stop_id=stop_id)
    sa = q.first()
    if not sa:
        return False, "Scheduled activity not found"
    sa.delete()
    return True, None

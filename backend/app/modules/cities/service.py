from sqlalchemy import or_
from .models import City

def search_cities(query=None, country=None, region=None, max_cost=None, limit=100):
    q = City.query
    if query:
        term = f"%{query.strip()}%"
        q = q.filter(or_(City.name.ilike(term), City.country.ilike(term), City.region.ilike(term)))
    if country:
        q = q.filter(City.country.ilike(f"%{country.strip()}%"))
    if region and region != "All":
        q = q.filter(City.region.ilike(f"%{region.strip()}%"))
    if max_cost:
        try:
            q = q.filter(City.cost_index <= int(max_cost))
        except ValueError:
            pass

    return q.order_by(City.popularity_score.desc(), City.name.asc()).limit(limit).all()

def get_city_by_id(city_id):
    return City.query.get(city_id)

def create_city(data):
    city = City(
        name=data["name"].strip(),
        country=data["country"].strip(),
        region=data.get("region", "Global"),
        cost_index=int(data.get("cost_index", 5)),
        popularity_score=float(data.get("popularity_score", 8.0)),
        lat=float(data["lat"]),
        lng=float(data["lng"]),
        image_url=data.get("image_url"),
        description=data.get("description"),
        currency=data.get("currency", "USD"),
        avg_daily_cost=float(data.get("avg_daily_cost", 120.0))
    )
    city.save()
    return city, None

def update_city(city_id, data):
    city = City.query.get(city_id)
    if not city:
        return None, "City not found"
    for field in ["name", "country", "region", "cost_index", "popularity_score", "lat", "lng", "image_url", "description", "currency", "avg_daily_cost"]:
        if field in data and data[field] is not None:
            setattr(city, field, data[field])
    city.save()
    return city, None

def delete_city(city_id):
    city = City.query.get(city_id)
    if not city:
        return False, "City not found"
    city.delete()
    return True, None

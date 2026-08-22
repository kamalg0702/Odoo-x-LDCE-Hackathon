from datetime import date
from ..trips.service import get_trip_by_id
from ..stops.models import Stop
from ..activities.models import StopActivity, Activity
from ..cities.models import City
from .models import Expense

def calculate_trip_budget(trip_id, user_id=None):
    trip = get_trip_by_id(trip_id, user_id)
    if not trip:
        return None, "Trip not found or unauthorized"

    # 1. Fetch all stops for this trip
    stops = Stop.query.filter_by(trip_id=trip_id).order_by(Stop.order_index.asc()).all()
    stop_ids = [s.id for s in stops]

    # 2. Activity costs from stop_activities
    activity_costs = 0.0
    stop_activity_totals = {s.id: 0.0 for s in stops}
    stop_activity_counts = {s.id: 0 for s in stops}

    if stop_ids:
        stop_activities = StopActivity.query.filter(StopActivity.stop_id.in_(stop_ids)).all()
        for sa in stop_activities:
            cost = sa.custom_cost
            if cost is None:
                act = Activity.query.get(sa.activity_id)
                cost = act.cost if act else 0.0
            
            activity_costs += cost
            if sa.stop_id in stop_activity_totals:
                stop_activity_totals[sa.stop_id] += cost
                stop_activity_counts[sa.stop_id] += 1

    # 3. Expenses logged for this trip
    expenses = Expense.query.filter_by(trip_id=trip_id).order_by(Expense.date.asc(), Expense.created_at.desc()).all()

    by_category = {
        "transport": 0.0,
        "stay": 0.0,
        "activities": round(activity_costs, 2),
        "meals": 0.0,
        "other": 0.0
    }

    stop_expense_totals = {s.id: 0.0 for s in stops}
    stop_expense_counts = {s.id: 0 for s in stops}

    for exp in expenses:
        cat = exp.category.lower() if exp.category.lower() in by_category else "other"
        by_category[cat] = round(by_category[cat] + exp.amount, 2)
        if exp.stop_id and exp.stop_id in stop_expense_totals:
            stop_expense_totals[exp.stop_id] += exp.amount
            stop_expense_counts[exp.stop_id] += 1

    total_spent = sum(by_category.values())

    # Trip duration
    trip_days = max(1, (trip.end_date - trip.start_date).days + 1)
    avg_per_day = round(total_spent / trip_days, 2)

    # Per-stop breakdowns
    stop_breakdowns = []
    for s in stops:
        city = City.query.get(s.city_id)
        subtotal = round(stop_activity_totals.get(s.id, 0.0) + stop_expense_totals.get(s.id, 0.0), 2)
        is_over = s.budget_estimate > 0 and subtotal > s.budget_estimate
        stop_breakdowns.append({
            "stop_id": s.id,
            "city_name": city.name if city else f"Stop #{s.order_index + 1}",
            "country": city.country if city else "",
            "subtotal": subtotal,
            "budget_estimate": s.budget_estimate,
            "overbudget": is_over,
            "activity_count": stop_activity_counts.get(s.id, 0),
            "expense_count": stop_expense_counts.get(s.id, 0)
        })

    remaining_budget = round(trip.total_budget - total_spent, 2) if trip.total_budget > 0 else 0.0
    is_overbudget = trip.total_budget > 0 and total_spent > trip.total_budget

    return {
        "trip_id": trip.id,
        "trip_name": trip.name,
        "total": round(total_spent, 2),
        "total_budget": trip.total_budget,
        "remaining_budget": remaining_budget,
        "is_overbudget": is_overbudget,
        "by_category": by_category,
        "avg_per_day": avg_per_day,
        "trip_days": trip_days,
        "stops": stop_breakdowns,
        "expenses": [
            {
                "id": e.id,
                "stop_id": e.stop_id,
                "category": e.category,
                "amount": e.amount,
                "label": e.label,
                "date": e.date.isoformat() if e.date else None,
                "created_at": e.created_at.isoformat()
            }
            for e in expenses
        ]
    }, None

def add_expense(trip_id, user_id, data):
    trip = get_trip_by_id(trip_id, user_id)
    if not trip:
        return None, "Trip not found or unauthorized"

    expense = Expense(
        trip_id=trip_id,
        stop_id=data.get("stop_id"),
        category=data["category"].lower(),
        amount=float(data["amount"]),
        label=data["label"].strip(),
        date=data.get("date")
    )
    expense.save()
    return expense, None

def delete_expense(expense_id, user_id):
    expense = Expense.query.get(expense_id)
    if not expense:
        return False, "Expense not found"

    trip = get_trip_by_id(expense.trip_id, user_id)
    if not trip:
        return False, "Unauthorized"

    expense.delete()
    return True, None

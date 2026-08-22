from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...core.middleware import api_response
from .schemas import ExpenseSchema, CreateExpenseSchema
from .service import calculate_trip_budget, add_expense, delete_expense

budget_bp = Blueprint("budget", __name__, url_prefix="/api")

expense_schema = ExpenseSchema()
create_expense_schema = CreateExpenseSchema()

@budget_bp.route("/trips/<int:trip_id>/budget", methods=["GET"])
@jwt_required()
def get_trip_budget(trip_id):
    user_id = int(get_jwt_identity())
    breakdown, error = calculate_trip_budget(trip_id, user_id)
    if error:
        return api_response(error=error, status_code=404)
    return api_response(data={"budget": breakdown})

@budget_bp.route("/trips/<int:trip_id>/expenses", methods=["POST"])
@jwt_required()
def log_expense(trip_id):
    user_id = int(get_jwt_identity())
    data = create_expense_schema.load(request.get_json() or {})
    expense, error = add_expense(trip_id, user_id, data)
    if error:
        return api_response(error=error, status_code=400)
    return api_response(data={"expense": expense_schema.dump(expense)}, status_code=201)

@budget_bp.route("/expenses/<int:expense_id>", methods=["DELETE"])
@jwt_required()
def remove_expense(expense_id):
    user_id = int(get_jwt_identity())
    success, error = delete_expense(expense_id, user_id)
    if error:
        return api_response(error=error, status_code=404)
    return api_response(data={"message": "Expense deleted successfully"})

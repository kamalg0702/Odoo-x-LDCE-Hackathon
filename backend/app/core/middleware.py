from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from marshmallow import ValidationError

def api_response(data=None, error=None, status_code=200, success=None):
    if success is None:
        success = error is None and status_code < 400
    
    return jsonify({
        "success": success,
        "data": data if data is not None else {},
        "error": str(error) if error is not None else None
    }), status_code

def register_error_handlers(app):
    @app.errorhandler(ValidationError)
    def handle_validation_error(e):
        return api_response(error=e.messages, status_code=400)

    @app.errorhandler(400)
    def bad_request(e):
        return api_response(error=getattr(e, "description", "Bad request"), status_code=400)

    @app.errorhandler(401)
    def unauthorized(e):
        return api_response(error="Unauthorized access", status_code=401)

    @app.errorhandler(403)
    def forbidden(e):
        return api_response(error="Forbidden", status_code=403)

    @app.errorhandler(404)
    def not_found(e):
        return api_response(error="Resource not found", status_code=404)

    @app.errorhandler(500)
    def server_error(e):
        return api_response(error="Internal server error", status_code=500)

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            # Dynamic lookup to respect no cross-module model import rules
            from ..modules.auth.models import User
            user = User.query.get(user_id)
            if not user or user.role != "admin":
                return api_response(error="Admin privileges required", status_code=403)
            return fn(*args, **kwargs)
        return decorator
    return wrapper

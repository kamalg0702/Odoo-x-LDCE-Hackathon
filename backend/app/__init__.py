from flask import Flask
from .core.config import Config
from .core.extensions import db, jwt, cors, ma
from .core.middleware import register_error_handlers

# Import Blueprints
from .modules.auth.routes import auth_bp
from .modules.trips.routes import trips_bp
from .modules.stops.routes import stops_bp
from .modules.cities.routes import cities_bp
from .modules.activities.routes import activities_bp
from .modules.budget.routes import budget_bp
from .modules.share.routes import share_bp
from .modules.admin.routes import admin_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    ma.init_app(app)

    # Register error handlers
    register_error_handlers(app)

    # Register all module blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(trips_bp)
    app.register_blueprint(stops_bp)
    app.register_blueprint(cities_bp)
    app.register_blueprint(activities_bp)
    app.register_blueprint(budget_bp)
    app.register_blueprint(share_bp)
    app.register_blueprint(admin_bp)

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return {"status": "healthy", "service": "GlobeTrotter API"}

    return app

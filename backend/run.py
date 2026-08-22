from dotenv import load_dotenv
# FIXED: Load environment variables from .env before any other imports
load_dotenv()

import os
from app import create_app
from seeds import seed_database

app = create_app()

if __name__ == "__main__":
    # Ensure database is initialized
    with app.app_context():
        from app.core.extensions import db
        db.create_all()
        # If no users exist, run seed
        from app.modules.auth.models import User
        if not User.query.first():
            print("No users found. Running initial database seeds...")
            # FIXED: Pass existing app instance to prevent nested app contexts
            seed_database(app)

    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "True").lower() in ["true", "1"]
    print(f"GlobeTrotter Backend starting on port {port} (debug={debug})...")
    app.run(host="0.0.0.0", port=port, debug=debug)

import json
from app import create_app
from app.core.extensions import db

def test_api():
    app = create_app()
    client = app.test_client()

    print("=== Testing Refined Backend API Endpoints & Google Auth ===")

    # 1. Health check
    res = client.get("/api/health")
    assert res.status_code == 200
    print("[PASS] GET /api/health")

    # 2. Login with email
    res = client.post("/api/auth/login", json={
        "email": "traveler@globetrotter.io",
        "password": "Traveler123!"
    })
    assert res.status_code == 200
    body = res.get_json()
    access_token = body["data"]["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}
    print("[PASS] POST /api/auth/login")

    # 3. Google OAuth Login Endpoint
    res = client.post("/api/auth/google", json={
        "email": "rohan.explorer@gmail.com",
        "name": "Rohan Explorer",
        "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=rohan"
    })
    assert res.status_code == 200
    google_body = res.get_json()
    assert google_body["data"]["user"]["email"] == "rohan.explorer@gmail.com"
    print("[PASS] POST /api/auth/google (Google OAuth User Created and Authenticated)")

    # 4. Search cities
    res = client.get("/api/cities?q=Paris")
    assert res.status_code == 200
    cities = res.get_json()["data"]["cities"]
    assert len(cities) > 0 and cities[0]["currency"] == "INR"
    print(f"[PASS] GET /api/cities (Verified INR currency: avg_daily_cost INR {cities[0]['avg_daily_cost']})")

    # 5. List user trips & check INR budget
    res = client.get("/api/trips", headers=headers)
    assert res.status_code == 200
    trips = res.get_json()["data"]["trips"]
    assert len(trips) > 0
    trip_id = trips[0]["id"]
    print(f"[PASS] GET /api/trips (Trip budget: INR {trips[0]['total_budget']})")

    # 6. Get budget in INR
    res = client.get(f"/api/trips/{trip_id}/budget", headers=headers)
    assert res.status_code == 200
    budget = res.get_json()["data"]["budget"]
    assert budget["total"] > 100000 # Realistic INR total
    print(f"[PASS] GET /api/trips/{trip_id}/budget (INR Total Spent: INR {budget['total']})")

    # 7. Share trip and test public access
    res = client.post(f"/api/trips/{trip_id}/share", headers=headers)
    assert res.status_code == 200
    slug = res.get_json()["data"]["slug"]
    res = client.get(f"/api/share/{slug}")
    assert res.status_code == 200
    print(f"[PASS] GET /api/share/{slug} (Public unauthenticated access verified!)")

    # 8. Admin Gating check
    res = client.get("/api/admin/stats", headers=headers)
    assert res.status_code == 403
    print("[PASS] Role gating: standard user cannot access /api/admin/stats (403)")

    print("\nALL REFINED API CONTRACT & GOOGLE AUTH TESTS PASSED PERFECTLY!")

if __name__ == "__main__":
    test_api()

import json
from app import create_app
from app.core.extensions import db

def test_api():
    app = create_app()
    client = app.test_client()

    print("=== Testing Backend API Endpoints ===")

    # 1. Health check
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health check failed: {res.status_code}"
    print("[PASS] GET /api/health")

    # 2. Login as Demo User
    res = client.post("/api/auth/login", json={
        "email": "traveler@globetrotter.io",
        "password": "Traveler123!"
    })
    assert res.status_code == 200, f"Login failed: {res.data}"
    body = res.get_json()
    assert body["success"] is True
    access_token = body["data"]["access_token"]
    refresh_token = body["data"]["refresh_token"]
    headers = {"Authorization": f"Bearer {access_token}"}
    print("[PASS] POST /api/auth/login")

    # 3. Get /api/auth/me
    res = client.get("/api/auth/me", headers=headers)
    assert res.status_code == 200
    user_data = res.get_json()["data"]["user"]
    assert user_data["email"] == "traveler@globetrotter.io"
    print("[PASS] GET /api/auth/me")

    # 4. Search cities
    res = client.get("/api/cities?q=Paris")
    assert res.status_code == 200
    cities = res.get_json()["data"]["cities"]
    assert len(cities) > 0 and cities[0]["name"] == "Paris"
    paris_id = cities[0]["id"]
    print(f"[PASS] GET /api/cities?q=Paris (found {len(cities)} matches)")

    # 5. List user trips
    res = client.get("/api/trips", headers=headers)
    assert res.status_code == 200
    trips = res.get_json()["data"]["trips"]
    assert len(trips) > 0
    trip_id = trips[0]["id"]
    print(f"[PASS] GET /api/trips (found {len(trips)} trips, test trip ID: {trip_id})")

    # 6. Get trip stops
    res = client.get(f"/api/trips/{trip_id}/stops", headers=headers)
    assert res.status_code == 200
    stops = res.get_json()["data"]["stops"]
    assert len(stops) >= 3
    print(f"[PASS] GET /api/trips/{trip_id}/stops (found {len(stops)} stops)")

    # 7. Get budget
    res = client.get(f"/api/trips/{trip_id}/budget", headers=headers)
    assert res.status_code == 200
    budget = res.get_json()["data"]["budget"]
    assert budget["total"] > 0
    assert "by_category" in budget
    print(f"[PASS] GET /api/trips/{trip_id}/budget (total spent: ${budget['total']})")

    # 8. Share trip and test public access
    res = client.post(f"/api/trips/{trip_id}/share", headers=headers)
    assert res.status_code == 200
    slug = res.get_json()["data"]["slug"]
    print(f"[PASS] POST /api/trips/{trip_id}/share (slug: {slug})")

    # Public endpoint - NO AUTH
    res = client.get(f"/api/share/{slug}")
    assert res.status_code == 200
    public_trip = res.get_json()["data"]["trip"]
    assert public_trip["name"] == trips[0]["name"]
    print(f"[PASS] GET /api/share/{slug} (Public unauthenticated access verified!)")

    # 9. Admin Gating check
    # Normal user should be 403 on admin
    res = client.get("/api/admin/stats", headers=headers)
    assert res.status_code == 403, f"Expected 403 for normal user, got {res.status_code}"
    print("[PASS] Role gating check: normal user forbidden from /api/admin/stats (403)")

    # Login as Admin
    res = client.post("/api/auth/login", json={
        "email": "admin@globetrotter.io",
        "password": "AdminPass123!"
    })
    admin_token = res.get_json()["data"]["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    res = client.get("/api/admin/stats", headers=admin_headers)
    assert res.status_code == 200
    print("[PASS] GET /api/admin/stats (Admin access verified!)")

    print("\nALL BACKEND API CONTRACT TESTS PASSED PERFECTLY!")

if __name__ == "__main__":
    test_api()

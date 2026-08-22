from datetime import date, timedelta
from app import create_app
from app.core.extensions import db
from app.modules.auth.models import User
from app.modules.cities.models import City
from app.modules.activities.models import Activity, StopActivity
from app.modules.trips.models import Trip
from app.modules.stops.models import Stop
from app.modules.budget.models import Expense
from app.modules.share.models import SharedLink

CITIES_DATA = [
    # Europe
    {"name": "Paris", "country": "France", "region": "Europe", "cost_index": 8, "popularity_score": 9.8, "lat": 48.8566, "lng": 2.3522, "avg_daily_cost": 15000, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800", "description": "The City of Light, renowned for art, fashion, gastronomy, and the iconic Eiffel Tower."},
    {"name": "Rome", "country": "Italy", "region": "Europe", "cost_index": 7, "popularity_score": 9.6, "lat": 41.9028, "lng": 12.4964, "avg_daily_cost": 12500, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800", "description": "The Eternal City, where ancient Colosseum ruins meet bustling piazzas and espresso culture."},
    {"name": "Barcelona", "country": "Spain", "region": "Europe", "cost_index": 6, "popularity_score": 9.5, "lat": 41.3879, "lng": 2.16992, "avg_daily_cost": 11500, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800", "description": "Gaudí architecture, Mediterranean beaches, world-class tapas, and gothic charm."},
    {"name": "Amsterdam", "country": "Netherlands", "region": "Europe", "cost_index": 8, "popularity_score": 9.2, "lat": 52.3676, "lng": 4.9041, "avg_daily_cost": 14500, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800", "description": "Picturesque canal rings, historic houseboats, cycling paths, and master art museums."},
    {"name": "London", "country": "United Kingdom", "region": "Europe", "cost_index": 9, "popularity_score": 9.7, "lat": 51.5074, "lng": -0.1278, "avg_daily_cost": 18000, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800", "description": "Cosmopolitan capital rich with royal landmarks, West End theater, and historic pubs."},
    {"name": "Vienna", "country": "Austria", "region": "Europe", "cost_index": 7, "popularity_score": 8.9, "lat": 48.2082, "lng": 16.3738, "avg_daily_cost": 12000, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800", "description": "Imperial palaces, grand classical music heritage, and elegant coffeehouse tradition."},
    {"name": "Prague", "country": "Czech Republic", "region": "Europe", "cost_index": 5, "popularity_score": 9.1, "lat": 50.0755, "lng": 14.4378, "avg_daily_cost": 8000, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1541849546-216549ae216d?w=800", "description": "Fairy-tale spires, Charles Bridge cobblestones, and bohemian artisan culture."},
    {"name": "Lisbon", "country": "Portugal", "region": "Europe", "cost_index": 5, "popularity_score": 9.3, "lat": 38.7223, "lng": -9.1393, "avg_daily_cost": 9000, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=800", "description": "Sun-drenched hills, yellow vintage trams, pastel de nata, and Atlantic ocean breezes."},
    {"name": "Berlin", "country": "Germany", "region": "Europe", "cost_index": 6, "popularity_score": 9.0, "lat": 52.5200, "lng": 13.4050, "avg_daily_cost": 11000, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800", "description": "Vibrant creative capital pulsing with history, modern galleries, and eclectic nightlife."},
    {"name": "Athens", "country": "Greece", "region": "Europe", "cost_index": 5, "popularity_score": 8.8, "lat": 37.9838, "lng": 23.7275, "avg_daily_cost": 7500, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1555993539-1732916b8235?w=800", "description": "The cradle of Western civilization with the majestic Parthenon and taverna culture."},
    {"name": "Venice", "country": "Italy", "region": "Europe", "cost_index": 8, "popularity_score": 9.3, "lat": 45.4408, "lng": 12.3155, "avg_daily_cost": 16000, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800", "description": "A floating labyrinth of romantic canals, gothic bridges, and marble palazzos."},
    {"name": "Zurich", "country": "Switzerland", "region": "Europe", "cost_index": 10, "popularity_score": 8.7, "lat": 47.3769, "lng": 8.5417, "avg_daily_cost": 21000, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800", "description": "Alpine lake beauty paired with Swiss precision, luxury shopping, and clean streets."},
    {"name": "Dubrovnik", "country": "Croatia", "region": "Europe", "cost_index": 6, "popularity_score": 8.9, "lat": 42.6507, "lng": 18.0944, "avg_daily_cost": 10000, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800", "description": "The Pearl of the Adriatic, surrounded by ancient sea walls and turquoise waters."},
    {"name": "Budapest", "country": "Hungary", "region": "Europe", "cost_index": 4, "popularity_score": 8.9, "lat": 47.4979, "lng": 19.0402, "avg_daily_cost": 7000, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1508873696983-2df570464753?w=800", "description": "Thermal bath culture, grand Parliament on the Danube, and trendy ruin bars."},
    {"name": "Reykjavik", "country": "Iceland", "region": "Europe", "cost_index": 9, "popularity_score": 8.6, "lat": 64.1466, "lng": -21.9426, "avg_daily_cost": 18500, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800", "description": "Gateway to volcanoes, geysers, thermal lagoons, and magical Northern Lights."},

    # Asia & Middle East
    {"name": "Tokyo", "country": "Japan", "region": "Asia", "cost_index": 8, "popularity_score": 9.9, "lat": 35.6762, "lng": 139.6503, "avg_daily_cost": 13500, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800", "description": "Hyper-modern neon skyscrapers blending seamlessly with ancient Shinto shrines."},
    {"name": "Kyoto", "country": "Japan", "region": "Asia", "cost_index": 7, "popularity_score": 9.4, "lat": 35.0116, "lng": 135.7681, "avg_daily_cost": 11500, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800", "description": "Classical Japanese soul with thousands of temples, zen gardens, and geisha districts."},
    {"name": "Bangkok", "country": "Thailand", "region": "Asia", "cost_index": 3, "popularity_score": 9.7, "lat": 13.7563, "lng": 100.5018, "avg_daily_cost": 5500, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800", "description": "Golden temples, buzzing floating markets, street food wonders, and vibrant energy."},
    {"name": "Singapore", "country": "Singapore", "region": "Asia", "cost_index": 9, "popularity_score": 9.5, "lat": 1.3521, "lng": 103.8198, "avg_daily_cost": 16000, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800", "description": "Futuristic garden city known for Supertree groves, diverse hawkers, and luxury."},
    {"name": "Seoul", "country": "South Korea", "region": "Asia", "cost_index": 6, "popularity_score": 9.3, "lat": 37.5665, "lng": 126.9780, "avg_daily_cost": 9500, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800", "description": "K-culture epicenter, royal dynastic palaces, futuristic design, and night markets."},
    {"name": "Bali", "country": "Indonesia", "region": "Asia", "cost_index": 3, "popularity_score": 9.6, "lat": -8.4095, "lng": 115.1889, "avg_daily_cost": 4500, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800", "description": "Island of the Gods featuring lush emerald rice terraces, cliffside temples, and surf."},
    {"name": "Dubai", "country": "United Arab Emirates", "region": "Middle East", "cost_index": 9, "popularity_score": 9.4, "lat": 25.2048, "lng": 55.2708, "avg_daily_cost": 17500, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800", "description": "Opulent desert metropolis with Burj Khalifa, man-made palm islands, and luxury souks."},
    {"name": "Hong Kong", "country": "Hong Kong", "region": "Asia", "cost_index": 8, "popularity_score": 9.1, "lat": 22.3193, "lng": 114.1694, "avg_daily_cost": 14000, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1506970845346-22b82173f4b2?w=800", "description": "Iconic Victoria Harbour skyline, dim sum dining, and towering mountainous backdrops."},
    {"name": "Hanoi", "country": "Vietnam", "region": "Asia", "cost_index": 2, "popularity_score": 8.7, "lat": 21.0285, "lng": 105.8542, "avg_daily_cost": 3800, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800", "description": "Centuries-old Old Quarter, tranquil lakes, aromatic pho, and colonial architecture."},
    {"name": "Taipei", "country": "Taiwan", "region": "Asia", "cost_index": 5, "popularity_score": 8.8, "lat": 25.0330, "lng": 121.5654, "avg_daily_cost": 6500, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1508248467877-aec1b08de376?w=800", "description": "World-famous night markets, friendly locals, Taipei 101, and thermal hot springs."},
    {"name": "Jaipur", "country": "India", "region": "Asia", "cost_index": 3, "popularity_score": 9.5, "lat": 26.9124, "lng": 75.7873, "avg_daily_cost": 3500, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800", "description": "The Pink City with regal fortresses, ornate palaces, and rich Rajasthani textiles."},
    {"name": "Goa", "country": "India", "region": "Asia", "cost_index": 4, "popularity_score": 9.6, "lat": 15.2993, "lng": 74.1240, "avg_daily_cost": 4200, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800", "description": "Sun-kissed Arabian Sea beaches, Portuguese heritage churches, and vibrant shacks."},
    {"name": "Udaipur", "country": "India", "region": "Asia", "cost_index": 4, "popularity_score": 9.4, "lat": 24.5854, "lng": 73.7125, "avg_daily_cost": 4000, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800", "description": "The City of Lakes with marble palaces floating on serene waters and royal havelis."},
    {"name": "Istanbul", "country": "Turkey", "region": "Middle East", "cost_index": 4, "popularity_score": 9.5, "lat": 41.0082, "lng": 28.9784, "avg_daily_cost": 6500, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800", "description": "Where East meets West across the Bosphorus, with Hagia Sophia and spice bazaars."},
    {"name": "Kathmandu", "country": "Nepal", "region": "Asia", "cost_index": 2, "popularity_score": 8.4, "lat": 27.7172, "lng": 85.3240, "avg_daily_cost": 3200, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800", "description": "Himalayan gateway surrounded by stupas, prayer flags, and mountain vistas."},

    # Americas
    {"name": "New York City", "country": "United States", "region": "Americas", "cost_index": 9, "popularity_score": 9.9, "lat": 40.7128, "lng": -74.0060, "avg_daily_cost": 20000, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800", "description": "The city that never sleeps, with Central Park, Broadway, skyline views, and energy."},
    {"name": "San Francisco", "country": "United States", "region": "Americas", "cost_index": 9, "popularity_score": 9.1, "lat": 37.7749, "lng": -122.4194, "avg_daily_cost": 18500, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800", "description": "Golden Gate Bridge, historic cable cars, foggy bay views, and tech innovation."},
    {"name": "Rio de Janeiro", "country": "Brazil", "region": "Americas", "cost_index": 5, "popularity_score": 9.2, "lat": -22.9068, "lng": -43.1729, "avg_daily_cost": 7200, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800", "description": "Christ the Redeemer atop Corcovado, Copacabana sands, and samba rhythms."},
    {"name": "Buenos Aires", "country": "Argentina", "region": "Americas", "cost_index": 4, "popularity_score": 9.0, "lat": -34.6037, "lng": -58.3816, "avg_daily_cost": 6000, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800", "description": "The Paris of South America with passionate tango, steak houses, and colorful La Boca."},
    {"name": "Cusco", "country": "Peru", "region": "Americas", "cost_index": 4, "popularity_score": 9.3, "lat": -13.5319, "lng": -71.9675, "avg_daily_cost": 5000, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800", "description": "Inca imperial capital nestled in the Andes, starting point for Machu Picchu."},
    {"name": "Mexico City", "country": "Mexico", "region": "Americas", "cost_index": 4, "popularity_score": 9.1, "lat": 19.4326, "lng": -99.1332, "avg_daily_cost": 5500, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800", "description": "High-altitude sprawl with Aztec ruins, Frida Kahlo art, and unmatched culinary scene."},
    {"name": "Vancouver", "country": "Canada", "region": "Americas", "cost_index": 8, "popularity_score": 8.9, "lat": 49.2827, "lng": -123.1207, "avg_daily_cost": 15000, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1559511260-66a65e0982d5?w=800", "description": "Pacific coastal beauty framed by snow-capped peaks and Stanley Park rain forests."},
    {"name": "Montreal", "country": "Canada", "region": "Americas", "cost_index": 6, "popularity_score": 8.7, "lat": 45.5017, "lng": -73.5673, "avg_daily_cost": 11000, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1519178173646-c73e164478bf?w=800", "description": "French-Canadian charm with Old Port cobblestones, jazz festivals, and bagels."},
    {"name": "Cartagena", "country": "Colombia", "region": "Americas", "cost_index": 4, "popularity_score": 8.8, "lat": 10.3910, "lng": -75.4794, "avg_daily_cost": 5000, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1583531352515-8884af319dc1?w=800", "description": "Walled Caribbean city with bougainvillea balconies, colorful colonial facades."},

    # Africa & Oceania
    {"name": "Cape Town", "country": "South Africa", "region": "Africa", "cost_index": 5, "popularity_score": 9.4, "lat": -33.9249, "lng": 18.4241, "avg_daily_cost": 7500, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800", "description": "Table Mountain backdrop, penguin colonies at Boulders Beach, and Cape wine valleys."},
    {"name": "Marrakech", "country": "Morocco", "region": "Africa", "cost_index": 4, "popularity_score": 9.2, "lat": 31.6295, "lng": -7.9811, "avg_daily_cost": 5500, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800", "description": "Sensory Medina, Jemaa el-Fnaa square snake charmers, and tranquil riads."},
    {"name": "Cairo", "country": "Egypt", "region": "Africa", "cost_index": 3, "popularity_score": 9.0, "lat": 30.0444, "lng": 31.2357, "avg_daily_cost": 4200, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800", "description": "The Nile River and the Great Pyramids of Giza standing at the threshold of antiquity."},
    {"name": "Sydney", "country": "Australia", "region": "Oceania", "cost_index": 8, "popularity_score": 9.6, "lat": -33.8688, "lng": 151.2093, "avg_daily_cost": 16500, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800", "description": "Sydney Opera House sails, Harbour Bridge climbs, and Bondi Beach surf culture."},
    {"name": "Melbourne", "country": "Australia", "region": "Oceania", "cost_index": 8, "popularity_score": 9.2, "lat": -37.8136, "lng": 144.9631, "avg_daily_cost": 15000, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=800", "description": "Laneway espresso culture, dynamic street art, world-class dining, and rooftop bars."},
    {"name": "Auckland", "country": "New Zealand", "region": "Oceania", "cost_index": 8, "popularity_score": 8.8, "lat": -36.8485, "lng": 174.7633, "avg_daily_cost": 14000, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800", "description": "City of Sails between two sparkling harbors, gateway to volcanic islands."},
    {"name": "Queenstown", "country": "New Zealand", "region": "Oceania", "cost_index": 8, "popularity_score": 9.1, "lat": -45.0312, "lng": 168.6626, "avg_daily_cost": 15500, "currency": "INR", "image_url": "https://images.unsplash.com/photo-1589802829985-817e51171b92?w=800", "description": "World adventure capital surrounded by The Remarkables mountain range and Lake Wakatipu."}
]

SAMPLE_ACTIVITIES_BY_CITY = {
    "Paris": [
        {"name": "Louvre Museum Guided Tour", "category": "Culture", "cost": 5500, "duration_hours": 3.0, "rating": 4.9, "image_url": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600", "description": "Marvel at the Mona Lisa, Venus de Milo, and masterworks with skip-the-line access."},
        {"name": "Eiffel Tower Summit by Night", "category": "Sightseeing", "cost": 3800, "duration_hours": 2.0, "rating": 4.8, "image_url": "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600", "description": "Elevator ride to the top observation deck overlooking illuminated Parisian avenues."},
        {"name": "Seine River Dinner Cruise", "category": "Food", "cost": 9500, "duration_hours": 2.5, "rating": 4.7, "image_url": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600", "description": "3-course gourmet French dinner while gliding past Notre-Dame and historic bridges."},
        {"name": "Montmartre & Sacré-Cœur Walking Tour", "category": "Culture", "cost": 2200, "duration_hours": 2.5, "rating": 4.6, "image_url": "https://images.unsplash.com/photo-1520939817895-060bdef4ad1b?w=600", "description": "Explore cobblestone alleys where Picasso and Van Gogh painted."}
    ],
    "Rome": [
        {"name": "Colosseum & Ancient Forum Tour", "category": "Culture", "cost": 4800, "duration_hours": 3.0, "rating": 4.9, "image_url": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600", "description": "Walk the gladiator arena floor and discover the ruins of the Roman Empire."},
        {"name": "Vatican Museums & Sistine Chapel", "category": "Culture", "cost": 5200, "duration_hours": 3.5, "rating": 4.9, "image_url": "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600", "description": "Witness Michelangelo's Sistine ceiling and St. Peter's Basilica."},
        {"name": "Trastevere Evening Food & Wine Stroll", "category": "Food", "cost": 6500, "duration_hours": 3.0, "rating": 4.8, "image_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600", "description": "Taste authentic carbonara, suppli, artisan gelato, and local Lazio wines."}
    ],
    "Barcelona": [
        {"name": "Sagrada Família Fast-Track Tour", "category": "Culture", "cost": 3500, "duration_hours": 2.0, "rating": 4.9, "image_url": "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600", "description": "Antoni Gaudí's unfinished cathedral with dazzling stained-glass light."},
        {"name": "Park Güell Architectural Walk", "category": "Sightseeing", "cost": 1800, "duration_hours": 1.5, "rating": 4.7, "image_url": "https://images.unsplash.com/photo-1564221710304-0b37c8b9d729?w=600", "description": "Mosaic dragon terraces and whimsical pavilions overlooking the Mediterranean."},
        {"name": "Tapas & Sangria Tasting in El Born", "category": "Food", "cost": 5500, "duration_hours": 2.5, "rating": 4.8, "image_url": "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=600", "description": "Sample Iberian ham, patatas bravas, and fresh seafood across 4 tapas bars."}
    ]
}

def seed_database():
    app = create_app()
    with app.app_context():
        print("Recreating database tables with INR currency...")
        db.drop_all()
        db.create_all()

        # 1. Seed Users
        admin_user = User(
            name="Admin Commander",
            email="admin@globetrotter.io",
            role="admin",
            avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=admin_globetrotter",
            bio="Platform supervisor & lead curator.",
            preferred_currency="INR"
        )
        admin_user.set_password("AdminPass123!")
        admin_user.save()
        print("Created Admin user: admin@globetrotter.io / AdminPass123!")

        demo_user = User(
            name="Sophia Vance",
            email="traveler@globetrotter.io",
            role="user",
            avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
            bio="Passionate explorer, travel photographer, and culinary enthusiast.",
            preferred_currency="INR"
        )
        demo_user.set_password("Traveler123!")
        demo_user.save()
        print("Created Demo user: traveler@globetrotter.io / Traveler123!")

        # 2. Seed Cities
        print(f"Seeding {len(CITIES_DATA)} cities...")
        city_lookup = {}
        for c in CITIES_DATA:
            city = City(**c)
            city.save()
            city_lookup[c["name"]] = city

        # 3. Seed Activities
        print("Seeding city activities in INR...")
        for city_name, acts in SAMPLE_ACTIVITIES_BY_CITY.items():
            if city_name in city_lookup:
                city = city_lookup[city_name]
                for act_data in acts:
                    act = Activity(city_id=city.id, **act_data)
                    act.save()

        # Seed generic activities for other cities
        generic_categories = [
            ("Historic Center Walking Tour", "Culture", 2200, 2.5, 4.7, "Explore ancient architecture, hidden plazas, and local stories with a licensed guide."),
            ("Culinary Street Food Tasting", "Food", 3800, 3.0, 4.8, "Sample regional specialties, savory bites, and sweet delicacies."),
            ("Panoramic City Highlights & Viewpoint", "Sightseeing", 2500, 2.0, 4.6, "Stunning skyline views and prime photography spots."),
            ("Nature & Scenic Excursion", "Nature", 4800, 4.0, 4.8, "Escape into picturesque landscapes, parks, or coastal lookouts.")
        ]
        for city_name, city in city_lookup.items():
            if city_name not in SAMPLE_ACTIVITIES_BY_CITY:
                for name_tpl, cat, cost, dur, rat, desc in generic_categories:
                    act_name = f"{city.name} {name_tpl}"
                    Activity(
                        city_id=city.id,
                        name=act_name,
                        category=cat,
                        cost=round(cost * (city.cost_index / 6.0)),
                        duration_hours=dur,
                        rating=rat,
                        image_url=city.image_url,
                        description=desc
                    ).save()

        # 4. Seed Demo User Trip in INR
        print("Seeding demo user Grand European Trip in INR...")
        today = date.today()
        trip_start = today + timedelta(days=20)
        trip_end = trip_start + timedelta(days=12)

        trip = Trip(
            user_id=demo_user.id,
            name="Grand European Summer Odyssey",
            description="A multi-country adventure through the art, culinary wonders, and historic architecture of Western Europe.",
            start_date=trip_start,
            end_date=trip_end,
            cover_photo_url="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200",
            total_budget=280000.0,
            is_public=True,
            status="upcoming"
        )
        trip.generate_slug()
        trip.save()

        stop1 = Stop(
            trip_id=trip.id,
            city_id=city_lookup["Paris"].id,
            arrival_date=trip_start,
            departure_date=trip_start + timedelta(days=4),
            order_index=0,
            notes="Stay near Le Marais. Reserve museum passes early.",
            transport_mode="Flight",
            budget_estimate=95000.0
        ).save()

        stop2 = Stop(
            trip_id=trip.id,
            city_id=city_lookup["Rome"].id,
            arrival_date=trip_start + timedelta(days=4),
            departure_date=trip_start + timedelta(days=8),
            order_index=1,
            notes="Colosseum morning tour, Trastevere evenings.",
            transport_mode="Flight",
            budget_estimate=88000.0
        ).save()

        stop3 = Stop(
            trip_id=trip.id,
            city_id=city_lookup["Barcelona"].id,
            arrival_date=trip_start + timedelta(days=8),
            departure_date=trip_end,
            order_index=2,
            notes="Beach sunset and Gothic Quarter tapas crawl.",
            transport_mode="Flight",
            budget_estimate=80000.0
        ).save()

        # Schedule activities
        paris_acts = Activity.query.filter_by(city_id=city_lookup["Paris"].id).all()
        if paris_acts:
            StopActivity(stop_id=stop1.id, activity_id=paris_acts[0].id, scheduled_date=trip_start + timedelta(days=1), scheduled_time="10:00").save()
            if len(paris_acts) > 1:
                StopActivity(stop_id=stop1.id, activity_id=paris_acts[1].id, scheduled_date=trip_start + timedelta(days=2), scheduled_time="19:30").save()

        rome_acts = Activity.query.filter_by(city_id=city_lookup["Rome"].id).all()
        if rome_acts:
            StopActivity(stop_id=stop2.id, activity_id=rome_acts[0].id, scheduled_date=trip_start + timedelta(days=5), scheduled_time="09:00").save()

        bcn_acts = Activity.query.filter_by(city_id=city_lookup["Barcelona"].id).all()
        if bcn_acts:
            StopActivity(stop_id=stop3.id, activity_id=bcn_acts[0].id, scheduled_date=trip_start + timedelta(days=9), scheduled_time="11:00").save()

        # Add sample INR expenses
        Expense(trip_id=trip.id, stop_id=stop1.id, category="stay", amount=42000.0, label="Boutique Hotel Marais 4 nights", date=trip_start).save()
        Expense(trip_id=trip.id, stop_id=stop1.id, category="transport", amount=35000.0, label="International Flight to Paris", date=trip_start).save()
        Expense(trip_id=trip.id, stop_id=stop1.id, category="meals", amount=12500.0, label="French Bistro & Wine Tasting", date=trip_start + timedelta(days=2)).save()
        Expense(trip_id=trip.id, stop_id=stop2.id, category="stay", amount=38000.0, label="Piazza Navona Suites 4 nights", date=trip_start + timedelta(days=4)).save()
        Expense(trip_id=trip.id, stop_id=stop2.id, category="transport", amount=8500.0, label="Flight Paris -> Rome", date=trip_start + timedelta(days=4)).save()
        Expense(trip_id=trip.id, stop_id=stop3.id, category="stay", amount=32000.0, label="Eixample Design Apartment", date=trip_start + timedelta(days=8)).save()

        # Public share link
        SharedLink(trip_id=trip.id, slug=trip.share_slug, is_active=True, views_count=26).save()

        print("Database seeded with pure live data in INR successfully!")

if __name__ == "__main__":
    seed_database()

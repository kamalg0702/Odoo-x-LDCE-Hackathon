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
    {"name": "Paris", "country": "France", "region": "Europe", "cost_index": 8, "popularity_score": 9.8, "lat": 48.8566, "lng": 2.3522, "avg_daily_cost": 180, "image_url": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800", "description": "The City of Light, renowned for art, fashion, gastronomy, and the iconic Eiffel Tower."},
    {"name": "Rome", "country": "Italy", "region": "Europe", "cost_index": 7, "popularity_score": 9.6, "lat": 41.9028, "lng": 12.4964, "avg_daily_cost": 150, "image_url": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800", "description": "The Eternal City, where ancient Colosseum ruins meet bustling piazzas and espresso culture."},
    {"name": "Barcelona", "country": "Spain", "region": "Europe", "cost_index": 6, "popularity_score": 9.5, "lat": 41.3879, "lng": 2.16992, "avg_daily_cost": 140, "image_url": "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800", "description": "Gaudí architecture, Mediterranean beaches, world-class tapas, and gothic charm."},
    {"name": "Amsterdam", "country": "Netherlands", "region": "Europe", "cost_index": 8, "popularity_score": 9.2, "lat": 52.3676, "lng": 4.9041, "avg_daily_cost": 175, "image_url": "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800", "description": "Picturesque canal rings, historic houseboats, cycling paths, and master art museums."},
    {"name": "London", "country": "United Kingdom", "region": "Europe", "cost_index": 9, "popularity_score": 9.7, "lat": 51.5074, "lng": -0.1278, "avg_daily_cost": 210, "image_url": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800", "description": "Cosmopolitan capital rich with royal landmarks, West End theater, and historic pubs."},
    {"name": "Vienna", "country": "Austria", "region": "Europe", "cost_index": 7, "popularity_score": 8.9, "lat": 48.2082, "lng": 16.3738, "avg_daily_cost": 145, "image_url": "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800", "description": "Imperial palaces, grand classical music heritage, and elegant coffeehouse tradition."},
    {"name": "Prague", "country": "Czech Republic", "region": "Europe", "cost_index": 5, "popularity_score": 9.1, "lat": 50.0755, "lng": 14.4378, "avg_daily_cost": 95, "image_url": "https://images.unsplash.com/photo-1541849546-216549ae216d?w=800", "description": "Fairy-tale spires, Charles Bridge cobblestones, and bohemian artisan culture."},
    {"name": "Lisbon", "country": "Portugal", "region": "Europe", "cost_index": 5, "popularity_score": 9.3, "lat": 38.7223, "lng": -9.1393, "avg_daily_cost": 105, "image_url": "https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=800", "description": "Sun-drenched hills, yellow vintage trams, pastel de nata, and Atlantic ocean breezes."},
    {"name": "Berlin", "country": "Germany", "region": "Europe", "cost_index": 6, "popularity_score": 9.0, "lat": 52.5200, "lng": 13.4050, "avg_daily_cost": 130, "image_url": "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800", "description": "Vibrant creative capital pulsing with history, modern galleries, and eclectic nightlife."},
    {"name": "Athens", "country": "Greece", "region": "Europe", "cost_index": 5, "popularity_score": 8.8, "lat": 37.9838, "lng": 23.7275, "avg_daily_cost": 90, "image_url": "https://images.unsplash.com/photo-1555993539-1732916b8235?w=800", "description": "The cradle of Western civilization with the majestic Parthenon and taverna culture."},
    {"name": "Venice", "country": "Italy", "region": "Europe", "cost_index": 8, "popularity_score": 9.3, "lat": 45.4408, "lng": 12.3155, "avg_daily_cost": 190, "image_url": "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800", "description": "A floating labyrinth of romantic canals, gothic bridges, and marble palazzos."},
    {"name": "Zurich", "country": "Switzerland", "region": "Europe", "cost_index": 10, "popularity_score": 8.7, "lat": 47.3769, "lng": 8.5417, "avg_daily_cost": 250, "image_url": "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800", "description": "Alpine lake beauty paired with Swiss precision, luxury shopping, and clean streets."},
    {"name": "Dubrovnik", "country": "Croatia", "region": "Europe", "cost_index": 6, "popularity_score": 8.9, "lat": 42.6507, "lng": 18.0944, "avg_daily_cost": 120, "image_url": "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800", "description": "The Pearl of the Adriatic, surrounded by ancient sea walls and turquoise waters."},
    {"name": "Budapest", "country": "Hungary", "region": "Europe", "cost_index": 4, "popularity_score": 8.9, "lat": 47.4979, "lng": 19.0402, "avg_daily_cost": 85, "image_url": "https://images.unsplash.com/photo-1508873696983-2df570464753?w=800", "description": "Thermal bath culture, grand Parliament on the Danube, and trendy ruin bars."},
    {"name": "Reykjavik", "country": "Iceland", "region": "Europe", "cost_index": 9, "popularity_score": 8.6, "lat": 64.1466, "lng": -21.9426, "avg_daily_cost": 220, "image_url": "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800", "description": "Gateway to volcanoes, geysers, thermal lagoons, and magical Northern Lights."},

    # Asia & Middle East
    {"name": "Tokyo", "country": "Japan", "region": "Asia", "cost_index": 8, "popularity_score": 9.9, "lat": 35.6762, "lng": 139.6503, "avg_daily_cost": 160, "image_url": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800", "description": "Hyper-modern neon skyscrapers blending seamlessly with ancient Shinto shrines."},
    {"name": "Kyoto", "country": "Japan", "region": "Asia", "cost_index": 7, "popularity_score": 9.4, "lat": 35.0116, "lng": 135.7681, "avg_daily_cost": 140, "image_url": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800", "description": "Classical Japanese soul with thousands of temples, zen gardens, and geisha districts."},
    {"name": "Bangkok", "country": "Thailand", "region": "Asia", "cost_index": 3, "popularity_score": 9.7, "lat": 13.7563, "lng": 100.5018, "avg_daily_cost": 65, "image_url": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800", "description": "Golden temples, buzzing floating markets, street food wonders, and vibrant energy."},
    {"name": "Singapore", "country": "Singapore", "region": "Asia", "cost_index": 9, "popularity_score": 9.5, "lat": 1.3521, "lng": 103.8198, "avg_daily_cost": 190, "image_url": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800", "description": "Futuristic garden city known for Supertree groves, diverse hawkers, and luxury."},
    {"name": "Seoul", "country": "South Korea", "region": "Asia", "cost_index": 6, "popularity_score": 9.3, "lat": 37.5665, "lng": 126.9780, "avg_daily_cost": 115, "image_url": "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800", "description": "K-culture epicenter, royal dynastic palaces, futuristic design, and night markets."},
    {"name": "Bali", "country": "Indonesia", "region": "Asia", "cost_index": 3, "popularity_score": 9.6, "lat": -8.4095, "lng": 115.1889, "avg_daily_cost": 55, "image_url": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800", "description": "Island of the Gods featuring lush emerald rice terraces, cliffside temples, and surf."},
    {"name": "Dubai", "country": "United Arab Emirates", "region": "Middle East", "cost_index": 9, "popularity_score": 9.4, "lat": 25.2048, "lng": 55.2708, "avg_daily_cost": 210, "image_url": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800", "description": "Opulent desert metropolis with Burj Khalifa, man-made palm islands, and luxury souks."},
    {"name": "Hong Kong", "country": "Hong Kong", "region": "Asia", "cost_index": 8, "popularity_score": 9.1, "lat": 22.3193, "lng": 114.1694, "avg_daily_cost": 170, "image_url": "https://images.unsplash.com/photo-1506970845346-22b82173f4b2?w=800", "description": "Iconic Victoria Harbour skyline, dim sum dining, and towering mountainous backdrops."},
    {"name": "Hanoi", "country": "Vietnam", "region": "Asia", "cost_index": 2, "popularity_score": 8.7, "lat": 21.0285, "lng": 105.8542, "avg_daily_cost": 45, "image_url": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800", "description": "Centuries-old Old Quarter, tranquil lakes, aromatic pho, and colonial architecture."},
    {"name": "Taipei", "country": "Taiwan", "region": "Asia", "cost_index": 5, "popularity_score": 8.8, "lat": 25.0330, "lng": 121.5654, "avg_daily_cost": 80, "image_url": "https://images.unsplash.com/photo-1508248467877-aec1b08de376?w=800", "description": "World-famous night markets, friendly locals, Taipei 101, and thermal hot springs."},
    {"name": "Jaipur", "country": "India", "region": "Asia", "cost_index": 3, "popularity_score": 8.9, "lat": 26.9124, "lng": 75.7873, "avg_daily_cost": 45, "image_url": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800", "description": "The Pink City with regal fortresses, ornate palaces, and rich Rajasthani textiles."},
    {"name": "Istanbul", "country": "Turkey", "region": "Middle East", "cost_index": 4, "popularity_score": 9.5, "lat": 41.0082, "lng": 28.9784, "avg_daily_cost": 75, "image_url": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800", "description": "Where East meets West across the Bosphorus, with Hagia Sophia and spice bazaars."},
    {"name": "Petra (Wadi Musa)", "country": "Jordan", "region": "Middle East", "cost_index": 6, "popularity_score": 8.9, "lat": 30.3285, "lng": 35.4444, "avg_daily_cost": 110, "image_url": "https://images.unsplash.com/photo-1579606032822-263d9178229b?w=800", "description": "Ancient rose-red city carved directly into sandstone cliffs of the desert."},
    {"name": "Kathmandu", "country": "Nepal", "region": "Asia", "cost_index": 2, "popularity_score": 8.4, "lat": 27.7172, "lng": 85.3240, "avg_daily_cost": 40, "image_url": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800", "description": "Himalayan gateway surrounded by stupas, prayer flags, and mountain vistas."},
    {"name": "Doha", "country": "Qatar", "region": "Middle East", "cost_index": 8, "popularity_score": 8.5, "lat": 25.2854, "lng": 51.5310, "avg_daily_cost": 180, "image_url": "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800", "description": "Sleek Gulf shoreline, Museum of Islamic Art, and bustling Souq Waqif."},

    # Americas
    {"name": "New York City", "country": "United States", "region": "Americas", "cost_index": 9, "popularity_score": 9.9, "lat": 40.7128, "lng": -74.0060, "avg_daily_cost": 240, "image_url": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800", "description": "The city that never sleeps, with Central Park, Broadway, skyline views, and energy."},
    {"name": "San Francisco", "country": "United States", "region": "Americas", "cost_index": 9, "popularity_score": 9.1, "lat": 37.7749, "lng": -122.4194, "avg_daily_cost": 220, "image_url": "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800", "description": "Golden Gate Bridge, historic cable cars, foggy bay views, and tech innovation."},
    {"name": "Rio de Janeiro", "country": "Brazil", "region": "Americas", "cost_index": 5, "popularity_score": 9.2, "lat": -22.9068, "lng": -43.1729, "avg_daily_cost": 85, "image_url": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800", "description": "Christ the Redeemer atop Corcovado, Copacabana sands, and samba rhythms."},
    {"name": "Buenos Aires", "country": "Argentina", "region": "Americas", "cost_index": 4, "popularity_score": 9.0, "lat": -34.6037, "lng": -58.3816, "avg_daily_cost": 70, "image_url": "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800", "description": "The Paris of South America with passionate tango, steak houses, and colorful La Boca."},
    {"name": "Cusco", "country": "Peru", "region": "Americas", "cost_index": 4, "popularity_score": 9.3, "lat": -13.5319, "lng": -71.9675, "avg_daily_cost": 60, "image_url": "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800", "description": "Inca imperial capital nestled in the Andes, starting point for Machu Picchu."},
    {"name": "Mexico City", "country": "Mexico", "region": "Americas", "cost_index": 4, "popularity_score": 9.1, "lat": 19.4326, "lng": -99.1332, "avg_daily_cost": 65, "image_url": "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800", "description": "High-altitude sprawl with Aztec ruins, Frida Kahlo art, and unmatched culinary scene."},
    {"name": "Vancouver", "country": "Canada", "region": "Americas", "cost_index": 8, "popularity_score": 8.9, "lat": 49.2827, "lng": -123.1207, "avg_daily_cost": 175, "image_url": "https://images.unsplash.com/photo-1559511260-66a65e0982d5?w=800", "description": "Pacific coastal beauty framed by snow-capped peaks and Stanley Park rain forests."},
    {"name": "Montreal", "country": "Canada", "region": "Americas", "cost_index": 6, "popularity_score": 8.7, "lat": 45.5017, "lng": -73.5673, "avg_daily_cost": 130, "image_url": "https://images.unsplash.com/photo-1519178173646-c73e164478bf?w=800", "description": "French-Canadian charm with Old Port cobblestones, jazz festivals, and bagels."},
    {"name": "Havana", "country": "Cuba", "region": "Americas", "cost_index": 3, "popularity_score": 8.6, "lat": 23.1136, "lng": -82.3666, "avg_daily_cost": 50, "image_url": "https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=800", "description": "Classic 1950s American cars, colonial plazas, salsa music, and Caribbean sunsets."},
    {"name": "Cartagena", "country": "Colombia", "region": "Americas", "cost_index": 4, "popularity_score": 8.8, "lat": 10.3910, "lng": -75.4794, "avg_daily_cost": 60, "image_url": "https://images.unsplash.com/photo-1583531352515-8884af319dc1?w=800", "description": "Walled Caribbean city with bougainvillea balconies, colorful colonial facades."},

    # Africa & Oceania
    {"name": "Cape Town", "country": "South Africa", "region": "Africa", "cost_index": 5, "popularity_score": 9.4, "lat": -33.9249, "lng": 18.4241, "avg_daily_cost": 85, "image_url": "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800", "description": "Table Mountain backdrop, penguin colonies at Boulders Beach, and Cape wine valleys."},
    {"name": "Marrakech", "country": "Morocco", "region": "Africa", "cost_index": 4, "popularity_score": 9.2, "lat": 31.6295, "lng": -7.9811, "avg_daily_cost": 65, "image_url": "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800", "description": "Sensory Medina, Jemaa el-Fnaa square snake charmers, and tranquil riads."},
    {"name": "Cairo", "country": "Egypt", "region": "Africa", "cost_index": 3, "popularity_score": 9.0, "lat": 30.0444, "lng": 31.2357, "avg_daily_cost": 50, "image_url": "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800", "description": "The Nile River and the Great Pyramids of Giza standing at the threshold of antiquity."},
    {"name": "Nairobi", "country": "Kenya", "region": "Africa", "cost_index": 4, "popularity_score": 8.3, "lat": -1.2921, "lng": 36.8219, "avg_daily_cost": 70, "image_url": "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800", "description": "The Safari capital with a national park where wildlife roams before a modern skyline."},
    {"name": "Zanzibar City", "country": "Tanzania", "region": "Africa", "cost_index": 4, "popularity_score": 8.7, "lat": -6.1659, "lng": 39.2026, "avg_daily_cost": 65, "image_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800", "description": "Stone Town spice alleys, turquoise Indian Ocean waters, and white sandy beaches."},
    {"name": "Sydney", "country": "Australia", "region": "Oceania", "cost_index": 8, "popularity_score": 9.6, "lat": -33.8688, "lng": 151.2093, "avg_daily_cost": 190, "image_url": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800", "description": "Sydney Opera House sails, Harbour Bridge climbs, and Bondi Beach surf culture."},
    {"name": "Melbourne", "country": "Australia", "region": "Oceania", "cost_index": 8, "popularity_score": 9.2, "lat": -37.8136, "lng": 144.9631, "avg_daily_cost": 175, "image_url": "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=800", "description": "Laneway espresso culture, dynamic street art, world-class dining, and rooftop bars."},
    {"name": "Auckland", "country": "New Zealand", "region": "Oceania", "cost_index": 8, "popularity_score": 8.8, "lat": -36.8485, "lng": 174.7633, "avg_daily_cost": 160, "image_url": "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800", "description": "City of Sails between two sparkling harbors, gateway to volcanic islands."},
    {"name": "Queenstown", "country": "New Zealand", "region": "Oceania", "cost_index": 8, "popularity_score": 9.1, "lat": -45.0312, "lng": 168.6626, "avg_daily_cost": 180, "image_url": "https://images.unsplash.com/photo-1589802829985-817e51171b92?w=800", "description": "World adventure capital surrounded by The Remarkables mountain range and Lake Wakatipu."},
    {"name": "Fiji (Nadi)", "country": "Fiji", "region": "Oceania", "cost_index": 6, "popularity_score": 8.6, "lat": -17.8000, "lng": 177.4167, "avg_daily_cost": 120, "image_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800", "description": "Tropical South Pacific paradise known for coral reefs, lagoons, and warm Bula spirit."}
]

SAMPLE_ACTIVITIES_BY_CITY = {
    "Paris": [
        {"name": "Louvre Museum Guided Tour", "category": "Culture", "cost": 65, "duration_hours": 3.0, "rating": 4.9, "image_url": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600", "description": "Marvel at the Mona Lisa, Venus de Milo, and masterworks with skip-the-line access."},
        {"name": "Eiffel Tower Summit by Night", "category": "Sightseeing", "cost": 45, "duration_hours": 2.0, "rating": 4.8, "image_url": "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600", "description": "Elevator ride to the top observation deck overlooking illuminated Parisian avenues."},
        {"name": "Seine River Dinner Cruise", "category": "Food", "cost": 110, "duration_hours": 2.5, "rating": 4.7, "image_url": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600", "description": "3-course gourmet French dinner while gliding past Notre-Dame and historic bridges."},
        {"name": "Montmartre & Sacré-Cœur Walking Tour", "category": "Culture", "cost": 25, "duration_hours": 2.5, "rating": 4.6, "image_url": "https://images.unsplash.com/photo-1520939817895-060bdef4ad1b?w=600", "description": "Explore cobblestone alleys where Picasso and Van Gogh painted."},
        {"name": "Croissant & Pastry Masterclass", "category": "Food", "cost": 85, "duration_hours": 3.0, "rating": 4.9, "image_url": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600", "description": "Hands-on bakery workshop creating flaky artisan French viennoiseries."}
    ],
    "Rome": [
        {"name": "Colosseum & Ancient Forum Tour", "category": "Culture", "cost": 55, "duration_hours": 3.0, "rating": 4.9, "image_url": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600", "description": "Walk the gladiator arena floor and discover the ruins of the Roman Empire."},
        {"name": "Vatican Museums & Sistine Chapel", "category": "Culture", "cost": 60, "duration_hours": 3.5, "rating": 4.9, "image_url": "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600", "description": "Witness Michelangelo's Sistine ceiling and St. Peter's Basilica."},
        {"name": "Trastevere Evening Food & Wine Stroll", "category": "Food", "cost": 75, "duration_hours": 3.0, "rating": 4.8, "image_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600", "description": "Taste authentic carbonara, suppli, artisan gelato, and local Lazio wines."},
        {"name": "Vespa City Highlights Tour", "category": "Adventure", "cost": 95, "duration_hours": 3.0, "rating": 4.8, "image_url": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600", "description": "Zip through historic piazzas on a classic Italian scooter."},
        {"name": "Handmade Pasta & Tiramisu Workshop", "category": "Food", "cost": 70, "duration_hours": 2.5, "rating": 4.9, "image_url": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600", "description": "Learn culinary secrets from a Roman chef in a cozy kitchen setting."}
    ],
    "Barcelona": [
        {"name": "Sagrada Família Fast-Track Tour", "category": "Culture", "cost": 40, "duration_hours": 2.0, "rating": 4.9, "image_url": "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600", "description": "Antoni Gaudí's unfinished cathedral with dazzling stained-glass light."},
        {"name": "Park Güell Architectural Walk", "category": "Sightseeing", "cost": 20, "duration_hours": 1.5, "rating": 4.7, "image_url": "https://images.unsplash.com/photo-1564221710304-0b37c8b9d729?w=600", "description": "Mosaic dragon terraces and whimsical pavilions overlooking the Mediterranean."},
        {"name": "Tapas & Sangria Tasting in El Born", "category": "Food", "cost": 65, "duration_hours": 2.5, "rating": 4.8, "image_url": "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=600", "description": "Sample Iberian ham, patatas bravas, and fresh seafood across 4 tapas bars."},
        {"name": "Sunset Catamaran Sailing Experience", "category": "Adventure", "cost": 50, "duration_hours": 2.0, "rating": 4.8, "image_url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600", "description": "Sail along the Barcelona coastline with chilled cava and acoustic music."},
        {"name": "Gothic Quarter History & Legend Tour", "category": "Culture", "cost": 22, "duration_hours": 2.0, "rating": 4.6, "image_url": "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600", "description": "Discover Roman walls and medieval plazas in the heart of Ciutat Vella."}
    ],
    "Tokyo": [
        {"name": "Shibuya Crossing & Harajuku Culture Tour", "category": "Sightseeing", "cost": 35, "duration_hours": 3.0, "rating": 4.8, "image_url": "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600", "description": "Experience the world's busiest scramble intersection and quirky street fashion."},
        {"name": "Tsukiji Outer Market Sushi Tasting", "category": "Food", "cost": 80, "duration_hours": 2.5, "rating": 4.9, "image_url": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600", "description": "Fresh tuna sashimi, wagyu skewers, tamagoyaki, and matcha tea."},
        {"name": "teamLab Planets Immersive Digital Art", "category": "Culture", "cost": 42, "duration_hours": 2.0, "rating": 4.9, "image_url": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600", "description": "Walk through water and body-immersive digital flower installations."},
        {"name": "Mount Fuji & Hakone Day Trip", "category": "Adventure", "cost": 125, "duration_hours": 9.0, "rating": 4.8, "image_url": "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600", "description": "Cruise Lake Ashi on a pirate ship and take the ropeway with Fuji views."},
        {"name": "Akihabara Gaming & Anime Tour", "category": "Nightlife", "cost": 40, "duration_hours": 2.5, "rating": 4.6, "image_url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600", "description": "Explore electronic wonderland, retro arcades, and themed cafes."}
    ],
    "New York City": [
        {"name": "Summit One Vanderbilt Experience", "category": "Sightseeing", "cost": 45, "duration_hours": 2.0, "rating": 4.9, "image_url": "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600", "description": "Mirrored glass infinity rooms high above Midtown Manhattan with Chrysler views."},
        {"name": "Broadway Musical Premium Seats", "category": "Culture", "cost": 150, "duration_hours": 3.0, "rating": 4.9, "image_url": "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600", "description": "World-class theatrical production in Times Square's iconic theater district."},
        {"name": "Chelsea Market & High Line Food Walk", "category": "Food", "cost": 75, "duration_hours": 2.5, "rating": 4.8, "image_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600", "description": "Lobster rolls, artisan tacos, and elevated park vistas over the Meatpacking District."},
        {"name": "Brooklyn Bridge Sunset Bike Ride", "category": "Adventure", "cost": 45, "duration_hours": 2.5, "rating": 4.7, "image_url": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600", "description": "Pedal across the iconic bridge to DUMBO for skyline photography."},
        {"name": "Speakeasy Cocktail Tour in East Village", "category": "Nightlife", "cost": 85, "duration_hours": 3.0, "rating": 4.8, "image_url": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600", "description": "Hidden doors and prohibition-era craft mixology in historic bohemian bars."}
    ],
    "Cape Town": [
        {"name": "Table Mountain Cable Car & Summit Walk", "category": "Nature", "cost": 30, "duration_hours": 3.0, "rating": 4.9, "image_url": "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600", "description": "Rotating cable car ride to panoramic vistas over Atlantic coastline and city bowl."},
        {"name": "Cape Point & Boulders Penguin Tour", "category": "Adventure", "cost": 85, "duration_hours": 7.0, "rating": 4.9, "image_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600", "description": "Scenic Chapman's Peak drive to the African penguin colony and Cape of Good Hope."},
        {"name": "Stellenbosch & Franschhoek Wine Tram", "category": "Food", "cost": 95, "duration_hours": 8.0, "rating": 4.9, "image_url": "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600", "description": "Hop-on hop-off open-air tram tour through historic Cape Dutch wine estates."},
        {"name": "Shark Cage Diving in Gansbaai", "category": "Adventure", "cost": 175, "duration_hours": 6.0, "rating": 4.7, "image_url": "https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=600", "description": "Thrilling marine encounter with Great White sharks in natural waters."},
        {"name": "Bo-Kaap Cooking & Spice Tour", "category": "Culture", "cost": 50, "duration_hours": 2.5, "rating": 4.8, "image_url": "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600", "description": "Learn Cape Malay samosas and fragrant curries in colorful historic quarter."}
    ]
}

def seed_database():
    app = create_app()
    with app.app_context():
        print("Recreating database tables...")
        db.create_all()

        # 1. Seed Users
        admin_user = User.query.filter_by(email="admin@globetrotter.io").first()
        if not admin_user:
            admin_user = User(
                name="Admin Commander",
                email="admin@globetrotter.io",
                role="admin",
                avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=admin_globetrotter",
                bio="Platform supervisor & lead curator.",
                preferred_currency="USD"
            )
            admin_user.set_password("AdminPass123!")
            admin_user.save()
            print("Created Admin user: admin@globetrotter.io / AdminPass123!")

        demo_user = User.query.filter_by(email="traveler@globetrotter.io").first()
        if not demo_user:
            demo_user = User(
                name="Sophia Vance",
                email="traveler@globetrotter.io",
                role="user",
                avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
                bio="Passionate explorer, travel photographer, and culinary enthusiast.",
                preferred_currency="USD"
            )
            demo_user.set_password("Traveler123!")
            demo_user.save()
            print("Created Demo user: traveler@globetrotter.io / Traveler123!")

        # 2. Seed Cities
        print(f"Seeding {len(CITIES_DATA)} cities...")
        city_lookup = {}
        for c in CITIES_DATA:
            existing = City.query.filter_by(name=c["name"], country=c["country"]).first()
            if not existing:
                existing = City(**c)
                existing.save()
            city_lookup[c["name"]] = existing

        # 3. Seed Activities for major cities + generic activities for others
        print("Seeding city activities...")
        for city_name, acts in SAMPLE_ACTIVITIES_BY_CITY.items():
            if city_name in city_lookup:
                city = city_lookup[city_name]
                for act_data in acts:
                    existing_act = Activity.query.filter_by(name=act_data["name"], city_id=city.id).first()
                    if not existing_act:
                        act = Activity(city_id=city.id, **act_data)
                        act.save()

        # Seed at least 3-4 activities for all other cities
        generic_categories = [
            ("Historic Center Walking Tour", "Culture", 25, 2.5, 4.7, "Explore ancient architecture, hidden plazas, and local stories with a licensed guide."),
            ("Culinary Street Food Tasting", "Food", 45, 3.0, 4.8, "Sample regional specialties, savory bites, and sweet delicacies."),
            ("Panoramic City Highlights & Viewpoint", "Sightseeing", 30, 2.0, 4.6, "Stunning skyline views and prime photography spots."),
            ("Nature & Scenic Excursion", "Nature", 55, 4.0, 4.8, "Escape into picturesque landscapes, parks, or coastal lookouts.")
        ]
        for city_name, city in city_lookup.items():
            if city_name not in SAMPLE_ACTIVITIES_BY_CITY:
                for name_tpl, cat, cost, dur, rat, desc in generic_categories:
                    act_name = f"{city.name} {name_tpl}"
                    if not Activity.query.filter_by(name=act_name, city_id=city.id).first():
                        Activity(
                            city_id=city.id,
                            name=act_name,
                            category=cat,
                            cost=round(cost * (city.cost_index / 6.0), 2),
                            duration_hours=dur,
                            rating=rat,
                            image_url=city.image_url,
                            description=desc
                        ).save()

        # 4. Seed a complete Sample Featured Trip for Demo User
        existing_trip = Trip.query.filter_by(user_id=demo_user.id, name="Grand European Summer Odyssey").first()
        if not existing_trip:
            print("Seeding demo user Grand European Trip...")
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
                total_budget=3500.0,
                is_public=True,
                status="upcoming"
            )
            trip.generate_slug()
            trip.save()

            # Create stops: Paris -> Rome -> Barcelona
            stop1 = Stop(
                trip_id=trip.id,
                city_id=city_lookup["Paris"].id,
                arrival_date=trip_start,
                departure_date=trip_start + timedelta(days=4),
                order_index=0,
                notes="Stay near Le Marais. Reserve museum passes early.",
                transport_mode="Flight",
                budget_estimate=1200.0
            ).save()

            stop2 = Stop(
                trip_id=trip.id,
                city_id=city_lookup["Rome"].id,
                arrival_date=trip_start + timedelta(days=4),
                departure_date=trip_start + timedelta(days=8),
                order_index=1,
                notes="Colosseum morning tour, Trastevere evenings.",
                transport_mode="Flight",
                budget_estimate=1100.0
            ).save()

            stop3 = Stop(
                trip_id=trip.id,
                city_id=city_lookup["Barcelona"].id,
                arrival_date=trip_start + timedelta(days=8),
                departure_date=trip_end,
                order_index=2,
                notes="Beach sunset and Gothic Quarter tapas crawl.",
                transport_mode="Flight",
                budget_estimate=1000.0
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
                if len(rome_acts) > 2:
                    StopActivity(stop_id=stop2.id, activity_id=rome_acts[2].id, scheduled_date=trip_start + timedelta(days=6), scheduled_time="18:00").save()

            bcn_acts = Activity.query.filter_by(city_id=city_lookup["Barcelona"].id).all()
            if bcn_acts:
                StopActivity(stop_id=stop3.id, activity_id=bcn_acts[0].id, scheduled_date=trip_start + timedelta(days=9), scheduled_time="11:00").save()

            # Add sample expenses
            Expense(trip_id=trip.id, stop_id=stop1.id, category="stay", amount=480.0, label="Boutique Hotel Marais 4 nights", date=trip_start).save()
            Expense(trip_id=trip.id, stop_id=stop1.id, category="transport", amount=190.0, label="Flight to Paris Charles de Gaulle", date=trip_start).save()
            Expense(trip_id=trip.id, stop_id=stop1.id, category="meals", amount=150.0, label="French Bistro & Wine Tasting", date=trip_start + timedelta(days=2)).save()
            Expense(trip_id=trip.id, stop_id=stop2.id, category="stay", amount=420.0, label="Piazza Navona Suites 4 nights", date=trip_start + timedelta(days=4)).save()
            Expense(trip_id=trip.id, stop_id=stop2.id, category="transport", amount=85.0, label="Ryanair flight Paris -> Rome", date=trip_start + timedelta(days=4)).save()
            Expense(trip_id=trip.id, stop_id=stop3.id, category="stay", amount=360.0, label="Eixample Design Apartment", date=trip_start + timedelta(days=8)).save()

            # Public share link
            SharedLink(trip_id=trip.id, slug=trip.share_slug, is_active=True, views_count=14).save()

        print("Database seeded successfully with users, 50 cities, activities, and sample trip!")

if __name__ == "__main__":
    seed_database()

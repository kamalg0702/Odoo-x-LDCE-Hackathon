import { 
  User, Trip, TripStop, ItineraryItem, Expense, TripMember, 
  Destination, ActivityCatalogItem, Achievement, NotificationItem, CommentItem,
  WeatherForecast
} from '../../src/types/index.ts';

// In-Memory Relational Database Store with Full Demo Seed
class DatabaseStore {
  public users: User[] = [];
  public trips: Trip[] = [];
  public destinations: Destination[] = [];
  public activities: ActivityCatalogItem[] = [];
  public achievements: Achievement[] = [];
  public notifications: NotificationItem[] = [];
  public comments: CommentItem[] = [];

  constructor() {
    this.seed();
  }

  public seed() {
    // 1. Users
    this.users = [
      {
        id: 'user_rahul',
        name: 'Rahul Sharma',
        email: 'rahul@globetrotter.ai',
        phoneNumber: '+91 98401 23456',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: 'user',
        homeCity: 'Chennai, India',
        currency: '₹',
        level: 'Globetrotter',
        xp: 3450,
        visitedCountries: ['India', 'Japan', 'Singapore', 'Thailand', 'UAE', 'France'],
        visitedCities: ['Chennai', 'Tokyo', 'Kyoto', 'Osaka', 'Singapore', 'Bangkok', 'Paris', 'Dubai'],
        travelDNA: {
          foodExplorer: 92,
          beachLover: 85,
          photography: 88,
          adventure: 74,
          culture: 89,
          budgetConscious: 78,
          luxury: 45,
          slowTravel: 68
        }
      },
      {
        id: 'user_roster',
        name: 'Alex Vance',
        email: 'rosterguy24@gmail.com',
        phoneNumber: '+1 (555) 019-2834',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        role: 'user',
        homeCity: 'San Francisco, USA',
        currency: '$',
        level: 'World Explorer',
        xp: 4120,
        visitedCountries: ['USA', 'Japan', 'Italy', 'Switzerland', 'Iceland'],
        visitedCities: ['San Francisco', 'Tokyo', 'Kyoto', 'Rome', 'Zurich', 'Reykjavik'],
        travelDNA: {
          foodExplorer: 88,
          beachLover: 70,
          photography: 95,
          adventure: 90,
          culture: 85,
          budgetConscious: 60,
          luxury: 75,
          slowTravel: 80
        }
      },
      {
        id: 'user_sarah',
        name: 'Sarah Jenkins',
        email: 'sarah.j@globetrotter.ai',
        phoneNumber: '+44 7911 123456',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        role: 'user',
        homeCity: 'London, UK',
        currency: '£',
        level: 'World Explorer',
        xp: 4800,
        visitedCountries: ['UK', 'Japan', 'Italy', 'USA', 'Spain'],
        visitedCities: ['London', 'Tokyo', 'Rome', 'New York', 'Barcelona'],
        travelDNA: {
          foodExplorer: 95,
          beachLover: 60,
          photography: 90,
          adventure: 82,
          culture: 94,
          budgetConscious: 65,
          luxury: 70,
          slowTravel: 75
        }
      },
      {
        id: 'user_admin',
        name: 'Admin Moderator',
        email: 'admin@globetrotter.ai',
        phoneNumber: '+1 (555) 000-7777',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        role: 'admin',
        homeCity: 'Singapore',
        currency: 'USD',
        level: 'Legend',
        xp: 12000,
        visitedCountries: ['Singapore', 'Japan', 'India', 'USA', 'Germany', 'Australia'],
        visitedCities: ['Singapore', 'Tokyo', 'Sydney', 'Berlin', 'San Francisco'],
        travelDNA: {
          foodExplorer: 90,
          beachLover: 80,
          photography: 85,
          adventure: 85,
          culture: 88,
          budgetConscious: 60,
          luxury: 85,
          slowTravel: 80
        }
      }
    ];

    // 2. Destinations Catalog
    this.destinations = [
      {
        id: 'dest_tokyo',
        name: 'Tokyo',
        country: 'Japan',
        region: 'East Asia',
        coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
        description: 'A neon-lit metropolis where ancient shrines meet cutting-edge culinary culture and hyper-speed bullet trains.',
        costIndex: '$$$',
        bestTimeToVisit: 'March – May, Oct – Nov',
        popularityScore: 98,
        avgDailyCost: 8500,
        aiMatchScore: 96,
        tags: ['Food', 'Culture', 'Photography', 'Shopping', 'Tech'],
        lat: 35.6762,
        lng: 139.6503
      },
      {
        id: 'dest_kyoto',
        name: 'Kyoto',
        country: 'Japan',
        region: 'East Asia',
        coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
        description: 'The cultural heart of Japan with thousands of classical Buddhist temples, gardens, imperial palaces, and traditional wooden machiya houses.',
        costIndex: '$$',
        bestTimeToVisit: 'April, October – November',
        popularityScore: 95,
        avgDailyCost: 6500,
        aiMatchScore: 94,
        tags: ['Culture', 'Temples', 'Photography', 'Peaceful', 'Food'],
        lat: 35.0116,
        lng: 135.7681
      },
      {
        id: 'dest_osaka',
        name: 'Osaka',
        country: 'Japan',
        region: 'East Asia',
        coverImage: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&auto=format&fit=crop&q=80',
        description: 'Known as the "Nation’s Kitchen", famous for mouthwatering street food in Dotonbori, glowing signboards, and warm vibrant locals.',
        costIndex: '$$',
        bestTimeToVisit: 'March – May, Sept – Nov',
        popularityScore: 92,
        avgDailyCost: 6000,
        aiMatchScore: 93,
        tags: ['Street Food', 'Nightlife', 'Culture', 'Entertainment'],
        lat: 34.6937,
        lng: 135.5023
      },
      {
        id: 'dest_singapore',
        name: 'Singapore',
        country: 'Singapore',
        region: 'Southeast Asia',
        coverImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&auto=format&fit=crop&q=80',
        description: 'Futuristic garden city renowned for Marina Bay Sands, Supertree Grove, Michelin hawker centers, and multicultural heritage.',
        costIndex: '$$$',
        bestTimeToVisit: 'Nov – Feb, July – Aug',
        popularityScore: 96,
        avgDailyCost: 9200,
        aiMatchScore: 91,
        tags: ['Food', 'Architecture', 'Urban Nature', 'Luxury'],
        lat: 1.3521,
        lng: 103.8198
      },
      {
        id: 'dest_seoul',
        name: 'Seoul',
        country: 'South Korea',
        region: 'East Asia',
        coverImage: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&auto=format&fit=crop&q=80',
        description: 'Dynamic capital blending modern skyscrapers, K-pop trends, historic palaces, and vibrant night markets.',
        costIndex: '$$',
        bestTimeToVisit: 'Sept – Nov, April – June',
        popularityScore: 94,
        avgDailyCost: 6800,
        aiMatchScore: 89,
        tags: ['Food', 'Shopping', 'Nightlife', 'Culture', 'K-Culture'],
        lat: 37.5665,
        lng: 126.9780
      },
      {
        id: 'dest_bali',
        name: 'Bali',
        country: 'Indonesia',
        region: 'Southeast Asia',
        coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80',
        description: 'Island of the Gods featuring emerald rice terraces, surf beaches, cliffside temples, and holistic wellness retreats.',
        costIndex: '$',
        bestTimeToVisit: 'April – October',
        popularityScore: 97,
        avgDailyCost: 4200,
        aiMatchScore: 95,
        tags: ['Beaches', 'Nature', 'Relaxation', 'Photography', 'Surfing'],
        lat: -8.4095,
        lng: 115.1889
      },
      {
        id: 'dest_paris',
        name: 'Paris',
        country: 'France',
        region: 'Europe',
        coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80',
        description: 'City of Light with iconic monuments, world-class art museums, café culture, and haute cuisine.',
        costIndex: '$$$$',
        bestTimeToVisit: 'May – Sept',
        popularityScore: 99,
        avgDailyCost: 12500,
        aiMatchScore: 88,
        tags: ['Art', 'Culture', 'Food', 'Romance', 'Architecture'],
        lat: 48.8566,
        lng: 2.3522
      },
      {
        id: 'dest_rome',
        name: 'Rome',
        country: 'Italy',
        region: 'Europe',
        coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80',
        description: 'An open-air museum filled with nearly 3,000 years of globally influential art, architecture, and mouthwatering pasta.',
        costIndex: '$$$',
        bestTimeToVisit: 'April – June, Sept – Oct',
        popularityScore: 96,
        avgDailyCost: 9800,
        aiMatchScore: 90,
        tags: ['History', 'Food', 'Culture', 'Photography'],
        lat: 41.9028,
        lng: 12.4964
      }
    ];

    // 3. Activity Catalog
    this.activities = [
      {
        id: 'act_sensoji',
        title: 'Senso-ji Temple & Asakusa Walking Tour',
        destination: 'Tokyo',
        country: 'Japan',
        category: 'culture',
        durationMinutes: 120,
        cost: 650,
        rating: 4.8,
        reviewCount: 3240,
        bestTime: 'Morning (08:30)',
        aiMatchScore: 95,
        imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&auto=format&fit=crop&q=80',
        description: 'Tokyo’s oldest Buddhist temple. Wander through the giant Kaminarimon lantern and Nakamise-dori market snacks.',
        lat: 35.7148,
        lng: 139.7967,
        isIndoor: false
      },
      {
        id: 'act_teamlab',
        title: 'teamLab Planets Digital Art Museum',
        destination: 'Tokyo',
        country: 'Japan',
        category: 'photography',
        durationMinutes: 150,
        cost: 2100,
        rating: 4.9,
        reviewCount: 5120,
        bestTime: 'Afternoon / Rainy Days',
        aiMatchScore: 98,
        imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=600&auto=format&fit=crop&q=80',
        description: 'An immersive digital art museum where visitors walk through water and interact with mesmerizing flower light installations.',
        lat: 35.6492,
        lng: 139.7898,
        isIndoor: true
      },
      {
        id: 'act_shibuya_sky',
        title: 'Shibuya Sky 360° Sunset Observatory',
        destination: 'Tokyo',
        country: 'Japan',
        category: 'photography',
        durationMinutes: 90,
        cost: 1400,
        rating: 4.9,
        reviewCount: 4200,
        bestTime: 'Evening (17:00)',
        aiMatchScore: 96,
        imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&auto=format&fit=crop&q=80',
        description: 'Panoramic open-air rooftop observation deck overlooking Shibuya Crossing and Mt. Fuji on clear sunsets.',
        lat: 35.6580,
        lng: 139.7016,
        isIndoor: false
      },
      {
        id: 'act_tsukiji',
        title: 'Tsukiji Outer Market Food Safari',
        destination: 'Tokyo',
        country: 'Japan',
        category: 'food',
        durationMinutes: 120,
        cost: 1800,
        rating: 4.8,
        reviewCount: 2900,
        bestTime: 'Morning (09:00)',
        aiMatchScore: 97,
        imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80',
        description: 'Taste fresh sushi, wagyu skewers, tamagoyaki, and Japanese street delights along historical alleys.',
        lat: 35.6655,
        lng: 139.7708,
        isIndoor: false
      },
      {
        id: 'act_fushimi_inari',
        title: 'Fushimi Inari-Taisha 1,000 Torii Gates Hike',
        destination: 'Kyoto',
        country: 'Japan',
        category: 'nature',
        durationMinutes: 150,
        cost: 0,
        rating: 4.9,
        reviewCount: 6800,
        bestTime: 'Early Morning (07:30)',
        aiMatchScore: 97,
        imageUrl: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=600&auto=format&fit=crop&q=80',
        description: 'Walk through thousands of vermilion torii gates winding up the sacred Mount Inari forest.',
        lat: 34.9671,
        lng: 135.7727,
        isIndoor: false
      },
      {
        id: 'act_kinkakuji',
        title: 'Kinkaku-ji (The Golden Pavilion) Garden',
        destination: 'Kyoto',
        country: 'Japan',
        category: 'culture',
        durationMinutes: 90,
        cost: 300,
        rating: 4.7,
        reviewCount: 4100,
        bestTime: 'Morning',
        aiMatchScore: 93,
        imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&auto=format&fit=crop&q=80',
        description: 'Zen Buddhist temple covered in gold leaf reflecting exquisitely on the Kyoko-chi mirror pond.',
        lat: 35.0394,
        lng: 135.7292,
        isIndoor: false
      },
      {
        id: 'act_dotonbori',
        title: 'Dotonbori Street Food & River Cruise',
        destination: 'Osaka',
        country: 'Japan',
        category: 'food',
        durationMinutes: 150,
        cost: 1500,
        rating: 4.8,
        reviewCount: 3800,
        bestTime: 'Evening (18:30)',
        aiMatchScore: 98,
        imageUrl: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=600&auto=format&fit=crop&q=80',
        description: 'Eat Takoyaki, Okonomiyaki, and Kushikatsu right beneath the iconic Glico Man neon sign.',
        lat: 34.6687,
        lng: 135.5013,
        isIndoor: false
      },
      {
        id: 'act_kyoto_tea',
        title: 'Traditional Matcha Ceremony in Gion Machiya',
        destination: 'Kyoto',
        country: 'Japan',
        category: 'culture',
        durationMinutes: 75,
        cost: 1800,
        rating: 4.9,
        reviewCount: 1200,
        bestTime: 'Afternoon / Rain Backup',
        aiMatchScore: 94,
        imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
        description: 'Experience the serene Zen philosophy of tea preparation led by a certified Kyoto tea master.',
        lat: 35.0037,
        lng: 135.7770,
        isIndoor: true
      }
    ];

    // 4. Primary Demo Trip: "Japan Explorer"
    const trip1Id = 'trip_japan_demo';
    const trip1Stops: TripStop[] = [
      {
        id: 'stop_tokyo',
        tripId: trip1Id,
        cityName: 'Tokyo',
        country: 'Japan',
        lat: 35.6762,
        lng: 139.6503,
        arrivalDate: '2026-09-10',
        departureDate: '2026-09-13',
        order: 1,
        stayName: 'Shinjuku Granbell Hotel',
        stayCost: 18500
      },
      {
        id: 'stop_kyoto',
        tripId: trip1Id,
        cityName: 'Kyoto',
        country: 'Japan',
        lat: 35.0116,
        lng: 135.7681,
        arrivalDate: '2026-09-13',
        departureDate: '2026-09-15',
        order: 2,
        stayName: 'Kyoto Machiya Guesthouse',
        stayCost: 12000
      },
      {
        id: 'stop_osaka',
        tripId: trip1Id,
        cityName: 'Osaka',
        country: 'Japan',
        lat: 34.6937,
        lng: 135.5023,
        arrivalDate: '2026-09-15',
        departureDate: '2026-09-17',
        order: 3,
        stayName: 'Namba Plaza Stay',
        stayCost: 9800
      },
      {
        id: 'stop_tokyo_return',
        tripId: trip1Id,
        cityName: 'Tokyo (Return Flight)',
        country: 'Japan',
        lat: 35.6762,
        lng: 139.6503,
        arrivalDate: '2026-09-17',
        departureDate: '2026-09-18',
        order: 4,
        stayName: 'Haneda Airport Express Hotel',
        stayCost: 5200
      }
    ];

    const trip1Items: ItineraryItem[] = [
      // Day 1: Tokyo Arrival & Neon Discovery
      {
        id: 'item_1_1',
        tripId: trip1Id,
        stopId: 'stop_tokyo',
        dayNumber: 1,
        date: '2026-09-10',
        timeSlot: 'morning',
        startTime: '10:00',
        endTime: '12:30',
        title: 'Arrive at Narita & Shinkansen to Shinjuku',
        description: 'Land at airport, exchange JR Pass, and check in at hotel with luggage drop-off.',
        locationName: 'Shinjuku, Tokyo',
        lat: 35.6938,
        lng: 139.7036,
        category: 'transit',
        cost: 2800,
        durationMinutes: 150,
        travelTimeFromPrevMinutes: 0,
        transportMode: 'train',
        transportCost: 2800,
        aiMatchScore: 90,
        status: 'planned'
      },
      {
        id: 'item_1_2',
        tripId: trip1Id,
        stopId: 'stop_tokyo',
        dayNumber: 1,
        date: '2026-09-10',
        timeSlot: 'afternoon',
        startTime: '14:00',
        endTime: '16:30',
        title: 'Meiji Jingu Shrine & Harajuku Takeshita Street',
        description: 'Walk through the towering cedar forest of Meiji Shrine, then explore quirky fashion in Harajuku.',
        locationName: 'Shibuya City, Tokyo',
        lat: 35.6764,
        lng: 139.6993,
        category: 'culture',
        cost: 500,
        durationMinutes: 150,
        travelTimeFromPrevMinutes: 20,
        transportMode: 'subway',
        transportCost: 120,
        aiMatchScore: 94,
        status: 'planned',
        imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'item_1_3',
        tripId: trip1Id,
        stopId: 'stop_tokyo',
        dayNumber: 1,
        date: '2026-09-10',
        timeSlot: 'evening',
        startTime: '17:30',
        endTime: '20:30',
        title: 'Shibuya Crossing & Shibuya Sky 360°',
        description: 'Witness the world’s busiest scramble crossing and view the glowing city skyline from Shibuya Sky.',
        locationName: 'Shibuya Sky, Tokyo',
        lat: 35.6580,
        lng: 139.7016,
        category: 'photography',
        cost: 1400,
        durationMinutes: 180,
        travelTimeFromPrevMinutes: 15,
        transportMode: 'walk',
        transportCost: 0,
        aiMatchScore: 98,
        status: 'planned',
        imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&auto=format&fit=crop&q=80'
      },

      // Day 2: Old Tokyo vs Digital Future
      {
        id: 'item_2_1',
        tripId: trip1Id,
        stopId: 'stop_tokyo',
        dayNumber: 2,
        date: '2026-09-11',
        timeSlot: 'morning',
        startTime: '08:30',
        endTime: '11:30',
        title: 'Senso-ji Temple & Asakusa Nakamise Market',
        description: 'Explore the iconic ancient temple before crowds arrive, tasting warm melonpan and ningyo-yaki.',
        locationName: 'Asakusa, Tokyo',
        lat: 35.7148,
        lng: 139.7967,
        category: 'culture',
        cost: 650,
        durationMinutes: 180,
        travelTimeFromPrevMinutes: 30,
        transportMode: 'subway',
        transportCost: 150,
        aiMatchScore: 95,
        status: 'planned'
      },
      {
        id: 'item_2_2',
        tripId: trip1Id,
        stopId: 'stop_tokyo',
        dayNumber: 2,
        date: '2026-09-11',
        timeSlot: 'afternoon',
        startTime: '13:00',
        endTime: '16:00',
        title: 'teamLab Planets Digital Immersive Museum',
        description: 'Walk barefoot through water, crystal universe, and floating flower gardens.',
        locationName: 'Toyosu, Tokyo',
        lat: 35.6492,
        lng: 139.7898,
        category: 'photography',
        cost: 2100,
        durationMinutes: 180,
        travelTimeFromPrevMinutes: 25,
        transportMode: 'subway',
        transportCost: 180,
        aiMatchScore: 99,
        isIndoor: true,
        status: 'planned',
        imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'item_2_3',
        tripId: trip1Id,
        stopId: 'stop_tokyo',
        dayNumber: 2,
        date: '2026-09-11',
        timeSlot: 'evening',
        startTime: '17:30',
        endTime: '21:00',
        title: 'Akihabara Tech & Ginza Ramen Tasting',
        description: 'Retro arcade games, anime collectibles in Akihabara followed by award-winning Kagari truffle ramen.',
        locationName: 'Ginza, Tokyo',
        lat: 35.6719,
        lng: 139.7640,
        category: 'food',
        cost: 1600,
        durationMinutes: 210,
        travelTimeFromPrevMinutes: 20,
        transportMode: 'subway',
        transportCost: 140,
        aiMatchScore: 94,
        status: 'planned'
      },

      // Day 3: Tsukiji & Bullet Train to Kyoto
      {
        id: 'item_3_1',
        tripId: trip1Id,
        stopId: 'stop_tokyo',
        dayNumber: 3,
        date: '2026-09-12',
        timeSlot: 'morning',
        startTime: '08:00',
        endTime: '11:00',
        title: 'Tsukiji Outer Market Gourmet Breakfast',
        description: 'Fresh otoro sashimi bowls, grilled scallops with butter, and tamagoyaki skewers.',
        locationName: 'Tsukiji, Tokyo',
        lat: 35.6655,
        lng: 139.7708,
        category: 'food',
        cost: 2200,
        durationMinutes: 180,
        travelTimeFromPrevMinutes: 20,
        transportMode: 'subway',
        transportCost: 140,
        aiMatchScore: 97,
        status: 'planned'
      },
      {
        id: 'item_3_2',
        tripId: trip1Id,
        stopId: 'stop_kyoto',
        dayNumber: 3,
        date: '2026-09-12',
        timeSlot: 'afternoon',
        startTime: '12:30',
        endTime: '15:30',
        title: 'Shinkansen Bullet Train to Kyoto (View Mt. Fuji)',
        description: 'Board the 285 km/h Nozomi Shinkansen train with bento box. Right side seats offer views of Mt. Fuji.',
        locationName: 'Kyoto Station',
        lat: 34.9858,
        lng: 135.7588,
        category: 'transit',
        cost: 7200,
        durationMinutes: 180,
        travelTimeFromPrevMinutes: 135,
        transportMode: 'train',
        transportCost: 7200,
        aiMatchScore: 95,
        status: 'planned'
      },
      {
        id: 'item_3_3',
        tripId: trip1Id,
        stopId: 'stop_kyoto',
        dayNumber: 3,
        date: '2026-09-12',
        timeSlot: 'evening',
        startTime: '17:00',
        endTime: '20:30',
        title: 'Gion District Geisha Alleys & Pontocho Dining',
        description: 'Atmospheric evening stroll through wooden machiya streets, spotting Geiko/Maiko en route to appointments.',
        locationName: 'Gion, Kyoto',
        lat: 35.0037,
        lng: 135.7770,
        category: 'culture',
        cost: 2500,
        durationMinutes: 210,
        travelTimeFromPrevMinutes: 15,
        transportMode: 'walk',
        transportCost: 0,
        aiMatchScore: 96,
        status: 'planned',
        imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80'
      },

      // Day 4: Kyoto Imperial Temples & Bamboo Forest
      {
        id: 'item_4_1',
        tripId: trip1Id,
        stopId: 'stop_kyoto',
        dayNumber: 4,
        date: '2026-09-13',
        timeSlot: 'morning',
        startTime: '07:30',
        endTime: '11:00',
        title: 'Arashiyama Bamboo Grove & Tenryu-ji Zen Garden',
        description: 'Walk through the towering green bamboo tunnels, cross the Togetsukyo Bridge, and feed river koi.',
        locationName: 'Arashiyama, Kyoto',
        lat: 35.0169,
        lng: 135.6713,
        category: 'nature',
        cost: 400,
        durationMinutes: 210,
        travelTimeFromPrevMinutes: 35,
        transportMode: 'train',
        transportCost: 180,
        aiMatchScore: 96,
        status: 'planned'
      },
      {
        id: 'item_4_2',
        tripId: trip1Id,
        stopId: 'stop_kyoto',
        dayNumber: 4,
        date: '2026-09-13',
        timeSlot: 'afternoon',
        startTime: '13:00',
        endTime: '15:30',
        title: 'Kinkaku-ji (Golden Pavilion)',
        description: 'Gaze at the legendary gold leaf pavilion reflecting on the serene pond.',
        locationName: 'Kita Ward, Kyoto',
        lat: 35.0394,
        lng: 135.7292,
        category: 'culture',
        cost: 300,
        durationMinutes: 150,
        travelTimeFromPrevMinutes: 30,
        transportMode: 'bus',
        transportCost: 140,
        aiMatchScore: 92,
        status: 'planned'
      },
      {
        id: 'item_4_3',
        tripId: trip1Id,
        stopId: 'stop_kyoto',
        dayNumber: 4,
        date: '2026-09-13',
        timeSlot: 'evening',
        startTime: '17:00',
        endTime: '20:30',
        title: 'Fushimi Inari-Taisha Sunset Torii Walk',
        description: 'Hike through glowing lantern-lit red gates under twilight canopy.',
        locationName: 'Fushimi Ward, Kyoto',
        lat: 34.9671,
        lng: 135.7727,
        category: 'photography',
        cost: 0,
        durationMinutes: 210,
        travelTimeFromPrevMinutes: 25,
        transportMode: 'train',
        transportCost: 120,
        aiMatchScore: 99,
        status: 'planned',
        imageUrl: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=600&auto=format&fit=crop&q=80'
      },

      // Day 5: Osaka Street Food Capital
      {
        id: 'item_5_1',
        tripId: trip1Id,
        stopId: 'stop_osaka',
        dayNumber: 5,
        date: '2026-09-14',
        timeSlot: 'morning',
        startTime: '09:30',
        endTime: '12:00',
        title: 'Rapid Train to Osaka & Osaka Castle Gardens',
        description: 'Explore the imposing 16th-century fortress, moat, and samurai museum.',
        locationName: 'Chuo Ward, Osaka',
        lat: 34.6873,
        lng: 135.5262,
        category: 'culture',
        cost: 450,
        durationMinutes: 150,
        travelTimeFromPrevMinutes: 40,
        transportMode: 'train',
        transportCost: 350,
        aiMatchScore: 91,
        status: 'planned'
      },
      {
        id: 'item_5_2',
        tripId: trip1Id,
        stopId: 'stop_osaka',
        dayNumber: 5,
        date: '2026-09-14',
        timeSlot: 'afternoon',
        startTime: '13:30',
        endTime: '16:30',
        title: 'Shinsekai retro district & Tsutenkaku Tower',
        description: 'Retro Showa-era district famous for piping hot Kushikatsu skewers and retro gaming dens.',
        locationName: 'Naniwa Ward, Osaka',
        lat: 34.6525,
        lng: 135.5063,
        category: 'food',
        cost: 1200,
        durationMinutes: 180,
        travelTimeFromPrevMinutes: 20,
        transportMode: 'subway',
        transportCost: 140,
        aiMatchScore: 93,
        status: 'planned'
      },
      {
        id: 'item_5_3',
        tripId: trip1Id,
        stopId: 'stop_osaka',
        dayNumber: 5,
        date: '2026-09-14',
        timeSlot: 'evening',
        startTime: '17:30',
        endTime: '21:30',
        title: 'Dotonbori Neon Street Food Extravaganza',
        description: 'Hop from giant octopus takoyaki stands to sizzling okonomiyaki and craft beer along the canal.',
        locationName: 'Dotonbori, Osaka',
        lat: 34.6687,
        lng: 135.5013,
        category: 'food',
        cost: 2100,
        durationMinutes: 240,
        travelTimeFromPrevMinutes: 15,
        transportMode: 'walk',
        transportCost: 0,
        aiMatchScore: 98,
        status: 'planned',
        imageUrl: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=600&auto=format&fit=crop&q=80'
      }
    ];

    const trip1Expenses: Expense[] = [
      { id: 'exp_1', tripId: trip1Id, category: 'transport', title: 'Roundtrip Flights (Chennai to Tokyo Narita)', amount: 28500, date: '2026-09-10', paidBy: 'user_rahul' },
      { id: 'exp_2', tripId: trip1Id, category: 'transport', title: '7-Day JR Shinkansen Regional Pass', amount: 14200, date: '2026-09-10', paidBy: 'user_rahul' },
      { id: 'exp_3', tripId: trip1Id, category: 'hotels', title: 'Shinjuku Granbell Hotel (3 Nights)', amount: 18500, date: '2026-09-10', paidBy: 'user_rahul' },
      { id: 'exp_4', tripId: trip1Id, category: 'hotels', title: 'Kyoto Machiya Stay (2 Nights)', amount: 12000, date: '2026-09-13', paidBy: 'user_rahul' },
      { id: 'exp_5', tripId: trip1Id, category: 'hotels', title: 'Osaka Namba Hotel (2 Nights)', amount: 9800, date: '2026-09-15', paidBy: 'user_rahul' },
      { id: 'exp_6', tripId: trip1Id, category: 'food', title: 'Tsukiji Market & Dotonbori Street Food Budget', amount: 9400, date: '2026-09-11', paidBy: 'user_rahul' },
      { id: 'exp_7', tripId: trip1Id, category: 'activities', title: 'teamLab Planets + Shibuya Sky + Temples Pass', amount: 4800, date: '2026-09-11', paidBy: 'user_rahul' },
      { id: 'exp_8', tripId: trip1Id, category: 'shopping', title: 'Souvenirs, Matcha Tea & Akihabara Collectibles', amount: 4200, date: '2026-09-16', paidBy: 'user_rahul' }
    ];

    const trip1Members: TripMember[] = [
      {
        id: 'mem_1',
        tripId: trip1Id,
        userId: 'user_rahul',
        name: 'Rahul Sharma',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        email: 'rahul@globetrotter.ai',
        role: 'owner',
        travelDNA: this.users[0].travelDNA
      },
      {
        id: 'mem_2',
        tripId: trip1Id,
        userId: 'user_sarah',
        name: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        email: 'sarah.j@globetrotter.ai',
        role: 'editor',
        travelDNA: this.users[1].travelDNA
      }
    ];

    const trip1Weather: WeatherForecast[] = [
      { date: '2026-09-10', dayNumber: 1, condition: 'Sunny', tempC: 24, description: 'Clear skies with mild autumn breeze' },
      { date: '2026-09-11', dayNumber: 2, condition: 'Partly Cloudy', tempC: 23, description: 'Great lighting for photography' },
      { date: '2026-09-12', dayNumber: 3, condition: 'Sunny', tempC: 25, description: 'Clear visibility along Shinkansen route' },
      { date: '2026-09-13', dayNumber: 4, condition: 'Partly Cloudy', tempC: 22, description: 'Pleasant temple walking conditions' },
      { date: '2026-09-14', dayNumber: 5, condition: 'Rain', tempC: 19, isDisruptionRisk: true, description: 'Heavy afternoon rainstorm expected 2 PM - 6 PM' },
      { date: '2026-09-15', dayNumber: 6, condition: 'Sunny', tempC: 24, description: 'Bright and crisp after rain' },
      { date: '2026-09-16', dayNumber: 7, condition: 'Sunny', tempC: 23, description: 'Clear' },
      { date: '2026-09-17', dayNumber: 8, condition: 'Partly Cloudy', tempC: 22, description: 'Optimal travel weather' }
    ];

    const trip1: Trip = {
      id: trip1Id,
      title: 'Japan Explorer: Golden Route Odyssey',
      description: '8-day immersive journey connecting ultra-modern Tokyo neon, historic Kyoto Zen shrines, and the legendary street kitchens of Osaka.',
      coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80',
      startDate: '2026-09-10',
      endDate: '2026-09-18',
      totalDays: 8,
      currency: '₹',
      totalBudget: 85000,
      estimatedCost: 78400,
      actualSpent: 74200,
      travelGroup: 'friends',
      travelPace: 'balanced',
      interests: ['food', 'photography', 'culture', 'temples'],
      ownerId: 'user_rahul',
      isPublic: true,
      shareCode: 'JP-GOLDEN-8D',
      copiesCount: 142,
      createdAt: '2026-08-15T10:00:00Z',
      updatedAt: '2026-08-20T14:30:00Z',
      health: {
        score: 89,
        fatigueRisk: 'Low',
        budgetRisk: 'Safe',
        paceDensity: 'Balanced',
        restBufferScore: 92,
        insights: [
          'Optimal transit-to-activity balance across Tokyo and Kyoto',
          'Good 45-minute buffer before evening activities',
          'Potential afternoon rain on Day 5 in Osaka requires indoor alternative standby'
        ]
      },
      stops: trip1Stops,
      items: trip1Items,
      expenses: trip1Expenses,
      members: trip1Members,
      weather: trip1Weather
    };

    // 5. Secondary Demo Trip: "Southeast Asia Island Hopping"
    const trip2Id = 'trip_southeast_asia';
    const trip2: Trip = {
      id: trip2Id,
      title: 'Southeast Asia: Singapore to Bali Tropical Haven',
      description: '7-day sun-soaked tropical adventure blending Marina Bay futuristic wonders with Ubud rice paddies and surf beaches.',
      coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=80',
      startDate: '2026-11-05',
      endDate: '2026-11-12',
      totalDays: 7,
      currency: '₹',
      totalBudget: 55000,
      estimatedCost: 48500,
      actualSpent: 12000,
      travelGroup: 'couple',
      travelPace: 'relaxed',
      interests: ['beach', 'nature', 'food', 'relaxation'],
      ownerId: 'user_rahul',
      isPublic: true,
      shareCode: 'SEA-TROPICAL-7D',
      copiesCount: 89,
      createdAt: '2026-08-18T12:00:00Z',
      updatedAt: '2026-08-21T09:00:00Z',
      health: {
        score: 94,
        fatigueRisk: 'Low',
        budgetRisk: 'Safe',
        paceDensity: 'Balanced',
        restBufferScore: 96,
        insights: ['Generous relaxation and beach time allocated', 'Budget is well within comfortable buffer']
      },
      stops: [
        { id: 'stop_sea_1', tripId: trip2Id, cityName: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, arrivalDate: '2026-11-05', departureDate: '2026-11-08', order: 1, stayName: 'Marina Bay Waterfront Hotel', stayCost: 14500 },
        { id: 'stop_sea_2', tripId: trip2Id, cityName: 'Bali (Ubud & Seminyak)', country: 'Indonesia', lat: -8.4095, lng: 115.1889, arrivalDate: '2026-11-08', departureDate: '2026-11-12', order: 2, stayName: 'Ubud Jungle Eco Villa', stayCost: 11200 }
      ],
      items: [
        {
          id: 'item_sea_1',
          tripId: trip2Id,
          stopId: 'stop_sea_1',
          dayNumber: 1,
          date: '2026-11-05',
          timeSlot: 'morning',
          startTime: '09:00',
          endTime: '12:00',
          title: 'Gardens by the Bay & Flower Dome',
          description: 'Explore the world’s largest glass greenhouse and Supertree Grove skywalk.',
          locationName: 'Marina South, Singapore',
          lat: 1.2816,
          lng: 103.8636,
          category: 'nature',
          cost: 1500,
          durationMinutes: 180,
          aiMatchScore: 96,
          isIndoor: true,
          status: 'planned'
        },
        {
          id: 'item_sea_2',
          tripId: trip2Id,
          stopId: 'stop_sea_1',
          dayNumber: 1,
          date: '2026-11-05',
          timeSlot: 'evening',
          startTime: '18:30',
          endTime: '21:00',
          title: 'Lau Pa Sat Hawker Feast & Satay Street',
          description: 'Savor skewered satay with peanut sauce under glowing street lamps.',
          locationName: 'Downtown Core, Singapore',
          lat: 1.2807,
          lng: 103.8504,
          category: 'food',
          cost: 850,
          durationMinutes: 150,
          aiMatchScore: 97,
          status: 'planned'
        }
      ],
      expenses: [
        { id: 'exp_sea_1', tripId: trip2Id, category: 'transport', title: 'Flights (Chennai - Singapore - Bali)', amount: 22000, date: '2026-11-05', paidBy: 'user_rahul' },
        { id: 'exp_sea_2', tripId: trip2Id, category: 'hotels', title: 'Accommodations Package', amount: 25700, date: '2026-11-05', paidBy: 'user_rahul' }
      ],
      members: [
        {
          id: 'mem_sea_1',
          tripId: trip2Id,
          userId: 'user_rahul',
          name: 'Rahul Sharma',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          email: 'rahul@globetrotter.ai',
          role: 'owner',
          travelDNA: this.users[0].travelDNA
        }
      ],
      weather: [
        { date: '2026-11-05', dayNumber: 1, condition: 'Sunny', tempC: 29, description: 'Warm tropical sunshine' },
        { date: '2026-11-06', dayNumber: 2, condition: 'Partly Cloudy', tempC: 30, description: 'Mild tropical breeze' }
      ]
    };

    this.trips = [trip1, trip2];

    // 6. Achievements / Gamification
    this.achievements = [
      { id: 'ach_1', title: 'Budget Master', description: 'Saved over ₹8,000 using AI Budget Optimizer', iconName: 'PiggyBank', unlockedAt: '2026-08-16T12:00:00Z', category: 'budget' },
      { id: 'ach_2', title: 'Food Hunter', description: 'Added 10+ Michelin & authentic street food stops', iconName: 'Utensils', unlockedAt: '2026-08-17T15:30:00Z', category: 'exploration' },
      { id: 'ach_3', title: 'Route Master', description: 'Saved 2+ hours of travel time via AI Route Optimization', iconName: 'Navigation', unlockedAt: '2026-08-18T10:00:00Z', category: 'ai' },
      { id: 'ach_4', title: 'Global Explorer', description: 'Planned trips spanning 3 or more countries', iconName: 'Globe', unlockedAt: '2026-08-19T08:00:00Z', category: 'exploration' },
      { id: 'ach_5', title: 'Photo Explorer', description: 'Generated a complete trip from a photo landmark', iconName: 'Camera', category: 'planning' },
      { id: 'ach_6', title: 'Storm Survivor', description: 'Successfully replanned a day impacted by bad weather', iconName: 'CloudRain', category: 'ai' }
    ];

    // 7. Notifications
    this.notifications = [
      {
        id: 'notif_1',
        title: '🌦️ Weather Alert: Day 5 Osaka',
        message: 'AI detected heavy rain (2 PM–6 PM) on Day 5. Recommended indoor alternatives ready.',
        type: 'weather',
        timestamp: '10m ago',
        read: false,
        actionUrl: '/trips/trip_japan_demo'
      },
      {
        id: 'notif_2',
        title: '⚡ Route Optimization Available',
        message: 'We found a smarter route for Day 2 in Tokyo that saves 45 minutes of transit time.',
        type: 'ai',
        timestamp: '2h ago',
        read: false,
        actionUrl: '/trips/trip_japan_demo'
      },
      {
        id: 'notif_3',
        title: '👥 Sarah Jenkins joined Japan Explorer',
        message: 'Sarah accepted your invitation with 87% Travel DNA compatibility!',
        type: 'group',
        timestamp: '1d ago',
        read: true,
        actionUrl: '/trips/trip_japan_demo/group'
      }
    ];

    // 8. Comments
    this.comments = [
      {
        id: 'comm_1',
        tripId: trip1Id,
        itineraryItemId: 'item_1_3',
        userId: 'user_sarah',
        userName: 'Sarah Jenkins',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        content: 'Sunset slot at Shibuya Sky gets booked out fast! I suggest booking tickets 2 weeks early.',
        createdAt: '2026-08-20T11:20:00Z'
      },
      {
        id: 'comm_2',
        tripId: trip1Id,
        itineraryItemId: 'item_5_3',
        userId: 'user_rahul',
        userName: 'Rahul Sharma',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        content: 'Can’t wait for the Takoyaki crawl along Dotonbori canal!',
        createdAt: '2026-08-20T14:45:00Z'
      }
    ];
  }

  // Database Access Methods
  public getTripById(id: string): Trip | undefined {
    return this.trips.find(t => t.id === id || t.shareCode === id);
  }

  public createTrip(trip: Trip): Trip {
    this.trips.unshift(trip);
    return trip;
  }

  public updateTrip(id: string, updates: Partial<Trip>): Trip | undefined {
    const idx = this.trips.findIndex(t => t.id === id);
    if (idx === -1) return undefined;
    this.trips[idx] = { ...this.trips[idx], ...updates, updatedAt: new Date().toISOString() };
    return this.trips[idx];
  }

  public deleteTrip(id: string): boolean {
    const initialLen = this.trips.length;
    this.trips = this.trips.filter(t => t.id !== id);
    return this.trips.length < initialLen;
  }

  public addItineraryItem(tripId: string, item: ItineraryItem): Trip | undefined {
    const trip = this.getTripById(tripId);
    if (!trip) return undefined;
    trip.items.push(item);
    trip.updatedAt = new Date().toISOString();
    return trip;
  }

  public updateItineraryItem(tripId: string, itemId: string, updates: Partial<ItineraryItem>): Trip | undefined {
    const trip = this.getTripById(tripId);
    if (!trip) return undefined;
    const itemIndex = trip.items.findIndex(i => i.id === itemId);
    if (itemIndex !== -1) {
      trip.items[itemIndex] = { ...trip.items[itemIndex], ...updates };
      trip.updatedAt = new Date().toISOString();
    }
    return trip;
  }

  public deleteItineraryItem(tripId: string, itemId: string): Trip | undefined {
    const trip = this.getTripById(tripId);
    if (!trip) return undefined;
    trip.items = trip.items.filter(i => i.id !== itemId);
    trip.updatedAt = new Date().toISOString();
    return trip;
  }

  public addStop(tripId: string, stop: TripStop): Trip | undefined {
    const trip = this.getTripById(tripId);
    if (!trip) return undefined;
    trip.stops.push(stop);
    trip.updatedAt = new Date().toISOString();
    return trip;
  }

  public updateStop(tripId: string, stopId: string, updates: Partial<TripStop>): Trip | undefined {
    const trip = this.getTripById(tripId);
    if (!trip) return undefined;
    const idx = trip.stops.findIndex(s => s.id === stopId);
    if (idx !== -1) {
      trip.stops[idx] = { ...trip.stops[idx], ...updates };
      trip.updatedAt = new Date().toISOString();
    }
    return trip;
  }

  public deleteStop(tripId: string, stopId: string): Trip | undefined {
    const trip = this.getTripById(tripId);
    if (!trip) return undefined;
    trip.stops = trip.stops.filter(s => s.id !== stopId);
    trip.updatedAt = new Date().toISOString();
    return trip;
  }

  public updateUser(userId: string, updates: Partial<User>): User | undefined {
    const idx = this.users.findIndex(u => u.id === userId);
    if (idx === -1) return undefined;
    this.users[idx] = { ...this.users[idx], ...updates };
    return this.users[idx];
  }

  public deleteUser(userId: string): boolean {
    const initialLen = this.users.length;
    this.users = this.users.filter(u => u.id !== userId);
    return this.users.length < initialLen;
  }

  public addExpense(tripId: string, expense: Expense): Trip | undefined {
    const trip = this.getTripById(tripId);
    if (!trip) return undefined;
    trip.expenses.push(expense);
    trip.actualSpent = trip.expenses.reduce((acc, curr) => acc + curr.amount, 0);
    trip.updatedAt = new Date().toISOString();
    return trip;
  }

  public deleteExpense(tripId: string, expenseId: string): Trip | undefined {
    const trip = this.getTripById(tripId);
    if (!trip) return undefined;
    trip.expenses = trip.expenses.filter(e => e.id !== expenseId);
    trip.actualSpent = trip.expenses.reduce((acc, curr) => acc + curr.amount, 0);
    trip.updatedAt = new Date().toISOString();
    return trip;
  }
}

export const db = new DatabaseStore();

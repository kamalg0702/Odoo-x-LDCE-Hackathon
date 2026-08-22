import { getGeminiClient, GEMINI_MODEL } from './geminiClient.ts';
import { AIPlanOption, Trip, TripStop, ItineraryItem, Expense, TravelGroup, TravelPace } from '../../src/types/index.ts';

export interface GenerateTripParams {
  destination: string;
  destinations?: string[];
  startDate: string;
  endDate: string;
  totalDays: number;
  budget: number;
  currency: string;
  travelGroup: TravelGroup;
  travelPace: TravelPace;
  interests: string[];
  originCity?: string;
}

export async function generateTripOptions(params: GenerateTripParams): Promise<AIPlanOption[]> {
  const gemini = getGeminiClient();
  const destName = params.destinations?.length ? params.destinations.join(' & ') : params.destination;
  const currency = params.currency || '₹';
  const targetBudget = params.budget || 50000;

  if (gemini) {
    try {
      const prompt = `You are the chief travel architect of GlobeTrotter AI. Generate 3 distinct tiered trip options for a ${params.totalDays}-day trip to "${destName}".
Origin: ${params.originCity || 'Home City'}
Target Budget: ${currency}${targetBudget}
Travel Group: ${params.travelGroup}
Travel Pace: ${params.travelPace}
Interests: ${params.interests.join(', ')}

Return a JSON array of exactly 3 objects corresponding to:
1. "Budget Explorer" (~70% of target budget, smart hostels/guesthouses, public transit, street food & free monuments)
2. "Balanced Explorer" (~100% of target budget, boutique 3-4 star stays, culinary highlights, guided passes, optimal transit)
3. "Premium Explorer" (~140% of target budget, luxury stays, private experiences, fine dining, express transit)

For each option, provide:
- tier: "Budget Explorer" | "Balanced Explorer" | "Premium Explorer"
- totalCost: number
- currency: "${currency}"
- tagline: short punchy summary
- summary: 2-sentence rationale
- highlights: array of 4 key highlight strings
- sampleActivities: array of 5 top itinerary activities with { title, timeSlot: 'morning'|'afternoon'|'evening', locationName, cost, category }

Respond strictly in valid JSON format.`;

      const response = await gemini.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length >= 3) {
          return parsed.map((item, idx) => {
            return buildCompleteTripOption(item, params, idx);
          });
        }
      }
    } catch (err) {
      console.warn('Gemini trip generator fallback triggered:', err);
    }
  }

  // Fallback to intelligent algorithmic template
  return generateAlgorithmicTripOptions(params);
}

function buildCompleteTripOption(geminiItem: any, params: GenerateTripParams, tierIndex: number): AIPlanOption {
  const destName = params.destinations?.length ? params.destinations[0] : params.destination || 'Tokyo';
  const currency = params.currency || '₹';
  const multiplier = tierIndex === 0 ? 0.72 : tierIndex === 1 ? 0.98 : 1.45;
  const cost = Math.round((geminiItem.totalCost || params.budget * multiplier));

  const tripData = createSynthesizedTrip(destName, params, cost, tierIndex);

  return {
    id: `opt_${tierIndex}_${Date.now()}`,
    tier: (tierIndex === 0 ? 'Budget Explorer' : tierIndex === 1 ? 'Balanced Explorer' : 'Premium Explorer') as any,
    totalCost: cost,
    currency: currency,
    tagline: geminiItem.tagline || (tierIndex === 0 ? 'Maximum experiences, minimum expenditure' : tierIndex === 1 ? 'Perfect harmony of comfort and discovery' : 'Elevated luxury and private access'),
    summary: geminiItem.summary || `Curated for ${params.travelGroup} travelers prioritizing ${params.interests.slice(0, 2).join(' & ')}.`,
    highlights: geminiItem.highlights || [
      'Strategically located central accommodation',
      'Curated authentic dining experiences',
      'Optimized daily transit pathways',
      'Skip-the-line iconic cultural sights'
    ],
    tripData
  };
}

function generateAlgorithmicTripOptions(params: GenerateTripParams): AIPlanOption[] {
  const dest = params.destinations?.length ? params.destinations[0] : (params.destination || 'Tokyo, Japan');
  const currency = params.currency || '₹';
  const budget = params.budget || 50000;

  const tiers = [
    {
      tier: 'Budget Explorer' as const,
      cost: Math.round(budget * 0.72),
      tagline: 'High authenticity, smart local spending & hidden gems',
      summary: `Designed for budget-conscious travelers with boutique hostels, street food tours, and free cultural walking routes in ${dest}.`,
      highlights: [
        'Central boutique guesthouse near transit hubs',
        'Iconic street food markets & budget Michelin Bib Gourmands',
        'Transit pass optimizations saving over 40% on local rides',
        'Early-morning crowd-free self-guided landmark hikes'
      ]
    },
    {
      tier: 'Balanced Explorer' as const,
      cost: Math.round(budget * 0.98),
      tagline: 'The sweet spot: comfortable boutique stays & premier highlights',
      summary: `The optimal GlobeTrotter plan balancing curated culinary tastings, seamless rail passes, top-rated boutique hotels, and flexible buffers in ${dest}.`,
      highlights: [
        '4-star central hotel with panoramic city views',
        'Pre-booked skip-the-line passes to premier art & history exhibits',
        'Mix of acclaimed chef tables and vibrant night markets',
        'Built-in 45-minute daily rest buffers for effortless exploration'
      ]
    },
    {
      tier: 'Premium Explorer' as const,
      cost: Math.round(budget * 1.45),
      tagline: 'Uncompromising comfort, private tours & premier luxury',
      summary: `First-class accommodations, private expert guides, exclusive rooftop access, and curated fine dining throughout ${dest}.`,
      highlights: [
        'Luxury 5-star hotel with spa and private executive lounge',
        'Private chauffeur and express bullet train first-class transit',
        'Exclusive VIP private access to landmarks before public hours',
        'Multi-course tasting menus at world-renowned restaurants'
      ]
    }
  ];

  return tiers.map((t, idx) => ({
    id: `opt_algo_${idx}_${Date.now()}`,
    tier: t.tier,
    totalCost: t.cost,
    currency,
    tagline: t.tagline,
    summary: t.summary,
    highlights: t.highlights,
    tripData: createSynthesizedTrip(dest, params, t.cost, idx)
  }));
}

function createSynthesizedTrip(destName: string, params: GenerateTripParams, cost: number, tierIndex: number): Partial<Trip> {
  const days = params.totalDays || 7;
  const startDate = params.startDate || '2026-09-15';
  const currency = params.currency || '₹';

  const defaultStops: TripStop[] = [
    {
      id: `stop_${Date.now()}_1`,
      tripId: '',
      cityName: destName.split(',')[0].trim(),
      country: destName.includes(',') ? destName.split(',')[1].trim() : 'Destination',
      lat: destName.toLowerCase().includes('singapore') ? 1.3521 : destName.toLowerCase().includes('paris') ? 48.8566 : 35.6762,
      lng: destName.toLowerCase().includes('singapore') ? 103.8198 : destName.toLowerCase().includes('paris') ? 2.3522 : 139.6503,
      arrivalDate: startDate,
      departureDate: new Date(new Date(startDate).getTime() + days * 86400000).toISOString().split('T')[0],
      order: 1,
      stayName: tierIndex === 0 ? 'Urban Pod & Social Stay' : tierIndex === 1 ? 'Grand Heritage Boutique Hotel' : 'The Ritz Horizon & Spa',
      stayCost: Math.round(cost * 0.38)
    }
  ];

  const items: ItineraryItem[] = [];
  const startTimestamp = new Date(startDate).getTime();

  for (let d = 1; d <= days; d++) {
    const itemDate = new Date(startTimestamp + (d - 1) * 86400000).toISOString().split('T')[0];

    items.push({
      id: `item_gen_${d}_1`,
      tripId: '',
      stopId: defaultStops[0].id,
      dayNumber: d,
      date: itemDate,
      timeSlot: 'morning',
      startTime: '09:00',
      endTime: '11:30',
      title: d === 1 ? 'Arrival & Neighborhood Historic Stroll' : `Morning Cultural Discovery (Day ${d})`,
      description: `Explore renowned landmarks, architectural treasures, and photo viewpoints around ${destName}.`,
      locationName: `Historic Quarter, ${destName.split(',')[0]}`,
      lat: defaultStops[0].lat + 0.01 * (d % 3),
      lng: defaultStops[0].lng + 0.01 * (d % 2),
      category: 'culture',
      cost: Math.round(cost * 0.03),
      durationMinutes: 150,
      aiMatchScore: 94,
      status: 'planned'
    });

    items.push({
      id: `item_gen_${d}_2`,
      tripId: '',
      stopId: defaultStops[0].id,
      dayNumber: d,
      date: itemDate,
      timeSlot: 'afternoon',
      startTime: '13:00',
      endTime: '16:00',
      title: d % 2 === 0 ? 'Art, Gardens & Immersive Museum Tour' : 'Gourmet Food Safari & Local Craft Market',
      description: 'Hands-on discovery tailored to your travel DNA preferences.',
      locationName: `Arts & Dining District, ${destName.split(',')[0]}`,
      lat: defaultStops[0].lat - 0.012 * (d % 2),
      lng: defaultStops[0].lng + 0.015 * (d % 3),
      category: d % 2 === 0 ? 'photography' : 'food',
      cost: Math.round(cost * 0.05),
      durationMinutes: 180,
      aiMatchScore: 97,
      status: 'planned'
    });

    items.push({
      id: `item_gen_${d}_3`,
      tripId: '',
      stopId: defaultStops[0].id,
      dayNumber: d,
      date: itemDate,
      timeSlot: 'evening',
      startTime: '17:30',
      endTime: '21:00',
      title: 'Sunset Viewpoint & Signature Dinner Experience',
      description: 'Golden hour photography followed by local specialties and relaxed social ambiance.',
      locationName: `Riverfront & Observatory, ${destName.split(',')[0]}`,
      lat: defaultStops[0].lat + 0.005,
      lng: defaultStops[0].lng - 0.008,
      category: 'food',
      cost: Math.round(cost * 0.06),
      durationMinutes: 210,
      aiMatchScore: 98,
      status: 'planned'
    });
  }

  const expenses: Expense[] = [
    { id: `exp_gen_1`, tripId: '', category: 'transport', title: 'Roundtrip Flights & Shuttles', amount: Math.round(cost * 0.36), date: startDate, paidBy: 'user_rahul' },
    { id: `exp_gen_2`, tripId: '', category: 'hotels', title: 'Accommodations Total', amount: Math.round(cost * 0.38), date: startDate, paidBy: 'user_rahul' },
    { id: `exp_gen_3`, tripId: '', category: 'food', title: 'Curated Dining & Food Tours', amount: Math.round(cost * 0.16), date: startDate, paidBy: 'user_rahul' },
    { id: `exp_gen_4`, tripId: '', category: 'activities', title: 'Landmarks, Museums & Passes', amount: Math.round(cost * 0.10), date: startDate, paidBy: 'user_rahul' }
  ];

  return {
    title: `${destName}: ${days}-Day ${tierIndex === 0 ? 'Budget' : tierIndex === 1 ? 'Balanced' : 'Signature'} Odyssey`,
    description: `A custom-generated ${days}-day itinerary in ${destName} optimized for ${params.travelGroup} travelers with a ${params.travelPace} pace.`,
    coverImage: destName.toLowerCase().includes('singapore') ? 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&auto=format&fit=crop&q=80' :
      destName.toLowerCase().includes('paris') ? 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80' :
      destName.toLowerCase().includes('bali') ? 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=80' :
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80',
    startDate,
    endDate: new Date(startTimestamp + days * 86400000).toISOString().split('T')[0],
    totalDays: days,
    currency,
    totalBudget: params.budget || cost,
    estimatedCost: cost,
    actualSpent: Math.round(cost * 0.2),
    travelGroup: params.travelGroup,
    travelPace: params.travelPace,
    interests: params.interests,
    isPublic: true,
    shareCode: `GT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    copiesCount: 0,
    health: {
      score: tierIndex === 0 ? 86 : tierIndex === 1 ? 92 : 95,
      fatigueRisk: 'Low',
      budgetRisk: tierIndex === 2 && cost > params.budget ? 'Moderate' : 'Safe',
      paceDensity: 'Balanced',
      restBufferScore: 90,
      insights: [
        'Optimal daily sequencing with balanced morning and evening rhythms',
        'Transit routes clustered to minimize backtracking',
        'Daily rest allocations built between key sights'
      ]
    },
    stops: defaultStops,
    items,
    expenses
  };
}

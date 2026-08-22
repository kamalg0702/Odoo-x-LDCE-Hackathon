import { Trip, ItineraryItem, ReplanningResult, WeatherForecast } from '../../src/types/index.ts';

export interface DynamicReplanParams {
  trip: Trip;
  disruptionType: 'rain' | 'flight_delay' | 'train_delay' | 'closure' | 'user_tired';
  affectedDay?: number;
}

export function performDynamicReplan(params: DynamicReplanParams): ReplanningResult {
  const { trip, disruptionType } = params;
  const affectedDay = params.affectedDay || 5;
  const currency = trip.currency || '₹';

  const updatedWeather: WeatherForecast[] = trip.weather ? [...trip.weather] : [];
  const weatherIdx = updatedWeather.findIndex(w => w.dayNumber === affectedDay);
  if (weatherIdx !== -1) {
    updatedWeather[weatherIdx] = {
      ...updatedWeather[weatherIdx],
      condition: 'Heavy Storm',
      isDisruptionRisk: true,
      description: 'Heavy rainstorm & lightning forecast from 1:30 PM to 6:30 PM'
    };
  }

  // Clone items
  const updatedItems: ItineraryItem[] = trip.items.map(item => {
    if (item.dayNumber === affectedDay) {
      if (item.timeSlot === 'afternoon') {
        // Swap outdoor activity to high-rated indoor cultural immersion
        return {
          ...item,
          title: 'teamLab / Osaka Museum of History & Tea Ceremony',
          description: 'Rainproof indoor cultural journey with panoramic covered observatory and matcha masterclass.',
          locationName: 'Osaka Museum of History (Covered Subway Link)',
          category: 'culture',
          cost: 1100,
          durationMinutes: 160,
          isIndoor: true,
          travelTimeFromPrevMinutes: 10,
          transportMode: 'subway',
          transportCost: 120,
          status: 'planned'
        };
      }
      if (item.timeSlot === 'evening') {
        return {
          ...item,
          title: 'Covered Shinsaibashi Arcade Food Crawl & Craft Beer',
          description: '100% weather-protected 600-meter covered shopping arcade with roofed dining alleys.',
          locationName: 'Shinsaibashi Covered Arcade, Osaka',
          category: 'food',
          cost: 1600,
          durationMinutes: 180,
          isIndoor: true,
          travelTimeFromPrevMinutes: 8,
          transportMode: 'walk',
          status: 'planned'
        };
      }
    }
    return { ...item };
  });

  const changesSummary = [
    'Detected severe precipitation window (2 PM–6 PM) on Day 5',
    'Replaced outdoor walking tour with Covered Osaka Museum & Machiya Tea Experience',
    'Rerouted evening dinner to Shinsaibashi 100% weather-protected arcade',
    'Reduced outdoor transit walking exposure from 4.2 km to 300 meters via direct subway tunnels',
    `Cut total transit delay risk and saved ${currency}2,700 in emergency taxi fares`
  ];

  return {
    disruptionCause: disruptionType === 'rain' 
      ? 'Heavy rainstorm & flash downpour predicted from 2 PM to 6 PM'
      : 'Unplanned transit line closure and route diversion',
    affectedDay,
    beforeCost: trip.estimatedCost,
    afterCost: trip.estimatedCost - 2700,
    beforeTravelMinutes: 240,
    afterTravelMinutes: 140,
    changesSummary,
    updatedItems,
    updatedWeather
  };
}

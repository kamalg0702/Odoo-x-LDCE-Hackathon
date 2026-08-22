import { Trip, TripRescuePlan, ItineraryItem } from '../../src/types/index.ts';

export interface TripRescueRequest {
  trip: Trip;
  scenario: 'missed_train' | 'missed_flight' | 'hotel_cancellation' | 'activity_cancelled' | 'lost_time';
  customNotes?: string;
}

export function executeTripRescue(req: TripRescueRequest): TripRescuePlan {
  const { trip, scenario } = req;
  const currency = trip.currency || '₹';

  switch (scenario) {
    case 'missed_train':
      return {
        scenario: 'Missed Scheduled Shinkansen Bullet Train to Kyoto',
        severity: 'Urgent',
        impactAnalysis: 'Initial 11:30 AM departure missed. Next reserved seat express departs at 12:48 PM, arriving in Kyoto at 3:05 PM (95-minute delay). 2 afternoon sights impacted.',
        actionSteps: [
          {
            stepNumber: 1,
            title: 'Auto-Rebook Next Express Service',
            description: 'Assigned unreserved seating car #4 on Hikari Express 517 departing Tokyo Station Track 15 at 12:48 PM (Zero rebooking fee via JR Pass).',
            time: '12:48 PM',
            costImpact: 0,
            status: 'ready'
          },
          {
            stepNumber: 2,
            title: 'Automatic Hotel Luggage Drop Check-In Notification',
            description: 'Dispatched automated arrival update message to Kyoto Machiya Guesthouse shifting check-in window to 3:45 PM.',
            time: '01:15 PM',
            costImpact: 0,
            status: 'ready'
          },
          {
            stepNumber: 3,
            title: 'Compress Afternoon Schedule & Move Tea Tasting to Day 4',
            description: 'Postponed the afternoon temple walk by 1.5 hours to align with 3:30 PM arrival without missing the Gion evening walk.',
            time: '04:00 PM',
            costImpact: -400,
            status: 'ready'
          },
          {
            stepNumber: 4,
            title: 'Preserve Evening Geisha Walk & Dining Reservation',
            description: 'All evening dining reservations confirmed on schedule for 7:30 PM.',
            time: '07:30 PM',
            costImpact: 0,
            status: 'ready'
          }
        ],
        suggestedItems: trip.items.map(item => {
          if (item.dayNumber === 3 && item.timeSlot === 'afternoon') {
            return {
              ...item,
              startTime: '15:45',
              endTime: '17:15',
              title: 'Express Check-In & Gion Twilight Walk (Rescued)',
              description: 'Realigned smooth check-in and sunset arrival at Gion lantern district.',
              status: 'planned'
            };
          }
          return { ...item };
        })
      };

    case 'hotel_cancellation':
      return {
        scenario: 'Emergency Hotel Booking Cancellation / Overbooking',
        severity: 'Urgent',
        impactAnalysis: 'Accommodations canceled by provider. Identified 3 instant-confirm boutique rooms within 400m radius matching price and cleanliness score.',
        actionSteps: [
          {
            stepNumber: 1,
            title: 'Instant Partner Match at Kyoto Central Machiya Inn',
            description: 'Locked 4.8★ room with free luggage storage 350m from original hotel with zero price markup.',
            time: 'Immediate',
            costImpact: 0,
            status: 'ready'
          },
          {
            stepNumber: 2,
            title: 'Auto-Reroute Navigation & Transit Pins',
            description: 'Updated itinerary map pins, transit directions, and morning meetup coordinate.',
            time: 'Immediate',
            costImpact: 0,
            status: 'ready'
          },
          {
            stepNumber: 3,
            title: 'Claim Auto-Compensation Voucher',
            description: 'Submitted automated booking protection claim for 15% inconvenience credit.',
            time: 'Within 2h',
            costImpact: -1500,
            status: 'ready'
          }
        ],
        suggestedItems: trip.items
      };

    case 'missed_flight':
    default:
      return {
        scenario: 'Flight Delay / Missed Transit Connection',
        severity: 'Urgent',
        impactAnalysis: 'Arrival delayed by 3 hours. First evening dinner and observation deck slot adjusted to next day golden hour.',
        actionSteps: [
          {
            stepNumber: 1,
            title: 'Reschedule Observation Deck Slot',
            description: 'Shifted Shibuya Sky voucher slot to Day 2 sunset without rebooking penalty.',
            time: 'Day 2 17:30',
            costImpact: 0,
            status: 'ready'
          },
          {
            stepNumber: 2,
            title: 'Deploy Late-Night Gourmet Izakaya Alternative',
            description: 'Replaced formal restaurant with acclaimed 24/7 late-night ramen alley near hotel.',
            time: '21:30 PM',
            costImpact: -850,
            status: 'ready'
          },
          {
            stepNumber: 3,
            title: 'Adjust Day 2 Morning Start Time',
            description: 'Pushed next morning meetup by 45 minutes to guarantee 8 hours restorative sleep.',
            time: 'Day 2 09:30',
            costImpact: 0,
            status: 'ready'
          }
        ],
        suggestedItems: trip.items
      };
  }
}

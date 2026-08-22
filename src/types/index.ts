export type Role = 'owner' | 'editor' | 'viewer';
export type TravelPace = 'relaxed' | 'balanced' | 'fast-paced' | 'fast';
export type TravelPaceType = TravelPace;
export type TravelGroup = 'solo' | 'couple' | 'friends' | 'family';
export type TravelGroupType = TravelGroup;
export type ActivityCategory = 'food' | 'adventure' | 'nature' | 'culture' | 'shopping' | 'nightlife' | 'photography' | 'family' | 'transit' | 'relaxation' | 'sightseeing';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening';
export type TimeSlot = TimeOfDay;
export type ExpenseCategory = 'transport' | 'hotels' | 'food' | 'activities' | 'shopping' | 'misc';

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  avatar: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
  homeCity: string;
  currency: string;
  level: string; // Novice, Adventurer, Globetrotter, World Explorer, Legend
  xp: number;
  travelDNA: TravelDNA;
  visitedCountries: string[];
  visitedCities: string[];
  savedDestinations?: string[];
  language?: string;
}

export interface TravelDNA {
  beachLover: number; // 0-100
  foodExplorer: number;
  adventure: number;
  culture: number;
  photography: number;
  luxury: number;
  budgetConscious: number;
  slowTravel: number;
}

export interface TripStop {
  id: string;
  tripId: string;
  cityName: string;
  country: string;
  lat: number;
  lng: number;
  arrivalDate: string;
  departureDate: string;
  order: number;
  stayName?: string;
  stayCost?: number;
}

export interface ItineraryItem {
  id: string;
  tripId: string;
  stopId: string;
  dayNumber: number; // Day 1, 2, etc.
  date: string;
  timeSlot: TimeOfDay;
  startTime: string; // "09:00"
  endTime: string; // "11:30"
  title: string;
  description: string;
  locationName: string;
  lat: number;
  lng: number;
  category: ActivityCategory;
  cost: number;
  durationMinutes: number;
  travelTimeFromPrevMinutes?: number;
  transportMode?: 'walk' | 'subway' | 'taxi' | 'train' | 'flight' | 'bus';
  transportCost?: number;
  aiMatchScore: number;
  isCustom?: boolean;
  isIndoor?: boolean;
  isPinned?: boolean;
  notes?: string;
  status: 'planned' | 'completed' | 'skipped' | 'disrupted';
  imageUrl?: string;
  votesCount?: number;
  userVoted?: boolean;
}

export interface Expense {
  id: string;
  tripId: string;
  category: ExpenseCategory;
  title: string;
  amount: number;
  date: string;
  dayNumber?: number;
  currency?: string;
  paidBy: string;
  notes?: string;
}
export type ExpenseItem = Expense;

export interface TripMember {
  id: string;
  tripId?: string;
  userId?: string;
  name: string;
  avatar?: string;
  avatarUrl?: string;
  email: string;
  role: Role;
  status?: string;
  travelDNA?: TravelDNA;
}
export type GroupMember = TripMember;

export interface TripHealth {
  score: number; // 0 - 100
  fatigueRisk: 'Low' | 'Medium' | 'High';
  budgetRisk: 'Safe' | 'Moderate' | 'At Risk';
  paceDensity: 'Balanced' | 'Overloaded' | 'Light';
  restBufferScore: number;
  insights: string[];
}

export interface WeatherForecast {
  date?: string;
  dayNumber: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Rain' | 'Heavy Storm' | 'Snow' | string;
  tempC: number;
  isDisruptionRisk?: boolean;
  description: string;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  currency: string;
  totalBudget: number;
  estimatedCost: number;
  actualSpent: number;
  travelGroup: TravelGroup;
  travelPace: TravelPace;
  interests: string[];
  ownerId: string;
  isPublic: boolean;
  shareCode?: string;
  copiesCount: number;
  createdAt: string;
  updatedAt: string;
  health: TripHealth;
  stops: TripStop[];
  items: ItineraryItem[];
  expenses: Expense[];
  members: TripMember[];
  weather: WeatherForecast[];
  comments?: CommentItem[];
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  coverImage?: string;
  imageUrl?: string;
  description?: string;
  tagline?: string;
  costIndex: '$' | '$$' | '$$$' | '$$$$' | string;
  bestTimeToVisit?: string;
  popularityScore?: number;
  avgDailyCost?: number;
  averageDailyCost?: number;
  aiMatchScore: number;
  tags: string[];
  lat: number;
  lng: number;
}

export interface ActivityCatalogItem {
  id: string;
  title: string;
  destination?: string;
  city?: string;
  country: string;
  category: ActivityCategory;
  durationMinutes: number;
  cost: number;
  rating?: number;
  reviewCount?: number;
  bestTime?: string;
  aiMatchScore: number;
  imageUrl: string;
  description: string;
  lat: number;
  lng: number;
  isIndoor: boolean;
}

export interface AIPlanOption {
  id?: string;
  tier: string;
  title?: string;
  tag?: string;
  description?: string;
  totalCost: number;
  currency: string;
  tagline?: string;
  summary?: string;
  highlights?: string[];
  stops?: TripStop[];
  items?: ItineraryItem[];
  tripData?: Partial<Trip>;
}

export interface AICopilotChange {
  id: string;
  type: 'move' | 'replace' | 'add' | 'remove' | 'budget_adjust' | 'rest_buffer';
  description: string;
  impact: string;
  timeSlot?: TimeOfDay;
  dayNumber?: number;
  targetItemId?: string;
  newItem?: Partial<ItineraryItem>;
}

export interface AICopilotActionProposal {
  id: string;
  userPrompt: string;
  summary: string;
  changes: AICopilotChange[];
  stats: {
    costDiff: number;
    travelTimeSavedMinutes: number;
    healthScoreChange: number;
  };
}

export interface RouteOptimizationResult {
  originalTravelMinutes: number;
  optimizedTravelMinutes: number;
  minutesSaved: number;
  costSaved: number;
  optimizedItems: ItineraryItem[];
  rationale: string;
}

export interface BudgetOptimizationResult {
  originalCost: number;
  optimizedCost: number;
  savings: number;
  recommendations: Array<{
    category: ExpenseCategory;
    title: string;
    description: string;
    savingAmount: number;
    actionType: 'substitute' | 'timing' | 'transport_swap';
  }>;
}

export interface ReplanningResult {
  disruptionCause: string;
  affectedDay: number;
  beforeCost: number;
  afterCost: number;
  beforeTravelMinutes: number;
  afterTravelMinutes: number;
  changesSummary: string[];
  updatedItems: ItineraryItem[];
  updatedWeather: WeatherForecast[];
}

export interface TripRescuePlan {
  scenario: string;
  severity: 'Urgent' | 'Moderate';
  impactAnalysis: string;
  actionSteps: Array<{
    stepNumber: number;
    title: string;
    description: string;
    time: string;
    costImpact: number;
    status: 'pending' | 'ready';
  }>;
  suggestedItems: ItineraryItem[];
}

export interface GroupCompatibilityResult {
  overallScore: number;
  commonInterests: string[];
  conflictAreas: string[];
  travelPaceBalance: string;
  recommendation: string;
  memberBreakdown: Array<{
    name: string;
    matchScore: number;
    keyInterest: string;
  }>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  icon?: string;
  xpReward?: number;
  unlocked?: boolean;
  unlockedAt?: string;
  category?: 'planning' | 'exploration' | 'budget' | 'ai' | 'community' | string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'weather' | 'transport' | 'budget' | 'ai' | 'group';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface CommentItem {
  id: string;
  tripId: string;
  itineraryItemId?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

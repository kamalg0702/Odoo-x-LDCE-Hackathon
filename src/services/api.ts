import { 
  Trip, User, Destination, ActivityCatalogItem, Achievement, NotificationItem, 
  CommentItem, AIPlanOption, AICopilotActionProposal, RouteOptimizationResult, 
  BudgetOptimizationResult, ReplanningResult, TripRescuePlan, GroupCompatibilityResult 
} from '../types/index.ts';

const BASE_URL = '/api';

export const api = {
  // Auth
  async login(credentials: string | { email?: string; phoneNumber?: string; name?: string }): Promise<{ success: boolean; user: User }> {
    const payload = typeof credentials === 'string' ? { email: credentials } : credentials;
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async sendOtp(phoneNumber: string): Promise<{ success: boolean; message: string; demoOtp: string }> {
    const res = await fetch(`${BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber })
    });
    return res.json();
  },

  async signup(data: { name: string; email?: string; phoneNumber?: string; homeCity?: string }): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch(`${BASE_URL}/auth/users`);
    return res.json();
  },

  // Trips
  async getTrips(): Promise<Trip[]> {
    const res = await fetch(`${BASE_URL}/trips`);
    return res.json();
  },

  async getTripById(id: string): Promise<Trip> {
    const res = await fetch(`${BASE_URL}/trips/${id}`);
    if (!res.ok) throw new Error('Trip not found');
    return res.json();
  },

  async createTrip(tripData: Partial<Trip>): Promise<Trip> {
    const res = await fetch(`${BASE_URL}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tripData)
    });
    return res.json();
  },

  async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
    const res = await fetch(`${BASE_URL}/trips/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteTrip(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/trips/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async copyTrip(id: string, userId: string): Promise<Trip> {
    const res = await fetch(`${BASE_URL}/trips/${id}/copy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  // Stops (Screen 5 Itinerary Builder)
  async addStop(tripId: string, stop: any): Promise<Trip> {
    const res = await fetch(`${BASE_URL}/trips/${tripId}/stops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stop)
    });
    return res.json();
  },

  async updateStop(tripId: string, stopId: string, updates: any): Promise<Trip> {
    const res = await fetch(`${BASE_URL}/trips/${tripId}/stops/${stopId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteStop(tripId: string, stopId: string): Promise<Trip> {
    const res = await fetch(`${BASE_URL}/trips/${tripId}/stops/${stopId}`, { method: 'DELETE' });
    return res.json();
  },

  // Profile & Settings
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.json();
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...updates })
    });
    return res.json();
  },

  async deleteAccount(userId: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/auth/account`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  // Activities & Items
  async addActivity(tripId: string, item: any): Promise<Trip> {
    const res = await fetch(`${BASE_URL}/trips/${tripId}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    return res.json();
  },

  async updateActivity(tripId: string, itemId: string, updates: any): Promise<Trip> {
    const res = await fetch(`${BASE_URL}/trips/${tripId}/activities/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteActivity(tripId: string, itemId: string): Promise<Trip> {
    const res = await fetch(`${BASE_URL}/trips/${tripId}/activities/${itemId}`, { method: 'DELETE' });
    return res.json();
  },

  async voteActivity(tripId: string, itemId: string): Promise<Trip> {
    const res = await fetch(`${BASE_URL}/trips/${tripId}/activities/${itemId}/vote`, { method: 'POST' });
    return res.json();
  },

  // Expenses
  async addExpense(tripId: string, expense: any): Promise<Trip> {
    const res = await fetch(`${BASE_URL}/trips/${tripId}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });
    return res.json();
  },

  async deleteExpense(tripId: string, expenseId: string): Promise<Trip> {
    const res = await fetch(`${BASE_URL}/trips/${tripId}/expenses/${expenseId}`, { method: 'DELETE' });
    return res.json();
  },

  // Comments
  async getComments(tripId: string): Promise<CommentItem[]> {
    const res = await fetch(`${BASE_URL}/trips/${tripId}/comments`);
    return res.json();
  },

  async addComment(tripId: string, data: any): Promise<CommentItem> {
    const res = await fetch(`${BASE_URL}/trips/${tripId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Catalogs
  async getDestinations(): Promise<Destination[]> {
    const res = await fetch(`${BASE_URL}/destinations`);
    return res.json();
  },

  async getActivities(): Promise<ActivityCatalogItem[]> {
    const res = await fetch(`${BASE_URL}/activities`);
    return res.json();
  },

  async getAchievements(): Promise<Achievement[]> {
    const res = await fetch(`${BASE_URL}/achievements`);
    return res.json();
  },

  async getNotifications(): Promise<NotificationItem[]> {
    const res = await fetch(`${BASE_URL}/notifications`);
    return res.json();
  },

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/notifications/${id}/read`, { method: 'POST' });
    return res.json();
  },

  // Admin
  async getAdminMetrics(): Promise<any> {
    const res = await fetch(`${BASE_URL}/admin/metrics`);
    return res.json();
  },

  async getAdminStats(): Promise<any> {
    return this.getAdminMetrics();
  },

  async analyzeGroupSynergy(tripId: string, members: any[]): Promise<any> {
    return this.getGroupCompatibility(members);
  },

  // AI Engines
  async generateTrip(params: any): Promise<{ success: boolean; options: AIPlanOption[] }> {
    const res = await fetch(`${BASE_URL}/ai/generate-trip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return res.json();
  },

  async triggerCopilot(tripId: string, prompt: string, tripData?: Trip): Promise<AICopilotActionProposal> {
    const res = await fetch(`${BASE_URL}/ai/copilot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId, prompt, tripData })
    });
    return res.json();
  },

  async optimizeRoute(tripId: string, dayNumber?: number, tripData?: Trip): Promise<RouteOptimizationResult> {
    const res = await fetch(`${BASE_URL}/ai/optimize-route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId, dayNumber, tripData })
    });
    return res.json();
  },

  async optimizeBudget(tripId: string, tripData?: Trip): Promise<BudgetOptimizationResult> {
    const res = await fetch(`${BASE_URL}/ai/optimize-budget`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId, tripData })
    });
    return res.json();
  },

  async dynamicReplan(tripId: string, disruptionType: string, affectedDay?: number, tripData?: Trip): Promise<ReplanningResult> {
    const res = await fetch(`${BASE_URL}/ai/replan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId, disruptionType, affectedDay, tripData })
    });
    return res.json();
  },

  async triggerTripRescue(tripId: string, scenario: string, tripData?: Trip): Promise<TripRescuePlan> {
    const res = await fetch(`${BASE_URL}/ai/trip-rescue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId, scenario, tripData })
    });
    return res.json();
  },

  async getGroupCompatibility(members: any[]): Promise<GroupCompatibilityResult> {
    const res = await fetch(`${BASE_URL}/ai/group-compatibility`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ members })
    });
    return res.json();
  },

  async photoToTrip(imageOrPrompt: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/ai/photo-to-trip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageOrPrompt })
    });
    return res.json();
  },

  async executeAgent(tripId: string, command: string, tripData?: Trip): Promise<any> {
    const res = await fetch(`${BASE_URL}/ai/agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId, command, tripData })
    });
    return res.json();
  }
};

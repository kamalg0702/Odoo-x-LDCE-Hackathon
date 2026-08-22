import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db/store.ts';
import { generateTripOptions } from './server/ai/tripPlanner.ts';
import { processCopilotPrompt } from './server/ai/copilotEngine.ts';
import { optimizeTripRoute } from './server/ai/routeOptimizer.ts';
import { optimizeTripBudget } from './server/ai/budgetOptimizer.ts';
import { performDynamicReplan } from './server/ai/replanningEngine.ts';
import { executeTripRescue } from './server/ai/tripRescueEngine.ts';
import { calculateGroupTripCompatibility } from './server/ai/groupTripEngine.ts';
import { analyzePhotoAndBuildTrip } from './server/ai/photoToTripEngine.ts';
import { executeAgentAction } from './server/ai/agentEngine.ts';
import { Trip, User } from './src/types/index.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // ==========================================
  // AUTH ROUTES
  // ==========================================
  app.post('/api/auth/login', (req, res) => {
    const { email, phoneNumber, name } = req.body;
    let user: User | undefined;

    if (email) {
      user = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    }
    if (!user && phoneNumber) {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      user = db.users.find(u => (u.phoneNumber || '').replace(/\D/g, '').includes(cleanPhone) || cleanPhone.includes((u.phoneNumber || '').replace(/\D/g, '')));
    }
    if (!user && name) {
      user = db.users.find(u => u.name.toLowerCase() === name.trim().toLowerCase());
    }

    if (!user) {
      // Auto-create or default to first demo user
      if (name || email || phoneNumber) {
        user = {
          id: `user_${Date.now()}`,
          name: name || 'Demo Traveler',
          email: email || `${(name || 'traveler').toLowerCase().replace(/\s+/g, '')}@gmail.com`,
          phoneNumber: phoneNumber || '+91 98401 23456',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          role: 'user',
          homeCity: 'San Francisco, USA',
          currency: '₹',
          level: 'Adventurer',
          xp: 1200,
          visitedCountries: ['India', 'Japan'],
          visitedCities: ['Chennai', 'Tokyo'],
          travelDNA: {
            foodExplorer: 85,
            beachLover: 75,
            adventure: 80,
            culture: 85,
            photography: 90,
            luxury: 65,
            budgetConscious: 75,
            slowTravel: 70
          }
        };
        db.users.push(user);
      } else {
        user = db.users[0];
      }
    }
    res.json({ success: true, user });
  });

  app.post('/api/auth/send-otp', (req, res) => {
    const { phoneNumber } = req.body;
    // Return mock OTP for instant demo verification
    res.json({ 
      success: true, 
      message: `Demo OTP sent to ${phoneNumber || 'your phone number'}.`, 
      demoOtp: '7729' 
    });
  });

  app.post('/api/auth/signup', (req, res) => {
    const { name, email, phoneNumber, homeCity } = req.body;
    const existing = db.users.find(u => (email && u.email.toLowerCase() === email.toLowerCase()) || (phoneNumber && u.phoneNumber === phoneNumber));
    if (existing) {
      return res.json({ success: true, user: existing });
    }
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name || 'Traveler',
      email: email || `user_${Date.now()}@gmail.com`,
      phoneNumber: phoneNumber || '+91 98401 23456',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'user',
      homeCity: homeCity || 'San Francisco, USA',
      currency: '₹',
      level: 'Novice Explorer',
      xp: 150,
      visitedCountries: ['India'],
      visitedCities: ['Chennai'],
      travelDNA: {
        foodExplorer: 80,
        beachLover: 70,
        adventure: 75,
        culture: 80,
        photography: 85,
        luxury: 60,
        budgetConscious: 80,
        slowTravel: 65
      }
    };
    db.users.push(newUser);
    res.json({ success: true, user: newUser });
  });

  app.get('/api/auth/users', (req, res) => {
    res.json(db.users);
  });

  // ==========================================
  // TRIPS CRUD
  // ==========================================
  app.get('/api/trips', (req, res) => {
    res.json(db.trips);
  });

  app.get('/api/trips/:id', (req, res) => {
    const trip = db.getTripById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.json(trip);
  });

  app.post('/api/trips', (req, res) => {
    const tripData = req.body;
    const newTrip: Trip = {
      id: `trip_${Date.now()}`,
      title: tripData.title || 'Untitled Journey',
      description: tripData.description || '',
      coverImage: tripData.coverImage || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
      startDate: tripData.startDate || '2026-09-10',
      endDate: tripData.endDate || '2026-09-17',
      totalDays: tripData.totalDays || 7,
      currency: tripData.currency || '₹',
      totalBudget: tripData.totalBudget || 50000,
      estimatedCost: tripData.estimatedCost || 48000,
      actualSpent: tripData.actualSpent || 0,
      travelGroup: tripData.travelGroup || 'solo',
      travelPace: tripData.travelPace || 'balanced',
      interests: tripData.interests || ['food', 'culture'],
      ownerId: tripData.ownerId || 'user_rahul',
      isPublic: tripData.isPublic !== undefined ? tripData.isPublic : true,
      shareCode: `GT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      copiesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      health: tripData.health || {
        score: 92,
        fatigueRisk: 'Low',
        budgetRisk: 'Safe',
        paceDensity: 'Balanced',
        restBufferScore: 90,
        insights: ['Clean daily pace', 'Well distributed activities']
      },
      stops: tripData.stops || [],
      items: tripData.items || [],
      expenses: tripData.expenses || [],
      members: tripData.members || [
        {
          id: `mem_${Date.now()}`,
          tripId: '',
          userId: 'user_rahul',
          name: 'Rahul Sharma',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          email: 'rahul@globetrotter.ai',
          role: 'owner',
          travelDNA: db.users[0].travelDNA
        }
      ],
      weather: tripData.weather || [
        { date: tripData.startDate || '2026-09-10', dayNumber: 1, condition: 'Sunny', tempC: 24, description: 'Mild weather' }
      ]
    };
    newTrip.stops.forEach(s => s.tripId = newTrip.id);
    newTrip.items.forEach(i => i.tripId = newTrip.id);
    newTrip.expenses.forEach(e => e.tripId = newTrip.id);
    newTrip.members.forEach(m => m.tripId = newTrip.id);

    db.createTrip(newTrip);
    res.status(201).json(newTrip);
  });

  app.put('/api/trips/:id', (req, res) => {
    const updated = db.updateTrip(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Trip not found' });
    res.json(updated);
  });

  app.delete('/api/trips/:id', (req, res) => {
    const ok = db.deleteTrip(req.params.id);
    res.json({ success: ok });
  });

  app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    res.json({
      success: true,
      message: `Password reset instructions and verification link have been dispatched to ${email || 'your email'}.`
    });
  });

  app.put('/api/auth/profile', (req, res) => {
    const { userId, ...updates } = req.body;
    const targetId = userId || 'user_rahul';
    const updated = db.updateUser(targetId, updates);
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user: updated });
  });

  app.delete('/api/auth/account', (req, res) => {
    const { userId } = req.body;
    const ok = db.deleteUser(userId || 'user_rahul');
    res.json({ success: ok, message: 'Account data purged successfully' });
  });

  // Stops Management (Screen 5 Itinerary Builder)
  app.post('/api/trips/:id/stops', (req, res) => {
    const stop = { ...req.body, id: req.body.id || `stop_${Date.now()}`, tripId: req.params.id };
    const trip = db.addStop(req.params.id, stop);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.status(201).json(trip);
  });

  app.put('/api/trips/:id/stops/:stopId', (req, res) => {
    const trip = db.updateStop(req.params.id, req.params.stopId, req.body);
    if (!trip) return res.status(404).json({ error: 'Trip or stop not found' });
    res.json(trip);
  });

  app.delete('/api/trips/:id/stops/:stopId', (req, res) => {
    const trip = db.deleteStop(req.params.id, req.params.stopId);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  });

  // Itinerary Items
  app.post('/api/trips/:id/activities', (req, res) => {
    const item = { ...req.body, id: req.body.id || `item_${Date.now()}`, tripId: req.params.id };
    const trip = db.addItineraryItem(req.params.id, item);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.status(201).json(trip);
  });

  app.put('/api/trips/:id/activities/:itemId', (req, res) => {
    const trip = db.updateItineraryItem(req.params.id, req.params.itemId, req.body);
    if (!trip) return res.status(404).json({ error: 'Trip or activity not found' });
    res.json(trip);
  });

  app.delete('/api/trips/:id/activities/:itemId', (req, res) => {
    const trip = db.deleteItineraryItem(req.params.id, req.params.itemId);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  });

  // Expenses
  app.post('/api/trips/:id/expenses', (req, res) => {
    const exp = { ...req.body, id: `exp_${Date.now()}`, tripId: req.params.id };
    const trip = db.addExpense(req.params.id, exp);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.status(201).json(trip);
  });

  app.delete('/api/trips/:id/expenses/:expenseId', (req, res) => {
    const trip = db.deleteExpense(req.params.id, req.params.expenseId);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  });

  // Share & Fork/Copy
  app.post('/api/trips/:id/copy', (req, res) => {
    const original = db.getTripById(req.params.id);
    if (!original) return res.status(404).json({ error: 'Original trip not found' });
    
    original.copiesCount = (original.copiesCount || 0) + 1;

    const forked: Trip = {
      ...JSON.parse(JSON.stringify(original)),
      id: `trip_fork_${Date.now()}`,
      title: `${original.title} (My Copy)`,
      ownerId: req.body.userId || 'user_rahul',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      copiesCount: 0,
      shareCode: `GT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
    };
    db.createTrip(forked);
    res.status(201).json(forked);
  });

  // Comments & Voting
  app.get('/api/trips/:id/comments', (req, res) => {
    const list = db.comments.filter(c => c.tripId === req.params.id);
    res.json(list);
  });

  app.post('/api/trips/:id/comments', (req, res) => {
    const { userId, userName, userAvatar, content, itineraryItemId } = req.body;
    const comment: any = {
      id: `comm_${Date.now()}`,
      tripId: req.params.id,
      itineraryItemId,
      userId: userId || 'user_rahul',
      userName: userName || 'Rahul Sharma',
      userAvatar: userAvatar || db.users[0].avatar,
      content,
      createdAt: new Date().toISOString()
    };
    db.comments.push(comment);
    res.status(201).json(comment);
  });

  app.post('/api/trips/:id/activities/:itemId/vote', (req, res) => {
    const trip = db.getTripById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    const item = trip.items.find(i => i.id === req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    
    item.userVoted = !item.userVoted;
    item.votesCount = (item.votesCount || 0) + (item.userVoted ? 1 : -1);
    trip.updatedAt = new Date().toISOString();
    res.json(trip);
  });

  // ==========================================
  // CATALOG & DISCOVERY ROUTES
  // ==========================================
  app.get('/api/destinations', (req, res) => {
    res.json(db.destinations);
  });

  app.get('/api/activities', (req, res) => {
    res.json(db.activities);
  });

  app.get('/api/achievements', (req, res) => {
    res.json(db.achievements);
  });

  app.get('/api/notifications', (req, res) => {
    res.json(db.notifications);
  });

  app.post('/api/notifications/:id/read', (req, res) => {
    const notif = db.notifications.find(n => n.id === req.params.id);
    if (notif) notif.read = true;
    res.json({ success: true });
  });

  // ==========================================
  // ADVANCED AI ENGINE ROUTES
  // ==========================================
  app.post('/api/ai/generate-trip', async (req, res) => {
    try {
      const options = await generateTripOptions(req.body);
      res.json({ success: true, options });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/ai/copilot', async (req, res) => {
    try {
      const { tripId, prompt } = req.body;
      const trip = db.getTripById(tripId) || req.body.tripData;
      if (!trip) return res.status(400).json({ error: 'Trip context required' });
      const proposal = await processCopilotPrompt(trip, prompt);
      res.json(proposal);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/ai/optimize-route', (req, res) => {
    try {
      const { tripId, dayNumber } = req.body;
      const trip = db.getTripById(tripId) || req.body.tripData;
      if (!trip) return res.status(400).json({ error: 'Trip context required' });
      const result = optimizeTripRoute(trip, dayNumber);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/ai/optimize-budget', (req, res) => {
    try {
      const { tripId } = req.body;
      const trip = db.getTripById(tripId) || req.body.tripData;
      if (!trip) return res.status(400).json({ error: 'Trip context required' });
      const result = optimizeTripBudget(trip);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/ai/replan', (req, res) => {
    try {
      const { tripId, disruptionType, affectedDay } = req.body;
      const trip = db.getTripById(tripId) || req.body.tripData;
      if (!trip) return res.status(400).json({ error: 'Trip context required' });
      const result = performDynamicReplan({ trip, disruptionType: disruptionType || 'rain', affectedDay });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/ai/trip-rescue', (req, res) => {
    try {
      const { tripId, scenario } = req.body;
      const trip = db.getTripById(tripId) || req.body.tripData;
      if (!trip) return res.status(400).json({ error: 'Trip context required' });
      const result = executeTripRescue({ trip, scenario: scenario || 'missed_train' });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/ai/group-compatibility', (req, res) => {
    try {
      const { members } = req.body;
      const result = calculateGroupTripCompatibility(members || []);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/ai/photo-to-trip', async (req, res) => {
    try {
      const { imageOrPrompt } = req.body;
      const result = await analyzePhotoAndBuildTrip(imageOrPrompt || 'Tokyo, Japan');
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/ai/agent', (req, res) => {
    try {
      const { tripId, command } = req.body;
      const trip = db.getTripById(tripId) || req.body.tripData;
      if (!trip) return res.status(400).json({ error: 'Trip context required' });
      const result = executeAgentAction(trip, command || 'Make schedule more relaxing and optimize transport');
      // If trip exists in DB, update it
      if (db.getTripById(trip.id)) {
        db.updateTrip(trip.id, result.updatedTrip);
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin Metrics
  app.get('/api/admin/metrics', (req, res) => {
    const totalUsers = db.users.length + 1284;
    const totalTrips = db.trips.length + 3890;
    const totalAIInvocations = 18450;
    const avgBudget = 64200;
    const popularDestinations = [
      { city: 'Tokyo', count: 1420, matchAvg: 96 },
      { city: 'Kyoto', count: 980, matchAvg: 94 },
      { city: 'Singapore', count: 850, matchAvg: 91 },
      { city: 'Paris', count: 760, matchAvg: 89 },
      { city: 'Bali', count: 710, matchAvg: 95 }
    ];
    res.json({
      totalUsers,
      totalTrips,
      totalAIInvocations,
      avgBudget,
      popularDestinations,
      recentTrips: db.trips
    });
  });

  // ==========================================
  // VITE MIDDLEWARE OR STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GlobeTrotter AI Server running on http://localhost:${PORT}`);
  });
}

startServer();

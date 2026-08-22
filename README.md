# GlobeTrotter — Multi-City Personalized Travel Planner

> **"Atlas meets Dashboard"**: An intelligent, modular full-stack web application for planning multi-city journeys with interactive route visualization, drag-and-drop itinerary sequencing, destination cost indexing, real-time budget calculation, day-by-day Gantt timeline, and public sharing.

---

## 🌟 Key Features & 13 Screens

1. **Login & Registration (`/auth/login`, `/auth/register`)**: JWT authentication (access & refresh tokens) with quick-fill demo traveler and administrator credentials.
2. **Travel Dashboard (`/dashboard`)**: Central hub displaying active trips, key statistics, upcoming journey route previews, and curated destination highlights.
3. **Trip Creation (`/trips/new`)**: Smart trip initiator with duration calculator, budget limit goal, and curated artwork presets.
4. **My Trips (`/trips`)**: Filterable journey grid with status tags, search, and signature animated SVG route lines connecting city dots.
5. **Itinerary Builder (`/trips/:id/build`)**: Drag-and-drop reordering of stops powered by `@dnd-kit`, transition modes (Flight, Train, Drive, Bus, Ferry), budget allocations, and stop notes.
6. **Itinerary Overview (`/trips/:id/view`)**: Chronological journey blueprint with destination photography, stop numbers, and scheduled activities.
7. **City Catalog & Discovery (`/trips/:id/cities`)**: Prepopulated catalog of **50+ global destinations** with cost indices, popularity ratings, descriptions, and 1-click "Add to Trip".
8. **Activity Discovery & Scheduler (`/trips/:id/stops/:stopId/activities`)**: Filter by category (Culture, Food, Adventure, Sightseeing, Nature, Nightlife) with custom scheduling, time tags, and cost tracking.
9. **Budget & Cost Breakdown (`/trips/:id/budget`)**: Interactive Recharts visualizations (Category Pie Chart + Stop Comparison Bar Chart), overbudget alerts, and custom expense logger.
10. **Timeline & Calendar (`/trips/:id/calendar`)**: Day-by-day vertical schedule matching days to destination stays and specific activity times.
11. **Public Share View (`/share/:slug`)**: High-aesthetic read-only public trip overview requiring **zero authentication**.
12. **Profile & Settings (`/profile`)**: Manage user avatar presets, bio, preferred currency (`USD`, `EUR`, `GBP`, `JPY`, `AUD`, `CAD`, `INR`), and credentials.
13. **Admin Dashboard (`/admin`)**: Role-gated portal displaying platform statistics, trip analytics, and traveler role toggles.

---

## 🏛️ Modular Architecture

### Backend (`backend/`)
Every module is strictly self-contained with no cross-module model definitions import:
- `app/core/`: `config.py`, `database.py`, `extensions.py`, `middleware.py` (standard response format `{ success: bool, data: {}, error: null }`).
- `app/modules/auth/`: User registration, login, refresh, logout, profile update.
- `app/modules/trips/`: Trip CRUD, cover photo picker, slug generator.
- `app/modules/stops/`: Stop CRUD, reordering endpoint (`PATCH /api/trips/:id/stops/reorder`).
- `app/modules/cities/`: 50+ world cities catalog with search and filters.
- `app/modules/activities/`: City catalog activities and scheduled stop activities.
- `app/modules/budget/`: Automated financial summation and custom expense items.
- `app/modules/share/`: Public share token generator and unauthenticated public trip resolver.
- `app/modules/admin/`: System-wide analytics and role governance.
- `seeds.py`: Prepopulates 50+ cities, curated activities, demo accounts, and a sample trip.

### Frontend (`frontend/src/`)
- `core/api/`: Modular Axios domain files (`client.js`, `auth.api.js`, `trips.api.js`, etc.) with automated JWT refresh interceptors.
- `core/store/`: Independent Zustand stores (`auth.store.js`, `trips.store.js`, `stops.store.js`, etc.).
- `core/hooks/`: Custom hooks (`useAuth`, `useTrip`, `useStops`, `useBudget`, `useCities`).
- `core/utils/`: Formatting utilities (`date.js`, `currency.js`, `slug.js`).
- `components/ui/`: Pure props-only UI primitives (`Button`, `Card`, `Modal`, `Input`, `Badge`, `Tabs`, `ProgressBar`).
- `components/layout/`: `Navbar`, `Sidebar`, `PageWrapper`, `TripHeader`.
- `components/shared/`: `TripCard` with SVG route lines, `ActivityItem`, `CitySearchBar`, `BudgetChart`, `ShareModal`.
- `features/`: 13 isolated screen components.
- `router/index.jsx`: Lazy-loaded routes with `React.lazy()` and authentication guards.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+ / Conda
- Node.js 18+ and npm

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Create or activate virtual environment (e.g. conda odoo2)
conda activate odoo2

# Install dependencies
pip install -r requirements.txt

# Run initial database seeds (populates 50 cities, activities, and demo user)
python seeds.py

# Start Flask backend server (runs on http://127.0.0.1:5000)
python run.py
```

### 2. Frontend Setup

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install npm packages
npm install

# Start Vite development server (runs on http://localhost:5173)
npm run dev
```

---

## 🔑 Default Demo Accounts

| Account Role | Email | Password |
|---|---|---|
| **Demo Traveler** | `traveler@globetrotter.io` | `Traveler123!` |
| **Platform Admin** | `admin@globetrotter.io` | `AdminPass123!` |

*(Both accounts can be quick-filled directly with 1-click on the login screen).*

---

## 🗄️ Database Configuration & PostgreSQL Swapping

By default, GlobeTrotter utilizes a local SQLite database (`backend/globetrotter.db`).
To switch to PostgreSQL in production, simply supply the `DATABASE_URL` environment variable:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/globetrotter
```
Zero code changes required.

---

## 🧪 Testing

To run the automated backend test suite covering all API contracts:
```bash
cd backend
python test_api.py
```
To test frontend production bundling:
```bash
cd frontend
npm run build
```

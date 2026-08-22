<div align="center">

<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />

</div>

# GlobeTrotter — AI-Powered Multi-City Travel Planner

An intelligent, modular full-stack web application for planning personalized multi-city journeys with AI-powered travel assistance, interactive route visualization, itinerary sequencing, destination discovery, budget tracking, and trip management.

## 🚀 Features

* AI-powered trip planning and travel assistance
* Multi-city itinerary creation
* Interactive trip dashboard
* Drag-and-drop itinerary sequencing
* Route and map visualization
* Destination discovery
* Budget planning and analytics
* Day-by-day itinerary timeline
* Calendar-based trip planning
* Group trip planning
* AI travel copilot
* Photo-to-trip planning
* Automatic trip replanning
* Trip rescue assistance
* Public trip sharing
* User authentication
* Profile and travel preferences
* Admin dashboard
* Responsive mobile-friendly interface

## 🤖 AI Features

The application includes multiple AI-powered modules:

* **AI Agent Engine** — Intelligent travel planning and task execution
* **AI Copilot** — Context-aware assistance while planning trips
* **Budget Optimizer** — Helps optimize travel expenses
* **Trip Planner** — Generates personalized itineraries
* **Group Trip Engine** — Supports collaborative travel planning
* **Photo-to-Trip Engine** — Converts travel photos or destinations into trip ideas
* **Route Optimizer** — Helps optimize travel routes
* **Replanning Engine** — Dynamically adjusts itineraries
* **Trip Rescue Engine** — Helps recover from travel disruptions
* **Gemini Client** — AI integration using Google's Gemini API

## 🏗️ Project Architecture

### Frontend

The frontend is built using modern React and TypeScript technologies.

```text
src/
├── components/
│   ├── budget/
│   ├── calendar/
│   ├── common/
│   ├── layout/
│   ├── map/
│   └── timeline/
├── context/
├── pages/
├── services/
├── types/
├── utils/
├── App.tsx
├── index.css
└── main.tsx
```

### Backend

The server-side AI and application logic is organized into modular services.

```text
server/
├── ai/
│   ├── agentEngine.ts
│   ├── budgetOptimizer.ts
│   ├── copilotEngine.ts
│   ├── geminiClient.ts
│   ├── groupTripEngine.ts
│   ├── photoToTripEngine.ts
│   ├── replanningEngine.ts
│   ├── routeOptimizer.ts
│   ├── tripPlanner.ts
│   └── tripRescueEngine.ts
└── db/
    └── store.ts
```

## 🛠️ Technologies Used

* React
* TypeScript
* Vite
* Tailwind CSS
* Node.js
* Bun
* Google Gemini API
* Recharts
* Map and route visualization
* Modern component-based architecture

## 📋 Prerequisites

Before running the application, make sure you have:

* Node.js 18+
* npm
* Bun (if using the Bun workflow)
* A Gemini API key

## ⚡ Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/kamalg0702/Odoo-x-LDCE-Hackathon.git
cd Odoo-x-LDCE-Hackathon
```

### 2. Install dependencies

Using npm:

```bash
npm install
```

Or using Bun:

```bash
bun install
```

### 3. Configure environment variables

Create a `.env.local` file and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Never commit your actual API key to GitHub.**

### 4. Start the development server

Using npm:

```bash
npm run dev
```

Or using Bun:

```bash
bun run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

## 🔐 Environment Variables

Use `.env.example` as a reference for the required environment variables.

Do not upload:

```text
.env
.env.local
```

if they contain real API keys or credentials.

## 📁 Important Files

| File                        | Purpose                          |
| --------------------------- | -------------------------------- |
| `package.json`              | Project dependencies and scripts |
| `vite.config.ts`            | Vite configuration               |
| `tsconfig.json`             | TypeScript configuration         |
| `server.ts`                 | Application server               |
| `metadata.json`             | Application metadata             |
| `src/App.tsx`               | Main React application           |
| `src/services/api.ts`       | API/service integration          |
| `server/ai/geminiClient.ts` | Gemini AI integration            |
| `.env.example`              | Environment variable template    |

## 🌟 Project Vision

GlobeTrotter aims to provide a unified intelligent travel-planning experience where users can discover destinations, build personalized itineraries, manage budgets, optimize routes, and receive AI-powered assistance from a single platform.

## 🏆 Hackathon Project

This project is developed as part of the **Odoo x LDCE Hackathon**.

The goal is to combine modern web technologies with AI-driven travel intelligence to create a practical and engaging travel-planning platform.

## 📄 License

This project is intended for hackathon and educational purposes.

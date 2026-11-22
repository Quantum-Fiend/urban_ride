# RideSphere Frontend Suite

## Overview
RideSphere Frontend is a high-performance, enterprise-grade Next.js 15 application suite providing modern, responsive web experiences for:
1. **Rider Web Experience (`/`)**:
   - Interactive vector canvas navigation map with live moving vehicle simulation
   - Quick waypoint selectors & route planning
   - Dynamic fare estimates across 5 vehicle tiers (Economy, Comfort, XL, Black, EV)
   - Real-time trip state tracker (`REQUESTED` $\to$ `MATCHING` $\to$ `ACCEPTED` $\to$ `ARRIVED` $\to$ `IN_PROGRESS` $\to$ `COMPLETED`)
   - 4-digit ride OTP security PIN
   - Interactive trip receipt and driver rating modal
   - Digital wallet top-up system

2. **Driver Cockpit (`/driver`)**:
   - Online / Offline toggle with live GPS telemetry broadcast
   - Incoming dispatch alert with 15-second countdown timer and Accept/Decline actions
   - Turn-by-turn navigation HUD
   - Passenger onboard 4-digit PIN verification
   - In-ride live fare meter and earnings calculator

3. **Operations & Fleet Center (`/admin`)**:
   - Executive platform KPI telemetry (Active Rides, Fleet Size, Gross Revenue, Surge Multipliers)
   - Dynamic Pricing Rule engine
   - Live fleet roster with driver status, vehicle details, and ratings
   - Infrastructure health metrics (API latency, Redis hit rate, Kafka throughput)

## Technology Stack
- **Framework**: Next.js 14 / 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, PostCSS, Lucide Icons
- **Design Aesthetic**: Ultra-modern glassmorphic dark theme (`#070A10`), neon cyan/emerald accents

## Getting Started
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

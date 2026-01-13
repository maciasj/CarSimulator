# 🚗 DriveSim Pro: Car Interaction Simulator

An immersive static car simulator with comprehensive environmental controls, vehicle functions, and real-time backend synchronization.

**View your app in AI Studio:** https://ai.studio/apps/drive/1t7tlsAD-N5OfE6GcgW6hGRvhlhuyl0pl

---

## ✨ Features

### 🎮 Control Systems
- **Engine Controls** - Start/stop engine with safety checks
- **Lighting Systems** - Headlights, high beams, fog lights, parking lights, interior lights
- **Signal & Hazards** - Left/right turn signals, hazard lights
- **Climate Control** - Wipers with multiple speeds, window controls
- **Body Controls** - Hood, trunk, doors, windows management
- **Special Features** - Horn, car wash, tire pressure monitoring

### 🌍 Environmental Simulation
- **Day/Night Mode** - Dynamic lighting transitions
- **Weather System** - Rain simulation with visual effects
- **Failure Scenarios** - Engine breakdown, oil leaks, battery dead, fuel empty
- **Tire Management** - Individual tire pressure monitoring (FL, FR, RL, RR)

### 🔄 Real-Time Synchronization
- **Frontend ↔ Backend** - Live state synchronization (500ms polling)
- **JSON Persistence** - All states saved to `carState.json`
- **Multi-Client Support** - Multiple users see same state
- **Event Tracking** - Complete event logging and history

### 🛠️ Developer Tools
- **Dev Console** - Real-time event logs and debugging
- **API Endpoints** - REST API for programmatic control
- **State Management** - React useReducer with full action dispatch

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 16.0.0
- **npm** (comes with Node.js)

### Installation

1. **Clone or navigate to the project:**
   ```bash
   cd drivesim-pro_-car-interaction-simulator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the backend server** (in one terminal):
   ```bash
   npm run backend
   ```
   Expected output:
   ```
   🚗 DriveSim Pro Backend Running
   📡 Server: http://localhost:5000
   ✅ Status Endpoint: http://localhost:5000/status
   📝 Edit: ./backend/carState.json
   ```

5. **Start the frontend** (in another terminal):
   ```bash
   npm run dev
   ```
   Expected output:
   ```
   Local: http://localhost:3000
   ```

6. **Open in browser:**
   Navigate to `http://localhost:3000`

---

## 📁 Project Structure

```
drivesim-pro_-car-interaction-simulator/
├── backend/
│   ├── server.js              # Express backend server
│   └── carState.json          # ⭐ Editable state file (auto-synced)
├── components/
│   ├── CarView.tsx            # Car visualization component
│   ├── ControlPanel.tsx       # Control buttons & UI
│   ├── Dashboard.tsx          # Main dashboard layout
│   ├── DevConsole.tsx         # Developer console & logs
│   ├── Environment.tsx        # Weather & lighting effects
│   ├── EventPanel.tsx         # Event history panel
│   └── ScenarioPanel.tsx      # Failure scenario controls
├── App.tsx                    # Main React app
├── index.css                  # Global styles
├── package.json               # Dependencies & scripts
├── .env.local                 # Environment variables
├── vite.config.ts             # Vite configuration
└── README.md                  # This file
```

---

## 🔧 Available Scripts

### Frontend
```bash
npm run dev        # Start Vite dev server (http://localhost:3000)
npm run build      # Build for production
npm run preview    # Preview production build locally
```

### Backend
```bash
npm run backend    # Start Express server (http://localhost:5000)
npm run backend:dev # Start with nodemon (auto-reload on changes)
```

---

## 🎯 API Endpoints

### GET `/status`
Fetch current car state
```bash
curl http://localhost:5000/status
```

### POST `/status`
Update car state and save to JSON
```bash
curl -X POST http://localhost:5000/status \
  -H "Content-Type: application/json" \
  -d '{"isEngineOn": true, "lightsOn": false}'
```

### POST `/action`
Dispatch actions with payloads
```bash
curl -X POST http://localhost:5000/status \
  -H "Content-Type: application/json" \
  -d '{"type": "TOGGLE_ENGINE"}'
```

### GET `/health`
Health check endpoint
```bash
curl http://localhost:5000/health
```

---

## 📊 CarState JSON Schema

**File:** `backend/carState.json`

```json
{
  "view": "front",
  "isNight": false,
  "isEngineOn": false,
  "isEngineBroken": false,
  "isOilLeaking": false,
  "isBatteryDead": false,
  "isFuelEmpty": false,
  "isWiperBroken": false,
  "parkingLightsOn": false,
  "lightsOn": false,
  "highBeamOn": false,
  "fogLightsOn": false,
  "hazardLightsOn": false,
  "leftSignalOn": false,
  "rightSignalOn": false,
  "isRaining": false,
  "wipersActive": false,
  "wiperSpeed": "off",
  "isWashing": false,
  "interiorLightOn": false,
  "isHornActive": false,
  "isHoodOpen": false,
  "isTrunkOpen": false,
  "windowsDown": false,
  "doorsOpen": { "left": false, "right": false },
  "tires": { "fl": false, "fr": false, "rl": false, "rr": false }
}
```

### ⭐ Editing State Directly
You can edit `carState.json` directly and the frontend will automatically sync changes within 500ms!

---

## 🔄 How Synchronization Works

### Frontend Button Click Flow
```
User clicks button
    ↓
dispatch(action)
    ↓
syncToBackend(updates)
    ↓
POST /status
    ↓
Backend updates carState.json
    ↓
Frontend polls /status (500ms)
    ↓
UI updates automatically
```

### Direct JSON Edit Flow
```
Edit carState.json
    ↓
Frontend polls /status (500ms)
    ↓
Detects changes
    ↓
dispatch({ type: 'SET_FULL_STATE' })
    ↓
UI updates automatically
```

---

## 🎨 Technologies Used

- **Frontend:** React 19.2.3 + TypeScript
- **Styling:** Tailwind CSS
- **Build Tool:** Vite 6.2.0
- **Backend:** Express.js 4.18.2
- **Icons:** Lucide React 0.562.0
- **Server:** Node.js with CORS support
- **State Management:** React useReducer

---

## 📦 Dependencies

### Production
```json
{
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  "lucide-react": "^0.562.0",
  "express": "^4.18.2",
  "cors": "^2.8.5"
}
```

### Development
```json
{
  "@types/node": "^22.14.0",
  "@vitejs/plugin-react": "^5.0.0",
  "typescript": "~5.8.2",
  "vite": "^6.2.0",
  "nodemon": "^3.0.2"
}
```

---

## 🐛 Troubleshooting

### Backend not connecting
- Check if backend is running: `npm run backend`
- Verify port 5000 is not in use: `lsof -i :5000`
- Check CORS is enabled in `server.js`

### Frontend not starting
- Clear node_modules: `rm -rf node_modules && npm install`
- Check port 3000 is free: `lsof -i :3000`
- Verify `.env.local` exists with valid API key

### State not syncing
- Check Dev Console for sync errors
- Verify backend `/status` endpoint responds
- Ensure `carState.json` is readable/writable

### Kill stuck processes
```bash
# Kill process on port 5000
kill -9 $(lsof -t -i :5000)

# Kill process on port 3000
kill -9 $(lsof -t -i :3000)
```

---

## 🚀 Deployment

### Build for production
```bash
npm run build
```

Output is in `dist/` directory.

### Deploy to platforms
- **Vercel:** `vercel deploy`
- **Netlify:** `netlify deploy --prod --dir=dist`
- **GitHub Pages:** Configure Actions workflow

### Backend deployment (Node.js hosting)
- **Heroku:** Add `Procfile`
- **Railway:** Connect GitHub repo
- **Render:** Simple Node.js deployment

---

## 📝 Environment Variables

Create `.env.local` in root directory:

```env
# Gemini API Configuration
VITE_GEMINI_API_KEY=your_api_key_here

# Backend Configuration (optional overrides)
VITE_BACKEND_URL=http://localhost:5000/status
VITE_BACKEND_ENABLED=true
VITE_POLL_INTERVAL_MS=500
```

---

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🎓 Learning Resources

- **React Docs:** https://react.dev
- **TypeScript:** https://www.typescriptlang.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Vite:** https://vitejs.dev
- **Express.js:** https://expressjs.com

---

**Last Updated:** January 13, 2026
**Maintained by:** DriveSim Pro Team

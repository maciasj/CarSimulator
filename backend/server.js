import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const STATE_FILE = path.join(__dirname, 'carState.json');

// Middleware
app.use(cors());
app.use(express.json());

// Load initial state from JSON file
function loadState() {
  try {
    const data = fs.readFileSync(STATE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.warn('⚠️  Could not load state file, using defaults');
    return getDefaultState();
  }
}

function getDefaultState() {
  return {
    isEngineOn: false,
    isNight: false,
    lightsOn: false,
    isRaining: false,
    hazardLightsOn: false,
    wipersActive: false,
    leftSignalOn: false,
    rightSignalOn: false,
    parkingLightsOn: false,
    highBeamOn: false,
    fogLightsOn: false,
    isWashing: false,
    interiorLightOn: false,
    isHornActive: false,
    isHoodOpen: false,
    isTrunkOpen: false,
    windowsDown: false,
    isEngineBroken: false,
    isOilLeaking: false,
    isBatteryDead: false,
    isFuelEmpty: false,
    isWiperBroken: false,
    rpm: 0,
    temperature: 90,
    speed: 0,
  };
}

function saveState(state) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
    console.log('💾 State saved to carState.json');
  } catch (error) {
    console.error('❌ Failed to save state:', error);
  }
}

let carState = loadState();

// GET: Fetch current car state from JSON file
app.get('/status', (req, res) => {
  carState = loadState(); // Reload from file on each request
  res.json(carState);
});

// POST: Update car state and save to JSON
app.post('/status', (req, res) => {
  const updates = req.body;
  carState = { ...carState, ...updates };
  saveState(carState);
  res.json({ success: true, state: carState });
});

// POST: Dispatch an action
app.post('/action', (req, res) => {
  const { type, payload } = req.body;
  
  switch (type) {
    case 'TOGGLE_ENGINE':
      if (!carState.isBatteryDead && !carState.isFuelEmpty) {
        carState.isEngineOn = !carState.isEngineOn;
      }
      break;
    case 'TOGGLE_LIGHTS':
      if (!carState.isBatteryDead) {
        carState.lightsOn = !carState.lightsOn;
      }
      break;
    case 'TOGGLE_NIGHT':
      carState.isNight = !carState.isNight;
      break;
    case 'TOGGLE_RAIN':
      carState.isRaining = !carState.isRaining;
      break;
    case 'SET_FULL_STATE':
      carState = { ...carState, ...payload };
      break;
  }
  
  saveState(carState);
  res.json({ success: true, state: carState });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚗 DriveSim Pro Backend Running`);
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`✅ Status Endpoint: http://localhost:${PORT}/status`);
  console.log(`📝 Edit: ./backend/carState.json`);
  console.log(`\n`);
});
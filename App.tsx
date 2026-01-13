import React, { useReducer, useEffect, useState, useRef } from 'react';
import { 
  Sun, Moon, CloudRain, Activity, Wifi, Terminal, X, Code
} from 'lucide-react';
import { CarState, ControlAction } from './types';
import CarView from './components/CarView';
import ControlPanel from './components/ControlPanel';
import Dashboard from './components/Dashboard';
import Environment from './components/Environment';
import ScenarioPanel from './components/ScenarioPanel';
import DevConsole from './components/DevConsole';

/** 
 * BACKEND CONFIGURATION
 */
const BACKEND_CONFIG = {
  URL: "http://localhost:5000/status", 
  POLL_INTERVAL_MS: 500,               
  ENABLED: true                        
};

const initialState: CarState = {
  view: 'front',
  isNight: true,
  isEngineOn: false,
  isEngineBroken: false,
  isOilLeaking: false,
  isBatteryDead: false,
  isFuelEmpty: false,
  isWiperBroken: false,
  parkingLightsOn: false,
  lightsOn: false,
  highBeamOn: false,
  fogLightsOn: false,
  hazardLightsOn: false,
  leftSignalOn: false,
  rightSignalOn: false,
  isRaining: false,
  wipersActive: false,
  wiperSpeed: 'off',
  isWashing: false,
  interiorLightOn: false,
  isHornActive: false,
  isHoodOpen: false,
  isTrunkOpen: false,
  windowsDown: false,
  doorsOpen: { left: false, right: false },
  tires: { fl: false, fr: false, rl: false, rr: false }
};

function carReducer(state: CarState, action: ControlAction): CarState {
  switch (action.type) {
    case 'SET_FULL_STATE':
      return { ...state, ...action.payload };
    case 'RESET_ALL':
      return { ...initialState, view: state.view, isNight: state.isNight };
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    case 'TOGGLE_NIGHT':
      return { ...state, isNight: !state.isNight };
    case 'TOGGLE_ENGINE':
      if (state.isEngineBroken || state.isBatteryDead || state.isFuelEmpty) return state;
      const newEngineState = !state.isEngineOn;
      return { 
        ...state, 
        isEngineOn: newEngineState,
        ...(newEngineState ? {} : { leftSignalOn: false, rightSignalOn: false, hazardLightsOn: false })
      };
    case 'BREAK_ENGINE':
      return { ...state, isEngineBroken: true, isEngineOn: false };
    case 'REPAIR_ENGINE':
      return { ...state, isEngineBroken: false };
    case 'TOGGLE_OIL_LEAK':
      return { ...state, isOilLeaking: !state.isOilLeaking };
    case 'TOGGLE_BATTERY':
      const isDead = !state.isBatteryDead;
      return { 
        ...state, 
        isBatteryDead: isDead,
        ...(isDead ? { isEngineOn: false, lightsOn: false, parkingLightsOn: false, interiorLightOn: false } : {})
      };
    case 'TOGGLE_FUEL':
      const noFuel = !state.isFuelEmpty;
      return { 
        ...state, 
        isFuelEmpty: noFuel,
        ...(noFuel ? { isEngineOn: false } : {})
      };
    case 'TOGGLE_WIPER_BREAK':
      return { ...state, isWiperBroken: !state.isWiperBroken };
    case 'TOGGLE_PARKING_LIGHTS':
      if (state.isBatteryDead) return state;
      return { ...state, parkingLightsOn: !state.parkingLightsOn };
    case 'TOGGLE_LIGHTS':
      if (state.isBatteryDead) return state;
      const nextLights = !state.lightsOn;
      return { 
        ...state, 
        lightsOn: nextLights, 
        parkingLightsOn: nextLights ? true : state.parkingLightsOn,
        highBeamOn: nextLights ? state.highBeamOn : false 
      };
    case 'TOGGLE_HIGH_BEAM':
      if (state.isBatteryDead) return state;
      return { ...state, highBeamOn: !state.highBeamOn, lightsOn: true, parkingLightsOn: true };
    case 'TOGGLE_FOG_LIGHTS':
      if (state.isBatteryDead) return state;
      return { ...state, fogLightsOn: !state.fogLightsOn };
    case 'TOGGLE_HAZARDS':
      if (state.isBatteryDead) return state;
      return { ...state, hazardLightsOn: !state.hazardLightsOn, leftSignalOn: false, rightSignalOn: false };
    case 'TOGGLE_RAIN':
      return { ...state, isRaining: !state.isRaining };
    case 'SET_WIPERS':
      if (state.isWiperBroken) return state;
      return { ...state, wiperSpeed: action.payload, wipersActive: action.payload !== 'off' };
    case 'TOGGLE_WASHING':
      return { ...state, isWashing: action.payload };
    case 'TOGGLE_INTERIOR':
      if (state.isBatteryDead) return state;
      return { ...state, interiorLightOn: !state.interiorLightOn };
    case 'TOGGLE_SIGNAL':
      if (state.isBatteryDead) return state;
      if (action.payload === 'left') {
        return { ...state, leftSignalOn: !state.leftSignalOn, rightSignalOn: false, hazardLightsOn: false };
      } else {
        return { ...state, rightSignalOn: !state.rightSignalOn, leftSignalOn: false, hazardLightsOn: false };
      }
    case 'TOGGLE_HORN':
      if (state.isBatteryDead) return state;
      return { ...state, isHornActive: action.payload };
    case 'TOGGLE_HOOD':
      return { ...state, isHoodOpen: !state.isHoodOpen };
    case 'TOGGLE_TRUNK':
      return { ...state, isTrunkOpen: !state.isTrunkOpen };
    case 'TOGGLE_WINDOWS':
      if (state.isBatteryDead) return state;
      return { ...state, windowsDown: !state.windowsDown };
    case 'TOGGLE_DOOR':
      return { 
        ...state, 
        doorsOpen: { 
          ...state.doorsOpen, 
          [action.payload]: !state.doorsOpen[action.payload] 
        } 
      };
    case 'TOGGLE_TIRE':
      return { 
        ...state, 
        tires: { 
          ...state.tires, 
          [action.payload]: !state.tires[action.payload] 
        } 
      };
    default:
      return state;
  }
}

declare global {
  interface Window {
    driveSimAPI: {
      updateState: (partialState: Partial<CarState>) => void;
      dispatch: (action: ControlAction) => void;
      getState: () => CarState;
    };
  }
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(carReducer, initialState);
  const [syncError, setSyncError] = useState<boolean>(false);
  const [showDevTools, setShowDevTools] = useState<boolean>(false);
  const [logs, setLogs] = useState<{id: number, msg: string, time: string}[]>([]);
  const pollingInterval = useRef<number | null>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [{id: Date.now(), msg, time: new Date().toLocaleTimeString()}, ...prev].slice(0, 20));
  };

  // Backend sync function
  const syncToBackend = async (updates: Partial<CarState>) => {
    try {
      const response = await fetch('http://localhost:5000/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        addLog(`✅ Synced: ${Object.keys(updates).join(', ')}`);
      }
    } catch (error) {
      addLog(`❌ Sync failed: ${error}`);
    }
  };

  useEffect(() => {
    window.driveSimAPI = {
      updateState: (partial) => {
        dispatch({ type: 'SET_FULL_STATE', payload: partial });
        addLog(`LOCAL_BRIDGE: Partial update`);
      },
      dispatch: (action) => {
        dispatch(action);
        addLog(`LOCAL_BRIDGE: Action ${action.type}`);
      },
      getState: () => state,
    };
  }, [state]);

  useEffect(() => {
    if (!BACKEND_CONFIG.ENABLED || !BACKEND_CONFIG.URL) return;
    addLog(`NETWORK: Started polling ${BACKEND_CONFIG.URL}`);

    pollingInterval.current = window.setInterval(async () => {
      try {
        const res = await fetch(BACKEND_CONFIG.URL);
        if (res.ok) {
          const data = await res.json();
          // Solo sincroniza si los datos del backend son diferentes
          if (JSON.stringify(data) !== JSON.stringify(state)) {
            dispatch({ type: 'SET_FULL_STATE', payload: data });
            addLog(`REMOTE_SYNC: State updated from backend`);
          }
          setSyncError(false);
        } else {
          setSyncError(true);
        }
      } catch (e) {
        setSyncError(true);
      }
    }, BACKEND_CONFIG.POLL_INTERVAL_MS);

    return () => {
      if (pollingInterval.current) window.clearInterval(pollingInterval.current);
    };
  }, [state]);

  return (
    <div className={`min-h-screen w-full transition-colors duration-1000 flex flex-col relative overflow-hidden ${state.isNight ? 'bg-slate-950' : 'bg-sky-100'}`}>
      <Environment isNight={state.isNight} isRaining={state.isRaining} />
      
      <div className="relative z-10 flex flex-col flex-1 w-full p-4 md:p-8">
        <header className="w-full flex justify-between items-center mb-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 flex items-center gap-4">
            <div className={`p-2 rounded-xl transition-all ${syncError ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500 animate-pulse'}`}>
              <Wifi size={20} />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${state.isNight ? 'text-white' : 'text-slate-800'}`}>DriveSim <span className="text-blue-500">Pro</span></h1>
              <p className={`text-[10px] opacity-70 font-mono ${state.isNight ? 'text-white' : 'text-slate-800'}`}>
                {syncError ? 'BACKEND_OFFLINE' : 'BACKEND_ACTIVE'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setShowDevTools(!showDevTools)} 
              className={`p-3 rounded-full transition-all shadow-lg ${showDevTools ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              title="Toggle Dev Console"
            >
              <Terminal size={20} />
            </button>
            <div className="w-px h-8 bg-white/10 mx-2 self-center" />
            <button 
              onClick={() => {
                dispatch({ type: 'TOGGLE_NIGHT' });
                syncToBackend({ isNight: !state.isNight });
              }} 
              className={`p-3 rounded-full transition-all ${state.isNight ? 'bg-yellow-400 text-slate-900' : 'bg-slate-800 text-white'} shadow-lg`}
              title="Toggle Night Mode"
            >
              {state.isNight ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => {
                dispatch({ type: 'TOGGLE_RAIN' });
                syncToBackend({ isRaining: !state.isRaining });
              }} 
              className={`p-3 rounded-full transition-all ${state.isRaining ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-800'} shadow-lg`}
              title="Toggle Rain"
            >
              <CloudRain size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 w-full flex items-center justify-center relative">
          <CarView state={state} />
        </main>

        <footer className="w-full max-w-[100rem] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start mt-4">
          <div className="md:col-span-2">
            <Dashboard state={state} />
          </div>
          <div className="md:col-span-7">
            <ControlPanel state={state} dispatch={dispatch} />
          </div>
          <div className="md:col-span-3">
            <ScenarioPanel state={state} dispatch={dispatch} />
          </div>
        </footer>
      </div>

      {/* RAIN EFFECT */}
      {state.isRaining && <RainParticles />}

      {/* DEV CONSOLE DRAWER */}
      <DevConsole 
        isOpen={showDevTools} 
        onClose={() => setShowDevTools(false)} 
        logs={logs} 
        syncUrl={BACKEND_CONFIG.URL} 
        syncError={syncError}
      />
    </div>
  );
};

const RainParticles = () => (
  <div className="absolute inset-0 pointer-events-none opacity-30 z-20 overflow-hidden">
    {[...Array(50)].map((_, i) => (
      <div key={i} className="absolute bg-white/40 rounded-full" style={{ width: '1px', height: Math.random() * 20 + 10 + 'px', top: '-20px', left: Math.random() * 100 + '%', animation: `rainDrop ${Math.random() * 1 + 0.5}s linear infinite`, animationDelay: Math.random() * 2 + 's' }} />
    ))}
    <style>{`@keyframes rainDrop { 0% { transform: translateY(0vh); opacity: 0; } 10% { opacity: 1; } 100% { transform: translateY(100vh); opacity: 0; } }`}</style>
  </div>
);

export default App;

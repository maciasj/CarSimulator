import React from 'react';
import { 
  ShieldAlert, Wrench, XCircle, AlertTriangle, 
  Droplets, ZapOff, Fuel, Wind, RefreshCw, Cpu, Activity
} from 'lucide-react';
import { CarState, ControlAction } from '../types';

interface ScenarioPanelProps {
  state: CarState;
  dispatch: React.Dispatch<ControlAction>;
}

const ScenarioPanel: React.FC<ScenarioPanelProps> = ({ state, dispatch }) => {
  // Backend sync function
  const syncToBackend = async (updates: Partial<CarState>) => {
    try {
      const response = await fetch('http://localhost:5000/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        console.log('✅ Scenario synced:', updates);
      }
    } catch (error) {
      console.error('❌ Sync failed:', error);
    }
  };

  const handleDispatch = (action: ControlAction, stateUpdate?: Partial<CarState>) => {
    dispatch(action);
    if (stateUpdate) {
      syncToBackend(stateUpdate);
    }
  };

  const btnBase = "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-[8px] font-black uppercase tracking-widest active:scale-95";
  
  const getBtnClass = (active: boolean, color: 'red' | 'orange' | 'yellow') => {
    if (!active) return "bg-slate-900/40 text-slate-500 border-white/5 hover:border-white/20 hover:bg-slate-800/60";
    const colors = {
      red: "bg-red-600/90 text-white border-red-400/50 shadow-[0_10px_30px_rgba(220,38,38,0.2)]",
      orange: "bg-orange-600/90 text-white border-orange-400/50 shadow-[0_10px_30px_rgba(234,88,12,0.2)]",
      yellow: "bg-yellow-500/90 text-slate-900 border-yellow-300/50 shadow-[0_10px_30px_rgba(234,179,8,0.2)]"
    };
    return colors[color];
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] p-6 border border-white/10 shadow-2xl h-full flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <Activity className="text-red-500" size={18} />
          <h2 className="text-[11px] font-black text-slate-100 uppercase tracking-[0.25em]">Failure Scenarios</h2>
        </div>
        <button 
          onClick={() => {
            dispatch({ type: 'RESET_ALL' });
            syncToBackend({ 
              isEngineBroken: false, 
              isOilLeaking: false, 
              isBatteryDead: false, 
              isFuelEmpty: false, 
              isWiperBroken: false,
              tires: { fl: false, fr: false, rl: false, rr: false }
            });
          }} 
          className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 transition-all active:rotate-180 duration-500"
          title="Reset Simulator"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
        <button 
          onClick={() => handleDispatch(
            { type: state.isEngineBroken ? 'REPAIR_ENGINE' : 'BREAK_ENGINE' },
            { isEngineBroken: !state.isEngineBroken }
          )} 
          className={`${btnBase} ${getBtnClass(state.isEngineBroken, 'red')} col-span-2 py-4`}
        >
          <div className="relative">
            <Wrench size={20} className={state.isEngineBroken ? 'animate-bounce' : ''} />
            {state.isEngineBroken && <AlertTriangle size={10} className="absolute -top-1 -right-1 text-white animate-pulse" />}
          </div>
          <span className="mt-2">Engine Catastrophe</span>
        </button>

        <button 
          onClick={() => handleDispatch({ type: 'TOGGLE_OIL_LEAK' }, { isOilLeaking: !state.isOilLeaking })} 
          className={`${btnBase} ${getBtnClass(state.isOilLeaking, 'orange')}`}
        >
          <Droplets size={18} />
          <span className="mt-2 text-center">Oil<br/>Pressure</span>
        </button>

        <button 
          onClick={() => handleDispatch({ type: 'TOGGLE_BATTERY' }, { isBatteryDead: !state.isBatteryDead })} 
          className={`${btnBase} ${getBtnClass(state.isBatteryDead, 'red')}`}
        >
          <ZapOff size={18} />
          <span className="mt-2 text-center">Electrical<br/>Failure</span>
        </button>

        <button 
          onClick={() => handleDispatch({ type: 'TOGGLE_FUEL' }, { isFuelEmpty: !state.isFuelEmpty })} 
          className={`${btnBase} ${getBtnClass(state.isFuelEmpty, 'red')}`}
        >
          <Fuel size={18} />
          <span className="mt-2 text-center">Empty<br/>Tank</span>
        </button>

        <button 
          onClick={() => handleDispatch({ type: 'TOGGLE_WIPER_BREAK' }, { isWiperBroken: !state.isWiperBroken })} 
          className={`${btnBase} ${getBtnClass(state.isWiperBroken, 'yellow')}`}
        >
          <Wind size={18} />
          <span className="mt-2 text-center">Wiper<br/>Malfunc.</span>
        </button>

        {/* Tire Pressure Matrix */}
        <div className="col-span-2 mt-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-px flex-1 bg-white/5" />
            <span className="text-[7px] text-slate-500 font-black uppercase tracking-[0.3em] px-2">Tire Integrity</span>
            <span className="h-px flex-1 bg-white/5" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {(['fl', 'fr', 'rl', 'rr'] as const).map(t => (
              <button 
                key={t} 
                onClick={() => handleDispatch(
                  { type: 'TOGGLE_TIRE', payload: t },
                  { tires: { ...state.tires, [t]: !state.tires[t] } }
                )} 
                className={`p-2.5 rounded-xl border text-[8px] font-black flex flex-col items-center gap-1.5 transition-all ${
                  state.tires[t] ? 'bg-orange-500 text-white border-orange-300' : 'bg-black/30 text-slate-600 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="text-[10px]">{t.toUpperCase()}</div>
                <div className={`w-1 h-1 rounded-full ${state.tires[t] ? 'bg-white animate-ping' : 'bg-slate-800'}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Status */}
      <div className="mt-auto bg-black/40 rounded-2xl p-4 border border-white/5">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Sim Reliability</span>
          <span className="text-[10px] font-mono text-green-500">100%</span>
        </div>
        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full w-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        </div>
      </div>
    </div>
  );
};

export default ScenarioPanel;

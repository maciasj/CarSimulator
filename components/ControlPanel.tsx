import React, { useState } from 'react';
import { 
  Power, Lightbulb, ShieldAlert, 
  Wind, ArrowLeft, ArrowRight,
  Eye, Zap, Volume2, Package,
  Layout, Droplets, Maximize2, DoorOpen, ToggleLeft as ToggleIcon,
  Archive
} from 'lucide-react';
import { CarState, ControlAction } from '../types';

interface ControlPanelProps {
  state: CarState;
  dispatch: React.Dispatch<ControlAction>;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ state, dispatch }) => {
  const [activeTab, setActiveTab] = useState<'main' | 'lights' | 'body'>('main');

  // Backend sync function
  const syncToBackend = async (updates: Partial<CarState>) => {
    try {
      const response = await fetch('http://localhost:5000/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        console.log('✅ Synced to backend:', updates);
      }
    } catch (error) {
      console.error('❌ Backend sync failed:', error);
    }
  };

  const handleDispatch = (action: ControlAction, stateUpdate?: Partial<CarState>) => {
    dispatch(action);
    if (stateUpdate) {
      syncToBackend(stateUpdate);
    }
  };

  const btnBaseClass = "flex flex-col items-center justify-center p-3 rounded-xl transition-all active:scale-95 border select-none group min-h-[75px]";
  
  const getBtnColorClasses = (active: boolean, color: 'blue' | 'red' | 'yellow' | 'orange' | 'cyan' | 'amber' | 'slate') => {
    if (!active) return "bg-slate-800/60 text-slate-400 border-white/10 hover:bg-slate-700/80 backdrop-blur-sm shadow-sm";
    
    const colors = {
      blue: "bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.5)]",
      red: "bg-red-600 text-white border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.5)]",
      yellow: "bg-yellow-500 text-white border-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.5)]",
      orange: "bg-orange-600 text-white border-orange-400 shadow-[0_0_15px_rgba(234,88,12,0.5)]",
      cyan: "bg-cyan-500 text-white border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]",
      amber: "bg-amber-500 text-white border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]",
      slate: "bg-slate-600 text-white border-slate-400 shadow-[0_0_15px_rgba(71,85,105,0.5)]"
    };
    return colors[color];
  };

  const TabButton = ({ id, icon: Icon, label }: { id: 'main' | 'lights' | 'body', icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all border ${
        activeTab === id 
        ? 'bg-blue-600 text-white border-blue-400 shadow-md scale-105' 
        : 'bg-slate-800/40 text-slate-400 border-transparent hover:text-slate-200'
      }`}
    >
      <Icon size={16} />
      <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">{label}</span>
    </button>
  );

  return (
    <div className="bg-slate-900/90 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/15 shadow-2xl relative z-30">
      <div className="flex gap-4 mb-6 pb-4 border-b border-white/5 overflow-x-auto no-scrollbar scroll-smooth">
        <TabButton id="main" icon={Layout} label="Primary Controls" />
        <TabButton id="lights" icon={Lightbulb} label="Lighting Systems" />
        <TabButton id="body" icon={Maximize2} label="Body & Panels" />
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 min-h-[160px]">
        {activeTab === 'main' && (
          <>
            <button 
              disabled={state.isEngineBroken}
              onClick={() => handleDispatch({ type: 'TOGGLE_ENGINE' }, { isEngineOn: !state.isEngineOn })} 
              className={`${btnBaseClass} ${getBtnColorClasses(state.isEngineOn, 'red')} ${state.isEngineBroken ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
            >
              <Power className={state.isEngineOn ? "animate-pulse" : ""} size={24} />
              <span className="text-[9px] mt-2 font-bold uppercase">Engine</span>
            </button>
            <button 
              onMouseDown={() => handleDispatch({ type: 'TOGGLE_HORN', payload: true }, { isHornActive: true })}
              onMouseUp={() => handleDispatch({ type: 'TOGGLE_HORN', payload: false }, { isHornActive: false })}
              className={`${btnBaseClass} ${getBtnColorClasses(state.isHornActive, 'yellow')}`}
            >
              <Volume2 size={24} />
              <span className="text-[9px] mt-2 font-bold uppercase">Horn</span>
            </button>
            <button onClick={() => handleDispatch({ type: 'TOGGLE_SIGNAL', payload: 'left' }, { leftSignalOn: !state.leftSignalOn })} className={`${btnBaseClass} ${getBtnColorClasses(state.leftSignalOn, 'orange')}`}>
              <ArrowLeft size={24} />
              <span className="text-[9px] mt-2 font-bold uppercase">Signal L</span>
            </button>
            <button onClick={() => handleDispatch({ type: 'TOGGLE_SIGNAL', payload: 'right' }, { rightSignalOn: !state.rightSignalOn })} className={`${btnBaseClass} ${getBtnColorClasses(state.rightSignalOn, 'orange')}`}>
              <ArrowRight size={24} />
              <span className="text-[9px] mt-2 font-bold uppercase">Signal R</span>
            </button>
            <button onClick={() => handleDispatch({ type: 'TOGGLE_HAZARDS' }, { hazardLightsOn: !state.hazardLightsOn })} className={`${btnBaseClass} ${getBtnColorClasses(state.hazardLightsOn, 'orange')}`}>
              <ShieldAlert className={state.hazardLightsOn ? "animate-bounce" : ""} size={24} />
              <span className="text-[9px] mt-2 font-bold uppercase">Hazards</span>
            </button>
            <button onClick={() => {
              const nextSpeed = state.wiperSpeed === 'off' ? 'low' : state.wiperSpeed === 'low' ? 'high' : 'off';
              handleDispatch({ type: 'SET_WIPERS', payload: nextSpeed }, { wiperSpeed: nextSpeed, wipersActive: nextSpeed !== 'off' });
            }} className={`${btnBaseClass} ${getBtnColorClasses(state.wipersActive, 'cyan')}`}>
              <Wind size={24} />
              <span className="text-[9px] mt-2 font-bold uppercase">Wipers</span>
            </button>
          </>
        )}

        {activeTab === 'lights' && (
          <>
            <button onClick={() => handleDispatch({ type: 'TOGGLE_PARKING_LIGHTS' }, { parkingLightsOn: !state.parkingLightsOn })} className={`${btnBaseClass} ${getBtnColorClasses(state.parkingLightsOn, 'amber')}`}>
              <ToggleIcon size={24} />
              <span className="text-[9px] mt-2 font-bold uppercase">Parking</span>
            </button>
            <button onClick={() => handleDispatch({ type: 'TOGGLE_LIGHTS' }, { lightsOn: !state.lightsOn })} className={`${btnBaseClass} ${getBtnColorClasses(state.lightsOn, 'yellow')}`}>
              <Lightbulb size={24} />
              <span className="text-[9px] mt-2 font-bold uppercase">Low Beam</span>
            </button>
            <button onClick={() => handleDispatch({ type: 'TOGGLE_HIGH_BEAM' }, { highBeamOn: !state.highBeamOn })} className={`${btnBaseClass} ${getBtnColorClasses(state.highBeamOn, 'blue')}`}>
              <Zap size={24} />
              <span className="text-[9px] mt-2 font-bold uppercase">High Beam</span>
            </button>
            <button onClick={() => handleDispatch({ type: 'TOGGLE_FOG_LIGHTS' }, { fogLightsOn: !state.fogLightsOn })} className={`${btnBaseClass} ${getBtnColorClasses(state.fogLightsOn, 'amber')}`}>
              <ToggleIcon className="rotate-45" size={24} />
              <span className="text-[9px] mt-2 font-bold uppercase">Fog Lamps</span>
            </button>
            <button onClick={() => handleDispatch({ type: 'TOGGLE_INTERIOR' }, { interiorLightOn: !state.interiorLightOn })} className={`${btnBaseClass} ${getBtnColorClasses(state.interiorLightOn, 'slate')}`}>
              <Eye size={24} />
              <span className="text-[9px] mt-2 font-bold uppercase">Interior</span>
            </button>
          </>
        )}

        {activeTab === 'body' && (
          <>
            <button onClick={() => handleDispatch({ type: 'TOGGLE_HOOD' }, { isHoodOpen: !state.isHoodOpen })} className={`${btnBaseClass} ${getBtnColorClasses(state.isHoodOpen, 'slate')}`}>
              <Package size={24} />
              <span className="text-[9px] mt-2 font-bold uppercase">Hood</span>
            </button>
            <button onClick={() => handleDispatch({ type: 'TOGGLE_TRUNK' }, { isTrunkOpen: !state.isTrunkOpen })} className={`${btnBaseClass} ${getBtnColorClasses(state.isTrunkOpen, 'slate')}`}>
              <Archive size={24} />
              <span className="text-[9px] mt-2 font-bold uppercase">Trunk</span>
            </button>
            <button onClick={() => handleDispatch({ type: 'TOGGLE_WINDOWS' }, { windowsDown: !state.windowsDown })} className={`${btnBaseClass} ${getBtnColorClasses(state.windowsDown, 'cyan')}`}>
              <ArrowLeft className="-rotate-90" size={24} />
              <span className="text-[9px] mt-2 font-bold uppercase">Windows</span>
            </button>
            <button onClick={() => handleDispatch({ type: 'TOGGLE_DOOR', payload: 'left' }, { doorsOpen: { ...state.doorsOpen, left: !state.doorsOpen.left } })} className={`${btnBaseClass} ${getBtnColorClasses(state.doorsOpen.left, 'slate')}`}>
              <DoorOpen size={24} />
              <span className="text-[9px] mt-2 font-bold uppercase">Door L</span>
            </button>
            <button onClick={() => handleDispatch({ type: 'TOGGLE_DOOR', payload: 'right' }, { doorsOpen: { ...state.doorsOpen, right: !state.doorsOpen.right } })} className={`${btnBaseClass} ${getBtnColorClasses(state.doorsOpen.right, 'slate')}`}>
              <DoorOpen size={24} className="scale-x-[-1]" />
              <span className="text-[9px] mt-2 font-bold uppercase">Door R</span>
            </button>
            <button 
              onMouseDown={() => handleDispatch({ type: 'TOGGLE_WASHING', payload: true }, { isWashing: true })}
              onMouseUp={() => handleDispatch({ type: 'TOGGLE_WASHING', payload: false }, { isWashing: false })}
              className={`${btnBaseClass} ${getBtnColorClasses(state.isWashing, 'blue')}`}
            >
              <Droplets size={24} />
              <span className="text-[9px] mt-2 font-bold uppercase">Wash</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;

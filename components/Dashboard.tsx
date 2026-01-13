
import React from 'react';
import { CarState } from '../types';
import { AlertCircle, Droplets, ZapOff, Fuel } from 'lucide-react';

interface DashboardProps {
  state: CarState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const isPowered = !state.isBatteryDead;

  return (
    <div className={`bg-slate-900/95 backdrop-blur-md rounded-[2rem] p-5 border border-white/20 shadow-xl relative z-30 overflow-hidden transition-all duration-700 ${!isPowered ? 'brightness-50 grayscale' : ''}`}>
      {!isPowered && <div className="absolute inset-0 bg-black/40 z-10 animate-pulse" />}
      
      <div className="grid grid-cols-1 gap-4">
        {/* Speedometer Mockup */}
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28 flex items-center justify-center">
             <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#0f172a" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke={isPowered ? "#3b82f6" : "#1e293b"} strokeWidth="8" 
                  strokeDasharray="282" 
                  strokeDashoffset={state.isEngineOn && isPowered ? "140" : "282"}
                  className="transition-all duration-1000"
                />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-bold font-mono leading-none transition-colors ${isPowered ? 'text-white' : 'text-slate-700'}`}>
                  {state.isEngineOn && isPowered ? '2.1' : '0'}
                </span>
                <span className="text-[7px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">RPM x1000</span>
             </div>
          </div>
        </div>

        {/* Warning Cluster */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          {state.isEngineBroken && (
            <div className="flex flex-col items-center p-2 bg-black/40 rounded-lg animate-pulse">
               <AlertCircle className="text-orange-500" size={14} />
               <span className="text-[6px] text-orange-500 font-black uppercase mt-1">Check Eng</span>
            </div>
          )}
          {state.isOilLeaking && (
            <div className="flex flex-col items-center p-2 bg-black/40 rounded-lg animate-pulse">
               <Droplets className="text-red-500" size={14} />
               <span className="text-[6px] text-red-500 font-black uppercase mt-1">Low Oil</span>
            </div>
          )}
          {state.isBatteryDead && (
            <div className="flex flex-col items-center p-2 bg-black/40 rounded-lg">
               <ZapOff className="text-red-500" size={14} />
               <span className="text-[6px] text-red-500 font-black uppercase mt-1">No Power</span>
            </div>
          )}
          {state.isFuelEmpty && (
            <div className="flex flex-col items-center p-2 bg-black/40 rounded-lg animate-pulse">
               <Fuel className="text-yellow-500" size={14} />
               <span className="text-[6px] text-yellow-500 font-black uppercase mt-1">Fuel Low</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Bars */}
      <div className="mt-6 space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between text-[7px] text-slate-500 font-bold uppercase">
            <span>Fuel Tank</span>
            <span className={`font-mono transition-colors ${isPowered && !state.isFuelEmpty ? 'text-blue-400' : 'text-red-500'}`}>
              {state.isFuelEmpty ? '0%' : '78%'}
            </span>
          </div>
          <div className="h-1 bg-black/40 rounded-full overflow-hidden">
            <div className={`h-full bg-blue-500 transition-all duration-1000 ${state.isFuelEmpty ? 'w-0' : 'w-[78%]'}`} />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[7px] text-slate-500 font-bold uppercase">
            <span>Core Temp</span>
            <span className={`font-mono transition-colors ${isPowered && state.isEngineOn ? 'text-orange-400' : 'text-slate-500'}`}>
              {state.isEngineOn && isPowered ? '94°C' : '22°C'}
            </span>
          </div>
          <div className="h-1 bg-black/40 rounded-full overflow-hidden">
            <div className={`h-full bg-orange-500 transition-all duration-1000 ${state.isEngineOn && isPowered ? 'w-[55%]' : 'w-[10%]'}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


import React from 'react';
import { Gauge, Thermometer, Zap, AlertCircle, Droplets, ZapOff, Fuel } from 'lucide-react';
import { CarState } from '../types';

interface DashboardProps {
  state: CarState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const isPowered = !state.isBatteryDead;

  // Calcular porcentaje para las barras
  const rpmPercent = (state.rpm / 8000) * 100;
  const tempPercent = ((state.temperature - 50) / 120) * 100;
  const speedPercent = (state.speed / 200) * 100;

  // Determinar colores según valores
  const getTempColor = () => {
    if (state.temperature < 80) return 'text-blue-400';
    if (state.temperature < 100) return 'text-green-400';
    if (state.temperature < 120) return 'text-yellow-400';
    return 'text-red-500';
  };

  const getRpmColor = () => {
    if (state.rpm < 2000) return 'text-green-400';
    if (state.rpm < 5000) return 'text-yellow-400';
    if (state.rpm < 7000) return 'text-orange-400';
    return 'text-red-500';
  };

  const getSpeedColor = () => {
    if (state.speed < 50) return 'text-green-400';
    if (state.speed < 100) return 'text-blue-400';
    if (state.speed < 150) return 'text-yellow-400';
    return 'text-red-500';
  };

  return (
    <div className={`bg-slate-900/95 backdrop-blur-md rounded-[2rem] p-6 border border-white/20 shadow-xl relative z-30 overflow-hidden transition-all duration-700 ${!isPowered ? 'brightness-50 grayscale' : ''}`}>
      {!isPowered && <div className="absolute inset-0 bg-black/40 z-10 animate-pulse" />}
      
      <h2 className="text-sm font-black text-slate-200 uppercase tracking-widest mb-6">
        📊 Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* RPM GAUGE */}
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28 mb-4">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={state.rpm > 7000 ? '#ef4444' : state.rpm > 5000 ? '#f97316' : '#22c55e'}
                strokeWidth="8"
                strokeDasharray={`${(rpmPercent / 100) * 283} 283`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-1 h-10 bg-white rounded-full origin-bottom"
                style={{
                  transform: `rotate(${(state.rpm / 8000) * 270 - 135}deg)`,
                  transition: 'transform 0.3s ease-out'
                }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
          <div className="text-center">
            <Gauge size={16} className="mx-auto mb-1 text-blue-400" />
            <div className={`text-lg font-black ${getRpmColor()}`}>
              {state.rpm}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">RPM</div>
          </div>
        </div>

        {/* TEMPERATURA */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <Thermometer size={24} className={getTempColor()} />
          <div className="h-24 w-6 bg-slate-800/50 rounded-full border border-white/10 overflow-hidden">
            <div
              className={`w-full transition-all duration-300 ${
                state.temperature < 100
                  ? 'bg-gradient-to-b from-blue-400 to-green-400'
                  : state.temperature < 120
                  ? 'bg-gradient-to-b from-yellow-400 to-orange-400'
                  : 'bg-gradient-to-b from-orange-400 to-red-500'
              }`}
              style={{ height: `${Math.min(tempPercent, 100)}%` }}
            />
          </div>
          <div className="text-center">
            <div className={`text-lg font-black ${getTempColor()}`}>
              {state.temperature}°C
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Temp</div>
          </div>
        </div>

        {/* VELOCIDAD */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <Zap size={24} className={getSpeedColor()} />
          <div className="w-full h-6 bg-slate-800/50 rounded-full border border-white/10 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                state.speed < 100
                  ? 'bg-gradient-to-r from-green-400 to-blue-400'
                  : state.speed < 150
                  ? 'bg-gradient-to-r from-blue-400 to-yellow-400'
                  : 'bg-gradient-to-r from-yellow-400 to-red-500'
              }`}
              style={{ width: `${Math.min(speedPercent, 100)}%` }}
            />
          </div>
          <div className="text-center">
            <div className={`text-lg font-black ${getSpeedColor()}`}>
              {state.speed} km/h
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Speed</div>
          </div>
        </div>
      </div>

      {/* Warning Cluster */}
      <div className="grid grid-cols-2 gap-2 mb-4">
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

      {/* Indicadores de Estado */}
      <div className="pt-4 border-t border-white/5 grid grid-cols-4 gap-2">
        <div className={`text-center p-2 rounded-lg text-[10px] ${state.isEngineOn ? 'bg-green-500/20 border border-green-500/50' : 'bg-slate-800/50 border border-white/10'}`}>
          <div className="font-black text-slate-300">Motor</div>
          <div className={state.isEngineOn ? 'text-green-400 font-black' : 'text-slate-500'}>
            {state.isEngineOn ? 'ON' : 'OFF'}
          </div>
        </div>

        <div className={`text-center p-2 rounded-lg text-[10px] ${state.temperature > 120 ? 'bg-red-500/20 border border-red-500/50' : 'bg-slate-800/50 border border-white/10'}`}>
          <div className="font-black text-slate-300">Temp</div>
          <div className={state.temperature > 120 ? 'text-red-400 font-black' : 'text-slate-400 font-black'}>
            {state.temperature > 120 ? '⚠️' : '✓'}
          </div>
        </div>

        <div className={`text-center p-2 rounded-lg text-[10px] ${state.isOilLeaking ? 'bg-red-500/20 border border-red-500/50' : 'bg-slate-800/50 border border-white/10'}`}>
          <div className="font-black text-slate-300">Oil</div>
          <div className={state.isOilLeaking ? 'text-red-400 font-black' : 'text-slate-400 font-black'}>
            {state.isOilLeaking ? '❌' : '✓'}
          </div>
        </div>

        <div className={`text-center p-2 rounded-lg text-[10px] ${state.isBatteryDead ? 'bg-red-500/20 border border-red-500/50' : 'bg-slate-800/50 border border-white/10'}`}>
          <div className="font-black text-slate-300">Batt</div>
          <div className={state.isBatteryDead ? 'text-red-400 font-black' : 'text-slate-400 font-black'}>
            {state.isBatteryDead ? '❌' : '✓'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

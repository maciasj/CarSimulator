
import React from 'react';

interface EnvironmentProps {
  isNight: boolean;
  isRaining: boolean;
}

const Environment: React.FC<EnvironmentProps> = ({ isNight, isRaining }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Sky / Atmosphere */}
      <div className={`absolute inset-0 transition-all duration-1000 ${
        isNight ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950' : 
        isRaining ? 'bg-gradient-to-b from-slate-400 to-slate-300' : 
        'bg-gradient-to-b from-sky-300 to-sky-100'
      }`} />

      {/* Distant Mountains / Horizon */}
      <div className={`absolute bottom-[20%] w-full h-40 opacity-20 transition-all duration-1000 ${isNight ? 'brightness-50' : ''}`}>
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0 100 L0 80 Q150 40 300 80 Q450 100 600 60 Q750 20 1000 80 L1000 100 Z" fill="currentColor" className={isNight ? 'text-slate-800' : 'text-slate-400'} />
        </svg>
      </div>

      {/* Road / Ground */}
      <div className={`absolute bottom-0 w-full h-[30%] transition-colors duration-1000 ${
        isNight ? 'bg-slate-900' : 
        isRaining ? 'bg-slate-600' : 
        'bg-slate-400'
      }`}>
        {/* Road Surface Texture */}
        <div className="w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '10px 10px' }} />
        
        {/* Wet Reflection Effect */}
        {isRaining && (
          <div className="absolute inset-0 bg-blue-400/10 animate-pulse" />
        )}
        
        {/* Road Markings */}
        <div className="absolute top-0 left-0 w-full h-2 bg-black/10" />
        <div className="absolute bottom-10 left-0 w-full flex justify-center gap-16 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`w-20 h-2 bg-white/20 transition-opacity ${isNight ? 'opacity-10' : 'opacity-40'}`} />
          ))}
        </div>
      </div>

      {/* Vignette for Focus */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.5)] pointer-events-none" />
    </div>
  );
};

export default Environment;

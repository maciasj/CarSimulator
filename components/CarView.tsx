
import React from 'react';
import { CarState } from '../types';

interface CarViewProps {
  state: CarState;
}

const CarView: React.FC<CarViewProps> = ({ state }) => {
  const { view } = state;

  return (
    <div className="relative w-full max-w-4xl aspect-[16/9] flex items-center justify-center overflow-visible">
      <div className="w-full h-full relative">
        {view === 'front' && <FrontView state={state} />}
        {view === 'side' && <SideView state={state} />}
        {view === 'rear' && <RearView state={state} />}
      </div>
    </div>
  );
};

// --- FRONT VIEW COMPONENT ---
const FrontView: React.FC<{state: CarState}> = ({ state }) => {
  const { 
    lightsOn, parkingLightsOn, highBeamOn, hazardLightsOn, 
    leftSignalOn, rightSignalOn, isNight, wipersActive, wiperSpeed, 
    isWashing, interiorLightOn, isHornActive, isHoodOpen, windowsDown, tires, 
    isEngineOn, isEngineBroken, doorsOpen, isOilLeaking, isWiperBroken, isBatteryDead 
  } = state;

  let tiltAngle = 0;
  if (tires.fl && !tires.fr) tiltAngle = -3;
  if (tires.fr && !tires.fl) tiltAngle = 3;

  const showLights = !isBatteryDead;

  return (
    <svg viewBox="0 0 800 450" className={`w-full h-full transition-transform duration-500 ease-in-out ${isEngineOn || isHornActive ? 'vibrating' : ''}`} style={{ transform: `rotate(${tiltAngle}deg) translateY(${tires.fl || tires.fr ? 10 : 0}px)` }}>
        <defs>
          <filter id="glow"><feGaussianBlur stdDeviation="10" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
          <linearGradient id="bodyGradFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isNight ? '#1e293b' : '#f8fafc'} />
            <stop offset="100%" stopColor={isNight ? '#020617' : '#94a3b8'} />
          </linearGradient>
          <clipPath id="windshieldClipFront"><path d="M220 230 L580 230 L550 160 L250 160 Z" /></clipPath>
        </defs>

        {/* Oil Leak Puddle */}
        {isOilLeaking && (
          <ellipse cx="400" cy="380" rx="200" ry="30" fill="#000" fillOpacity="0.7" className="animate-pulse" />
        )}

        {/* Smoke Effect (Broken Engine) */}
        {isEngineBroken && (
          <g className="smoke-hood">
            <circle cx="400" cy="200" r="10" fill="#64748b" opacity="0.6" className="animate-smoke-hood" style={{ animationDelay: '0s' }} />
            <circle cx="380" cy="190" r="15" fill="#64748b" opacity="0.4" className="animate-smoke-hood" style={{ animationDelay: '0.5s' }} />
            <circle cx="420" cy="195" r="12" fill="#64748b" opacity="0.5" className="animate-smoke-hood" style={{ animationDelay: '1s' }} />
          </g>
        )}

        {/* Chassis Front */}
        <path d="M150 350 L650 350 L670 300 L680 200 C680 160, 600 130, 400 130 C200 130, 120 160, 120 200 L130 300 Z" fill="url(#bodyGradFront)" className="transition-all duration-700" />
        
        {/* Doors */}
        <path 
          d="M120 200 L150 200 L150 340 L120 340 Z" 
          fill={isNight ? "#0f172a" : "#cbd5e1"} 
          className="transition-transform duration-500" 
          style={{ transform: doorsOpen.left ? 'translateX(-40px) skewY(-10deg) scaleX(0.7)' : 'none' }}
        />
        <path 
          d="M680 200 L650 200 L650 340 L680 340 Z" 
          fill={isNight ? "#0f172a" : "#cbd5e1"} 
          className="transition-transform duration-500" 
          style={{ transform: doorsOpen.right ? 'translateX(40px) skewY(10deg) scaleX(0.7)' : 'none' }}
        />

        {/* Hood */}
        <path d="M250 220 L550 220 L540 160 L260 160 Z" fill={isNight ? "#0f172a" : "#cbd5e1"} className="transition-transform duration-500 origin-bottom border-t border-white/10" style={{ transform: isHoodOpen ? 'translateY(-60px) scaleY(0.6) skewX(2deg)' : 'translateY(0)' }} />
        
        {/* Windshield */}
        <path d="M220 230 L580 230 L550 160 L250 160 Z" fill={isNight ? "#020617" : "#64748b"} />
        <rect x="220" y="160" width="360" height="70" fill="white" fillOpacity={windowsDown ? "0" : (interiorLightOn && showLights) ? "0.2" : "0.05"} clipPath="url(#windshieldClipFront)" className="transition-all duration-500" />
        
        {(interiorLightOn && showLights) && <rect x="250" y="150" width="300" height="50" fill="white" fillOpacity="0.2" filter="url(#glow)" />}
        
        {/* Lights */}
        <circle cx="175" cy="280" r="4" fill={(parkingLightsOn && showLights) ? "#ffb703" : "#1e293b"} />
        <circle cx="625" cy="280" r="4" fill={(parkingLightsOn && showLights) ? "#ffb703" : "#1e293b"} />
        <rect x="150" y="260" width="100" height="40" rx="10" fill="#334155" />
        <rect x="550" y="260" width="100" height="40" rx="10" fill="#334155" />
        <circle cx="210" cy="280" r="14" fill={(lightsOn && showLights) ? "#fff" : "#475569"} />
        <circle cx="590" cy="280" r="14" fill={(lightsOn && showLights) ? "#fff" : "#475569"} />
        
        <circle cx="160" cy="280" r="7" fill="#fbbf24" className={(hazardLightsOn || leftSignalOn) && showLights ? 'animate-pulse' : 'opacity-10'} />
        <circle cx="640" cy="280" r="7" fill="#fbbf24" className={(hazardLightsOn || rightSignalOn) && showLights ? 'animate-pulse' : 'opacity-10'} />
        
        {/* Tires */}
        <rect x="170" y={tires.fl ? 355 : 340} width="80" height={tires.fl ? 25 : 40} rx="10" fill="#020617" />
        <rect x="550" y={tires.fr ? 355 : 340} width="80" height={tires.fr ? 25 : 40} rx="10" fill="#020617" />
        
        <Wiper baseX={280} baseY={230} active={wipersActive && !isWiperBroken} speed={wiperSpeed} jammed={isWiperBroken} />
        <Wiper baseX={480} baseY={230} active={wipersActive && !isWiperBroken} speed={wiperSpeed} jammed={isWiperBroken} />

        <style>{`
          .animate-smoke-hood { animation: smokeHoodMove 2s infinite ease-out; }
          @keyframes smokeHoodMove {
            0% { transform: translateY(0) scale(1); opacity: 0; }
            50% { opacity: 0.6; }
            100% { transform: translateY(-100px) scale(4); opacity: 0; }
          }
        `}</style>
    </svg>
  );
}

// --- SIDE VIEW COMPONENT ---
const SideView: React.FC<{state: CarState}> = ({ state }) => {
  const { isNight, tires, lightsOn, hazardLightsOn, leftSignalOn, rightSignalOn, isEngineOn, isEngineBroken, doorsOpen, windowsDown, interiorLightOn, isHoodOpen, isTrunkOpen, isOilLeaking, isBatteryDead } = state;
  const showLights = !isBatteryDead;

  return (
    <svg viewBox="0 0 800 450" className={`w-full h-full ${isEngineOn ? 'vibrating' : ''}`}>
       <defs>
          <linearGradient id="bodyGradSide" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isNight ? '#0f172a' : '#94a3b8'} />
            <stop offset="50%" stopColor={isNight ? '#1e293b' : '#f8fafc'} />
            <stop offset="100%" stopColor={isNight ? '#020617' : '#94a3b8'} />
          </linearGradient>
       </defs>

        {/* Oil Leak Puddle */}
        {isOilLeaking && (
          <ellipse cx="400" cy="385" rx="300" ry="25" fill="#000" fillOpacity="0.7" className="animate-pulse" />
        )}

       {/* Smoke for broken engine */}
       {isEngineBroken && (
         <g transform="translate(650, 200)">
            <circle r="10" fill="#64748b" className="animate-smoke-hood" />
         </g>
       )}

       {/* Car Profile */}
       <path d="M100 350 L700 350 L710 320 L730 250 L700 200 C650 150, 500 130, 400 130 C250 130, 150 150, 100 200 Z" fill="url(#bodyGradSide)" />
       
       {/* Doors Visualization */}
       <g className="transition-transform duration-500">
          <path 
            d="M400 130 L550 145 L530 350 L400 350 Z" 
            fill={isNight ? "#1e293b" : "#cbd5e1"} 
            className="transition-all duration-500 border-l border-white/5"
            style={{ 
              transform: doorsOpen.right ? 'skewY(5deg) translateX(10px) scaleX(1.1)' : 'none',
              fillOpacity: doorsOpen.right ? 0.8 : 1
            }}
          />
          <path 
            d="M250 145 L400 130 L400 350 L270 350 Z" 
            fill={isNight ? "#1e293b" : "#cbd5e1"} 
            className="transition-all duration-500 border-r border-white/5"
            style={{ 
              transform: doorsOpen.left ? 'skewY(-5deg) translateX(-10px) scaleX(1.1)' : 'none',
              fillOpacity: doorsOpen.left ? 0.8 : 1
            }}
          />
       </g>

       {/* Hood and Trunk popping from side */}
       <path d="M600 210 L710 230" stroke="#334155" strokeWidth="3" className="transition-transform duration-500" style={{ transform: isHoodOpen ? 'translateY(-20px) rotate(-5deg)' : 'none' }} />
       <path d="M100 210 L200 230" stroke="#334155" strokeWidth="3" className="transition-transform duration-500" style={{ transform: isTrunkOpen ? 'translateY(-20px) rotate(5deg)' : 'none' }} />

       {/* Windows Side */}
       <path d="M220 150 L580 150 L560 230 L240 230 Z" fill="#020617" />
       <path 
        d="M220 150 L580 150 L560 230 L240 230 Z" 
        fill="white" 
        fillOpacity={(interiorLightOn && showLights) ? "0.2" : "0.08"} 
        className="transition-all duration-700 ease-in-out"
        style={{ transform: windowsDown ? 'translateY(80px)' : 'translateY(0)', opacity: windowsDown ? 0 : 1 }}
       />
       
       {/* Headlight Side Indicator */}
       <rect x="680" y="240" width="30" height="15" fill={(lightsOn && showLights) ? "#fff" : "#334155"} rx="4" />
       <circle cx="210" cy="245" r="5" fill="#fbbf24" className={(hazardLightsOn || leftSignalOn || rightSignalOn) && showLights ? 'animate-pulse' : 'opacity-10'} />

       {/* Wheels */}
       <g style={{ transform: tires.fl ? 'translateY(12px)' : '' }} className="transition-transform duration-500">
         <circle cx="230" cy="350" r={tires.fl ? 35 : 45} fill="#020617" />
         <circle cx="230" cy="350" r="28" fill="#1e293b" />
         <circle cx="230" cy="350" r="22" fill="#334155" />
       </g>
       <g style={{ transform: tires.rl ? 'translateY(12px)' : '' }} className="transition-transform duration-500">
         <circle cx="570" cy="350" r={tires.rl ? 35 : 45} fill="#020617" />
         <circle cx="570" cy="350" r="28" fill="#1e293b" />
         <circle cx="570" cy="350" r="22" fill="#334155" />
       </g>
    </svg>
  );
}

// --- REAR VIEW COMPONENT ---
const RearView: React.FC<{state: CarState}> = ({ state }) => {
  const { isNight, lightsOn, hazardLightsOn, leftSignalOn, rightSignalOn, isEngineOn, tires, isTrunkOpen, doorsOpen, isOilLeaking, isBatteryDead } = state;
  const showLights = !isBatteryDead;

  return (
    <svg viewBox="0 0 800 450" className={`w-full h-full ${isEngineOn ? 'vibrating' : ''}`}>
        <defs>
          <linearGradient id="bodyGradRear" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isNight ? '#1e293b' : '#f8fafc'} />
            <stop offset="100%" stopColor={isNight ? '#020617' : '#94a3b8'} />
          </linearGradient>
        </defs>

        {/* Oil Leak Puddle */}
        {isOilLeaking && (
          <ellipse cx="400" cy="380" rx="200" ry="30" fill="#000" fillOpacity="0.7" className="animate-pulse" />
        )}
        
        {/* Rear Body */}
        <path d="M150 350 L650 350 L660 300 L680 200 C680 160, 600 140, 400 140 C200 140, 120 160, 120 200 L140 300 Z" fill="url(#bodyGradRear)" />
        
        {/* Doors */}
        <path 
          d="M120 200 L100 200 L100 340 L120 340 Z" 
          fill={isNight ? "#020617" : "#64748b"} 
          className="transition-transform duration-500" 
          style={{ transform: doorsOpen.left ? 'translateX(-30px) scaleX(0.5)' : 'none', opacity: doorsOpen.left ? 1 : 0 }}
        />
        <path 
          d="M680 200 L700 200 L700 340 L680 340 Z" 
          fill={isNight ? "#020617" : "#64748b"} 
          className="transition-transform duration-500" 
          style={{ transform: doorsOpen.right ? 'translateX(30px) scaleX(0.5)' : 'none', opacity: doorsOpen.right ? 1 : 0 }}
        />

        {/* Trunk Area */}
        <g className="transition-transform duration-500 origin-top" style={{ transform: isTrunkOpen ? 'translateY(-80px) rotateX(45deg)' : 'none' }}>
           <path d="M220 250 L580 250 L570 170 L230 170 Z" fill={isNight ? "#0f172a" : "#cbd5e1"} className="border-b border-white/10" />
           {isTrunkOpen && <rect x="230" y="170" width="340" height="80" fill="#000" fillOpacity="0.4" />}
        </g>
        
        {/* Tail Lights */}
        <rect x="150" y="220" width="100" height="30" rx="6" fill="#1e293b" />
        <rect x="550" y="220" width="100" height="30" rx="6" fill="#1e293b" />
        <rect x="160" y="225" width="80" height="20" rx="4" fill={(lightsOn && showLights) ? "#ef4444" : "#450a0a"} className="transition-colors duration-300 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
        <rect x="560" y="225" width="80" height="20" rx="4" fill={(lightsOn && showLights) ? "#ef4444" : "#450a0a"} className="transition-colors duration-300 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
        
        {(lightsOn && showLights) && <rect x="350" y="160" width="100" height="8" fill="#ef4444" opacity="0.8" rx="2" className="animate-pulse" />}

        {/* Signals */}
        <circle cx="165" cy="235" r="5" fill="#fbbf24" className={(hazardLightsOn || leftSignalOn) && showLights ? 'animate-pulse' : 'opacity-10'} />
        <circle cx="635" cy="235" r="5" fill="#fbbf24" className={(hazardLightsOn || rightSignalOn) && showLights ? 'animate-pulse' : 'opacity-10'} />

        {/* Exhaust */}
        <circle cx="180" cy="350" r="10" fill="#1e293b" />
        {isEngineOn && (
          <g className="smoke-particles">
            <circle cx="180" cy="350" r="4" fill="#94a3b8" opacity="0.5" className="animate-smoke" />
          </g>
        )}

        {/* Tires */}
        <rect x="170" y={tires.rl ? 355 : 340} width="80" height={tires.rl ? 25 : 40} rx="10" fill="#020617" />
        <rect x="550" y={tires.rr ? 355 : 340} width="80" height={tires.rr ? 25 : 40} rx="10" fill="#020617" />
    </svg>
  );
}

const Wiper = ({ baseX, baseY, active, speed, jammed }: { baseX: number, baseY: number, active: boolean, speed: string, jammed?: boolean }) => {
  const duration = speed === 'high' ? '0.7s' : '1.3s';
  const rotation = jammed ? 'rotate(-45deg)' : 'rotate(0deg)';

  return (
    <g style={{ transformOrigin: `${baseX}px ${baseY}px`, transform: jammed ? rotation : 'none' }} className={active ? 'animate-wiper' : ''}>
      <line x1={baseX} y1={baseY} x2={baseX + 120} y2={baseY - 70} stroke="#1e293b" strokeWidth="4" />
      <style>{`
        .animate-wiper { animation: sweep ${duration} ease-in-out infinite; }
        @keyframes sweep { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-70deg); } }
      `}</style>
    </g>
  );
};

export default CarView;


export interface CarState {
  view: 'front' | 'side' | 'rear';
  isNight: boolean;
  isEngineOn: boolean;
  isEngineBroken: boolean;
  isOilLeaking: boolean;
  isBatteryDead: boolean;
  isFuelEmpty: boolean;
  isWiperBroken: boolean;
  parkingLightsOn: boolean;
  lightsOn: boolean;
  highBeamOn: boolean;
  fogLightsOn: boolean;
  hazardLightsOn: boolean;
  leftSignalOn: boolean;
  rightSignalOn: boolean;
  isRaining: boolean;
  wipersActive: boolean;
  wiperSpeed: 'low' | 'high' | 'off';
  isWashing: boolean;
  interiorLightOn: boolean;
  isHornActive: boolean;
  isHoodOpen: boolean;
  isTrunkOpen: boolean;
  windowsDown: boolean;
  doorsOpen: {
    left: boolean;
    right: boolean;
  };
  tires: {
    fl: boolean;
    fr: boolean;
    rl: boolean;
    rr: boolean;
  };
  rpm: number;
  temperature: number;
  speed: number;
}

export type ControlAction = 
  | { type: 'SET_VIEW', payload: 'front' | 'side' | 'rear' }
  | { type: 'SET_FULL_STATE', payload: Partial<CarState> }
  | { type: 'RESET_ALL' }
  | { type: 'TOGGLE_NIGHT' }
  | { type: 'TOGGLE_ENGINE' }
  | { type: 'BREAK_ENGINE' }
  | { type: 'REPAIR_ENGINE' }
  | { type: 'TOGGLE_OIL_LEAK' }
  | { type: 'TOGGLE_BATTERY' }
  | { type: 'TOGGLE_FUEL' }
  | { type: 'TOGGLE_WIPER_BREAK' }
  | { type: 'TOGGLE_PARKING_LIGHTS' }
  | { type: 'TOGGLE_LIGHTS' }
  | { type: 'TOGGLE_HIGH_BEAM' }
  | { type: 'TOGGLE_FOG_LIGHTS' }
  | { type: 'TOGGLE_HAZARDS' }
  | { type: 'TOGGLE_RAIN' }
  | { type: 'SET_WIPERS', payload: 'low' | 'high' | 'off' }
  | { type: 'TOGGLE_WASHING', payload: boolean }
  | { type: 'TOGGLE_INTERIOR' }
  | { type: 'TOGGLE_SIGNAL', payload: 'left' | 'right' }
  | { type: 'TOGGLE_HORN', payload: boolean }
  | { type: 'TOGGLE_HOOD' }
  | { type: 'TOGGLE_TRUNK' }
  | { type: 'TOGGLE_WINDOWS' }
  | { type: 'TOGGLE_DOOR', payload: 'left' | 'right' }
  | { type: 'TOGGLE_TIRE', payload: 'fl' | 'fr' | 'rl' | 'rr' }
  | { type: 'SET_RPM', payload: number }
  | { type: 'SET_TEMPERATURE', payload: number }
  | { type: 'SET_SPEED', payload: number };

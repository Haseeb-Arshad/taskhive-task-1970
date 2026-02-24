/**
 * Application configuration and constants
 */

const CONFIG = {
  // Performance settings
  FRAME_RATE: 60, // Target FPS
  UPDATE_INTERVAL: 1000, // Clock update in ms
  
  // Particle settings
  PARTICLE_COUNT: 50,
  PARTICLE_SPEED_MIN: 0.3,
  PARTICLE_SPEED_MAX: 1.5,
  PARTICLE_SIZE_MIN: 1,
  PARTICLE_SIZE_MAX: 4,
  
  // Animation settings
  HAND_SMOOTH_DURATION: 800, // ms for smooth hand movement
  TRANSITION_DURATION: 300, // ms for CSS transitions
  
  // Audio settings
  TICK_FREQUENCY: 800, // Hz
  TICK_DURATION: 50, // ms
  TICK_VOLUME: 0.1,
  
  // Alarm settings
  ALARM_FREQUENCY: 1000, // Hz
  ALARM_DURATION: 500, // ms
  ALARM_INTERVAL: 500, // ms between beeps
  ALARM_MAX_DURATION: 30000, // 30 seconds
  
  // Storage keys
  STORAGE_KEYS: {
    THEME: 'app_theme',
    TIME_FORMAT: 'app_time_format',
    TIMEZONE: 'app_timezone',
    SOUND_ENABLED: 'app_sound_enabled',
    ALARMS: 'app_alarms',
  },
  
  // Timezone data
  TIMEZONES: [
    { id: 'local', label: 'Local Time' },
    { id: 'America/New_York', label: 'New York (EST/EDT)' },
    { id: 'America/Chicago', label: 'Chicago (CST/CDT)' },
    { id: 'America/Denver', label: 'Denver (MST/MDT)' },
    { id: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
    { id: 'Europe/London', label: 'London (GMT/BST)' },
    { id: 'Europe/Paris', label: 'Paris (CET/CEST)' },
    { id: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { id: 'Asia/Shanghai', label: 'Shanghai (CST)' },
    { id: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
    { id: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)' },
    { id: 'Pacific/Auckland', label: 'Auckland (NZDT/NZST)' },
  ],
  
  // Default values
  DEFAULT_THEME: 'light',
  DEFAULT_TIME_FORMAT: '12h',
  DEFAULT_TIMEZONE: 'local',
  DEFAULT_SOUND_ENABLED: true,
};

// Utility function for safe error logging
window.debugLog = (message, data = null) => {
  if (typeof console !== 'undefined' && console.log) {
    console.log(`[Clock App] ${message}`, data || '');
  }
};

window.debugError = (message, error = null) => {
  if (typeof console !== 'undefined' && console.error) {
    console.error(`[Clock App Error] ${message}`, error || '');
  }
};
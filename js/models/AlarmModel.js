/**
 * AlarmModel - Manages alarm creation, storage, and state
 */

class AlarmModel extends EventTarget {
  constructor() {
    super();
    
    this.alarms = [];
    this.activeAlarm = null;
    this.isPlaying = false;
    
    this._loadFromStorage();
  }
  
  /**
   * Create or update an alarm
   * @param {Object} options - {time: 'HH:MM', enabled: boolean}
   */
  setAlarm(time, enabled = true) {
    // Validate time format
    if (!this._isValidTimeFormat(time)) {
      throw new Error('Invalid time format. Expected HH:MM');
    }
    
    // Remove existing alarm (only one alarm supported in this version)
    this.activeAlarm = {
      id: Date.now(),
      time,
      enabled,
      createdAt: new Date().toISOString(),
    };
    
    this._saveToStorage();
    this.dispatchEvent(new CustomEvent('alarmSet', { detail: this.activeAlarm }));
  }
  
  /**
   * Check if alarm should trigger
   * @param {Object} currentTime - Time object from TimeModel
   * @returns {boolean}
   */
  shouldTrigger(currentTime) {
    if (!this.activeAlarm || !this.activeAlarm.enabled) {
      return false;
    }
    
    const [alarmHours, alarmMinutes] = this.activeAlarm.time.split(':').map(Number);
    
    // Trigger when time matches and we haven't already triggered this minute
    const matches = currentTime.rawHours === alarmHours && 
                   currentTime.rawMinutes === alarmMinutes &&
                   currentTime.rawSeconds === 0;
    
    return matches;
  }
  
  /**
   * Clear the alarm
   */
  clearAlarm() {
    this.activeAlarm = null;
    this.isPlaying = false;
    this._saveToStorage();
    this.dispatchEvent(new CustomEvent('alarmCleared'));
  }
  
  /**
   * Disable/enable alarm
   */
  toggleAlarm(enabled) {
    if (this.activeAlarm) {
      this.activeAlarm.enabled = enabled;
      this._saveToStorage();
      this.dispatchEvent(new CustomEvent('alarmToggled', { detail: { enabled } }));
    }
  }
  
  /**
   * Get current alarm
   */
  getAlarm() {
    return this.activeAlarm;
  }
  
  /**
   * Mark alarm as playing
   */
  setPlaying(playing) {
    this.isPlaying = playing;
    this.dispatchEvent(new CustomEvent('alarmPlayingChanged', { detail: { playing } }));
  }
  
  /**
   * Private: Validate HH:MM format
   */
  _isValidTimeFormat(time) {
    const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
  }
  
  /**
   * Private: Load alarms from localStorage
   */
  _loadFromStorage() {
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.ALARMS);
      if (stored) {
        this.activeAlarm = JSON.parse(stored);
      }
    } catch (error) {
      debugError('Failed to load alarms from storage', error);
    }
  }
  
  /**
   * Private: Save alarms to localStorage
   */
  _saveToStorage() {
    try {
      if (this.activeAlarm) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.ALARMS, JSON.stringify(this.activeAlarm));
      } else {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.ALARMS);
      }
    } catch (error) {
      debugError('Failed to save alarms to storage', error);
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AlarmModel;
}
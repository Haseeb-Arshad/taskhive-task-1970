/**
 * SettingsModel - Manages user preferences and settings
 */

class SettingsModel extends EventTarget {
  constructor() {
    super();
    
    this.theme = CONFIG.DEFAULT_THEME;
    this.timeFormat = CONFIG.DEFAULT_TIME_FORMAT;
    this.timezone = CONFIG.DEFAULT_TIMEZONE;
    this.soundEnabled = CONFIG.DEFAULT_SOUND_ENABLED;
    
    this._loadFromStorage();
  }
  
  /**
   * Set theme
   * @param {string} theme - 'light' or 'dark'
   */
  setTheme(theme) {
    if (['light', 'dark'].includes(theme)) {
      this.theme = theme;
      this._saveToStorage();
      this.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }
  }
  
  /**
   * Toggle theme
   */
  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
  
  /**
   * Get current theme
   */
  getTheme() {
    return this.theme;
  }
  
  /**
   * Set time format
   * @param {string} format - '12h' or '24h'
   */
  setTimeFormat(format) {
    if (['12h', '24h'].includes(format)) {
      this.timeFormat = format;
      this._saveToStorage();
      this.dispatchEvent(new CustomEvent('timeFormatChanged', { detail: { format } }));
    }
  }
  
  /**
   * Toggle time format
   */
  toggleTimeFormat() {
    const newFormat = this.timeFormat === '12h' ? '24h' : '12h';
    this.setTimeFormat(newFormat);
  }
  
  /**
   * Get current time format
   */
  getTimeFormat() {
    return this.timeFormat;
  }
  
  /**
   * Set timezone
   * @param {string} timezone - IANA timezone ID
   */
  setTimezone(timezone) {
    this.timezone = timezone;
    this._saveToStorage();
    this.dispatchEvent(new CustomEvent('timezoneChanged', { detail: { timezone } }));
  }
  
  /**
   * Get current timezone
   */
  getTimezone() {
    return this.timezone;
  }
  
  /**
   * Set sound enabled state
   * @param {boolean} enabled
   */
  setSoundEnabled(enabled) {
    this.soundEnabled = Boolean(enabled);
    this._saveToStorage();
    this.dispatchEvent(new CustomEvent('soundChanged', { detail: { enabled: this.soundEnabled } }));
  }
  
  /**
   * Toggle sound
   */
  toggleSound() {
    this.setSoundEnabled(!this.soundEnabled);
  }
  
  /**
   * Get sound enabled state
   */
  getSoundEnabled() {
    return this.soundEnabled;
  }
  
  /**
   * Private: Load settings from localStorage
   */
  _loadFromStorage() {
    try {
      const theme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME);
      if (theme) this.theme = theme;
      
      const format = localStorage.getItem(CONFIG.STORAGE_KEYS.TIME_FORMAT);
      if (format) this.timeFormat = format;
      
      const timezone = localStorage.getItem(CONFIG.STORAGE_KEYS.TIMEZONE);
      if (timezone) this.timezone = timezone;
      
      const sound = localStorage.getItem(CONFIG.STORAGE_KEYS.SOUND_ENABLED);
      if (sound !== null) this.soundEnabled = sound === 'true';
    } catch (error) {
      debugError('Failed to load settings from storage', error);
    }
  }
  
  /**
   * Private: Save settings to localStorage
   */
  _saveToStorage() {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, this.theme);
      localStorage.setItem(CONFIG.STORAGE_KEYS.TIME_FORMAT, this.timeFormat);
      localStorage.setItem(CONFIG.STORAGE_KEYS.TIMEZONE, this.timezone);
      localStorage.setItem(CONFIG.STORAGE_KEYS.SOUND_ENABLED, String(this.soundEnabled));
    } catch (error) {
      debugError('Failed to save settings to storage', error);
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SettingsModel;
}
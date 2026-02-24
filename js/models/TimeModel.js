/**
 * TimeModel - Manages time calculations and updates
 * Single source of truth for current time with drift correction
 */

class TimeModel extends EventTarget {
  constructor() {
    super();
    
    this.timezone = 'local';
    this.format24 = false;
    this.lastSyncTime = Date.now();
    this.driftCorrection = 0;
    
    // Bind methods for event listeners
    this._onTick = this._onTick.bind(this);
  }
  
  /**
   * Set the timezone for time display
   * @param {string} timezone - IANA timezone identifier (e.g., 'America/New_York')
   */
  setTimezone(timezone) {
    this.timezone = timezone;
    this.dispatchEvent(new CustomEvent('timezoneChanged', { detail: { timezone } }));
  }
  
  /**
   * Get the current timezone
   * @returns {string}
   */
  getTimezone() {
    return this.timezone;
  }
  
  /**
   * Set time format (12h or 24h)
   * @param {string} format - '12h' or '24h'
   */
  setFormat(format) {
    this.format24 = format === '24h';
    this.dispatchEvent(new CustomEvent('formatChanged', { detail: { format } }));
  }
  
  /**
   * Get time object for current timezone
   * @returns {Object} {hours, minutes, seconds, date, period, dayName, monthName}
   */
  getTime() {
    const now = new Date(Date.now() + this.driftCorrection);
    let date;
    
    if (this.timezone === 'local') {
      date = now;
    } else {
      // Get time in specified timezone using Intl API
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: this.timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      
      const parts = formatter.formatToParts(now);
      const dateMap = {};
      
      parts.forEach(({ type, value }) => {
        dateMap[type] = value;
      });
      
      date = new Date(
        `${dateMap.year}-${dateMap.month}-${dateMap.day}T${dateMap.hour}:${dateMap.minute}:${dateMap.second}`
      );
    }
    
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    let period = 'AM';
    if (!this.format24) {
      period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // Convert to 12-hour format
    }
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = dayNames[date.getDay()];
    const monthName = monthNames[date.getMonth()];
    const dayOfMonth = date.getDate();
    const year = date.getFullYear();
    
    return {
      hours: this._padZero(hours),
      minutes: this._padZero(minutes),
      seconds: this._padZero(seconds),
      rawHours: hours,
      rawMinutes: minutes,
      rawSeconds: seconds,
      period,
      dayName,
      monthName,
      dayOfMonth,
      year,
      raw: date,
    };
  }
  
  /**
   * Get angle for clock hands (0-360 degrees)
   * @returns {Object} {hour, minute, second}
   */
  getHandAngles() {
    const time = this.getTime();
    
    // Calculate angles (360 degrees = full rotation)
    const secondAngle = (time.rawSeconds / 60) * 360;
    const minuteAngle = (time.rawMinutes / 60) * 360 + (time.rawSeconds / 60) * 6;
    const hourAngle = (time.rawHours / 12) * 360 + (time.rawMinutes / 60) * 30;
    
    return {
      hour: hourAngle,
      minute: minuteAngle,
      second: secondAngle,
    };
  }
  
  /**
   * Start the clock update loop
   * @param {Function} callback - Function called on each tick
   * @returns {number} Animation frame ID
   */
  start(callback) {
    this.callback = callback;
    this._scheduleNextTick();
    return this.animationFrameId;
  }
  
  /**
   * Stop the clock update loop
   */
  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  /**
   * Private: Schedule next tick
   */
  _scheduleNextTick() {
    const now = Date.now();
    const msUntilNextSecond = 1000 - (now % 1000);
    
    setTimeout(() => {
      this._onTick();
      this._scheduleNextTick();
    }, msUntilNextSecond);
  }
  
  /**
   * Private: Handle tick event
   */
  _onTick() {
    // Sync drift every 60 seconds
    if ((Date.now() - this.lastSyncTime) > 60000) {
      this._correctDrift();
    }
    
    if (this.callback) {
      this.callback(this.getTime());
    }
    
    this.dispatchEvent(new CustomEvent('tick', { detail: this.getTime() }));
  }
  
  /**
   * Private: Correct time drift
   */
  _correctDrift() {
    const now = Date.now();
    const theoreticalTime = this.lastSyncTime + 60000;
    this.driftCorrection += theoreticalTime - now;
    this.lastSyncTime = now;
  }
  
  /**
   * Private: Pad number with leading zero
   */
  _padZero(num) {
    return String(num).padStart(2, '0');
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TimeModel;
}
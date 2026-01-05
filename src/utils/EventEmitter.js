/**
 * Simple event emitter for game events (collisions, etc.)
 */
export default class EventEmitter {
  constructor() {
    this.events = new Map(); // eventName -> Set of listeners
  }

  /**
   * Subscribe to an event
   * @param {string} event 
   * @param {Function} listener 
   */
  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(listener);
  }

  /**
   * Unsubscribe from an event
   * @param {string} event 
   * @param {Function} listener 
   */
  off(event, listener) {
    if (this.events.has(event)) {
      this.events.get(event).delete(listener);
    }
  }

  /**
   * Emit an event
   * @param {string} event 
   * @param {...any} args 
   */
  emit(event, ...args) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(listener => listener(...args));
    }
  }

  /**
   * Clear all listeners for an event
   * @param {string} event 
   */
  clear(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }
}
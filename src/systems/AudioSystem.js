import System from '../core/System.js';

/**
 * Handles audio playback using Web Audio API
 */
export default class AudioSystem extends System {
  constructor(engine) {
    super(engine);
    this.context = null;
    this.gainNode = null;
    this.sounds = new Map(); // key -> AudioBuffer
    
    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.context.createGain();
      this.gainNode.connect(this.context.destination);
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  /**
   * Play a sound
   * @param {string} key - Sound asset key
   * @param {number} volume - 0.0 to 1.0
   * @param {boolean} loop - Loop playback
   * @returns {AudioBufferSourceNode|null}
   */
  play(key, volume = 1, loop = false) {
    if (!this.context) return null;
    
    const buffer = this.sounds.get(key);
    if (!buffer) {
      console.warn(`Sound not loaded: ${key}`);
      return null;
    }
    
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    
    const gain = this.context.createGain();
    gain.gain.value = volume;
    
    source.connect(gain);
    gain.connect(this.gainNode);
    source.start();
    
    return source;
  }

  /**
   * Register a pre-loaded sound
   * @param {string} key 
   * @param {AudioBuffer} buffer 
   */
  registerSound(key, buffer) {
    this.sounds.set(key, buffer);
  }

  /**
   * Set master volume
   * @param {number} volume 
   */
  setVolume(volume) {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }
}
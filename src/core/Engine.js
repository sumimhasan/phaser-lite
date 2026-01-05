import System from './System.js';
import Scene from '../scenes/Scene.js';

/**
 * Game engine core
 * - Manages game loop
 * - Orchestrates systems
 * - Handles scene transitions
 */
export default class Engine {
  constructor(config = {}) {
    this.config = {
      fixedTimeStep: 1/60, // 60 FPS physics
      maxFrameSkip: 5,     // Prevent spiral of death
      ...config
    };
    
    this.systems = [];
    this.scenes = {};
    this.currentScene = null;
    this.lastTime = 0;
    this.accumulator = 0;
    this.isRunning = false;
    this.frameCount = 0;
  }

  /**
   * Register a system
   * @param {typeof System} SystemClass - System constructor
   * @param  {...any} args - Arguments for system constructor
   */
  registerSystem(SystemClass, ...args) {
    if (!SystemClass.prototype instanceof System) {
      throw new Error('Invalid system class - must extend System');
    }
    
    const system = new SystemClass(this, ...args);
    this.systems.push(system);
    return system;
  }

  /**
   * Add a scene to the engine
   * @param {string} key - Scene identifier
   * @param {Scene} scene - Scene instance
   */
  addScene(key, scene) {
    if (!(scene instanceof Scene)) {
      throw new Error('Invalid scene - must extend Scene');
    }
    this.scenes[key] = scene;
    scene.engine = this;
  }

  /**
   * Start the game loop with initial scene
   * @param {string} sceneKey - Starting scene key
   */
  start(sceneKey) {
    if (!this.scenes[sceneKey]) {
      throw new Error(`Scene not found: ${sceneKey}`);
    }
    
    this.currentScene = this.scenes[sceneKey];
    this.currentScene.init();
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  /**
   * Main game loop with fixed timestep
   * @param {number} timestamp - Current time from requestAnimationFrame
   */
  gameLoop(timestamp) {
    if (!this.isRunning) return;
    
    const now = timestamp;
    const deltaTime = (now - this.lastTime) / 1000;
    this.lastTime = now;
    
    // Safety: Clamp deltaTime to prevent physics explosions
    const clampedDeltaTime = Math.min(deltaTime, 0.1);
    
    // Fixed timestep physics
    this.accumulator += clampedDeltaTime;
    let frameSkipped = 0;
    
    while (
      this.accumulator >= this.config.fixedTimeStep && 
      frameSkipped < this.config.maxFrameSkip
    ) {
      this.update(this.config.fixedTimeStep);
      this.accumulator -= this.config.fixedTimeStep;
      frameSkipped++;
    }
    
    // Render at variable framerate
    this.render(deltaTime);
    
    // Stats tracking
    this.frameCount++;
    
    // Continue loop
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  /**
   * Update all systems and scene logic
   * @param {number} deltaTime - Fixed timestep interval
   */
  update(deltaTime) {
    // Update systems
    for (const system of this.systems) {
      if (system.active) {
        system.update(deltaTime);
      }
    }
    
    // Update scene scripts
    if (this.currentScene) {
      this.currentScene.update(deltaTime);
    }
  }

  /**
   * Render frame (handled by rendering systems)
   */
  render() {
    // Render systems handle their own rendering
  }

  /**
   * Stop the game engine
   */
  stop() {
    this.isRunning = false;
    this.currentScene?.destroy();
    
    // Clean up systems
    for (const system of this.systems) {
      system.destroy?.();
    }
  }
}
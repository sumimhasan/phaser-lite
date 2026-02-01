// =========================
// Game Engine Entry Point
// =========================

// Import core classes
import Engine from './core/Engine.js';
import Scene from './scenes/Scene.js';
import AssetLoader from './utils/AssetLoader.js';
import EventEmitter from './utils/EventEmitter.js';

// Import systems
import RenderSystem from './systems/RenderSystem.js';
import InputSystem from './systems/InputSystem.js';
import PhysicsSystem from './systems/PhysicsSystem.js';
import AudioSystem from './systems/AudioSystem.js';

// Import components
import Transform from './components/Transform.js';
import Sprite from './components/Sprite.js';
import Rigidbody from './components/Rigidbody.js';
import Collider from './components/Collider.js';
import Script from './components/Script.js';

// -------------------------
// Engine Initialization
// -------------------------
const engine = new Engine();

// Add core utilities
engine.assetLoader = new AssetLoader();
engine.eventEmitter = new EventEmitter();

// Register default systems
engine.registerSystem(RenderSystem);
engine.registerSystem(InputSystem);
engine.registerSystem(PhysicsSystem);
engine.registerSystem(AudioSystem);

// Expose all core classes and components for external usage
const EngineAPI = {
  engine,
  Scene,
  components: {
    Transform,
    Sprite,
    Rigidbody,
    Collider,
    Script
  },
  systems: {
    RenderSystem,
    InputSystem,
    PhysicsSystem,
    AudioSystem
  },
  utils: {
    AssetLoader,
    EventEmitter
  }
};

// -------------------------
// Engine Helper Functions
// -------------------------

/**
 * Registers a new system to the engine
 * @param {class} SystemClass 
 */
EngineAPI.registerSystem = (SystemClass) => engine.registerSystem(SystemClass);

/**
 * Adds a new scene to the engine
 * @param {string} name 
 * @param {Scene} sceneInstance 
 */
EngineAPI.addScene = (name, sceneInstance) => engine.addScene(name, sceneInstance);

/**
 * Starts the engine with a specific scene
 * @param {string} sceneName 
 */
EngineAPI.start = (sceneName) => engine.start(sceneName);

/**
 * Loads assets before running the game
 * @param {Array} assets 
 * @returns {Promise}
 */
EngineAPI.loadAssets = (assets) => engine.assetLoader.load(assets);

/**
 * Shortcut for creating entities in a scene
 * @param {Scene} scene 
 * @returns {Entity}
 */
EngineAPI.createEntity = (scene) => scene.createEntity();

// -------------------------
// Global Exposure
// -------------------------
window.gameEngine = EngineAPI;

// Export the API for module usage
export default EngineAPI;

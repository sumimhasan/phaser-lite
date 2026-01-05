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

// Engine setup
const engine = new Engine();
engine.assetLoader = new AssetLoader();
engine.eventEmitter = new EventEmitter();

// Register systems
engine.registerSystem(RenderSystem);
engine.registerSystem(InputSystem);
engine.registerSystem(PhysicsSystem);
engine.registerSystem(AudioSystem);

// Load player PNG
engine.assetLoader.load([
  {
    type: 'image',
    key: 'player',
    src: 'https://cdn.pixabay.com/photo/2016/03/31/17/47/hedgehog-1293907_1280.png'
  }
]).then(() => {

  class DebugScene extends Scene {
    init() {
      super.init();
      const input = this.engine.systems.find(s => s instanceof InputSystem);

      // --- Player / Render Test ---
      const player = this.createEntity();
      player.addComponent(Transform, 100, 100);
      player.addComponent(Sprite, 'player', 64, 64);
      player.addComponent(Rigidbody, false, 1, true);
      player.addComponent(Collider, 64, 64);
      player.addComponent(Script, {
        update: () => {
          const t = player.getComponent(Transform);
          const rb = player.getComponent(Rigidbody);

          // Horizontal movement
          if (input.isKeyDown('ArrowLeft')) rb.velocity.x = -200;
          else if (input.isKeyDown('ArrowRight')) rb.velocity.x = 200;
          else rb.velocity.x *= 0.9;

          // Jump
          if (input.isKeyDown('Space') && rb.onGround) {
            rb.velocity.y = -400;
            rb.onGround = false;
          }

          // Clamp inside viewport
          t.x = Math.max(0, Math.min(800 - 64, t.x));
        }
      });

      // --- Ground ---
      const ground = this.createEntity();
      ground.addComponent(Transform, 0, 500);
      ground.addComponent(Sprite, '', 800, 32);
      ground.getComponent(Sprite).el.style.backgroundColor = '#4ecdc4';
      ground.addComponent(Rigidbody, true);
      ground.addComponent(Collider, 800, 32);

      // --- Floating platforms ---
      const platform1 = this.createEntity();
      platform1.addComponent(Transform, 200, 400);
      platform1.addComponent(Sprite, '', 150, 20);
      platform1.getComponent(Sprite).el.style.backgroundColor = '#ff6b6b';
      platform1.addComponent(Rigidbody, true);
      platform1.addComponent(Collider, 150, 20);

      const platform2 = this.createEntity();
      platform2.addComponent(Transform, 450, 300);
      platform2.addComponent(Sprite, '', 200, 20);
      platform2.getComponent(Sprite).el.style.backgroundColor = '#ffa500';
      platform2.addComponent(Rigidbody, true);
      platform2.addComponent(Collider, 200, 20);

      // --- Multiple ECS entities ---
      for (let i = 0; i < 3; i++) {
        const e = this.createEntity();
        e.addComponent(Transform, 50 + i * 100, 200 - i * 40);
        e.addComponent(Sprite, '', 40, 40);
        e.getComponent(Sprite).el.style.backgroundColor = i % 2 === 0 ? '#8e44ad' : '#3498db';
        e.addComponent(Rigidbody, false, 1, true);
        e.addComponent(Collider, 40, 40);
        e.addComponent(Script, {
          update: () => {
            e.getComponent(Transform).rotation += 0.02 * (i + 1);
          }
        });
      }

      // --- Debug log panel ---
      const debugPanel = document.createElement('div');
      debugPanel.id = 'debug-panel';
      debugPanel.style.position = 'absolute';
      debugPanel.style.bottom = '0';
      debugPanel.style.left = '0';
      debugPanel.style.width = '100%';
      debugPanel.style.height = '150px';
      debugPanel.style.backgroundColor = 'rgba(0,0,0,0.7)';
      debugPanel.style.color = '#fff';
      debugPanel.style.fontFamily = 'monospace';
      debugPanel.style.fontSize = '12px';
      debugPanel.style.overflowY = 'auto';
      debugPanel.style.padding = '4px';
      document.getElementById('game-container').appendChild(debugPanel);

      // --- Update debug panel each frame ---
      this.addComponent(Script, {
        update: () => {
          const t = player.getComponent(Transform);
          const rb = player.getComponent(Rigidbody);

          const logLines = [
            `Player Position: x=${t.x.toFixed(1)}, y=${t.y.toFixed(1)}`,
            `Player Velocity: vx=${rb.velocity.x.toFixed(1)}, vy=${rb.velocity.y.toFixed(1)}`,
            `Player onGround: ${rb.onGround}`,
            `Keys pressed: Left=${input.isKeyDown('ArrowLeft')}, Right=${input.isKeyDown('ArrowRight')}, Space=${input.isKeyDown('Space')}`
          ];

          debugPanel.innerHTML = logLines.join('<br>');
          debugPanel.scrollTop = debugPanel.scrollHeight;
        }
      });

    }
  }

  engine.addScene('debug', new DebugScene());
  engine.start('debug');

}).catch(err => {
  console.error('Asset loading failed:', err);
});

window.gameEngine = engine;

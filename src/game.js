// Import the engine API
import gameEngine from './main.js';
const { engine, addScene, start, createEntity, components, loadAssets } = gameEngine;

// -------------------------
// Define a Test Scene
// -------------------------
class TestScene extends gameEngine.Scene {
  init() {
    // Find the input system
    const input = engine.systems.find(s => s instanceof gameEngine.systems.InputSystem);

    // --- Player Entity ---
    const player = createEntity(this);
    player.addComponent(components.Transform, 100, 100);
    player.addComponent(components.Sprite, 'player', 64, 64);
    player.addComponent(components.Rigidbody, false, 1, true);
    player.addComponent(components.Collider, 64, 64);
    player.addComponent(components.Script, {
      update: () => {
        const t = player.getComponent(components.Transform);
        const rb = player.getComponent(components.Rigidbody);

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
    const ground = createEntity(this);
    ground.addComponent(components.Transform, 0, 500);
    ground.addComponent(components.Sprite, '', 800, 32);
    ground.getComponent(components.Sprite).el.style.backgroundColor = '#4ecdc4';
    ground.addComponent(components.Rigidbody, true);
    ground.addComponent(components.Collider, 800, 32);
  }
}

// -------------------------
// Add Scene and Start Game
// -------------------------
addScene('test', new TestScene());

// Load assets (player image) then start the engine
loadAssets([
  { type: 'image', key: 'player', src: 'https://cdn.pixabay.com/photo/2016/03/31/17/47/hedgehog-1293907_1280.png' }
]).then(() => start('test'));

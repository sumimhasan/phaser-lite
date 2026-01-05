import System from '../core/System.js';
import Transform from '../components/Transform.js';
import Sprite from '../components/Sprite.js';

/**
 * Renders entities with Transform + Sprite components
 */
export default class RenderSystem extends System {
  constructor(engine) {
    super(engine, [Transform, Sprite]);
    this.container = document.getElementById('game-container');
    if (!this.container) {
      throw new Error('Game container #game-container not found');
    }
  }

  update(deltaTime) {
    const entities = this.getEntities();
    
    // Sort by Y position for proper layering (lower Y = background)
    entities.sort((a, b) => {
      const aY = a.getComponent(Transform).position.y;
      const bY = b.getComponent(Transform).position.y;
      return aY - bY;
    });

    // Update DOM elements
    for (const entity of entities) {
      const transform = entity.getComponent(Transform);
      const sprite = entity.getComponent(Sprite);
      
      if (!sprite.element || !sprite.visible) continue;
      
      // Apply CSS transform (GPU accelerated)
      sprite.element.style.transform = `
        translate(${transform.position.x}px, ${transform.position.y}px)
        rotate(${transform.rotation}rad)
        scale(${transform.scale.x}, ${transform.scale.y})
      `;
      
      // Set z-index based on Y position
      sprite.element.style.zIndex = Math.floor(transform.position.y).toString();
    }
  }
}
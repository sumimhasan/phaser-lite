import Entity from '../core/Entity.js';

/**
 * Scene container for entities and lifecycle management
 */
export default class Scene {
  constructor() {
    this.entities = [];
    this.engine = null;
    this.initialized = false;
  }

  /**
   * Called when scene is added to engine
   */
  init() {
    if (this.initialized) return;
    this.initialized = true;
    
    // Initialize all entities
    for (const entity of this.entities) {
      entity.scene = this;
      for (const component of entity.components.values()) {
        component.init?.();
      }
    }
  }

  /**
   * Update scene logic (scripts)
   * @param {number} deltaTime 
   */
  update(deltaTime) {
    // Update script components
    for (const entity of this.entities) {
      if (entity.isDestroyed) continue;
      const script = entity.getComponent(Script);
      if (script) {
        script.update(deltaTime);
      }
    }
  }

  /**
   * Create new entity
   * @returns {Entity}
   */
  createEntity() {
    const entity = new Entity();
    entity.scene = this;
    this.entities.push(entity);
    return entity;
  }

  /**
   * Remove entity from scene
   * @param {Entity} entity 
   */
  removeEntity(entity) {
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      this.entities.splice(index, 1);
    }
  }

  /**
   * Destroy scene and all entities
   */
  destroy() {
    for (const entity of this.entities) {
      entity.destroy();
    }
    this.entities = [];
    this.initialized = false;
  }
}
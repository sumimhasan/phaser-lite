/**
 * Base system class for ECS
 * Systems process entities with specific components
 */
export default class System {
  /**
   * @param {Engine} engine - Engine instance
   * @param {Array<typeof Component>} query - Required component types
   */
  constructor(engine, query = []) {
    this.engine = engine;
    this.query = query; // Component types this system processes
    this.active = true;
  }

  /**
   * Filter entities that match this system's query
   * @returns {Array<Entity>}
   */
  getEntities() {
    if (!this.engine.currentScene) return [];
    
    return this.engine.currentScene.entities.filter(entity => {
      if (entity.isDestroyed) return false;
      return this.query.every(ComponentType => 
        entity.hasComponent(ComponentType)
      );
    });
  }

  /**
   * System update method (override in subclasses)
   * @param {number} deltaTime - Seconds since last frame
   */
  update(deltaTime) {
    // Override in child classes
  }

  /**
   * System cleanup (override in subclasses)
   */
  destroy() {
    // Override in child classes
  }
}
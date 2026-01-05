import Component from './Component.js';

/**
 * ECS Entity container
 * - Holds components
 * - Manages lifecycle
 * - Prevents duplicate component types
 */
export default class Entity {
  constructor() {
    this.components = new Map(); // ComponentType -> Instance
    this.isDestroyed = false;
    this.scene = null;
  }

  /**
   * Add component to entity
   * @param {typeof Component} ComponentClass - Component constructor
   * @param  {...any} args - Arguments for component constructor
   * @throws {Error} If component already exists
   */
  addComponent(ComponentClass, ...args) {
    if (this.hasComponent(ComponentClass)) {
      throw new Error(`Entity already has component: ${ComponentClass.name}`);
    }
    
    const component = new ComponentClass(...args);
    component.entity = this;
    
    // Initialize if scene exists
    if (this.scene) {
      component.init?.();
    }
    
    this.components.set(ComponentClass, component);
    return component;
  }

  /**
   * Get component instance
   * @param {typeof Component} ComponentClass 
   * @returns {Component|null}
   */
  getComponent(ComponentClass) {
    return this.components.get(ComponentClass) || null;
  }

  /**
   * Check if entity has component
   * @param {typeof Component} ComponentClass 
   * @returns {boolean}
   */
  hasComponent(ComponentClass) {
    return this.components.has(ComponentClass);
  }

  /**
   * Destroy entity and clean up resources
   */
  destroy() {
    if (this.isDestroyed) return;
    
    // Destroy all components
    for (const component of this.components.values()) {
      component.destroy?.();
    }
    
    this.components.clear();
    this.isDestroyed = true;
    
    // Remove from scene if exists
    if (this.scene) {
      this.scene.removeEntity(this);
    }
  }
}
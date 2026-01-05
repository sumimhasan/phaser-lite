import Component from '../core/Component.js';

/**
 * Custom game logic attached to entities
 */
export default class Script extends Component {
  /**
   * @param {Object} callbacks - { start, update, destroy }
   */
  constructor(callbacks = {}) {
    super();
    this.onStart = callbacks.start || (() => {});
    this.onUpdate = callbacks.update || (() => {});
    this.onDestroy = callbacks.destroy || (() => {});
  }

  init() {
    this.onStart();
  }

  update(deltaTime) {
    this.onUpdate(deltaTime);
  }

  destroy() {
    this.onDestroy();
  }
}
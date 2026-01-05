/**
 * Base class for all components
 * Components are pure data containers
 */
export default class Component {
  constructor() {
    // Unique identifier for debugging
    this._id = Symbol();
  }

  //  lifecycle methods for initialization/cleanup
  init() {}
  destroy() {}
}
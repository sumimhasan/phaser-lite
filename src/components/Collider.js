import Component from '../core/Component.js';
import Vector2 from '../utils/Vector2.js';
import AABB from '../utils/AABB.js';

/**
 * Collision shape (AABB only for now)
 */
export default class Collider extends Component {
  /**
   * @param {number} width - Full width
   * @param {number} height - Full height
   * @param {boolean} isTrigger - No physical collision
   */
  constructor(width = 32, height = 32, isTrigger = false) {
    super();
    this.size = new Vector2(width / 2, height / 2); // Half-extents
    this.isTrigger = isTrigger;
    this.aabb = null; // Created during init
  }

  init() {
    const transform = this.entity.getComponent(Transform);
    if (transform) {
      this.aabb = new AABB(transform.position.clone(), this.size.clone());
    }
  }

  updateAABB() {
    const transform = this.entity.getComponent(Transform);
    if (transform && this.aabb) {
      this.aabb.center = transform.position.clone();
    }
  }
}
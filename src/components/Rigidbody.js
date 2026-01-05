import Component from '../core/Component.js';
import Vector2 from '../utils/Vector2.js';

/**
 * Physics properties for movement and collision
 */
export default class Rigidbody extends Component {
  /**
   * @param {boolean} isStatic - Immovable object
   * @param {number} mass - Affects physics response
   * @param {boolean} affectedByGravity - Enable gravity
   */
  constructor(isStatic = false, mass = 1, affectedByGravity = true) {
    super();
    this.isStatic = isStatic;
    this.mass = mass;
    this.velocity = new Vector2();
    this.acceleration = new Vector2();
    this.affectedByGravity = affectedByGravity;
    this.onGround = false;
  }

  applyForce(force) {
    // F = ma => a = F/m
    this.acceleration = this.acceleration.add(force.divide(this.mass));
  }
}
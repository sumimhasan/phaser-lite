import Vector2 from './Vector2.js';

/**
 * Axis-Aligned Bounding Box for collision detection
 */
export default class AABB {
  /**
   * @param {Vector2} center 
   * @param {Vector2} size - Half-extents (width/2, height/2)
   */
  constructor(center = new Vector2(), size = new Vector2()) {
    this.center = center;
    this.size = size; // Half-size
  }

  get left() { return this.center.x - this.size.x; }
  get right() { return this.center.x + this.size.x; }
  get top() { return this.center.y - this.size.y; }
  get bottom() { return this.center.y + this.size.y; }

  /**
   * Check collision with another AABB
   * @param {AABB} other 
   * @returns {boolean}
   */
  collidesWith(other) {
    return (
      this.left < other.right &&
      this.right > other.left &&
      this.top < other.bottom &&
      this.bottom > other.top
    );
  }

  /**
   * Get minimum translation vector to resolve collision
   * @param {AABB} other 
   * @returns {Vector2|null} - Null if no collision
   */
  getCollisionVector(other) {
    if (!this.collidesWith(other)) return null;

    const overlapX = Math.min(this.right - other.left, other.right - this.left);
    const overlapY = Math.min(this.bottom - other.top, other.bottom - this.top);

    // Resolve along smallest axis
    if (overlapX < overlapY) {
      return new Vector2(
        this.center.x < other.center.x ? -overlapX : overlapX,
        0
      );
    } else {
      return new Vector2(
        0,
        this.center.y < other.center.y ? -overlapY : overlapY
      );
    }
  }

  /**
   * Move AABB and resolve collisions
   * @param {Vector2} velocity 
   * @param {AABB} other 
   * @returns {Vector2} - Adjusted position
   */
  resolveCollision(velocity, other) {
    const collisionVector = this.getCollisionVector(other);
    if (!collisionVector) return this.center;

    // Prevent tunneling: move back along velocity direction
    const resolve = collisionVector;
    return this.center.add(resolve);
  }
}
import Component from '../core/Component.js';
import Vector2 from '../utils/Vector2.js';

/**
 * Position, rotation, and scale component
 */
export default class Transform extends Component {
  constructor(x = 0, y = 0, rotation = 0, scaleX = 1, scaleY = 1) {
    super();
    this.position = new Vector2(x, y);
    this.rotation = rotation; // Radians
    this.scale = { x: scaleX, y: scaleY };
  }

  // Helper methods
  setLocalPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  translate(dx, dy) {
    this.position.x += dx;
    this.position.y += dy;
  }

  rotate(angle) {
    this.rotation += angle;
  }
}
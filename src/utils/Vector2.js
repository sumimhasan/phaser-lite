/**
 * 2D Vector class with common math operations
 */
export default class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  static zero() { return new Vector2(0, 0); }
  static one() { return new Vector2(1, 1); }

  clone() {
    return new Vector2(this.x, this.y);
  }

  add(v) {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  subtract(v) {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  multiply(scalar) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  divide(scalar) {
    if (scalar === 0) throw new Error('Division by zero');
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const len = this.length();
    if (len === 0) return Vector2.zero();
    return this.divide(len);
  }

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  distanceTo(v) {
    return this.subtract(v).length();
  }

  equals(v, tolerance = 1e-6) {
    return Math.abs(this.x - v.x) < tolerance && Math.abs(this.y - v.y) < tolerance;
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
}
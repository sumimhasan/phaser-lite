import System from '../core/System.js';

/**
 * Handles keyboard, mouse, and touch input
 */
export default class InputSystem extends System {
  constructor(engine) {
    super(engine);
    
    // Input state
    this.keys = {};
    this.mouse = { x: 0, y: 0, buttons: {} };
    this.touches = new Map(); // id -> {x, y}
    
    // Bind event handlers
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    
    // Setup event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    const container = document.getElementById('game-container');
    
    // Keyboard
    window.addEventListener('keydown', this.handleKeyDown, { passive: false });
    window.addEventListener('keyup', this.handleKeyUp, { passive: false });
    
    // Mouse
    container.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    container.addEventListener('mousedown', this.handleMouseDown, { passive: true });
    container.addEventListener('mouseup', this.handleMouseUp, { passive: true });
    
    // Touch
    container.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    container.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    container.addEventListener('touchend', this.handleTouchEnd, { passive: true });
    container.addEventListener('touchcancel', this.handleTouchEnd, { passive: true });
    
    // Prevent context menu
    container.addEventListener('contextmenu', e => e.preventDefault());
  }

  // --- Keyboard Handlers ---
  handleKeyDown(e) {
    this.keys[e.code] = true;
    e.preventDefault(); // Critical for games!
  }

  handleKeyUp(e) {
    this.keys[e.code] = false;
    e.preventDefault();
  }

  // --- Mouse Handlers ---
  handleMouseMove(e) {
    const rect = e.target.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }

  handleMouseDown(e) {
    this.mouse.buttons[e.button] = true;
    e.preventDefault();
  }

  handleMouseUp(e) {
    this.mouse.buttons[e.button] = false;
    e.preventDefault();
  }

  // --- Touch Handlers ---
  handleTouchStart(e) {
    e.preventDefault();
    for (const touch of e.changedTouches) {
      this.touches.set(touch.identifier, {
        x: touch.clientX,
        y: touch.clientY
      });
    }
  }

  handleTouchMove(e) {
    e.preventDefault();
    for (const touch of e.changedTouches) {
      if (this.touches.has(touch.identifier)) {
        this.touches.get(touch.identifier).x = touch.clientX;
        this.touches.get(touch.identifier).y = touch.clientY;
      }
    }
  }

  handleTouchEnd(e) {
    for (const touch of e.changedTouches) {
      this.touches.delete(touch.identifier);
    }
  }

  // --- Public API ---
  isKeyDown(keyCode) {
    return !!this.keys[keyCode];
  }

  isKeyPressed(keyCode) {
    // Note: This requires tracking previous state for true "pressed" detection
    // For simplicity, we'll use isKeyDown for MVP
    return this.isKeyDown(keyCode);
  }

  getMousePosition() {
    return { x: this.mouse.x, y: this.mouse.y };
  }

  isMouseButtonDown(button = 0) {
    return !!this.mouse.buttons[button];
  }

  getTouch(id) {
    return this.touches.get(id) || null;
  }

  getActiveTouches() {
    return Array.from(this.touches.values());
  }

  destroy() {
    // Clean up event listeners
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    // ... (other removals would go here in production)
  }
}
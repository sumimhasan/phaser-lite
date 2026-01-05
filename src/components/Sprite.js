import Component from '../core/Component.js';
import AssetLoader from '../utils/AssetLoader.js';

/**
 * Visual representation using DOM element
 */
export default class Sprite extends Component {
  /**
   * @param {string} assetKey - Key from AssetLoader
   * @param {number} width 
   * @param {number} height 
   */
  constructor(assetKey, width = 32, height = 32) {
    super();
    this.assetKey = assetKey;
    this.width = width;
    this.height = height;
    this.element = null; // Created during init
    this.visible = true;
  }

  init() {
    // Create DOM element
    this.element = document.createElement('div');
    this.element.style.position = 'absolute';
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.backgroundSize = 'contain';
    this.element.style.backgroundRepeat = 'no-repeat';
    this.element.style.backgroundPosition = 'center';
    
    // Add to game container
    const container = document.getElementById('game-container');
    if (container) {
      container.appendChild(this.element);
    }
    
    // Load asset if available
    const loader = this.entity.scene?.engine?.assetLoader;
    if (loader && loader.get(this.assetKey)) {
      this.applyAsset(loader.get(this.assetKey));
    }
  }

  applyAsset(asset) {
    if (asset instanceof HTMLImageElement) {
      this.element.style.backgroundImage = `url(${asset.src})`;
    }
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
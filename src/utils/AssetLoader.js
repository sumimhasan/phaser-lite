/**
 * Preload images and audio assets
 */
export default class AssetLoader {
  constructor() {
    this.assets = new Map(); // key -> loaded asset
    this.loadingPromises = new Map(); // key -> Promise
  }

  /**
   * Load image asset
   * @param {string} key 
   * @param {string} src 
   * @returns {Promise<HTMLImageElement>}
   */
  loadImage(key, src) {
    if (this.assets.has(key)) {
      return Promise.resolve(this.assets.get(key));
    }

    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key);
    }

    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.assets.set(key, img);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });

    this.loadingPromises.set(key, promise);
    return promise;
  }

  /**
   * Load audio asset
   * @param {string} key 
   * @param {string} src 
   * @returns {Promise<AudioBuffer>}
   */
  loadAudio(key, src) {
    if (this.assets.has(key)) {
      return Promise.resolve(this.assets.get(key));
    }

    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key);
    }

    const context = new (window.AudioContext || window.webkitAudioContext)();
    const promise = fetch(src)
      .then(response => response.arrayBuffer())
      .then(buffer => context.decodeAudioData(buffer))
      .then(audioBuffer => {
        this.assets.set(key, audioBuffer);
        return audioBuffer;
      });

    this.loadingPromises.set(key, promise);
    return promise;
  }

  /**
   * Load multiple assets
   * @param {Array} assets - [{type, key, src}]
   * @returns {Promise}
   */
  load(assets) {
    const promises = assets.map(asset => {
      switch (asset.type) {
        case 'image': return this.loadImage(asset.key, asset.src);
        case 'audio': return this.loadAudio(asset.key, asset.src);
        default: throw new Error(`Unknown asset type: ${asset.type}`);
      }
    });
    return Promise.all(promises);
  }

  /**
   * Get loaded asset
   * @param {string} key 
   * @returns {any}
   */
  get(key) {
    return this.assets.get(key);
  }
}
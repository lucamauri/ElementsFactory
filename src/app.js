/**
 * Main Application Logic for ElementsFactory
 * Orchestrates data loading, rendering, and user interactions
 */

class PeriodicTableApp {
  constructor() {
    this.elements = null;
    this.config = null;
    this.currentTheme = 'light';
    this.currentLayout = 'normal';
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log('ElementsFactory: initializing...');
      await this.loadData();
      this.setupEventListeners();
      this.render();
      console.log('ElementsFactory: ready.');
    } catch (error) {
      console.error('ElementsFactory initialization error:', error);
      this.showError(error.message || 'Initialization failed');
    }
  }

  /**
   * Load configuration and element data
   */
  async loadData() {
    console.log('ElementsFactory: loading config and elements...');
    this.config = await parser.loadConfig();
    this.elements = await parser.loadElements();
    console.log(`ElementsFactory: loaded ${this.elements.length} elements.`);
  }

  /**
   * Wire up UI event listeners
   */
  setupEventListeners() {
    const themeSelect = document.getElementById('theme-select');
    const sizeSelect = document.getElementById('size-select');
    const exportBtn = document.getElementById('export-svg');

    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => {
        this.currentTheme = e.target.value;
        this.render();
      });
    }

    if (sizeSelect) {
      sizeSelect.addEventListener('change', (e) => {
        this.currentLayout = e.target.value;
        this.render();
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportSVG();
      });
    }

    this.setupElementInteractivity();
  }

  /**
   * Optional per-element interaction (currently logs to console)
   */
  setupElementInteractivity() {
    document.addEventListener('click', (e) => {
      const elementGroup = e.target.closest('.element');
      if (!elementGroup) return;

      const number = elementGroup.getAttribute('data-number');
      const symbol = elementGroup.getAttribute('data-symbol');
      const name = elementGroup.getAttribute('data-name');
      const category = elementGroup.getAttribute('data-category');

      console.log(
        `ElementsFactory: clicked element #${number} ${symbol} (${name}), category: ${category}`
      );

      // Hook for future: show tooltip/modal/etc.
      // this.showElementDetails({ number, symbol, name, category });
    });
  }

  /**
   * Render the periodic table into the container
   */
  render() {
    if (!this.elements || !this.config) {
      this.showError('No data loaded');
      return;
    }

    console.log(
      `ElementsFactory: rendering theme="${this.currentTheme}", layout="${this.currentLayout}"`
    );

    const svg = renderer.generate(
      this.elements,
      this.config,
      this.currentTheme,
      this.currentLayout
    );

    const container = document.getElementById('table-container');
    if (!container) {
      console.error('ElementsFactory: #table-container not found');
      return;
    }

    container.innerHTML = svg;
  }

  /**
   * Export current SVG to file
   */
  exportSVG() {
    const filename = `elementsfactory-${this.currentTheme}-${this.currentLayout}.svg`;
    renderer.downloadSVG(filename);
    console.log(`ElementsFactory: exported ${filename}`);
  }

  /**
   * Show an error message inside the table container
   * @param {string} message
   */
  showError(message) {
    const container = document.getElementById('table-container');
    if (!container) return;

    container.innerHTML = `
      <div class="error-message">
        <strong>Error:</strong> ${message}
      </div>
    `;
  }

  /**
   * Convenience helper: get element info by atomic number
   * @param {number} atomicNumber
   * @returns {Object|null}
   */
  getElementInfo(atomicNumber) {
    return parser.getElement(atomicNumber);
  }

  /**
   * Convenience helper: get all elements in a category
   * @param {string} category
   * @returns {Array}
   */
  getElementsByCategory(category) {
    return parser.getElementsByCategory(category);
  }
}

// Singleton app instance
const app = new PeriodicTableApp();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

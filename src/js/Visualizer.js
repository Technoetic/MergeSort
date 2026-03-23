import { COLORS } from '../utils/constants.js';

export class Visualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.bars = [];
    this.barElements = [];
    this.maxValue = 100;
  }

  /**
   * Render array as horizontal bars
   * @param {number[]} array - values to display
   * @param {Object} step - current step info (optional)
   */
  render(array, step = null) {
    // Clear existing bars
    this.container.innerHTML = '';
    this.barElements = [];
    this.bars = array;

    if (!array || array.length === 0) return;

    const maxVal = Math.max(...array);
    const containerHeight = this.container.clientHeight || 300;
    const containerWidth = this.container.clientWidth || 600;

    // Calculate bar dimensions
    const barWidth = Math.max(
      4,
      Math.floor((containerWidth - array.length * 2) / array.length)
    );
    const gap = 2;

    array.forEach((value, index) => {
      const bar = document.createElement('div');
      bar.className = 'bar';

      // Set dimensions
      bar.style.width = `${barWidth}px`;
      bar.style.height = `${(value / maxVal) * (containerHeight - 20)}px`;
      bar.style.marginRight = `${gap}px`;
      bar.style.marginBottom = '10px';

      // Store metadata
      bar.dataset.value = value;
      bar.dataset.index = index;

      // Add value label
      const label = document.createElement('span');
      label.className = 'bar__label';
      label.textContent = value;
      bar.appendChild(label);

      // Apply initial color state
      if (step) {
        this._applyBarState(bar, index, step);
      } else {
        bar.classList.add(`bar--${COLORS.UNSORTED}`);
      }

      this.container.appendChild(bar);
      this.barElements.push(bar);
    });
  }

  /**
   * Apply color state to a bar based on step info
   * @private
   */
  _applyBarState(bar, index, step) {
    // Clear existing state classes
    this._clearBarClasses(bar);

    // Determine state based on step data
    if (step.sortedIndices && step.sortedIndices.includes(index)) {
      bar.classList.add(`bar--${COLORS.SORTED}`);
    } else if (step.activeIndices && step.activeIndices.includes(index)) {
      // Color based on action type
      const actionColor = this._getActionColor(step.action);
      bar.classList.add(`bar--${actionColor}`);
    } else if (step.indices && step.indices.mergeStart !== undefined) {
      // Within merge range
      if (
        index >= step.indices.mergeStart &&
        index <= step.indices.mergeEnd
      ) {
        bar.classList.add(`bar--${COLORS.MERGING}`);
      } else {
        bar.classList.add(`bar--${COLORS.UNSORTED}`);
      }
    } else {
      bar.classList.add(`bar--${COLORS.UNSORTED}`);
    }
  }

  /**
   * Get color for action type
   * @private
   */
  _getActionColor(action) {
    switch (action) {
      case 'compare':
        return COLORS.COMPARING;
      case 'merge':
      case 'place':
        return COLORS.MERGING;
      case 'divide':
        return COLORS.DIVIDING;
      default:
        return COLORS.UNSORTED;
    }
  }

  /**
   * Clear all color classes from bar
   * @private
   */
  _clearBarClasses(bar) {
    Object.values(COLORS).forEach((color) => {
      bar.classList.remove(`bar--${color}`);
    });
  }

  /**
   * Update visualization with new step
   * @param {Object} step - new step data
   */
  updateStep(step) {
    if (!step || !step.array) return;
    this.render(step.array, step);
  }

  /**
   * Highlight specific bars with color
   * @param {number[]} indices - bar indices to highlight
   * @param {string} colorState - color class name
   */
  highlightBars(indices, colorState) {
    if (!indices || !Array.isArray(indices)) return;

    indices.forEach((idx) => {
      if (this.barElements[idx]) {
        this._clearBarClasses(this.barElements[idx]);
        this.barElements[idx].classList.add(`bar--${colorState}`);
      }
    });
  }

  /**
   * Clear all highlights and reset to unsorted color
   */
  clearHighlights() {
    this.barElements.forEach((bar) => {
      this._clearBarClasses(bar);
      bar.classList.add(`bar--${COLORS.UNSORTED}`);
    });
  }

  /**
   * Get current number of bars
   * @returns {number}
   */
  getBarCount() {
    return this.barElements.length;
  }

  /**
   * Animate bars smoothly from one state to another
   * @param {number[]} fromArray - starting values
   * @param {number[]} toArray - ending values
   * @param {number} duration - animation duration in ms
   * @returns {Promise}
   */
  async animateBars(fromArray, toArray, duration = 300) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const startFrame = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Interpolate bar heights
        fromArray.forEach((_, index) => {
          if (this.barElements[index]) {
            const fromVal = fromArray[index];
            const toVal = toArray[index];
            const currentVal = fromVal + (toVal - fromVal) * progress;

            const maxVal = Math.max(...toArray);
            const containerHeight = this.container.clientHeight || 300;
            const newHeight = (currentVal / maxVal) * (containerHeight - 20);

            this.barElements[index].style.height = `${newHeight}px`;
          }
        });

        if (progress < 1) {
          requestAnimationFrame(startFrame);
        } else {
          // Ensure final state is exact
          this.render(toArray);
          resolve();
        }
      };

      requestAnimationFrame(startFrame);
    });
  }

  /**
   * Get bar element by index
   * @param {number} index
   * @returns {HTMLElement|null}
   */
  getBarElement(index) {
    return this.barElements[index] || null;
  }

  /**
   * Resize container and re-render
   */
  resize() {
    if (this.bars && this.bars.length > 0) {
      this.render(this.bars);
    }
  }
}

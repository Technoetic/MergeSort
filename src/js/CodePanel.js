import { PSEUDOCODE } from '../utils/constants.js';

export class CodePanel {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.lines = [];
    this.activeLineIndex = -1;
    this.init();
  }

  init() {
    if (!this.container) return;
    
    this.container.innerHTML = '';
    
    PSEUDOCODE.forEach((line, index) => {
      const lineEl = document.createElement('div');
      lineEl.className = 'code-panel__line';
      lineEl.dataset.lineIndex = index;
      
      const lineNumber = document.createElement('span');
      lineNumber.className = 'code-panel__line-number';
      lineNumber.textContent = (index + 1).toString().padStart(2, ' ');
      
      const lineContent = document.createElement('span');
      lineContent.className = 'code-panel__line-content';
      lineContent.textContent = line;
      
      lineEl.appendChild(lineNumber);
      lineEl.appendChild(lineContent);
      
      this.container.appendChild(lineEl);
      this.lines.push(lineEl);
    });
  }

  highlightLine(lineIndex) {
    // Remove previous highlight
    if (this.activeLineIndex >= 0 && this.lines[this.activeLineIndex]) {
      this.lines[this.activeLineIndex].classList.remove('code-panel__line--active');
    }
    
    // Add new highlight
    if (lineIndex >= 0 && lineIndex < this.lines.length) {
      this.lines[lineIndex].classList.add('code-panel__line--active');
      this.activeLineIndex = lineIndex;
      
      // Scroll into view
      this.lines[lineIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }

  clearHighlight() {
    this.lines.forEach(line => {
      line.classList.remove('code-panel__line--active');
    });
    this.activeLineIndex = -1;
  }

  syncWithStep(step) {
    if (!step) {
      this.clearHighlight();
      return;
    }
    
    if (step.codeLineIndex !== undefined && step.codeLineIndex >= 0) {
      // Convert 1-based line number to 0-based index
      this.highlightLine(step.codeLineIndex);
    }
  }

  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.lines = [];
    this.activeLineIndex = -1;
  }
}

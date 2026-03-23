import { MergeSort } from './MergeSort.js';
import { Visualizer } from './Visualizer.js';
import { AnimationManager } from './AnimationManager.js';
import { CodePanel } from './CodePanel.js';
import { SIZE, SPEED } from '../utils/constants.js';

class App {
  constructor() {
    this.mergeSort = new MergeSort();
    this.visualizer = null;
    this.animationManager = new AnimationManager();
    this.codePanel = null;
    this.arraySize = SIZE.DEFAULT;
    this.currentArray = [];
    this.isDarkMode = true;
    this.elements = {};
  }

  init() {
    this.visualizer = new Visualizer('canvas-container');
    this.codePanel = new CodePanel('pseudocode');
    this.cacheElements();
    this.bindEvents();
    this.initTheme();
    this.generateArray();
  }

  cacheElements() {
    this.elements = {
      generateBtn: document.getElementById('generate-btn'),
      playBtn: document.getElementById('btn-play'),
      prevBtn: document.getElementById('btn-prev'),
      nextBtn: document.getElementById('btn-next'),
      resetBtn: document.getElementById('btn-reset'),
      sizeSlider: document.getElementById('array-size'),
      sizeValue: document.getElementById('size-value'),
      speedSlider: document.getElementById('speed-slider'),
      themeBtn: document.getElementById('theme-btn'),
      stepCount: document.getElementById('step-count'),
      stepDescription: document.getElementById('step-description'),
      stepCountBar: document.getElementById('step-count-bar'),
      comparisonCount: document.getElementById('comparison-count'),
      moveCount: document.getElementById('move-count'),
      progressBar: document.getElementById('progress-bar'),
    };
  }

  bindEvents() {
    this.elements.generateBtn?.addEventListener('click', () => this.generateArray());
    this.elements.playBtn?.addEventListener('click', () => this.animationManager.togglePlay());
    this.elements.prevBtn?.addEventListener('click', () => this.animationManager.prevStep());
    this.elements.nextBtn?.addEventListener('click', () => this.animationManager.nextStep());
    this.elements.resetBtn?.addEventListener('click', () => this.reset());

    this.elements.sizeSlider?.addEventListener('input', (e) => {
      this.arraySize = parseInt(e.target.value, 10);
      if (this.elements.sizeValue) {
        this.elements.sizeValue.textContent = this.arraySize;
      }
      this.generateArray();
    });

    this.elements.speedSlider?.addEventListener('input', (e) => {
      this.animationManager.setSpeed(parseInt(e.target.value, 10));
    });

    this.elements.themeBtn?.addEventListener('click', () => this.toggleTheme());

    this.animationManager.onStepChange = (stepIndex) => this.onStepChange(stepIndex);
    this.animationManager.onPlayStateChange = (isPlaying) => this.onPlayStateChange(isPlaying);
    this.animationManager.onComplete = () => this.onComplete();

    window.addEventListener('resize', () => {
      const step = this.animationManager.getCurrentStep();
      if (step) {
        this.visualizer.updateStep(step);
      } else if (this.currentArray.length > 0) {
        this.visualizer.render(this.currentArray);
      }
    });
  }

  generateArray() {
    this.currentArray = Array.from(
      { length: this.arraySize },
      () => Math.floor(Math.random() * 96) + 5
    );

    const steps = this.mergeSort.generateSteps(this.currentArray);
    this.animationManager.setSteps(steps);

    this.visualizer.render(this.currentArray);
    this.codePanel.clearHighlight();
    this.updateInfo(null, 0);
  }

  reset() {
    this.animationManager.stop();
    this.visualizer.render(this.currentArray);
    this.codePanel.clearHighlight();
    this.updateInfo(null, 0);
  }

  onStepChange(stepIndex) {
    const step = this.animationManager.getCurrentStep();
    if (!step) return;

    this.visualizer.updateStep(step);
    this.codePanel.syncWithStep(step);
    this.updateInfo(step, stepIndex);
  }

  onPlayStateChange(isPlaying) {
    if (this.elements.playBtn) {
      this.elements.playBtn.textContent = isPlaying ? '⏸' : '▶';
      this.elements.playBtn.title = isPlaying ? '일시정지' : '재생';
    }
  }

  onComplete() {
    // Animation sequence completed
  }

  updateInfo(step, stepIndex) {
    const totalSteps = this.animationManager.steps.length;

    if (this.elements.stepCount) {
      this.elements.stepCount.textContent = `${stepIndex + 1} / ${totalSteps || 1}`;
    }

    if (this.elements.stepDescription) {
      this.elements.stepDescription.textContent = step?.description || '배열을 생성하고 시작하세요';
    }

    if (this.elements.stepCountBar) {
      this.elements.stepCountBar.textContent = `${stepIndex + 1} / ${totalSteps || 1}`;
    }

    if (this.elements.comparisonCount) {
      this.elements.comparisonCount.textContent = step?.comparisons || 0;
    }

    if (this.elements.moveCount) {
      this.elements.moveCount.textContent = step?.moves || 0;
    }

    if (this.elements.progressBar) {
      if (totalSteps > 1) {
        this.elements.progressBar.value = (stepIndex / (totalSteps - 1)) * 100;
      } else {
        this.elements.progressBar.value = 0;
      }
    }
  }

  initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
      this.isDarkMode = saved === 'dark';
    } else {
      this.isDarkMode = true;
    }
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
    if (this.elements.themeBtn) {
      this.elements.themeBtn.textContent = this.isDarkMode ? '☀️' : '🌙';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});

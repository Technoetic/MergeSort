import { SPEED } from '../utils/constants.js';

export class AnimationManager {
  constructor() {
    this.isPlaying = false;
    this.currentStepIndex = 0;
    this.steps = [];
    this.speed = SPEED.DEFAULT;
    this.timerId = null;
    this.onStepChange = null; // callback(stepIndex)
    this.onPlayStateChange = null; // callback(isPlaying)
    this.onComplete = null; // callback()
  }

  setSteps(steps) {
    this.steps = steps;
    this.currentStepIndex = 0;
    this.stop();
  }

  setSpeed(speed) {
    this.speed = Math.max(SPEED.MIN, Math.min(SPEED.MAX, speed));
    // If playing, restart with new speed
    if (this.isPlaying) {
      this.pause();
      this.play();
    }
  }

  getDelay() {
    return SPEED.BASE_DELAY / this.speed;
  }

  play() {
    if (this.steps.length === 0) return;
    if (this.currentStepIndex >= this.steps.length - 1) {
      this.currentStepIndex = 0;
    }
    this.isPlaying = true;
    this.notifyPlayState();
    this.scheduleNextStep();
  }

  pause() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.notifyPlayState();
  }

  stop() {
    this.pause();
    this.currentStepIndex = 0;
    this.notifyStep();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  nextStep() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.notifyStep();
      return true;
    }
    return false;
  }

  prevStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.notifyStep();
      return true;
    }
    return false;
  }

  goToStep(index) {
    if (index >= 0 && index < this.steps.length) {
      this.currentStepIndex = index;
      this.notifyStep();
    }
  }

  scheduleNextStep() {
    if (!this.isPlaying) return;
    
    this.timerId = setTimeout(() => {
      if (this.nextStep()) {
        this.scheduleNextStep();
      } else {
        this.isPlaying = false;
        this.notifyPlayState();
        if (this.onComplete) this.onComplete();
      }
    }, this.getDelay());
  }

  getCurrentStep() {
    return this.steps[this.currentStepIndex] || null;
  }

  getProgress() {
    if (this.steps.length === 0) return 0;
    return this.currentStepIndex / (this.steps.length - 1);
  }

  notifyStep() {
    if (this.onStepChange) {
      this.onStepChange(this.currentStepIndex);
    }
  }

  notifyPlayState() {
    if (this.onPlayStateChange) {
      this.onPlayStateChange(this.isPlaying);
    }
  }

  destroy() {
    this.pause();
    this.steps = [];
    this.onStepChange = null;
    this.onPlayStateChange = null;
    this.onComplete = null;
  }
}

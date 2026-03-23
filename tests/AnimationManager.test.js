import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AnimationManager } from '../src/js/AnimationManager.js';
import { SPEED } from '../src/utils/constants.js';

describe('AnimationManager', () => {
  let manager;

  beforeEach(() => {
    manager = new AnimationManager();
  });

  describe('Constructor', () => {
    it('should initialize with correct defaults', () => {
      expect(manager.isPlaying).toBe(false);
      expect(manager.currentStepIndex).toBe(0);
      expect(manager.steps).toEqual([]);
      expect(manager.speed).toBe(SPEED.DEFAULT);
    });
  });

  describe('Speed', () => {
    it('should have correct default speed', () => {
      expect(manager.speed).toBe(SPEED.DEFAULT);
    });

    it('should clamp speed to min', () => {
      manager.setSpeed(0);
      expect(manager.speed).toBe(SPEED.MIN);
    });

    it('should clamp speed to max', () => {
      manager.setSpeed(20);
      expect(manager.speed).toBe(SPEED.MAX);
    });

    it('should set speed within range', () => {
      manager.setSpeed(7);
      expect(manager.speed).toBe(7);
    });
  });

  describe('Play/Pause/Stop', () => {
    beforeEach(() => {
      const mockSteps = [
        { array: [1, 2, 3] },
        { array: [1, 2, 3] },
        { array: [1, 2, 3] }
      ];
      manager.setSteps(mockSteps);
    });

    it('should start playing', () => {
      manager.play();
      expect(manager.isPlaying).toBe(true);
    });

    it('should pause playback', () => {
      manager.play();
      manager.pause();
      expect(manager.isPlaying).toBe(false);
    });

    it('should stop and reset to beginning', () => {
      manager.currentStepIndex = 2;
      manager.stop();
      expect(manager.isPlaying).toBe(false);
      expect(manager.currentStepIndex).toBe(0);
    });

    it('should toggle play state', () => {
      expect(manager.isPlaying).toBe(false);
      manager.togglePlay();
      expect(manager.isPlaying).toBe(true);
      manager.togglePlay();
      expect(manager.isPlaying).toBe(false);
    });
  });

  describe('Step Navigation', () => {
    beforeEach(() => {
      const mockSteps = Array.from({ length: 5 }, () => ({ array: [1, 2, 3] }));
      manager.setSteps(mockSteps);
    });

    it('should move to next step', () => {
      expect(manager.currentStepIndex).toBe(0);
      const result = manager.nextStep();
      expect(result).toBe(true);
      expect(manager.currentStepIndex).toBe(1);
    });

    it('should move to previous step', () => {
      manager.currentStepIndex = 2;
      const result = manager.prevStep();
      expect(result).toBe(true);
      expect(manager.currentStepIndex).toBe(1);
    });

    it('should not go before first step', () => {
      const result = manager.prevStep();
      expect(result).toBe(false);
      expect(manager.currentStepIndex).toBe(0);
    });

    it('should not go past last step', () => {
      manager.currentStepIndex = 4;
      const result = manager.nextStep();
      expect(result).toBe(false);
      expect(manager.currentStepIndex).toBe(4);
    });

    it('should go to specific step', () => {
      manager.goToStep(3);
      expect(manager.currentStepIndex).toBe(3);
    });

    it('should not go to invalid step', () => {
      manager.goToStep(10);
      expect(manager.currentStepIndex).toBe(0);
    });
  });

  describe('Progress', () => {
    beforeEach(() => {
      const mockSteps = Array.from({ length: 5 }, () => ({ array: [1, 2, 3] }));
      manager.setSteps(mockSteps);
    });

    it('should return 0 progress at start', () => {
      expect(manager.getProgress()).toBe(0);
    });

    it('should return correct progress', () => {
      manager.currentStepIndex = 2;
      expect(manager.getProgress()).toBe(0.5);
    });

    it('should return 1 at end', () => {
      manager.currentStepIndex = 4;
      expect(manager.getProgress()).toBe(1);
    });

    it('should return 0 for empty steps', () => {
      manager.setSteps([]);
      expect(manager.getProgress()).toBe(0);
    });
  });

  describe('Callbacks', () => {
    beforeEach(() => {
      const mockSteps = Array.from({ length: 3 }, () => ({ array: [1, 2, 3] }));
      manager.setSteps(mockSteps);
    });

    it('should call onStepChange callback', () => {
      const callback = vi.fn();
      manager.onStepChange = callback;
      manager.nextStep();
      expect(callback).toHaveBeenCalledWith(1);
    });

    it('should call onPlayStateChange callback', () => {
      const callback = vi.fn();
      manager.onPlayStateChange = callback;
      manager.play();
      expect(callback).toHaveBeenCalledWith(true);
    });
  });

  describe('getCurrentStep', () => {
    it('should return null for empty steps', () => {
      const step = manager.getCurrentStep();
      expect(step).toBeNull();
    });

    it('should return current step', () => {
      const mockStep = { array: [1, 2, 3] };
      manager.setSteps([mockStep]);
      expect(manager.getCurrentStep()).toBe(mockStep);
    });
  });

  describe('destroy', () => {
    it('should clean up resources', () => {
      manager.play();
      manager.onStepChange = () => {};
      manager.destroy();
      expect(manager.isPlaying).toBe(false);
      expect(manager.steps).toEqual([]);
      expect(manager.onStepChange).toBeNull();
    });
  });
});

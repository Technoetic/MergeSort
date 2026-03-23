import { describe, it, expect, beforeEach } from 'vitest';
import { MergeSort } from '../src/js/MergeSort.js';
import { ACTIONS } from '../src/utils/constants.js';

describe('MergeSort', () => {
  let mergeSort;

  beforeEach(() => {
    mergeSort = new MergeSort();
  });

  describe('Constructor', () => {
    it('should create instance with empty steps', () => {
      expect(mergeSort.steps).toEqual([]);
      expect(mergeSort.comparisons).toBe(0);
      expect(mergeSort.moves).toBe(0);
    });
  });

  describe('generateSteps', () => {
    it('should generate steps', () => {
      const array = [4, 2, 8, 1];
      const steps = mergeSort.generateSteps(array);
      expect(steps.length).toBeGreaterThan(0);
    });
  });

  describe('Step Structure', () => {
    beforeEach(() => {
      mergeSort.generateSteps([4, 2, 8, 1]);
    });

    it('should have required properties', () => {
      const step = mergeSort.steps[0];
      expect(step).toHaveProperty('array');
      expect(step).toHaveProperty('action');
      expect(step).toHaveProperty('indices');
    });
  });
});

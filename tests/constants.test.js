import { describe, it, expect } from 'vitest';
import { COLORS, ACTIONS, SPEED, SIZE, PSEUDOCODE } from '../src/utils/constants.js';

describe('Constants', () => {
  describe('COLORS', () => {
    it('should have all required color states', () => {
      expect(COLORS).toHaveProperty('UNSORTED');
      expect(COLORS).toHaveProperty('COMPARING');
      expect(COLORS).toHaveProperty('MERGING');
      expect(COLORS).toHaveProperty('SORTED');
      expect(COLORS).toHaveProperty('DIVIDING');
    });

    it('should have string values', () => {
      Object.values(COLORS).forEach(value => {
        expect(typeof value).toBe('string');
      });
    });
  });

  describe('ACTIONS', () => {
    it('should have all required actions', () => {
      expect(ACTIONS).toHaveProperty('DIVIDE');
      expect(ACTIONS).toHaveProperty('COMPARE');
      expect(ACTIONS).toHaveProperty('MERGE');
      expect(ACTIONS).toHaveProperty('PLACE');
      expect(ACTIONS).toHaveProperty('COMPLETE');
    });

    it('should have string values', () => {
      Object.values(ACTIONS).forEach(value => {
        expect(typeof value).toBe('string');
      });
    });
  });

  describe('SPEED', () => {
    it('should have min and max values', () => {
      expect(SPEED).toHaveProperty('MIN');
      expect(SPEED).toHaveProperty('MAX');
      expect(SPEED).toHaveProperty('DEFAULT');
      expect(SPEED).toHaveProperty('BASE_DELAY');
    });

    it('should have MIN less than MAX', () => {
      expect(SPEED.MIN).toBeLessThan(SPEED.MAX);
    });

    it('should have DEFAULT between MIN and MAX', () => {
      expect(SPEED.DEFAULT).toBeGreaterThanOrEqual(SPEED.MIN);
      expect(SPEED.DEFAULT).toBeLessThanOrEqual(SPEED.MAX);
    });

    it('should have positive BASE_DELAY', () => {
      expect(SPEED.BASE_DELAY).toBeGreaterThan(0);
    });

    it('should have correct min value', () => {
      expect(SPEED.MIN).toBe(1);
    });

    it('should have correct max value', () => {
      expect(SPEED.MAX).toBe(10);
    });

    it('should have correct default value', () => {
      expect(SPEED.DEFAULT).toBe(5);
    });

    it('should have correct base delay', () => {
      expect(SPEED.BASE_DELAY).toBe(600);
    });
  });

  describe('SIZE', () => {
    it('should have min and max values', () => {
      expect(SIZE).toHaveProperty('MIN');
      expect(SIZE).toHaveProperty('MAX');
      expect(SIZE).toHaveProperty('DEFAULT');
    });

    it('should have MIN less than MAX', () => {
      expect(SIZE.MIN).toBeLessThan(SIZE.MAX);
    });

    it('should have DEFAULT between MIN and MAX', () => {
      expect(SIZE.DEFAULT).toBeGreaterThanOrEqual(SIZE.MIN);
      expect(SIZE.DEFAULT).toBeLessThanOrEqual(SIZE.MAX);
    });

    it('should have correct min value', () => {
      expect(SIZE.MIN).toBe(4);
    });

    it('should have correct max value', () => {
      expect(SIZE.MAX).toBe(32);
    });

    it('should have correct default value', () => {
      expect(SIZE.DEFAULT).toBe(8);
    });
  });

  describe('PSEUDOCODE', () => {
    it('should be an array', () => {
      expect(Array.isArray(PSEUDOCODE)).toBe(true);
    });

    it('should have multiple lines', () => {
      expect(PSEUDOCODE.length).toBeGreaterThan(0);
    });

    it('should all be strings', () => {
      PSEUDOCODE.forEach(line => {
        expect(typeof line).toBe('string');
      });
    });

    it('should contain merge sort function definition', () => {
      const hasDefinition = PSEUDOCODE.some(line => line.includes('mergeSort'));
      expect(hasDefinition).toBe(true);
    });

    it('should contain merge function definition', () => {
      const hasMerge = PSEUDOCODE.some(line => line.includes('merge'));
      expect(hasMerge).toBe(true);
    });
  });
});

import { ACTIONS, COLORS } from '../utils/constants.js';

export class MergeSort {
  constructor() {
    this.steps = [];
    this.comparisons = 0;
    this.moves = 0;
  }

  reset() {
    this.steps = [];
    this.comparisons = 0;
    this.moves = 0;
  }

  generateSteps(array) {
    this.reset();
    const arr = [...array];
    const n = arr.length;
    
    // Record initial state
    this.addStep({
      array: [...arr],
      action: ACTIONS.DIVIDE,
      indices: { left: 0, right: n - 1 },
      activeIndices: [],
      sortedIndices: [],
      codeLineIndex: 0,
      description: '병합정렬을 시작합니다',
    });

    this.mergeSortRecursive(arr, 0, n - 1);
    
    // Record final state
    this.addStep({
      array: [...arr],
      action: ACTIONS.COMPLETE,
      indices: { left: 0, right: n - 1 },
      activeIndices: [],
      sortedIndices: Array.from({ length: n }, (_, i) => i),
      codeLineIndex: 0,
      description: '정렬이 완료되었습니다!',
    });

    return this.steps;
  }

  mergeSortRecursive(arr, left, right) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    // Record divide step
    this.addStep({
      array: [...arr],
      action: ACTIONS.DIVIDE,
      indices: { left, right, mid },
      activeIndices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      sortedIndices: [],
      codeLineIndex: 3, // mid = arr.length / 2
      description: `배열[${left}..${right}]을 중간점 ${mid}에서 분할합니다`,
    });

    this.mergeSortRecursive(arr, left, mid);
    this.mergeSortRecursive(arr, mid + 1, right);
    this.merge(arr, left, mid, right);
  }

  merge(arr, left, mid, right) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      this.comparisons++;
      
      // Record comparison step
      this.addStep({
        array: [...arr],
        action: ACTIONS.COMPARE,
        indices: { left: left + i, right: mid + 1 + j, mergeStart: left, mergeEnd: right },
        activeIndices: [left + i, mid + 1 + j],
        sortedIndices: [],
        codeLineIndex: 11, // if left[0] <= right[0]
        description: `${leftArr[i]}와 ${rightArr[j]}를 비교합니다`,
      });

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      this.moves++;

      // Record place step
      this.addStep({
        array: [...arr],
        action: ACTIONS.PLACE,
        indices: { position: k, mergeStart: left, mergeEnd: right },
        activeIndices: [k],
        sortedIndices: [],
        codeLineIndex: 12,
        description: `${arr[k]}을(를) 위치 ${k}에 배치합니다`,
      });
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      this.moves++;
      this.addStep({
        array: [...arr],
        action: ACTIONS.PLACE,
        indices: { position: k, mergeStart: left, mergeEnd: right },
        activeIndices: [k],
        sortedIndices: [],
        codeLineIndex: 15,
        description: `남은 왼쪽 원소 ${arr[k]}을(를) 위치 ${k}에 배치합니다`,
      });
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      this.moves++;
      this.addStep({
        array: [...arr],
        action: ACTIONS.PLACE,
        indices: { position: k, mergeStart: left, mergeEnd: right },
        activeIndices: [k],
        sortedIndices: [],
        codeLineIndex: 15,
        description: `남은 오른쪽 원소 ${arr[k]}을(를) 위치 ${k}에 배치합니다`,
      });
      j++;
      k++;
    }

    // Record merge complete
    const mergedIndices = Array.from({ length: right - left + 1 }, (_, idx) => left + idx);
    this.addStep({
      array: [...arr],
      action: ACTIONS.MERGE,
      indices: { left, right },
      activeIndices: [],
      sortedIndices: mergedIndices,
      codeLineIndex: 6,
      description: `배열[${left}..${right}] 병합 완료`,
    });
  }

  addStep(step) {
    this.steps.push({
      ...step,
      comparisons: this.comparisons,
      moves: this.moves,
    });
  }

  getSteps() {
    return this.steps;
  }

  getStats() {
    return {
      comparisons: this.comparisons,
      moves: this.moves,
      totalSteps: this.steps.length,
    };
  }
}

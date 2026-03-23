export const COLORS = {
  UNSORTED: 'unsorted',
  COMPARING: 'comparing',
  MERGING: 'merging',
  SORTED: 'sorted',
  DIVIDING: 'dividing',
};

export const ACTIONS = {
  DIVIDE: 'divide',
  COMPARE: 'compare',
  MERGE: 'merge',
  PLACE: 'place',
  COMPLETE: 'complete',
};

export const SPEED = {
  MIN: 1,
  MAX: 10,
  DEFAULT: 5,
  BASE_DELAY: 600, // ms at speed 1
};

export const SIZE = {
  MIN: 4,
  MAX: 32,
  DEFAULT: 8,
};

export const PSEUDOCODE = [
  'function mergeSort(arr):',
  '  if arr.length <= 1:',
  '    return arr',
  '  mid = arr.length / 2',
  '  left = mergeSort(arr[0..mid])',
  '  right = mergeSort(arr[mid..end])',
  '  return merge(left, right)',
  '',
  'function merge(left, right):',
  '  result = []',
  '  while left AND right not empty:',
  '    if left[0] <= right[0]:',
  '      result.push(left.shift())',
  '    else:',
  '      result.push(right.shift())',
  '  return result + left + right',
];

export const DESCRIPTIONS = {
  divide: (left, right) => `배열을 [${left}]과 [${right}]으로 분할합니다`,
  compare: (a, b) => `${a}와 ${b}를 비교합니다`,
  merge: (val, pos) => `${val}을(를) 위치 ${pos}에 병합합니다`,
  place: (val, pos) => `${val}을(를) 위치 ${pos}에 배치합니다`,
  complete: () => '정렬이 완료되었습니다!',
  initial: () => '배열을 생성하고 시작하세요',
};

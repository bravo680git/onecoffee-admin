export function combineArrays<T>(arrays: T[][]): T[][] {
  if (arrays.length === 0) return [[]];

  function combine(currentIndex: number): T[][] {
    if (currentIndex === arrays.length - 1) {
      return arrays[currentIndex].map((item) => [item]);
    }

    const resultOfRemainingArrays = combine(currentIndex + 1);

    const combinedResult: T[][] = [];
    for (const item of arrays[currentIndex]) {
      for (const remainingArray of resultOfRemainingArrays) {
        combinedResult.push([item, ...remainingArray]);
      }
    }

    return combinedResult;
  }

  return combine(0);
}

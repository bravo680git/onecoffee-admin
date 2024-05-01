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

export function generateTreeData<
  S extends { id: number; parentId?: number },
  D extends object
>(items: S[] | undefined, cb: (item: S) => D) {
  if (!items) {
    return [];
  }
  const parents = items.filter((item) => !item.parentId);

  return parents.map((parent) => ({
    ...cb(parent),
    children: items
      .filter((item) => item.parentId === parent.id)
      .map((item) => cb(item)),
  }));
}

export const transformCurrency = (price?: number, salePercent?: number) => {
  if (!price) return "₫" + 0;
  let prePrice = price;
  if (salePercent) {
    prePrice = (prePrice * (100 - salePercent)) / 100;
  }
  const parts = prePrice.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return "₫" + parts.join(".");
};

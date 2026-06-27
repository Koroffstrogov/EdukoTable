import { FACTORS, type Factor, type Operation } from "./types";

export function isFactor(value: number): value is Factor {
  return FACTORS.includes(value as Factor);
}

export function getOperationKey(a: number, b: number): string {
  return `${a}x${b}`;
}

export function getPairKey(a: number, b: number): string {
  return [a, b].sort((x, y) => x - y).join("x");
}

export function buildAllOperations(): Operation[] {
  const operations: Operation[] = [];

  for (const a of FACTORS) {
    for (const b of FACTORS) {
      operations.push({
        a,
        b,
        key: getOperationKey(a, b),
        pairKey: getPairKey(a, b),
      });
    }
  }

  return operations;
}

export function getOperationProduct(operation: Operation): number {
  return operation.a * operation.b;
}

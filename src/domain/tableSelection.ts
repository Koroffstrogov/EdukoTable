import { buildAllOperations } from "./operations";
import { FACTORS, type Factor, type Operation } from "./types";

export const DEFAULT_SELECTED_TABLES: Factor[] = [2, 3, 4, 5];

export function normalizeSelectedTables(selectedTables: Factor[]): Factor[] {
  const unique = FACTORS.filter((factor) => selectedTables.includes(factor));
  return unique.length > 0 ? unique : DEFAULT_SELECTED_TABLES;
}

export function operationBelongsToSelectedTables(
  operation: Operation,
  selectedTables: Factor[],
): boolean {
  return (
    selectedTables.includes(operation.a) ||
    selectedTables.includes(operation.b)
  );
}

export function buildOperationPool(selectedTables: Factor[]): Operation[] {
  const normalizedTables = normalizeSelectedTables(selectedTables);

  return buildAllOperations().filter((operation) =>
    operationBelongsToSelectedTables(operation, normalizedTables),
  );
}

export function getOperationsForTable(table: Factor): Operation[] {
  return buildAllOperations().filter(
    (operation) => operation.a === table || operation.b === table,
  );
}

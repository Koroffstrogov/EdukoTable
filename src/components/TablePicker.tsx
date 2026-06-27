import { buildOperationPool } from "../domain/tableSelection";
import { FACTORS, type Factor, type SessionMode } from "../domain/types";

type TablePickerProps = {
  mode: SessionMode;
  selectedTables: Factor[];
  onChange: (tables: Factor[]) => void;
  onBack: () => void;
  onStart: () => void;
};

const groups: { label: string; tables: Factor[] }[] = [
  { label: "2 a 5", tables: [2, 3, 4, 5] },
  { label: "2 a 6", tables: [2, 3, 4, 5, 6] },
  { label: "2 a 10", tables: [...FACTORS] },
];

export function TablePicker({
  mode,
  selectedTables,
  onChange,
  onBack,
  onStart,
}: TablePickerProps) {
  const operationCount = buildOperationPool(selectedTables).length;
  const title =
    mode === "training" ? "Entrainement cible" : "Mission rapide";

  function toggleTable(table: Factor): void {
    const nextTables = selectedTables.includes(table)
      ? selectedTables.filter((selected) => selected !== table)
      : [...selectedTables, table].sort((left, right) => left - right);

    if (nextTables.length > 0) {
      onChange(nextTables);
    }
  }

  return (
    <section className="screen picker-screen">
      <div className="screen-header">
        <button className="button quiet" type="button" onClick={onBack}>
          Accueil
        </button>
        <p className="eyebrow">{title}</p>
      </div>

      <h1>Je revise quelles tables ?</h1>

      <div className="button-grid table-grid" aria-label="Tables">
        {FACTORS.map((table) => {
          const selected = selectedTables.includes(table);

          return (
            <button
              className={`table-button ${selected ? "is-selected" : ""}`}
              type="button"
              aria-pressed={selected}
              key={table}
              onClick={() => toggleTable(table)}
            >
              Table {table}
            </button>
          );
        })}
      </div>

      <div className="group-row" aria-label="Groupes">
        {groups.map((group) => (
          <button
            className="button secondary compact"
            type="button"
            key={group.label}
            onClick={() => onChange(group.tables)}
          >
            {group.label}
          </button>
        ))}
      </div>

      <div className="selected-strip" aria-live="polite">
        <strong>{operationCount}</strong> operations possibles
      </div>

      <button className="button primary full" type="button" onClick={onStart}>
        Commencer
      </button>
    </section>
  );
}

import { ResetProgressPanel } from "./ResetProgressPanel";
import {
  getDifficultOperationSummaries,
  getTableProgressSummaries,
} from "../domain/progress";
import type { ProgressState } from "../domain/types";

type ProgressDashboardProps = {
  progress: ProgressState;
  onBack: () => void;
  onResetResults: () => void;
  onResetAdventure: () => void;
};

export function ProgressDashboard({
  progress,
  onBack,
  onResetResults,
  onResetAdventure,
}: ProgressDashboardProps) {
  const tableProgress = getTableProgressSummaries(progress.operationStats);
  const difficultOperations = getDifficultOperationSummaries(
    progress.operationStats,
    6,
  );

  return (
    <section className="screen progress-screen">
      <div className="screen-header">
        <button className="button quiet" type="button" onClick={onBack}>
          Accueil
        </button>
        <p className="eyebrow">Progression</p>
      </div>

      <div className="screen-title-block">
        <h1>Progression</h1>
        <p>Un résumé simple pour suivre les tables travaillées.</p>
      </div>

      <section className="progress-panel">
        <h2>Par table</h2>
        <div className="table-progress-list">
          {tableProgress.map((summary) => (
            <div className="table-progress-row" key={summary.table}>
              <span className="table-name">Table {summary.table}</span>
              <span className="progress-bar" aria-hidden="true">
                <span
                  style={{ width: `${Math.round((summary.successRate ?? 0) * 100)}%` }}
                />
              </span>
              <span className="progress-rate">{formatRate(summary.successRate)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="progress-panel">
        <h2>Opérations à revoir</h2>
        {difficultOperations.length === 0 ? (
          <p className="muted-text">Aucune difficulté enregistrée pour le moment.</p>
        ) : (
          <div className="operation-list">
            {difficultOperations.map((summary) => (
              <div className="operation-row" key={summary.operation.key}>
                <strong>
                  {summary.operation.a} × {summary.operation.b}
                </strong>
                <span>
                  {summary.stats.attempts} tentative
                  {summary.stats.attempts > 1 ? "s" : ""}
                </span>
                <span>{formatRate(summary.successRate)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <ResetProgressPanel
        onResetResults={onResetResults}
        onResetAdventure={onResetAdventure}
      />
    </section>
  );
}

function formatRate(rate: number | null): string {
  if (rate === null) return "Pas encore";
  return `${Math.round(rate * 100)} %`;
}

import { Mascot } from "./Mascot";
import { RewardBurst } from "./RewardBurst";
import type { MascotMood, RewardGrant, SessionResult } from "../domain/types";

type SessionSummaryProps = {
  result: SessionResult;
  grant: RewardGrant;
  status: "completed" | "abandoned";
  totalQuestions: number;
  mascotMood: MascotMood;
  onReplay: () => void;
  onHome: () => void;
};

export function SessionSummary({
  result,
  grant,
  status,
  totalQuestions,
  mascotMood,
  onReplay,
  onHome,
}: SessionSummaryProps) {
  const wrongOperations = result.wrongOperations.slice(0, 4);
  const isAbandoned = status === "abandoned";

  return (
    <section className="screen summary-screen">
      <div className="summary-top">
        <div>
          <p className="eyebrow">
            {isAbandoned ? "Mission arrêtée" : "Mission terminée"}
          </p>
          {isAbandoned ? (
            <h1>
              {result.total} / {totalQuestions} questions faites
            </h1>
          ) : (
            <h1>
              {result.correctCount} / {result.total} réussies
            </h1>
          )}
        </div>
        <Mascot mood={mascotMood} />
      </div>

      {(!isAbandoned || grant.stars > 0) && <RewardBurst grant={grant} />}

      {isAbandoned && (
        <div className="review-block">
          <h2>Résumé partiel</h2>
          <p>
            {result.correctCount} bonne
            {result.correctCount > 1 ? "s" : ""} réponse
            {result.correctCount > 1 ? "s" : ""}
          </p>
          <p>Tes réponses sont enregistrées.</p>
          <p>Pas de sticker cette fois.</p>
        </div>
      )}

      {!isAbandoned && (
        <div className="review-block">
          <h2>À revoir</h2>
          {wrongOperations.length === 0 ? (
            <p>Tout est juste sur cette mission.</p>
          ) : (
            <ul>
              {wrongOperations.map((operation) => (
                <li key={operation.key}>
                  {operation.a} × {operation.b}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="action-stack">
        <button className="button primary" type="button" onClick={onReplay}>
          {isAbandoned ? "Nouvelle mission" : "Rejouer"}
        </button>
        <button className="button secondary" type="button" onClick={onHome}>
          Accueil
        </button>
      </div>
    </section>
  );
}

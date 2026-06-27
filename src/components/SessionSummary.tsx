import { Mascot } from "./Mascot";
import { RewardBurst } from "./RewardBurst";
import type { MascotMood, RewardGrant, SessionResult } from "../domain/types";

type SessionSummaryProps = {
  result: SessionResult;
  grant: RewardGrant;
  mascotMood: MascotMood;
  onReplay: () => void;
  onHome: () => void;
};

export function SessionSummary({
  result,
  grant,
  mascotMood,
  onReplay,
  onHome,
}: SessionSummaryProps) {
  const wrongOperations = result.wrongOperations.slice(0, 4);

  return (
    <section className="screen summary-screen">
      <div className="summary-top">
        <div>
          <p className="eyebrow">Mission terminée</p>
          <h1>
            {result.correctCount} / {result.total} réussies
          </h1>
        </div>
        <Mascot mood={mascotMood} />
      </div>

      <RewardBurst grant={grant} />

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

      <div className="action-stack">
        <button className="button primary" type="button" onClick={onReplay}>
          Rejouer
        </button>
        <button className="button secondary" type="button" onClick={onHome}>
          Accueil
        </button>
      </div>
    </section>
  );
}

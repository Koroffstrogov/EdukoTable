import { useState } from "react";
import type { SettingsState } from "../domain/types";

type SettingsScreenProps = {
  settings: SettingsState;
  onChange: (settings: SettingsState) => void;
  onBack: () => void;
};

export function SettingsScreen({
  settings,
  onChange,
  onBack,
}: SettingsScreenProps) {
  const [message, setMessage] = useState("Les réglages sont gardés sur cet appareil.");

  function update(nextSettings: SettingsState, nextMessage: string): void {
    onChange(nextSettings);
    setMessage(nextMessage);
  }

  return (
    <section className="screen settings-screen">
      <div className="screen-header">
        <button className="button quiet" type="button" onClick={onBack}>
          Accueil
        </button>
        <p className="eyebrow">Réglages</p>
      </div>

      <div className="screen-title-block">
        <h1>Réglages</h1>
        <p>Des options simples pour adapter l’expérience.</p>
      </div>

      <section className="settings-panel" aria-live="polite">
        <SettingToggle
          title="Animations"
          description="Réduit les mouvements visuels quand c’est désactivé."
          enabled={settings.animationsEnabled}
          onToggle={() =>
            update(
              {
                ...settings,
                animationsEnabled: !settings.animationsEnabled,
              },
              settings.animationsEnabled
                ? "Animations désactivées."
                : "Animations activées.",
            )
          }
        />

        <SettingToggle
          title="Sons"
          description="Prépare les petits sons de réussite, sans fichier audio externe."
          enabled={settings.soundEnabled}
          onToggle={() =>
            update(
              {
                ...settings,
                soundEnabled: !settings.soundEnabled,
              },
              settings.soundEnabled
                ? "Sons désactivés."
                : "Sons activés. Ils seront utilisés après une interaction.",
            )
          }
        />

        <p className="settings-message">{message}</p>
      </section>
    </section>
  );
}

type SettingToggleProps = {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
};

function SettingToggle({
  title,
  description,
  enabled,
  onToggle,
}: SettingToggleProps) {
  return (
    <div className="setting-row">
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      <button
        className={`toggle-button ${enabled ? "is-on" : ""}`}
        type="button"
        aria-label={`${title} ${enabled ? "activé" : "désactivé"}`}
        aria-pressed={enabled}
        onClick={onToggle}
      >
        {enabled ? "Activé" : "Désactivé"}
      </button>
    </div>
  );
}

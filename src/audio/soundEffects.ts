export type SoundEffectId =
  | "answer-correct"
  | "answer-encouraging"
  | "session-complete"
  | "sticker-unlock";

export type SoundTone = Readonly<{
  frequency: number;
  durationMs: number;
  delayMs: number;
  gain: number;
  waveform: OscillatorType;
}>;

const SOUND_EFFECTS: Record<SoundEffectId, readonly SoundTone[]> = {
  "answer-correct": [
    tone(523.25, 105, 0, 0.045),
    tone(659.25, 130, 85, 0.05),
  ],
  "answer-encouraging": [
    tone(392, 115, 0, 0.024, "sine"),
    tone(440, 150, 100, 0.028, "sine"),
  ],
  "session-complete": [
    tone(523.25, 120, 0, 0.04),
    tone(659.25, 140, 100, 0.045),
    tone(783.99, 210, 210, 0.05),
  ],
  "sticker-unlock": [
    tone(659.25, 110, 0, 0.04, "sine"),
    tone(783.99, 130, 90, 0.045, "sine"),
    tone(1046.5, 230, 195, 0.05, "sine"),
  ],
};

let sharedAudioContext: AudioContext | null = null;

export function getSoundEffectTones(
  effectId: SoundEffectId,
): readonly SoundTone[] {
  return SOUND_EFFECTS[effectId];
}

export function playSoundEffect(
  effectId: SoundEffectId,
  enabled: boolean,
): void {
  if (!enabled || typeof window === "undefined" || !window.AudioContext) {
    return;
  }

  try {
    const context = sharedAudioContext ?? new window.AudioContext();
    sharedAudioContext = context;

    const schedule = () => scheduleEffect(context, effectId);

    if (context.state === "suspended") {
      void context.resume().then(schedule).catch(() => undefined);
      return;
    }

    schedule();
  } catch {
    // Sounds are optional and must never interrupt a session.
  }
}

function scheduleEffect(
  context: AudioContext,
  effectId: SoundEffectId,
): void {
  const now = context.currentTime;

  for (const soundTone of SOUND_EFFECTS[effectId]) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    const startsAt = now + soundTone.delayMs / 1000;
    const endsAt = startsAt + soundTone.durationMs / 1000;

    oscillator.type = soundTone.waveform;
    oscillator.frequency.setValueAtTime(soundTone.frequency, startsAt);
    gainNode.gain.setValueAtTime(0.0001, startsAt);
    gainNode.gain.exponentialRampToValueAtTime(
      soundTone.gain,
      startsAt + 0.015,
    );
    gainNode.gain.exponentialRampToValueAtTime(0.0001, endsAt);
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.addEventListener("ended", () => {
      oscillator.disconnect();
      gainNode.disconnect();
    });
    oscillator.start(startsAt);
    oscillator.stop(endsAt + 0.02);
  }
}

function tone(
  frequency: number,
  durationMs: number,
  delayMs: number,
  gain: number,
  waveform: OscillatorType = "triangle",
): SoundTone {
  return { frequency, durationMs, delayMs, gain, waveform };
}

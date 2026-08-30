import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getSoundEffectTones,
  playSoundEffect,
  type SoundEffectId,
} from "./soundEffects";

const EFFECT_IDS: SoundEffectId[] = [
  "answer-correct",
  "answer-encouraging",
  "session-complete",
  "sticker-unlock",
];

describe("sound effects", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("defines short, quiet local tones for every effect", () => {
    for (const effectId of EFFECT_IDS) {
      const tones = getSoundEffectTones(effectId);

      expect(tones.length).toBeGreaterThan(0);
      expect(tones.every((item) => item.frequency > 0)).toBe(true);
      expect(tones.every((item) => item.durationMs <= 250)).toBe(true);
      expect(tones.every((item) => item.gain <= 0.05)).toBe(true);
    }
  });

  it("keeps the encouragement sound gentler than success sounds", () => {
    const encouragementGain = Math.max(
      ...getSoundEffectTones("answer-encouraging").map((item) => item.gain),
    );
    const correctGain = Math.max(
      ...getSoundEffectTones("answer-correct").map((item) => item.gain),
    );

    expect(encouragementGain).toBeLessThan(correctGain);
  });

  it("does not create an audio context when sounds are disabled", () => {
    const AudioContext = vi.fn();
    vi.stubGlobal("window", { AudioContext });

    playSoundEffect("answer-correct", false);

    expect(AudioContext).not.toHaveBeenCalled();
  });

  it("falls back silently when Web Audio is unavailable", () => {
    vi.stubGlobal("window", {});

    expect(() => playSoundEffect("answer-correct", true)).not.toThrow();
  });

  it("schedules every tone when Web Audio is available", () => {
    const oscillator = {
      type: "sine" as OscillatorType,
      frequency: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
      disconnect: vi.fn(),
      addEventListener: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
    const gainNode = {
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      disconnect: vi.fn(),
    };
    const context = {
      state: "running",
      currentTime: 1,
      destination: {},
      createOscillator: vi.fn(() => oscillator),
      createGain: vi.fn(() => gainNode),
    };
    const AudioContext = vi.fn(() => context);
    vi.stubGlobal("window", { AudioContext });

    playSoundEffect("session-complete", true);

    expect(AudioContext).toHaveBeenCalledOnce();
    expect(context.createOscillator).toHaveBeenCalledTimes(
      getSoundEffectTones("session-complete").length,
    );
    expect(oscillator.start).toHaveBeenCalled();
    expect(oscillator.stop).toHaveBeenCalled();
  });
});

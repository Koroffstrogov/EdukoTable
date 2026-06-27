import { describe, expect, it } from "vitest";
import {
  EDUKO_ANIMATION_IDS,
  getAnimationDefinition,
  isEdukoAnimationId,
} from "./animations";

describe("animation registry", () => {
  it("declares the lot 6 animation ids", () => {
    expect(EDUKO_ANIMATION_IDS).toEqual([
      "mascot-idle",
      "mascot-happy",
      "mascot-encouraging",
      "star-pop",
      "sticker-unlock",
      "mission-complete",
    ]);
  });

  it("returns definitions for known animations", () => {
    expect(getAnimationDefinition("star-pop")).toMatchObject({
      id: "star-pop",
      loop: false,
    });
    expect(getAnimationDefinition("mascot-idle")).toMatchObject({
      id: "mascot-idle",
      loop: true,
    });
  });

  it("falls back cleanly for unknown animations", () => {
    expect(getAnimationDefinition("missing-animation")).toBeNull();
    expect(isEdukoAnimationId("missing-animation")).toBe(false);
  });
});

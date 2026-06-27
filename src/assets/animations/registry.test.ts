import { describe, expect, it } from "vitest";
import { getAnimationAsset, isLottieAnimationData } from "./registry";

describe("animation assets", () => {
  it("returns local animation data for known ids", () => {
    expect(getAnimationAsset("mascot-idle")).toMatchObject({
      nm: "mascot-idle",
    });
    expect(getAnimationAsset("mission-complete")).toMatchObject({
      nm: "mission-complete",
    });
  });

  it("returns null for missing assets", () => {
    expect(getAnimationAsset("missing-animation")).toBeNull();
  });

  it("rejects malformed lottie data", () => {
    expect(isLottieAnimationData({ v: "5.7.4" })).toBe(false);
    expect(isLottieAnimationData(null)).toBe(false);
  });
});

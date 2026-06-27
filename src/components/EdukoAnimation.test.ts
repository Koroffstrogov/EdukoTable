import { describe, expect, it } from "vitest";
import { getAnimationState } from "./EdukoAnimation";

describe("EdukoAnimation state", () => {
  const animationData = { v: "5.7.4" };

  it("activates animation only when allowed and available", () => {
    expect(getAnimationState(true, false, animationData)).toBe("active");
  });

  it("falls back when animations are disabled", () => {
    expect(getAnimationState(false, false, animationData)).toBe("disabled");
  });

  it("falls back when reduced motion is requested", () => {
    expect(getAnimationState(true, true, animationData)).toBe("reduced");
  });

  it("falls back when animation data is missing", () => {
    expect(getAnimationState(true, false, null)).toBe("missing");
  });
});

import { describe, expect, it } from "vitest";
import { getAnimationAsset } from "./registry";

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
});

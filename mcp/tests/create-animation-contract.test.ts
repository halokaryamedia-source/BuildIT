import { describe, expect, test } from "bun:test";
import {
  createAnimationParameters,
  normalizeBedrockAnimationName,
} from "@/server/tools/animation";

describe("create_animation contract", () => {
  test("accepts explicit zero animation length", () => {
    const result = createAnimationParameters.parse({
      name: "idle",
      animation_length: 0,
      bones: {},
    });
    expect(result.animation_length).toBe(0);
  });

  test("Bedrock animation prefix is applied exactly once", async () => {
    expect(normalizeBedrockAnimationName("walk")).toBe("animation.walk");
    expect(normalizeBedrockAnimationName("animation.walk")).toBe("animation.walk");

    const source = await Bun.file(new URL("../server/tools/animation.ts", import.meta.url)).text();
    expect(source).toContain("normalizeBedrockAnimationName(name)");
    expect(source).not.toContain("const requestedAnimationName = `animation.${name}`");
  });

  test("serializer preserves accepted zero instead of treating it as omitted", async () => {
    const source = await Bun.file(new URL("../server/tools/animation.ts", import.meta.url)).text();
    expect(source).toContain("animation_length !== undefined && { animation_length }");
    expect(source).not.toContain("animation_length && { animation_length }");
  });
});

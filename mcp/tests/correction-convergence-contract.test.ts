import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";

async function skill(path: string): Promise<string> {
  return readFile(new URL(`../../${path}`, import.meta.url), "utf8");
}

function normalized(value: string): string {
  return value.replace(/\s+/g, " ").toLowerCase();
}

describe("BlockIT correction convergence contract", () => {
  test("router enforces one-cause correction and bounded retries", async () => {
    const router = normalized(
      await skill(".agents/skills/blockit-bedrock-entity-mcp/SKILL.md")
    );

    expect(router).toContain("correction convergence contract");
    expect(router).toContain("largest material difference");
    expect(router).toContain("first wrong owner/cause");
    expect(router).toContain("reuse fresh state/evidence");
    expect(router).toContain("same causal direction may be attempted at most twice");
    expect(router).toContain("downstream compensation is not convergence");
  });

  test("geometry reuses exact state and blocks repeated same-cause correction", async () => {
    const geometry = normalized(
      await skill(".agents/skills/blockbench-bedrock-modelling/SKILL.md")
    );

    expect(geometry).toContain("local correction / convergence");
    expect(geometry).toContain("reuse fresh exact authored state");
    expect(geometry).toContain("recapture affected view(s)");
    expect(geometry).toContain("same causal correction failing twice without new evidence");
  });

  test("texturing refreshes only stale evidence and does not guess a third variant", async () => {
    const texturing = normalized(
      await skill(".agents/skills/blockit-bedrock-texturing/SKILL.md")
    );

    expect(texturing).toContain("correction convergence");
    expect(texturing).toContain("one visible cause owns one correction round");
    expect(texturing).toContain("refresh only the evidence class made stale");
    expect(texturing).toContain("same texture-owned causal direction twice without new evidence");
    expect(texturing).toContain("do not produce a third palette/pattern variation as guesswork");
  });

  test("animation reuses timeline state and refuses denser-key retry loops", async () => {
    const animation = normalized(
      await skill(".agents/skills/blockit-bedrock-animation/SKILL.md")
    );

    expect(animation).toContain("correction convergence");
    expect(animation).toContain("one diagnosed motion cause");
    expect(animation).toContain("fresh timeline mutation receipt remains authoritative");
    expect(animation).toContain("same causal direction fails twice without new evidence");
    expect(animation).toContain("do not add denser keys");
  });
});

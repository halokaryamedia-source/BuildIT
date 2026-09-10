import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";

async function skill(path: string): Promise<string> {
  return readFile(new URL(`../../${path}`, import.meta.url), "utf8");
}

function normalized(value: string): string {
  return value.replace(/\s+/g, " ").toLowerCase();
}

describe("cross-phase reference fidelity contract", () => {
  test("router keeps one authority chain and forbids downstream compensation", async () => {
    const router = normalized(
      await skill(".agents/skills/blockit-bedrock-entity-mcp/SKILL.md")
    );

    expect(router).toContain("cross-phase reference authority");
    expect(router).toContain("a downstream phase must not compensate for an upstream defect");
    expect(router).toContain("texture cannot paint around it");
    expect(router).toContain("animation cannot key around it");
    expect(router).toContain("fail | unverified | pass");
  });

  test("texturing preserves geometry ownership and judges mapped-surface fidelity", async () => {
    const source = normalized(
      await skill(".agents/skills/blockit-bedrock-texturing/SKILL.md")
    );

    expect(source).toContain("texture reference contract");
    expect(source).toContain("mapped-surface-first");
    expect(source).toContain("must not paint around a missing/incorrect mass");
    expect(source).toContain("wrong/missing identity marking");
    expect(source).toContain("mapped model introduces a material seam");
  });

  test("animation uses reference poses but refuses to compensate for a wrong rig", async () => {
    const source = normalized(
      await skill(".agents/skills/blockit-bedrock-animation/SKILL.md")
    );

    expect(source).toContain("keyframe reference fidelity contract");
    expect(source).toContain("geometry remains authority for actual bone hierarchy");
    expect(source).toContain("pose-correspondence-first");
    expect(source).toContain("excessive joint gap");
    expect(source).toContain("stop animation and hand off to geometry");
  });

  test("reference fidelity remains qualitative and first-cause ordered across phases", async () => {
    const geometry = normalized(
      await skill(".agents/skills/blockbench-bedrock-modelling/SKILL.md")
    );
    const texturing = normalized(
      await skill(".agents/skills/blockit-bedrock-texturing/SKILL.md")
    );
    const animation = normalized(
      await skill(".agents/skills/blockit-bedrock-animation/SKILL.md")
    );

    expect(geometry).toContain("correct first cause");
    expect(texturing).toContain("prioritize correction by visible identity impact");
    expect(animation).toContain("prioritize correction by motion impact");
    expect(animation).toContain("do not use an animation quality score");
  });
});

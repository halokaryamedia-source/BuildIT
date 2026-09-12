import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";

async function repoFile(path: string): Promise<string> {
  return readFile(new URL(`../../${path}`, import.meta.url), "utf8");
}

function normalized(value: string): string {
  return value.replace(/\s+/g, " ").toLowerCase();
}

describe("cross-phase reference fidelity contract", () => {
  test("shared stage context keeps one authority chain and evidence boundaries", async () => {
    const shared = normalized(
      await repoFile("docs/04-system/authoring-stage-context.md")
    );

    expect(shared).toContain("## authority");
    expect(shared).toContain("explicit current user requirement");
    expect(shared).toContain("approved/current visual reference evidence");
    expect(shared).toContain("persisted approved asset state");
    expect(shared).toContain("specialist technical evidence");
    expect(shared).toContain("unresolved remains unknown");
    expect(shared).toContain("do not create visual acceptance or user approval");
  });

  test("texturing preserves geometry ownership and judges mapped-surface fidelity", async () => {
    const source = normalized(
      await repoFile(".agents/skills/lazydesigner-texturing/SKILL.md")
    );

    expect(source).toContain("reference fidelity contract");
    expect(source).toContain("mapped-surface-first");
    expect(source).toContain("must not paint around a missing/incorrect mass");
    expect(source).toContain("wrong/missing identity marking");
    expect(source).toContain("mapped model introduces a material seam");
  });

  test("animation uses reference poses but refuses to compensate for a wrong rig", async () => {
    const source = normalized(
      await repoFile(".agents/skills/lazydesigner-animation/SKILL.md")
    );

    expect(source).toContain("keyframe reference fidelity contract");
    expect(source).toContain("geometry remains authority for actual bone hierarchy");
    expect(source).toContain("pose-correspondence-first");
    expect(source).toContain("excessive joint gap");
    expect(source).toContain("stop animation and hand off to geometry");
  });

  test("reference fidelity remains qualitative and first-cause ordered across phases", async () => {
    const geometry = normalized(
      await repoFile(".agents/skills/lazydesigner-modelling/SKILL.md")
    );
    const texturing = normalized(
      await repoFile(".agents/skills/lazydesigner-texturing/SKILL.md")
    );
    const animation = normalized(
      await repoFile(".agents/skills/lazydesigner-animation/SKILL.md")
    );

    expect(geometry).toContain("correct first cause");
    expect(texturing).toContain("prioritize correction by visible identity impact");
    expect(animation).toContain("prioritize correction by motion impact");
    expect(animation).toContain("do not use an animation quality score");
  });
});

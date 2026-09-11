import { describe, expect, test } from "bun:test";
import { readdir } from "node:fs/promises";

async function text(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("AI-first documentation hierarchy", () => {
  test("docs root exposes only canonical domain hierarchy plus root router", async () => {
    const entries = (await readdir("../docs", { withFileTypes: true }))
      .map((entry) => entry.name)
      .sort();

    expect(entries).toEqual([
      "01-product",
      "02-reference",
      "03-authoring",
      "04-system",
      "05-operations",
      "README.md",
    ]);
    expect(await Bun.file("../docs/foundation/README.md").exists()).toBe(false);
    expect(await Bun.file("../docs/knowledge/README.md").exists()).toBe(false);
  });

  test("root docs README routes AI by domain instead of duplicating policy", async () => {
    const readme = await text("../docs/README.md");
    for (const domain of ["01-product", "02-reference", "03-authoring", "04-system", "05-operations"]) {
      expect(readme).toContain(domain);
    }
    expect(readme).toMatch(/minimum|smallest|relevant/i);
    expect(readme).toMatch(/canonical owner/i);
  });

  test("reference domain separates image and package authorities", async () => {
    const required = [
      "../docs/02-reference/README.md",
      "../docs/02-reference/flow.md",
      "../docs/02-reference/policy.md",
      "../docs/02-reference/image/README.md",
      "../docs/02-reference/image/standard.md",
      "../docs/02-reference/image/scale-and-escalation.md",
      "../docs/02-reference/image/prompt-contract.md",
      "../docs/02-reference/image/master-templates.md",
      "../docs/02-reference/package/README.md",
      "../docs/02-reference/package/schema.md",
      "../docs/02-reference/package/handoff.md",
      "../docs/02-reference/package/load-contract.md",
      "../docs/02-reference/package/geometry.md",
      "../docs/02-reference/package/texture.md",
      "../docs/02-reference/package/animation.md",
    ];
    for (const path of required) expect(await Bun.file(path).exists()).toBe(true);
  });

  test("authoring domain owns modelling profiles and stage standards", async () => {
    const profileRoot = "../docs/03-authoring/modelling/profiles";
    for (const profile of [
      "README.md",
      "prop-furniture.md",
      "vehicle.md",
      "humanoid.md",
      "creature.md",
      "mechanical.md",
      "plant-foliage.md",
      "generic.md",
    ]) {
      expect(await Bun.file(`${profileRoot}/${profile}`).exists()).toBe(true);
    }

    for (const path of [
      "../docs/03-authoring/modelling/standard.md",
      "../docs/03-authoring/texture/standard.md",
      "../docs/03-authoring/animation/standard.md",
      "../docs/03-authoring/validation/visual.md",
      "../docs/03-authoring/finalization/standard.md",
    ]) {
      expect(await Bun.file(path).exists()).toBe(true);
    }
  });

  test("system and operations state remain separate from product/reference policy", async () => {
    const [implementation, validation, next, runbook] = await Promise.all([
      text("../docs/04-system/implementation-map.md"),
      text("../docs/05-operations/current-validation.md"),
      text("../docs/05-operations/next-action.md"),
      text("../docs/05-operations/local-acceptance-runbook.md"),
    ]);

    expect(implementation).toMatch(/source ownership/i);
    expect(validation).toMatch(/proof interpretation/i);
    expect(next).toMatch(/continuation only/i);
    expect(runbook).toMatch(/local acceptance/i);
  });

  test("primary AI-facing routing points to the new canonical hierarchy", async () => {
    const [root, context, referenceSkill, modellingSkill] = await Promise.all([
      text("../AGENTS.md"),
      text("../CONTEXT.md"),
      text("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      text("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
    ]);

    for (const owner of [root, context, referenceSkill, modellingSkill]) {
      expect(owner).not.toContain("docs/knowledge/");
      expect(owner).not.toContain("docs/foundation/");
    }
    expect(referenceSkill).toContain("docs/02-reference/");
    expect(modellingSkill).toContain("docs/03-authoring/modelling/profiles/");
  });
});

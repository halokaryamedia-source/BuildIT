import { afterEach, describe, expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readReferencePackageProjection } from "@/gateway/control/referencePackage";

const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true }))
  );
});

async function referencePackage(payload: unknown): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "lazydesigner-particle-reference-"));
  temporaryRoots.push(root);
  await writeFile(join(root, "REFERENCE.json"), JSON.stringify(payload), "utf8");
  return root;
}

describe("LazyDesigner Control particle reference handoff", () => {
  test("projects particle handoff metadata without inventing a modelling profile", async () => {
    const root = await referencePackage({
      schema: "lazydesigner-reference-v1",
      asset: {
        name: "dust_hit",
        kind: "PARTICLE",
        task: "NEW_ASSET",
        intent: "Short dust burst when a hoe contacts the ground",
      },
      requirements: {
        animation_required: true,
      },
      particle: {
        identifier: "mivubi:dust_hit",
        particle_json: "particles/dust_hit.particle.json",
        texture_reference: "textures/particle/dust_hit",
        texture_png: "textures/particle/dust_hit.png",
        texture_state: "READY",
        recommended_locator: "hoe_tip",
        recommended_animation: "harvest_cinnamon",
        trigger: {
          intent: "tool contact with ground",
          time_seconds: 0.42,
        },
        bind_to_actor: true,
        review_state: "APPROVED",
      },
      unknowns: { blocking: [], non_blocking: [] },
      readiness: {
        overall: "READY",
        geometry: "NOT_REQUIRED",
        texture: "READY",
        animation: "READY",
      },
    });

    const projection = await readReferencePackageProjection(root);

    expect(projection.available).toBe(true);
    expect(projection.asset_kind).toBe("PARTICLE");
    expect(projection.selected_profile).toBeNull();
    expect(projection.particle).toEqual({
      identifier: "mivubi:dust_hit",
      particle_json: "particles/dust_hit.particle.json",
      texture_reference: "textures/particle/dust_hit",
      texture_png: "textures/particle/dust_hit.png",
      texture_state: "READY",
      recommended_locator: "hoe_tip",
      recommended_animation: "harvest_cinnamon",
      trigger_intent: "tool contact with ground",
      trigger_time_seconds: 0.42,
      bind_to_actor: true,
      review_state: "APPROVED",
    });
  });

  test("keeps legacy model packages backward compatible when asset.kind is absent", async () => {
    const root = await referencePackage({
      schema: "lazydesigner-reference-v1",
      asset: {
        name: "market_stall",
        profile: "PROP_FURNITURE",
        task: "NEW_ASSET",
        intent: "Wood market stall",
      },
      requirements: {},
      unknowns: { blocking: [], non_blocking: [] },
      readiness: {
        overall: "READY",
        geometry: "READY",
        texture: "READY",
        animation: "NOT_REQUIRED",
      },
    });

    const projection = await readReferencePackageProjection(root);
    expect(projection.asset_kind).toBe("MODEL");
    expect(projection.selected_profile).toBe("PROP_FURNITURE");
    expect(projection.particle).toBeNull();
  });
});

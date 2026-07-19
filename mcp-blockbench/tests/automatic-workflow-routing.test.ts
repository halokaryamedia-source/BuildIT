import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  automaticStageNextOperation,
  compactStageContext,
} from "../src/server/automatic-stage-context-routing";

const read = (path: string) => readFileSync(path, "utf8");

function context(overrides: Record<string, any> = {}) {
  return {
    stage: "GEOMETRY",
    asset: { id: "rhino", display_name: "Rhino" },
    project: { runtime_uuid: "runtime-uuid", identity_ready: true },
    workflow: { state: "GEOMETRY_IN_PROGRESS", open_issues: [] },
    geometry: {
      runtime: { phase: "STRUCTURAL_DETAIL", rebuild_mode: false },
      latest_diagnosis: { result: "PASS", scope: null },
      part_constraints: [{ id: "body" }, { id: "head" }],
      rotation_contracts: { neck: {}, head: {} },
      panel_regions: { front: {}, left_side: {}, top_footprint: {} },
      ground_contacts: ["front_left", "front_right"],
    },
    ...overrides,
  };
}

describe("automatic Codex workflow routing", () => {
  test("routes a prepared stage directly to work without lease or identity steps", () => {
    expect(automaticStageNextOperation(context())).toBe("CONTINUE_GEOMETRY");
    expect(
      automaticStageNextOperation(
        context({
          stage: "TEXTURE",
          workflow: { state: "TEXTURE_IN_PROGRESS" },
        })
      )
    ).toBe("CONTINUE_TEXTURE_WORK");
  });

  test("routes a missing Blockbench project to canonical project creation", () => {
    expect(
      automaticStageNextOperation(
        context({ project: { runtime_uuid: null } })
      )
    ).toBe("create_project");
  });

  test("preserves review and final submission boundaries", () => {
    expect(
      automaticStageNextOperation(
        context({ workflow: { state: "GEOMETRY_REVIEW" } })
      )
    ).toBe("AWAIT_GEOMETRY_REVIEW");
    expect(
      automaticStageNextOperation(
        context({ geometry: { runtime: { phase: "FINAL_REVIEW_READY" } } })
      )
    ).toBe("submit_geometry_for_review");
  });

  test("returns summary counts instead of repeating full manifest contracts", () => {
    const compact = compactStageContext(context(), "CONTINUE_GEOMETRY");
    expect(compact.schema_version).toBe("3.0-compact");
    expect(compact.geometry.contract_summary).toEqual({
      part_constraint_count: 2,
      rotation_contract_ids: ["neck", "head"],
      required_views: ["front", "left_side", "top_footprint"],
      ground_contact_count: 2,
    });
    expect(compact.geometry.part_constraints).toBeUndefined();
    expect(compact.geometry.rotation_contracts).toBeUndefined();
    expect(compact.geometry.panel_regions).toBeUndefined();
    expect(compact.context_policy).toMatchObject({
      mode: "COMPACT_ON_DEMAND",
      full_manifest_omitted: true,
      authority_remains_in_reference_package: true,
    });
  });

  test("keeps manual identity and lease tools out of normalized stage routing", () => {
    const source = read("src/server/automatic-stage-context-routing.ts");
    expect(source).toContain("automatic_identity_reconciliation: true");
    expect(source).toContain("automatic_write_ownership: true");
    expect(source).toContain("manual_identity_sync_required: false");
    expect(source).toContain("manual_write_lease_required: false");
    expect(source).not.toContain('return "rebind_active_project_identity"');
    expect(source).not.toContain('return "manage_project_write_lease:acquire"');
  });

  test("automatically reconciles canonical runtime UUID metadata before mutations", () => {
    const source = read("src/server/automatic-project-identity-guard.ts");
    for (const marker of [
      "automatic_project_identity_reconciliation",
      "AUTO_IDENTITY_CONCURRENT_WRITER",
      "AUTO_IDENTITY_SAVE_PATH_MISMATCH",
      "writeJsonFilesAtomically",
      "state.state_revision = nextRevision",
      "installAutomaticProjectIdentityGuards",
    ]) {
      expect(source).toContain(marker);
    }
  });
});

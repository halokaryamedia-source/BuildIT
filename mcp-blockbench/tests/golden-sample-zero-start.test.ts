import { describe, expect, test } from "bun:test";
import {
  access,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { join, resolve } from "node:path";

const repoRoot = resolve(import.meta.dir, "../..");
const workspaceRoot = join(repoRoot, "workspace");
const indexPath = join(workspaceRoot, "workspace.json");

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function readJson(path: string): Promise<Record<string, any>> {
  return JSON.parse(await readFile(path, "utf8")) as Record<string, any>;
}

async function directoryEntries(path: string): Promise<string[]> {
  if (!(await exists(path))) return [];
  return (await readdir(path)).sort();
}

describe("Black Rhinoceros Golden Sample zero-start workspace", () => {
  test("copies approved references but never copies an existing model or runtime history", async () => {
    const assetId = `black_rhinoceros_ci_${process.pid}_${Date.now()}`;
    const activeRoot = join(workspaceRoot, "active", assetId);
    const originalIndex = (await exists(indexPath))
      ? await readFile(indexPath, "utf8")
      : null;

    try {
      const processResult = Bun.spawn(
        [
          process.execPath,
          "run",
          "workspace:sample",
          "--",
          "black_rhinoceros",
          "--asset-id",
          assetId,
          "--display-name",
          "Black Rhinoceros CI",
        ],
        {
          cwd: join(repoRoot, "mcp-blockbench"),
          stdout: "pipe",
          stderr: "pipe",
        }
      );

      const [exitCode, stdout, stderr] = await Promise.all([
        processResult.exited,
        new Response(processResult.stdout).text(),
        new Response(processResult.stderr).text(),
      ]);

      expect(exitCode, `${stdout}\n${stderr}`).toBe(0);
      expect(stderr).not.toContain("error:");
      expect(stdout).toContain('"status": "PASS"');
      expect(stdout).toContain('"prebuilt_model_copied": false');
      expect(stdout).toContain('"model_exists": false');
      expect(stdout).toContain('"next_action": "CREATE_PROJECT_THEN_SYNC_IDENTITY"');

      const blockbenchRoot = join(activeRoot, "blockbench");
      const mcpRoot = join(activeRoot, "mcp");
      const modelPath = join(blockbenchRoot, `${assetId}.bbmodel`);
      const state = await readJson(join(mcpRoot, "state.json"));
      const project = await readJson(join(mcpRoot, "project.json"));
      const manifest = await readJson(
        join(mcpRoot, "references", "reference_manifest.json")
      );

      expect(await exists(modelPath)).toBe(false);
      expect(state.lifecycle).toMatchObject({
        origin: "GOLDEN_SAMPLE_ZERO_START",
        sample_id: "black_rhinoceros",
        baseline_model_sha256: null,
      });
      expect(state.project).toMatchObject({
        name: null,
        uuid: null,
        save_path: `workspace/active/${assetId}/blockbench/${assetId}.bbmodel`,
      });
      expect(state.workflow).toMatchObject({
        state: "REFERENCE_READY",
        status: "READY",
        active_stage: "GEOMETRY",
        next_action: "CREATE_PROJECT_THEN_SYNC_IDENTITY",
      });
      expect(state.mcp).toMatchObject({
        profile_reconnect_required: false,
        stable_tool_surface: true,
        registered_tool_surface: "STABLE_FULL_LIBRARY",
        execution_surface: "ACTIVE_PROFILE_GUARDED",
      });
      expect(project.provenance).toMatchObject({
        type: "GOLDEN_SAMPLE_ZERO_START",
        sample_id: "black_rhinoceros",
        prebuilt_model_copied: false,
      });
      expect(manifest.asset).toMatchObject({
        id: assetId,
        canonical_model_filename: `${assetId}.bbmodel`,
      });

      for (const path of [
        join(mcpRoot, "references", "PRODUCTION_CONTEXT.md"),
        join(mcpRoot, "references", "GEOMETRY.md"),
        join(mcpRoot, "references", "TEXTURING.md"),
        join(mcpRoot, "references", "ANIMATION.md"),
        join(mcpRoot, "references", "VALIDATION.md"),
        join(mcpRoot, "references", "CODEX_REFERENCE_HANDOFF.md"),
        join(mcpRoot, "references", "black_rhinoceros_reference_visual.png"),
        join(mcpRoot, "references", "source", "original_reference.png"),
        join(blockbenchRoot, "references", "original_reference.png"),
        join(
          blockbenchRoot,
          "references",
          "black_rhinoceros_reference_visual.png"
        ),
      ]) {
        expect(await exists(path), path).toBe(true);
      }

      expect(await directoryEntries(join(mcpRoot, "checkpoints"))).toEqual([]);
      expect(await directoryEntries(join(mcpRoot, "reports"))).toEqual([]);
      for (const stage of ["geometry", "texture", "animation", "final"]) {
        expect(
          await directoryEntries(join(mcpRoot, "evidence", stage)),
          stage
        ).toEqual([]);
      }
    } finally {
      await rm(activeRoot, { recursive: true, force: true });
      if (originalIndex === null) {
        await rm(indexPath, { force: true });
      } else {
        await writeFile(indexPath, originalIndex);
      }
    }
  }, 30_000);
});

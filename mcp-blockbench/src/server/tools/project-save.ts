/// <reference types="blockbench-types" />

import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_STABLE } from "@/lib/constants";
import {
  assertInsideRoot,
  parentDirectory,
  readJsonFile,
  writeFileAtomically,
  writeJsonAtomically,
  type NativeFsLike,
} from "@/lib/atomicFiles";

const parameters = z.object({
  session_root: z.string().min(1),
  asset_id: z.string().regex(/^[a-z0-9_]+$/),
  expected_project_uuid: z.string().min(1),
});

export const canonicalProjectSaveToolDocs: ToolSpec[] = [
  {
    name: "save_canonical_project",
    description:
      "Compiles and atomically saves the active Blockbench project to the canonical workspace/active/<asset>/blockbench/<asset>.bbmodel path derived from the session root and state authority.",
    annotations: {
      title: "Save Canonical Blockbench Project",
      destructiveHint: false,
      openWorldHint: true,
    },
    parameters,
    status: STATUS_STABLE,
  },
];

function nativeFs(message: string): NativeFsLike {
  // @ts-ignore Blockbench runtime permission API.
  const fs = requireNativeModule("fs", { message, optional: false });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

function joinPath(root: string, relative: string): string {
  const separator = root.includes("\\") && !root.includes("/") ? "\\" : "/";
  return `${root.replace(/[\\/]$/, "")}${separator}${relative.replace(/^[\\/]/, "")}`;
}

function sha256(data: string | Buffer): string {
  // @ts-ignore Blockbench runtime permission API.
  const crypto = requireNativeModule("crypto", {
    message: "Canonical project save needs SHA-256 integrity metadata.",
    optional: false,
  }) as any;
  if (!crypto) throw new Error("Crypto access was denied.");
  return crypto.createHash("sha256").update(data).digest("hex");
}

function projectOutput(): string | Buffer {
  // @ts-ignore Blockbench runtime codec registry.
  const codec = Codecs.project as any;
  if (!codec || typeof codec.compile !== "function") {
    throw new Error('Blockbench project codec "project" is unavailable.');
  }
  const value = codec.compile(
    typeof codec.getExportOptions === "function" ? codec.getExportOptions() : undefined
  );
  if (value instanceof ArrayBuffer) return Buffer.from(value);
  if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
    return Buffer.from(value.buffer, value.byteOffset, value.byteLength);
  }
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

export function registerCanonicalProjectSaveTools(): void {
  createTool(
    canonicalProjectSaveToolDocs[0].name,
    {
      ...canonicalProjectSaveToolDocs[0],
      async execute({ session_root, asset_id, expected_project_uuid }) {
        if (!Project) throw new Error("No Blockbench project is open.");
        if (Project.uuid !== expected_project_uuid) {
          throw new Error(
            `PROJECT_UUID_MISMATCH: active ${Project.uuid}, expected ${expected_project_uuid}.`
          );
        }
        const fs = nativeFs("MCP canonical project save needs workspace write access.");
        const statePath = joinPath(session_root, "state.json");
        assertInsideRoot(statePath, session_root);
        const state = readJsonFile<Record<string, any>>(fs, statePath);
        if (state.asset?.id !== asset_id) {
          throw new Error(
            `ASSET_ID_MISMATCH: state has ${state.asset?.id ?? "unknown"}, expected ${asset_id}.`
          );
        }
        const activeRoot = parentDirectory(session_root);
        if (!activeRoot) {
          throw new Error(`CANONICAL_SESSION_ROOT_INVALID: ${session_root}`);
        }
        const canonicalPath = joinPath(
          activeRoot,
          `blockbench/${asset_id}.bbmodel`
        );
        const recorded = String(state.project?.save_path ?? "").replace(/\\/g, "/");
        if (
          recorded &&
          !canonicalPath.replace(/\\/g, "/").toLowerCase().endsWith(recorded.toLowerCase())
        ) {
          throw new Error(
            `CANONICAL_MODEL_STATE_PATH_MISMATCH: state has ${recorded}; derived ${canonicalPath}.`
          );
        }
        const output = projectOutput();
        writeFileAtomically(fs, canonicalPath, output);
        (Project as { save_path?: string }).save_path = canonicalPath;
        const byteLength = Buffer.isBuffer(output)
          ? output.byteLength
          : Buffer.byteLength(output, "utf8");
        const reportPath = joinPath(session_root, "reports/canonical-save.json");
        assertInsideRoot(reportPath, session_root);
        const report = {
          schema_version: "1.0",
          asset_id,
          project_uuid: Project.uuid,
          project_name: Project.name,
          path: canonicalPath,
          byte_length: byteLength,
          sha256: sha256(output),
          cube_count: Cube.all.length,
          group_count: Group.all.length,
          created_at: new Date().toISOString(),
        };
        writeJsonAtomically(fs, reportPath, report);
        return {
          content: [
            {
              type: "text",
              text: `Saved canonical project to ${canonicalPath}.`,
            },
          ],
          structuredContent: {
            status: "PASS",
            canonical_save: report,
            report_path: reportPath,
          },
        };
      },
    },
    canonicalProjectSaveToolDocs[0].status
  );
}

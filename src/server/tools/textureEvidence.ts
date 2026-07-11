/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_STABLE } from "@/lib/constants";
import { findTextureOrThrow } from "@/lib/util";

export const saveTextureEvidenceParameters = z.object({
  texture: z.string().min(1).describe("Explicit texture UUID, ID, or name."),
  path: z.string().min(1).describe("Absolute PNG output path inside the active asset session."),
  session_root: z.string().min(1).describe("Absolute SavedData/sessions/<asset> root used to constrain filesystem output."),
  expected_project_uuid: z.string().optional(),
});

export const textureEvidenceToolDocs: ToolSpec[] = [{
  name: "save_texture_evidence",
  description: "Writes one explicit project texture to a stable PNG evidence path atomically, constrained to the active asset session. Returns compact structured metadata instead of large base64 content.",
  annotations: { title: "Save Texture Evidence", readOnlyHint: true, openWorldHint: true },
  parameters: saveTextureEvidenceParameters,
  status: STATUS_STABLE,
}];

function normalizePath(value: string): string {
  return value.replace(/\\/g, "/").replace(/\/$/, "");
}

function assertInsideSession(path: string, sessionRoot: string): void {
  const normalizedPath = normalizePath(path).toLowerCase();
  const normalizedRoot = normalizePath(sessionRoot).toLowerCase();
  if (!(normalizedPath === normalizedRoot || normalizedPath.startsWith(`${normalizedRoot}/`))) {
    throw new Error(`EVIDENCE_PATH_OUTSIDE_SESSION: ${path}`);
  }
}

function dataUrlToBuffer(dataUrl: string): Buffer {
  const match = dataUrl.match(/^data:image\/png;base64,(.+)$/);
  if (!match) throw new Error("Texture did not provide a PNG data URL.");
  return Buffer.from(match[1], "base64");
}

export function registerTextureEvidenceTools() {
  createTool(textureEvidenceToolDocs[0].name, {
    ...textureEvidenceToolDocs[0],
    async execute({ texture, path, session_root, expected_project_uuid }) {
      if (!Project) throw new Error("No Blockbench project is open.");
      if (expected_project_uuid && Project.uuid !== expected_project_uuid) {
        throw new Error(`PROJECT_UUID_MISMATCH: active=${Project.uuid}, expected=${expected_project_uuid}`);
      }
      if (!path.toLowerCase().endsWith(".png")) {
        throw new Error("Texture evidence path must end with .png.");
      }
      assertInsideSession(path, session_root);

      const image = findTextureOrThrow(texture);
      const png = dataUrlToBuffer(image.getDataURL());

      // @ts-ignore - Blockbench v5 native permission API.
      const fs = requireNativeModule("fs", {
        message: "Filesystem access is required to save texture evidence.",
        detail: "The MCP plugin writes approved PNG evidence only inside the active asset session.",
        optional: false,
      }) as typeof import("node:fs");
      // @ts-ignore - Blockbench v5 native permission API.
      const pathModule = requireNativeModule("path", {
        message: "Path access is required to save texture evidence.",
        detail: "Used only to create the target evidence directory and temporary file path.",
        optional: false,
      }) as typeof import("node:path");

      if (!fs || !pathModule) throw new Error("Native filesystem/path permission was not granted.");

      const directory = pathModule.dirname(path);
      const temporaryPath = `${path}.tmp`;
      fs.mkdirSync(directory, { recursive: true });
      try {
        fs.writeFileSync(temporaryPath, png);
        fs.renameSync(temporaryPath, path);
      } catch (error) {
        try {
          if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
        } catch {
          // Best-effort temporary cleanup.
        }
        throw error;
      }

      return {
        content: [{ type: "text" as const, text: `Saved texture evidence ${image.name} to ${path}.` }],
        structuredContent: {
          status: "PASS",
          texture: { name: image.name, uuid: image.uuid, width: image.width, height: image.height },
          path,
          bytes: png.byteLength,
          project_uuid: Project.uuid,
        },
      };
    },
  }, textureEvidenceToolDocs[0].status);
}

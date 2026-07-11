/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL, STATUS_STABLE, VERSION } from "@/lib/constants";
import {
  assertInsideRoot,
  parentDirectory,
  type NativeFsLike,
  writeFileAtomically,
} from "@/lib/atomicFiles";
import { getExecutionProfileState } from "@/lib/executionState";

export const listExportFormatsParameters = z.object({
  only_current_format: z.boolean().optional().default(false),
});

export const exportModelParameters = z.object({
  codec_id: z.string().optional(),
  options: z.record(z.unknown()).optional(),
  path: z.string().optional().describe("Absolute output path."),
  session_root: z
    .string()
    .optional()
    .describe("When provided, output must remain inside this active asset session."),
  expected_project_uuid: z.string().optional(),
  max_content_length: z.number().int().min(0).max(2_000_000).optional().default(100_000),
});

export const saveProjectCheckpointParameters = z.object({
  asset_id: z.string().regex(/^[a-z0-9_]+$/),
  path: z.string().min(1).describe("Absolute .bbmodel checkpoint path."),
  metadata_path: z.string().optional(),
  session_root: z.string().optional(),
  checkpoint_name: z.string().min(1).max(120),
  stage: z.enum(["SESSION_START", "GEOMETRY", "TEXTURE", "ANIMATION", "FINAL_VALIDATION"]),
  state: z.string().min(1),
  expected_project_uuid: z.string().optional(),
  approved: z.boolean().optional().default(false),
  approval_ref: z.string().optional(),
  source_state_revision: z.number().int().min(0).optional().default(0),
  accepted_areas: z.array(z.string()).optional().default([]),
  open_issues: z.array(z.string()).optional().default([]),
});

export const exportToolDocs: ToolSpec[] = [
  {
    name: "list_export_formats",
    description: "Lists registered export codecs and their current-format compatibility.",
    annotations: { title: "List Export Formats", readOnlyHint: true },
    parameters: listExportFormatsParameters,
    status: STATUS_STABLE,
  },
  {
    name: "export_model",
    description:
      "Compiles the current project and optionally writes one sandboxed, atomically replaced final output with integrity metadata.",
    annotations: { title: "Export Model", destructiveHint: false, openWorldHint: true },
    parameters: exportModelParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "save_project_checkpoint",
    description:
      "Atomically saves a persistent .bbmodel checkpoint and metadata with real SHA-256 integrity fields.",
    annotations: { title: "Save Project Checkpoint", destructiveHint: false, openWorldHint: true },
    parameters: saveProjectCheckpointParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

interface RuntimeCodec {
  id?: string;
  name?: string;
  extension?: string;
  compile?: (options?: unknown) => unknown;
  export?: unknown;
  support_partial_export?: boolean;
  getExportOptions?: () => Record<string, unknown>;
  fileName?: () => string;
}

type Vec3 = [number, number, number];

function getCodecRegistry(): Record<string, RuntimeCodec> {
  // @ts-ignore - Blockbench runtime global.
  return Codecs as Record<string, RuntimeCodec>;
}

function writable(raw: unknown): {
  data: string | Buffer;
  byteLength: number;
  encoding: "utf-8" | "binary";
} {
  if (raw instanceof ArrayBuffer) {
    const data = Buffer.from(raw);
    return { data, byteLength: data.byteLength, encoding: "binary" };
  }
  if (ArrayBuffer.isView(raw) && !(raw instanceof DataView)) {
    const view = raw as ArrayBufferView;
    const data = Buffer.from(view.buffer, view.byteOffset, view.byteLength);
    return { data, byteLength: data.byteLength, encoding: "binary" };
  }
  const data =
    typeof raw === "string"
      ? raw
      : raw === null || raw === undefined
        ? ""
        : JSON.stringify(raw, null, 2);
  return { data, byteLength: Buffer.byteLength(data, "utf8"), encoding: "utf-8" };
}

function nativeFs(message: string): NativeFsLike {
  // @ts-ignore - Blockbench runtime permission API.
  const fs = requireNativeModule("fs", { message, optional: false });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

function sha256(data: string | Buffer): string {
  // @ts-ignore - Blockbench runtime permission API.
  const cryptoModule = requireNativeModule("crypto", {
    message: "MCP export integrity requires SHA-256 hashing.",
    optional: false,
  }) as { createHash: (algorithm: string) => { update: (value: string | Buffer) => any; digest: (encoding: string) => string } };
  if (!cryptoModule) throw new Error("Crypto access was denied.");
  return cryptoModule.createHash("sha256").update(data).digest("hex");
}

function defaultMetadataPath(path: string): string {
  return path.toLowerCase().endsWith(".bbmodel")
    ? `${path.slice(0, -8)}.json`
    : `${path}.json`;
}

function bounds(): { min: Vec3 | null; max: Vec3 | null; size: Vec3 | null } {
  const points: Vec3[] = [];
  for (const cube of Cube.all) {
    const from = cube.from as Vec3;
    const to = cube.to as Vec3;
    points.push(
      [Math.min(from[0], to[0]), Math.min(from[1], to[1]), Math.min(from[2], to[2])],
      [Math.max(from[0], to[0]), Math.max(from[1], to[1]), Math.max(from[2], to[2])]
    );
  }
  for (const mesh of Mesh.all) {
    const vertices = (mesh as unknown as { vertices?: Record<string, number[]> }).vertices;
    for (const vertex of Object.values(vertices ?? {})) {
      if (vertex.length >= 3) points.push([vertex[0], vertex[1], vertex[2]]);
    }
  }
  if (!points.length) return { min: null, max: null, size: null };
  const min: Vec3 = [Infinity, Infinity, Infinity];
  const max: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (const point of points) {
    for (let axis = 0; axis < 3; axis++) {
      min[axis] = Math.min(min[axis], point[axis]);
      max[axis] = Math.max(max[axis], point[axis]);
    }
  }
  return { min, max, size: [max[0] - min[0], max[1] - min[1], max[2] - min[2]] };
}

function checkpointPair(
  fs: NativeFsLike,
  modelPath: string,
  modelData: string | Buffer,
  metadataPath: string,
  metadataData: string
): void {
  const modelDirectory = parentDirectory(modelPath);
  const metadataDirectory = parentDirectory(metadataPath);
  if (modelDirectory) fs.mkdirSync(modelDirectory, { recursive: true });
  if (metadataDirectory) fs.mkdirSync(metadataDirectory, { recursive: true });

  const modelTemp = `${modelPath}.tmp`;
  const metadataTemp = `${metadataPath}.tmp`;
  const modelBackup = `${modelPath}.bak`;
  const metadataBackup = `${metadataPath}.bak`;
  for (const path of [modelTemp, metadataTemp, modelBackup, metadataBackup]) {
    if (fs.existsSync(path)) fs.rmSync(path, { force: true });
  }
  fs.writeFileSync(modelTemp, modelData);
  fs.writeFileSync(metadataTemp, metadataData);

  try {
    if (fs.existsSync(modelPath)) fs.renameSync(modelPath, modelBackup);
    if (fs.existsSync(metadataPath)) fs.renameSync(metadataPath, metadataBackup);
    fs.renameSync(modelTemp, modelPath);
    fs.renameSync(metadataTemp, metadataPath);
    if (fs.existsSync(modelBackup)) fs.rmSync(modelBackup, { force: true });
    if (fs.existsSync(metadataBackup)) fs.rmSync(metadataBackup, { force: true });
  } catch (error) {
    for (const path of [modelPath, metadataPath]) {
      if (fs.existsSync(path)) fs.rmSync(path, { force: true });
    }
    if (fs.existsSync(modelBackup)) fs.renameSync(modelBackup, modelPath);
    if (fs.existsSync(metadataBackup)) fs.renameSync(metadataBackup, metadataPath);
    for (const path of [modelTemp, metadataTemp]) {
      if (fs.existsSync(path)) fs.rmSync(path, { force: true });
    }
    throw error;
  }
}

function manifestHash(fs: NativeFsLike, sessionRoot?: string): string | null {
  if (!sessionRoot) return null;
  const path = `${sessionRoot.replace(/[\\/]$/, "")}/references/reference_manifest.json`;
  assertInsideRoot(path, sessionRoot);
  if (!fs.existsSync(path)) return null;
  return sha256(fs.readFileSync(path));
}

export function registerExportTools(): void {
  createTool(
    exportToolDocs[0].name,
    {
      ...exportToolDocs[0],
      async execute({ only_current_format }) {
        const registry = getCodecRegistry();
        // @ts-ignore - Blockbench runtime global.
        const currentCodec = (Format as { codec?: { id?: string } } | undefined)?.codec?.id;
        const codecs = Object.entries(registry)
          .map(([id, codec]) => ({
            id,
            name: codec.name ?? id,
            extension: codec.extension ?? null,
            has_compile: typeof codec.compile === "function",
            has_export: typeof codec.export === "function",
            supports_partial_export: Boolean(codec.support_partial_export),
            belongs_to_current_format: codec.id === currentCodec,
          }))
          .filter((codec) => !only_current_format || codec.belongs_to_current_format)
          .sort((a, b) => a.id.localeCompare(b.id));
        return {
          content: [{ type: "text" as const, text: `Found ${codecs.length} export codec(s).` }],
          structuredContent: { status: "PASS", current_format_codec: currentCodec ?? null, codecs },
        };
      },
    },
    exportToolDocs[0].status
  );

  createTool(
    exportToolDocs[1].name,
    {
      ...exportToolDocs[1],
      async execute({
        codec_id,
        options,
        path,
        session_root,
        expected_project_uuid,
        max_content_length,
      }) {
        if (!Project) throw new Error("No project is open.");
        if (expected_project_uuid && Project.uuid !== expected_project_uuid) {
          throw new Error(
            `PROJECT_UUID_MISMATCH: active ${Project.uuid}, expected ${expected_project_uuid}.`
          );
        }
        if (path && session_root) assertInsideRoot(path, session_root);

        const registry = getCodecRegistry();
        // @ts-ignore - Blockbench runtime global.
        const formatCodec = (Format as { codec?: { id?: string } } | undefined)?.codec;
        const resolvedId = codec_id ?? formatCodec?.id;
        if (!resolvedId) throw new Error("No export codec could be resolved.");
        const codec = registry[resolvedId];
        if (!codec || typeof codec.compile !== "function") {
          throw new Error(`Codec "${resolvedId}" is unavailable or cannot compile.`);
        }
        const raw = codec.compile(
          options ??
            (typeof codec.getExportOptions === "function"
              ? codec.getExportOptions()
              : undefined)
        );
        const output = writable(raw);
        if (!output.byteLength) throw new Error(`Codec "${resolvedId}" returned empty output.`);

        if (path) {
          const fs = nativeFs(`MCP export_model requested write access to ${path}`);
          writeFileAtomically(fs, path, output.data);
        }
        const full =
          output.encoding === "binary"
            ? (output.data as Buffer).toString("base64")
            : (output.data as string);
        const truncated = full.length > max_content_length;
        const returned =
          max_content_length === 0
            ? null
            : truncated
              ? full.slice(0, max_content_length)
              : full;
        return {
          content: [
            {
              type: "text" as const,
              text: path
                ? `Exported ${resolvedId} model to ${path}.`
                : `Compiled ${resolvedId} model (${output.byteLength} bytes).`,
            },
          ],
          structuredContent: {
            status: "PASS",
            codec_id: resolvedId,
            path: path ?? null,
            byte_length: output.byteLength,
            encoding: output.encoding,
            sha256: sha256(output.data),
            truncated,
            content: returned,
          },
        };
      },
    },
    exportToolDocs[1].status
  );

  createTool(
    exportToolDocs[2].name,
    {
      ...exportToolDocs[2],
      async execute({
        asset_id,
        path,
        metadata_path,
        session_root,
        checkpoint_name,
        stage,
        state,
        expected_project_uuid,
        approved,
        approval_ref,
        source_state_revision,
        accepted_areas,
        open_issues,
      }) {
        if (!Project) throw new Error("No project is open. Cannot create a checkpoint.");
        if (!path.toLowerCase().endsWith(".bbmodel")) {
          throw new Error("Checkpoint path must end with .bbmodel.");
        }
        if (expected_project_uuid && Project.uuid !== expected_project_uuid) {
          throw new Error(
            `PROJECT_UUID_MISMATCH: active ${Project.uuid}, expected ${expected_project_uuid}.`
          );
        }
        const metadataPath = metadata_path ?? defaultMetadataPath(path);
        if (session_root) {
          assertInsideRoot(path, session_root);
          assertInsideRoot(metadataPath, session_root);
        }

        const codec = getCodecRegistry().project;
        if (!codec || typeof codec.compile !== "function") {
          throw new Error('Blockbench project codec "project" is unavailable.');
        }
        const model = writable(
          codec.compile(
            typeof codec.getExportOptions === "function"
              ? codec.getExportOptions()
              : undefined
          )
        );
        if (!model.byteLength) throw new Error("Project codec returned empty checkpoint output.");
        const fs = nativeFs(`MCP save_project_checkpoint requested write access to ${path}`);
        const profile = getExecutionProfileState();
        const baseMetadata = {
          schema_version: "1.1",
          asset_id,
          checkpoint_name,
          stage,
          state,
          project_uuid: Project.uuid,
          project_name: Project.name,
          bbmodel_path: path,
          metadata_path: metadataPath,
          created_at: new Date().toISOString(),
          created_by: "mcp-blockbench",
          approved,
          approval_ref: approval_ref ?? null,
          source_state_revision,
          profile,
          plugin_version: VERSION,
          blockbench_version:
            typeof Blockbench !== "undefined"
              ? (Blockbench as unknown as { version?: string }).version ?? null
              : null,
          counts: {
            cubes: Cube.all.length,
            meshes: Mesh.all.length,
            groups: Group.all.length,
            textures: Texture.all.length,
            // @ts-ignore - runtime API.
            animations: Animation.all?.length ?? 0,
          },
          raw_model_bounds: bounds(),
          accepted_areas,
          open_issues,
          byte_length: model.byteLength,
          encoding: model.encoding,
          bbmodel_sha256: sha256(model.data),
          reference_manifest_sha256: manifestHash(fs, session_root),
        };
        const baseJson = JSON.stringify(baseMetadata, null, 2);
        const metadata = {
          ...baseMetadata,
          metadata_payload_sha256: sha256(baseJson),
        };
        checkpointPair(fs, path, model.data, metadataPath, JSON.stringify(metadata, null, 2));

        return {
          content: [
            {
              type: "text" as const,
              text: `Saved persistent checkpoint ${checkpoint_name} to ${path}.`,
            },
          ],
          structuredContent: { status: "PASS", checkpoint: metadata },
        };
      },
    },
    exportToolDocs[2].status
  );
}

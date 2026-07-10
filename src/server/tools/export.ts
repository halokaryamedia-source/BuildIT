/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL, STATUS_STABLE } from "@/lib/constants";

export const listExportFormatsParameters = z.object({
  only_current_format: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      "If true, only return codecs compatible with the current project's format."
    ),
});

export const exportModelParameters = z.object({
  codec_id: z
    .string()
    .optional()
    .describe(
      "Codec ID to use (for example project, bedrock, obj, or gltf). If omitted, uses the current format codec."
    ),
  options: z
    .record(z.unknown())
    .optional()
    .describe("Codec-specific export options."),
  path: z
    .string()
    .optional()
    .describe(
      "Absolute filesystem path to write the compiled model. Requires Blockbench filesystem permission."
    ),
  max_content_length: z
    .number()
    .int()
    .min(0)
    .max(2_000_000)
    .optional()
    .default(100_000)
    .describe(
      "Maximum characters returned in content. Use 0 when only writing to disk."
    ),
});

export const saveProjectCheckpointParameters = z.object({
  asset_id: z
    .string()
    .regex(/^[a-z0-9_]+$/)
    .describe("Lowercase snake_case asset ID used in checkpoint metadata."),
  path: z
    .string()
    .min(1)
    .describe(
      "Absolute .bbmodel checkpoint path, normally inside SavedData/sessions/<asset>/checkpoints/."
    ),
  metadata_path: z
    .string()
    .optional()
    .describe(
      "Optional absolute JSON metadata path. Defaults to the checkpoint path with .json extension."
    ),
  session_root: z
    .string()
    .optional()
    .describe(
      "Optional absolute active asset-session root. When provided, checkpoint and metadata paths must stay inside it."
    ),
  checkpoint_name: z
    .string()
    .min(1)
    .max(120)
    .describe("Stable checkpoint name such as 20_geometry_approved."),
  stage: z
    .enum(["SESSION_START", "GEOMETRY", "TEXTURE", "ANIMATION", "FINAL_VALIDATION"])
    .describe("Workflow stage represented by this checkpoint."),
  state: z.string().min(1).describe("Exact runtime state at checkpoint creation."),
  expected_project_uuid: z
    .string()
    .optional()
    .describe("When provided, checkpoint creation fails if the active project UUID differs."),
  approved: z.boolean().optional().default(false),
  approval_ref: z.string().optional(),
  source_state_revision: z.number().int().min(0).optional().default(0),
  accepted_areas: z.array(z.string()).optional().default([]),
  open_issues: z.array(z.string()).optional().default([]),
});

export const exportToolDocs: ToolSpec[] = [
  {
    name: "list_export_formats",
    description:
      "Lists registered export codecs and whether they can compile/export.",
    annotations: {
      title: "List Export Formats",
      readOnlyHint: true,
    },
    parameters: listExportFormatsParameters,
    status: STATUS_STABLE,
  },
  {
    name: "export_model",
    description:
      "Compiles the current project through a chosen codec and optionally writes it to disk.",
    annotations: {
      title: "Export Model",
      destructiveHint: false,
      openWorldHint: true,
    },
    parameters: exportModelParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "save_project_checkpoint",
    description:
      "Atomically saves the active project as a persistent .bbmodel checkpoint and writes adjacent workflow metadata.",
    annotations: {
      title: "Save Project Checkpoint",
      destructiveHint: false,
      openWorldHint: true,
    },
    parameters: saveProjectCheckpointParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

interface ICodecSummary {
  id: string;
  name: string;
  extension: string | null;
  has_compile: boolean;
  has_export: boolean;
  supports_partial_export: boolean;
  belongs_to_current_format: boolean;
}

interface RuntimeCodec {
  id?: string;
  name?: string;
  extension?: string;
  compile?: (opts?: unknown) => unknown;
  export?: unknown;
  support_partial_export?: boolean;
  getExportOptions?: () => Record<string, unknown>;
  fileName?: () => string;
}

type Vec3 = [number, number, number];

function isStringifiable(value: unknown): value is string {
  return typeof value === "string";
}

function toTextContent(raw: unknown): string {
  if (raw === null || raw === undefined) return "";
  if (isStringifiable(raw)) return raw;
  if (raw instanceof ArrayBuffer) {
    return `[binary: ${raw.byteLength} bytes]`;
  }
  if (typeof raw === "object") {
    try {
      return JSON.stringify(raw, null, 2);
    } catch {
      return String(raw);
    }
  }
  return String(raw);
}

function toWritableData(raw: unknown): {
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

  const data = toTextContent(raw);
  return {
    data,
    byteLength: Buffer.byteLength(data, "utf8"),
    encoding: "utf-8",
  };
}

function getCodecRegistry(): Record<string, RuntimeCodec> {
  // @ts-ignore - Codecs is a Blockbench runtime global.
  return Codecs as Record<string, RuntimeCodec>;
}

function getProjectCodecOrThrow(): RuntimeCodec & {
  compile: (opts?: unknown) => unknown;
} {
  const registry = getCodecRegistry();
  const codec = registry.project;
  if (!codec || typeof codec.compile !== "function") {
    throw new Error(
      'Blockbench project codec "project" is unavailable or cannot compile .bbmodel files.'
    );
  }
  return codec as RuntimeCodec & { compile: (opts?: unknown) => unknown };
}

function parentDirectory(path: string): string | null {
  const normalized = path.replace(/\\/g, "/");
  const index = normalized.lastIndexOf("/");
  if (index <= 0) return null;
  return path.slice(0, index);
}

function defaultMetadataPath(path: string): string {
  return path.toLowerCase().endsWith(".bbmodel")
    ? `${path.slice(0, -8)}.json`
    : `${path}.json`;
}

function normalizePathForCompare(path: string): string {
  const normalized = path.replace(/\\/g, "/").replace(/\/$/, "");
  return /^[a-zA-Z]:\//.test(normalized) ? normalized.toLowerCase() : normalized;
}

function assertInsideSession(path: string, sessionRoot?: string): void {
  if (!sessionRoot) return;
  const target = normalizePathForCompare(path);
  const root = normalizePathForCompare(sessionRoot);
  if (target !== root && !target.startsWith(`${root}/`)) {
    throw new Error(
      `Checkpoint output "${path}" is outside the approved session root "${sessionRoot}".`
    );
  }
}

function getRawGeometryBounds(): {
  min: Vec3 | null;
  max: Vec3 | null;
  size: Vec3 | null;
} {
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
    if (!vertices) continue;
    for (const vertex of Object.values(vertices)) {
      if (Array.isArray(vertex) && vertex.length >= 3) {
        points.push([Number(vertex[0]), Number(vertex[1]), Number(vertex[2])]);
      }
    }
  }

  if (points.length === 0) {
    return { min: null, max: null, size: null };
  }

  const min: Vec3 = [Infinity, Infinity, Infinity];
  const max: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (const point of points) {
    for (let axis = 0; axis < 3; axis++) {
      min[axis] = Math.min(min[axis], point[axis]);
      max[axis] = Math.max(max[axis], point[axis]);
    }
  }

  return {
    min,
    max,
    size: [max[0] - min[0], max[1] - min[1], max[2] - min[2]],
  };
}

function restoreBackup(fs: any, target: string, backup: string): void {
  if (fs.existsSync(target)) fs.rmSync(target, { force: true });
  if (fs.existsSync(backup)) fs.renameSync(backup, target);
}

function replacePairAtomically(
  fs: any,
  modelTemp: string,
  modelTarget: string,
  metadataTemp: string,
  metadataTarget: string
): void {
  const modelBackup = `${modelTarget}.bak`;
  const metadataBackup = `${metadataTarget}.bak`;

  for (const backup of [modelBackup, metadataBackup]) {
    if (fs.existsSync(backup)) fs.rmSync(backup, { force: true });
  }

  if (fs.existsSync(modelTarget)) fs.renameSync(modelTarget, modelBackup);
  if (fs.existsSync(metadataTarget)) fs.renameSync(metadataTarget, metadataBackup);

  try {
    fs.renameSync(modelTemp, modelTarget);
    fs.renameSync(metadataTemp, metadataTarget);
    if (fs.existsSync(modelBackup)) fs.rmSync(modelBackup, { force: true });
    if (fs.existsSync(metadataBackup)) fs.rmSync(metadataBackup, { force: true });
  } catch (error) {
    restoreBackup(fs, modelTarget, modelBackup);
    restoreBackup(fs, metadataTarget, metadataBackup);
    throw error;
  }
}

export function registerExportTools() {
  createTool(
    exportToolDocs[0].name,
    {
      ...exportToolDocs[0],
      async execute({ only_current_format }) {
        const registry = getCodecRegistry();
        // @ts-ignore - Format is a Blockbench runtime global.
        const currentFormatCodecId = (Format as { codec?: { id?: string } } | undefined)
          ?.codec?.id;

        const summaries: ICodecSummary[] = Object.entries(registry).map(
          ([id, codec]) => ({
            id,
            name: codec.name ?? id,
            extension: codec.extension ?? null,
            has_compile: typeof codec.compile === "function",
            has_export: typeof codec.export === "function",
            supports_partial_export: Boolean(codec.support_partial_export),
            belongs_to_current_format: codec.id === currentFormatCodecId,
          })
        );

        const filtered = only_current_format
          ? summaries.filter((summary) => summary.belongs_to_current_format)
          : summaries;

        return {
          content: [
            {
              type: "text" as const,
              text: `Found ${filtered.length} export codec(s).`,
            },
          ],
          structuredContent: {
            current_format_codec: currentFormatCodecId ?? null,
            count: filtered.length,
            codecs: filtered.sort((a, b) => a.id.localeCompare(b.id)),
          },
        };
      },
    },
    exportToolDocs[0].status
  );

  createTool(
    exportToolDocs[1].name,
    {
      ...exportToolDocs[1],
      async execute({ codec_id, options, path, max_content_length }) {
        if (!Project) {
          throw new Error("No project is open. Use create_project or open a project first.");
        }

        const registry = getCodecRegistry();
        // @ts-ignore - Format is a Blockbench runtime global.
        const formatCodec = (Format as { codec?: { id?: string } } | undefined)?.codec;
        const resolvedId = codec_id ?? formatCodec?.id;

        if (!resolvedId) {
          throw new Error(
            "No codec_id was provided and the current format has no default codec."
          );
        }

        const codec = registry[resolvedId];
        if (!codec) {
          throw new Error(
            `Codec "${resolvedId}" not found. Use list_export_formats to inspect available codecs.`
          );
        }
        if (typeof codec.compile !== "function") {
          throw new Error(`Codec "${resolvedId}" does not support compile().`);
        }

        const effectiveOptions =
          options ??
          (typeof codec.getExportOptions === "function"
            ? codec.getExportOptions()
            : undefined);
        const rawResult = codec.compile(effectiveOptions);
        const writable = toWritableData(rawResult);
        if (writable.byteLength === 0) {
          throw new Error(`Codec "${resolvedId}" returned empty output.`);
        }

        let wroteToPath: string | null = null;
        if (path) {
          // @ts-ignore - requireNativeModule is a Blockbench runtime global.
          const fs = requireNativeModule("fs", {
            message: `MCP export_model requested write access to save ${path}`,
          });
          if (!fs) {
            throw new Error("Filesystem access was denied.");
          }
          const directory = parentDirectory(path);
          if (directory) fs.mkdirSync(directory, { recursive: true });
          fs.writeFileSync(path, writable.data);
          wroteToPath = path;
        }

        const fullContent =
          writable.encoding === "binary"
            ? (writable.data as Buffer).toString("base64")
            : (writable.data as string);
        const truncated = fullContent.length > max_content_length;
        const returnedContent =
          max_content_length === 0
            ? null
            : truncated
              ? fullContent.slice(0, max_content_length)
              : fullContent;

        return {
          content: [
            {
              type: "text" as const,
              text: wroteToPath
                ? `Exported ${resolvedId} model to ${wroteToPath}.`
                : `Compiled ${resolvedId} model (${writable.byteLength} bytes).`,
            },
          ],
          structuredContent: {
            codec: {
              id: resolvedId,
              name: codec.name ?? resolvedId,
              extension: codec.extension ?? null,
            },
            file_name:
              typeof codec.fileName === "function" ? codec.fileName() : Project.name,
            byte_length: writable.byteLength,
            encoding: writable.encoding,
            wrote_to_path: wroteToPath,
            truncated,
            content: returnedContent,
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
        if (!Project) {
          throw new Error("No project is open. Cannot create a checkpoint.");
        }
        if (!path.toLowerCase().endsWith(".bbmodel")) {
          throw new Error("Checkpoint path must end with .bbmodel.");
        }
        if (expected_project_uuid && Project.uuid !== expected_project_uuid) {
          throw new Error(
            `Active project UUID ${Project.uuid} does not match expected UUID ${expected_project_uuid}.`
          );
        }

        const metadataPath = metadata_path ?? defaultMetadataPath(path);
        assertInsideSession(path, session_root);
        assertInsideSession(metadataPath, session_root);

        const codec = getProjectCodecOrThrow();
        const rawResult = codec.compile(
          typeof codec.getExportOptions === "function"
            ? codec.getExportOptions()
            : undefined
        );
        const writable = toWritableData(rawResult);
        if (writable.byteLength === 0) {
          throw new Error("Blockbench project codec returned empty checkpoint output.");
        }

        // @ts-ignore - requireNativeModule is a Blockbench runtime global.
        const fs = requireNativeModule("fs", {
          message: `MCP save_project_checkpoint requested write access to ${path}`,
        });
        if (!fs) {
          throw new Error("Filesystem access was denied. Checkpoint was not created.");
        }

        const modelDirectory = parentDirectory(path);
        const metadataDirectory = parentDirectory(metadataPath);
        if (modelDirectory) fs.mkdirSync(modelDirectory, { recursive: true });
        if (metadataDirectory) fs.mkdirSync(metadataDirectory, { recursive: true });

        const bounds = getRawGeometryBounds();
        const metadata = {
          schema_version: "1.0",
          asset_id,
          checkpoint_name,
          stage,
          state,
          project_uuid: Project.uuid,
          project_name: Project.name,
          bbmodel_path: path,
          metadata_path: metadataPath,
          created_at: new Date().toISOString(),
          created_by: "codex",
          approved,
          approval_ref: approval_ref ?? null,
          source_state_revision,
          counts: {
            cubes: Cube.all.length,
            meshes: Mesh.all.length,
            groups: Group.all.length,
            textures: Texture.all.length,
            // @ts-ignore - Animation.all exists at runtime.
            animations: Animation.all?.length ?? 0,
          },
          raw_model_bounds: bounds,
          accepted_areas,
          open_issues,
          byte_length: writable.byteLength,
          encoding: writable.encoding,
          sha256: null,
        };

        const modelTemp = `${path}.tmp`;
        const metadataTemp = `${metadataPath}.tmp`;

        try {
          fs.writeFileSync(modelTemp, writable.data);
          fs.writeFileSync(metadataTemp, JSON.stringify(metadata, null, 2));
          replacePairAtomically(fs, modelTemp, path, metadataTemp, metadataPath);
        } catch (error) {
          try {
            if (fs.existsSync(modelTemp)) fs.rmSync(modelTemp, { force: true });
            if (fs.existsSync(metadataTemp)) fs.rmSync(metadataTemp, { force: true });
          } catch {
            // Preserve the original write error.
          }
          throw error;
        }

        return {
          content: [
            {
              type: "text" as const,
              text: `Saved persistent checkpoint ${checkpoint_name} to ${path}.`,
            },
          ],
          structuredContent: {
            status: "PASS",
            checkpoint: metadata,
          },
        };
      },
    },
    exportToolDocs[2].status
  );
}

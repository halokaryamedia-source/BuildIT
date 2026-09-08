/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL } from "@/lib/constants";
import { isAbsoluteFilesystemPath } from "@/lib/util";
import {
  BEDROCK_PARTICLE_PRESETS,
  applyParticleOperations,
  createParticleDocument,
  inspectParticleDocument,
  isBedrockParticleIdentifier,
  parseParticleDocument,
  serializeParticleDocument,
  type JsonValue,
} from "@/lib/bedrockParticleDocument";

const particlePathSchema = z
  .string()
  .refine(isAbsoluteFilesystemPath, {
    message:
      "Particle path must be absolute: use a POSIX `/...` path, a Windows drive path such as `C:\\\\...`, or a UNC path.",
  })
  .refine((value) => value.toLowerCase().endsWith(".particle.json"), {
    message: "Particle files must use the .particle.json suffix.",
  });

const particleIdentifierSchema = z
  .string()
  .refine(isBedrockParticleIdentifier, {
    message: "Particle identifier must use lowercase namespace:path syntax.",
  });

const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number().finite(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(jsonValueSchema),
  ])
);

const particleSourceSchema = z
  .object({
    path: particlePathSchema.optional(),
    content: z.string().min(2).optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if ((value.path === undefined) === (value.content === undefined)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide exactly one source.path or source.content.",
      });
    }
  });

const createParticleSchema = z
  .object({
    identifier: particleIdentifierSchema,
    preset: z.enum(BEDROCK_PARTICLE_PRESETS).optional().default("steady"),
    material: z.string().min(1).optional(),
    texture: z.string().min(1).optional(),
  })
  .strict();

const setRenderOperationSchema = z
  .object({
    op: z.literal("set_render"),
    material: z.union([z.string().min(1), z.null()]).optional(),
    texture: z.union([z.string().min(1), z.null()]).optional(),
  })
  .strict();

const patchOperationSchema = z
  .object({
    op: z.literal("patch"),
    path: z
      .array(z.union([z.string().min(1), z.number().int().min(0)]))
      .min(1)
      .max(16)
      .describe("Path relative to particle_effect, for targeted lossless edits."),
    value: jsonValueSchema.optional(),
    remove: z.boolean().optional(),
  })
  .strict();

export const particleMutationOperationSchema = z
  .union([
    z.object({ op: z.literal("set_identifier"), identifier: particleIdentifierSchema }).strict(),
    setRenderOperationSchema,
    z.object({
      op: z.literal("set_component"),
      component: z.string().min(1),
      value: jsonValueSchema,
    }).strict(),
    z.object({ op: z.literal("remove_component"), component: z.string().min(1) }).strict(),
    z.object({ op: z.literal("set_curve"), name: z.string().min(1), value: jsonValueSchema }).strict(),
    z.object({ op: z.literal("remove_curve"), name: z.string().min(1) }).strict(),
    z.object({ op: z.literal("set_event"), name: z.string().min(1), value: jsonValueSchema }).strict(),
    z.object({ op: z.literal("remove_event"), name: z.string().min(1) }).strict(),
    patchOperationSchema,
  ])
  .superRefine((operation, ctx) => {
    if (operation.op === "set_render") {
      if (operation.material === undefined && operation.texture === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "set_render requires material and/or texture.",
        });
      }
      return;
    }
    if (operation.op === "patch") {
      if (operation.remove === true && operation.value !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["value"],
          message: "patch remove=true must omit value.",
        });
      } else if (operation.remove !== true && operation.value === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["value"],
          message: "patch requires value unless remove=true.",
        });
      }
    }
  });

export const inspectParticleParameters = z
  .object({
    source: particleSourceSchema,
    mode: z.enum(["summary", "components", "full"]).optional().default("summary"),
    max_content_length: z.number().int().min(0).max(2_000_000).optional().default(100_000),
  })
  .strict();

export const manageParticleParameters = z
  .object({
    source: particleSourceSchema.optional(),
    create: createParticleSchema.optional(),
    operations: z
      .array(particleMutationOperationSchema)
      .max(64)
      .optional()
      .default([])
      .describe("Ordered targeted particle mutations. Use patch for deep edits without replacing unknown sibling fields."),
    output: z
      .object({
        path: particlePathSchema,
        overwrite: z.boolean().optional().default(false),
      })
      .strict()
      .optional(),
    preview: z
      .boolean()
      .optional()
      .default(false)
      .describe("Load the resulting document through Blockbench Animator.loadParticleEmitter using an existing source path or verified output path."),
    max_content_length: z.number().int().min(0).max(2_000_000).optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if ((value.source === undefined) === (value.create === undefined)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide exactly one source or create input.",
      });
    }
  });

export const particleToolDocs: ToolSpec[] = [
  {
    name: "inspect_particle",
    description:
      "Inspects a Bedrock .particle.json document from an absolute path or inline content. Defaults to compact summary diagnostics; component and full modes are explicit to keep context usage bounded.",
    annotations: { title: "Inspect Bedrock Particle", readOnlyHint: true, openWorldHint: true },
    parameters: inspectParticleParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "manage_particle",
    description:
      "Creates or losslessly patches a Bedrock .particle.json document, preserves unknown JSON fields, validates final particle semantics, optionally writes one verified file, and can load the result into Blockbench's native particle preview. Animation/controller timing and binding remain owned by existing animation tools.",
    annotations: { title: "Manage Bedrock Particle", destructiveHint: true, openWorldHint: true },
    parameters: manageParticleParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

type ParticleFilesystem = {
  existsSync(path: string): boolean;
  readFileSync(path: string, encoding: "utf8"): string;
  writeFileSync(path: string, data: string): void;
  statSync(path: string): { isFile(): boolean; size: number };
};

function requireParticleFilesystem(reason: string): ParticleFilesystem {
  // @ts-ignore - Blockbench desktop provides fs through requireNativeModule.
  const fs = requireNativeModule("fs", { message: reason }) as ParticleFilesystem | undefined;
  if (!fs) {
    throw new Error(
      "File system access was denied. Pass inline source.content for reads or omit output.path to receive compiled particle content."
    );
  }
  return fs;
}

function readParticleSource(source: z.infer<typeof particleSourceSchema>): {
  document: ReturnType<typeof parseParticleDocument>;
  source_path: string | null;
} {
  if (source.content !== undefined) {
    return { document: parseParticleDocument(source.content), source_path: null };
  }
  const path = source.path!;
  const fs = requireParticleFilesystem(`BlockIT requested read access to inspect Bedrock particle ${path}`);
  if (!fs.existsSync(path)) throw new Error(`Particle source file does not exist: ${path}`);
  return {
    document: parseParticleDocument(fs.readFileSync(path, "utf8")),
    source_path: path,
  };
}

function normalizePathIdentity(path: string): string {
  let normalized = path.replace(/\\/g, "/").replace(/\/{2,}/g, "/").replace(/\/$/, "");
  if (/^[A-Za-z]:\//.test(normalized) || path.startsWith("\\\\")) {
    normalized = normalized.toLowerCase();
  }
  return normalized;
}

function sliceWithoutSplittingSurrogatePair(value: string, maxChars: number): string {
  if (maxChars <= 0 || value.length <= maxChars) return maxChars <= 0 ? "" : value;
  let end = maxChars;
  const lastCodeUnit = value.charCodeAt(end - 1);
  if (lastCodeUnit >= 0xd800 && lastCodeUnit <= 0xdbff) end -= 1;
  return value.slice(0, end);
}

function compactInspectResult(
  document: ReturnType<typeof parseParticleDocument>,
  mode: "summary" | "components" | "full",
  maxContentLength: number
) {
  const summary = inspectParticleDocument(document);
  if (mode === "summary") return { summary };
  if (mode === "components") {
    const effect = document.particle_effect as Record<string, JsonValue>;
    return {
      summary,
      components:
        effect && typeof effect === "object" && !Array.isArray(effect)
          ? ((effect.components as Record<string, JsonValue> | undefined) ?? {})
          : {},
    };
  }
  const serialized = serializeParticleDocument(document);
  const truncated = maxContentLength > 0 && serialized.length > maxContentLength;
  return {
    summary,
    truncated,
    content:
      maxContentLength === 0
        ? null
        : truncated
          ? sliceWithoutSplittingSurrogatePair(serialized, maxContentLength)
          : serialized,
  };
}

function loadNativeParticlePreview(path: string, content: string): void {
  if (typeof Animator === "undefined" || typeof Animator.loadParticleEmitter !== "function") {
    throw new Error("Blockbench native particle preview is unavailable in this runtime.");
  }
  Animator.loadParticleEmitter(path, content);
}

export function registerParticleTools(): void {
  createTool(
    particleToolDocs[0].name,
    {
      ...particleToolDocs[0],
      parameters: inspectParticleParameters,
      async execute({ source, mode, max_content_length }) {
        const { document, source_path } = readParticleSource(source);
        const result = compactInspectResult(document, mode, max_content_length);
        const summary = result.summary;
        return {
          content: [
            {
              type: "text" as const,
              text: `Inspected particle ${summary.identifier ?? "<missing identifier>"}: ${summary.component_count} components, ${summary.diagnostics.length} diagnostics.`,
            },
          ],
          structuredContent: {
            source_path,
            mode,
            ...result,
          },
        };
      },
    },
    particleToolDocs[0].status,
    false
  );

  createTool(
    particleToolDocs[1].name,
    {
      ...particleToolDocs[1],
      parameters: manageParticleParameters,
      async execute({ source, create, operations, output, preview, max_content_length }) {
        const base = source
          ? readParticleSource(source)
          : {
              document: createParticleDocument(create!),
              source_path: null,
            };
        const document = applyParticleOperations(base.document, operations);
        const summary = inspectParticleDocument(document);
        const valid = !summary.diagnostics.some((entry) => entry.severity === "error");
        const serialized = serializeParticleDocument(document);
        const byteLength = Buffer.byteLength(serialized, "utf8");

        let wroteToPath: string | null = null;
        if (output && valid) {
          const fs = requireParticleFilesystem(
            `BlockIT requested write access to save Bedrock particle ${output.path}`
          );
          const sourceIdentity = base.source_path ? normalizePathIdentity(base.source_path) : null;
          const outputIdentity = normalizePathIdentity(output.path);
          const replacingExplicitSource = sourceIdentity !== null && sourceIdentity === outputIdentity;
          if (fs.existsSync(output.path) && !replacingExplicitSource && output.overwrite !== true) {
            throw new Error(
              `Refusing to replace existing particle file ${output.path} without overwrite=true.`
            );
          }
          fs.writeFileSync(output.path, serialized);
          const stat = fs.statSync(output.path);
          if (!stat.isFile() || stat.size !== byteLength) {
            throw new Error(
              `Particle write verification failed for ${output.path}: expected ${byteLength} bytes, got ${stat.isFile() ? stat.size : "a non-file target"}.`
            );
          }
          wroteToPath = output.path;
        }

        let previewPath: string | null = null;
        if (preview && valid) {
          previewPath = wroteToPath ?? base.source_path;
          if (!previewPath) {
            throw new Error(
              "Native particle preview requires an existing source.path or verified output.path; inline-only documents have no stable Blockbench file identity."
            );
          }
          loadNativeParticlePreview(previewPath, serialized);
        }

        const effectiveMaxContentLength =
          max_content_length ?? (wroteToPath ? 0 : 100_000);
        const truncated =
          effectiveMaxContentLength > 0 && serialized.length > effectiveMaxContentLength;
        const returnedContent =
          effectiveMaxContentLength === 0
            ? null
            : truncated
              ? sliceWithoutSplittingSurrogatePair(serialized, effectiveMaxContentLength)
              : serialized;

        return {
          content: [
            {
              type: "text" as const,
              text: valid
                ? `Prepared particle ${summary.identifier}: ${summary.component_count} components${wroteToPath ? "; verified file write" : ""}${previewPath ? "; native preview loaded" : ""}.`
                : `Particle ${summary.identifier ?? "<missing identifier>"} has validation errors; no file write or preview was performed.`,
            },
          ],
          structuredContent: {
            valid,
            source_path: base.source_path,
            wrote_to_path: wroteToPath,
            preview_path: previewPath,
            byte_length: byteLength,
            operation_count: operations.length,
            summary,
            truncated,
            content: returnedContent,
          },
        };
      },
    },
    particleToolDocs[1].status
  );
}

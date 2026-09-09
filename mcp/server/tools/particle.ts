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
import {
  assertParticleSourceSnapshotMatches,
  assertParticleWriteRevisionUnchanged,
  captureParticleWriteRevision,
} from "@/lib/particleWriteRevision";

const absoluteJsonPathSchema = z
  .string()
  .refine(isAbsoluteFilesystemPath, {
    message:
      "Path must be absolute: use a POSIX `/...` path, a Windows drive path such as `C:\\\\...`, or a UNC path.",
  });

const particlePathSchema = absoluteJsonPathSchema.refine(
  (value) => value.toLowerCase().endsWith(".particle.json"),
  { message: "Particle files must use the .particle.json suffix." }
);

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

function exactlyOneSourceSchema(pathSchema: z.ZodType<string>, label: string) {
  return z
    .object({
      path: pathSchema.optional(),
      content: z.string().min(2).optional(),
    })
    .strict()
    .superRefine((value, ctx) => {
      if ((value.path === undefined) === (value.content === undefined)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Provide exactly one ${label}.path or ${label}.content.`,
        });
      }
    });
}

const particleSourceSchema = exactlyOneSourceSchema(particlePathSchema, "source");

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
    z
      .object({
        op: z.literal("set_identifier"),
        identifier: particleIdentifierSchema,
      })
      .strict(),
    setRenderOperationSchema,
    z
      .object({
        op: z.literal("set_component"),
        component: z.string().min(1),
        value: jsonValueSchema,
      })
      .strict(),
    z
      .object({
        op: z.literal("remove_component"),
        component: z.string().min(1),
      })
      .strict(),
    z
      .object({
        op: z.literal("set_curve"),
        name: z.string().min(1),
        value: jsonValueSchema,
      })
      .strict(),
    z
      .object({ op: z.literal("remove_curve"), name: z.string().min(1) })
      .strict(),
    z
      .object({
        op: z.literal("set_event"),
        name: z.string().min(1),
        value: jsonValueSchema,
      })
      .strict(),
    z
      .object({ op: z.literal("remove_event"), name: z.string().min(1) })
      .strict(),
    patchOperationSchema,
  ])
  .superRefine((operation, ctx) => {
    if (operation.op === "set_render") {
      if (
        operation.material === undefined &&
        operation.texture === undefined
      ) {
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
      } else if (
        operation.remove !== true &&
        operation.value === undefined
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["value"],
          message: "patch requires value unless remove=true.",
        });
      }
    }
  });

const outputPathSchema = <T extends z.ZodType<string>>(pathSchema: T) =>
  z
    .object({
      path: pathSchema,
      overwrite: z.boolean().optional().default(false),
    })
    .strict();

export const inspectParticleParameters = z
  .object({
    source: particleSourceSchema,
    mode: z
      .enum(["summary", "components", "full"])
      .optional()
      .default("summary"),
    max_content_length: z
      .number()
      .int()
      .min(0)
      .max(2_000_000)
      .optional()
      .default(100_000),
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
      .describe(
        "Ordered targeted particle mutations. Use patch for deep edits without replacing unknown sibling fields."
      ),
    output: outputPathSchema(particlePathSchema).optional(),
    preview: z
      .boolean()
      .optional()
      .default(false)
      .describe(
        "Load the resulting document through Blockbench Animator.loadParticleEmitter using an existing source path or verified output path."
      ),
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
    annotations: {
      title: "Inspect Bedrock Particle",
      readOnlyHint: true,
      openWorldHint: true,
    },
    parameters: inspectParticleParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "manage_particle",
    description:
      "Creates or losslessly patches a Bedrock .particle.json document, preserves unknown JSON fields, validates final particle semantics, optionally performs a verified transactional file write, and can load the particle into Blockbench's native preview. Animation/controller timing and downstream runtime binding remain owned by existing animation/controller tools.",
    annotations: {
      title: "Manage Bedrock Particle",
      destructiveHint: true,
      openWorldHint: true,
    },
    parameters: manageParticleParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

type ParticleFilesystem = {
  existsSync(path: string): boolean;
  readFileSync(path: string, encoding: "utf8"): string;
  writeFileSync(path: string, data: string): void;
  statSync(path: string): { isFile(): boolean; size: number };
  renameSync(oldPath: string, newPath: string): void;
  unlinkSync(path: string): void;
};

type PlannedWrite = {
  kind: "particle";
  path: string;
  content: string;
  allow_replace: boolean;
  expected_existing_content?: string;
};

type WriteReceipt = {
  kind: PlannedWrite["kind"];
  path: string;
  byte_length: number;
  replaced_existing: boolean;
};

function requireParticleFilesystem(reason: string): ParticleFilesystem {
  // @ts-ignore - Blockbench desktop provides fs through requireNativeModule.
  const fs = requireNativeModule("fs", {
    message: reason,
  }) as ParticleFilesystem | undefined;
  if (!fs) {
    throw new Error(
      "File system access was denied. Pass inline source.content for reads or omit output paths to receive compiled JSON content."
    );
  }
  return fs;
}

function readParticleSource(
  source: z.infer<typeof particleSourceSchema>
): {
  document: ReturnType<typeof parseParticleDocument>;
  source_path: string | null;
  source_content: string | null;
} {
  if (source.content !== undefined) {
    return {
      document: parseParticleDocument(source.content),
      source_path: null,
      source_content: null,
    };
  }
  const path = source.path!;
  const fs = requireParticleFilesystem(
    `BlockIT requested read access to inspect Bedrock particle ${path}`
  );
  if (!fs.existsSync(path)) {
    throw new Error(`Particle source file does not exist: ${path}`);
  }
  const content = fs.readFileSync(path, "utf8");
  return {
    document: parseParticleDocument(content),
    source_path: path,
    source_content: content,
  };
}

function normalizePathIdentity(path: string): string {
  let normalized = path
    .replace(/\\/g, "/")
    .replace(/\/{2,}/g, "/")
    .replace(/\/$/, "");
  if (/^[A-Za-z]:\//.test(normalized) || path.startsWith("\\\\")) {
    normalized = normalized.toLowerCase();
  }
  return normalized;
}

function sourceContentForOutput(
  sourcePath: string | null,
  sourceContent: string | null,
  outputPath: string
): string | undefined {
  return sourcePath !== null &&
    sourceContent !== null &&
    normalizePathIdentity(sourcePath) === normalizePathIdentity(outputPath)
    ? sourceContent
    : undefined;
}

function sliceWithoutSplittingSurrogatePair(
  value: string,
  maxChars: number
): string {
  if (maxChars <= 0 || value.length <= maxChars) {
    return maxChars <= 0 ? "" : value;
  }
  let end = maxChars;
  const lastCodeUnit = value.charCodeAt(end - 1);
  if (lastCodeUnit >= 0xd800 && lastCodeUnit <= 0xdbff) end -= 1;
  return value.slice(0, end);
}

function boundedContent(
  serialized: string,
  maxContentLength: number
): { truncated: boolean; content: string | null } {
  const truncated =
    maxContentLength > 0 && serialized.length > maxContentLength;
  return {
    truncated,
    content:
      maxContentLength === 0
        ? null
        : truncated
          ? sliceWithoutSplittingSurrogatePair(serialized, maxContentLength)
          : serialized,
  };
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
  return {
    summary,
    ...boundedContent(serialized, maxContentLength),
  };
}

function assertNativeParticlePreviewAvailable(): void {
  if (
    typeof Animator === "undefined" ||
    typeof Animator.loadParticleEmitter !== "function"
  ) {
    throw new Error(
      "Blockbench native particle preview is unavailable in this runtime."
    );
  }
}

function loadNativeParticlePreview(path: string, content: string): void {
  assertNativeParticlePreviewAvailable();
  Animator.loadParticleEmitter(path, content);
}

function uniqueSiblingPath(
  fs: ParticleFilesystem,
  targetPath: string,
  label: "tmp" | "bak"
): string {
  for (let index = 0; index < 128; index += 1) {
    const candidate = `${targetPath}.blockit-${label}-${process.pid}-${index}`;
    if (!fs.existsSync(candidate)) return candidate;
  }
  throw new Error(
    `Could not allocate a bounded temporary ${label} path beside ${targetPath}.`
  );
}

function cleanupIfPresent(fs: ParticleFilesystem, path: string): void {
  if (fs.existsSync(path)) fs.unlinkSync(path);
}

function writeArtifactsAtomically(plans: readonly PlannedWrite[]): WriteReceipt[] {
  if (plans.length === 0) return [];
  const pathIdentities = new Set<string>();
  for (const plan of plans) {
    const identity = normalizePathIdentity(plan.path);
    if (pathIdentities.has(identity)) {
      throw new Error(
        `Multiple particle artifacts target the same output path: ${plan.path}.`
      );
    }
    pathIdentities.add(identity);
  }

  const fs = requireParticleFilesystem(
    `BlockIT requested write access for ${plans.length} validated Bedrock particle artifact${plans.length === 1 ? "" : "s"}`
  );
  const prepared = plans.map((plan) => {
    const revision = captureParticleWriteRevision(fs, plan.path);
    const existed = revision.existed;
    if (existed && !plan.allow_replace) {
      throw new Error(
        `Refusing to replace existing ${plan.kind} file ${plan.path} without overwrite=true.`
      );
    }
    assertParticleSourceSnapshotMatches(
      revision,
      plan.expected_existing_content,
      plan.path,
      plan.kind
    );
    return {
      ...plan,
      existed,
      revision,
      byte_length: Buffer.byteLength(plan.content, "utf8"),
      temp_path: uniqueSiblingPath(fs, plan.path, "tmp"),
      backup_path: existed ? uniqueSiblingPath(fs, plan.path, "bak") : null,
      committed: false,
      backup_moved: false,
    };
  });

  try {
    for (const item of prepared) {
      fs.writeFileSync(item.temp_path, item.content);
      const stat = fs.statSync(item.temp_path);
      if (!stat.isFile() || stat.size !== item.byte_length) {
        throw new Error(
          `Temporary ${item.kind} write verification failed for ${item.path}: expected ${item.byte_length} bytes, got ${stat.isFile() ? stat.size : "a non-file target"}.`
        );
      }
    }

    for (const item of prepared) {
      assertParticleWriteRevisionUnchanged(
        fs,
        item.path,
        item.revision,
        item.kind
      );
      if (item.existed && item.backup_path) {
        fs.renameSync(item.path, item.backup_path);
        item.backup_moved = true;
      }
      try {
        fs.renameSync(item.temp_path, item.path);
        item.committed = true;
      } catch (error) {
        if (
          item.backup_moved &&
          item.backup_path &&
          fs.existsSync(item.backup_path)
        ) {
          fs.renameSync(item.backup_path, item.path);
          item.backup_moved = false;
        }
        throw error;
      }
      const stat = fs.statSync(item.path);
      if (!stat.isFile() || stat.size !== item.byte_length) {
        throw new Error(
          `Committed ${item.kind} write verification failed for ${item.path}: expected ${item.byte_length} bytes, got ${stat.isFile() ? stat.size : "a non-file target"}.`
        );
      }
    }
  } catch (error) {
    const rollbackErrors: string[] = [];
    for (const item of [...prepared].reverse()) {
      try {
        cleanupIfPresent(fs, item.temp_path);
        if (item.committed) cleanupIfPresent(fs, item.path);
        if (
          item.backup_moved &&
          item.backup_path &&
          fs.existsSync(item.backup_path)
        ) {
          fs.renameSync(item.backup_path, item.path);
          item.backup_moved = false;
        }
      } catch (rollbackError) {
        rollbackErrors.push(
          rollbackError instanceof Error
            ? rollbackError.message
            : String(rollbackError)
        );
      }
    }
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(
      rollbackErrors.length > 0
        ? `${reason} Rollback also reported: ${rollbackErrors.join(" | ")}`
        : reason
    );
  }

  const receipts: WriteReceipt[] = prepared.map((item) => ({
    kind: item.kind,
    path: item.path,
    byte_length: item.byte_length,
    replaced_existing: item.existed,
  }));
  for (const item of prepared) {
    if (item.backup_path) cleanupIfPresent(fs, item.backup_path);
  }
  return receipts;
}

function allowReplaceForExplicitSource(
  sourcePath: string | null,
  outputPath: string,
  overwrite: boolean
): boolean {
  return (
    overwrite === true ||
    (sourcePath !== null &&
      normalizePathIdentity(sourcePath) === normalizePathIdentity(outputPath))
  );
}

export function registerParticleTools(): void {
  createTool(
    particleToolDocs[0].name,
    {
      ...particleToolDocs[0],
      parameters: inspectParticleParameters,
      async execute({ source, mode, max_content_length }) {
        const { document, source_path } = readParticleSource(source);
        const result = compactInspectResult(
          document,
          mode,
          max_content_length
        );
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
    particleToolDocs[0].status
  );

  createTool(
    particleToolDocs[1].name,
    {
      ...particleToolDocs[1],
      parameters: manageParticleParameters,
      async execute({
        source,
        create,
        operations,
        output,
        preview,
        max_content_length,
      }) {
        const base = source
          ? readParticleSource(source)
          : {
              document: createParticleDocument(create!),
              source_path: null,
              source_content: null,
            };
        const document = applyParticleOperations(base.document, operations);
        const summary = inspectParticleDocument(document);
        const valid = !summary.diagnostics.some(
          (entry) => entry.severity === "error"
        );
        const serialized = serializeParticleDocument(document);
        const byteLength = Buffer.byteLength(serialized, "utf8");

        const intendedPreviewPath = output?.path ?? base.source_path;
        if (preview && valid) {
          if (!intendedPreviewPath) {
            throw new Error(
              "Native particle preview requires an existing source.path or output.path; inline-only documents have no stable Blockbench file identity."
            );
          }
          assertNativeParticlePreviewAvailable();
        }

        const writePlans: PlannedWrite[] = [];
        if (output && valid) {
          writePlans.push({
            kind: "particle",
            path: output.path,
            content: serialized,
            allow_replace: allowReplaceForExplicitSource(
              base.source_path,
              output.path,
              output.overwrite === true
            ),
            expected_existing_content: sourceContentForOutput(
              base.source_path,
              base.source_content,
              output.path
            ),
          });
        }
        const writes = valid ? writeArtifactsAtomically(writePlans) : [];
        const particleWrite = writes.find((entry) => entry.kind === "particle");

        let previewPath: string | null = null;
        let previewError: string | null = null;
        if (preview && valid && intendedPreviewPath) {
          previewPath = intendedPreviewPath;
          try {
            loadNativeParticlePreview(previewPath, serialized);
          } catch (error) {
            previewError =
              error instanceof Error ? error.message : String(error);
          }
        }

        const effectiveMaxContentLength =
          max_content_length ?? (particleWrite ? 0 : 100_000);
        const particleContent = boundedContent(
          serialized,
          effectiveMaxContentLength
        );

        return {
          content: [
            {
              type: "text" as const,
              text: valid
                ? `Prepared particle ${summary.identifier}: ${summary.component_count} components${particleWrite ? "; particle write verified" : ""}${previewPath && !previewError ? "; native preview loaded" : ""}${previewError ? "; native preview failed after artifact preparation" : ""}.`
                : `Particle ${summary.identifier ?? "<missing identifier>"} has validation errors; no file write or preview was performed.`,
            },
          ],
          structuredContent: {
            valid,
            source_path: base.source_path,
            wrote_to_path: particleWrite?.path ?? null,
            preview_path: previewPath,
            preview_error: previewError,
            byte_length: byteLength,
            operation_count: operations.length,
            summary,
            writes,
            ...particleContent,
          },
        };
      },
    },
    particleToolDocs[1].status
  );
}

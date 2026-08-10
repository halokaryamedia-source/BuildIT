from pathlib import Path

ROOT = Path.cwd()


def read(path: str) -> str:
    return (ROOT / path).read_text()


def write(path: str, content: str) -> None:
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content.rstrip() + "\n")


def replace_once(path: str, old: str, new: str) -> None:
    text = read(path)
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{path}: expected exactly one marker, found {count}: {old[:120]!r}")
    write(path, text.replace(old, new, 1))


# ---------------------------------------------------------------------------
# E1. Project creation is a Bedrock Entity product operation, not a generic
# Formats registry passthrough.
# ---------------------------------------------------------------------------
replace_once(
    "mcp/server/tools/project.ts",
    '''  format: z
    .string()
    .default("bedrock")
    .describe(
      "Project format ID from Blockbench's Formats registry. Defaults to `bedrock` for Minecraft Bedrock Entity models."
    ),''',
    '''  format: z
    .literal("bedrock")
    .optional()
    .default("bedrock")
    .describe(
      "BlockIT creates Minecraft Bedrock Entity projects only. The accepted format ID is `bedrock`; other Blockbench formats are outside the normal product surface."
    ),''',
)
replace_once(
    "mcp/server/tools/project.ts",
    '''    description:
      "Creates a new project with the given name and project type. Defaults to the Minecraft Bedrock Entity format (`bedrock`) when format is omitted.",''',
    '''    description:
      "Creates a new Minecraft Bedrock Entity project. The format is fixed to Blockbench's native `bedrock` ModelFormat; arbitrary Blockbench project formats are intentionally outside this product tool.",''',
)
replace_once(
    "mcp/server/tools/project.ts",
    '''    async execute({ name, format }) {
      const created = newProject(Formats[format]);''',
    '''    async execute({ name, format }) {
      const created = newProject(Formats.bedrock);''',
)

# ---------------------------------------------------------------------------
# E2. Generic Codecs export is narrowed to the two model outcomes BlockIT needs:
# native Bedrock geometry JSON and editable .bbmodel. Bedrock AnimationCodec is
# separate in official Blockbench source and is not routed through this tool.
# ---------------------------------------------------------------------------
write(
    "mcp/server/tools/export.ts",
    '''/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL, STATUS_STABLE } from "@/lib/constants";

export const BLOCKIT_MODEL_CODEC_IDS = ["bedrock", "project"] as const;
const blockitModelCodecEnum = z.enum(BLOCKIT_MODEL_CODEC_IDS);

export const listExportFormatsParameters = z.object({});

export const exportModelParameters = z.object({
  codec_id: blockitModelCodecEnum
    .optional()
    .default("bedrock")
    .describe(
      "BlockIT model output: `bedrock` for Minecraft Bedrock geometry JSON, or `project` for the editable Blockbench `.bbmodel`."
    ),
  options: z
    .record(z.unknown())
    .optional()
    .describe(
      "Codec-specific compile options for the selected Bedrock/project codec. Defaults to the codec's configured export options."
    ),
  path: z
    .string()
    .optional()
    .describe(
      "Absolute filesystem path to write the compiled model to. Requires user permission in Blockbench. If omitted, content is returned in the MCP response only."
    ),
  max_content_length: z
    .number()
    .int()
    .min(0)
    .max(2_000_000)
    .optional()
    .default(100_000)
    .describe(
      "Maximum characters returned in `content`. Use 0 when only writing to disk."
    ),
});

export const exportToolDocs: ToolSpec[] = [
  {
    name: "list_export_formats",
    description:
      "Lists the model outputs intentionally exposed by BlockIT for an active Bedrock Entity project: native Bedrock geometry JSON (`bedrock`) and editable Blockbench project (`project`). It does not enumerate arbitrary registered Blockbench codecs. Bedrock animation files/controllers use Blockbench's separate AnimationCodec surface and are not represented as generic model codecs here.",
    annotations: {
      title: "List BlockIT Model Outputs",
      readOnlyHint: true,
    },
    parameters: listExportFormatsParameters,
    status: STATUS_STABLE,
  },
  {
    name: "export_model",
    description:
      "Compiles an active Minecraft Bedrock Entity project as native Bedrock geometry JSON or editable `.bbmodel`. Arbitrary OBJ/glTF/other registered codecs are intentionally rejected. Optionally writes the result to a filesystem path after Blockbench permission approval.",
    annotations: {
      title: "Export Bedrock Model",
      destructiveHint: false,
      openWorldHint: true,
    },
    parameters: exportModelParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

type BlockITCodec = {
  id?: string;
  name?: string;
  extension?: string;
  compile?: (opts?: unknown) => unknown;
  getExportOptions?: () => Record<string, unknown>;
  fileName?: () => string;
  support_partial_export?: boolean;
};

function requireBedrockEntityProject(): void {
  if (!Project) {
    throw new Error(
      "No project is open. Use `create_project` or open a Minecraft Bedrock Entity project first."
    );
  }

  const formatId = (Format as { id?: string } | undefined)?.id;
  if (formatId !== "bedrock") {
    throw new Error(
      `BlockIT model export requires the Minecraft Bedrock Entity format (bedrock); current format is ${formatId ?? "unknown"}.`
    );
  }
}

function codecRegistry(): Record<string, BlockITCodec> {
  // @ts-ignore - Codecs is a Blockbench global registry.
  return Codecs as Record<string, BlockITCodec>;
}

function toTextContent(raw: unknown): string {
  if (raw === null || raw === undefined) return "";
  if (typeof raw === "string") return raw;
  if (raw instanceof ArrayBuffer) return `[binary: ${raw.byteLength} bytes]`;
  if (typeof raw === "object") {
    try {
      return JSON.stringify(raw, null, 2);
    } catch {
      return String(raw);
    }
  }
  return String(raw);
}

export function registerExportTools() {
  createTool(
    exportToolDocs[0].name,
    {
      ...exportToolDocs[0],
      async execute() {
        requireBedrockEntityProject();
        const registry = codecRegistry();
        const codecs = BLOCKIT_MODEL_CODEC_IDS.map((id) => {
          const codec = registry[id];
          return {
            id,
            name: codec?.name ?? id,
            extension: codec?.extension ?? (id === "project" ? "bbmodel" : "json"),
            available: !!codec,
            has_compile: typeof codec?.compile === "function",
            supports_partial_export: Boolean(codec?.support_partial_export),
            purpose: id === "bedrock" ? "bedrock_geometry" : "editable_blockbench_project",
          };
        });

        return JSON.stringify(
          {
            current_format: "bedrock",
            count: codecs.length,
            codecs,
            note:
              "Bedrock animation/controller files are owned by Blockbench's separate AnimationCodec and are not arbitrary model codec exports.",
          },
          null,
          2
        );
      },
    },
    exportToolDocs[0].status
  );

  createTool(
    exportToolDocs[1].name,
    {
      ...exportToolDocs[1],
      async execute({ codec_id, options, path, max_content_length }) {
        requireBedrockEntityProject();
        const registry = codecRegistry();
        const codec = registry[codec_id];

        if (!codec) {
          throw new Error(
            `Required BlockIT codec "${codec_id}" is not registered in this Blockbench build.`
          );
        }
        if (typeof codec.compile !== "function") {
          throw new Error(
            `BlockIT codec "${codec_id}" does not support programmatic compile().`
          );
        }

        const effectiveOptions =
          options ??
          (typeof codec.getExportOptions === "function"
            ? codec.getExportOptions()
            : undefined);
        const rawResult = codec.compile(effectiveOptions);

        const isArrayBuffer = rawResult instanceof ArrayBuffer;
        const isBinaryView =
          ArrayBuffer.isView(rawResult) && !(rawResult instanceof DataView);
        const binaryBuffer = isArrayBuffer
          ? Buffer.from(rawResult as ArrayBuffer)
          : isBinaryView
            ? Buffer.from(
                (rawResult as ArrayBufferView).buffer,
                (rawResult as ArrayBufferView).byteOffset,
                (rawResult as ArrayBufferView).byteLength
              )
            : null;

        const text = binaryBuffer ? null : toTextContent(rawResult);
        const byteLength = binaryBuffer
          ? binaryBuffer.byteLength
          : Buffer.byteLength(text ?? "", "utf8");
        const encoding: "utf-8" | "base64" = binaryBuffer ? "base64" : "utf-8";

        let wrote_to_path: string | null = null;
        if (path) {
          // @ts-ignore - requireNativeModule is a Blockbench desktop global.
          const fs = requireNativeModule("fs", {
            message: `BlockIT export_model requested write access to save ${codec_id} output to ${path}`,
          });
          if (!fs) {
            throw new Error(
              "File system access was denied. Omit `path` to receive the compiled content in the MCP response."
            );
          }
          fs.writeFileSync(path, binaryBuffer ?? (text ?? ""));
          wrote_to_path = path;
        }

        const fullContent = binaryBuffer
          ? binaryBuffer.toString("base64")
          : (text ?? "");
        const truncated = fullContent.length > max_content_length;
        const returnedContent =
          max_content_length === 0
            ? null
            : truncated
              ? fullContent.slice(0, max_content_length)
              : fullContent;

        const result = {
          project_format: "bedrock" as const,
          codec: {
            id: codec_id,
            name: codec.name ?? codec_id,
            extension: codec.extension ?? null,
          },
          file_name:
            typeof codec.fileName === "function" ? codec.fileName() : Project!.name,
          byte_length: byteLength,
          encoding,
          wrote_to_path,
          truncated,
          content: returnedContent,
        };

        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
          structuredContent: result,
        };
      },
    },
    exportToolDocs[1].status
  );
}
''',
)

# ---------------------------------------------------------------------------
# E3. Full-app screenshot + arbitrary editor camera mutation are generic
# Blockbench conveniences. Preserve definitions for source history, but default
# them off. Canonical model observation remains exposed.
# ---------------------------------------------------------------------------
replace_once(
    "mcp/server/tools/camera.ts",
    '''  {
    name: "capture_app_screenshot",
    description: "Returns the image data of the Blockbench app.",''',
    '''  {
    name: "capture_app_screenshot",
    description:
      "Source-preserved generic Blockbench full-application screenshot helper. It is disabled in the normal BlockIT Bedrock Entity surface; use `capture_model_views` or `capture_screenshot` for model evidence.",''',
)
# Only the capture_app entry's Stable status occurs between that entry and set_camera.
text = read("mcp/server/tools/camera.ts")
marker = 'name: "capture_app_screenshot"'
start = text.index(marker)
next_marker = text.index('name: "set_camera_angle"', start)
segment = text[start:next_marker]
if segment.count("status: STATUS_STABLE") != 1:
    raise RuntimeError("camera.ts: expected capture_app_screenshot to have one stable status")
segment = segment.replace("status: STATUS_STABLE", "status: STATUS_EXPERIMENTAL", 1)
write("mcp/server/tools/camera.ts", text[:start] + segment + text[next_marker:])
replace_once(
    "mcp/server/tools/camera.ts",
    '''    name: "set_camera_angle",
    description: "Sets the camera angle to the specified value.",''',
    '''    name: "set_camera_angle",
    description:
      "Source-preserved generic editor-camera mutation helper. It is disabled in the normal BlockIT Bedrock Entity surface because `capture_model_views` provides deterministic observation without mutating the active editor camera.",''',
)
replace_once(
    "mcp/server/tools/camera.ts",
    '''  }, cameraToolDocs[1].status);

  createTool(cameraToolDocs[2].name,''',
    '''  }, cameraToolDocs[1].status, false);

  createTool(cameraToolDocs[2].name,''',
)
replace_once(
    "mcp/server/tools/camera.ts",
    '''  }, cameraToolDocs[2].status);

  createTool(cameraToolDocs[3].name,''',
    '''  }, cameraToolDocs[2].status, false);

  createTool(cameraToolDocs[3].name,''',
)

# ---------------------------------------------------------------------------
# E4. Validator element links are inferred from message strings, not native
# object references. Keep useful hints but label the evidence honestly.
# ---------------------------------------------------------------------------
replace_once(
    "mcp/server/resources/validator.ts",
    '''    actionNames: problem.buttons?.map((b) => b.name) ?? [],
    elementRefs,
  };''',
    '''    actionNames: problem.buttons?.map((b) => b.name) ?? [],
    elementRefs,
    elementRefsSource: elementRefs.length > 0 ? "message_heuristic" : "none",
    elementRefsAuthoritative: false,
  };''',
)
replace_once(
    "mcp/server/resources/validator.ts",
    '''      "Returns the current validation status including error/warning counts and a summary of all problems.",''',
    '''      "Returns the current validation status including error/warning counts and a summary of all problems. Any elementRefs are best-effort message-text inferences and are explicitly marked non-authoritative.",''',
)
replace_once(
    "mcp/server/resources/validator.ts",
    '''      "Returns all current validation warnings with element references where available.",''',
    '''      "Returns current validation warnings. Any elementRefs are best-effort message-text inferences and are explicitly marked non-authoritative.",''',
)
replace_once(
    "mcp/server/resources/validator.ts",
    '''      "Returns all current validation errors with element references where available.",''',
    '''      "Returns current validation errors. Any elementRefs are best-effort message-text inferences and are explicitly marked non-authoritative.",''',
)

# ---------------------------------------------------------------------------
# E evidence record and capability-matrix update.
# ---------------------------------------------------------------------------
write(
    "docs/knowledge/reviews/mcp-prelocal-generic-semantics-audit-2026-08-10.md",
    '''# MCP Pre-Local Generic Semantics Audit

Updated: 2026-08-10

## Scope

This review narrows clearly generic semantics that remained inside otherwise-retained Bedrock Entity families. It is **not** a second capability deletion pass.

Official source basis: `JannisX11/blockbench` master as audited at commit `47e633e4a1338f957ee7baa0acbcf54da11e77df`.

## Official source findings

### Native Bedrock Entity format

`js/formats/bedrock/bedrock.js` defines the entity `ModelFormat` with:

```text
id: bedrock
codec: bedrock
animation_codec: bedrock AnimationCodec
```

The same format explicitly enables native Bedrock features including Cube rotation/UV, bone rig, animated textures, animation files/controllers, bone binding expressions, locators, texture meshes, bounding boxes, and PBR.

### Model codecs

The Bedrock geometry codec is `Codec('bedrock')` and compiles Minecraft `minecraft:geometry` JSON. The editable Blockbench project codec is independently `Codec('project')` with `.bbmodel` extension in `js/formats/bbmodel.js`.

### Animation output ownership

`js/formats/bedrock/bedrock_animation.js` defines `AnimationCodec('bedrock')`. Bedrock animation/controller file behavior therefore must not be inferred from, or removed by narrowing, the generic `Codecs` model-export registry.

## E decisions

### `create_project`

**NARROW** to the native Bedrock Entity format only.

Reason: arbitrary `Formats[format]` project creation is generic Blockbench behavior, while BlockIT's product boundary is Bedrock Entity. Existing/open Bedrock projects remain supported.

### model export

**NARROW** generic `Codecs` enumeration/execution to:

```text
bedrock  -> native Minecraft Bedrock geometry JSON
project  -> editable Blockbench .bbmodel
```

Do not interpret this as animation reduction; Bedrock animations/controllers are owned by the separate native AnimationCodec and remain protected capability targets.

### camera helpers

Keep exposed:

```text
capture_screenshot
capture_model_views
```

Default-disable but source-preserve:

```text
capture_app_screenshot
set_camera_angle
```

Reason: full application capture and arbitrary active-camera mutation are generic UI/editor conveniences. Canonical Bedrock model observation already has a deterministic non-mutating owner.

### validator references

Keep validator resources, but mark regex-derived `elementRefs` as:

```text
elementRefsSource: message_heuristic | none
elementRefsAuthoritative: false
```

A parser guess from localized/human-readable validator text is useful navigation context but not authored identity evidence.

### `nodes://{id}`

**DEFER — retain for now.**

The resource is broad/generic, but direct BlockIT mappings for native Locator and TextureMesh authored state are still protected gaps. Removing the broad node observation route before those gaps are closed would reduce observability while pretending the product became cleaner. Audit and replace it only together with explicit Locator/TextureMesh inspection ownership.

## Guardrail

No change in this slice authorizes removal of Locator, TextureMesh, native bounding boxes, animated textures, animation controllers, sound/timeline effects, or bone binding expressions. Those remain protected by the capability matrix until their direct MCP mapping is audited.''',
)

matrix = read("docs/knowledge/reviews/bedrock-entity-capability-surface-matrix.md")
matrix = matrix.replace(
    '| Project format/orientation | `create_project`, `get_project_info` | **Mapped** | Normal project format is `bedrock`; later narrowing should prevent arbitrary format drift without removing Bedrock project creation. |',
    '| Project format/orientation | `create_project`, `get_project_info` | **Mapped / narrowed** | `create_project` accepts the native `bedrock` Entity format only; arbitrary Blockbench format creation is outside the product tool. |',
)
matrix = matrix.replace(
    '| Current-format Bedrock export | `list_export_formats`, `export_model` | **Available but broad** | Later audit should prefer current-format Bedrock outcomes while avoiding arbitrary-codec generic drift. |',
    '| Bedrock model/project export | `list_export_formats`, `export_model` | **Mapped / narrowed** | Generic model-codec exposure is limited to native `bedrock` geometry JSON and editable `project` `.bbmodel`. Native Bedrock animation/controller output remains separately protected under AnimationCodec. |',
)
matrix = matrix.replace(
    '| Canonical visual observation | `capture_model_views`, `capture_screenshot`, `inspect_model_bounds` | **Mapped BlockIT workflow support** | Product evidence helpers, not proof of resemblance by themselves. |',
    '| Canonical visual observation | `capture_model_views`, `capture_screenshot`, `inspect_model_bounds` | **Mapped BlockIT workflow support** | Product evidence helpers, not proof of resemblance by themselves. Generic full-app capture and arbitrary active-camera mutation are default-disabled. |',
)
needle = '| Reference Models plugin integration | conditional `reference_models://{id}` | **Optional external integration** | Not a native Bedrock capability and must not affect baseline capability counts. |'
if needle not in matrix:
    raise RuntimeError("capability matrix reference-model row not found")
matrix = matrix.replace(
    needle,
    '| Generic `nodes://{id}` observation | `Project.nodes_3d` resource | **Transitional / deferred** | Broad runtime-node observation is retained until explicit Locator/TextureMesh authored-state inspection closes those protected gaps; do not remove it first. |\n' + needle,
)
matrix = matrix.replace(
    'Use this matrix to audit remaining broad semantics inside retained families: arbitrary project-format creation, arbitrary codec enumeration/export, generic camera/app UI helpers, generic resource object dumps, and Bedrock prompt/skill coverage for protected gaps. Do not start deletion from tool names alone; trace every proposed reduction through official Blockbench Bedrock source first.',
    'Project creation, model-codec breadth, generic camera/app helpers, and validator inference labeling were reviewed in `mcp-prelocal-generic-semantics-audit-2026-08-10.md`. Next, use this matrix to normalize Bedrock prompts/skills and to design direct authored-state coverage for protected gaps before replacing broad transitional resources. Do not start deletion from tool names alone; trace every proposed reduction through official Blockbench Bedrock source first.',
)
write("docs/knowledge/reviews/bedrock-entity-capability-surface-matrix.md", matrix)

# ---------------------------------------------------------------------------
# Focused regression proof.
# ---------------------------------------------------------------------------
write(
    "mcp/tests/prelocal-generic-semantics.test.ts",
    '''import { describe, expect, test } from "bun:test";
import { createProjectParameters } from "@/server/tools/project";
import {
  BLOCKIT_MODEL_CODEC_IDS,
  exportModelParameters,
  listExportFormatsParameters,
} from "@/server/tools/export";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("pre-local generic semantics narrowing", () => {
  test("project creation accepts only the native Bedrock Entity format", () => {
    expect(createProjectParameters.parse({ name: "entity" }).format).toBe("bedrock");
    expect(createProjectParameters.safeParse({ name: "entity", format: "bedrock" }).success).toBe(true);
    expect(createProjectParameters.safeParse({ name: "entity", format: "java_block" }).success).toBe(false);
    expect(createProjectParameters.safeParse({ name: "entity", format: "bedrock_block" }).success).toBe(false);
  });

  test("model export exposes only Bedrock geometry and editable Blockbench project codecs", () => {
    expect(BLOCKIT_MODEL_CODEC_IDS).toEqual(["bedrock", "project"]);
    expect(listExportFormatsParameters.parse({})).toEqual({});
    expect(exportModelParameters.parse({}).codec_id).toBe("bedrock");
    expect(exportModelParameters.safeParse({ codec_id: "project" }).success).toBe(true);
    expect(exportModelParameters.safeParse({ codec_id: "obj" }).success).toBe(false);
    expect(exportModelParameters.safeParse({ codec_id: "gltf" }).success).toBe(false);
  });

  test("generic full-app capture and editor-camera mutation are default-disabled", async () => {
    const camera = await source("server/tools/camera.ts");
    expect(camera).toContain("cameraToolDocs[1].status, false");
    expect(camera).toContain("cameraToolDocs[2].status, false");
    expect(camera).toContain("capture_model_views");
  });

  test("validator inferred element references declare their non-authoritative source", async () => {
    const validator = await source("server/resources/validator.ts");
    expect(validator).toContain('elementRefsSource: elementRefs.length > 0 ? "message_heuristic" : "none"');
    expect(validator).toContain("elementRefsAuthoritative: false");
  });

  test("generic nodes resource remains explicitly deferred until protected native gaps have owners", async () => {
    const audit = await source("../docs/knowledge/reviews/mcp-prelocal-generic-semantics-audit-2026-08-10.md");
    const matrix = await source("../docs/knowledge/reviews/bedrock-entity-capability-surface-matrix.md");
    expect(audit).toContain("`nodes://{id}`");
    expect(audit).toContain("DEFER — retain for now");
    expect(matrix).toContain("Generic `nodes://{id}` observation");
    expect(matrix).toContain("Transitional / deferred");
  });
});''',
)

print("Pre-local generic semantics E patch applied.")

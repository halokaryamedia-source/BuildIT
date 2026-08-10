/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL, STATUS_STABLE } from "@/lib/constants";

export const BLOCKIT_MODEL_CODEC_IDS = ["bedrock", "project"] as const;
const blockitModelCodecEnum = z.enum(BLOCKIT_MODEL_CODEC_IDS);

export const listExportFormatsParameters = z.object({});

function isAbsoluteOutputPath(value: string): boolean {
  return (
    value.startsWith("/") ||
    /^[A-Za-z]:[\\/]/.test(value) ||
    /^\\\\[^\\]+\\[^\\]+(?:\\|$)/.test(value)
  );
}

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
      "Optional compile options for the selected Bedrock/project codec."
    ),
  path: z
    .string()
    .refine(isAbsoluteOutputPath, {
      message:
        "Export path must be absolute: use a POSIX `/...` path, a Windows drive path such as `C:\\...`, or a UNC path such as `\\\\server\\share\\...`.",
    })
    .optional()
    .describe(
      "Optional absolute output path; requires Blockbench filesystem permission."
    ),
  max_content_length: z
    .number()
    .int()
    .min(0)
    .max(2_000_000)
    .optional()
    .describe(
      "Maximum characters returned in `content`. Defaults to 0 when `path` is supplied, otherwise 100000; set explicitly when both file write and returned content are needed."
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
      "Compiles the active Bedrock Entity project as Bedrock geometry JSON or editable `.bbmodel`; optional filesystem write requires Blockbench permission. Other model codecs are rejected.",
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

        return JSON.stringify({
          current_format: "bedrock",
          count: codecs.length,
          codecs,
          note:
            "Bedrock animation/controller files are owned by Blockbench's separate AnimationCodec and are not arbitrary model codec exports.",
        });
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
        // A successful filesystem write already delivers the artifact. Avoid
        // echoing large compiled content into model context unless requested.
        const effectiveMaxContentLength =
          max_content_length ?? (path ? 0 : 100_000);
        const truncated = fullContent.length > effectiveMaxContentLength;
        const returnedContent =
          effectiveMaxContentLength === 0
            ? null
            : truncated
              ? fullContent.slice(0, effectiveMaxContentLength)
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
          content: [{ type: "text" as const, text: JSON.stringify(result) }],
          structuredContent: result,
        };
      },
    },
    exportToolDocs[1].status
  );
}

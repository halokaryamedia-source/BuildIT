/// <reference types="blockbench-types" />
import { z } from "zod";
import type {
  FormElementOptions,
  InputFormConfig,
} from "blockbench-types/generated/interface/form";
import { getAllToolDefinitions, tools } from "@/lib/factories";

/**
 * Extracts metadata from a Zod schema type
 */
function getZodTypeMeta(zodType: z.ZodType): {
  type: FormElementOptions["type"];
  isOptional: boolean;
  isArray: boolean;
  description?: string;
  defaultValue?: unknown;
  enumValues?: string[];
  min?: number;
  max?: number;
  innerType?: z.ZodType;
} {
  const def = zodType._def as Record<string, unknown>;
  const typeName = def.typeName as string;

  let isOptional = false;
  let isArray = false;
  let description = def.description as string | undefined;
  let defaultValue: unknown = undefined;
  let enumValues: string[] | undefined;
  let min: number | undefined;
  let max: number | undefined;
  let innerType: z.ZodType | undefined;

  if (typeName === "ZodOptional" || typeName === "ZodNullable") {
    isOptional = true;
    const inner = def.innerType as z.ZodType;
    const innerMeta = getZodTypeMeta(inner);
    return { ...innerMeta, isOptional: true };
  }

  if (typeName === "ZodDefault") {
    defaultValue = (def.defaultValue as () => unknown)?.();
    const inner = def.innerType as z.ZodType;
    const innerMeta = getZodTypeMeta(inner);
    return { ...innerMeta, defaultValue, isOptional: true };
  }

  if (typeName === "ZodArray") {
    isArray = true;
    innerType = def.type as z.ZodType;
  }

  if (typeName === "ZodEnum") {
    enumValues = def.values as string[];
  }

  if (typeName === "ZodNumber") {
    const checks = def.checks as Array<{ kind: string; value: number }> | undefined;
    checks?.forEach((check) => {
      if (check.kind === "min") min = check.value;
      if (check.kind === "max") max = check.value;
    });
  }

  let type: FormElementOptions["type"] = "text";
  switch (typeName) {
    case "ZodString":
      type = "text";
      break;
    case "ZodNumber":
      type = "number";
      break;
    case "ZodBoolean":
      type = "checkbox";
      break;
    case "ZodEnum":
      type = "select";
      break;
    case "ZodArray":
    case "ZodObject":
    case "ZodUnion":
      type = "textarea";
      break;
    default:
      type = "text";
  }

  return {
    type,
    isOptional,
    isArray,
    description,
    defaultValue,
    enumValues,
    min,
    max,
    innerType,
  };
}

function zodSchemaToFormConfig(
  inputSchema: Record<string, z.ZodType>
): InputFormConfig {
  const formConfig: InputFormConfig = {};

  for (const [fieldName, zodType] of Object.entries(inputSchema)) {
    const meta = getZodTypeMeta(zodType);
    const def = zodType._def as Record<string, unknown>;

    const fieldConfig: FormElementOptions = {
      label: `${fieldName}${meta.isOptional ? "" : " *"}`,
      description: meta.description || `Parameter: ${fieldName}`,
      type: meta.type,
    };

    if (meta.defaultValue !== undefined) {
      if (meta.type === "textarea") {
        fieldConfig.value = JSON.stringify(meta.defaultValue, null, 2);
      } else {
        fieldConfig.value = meta.defaultValue;
      }
    }

    if (meta.description) {
      fieldConfig.placeholder = meta.description;
    }

    if (meta.enumValues) {
      fieldConfig.options = {};
      for (const val of meta.enumValues) {
        fieldConfig.options[val] = val;
      }
    }

    if (meta.min !== undefined) fieldConfig.min = meta.min;
    if (meta.max !== undefined) fieldConfig.max = meta.max;

    if (meta.type === "textarea") {
      fieldConfig.height = 100;
      if (meta.isArray) {
        fieldConfig.placeholder = tl("mcp.dialog.json_array_placeholder");
        fieldConfig.value = fieldConfig.value ?? "[]";
      } else if ((def.typeName as string) === "ZodObject") {
        fieldConfig.placeholder = tl("mcp.dialog.json_object_placeholder");
        fieldConfig.value = fieldConfig.value ?? "{}";
      }
    }

    formConfig[fieldName] = fieldConfig;
  }

  return formConfig;
}

function parseFormResult(
  formResult: Record<string, unknown>,
  inputSchema: Record<string, z.ZodType>
): Record<string, unknown> {
  const parsed: Record<string, unknown> = {};

  for (const [fieldName, zodType] of Object.entries(inputSchema)) {
    const value = formResult[fieldName];
    const meta = getZodTypeMeta(zodType);

    if (meta.isOptional && (value === "" || value === undefined || value === null)) {
      continue;
    }

    if (meta.type === "textarea" && typeof value === "string") {
      try {
        parsed[fieldName] = JSON.parse(value);
      } catch {
        parsed[fieldName] = value;
      }
    } else if (meta.type === "number" && typeof value === "string") {
      parsed[fieldName] = parseFloat(value);
    } else {
      parsed[fieldName] = value;
    }
  }

  return parsed;
}

let resultDialog: Dialog | null = null;

function showResultDialog(toolName: string, result: unknown, isError: boolean) {
  const resultStr = typeof result === "string"
    ? result
    : JSON.stringify(result, null, 2);

  resultDialog?.hide();

  resultDialog = new Dialog({
    id: "mcp_tool_result",
    title: tl("mcp.dialog.result_title", [toolName]),
    width: 600,
    lines: [
      `<pre style="
        background: var(--color-back);
        padding: 12px;
        border-radius: 4px;
        overflow: auto;
        max-height: 400px;
        white-space: pre-wrap;
        word-break: break-word;
        color: ${isError ? "var(--color-error)" : "var(--color-text)"};
        font-family: var(--font-code);
        font-size: 12px;
      ">${escapeHtml(resultStr)}</pre>`,
    ],
    singleButton: true,
    buttons: [tl("mcp.dialog.close")],
  });

  resultDialog.show();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

let currentDialog: Dialog | null = null;

export function openToolTestDialog(toolName: string) {
  const toolDefs = getAllToolDefinitions();
  const toolDef = toolDefs[toolName];

  if (!toolDef) {
    Blockbench.showQuickMessage(tl("mcp.dialog.tool_not_found", [toolName]), 2000);
    return;
  }

  if (!tools[toolName]?.enabled) {
    Blockbench.showQuickMessage(
      `Tool "${toolName}" is disabled and cannot be executed from the BlockIT panel.`,
      2500
    );
    return;
  }

  currentDialog?.hide();

  const formConfig = zodSchemaToFormConfig(toolDef.inputSchema);
  const hasFields = Object.keys(formConfig).length > 0;

  async function runToolTest(formResult: Record<string, unknown>): Promise<void> {
    const args = hasFields ? parseFormResult(formResult, toolDef.inputSchema) : {};

    Blockbench.showQuickMessage(tl("mcp.dialog.running_tool"), 1000);

    try {
      if (!tools[toolName]?.enabled) {
        throw new Error(`Tool "${toolName}" is disabled.`);
      }
      const validatedArgs = await toolDef.parameterSchema.parseAsync(args);
      const result = await toolDef.execute(validatedArgs);

      let displayResult: unknown;
      if (typeof result === "string") {
        displayResult = result;
      } else if (result && typeof result === "object" && "content" in result) {
        displayResult = result.content.map((content) => {
          if (content.type === "text") return content.text;
          if (content.type === "image") {
            return `[Image: ${content.mimeType}, ${content.data.slice(0, 50)}...]`;
          }
          return JSON.stringify(content);
        }).join("\n");
      } else {
        displayResult = result;
      }

      showResultDialog(toolName, displayResult, false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      showResultDialog(toolName, `Error: ${errorMessage}`, true);
    }
  }

  currentDialog = new Dialog({
    id: "mcp_tool_test",
    title: toolDef.title || toolName,
    width: 500,
    form: hasFields ? formConfig : undefined,
    lines: hasFields
      ? undefined
      : [`<p style="color: var(--color-subtle_text); font-style: italic;">${tl("mcp.dialog.no_parameters")}</p>`],
    buttons: [tl("mcp.dialog.run_tool"), tl("mcp.dialog.copy_input"), tl("mcp.dialog.cancel")],
    confirmIndex: 0,
    cancelIndex: 2,
    onButton(buttonIndex: number) {
      if (buttonIndex === 1) {
        const formResult = currentDialog?.form?.getResult() ?? {};
        const args = hasFields ? parseFormResult(formResult, toolDef.inputSchema) : {};

        const jsonData = JSON.stringify({
          tool: toolName,
          arguments: args,
        }, null, 2);

        navigator.clipboard.writeText(jsonData).then(() => {
          Blockbench.showQuickMessage(tl("mcp.dialog.input_copied"), 1500);
        }).catch(() => {
          Blockbench.showQuickMessage(tl("mcp.dialog.copy_failed"), 1500);
        });

        return false;
      }
    },
    onConfirm(formResult: Record<string, unknown>) {
      void runToolTest(formResult);
    },
  });

  currentDialog.show();
}

export function getToolInfo(toolName: string): {
  name: string;
  title: string;
  description: string;
  parameterCount: number;
} | null {
  const toolDefs = getAllToolDefinitions();
  const toolDef = toolDefs[toolName];

  if (!toolDef) return null;

  return {
    name: toolName,
    title: toolDef.title,
    description: toolDef.description,
    parameterCount: Object.keys(toolDef.inputSchema).length,
  };
}

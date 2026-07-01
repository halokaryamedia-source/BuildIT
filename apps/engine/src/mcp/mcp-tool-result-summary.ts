export interface McpToolResultSummary {
  kind: "empty" | "text" | "image" | "path" | "object" | "array" | "primitive";
  preview: string;
  keys?: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function findString(value: unknown, predicate: (value: string) => boolean): string | undefined {
  if (typeof value === "string") return predicate(value) ? value : undefined;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findString(item, predicate);
      if (found) return found;
    }
  }
  if (isRecord(value)) {
    for (const item of Object.values(value)) {
      const found = findString(item, predicate);
      if (found) return found;
    }
  }
  return undefined;
}

function truncate(value: string, maxLength = 160): string {
  return value.length > maxLength ? value.slice(0, maxLength - 3) + "..." : value;
}

export function summarizeMcpToolResult(result: unknown): McpToolResultSummary {
  if (result === null || result === undefined) {
    return { kind: "empty", preview: "No result payload." };
  }

  const imageDataUrl = findString(result, (value) => value.startsWith("data:image/"));
  if (imageDataUrl) {
    return { kind: "image", preview: "Image data URL returned." };
  }

  const pathLike = findString(result, (value) => /[\\/]/.test(value) && value.length < 260);
  if (pathLike) {
    return { kind: "path", preview: truncate(pathLike) };
  }

  const text = findString(result, (value) => value.trim().length > 0 && value.length < 400);
  if (text) {
    return { kind: "text", preview: truncate(text) };
  }

  if (Array.isArray(result)) {
    return { kind: "array", preview: "Array result with " + result.length + " item(s)." };
  }

  if (isRecord(result)) {
    const keys = Object.keys(result).slice(0, 12);
    return { kind: "object", preview: "Object result with keys: " + keys.join(", "), keys };
  }

  return { kind: "primitive", preview: truncate(String(result)) };
}

import type { JsonObject, JsonValue } from "./types";

export function objectOf(value: JsonValue | undefined): JsonObject | null {
  return value !== undefined &&
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
    ? (value as JsonObject)
    : null;
}

export function componentMap(document: JsonObject): JsonObject {
  const effect = objectOf(document.particle_effect);
  return objectOf(effect?.components) ?? {};
}

export function collectMatchingStringPaths(
  value: JsonValue,
  path: string,
  matcher: (value: string) => boolean,
  output: string[]
): void {
  if (typeof value === "string") {
    if (matcher(value)) output.push(path);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      collectMatchingStringPaths(entry, `${path}[${index}]`, matcher, output)
    );
    return;
  }
  const current = objectOf(value);
  if (!current) return;
  for (const [key, child] of Object.entries(current)) {
    collectMatchingStringPaths(
      child,
      path ? `${path}.${key}` : key,
      matcher,
      output
    );
  }
}

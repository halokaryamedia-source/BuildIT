export const BLOCKIT_PROJECT_AFFINITY_HEADER = "x-blockit-project-uuid";

export type RuntimeProjectHealth = {
  active_project_uuid: string | null;
  requested_project_uuid: string | null;
  requested_project_available: boolean | null;
  open_project_count: number;
};

export function normalizeProjectAffinityUuid(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") {
    throw new Error("BlockIT project affinity must be a string project UUID.");
  }

  const normalized = value.trim();
  if (
    normalized.length === 0 ||
    normalized.length > 128 ||
    /[\u0000-\u001f\u007f]/.test(normalized)
  ) {
    throw new Error("BlockIT project affinity contains an invalid project UUID.");
  }
  return normalized;
}

export function readRuntimeProjectHealth(value: unknown): RuntimeProjectHealth | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const context = (value as { project_context?: unknown }).project_context;
  if (!context || typeof context !== "object" || Array.isArray(context)) return null;

  const record = context as Record<string, unknown>;
  const active =
    typeof record.active_project_uuid === "string"
      ? record.active_project_uuid
      : record.active_project_uuid === null
        ? null
        : undefined;
  const requested =
    typeof record.requested_project_uuid === "string"
      ? record.requested_project_uuid
      : record.requested_project_uuid === null
        ? null
        : undefined;
  const available =
    typeof record.requested_project_available === "boolean"
      ? record.requested_project_available
      : record.requested_project_available === null
        ? null
        : undefined;
  const openCount = record.open_project_count;

  if (
    active === undefined ||
    requested === undefined ||
    available === undefined ||
    typeof openCount !== "number" ||
    !Number.isInteger(openCount) ||
    openCount < 0
  ) {
    return null;
  }

  return {
    active_project_uuid: active,
    requested_project_uuid: requested,
    requested_project_available: available,
    open_project_count: openCount,
  };
}

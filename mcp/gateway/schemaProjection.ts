export type CapabilitySchemaBranch = {
  field: string;
  value: string;
};

type JsonRecord = Record<string, unknown>;

type CapabilityProjection = Record<string, Record<string, readonly string[]>>;

/**
 * Branch metadata is declarative and kept at the stable Gateway boundary.
 * Runtime validation remains authoritative; this map only removes unrelated
 * fields from describe_capability responses so the AI client does not pay for
 * every branch of a consolidated capability when it already knows the branch.
 */
const CAPABILITY_BRANCH_FIELDS: Record<string, CapabilityProjection> = {
  manage_animation_timeline: {
    operation: {
      keyframes: [
        "operation",
        "animation_id",
        "action",
        "bone_name",
        "channel",
        "keyframes",
      ],
      graph: [
        "operation",
        "animation_id",
        "bone_name",
        "channel",
        "axis",
        "action",
        "keyframe_range",
        "custom_curve",
      ],
      timeline: [
        "operation",
        "animation_id",
        "action",
        "time",
        "length",
        "fps",
        "loop_mode",
        "range",
        "molang",
      ],
      batch: [
        "operation",
        "batch_operation",
        "selection",
        "range",
        "pattern",
        "parameters",
      ],
      copy_paste: ["operation", "action", "source", "target"],
    },
  },
};

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function projectObjectSchema(
  schema: JsonRecord,
  branch: CapabilitySchemaBranch,
  allowedFields: readonly string[]
): JsonRecord {
  if (!isRecord(schema.properties)) return schema;

  const allowed = new Set(allowedFields);
  const properties = Object.fromEntries(
    Object.entries(schema.properties).filter(([name]) => allowed.has(name))
  );

  const discriminator = properties[branch.field];
  if (isRecord(discriminator)) {
    properties[branch.field] = {
      ...discriminator,
      const: branch.value,
      enum: [branch.value],
    };
  }

  const required = Array.isArray(schema.required)
    ? schema.required.filter(
        (name): name is string => typeof name === "string" && allowed.has(name)
      )
    : undefined;

  return {
    ...schema,
    properties,
    ...(required ? { required } : {}),
  };
}

export function projectCapabilityInputSchema(
  capability: string,
  inputSchema: unknown,
  branch?: CapabilitySchemaBranch
): {
  inputSchema: unknown;
  projected: boolean;
  branch: CapabilitySchemaBranch | null;
} {
  if (!branch) {
    return { inputSchema, projected: false, branch: null };
  }

  const capabilityProjection = CAPABILITY_BRANCH_FIELDS[capability];
  const branchProjection = capabilityProjection?.[branch.field]?.[branch.value];
  if (!branchProjection) {
    throw new Error(
      `Capability "${capability}" does not expose a describe projection for ${branch.field}=${branch.value}. Describe the full capability or use a supported branch.`
    );
  }

  if (!isRecord(inputSchema)) {
    throw new Error(
      `Capability "${capability}" returned a non-object input schema; branch projection is unavailable.`
    );
  }

  return {
    inputSchema: projectObjectSchema(inputSchema, branch, branchProjection),
    projected: true,
    branch,
  };
}

export function getCapabilityBranchFields(
  capability: string,
  branch: CapabilitySchemaBranch
): readonly string[] | null {
  return CAPABILITY_BRANCH_FIELDS[capability]?.[branch.field]?.[branch.value] ?? null;
}

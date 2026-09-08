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
  inspect_elements: {
    mode: {
      outline: ["mode", "include_cubes", "max_depth", "max_nodes"],
      search: [
        "mode",
        "name_pattern",
        "name_contains",
        "type",
        "parent_group",
        "min_size",
        "max_size",
        "selected_only",
        "limit",
      ],
      detail: ["mode", "id", "detail"],
    },
  },
  create_texture: {
    type: {
      blank: [
        "type",
        "name",
        "width",
        "height",
        "data",
        "group",
        "fill_color",
        "layer_name",
        "pbr_channel",
        "render_mode",
        "render_sides",
      ],
      template: [
        "type",
        "name",
        "texture_id",
        "width",
        "height",
        "pixel_density",
        "rearrange_uv",
        "power_of_two",
        "keep_multi_texture_occupancy",
        "padding",
        "group",
        "fill_color",
        "layer_name",
        "pbr_channel",
        "render_mode",
        "render_sides",
      ],
      variant: ["type", "name", "source_texture_id", "group"],
    },
  },
  manage_material: {
    operation: {
      create: [
        "operation",
        "name",
        "color_texture",
        "normal_texture",
        "height_texture",
        "mer_texture",
        "color_value",
        "mer_value",
        "subsurface_value",
      ],
      configure: [
        "operation",
        "material",
        "color_texture",
        "normal_texture",
        "height_texture",
        "mer_texture",
        "color_value",
        "mer_value",
        "subsurface_value",
      ],
      assign_channel: ["operation", "material", "texture", "channel"],
      save: ["operation", "material"],
    },
  },
  manage_material_instances: {
    operation: {
      list: ["operation", "include_usages", "usage_limit_per_instance"],
      get: ["operation", "cube_id", "faces"],
      set: ["operation", "cube_id", "material_name", "faces"],
      bulk_set: ["operation", "assignments"],
      clear: ["operation", "cube_id", "faces", "all_cubes"],
    },
  },
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
        "animation_id",
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

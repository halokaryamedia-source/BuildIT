export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type JsonObject = { [key: string]: JsonValue };

export type ParticleDocument = JsonObject & {
  format_version: string;
  particle_effect: JsonObject & {
    description: JsonObject & {
      identifier: string;
      basic_render_parameters: JsonObject & {
        material: string;
        texture: string;
      };
    };
    components?: JsonObject;
    curves?: JsonObject;
    events?: JsonObject;
  };
};

export type ParticleOperation =
  | { op: "set_identifier"; identifier: string }
  | { op: "set_render"; material?: string; texture?: string }
  | { op: "set_component"; component: string; value: JsonValue }
  | { op: "remove_component"; component: string }
  | { op: "set_curve"; name: string; value: JsonValue }
  | { op: "remove_curve"; name: string }
  | { op: "set_event"; name: string; value: JsonValue }
  | { op: "remove_event"; name: string };

export type ParticleDiagnostic = {
  severity: "error" | "warning";
  code: string;
  path: string;
  message: string;
};

export type ParticleInspection = {
  format_version: string;
  identifier: string;
  material: string;
  texture: string;
  component_count: number;
  component_names: string[];
  emitter_components: string[];
  particle_components: string[];
  curve_names: string[];
  event_names: string[];
  nested_particle_effects: string[];
  molang_expression_count: number;
  diagnostics: ParticleDiagnostic[];
};

const REQUIRED_ROOT_KEYS = new Set(["format_version", "particle_effect"]);
const REQUIRED_EFFECT_KEYS = new Set(["description"]);
const IDENTIFIER_PATTERN = /^[a-z0-9_.-]+:[a-z0-9_./-]+$/;
const COMPONENT_PREFIX = "minecraft:";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isJsonValue(value: unknown): value is JsonValue {
  if (value === null) return true;
  if (["string", "number", "boolean"].includes(typeof value)) {
    return typeof value !== "number" || Number.isFinite(value);
  }
  if (Array.isArray(value)) return value.every(isJsonValue);
  if (isObject(value)) return Object.values(value).every(isJsonValue);
  return false;
}

function cloneJson<T extends JsonValue>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function requireAuthoredString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must contain non-whitespace authored text.`);
  }
  return value.trim();
}

function ensureRecord(parent: JsonObject, key: string): JsonObject {
  const current = parent[key];
  if (current === undefined) {
    const created: JsonObject = {};
    parent[key] = created;
    return created;
  }
  if (!isObject(current) || !isJsonValue(current)) {
    throw new Error(`Expected ${key} to be an object.`);
  }
  return current as JsonObject;
}

export function createParticleDocument(input: {
  identifier: string;
  material?: string;
  texture?: string;
  format_version?: string;
}): ParticleDocument {
  const identifier = requireAuthoredString(input.identifier, "Particle identifier");
  const material = requireAuthoredString(input.material ?? "particles_alpha", "Particle material");
  const texture = requireAuthoredString(
    input.texture ?? "textures/particle/particles",
    "Particle texture"
  );
  const formatVersion = requireAuthoredString(input.format_version ?? "1.10.0", "Particle format_version");

  return {
    format_version: formatVersion,
    particle_effect: {
      description: {
        identifier,
        basic_render_parameters: { material, texture },
      },
      components: {},
    },
  };
}

export function parseParticleDocument(input: string | JsonObject): ParticleDocument {
  let parsed: unknown = input;
  if (typeof input === "string") {
    try {
      parsed = JSON.parse(input);
    } catch (error) {
      throw new Error(`Invalid particle JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  if (!isObject(parsed) || !isJsonValue(parsed)) {
    throw new Error("Particle document must be a JSON object containing only finite JSON values.");
  }

  const diagnostics = validateParticleDocument(parsed as JsonObject);
  const firstError = diagnostics.find((item) => item.severity === "error");
  if (firstError) {
    throw new Error(`${firstError.code} at ${firstError.path}: ${firstError.message}`);
  }
  return cloneJson(parsed as ParticleDocument);
}

export function validateParticleDocument(input: JsonObject): ParticleDiagnostic[] {
  const diagnostics: ParticleDiagnostic[] = [];
  const error = (code: string, path: string, message: string) =>
    diagnostics.push({ severity: "error", code, path, message });
  const warning = (code: string, path: string, message: string) =>
    diagnostics.push({ severity: "warning", code, path, message });

  const formatVersion = input.format_version;
  if (typeof formatVersion !== "string" || formatVersion.trim().length === 0) {
    error("PARTICLE_FORMAT_VERSION_REQUIRED", "$.format_version", "format_version must be a non-empty string.");
  }

  const effect = input.particle_effect;
  if (!isObject(effect)) {
    error("PARTICLE_EFFECT_REQUIRED", "$.particle_effect", "particle_effect must be an object.");
    return diagnostics;
  }

  const description = effect.description;
  if (!isObject(description)) {
    error("PARTICLE_DESCRIPTION_REQUIRED", "$.particle_effect.description", "description must be an object.");
    return diagnostics;
  }

  const identifier = description.identifier;
  if (typeof identifier !== "string" || identifier.trim().length === 0) {
    error("PARTICLE_IDENTIFIER_REQUIRED", "$.particle_effect.description.identifier", "identifier must be a non-empty string.");
  } else if (!IDENTIFIER_PATTERN.test(identifier)) {
    warning(
      "PARTICLE_IDENTIFIER_NONSTANDARD",
      "$.particle_effect.description.identifier",
      "identifier should use a lowercase namespace:path form for stable Bedrock lookup."
    );
  }

  const render = description.basic_render_parameters;
  if (!isObject(render)) {
    error(
      "PARTICLE_RENDER_PARAMETERS_REQUIRED",
      "$.particle_effect.description.basic_render_parameters",
      "basic_render_parameters must be an object."
    );
  } else {
    if (typeof render.material !== "string" || render.material.trim().length === 0) {
      error("PARTICLE_MATERIAL_REQUIRED", "$.particle_effect.description.basic_render_parameters.material", "material must be a non-empty string.");
    }
    if (typeof render.texture !== "string" || render.texture.trim().length === 0) {
      error("PARTICLE_TEXTURE_REQUIRED", "$.particle_effect.description.basic_render_parameters.texture", "texture must be a non-empty string.");
    }
  }

  for (const key of ["components", "curves", "events"] as const) {
    const value = effect[key];
    if (value !== undefined && !isObject(value)) {
      error(`PARTICLE_${key.toUpperCase()}_OBJECT`, `$.particle_effect.${key}`, `${key} must be an object when present.`);
    }
  }

  if (isObject(effect.components)) {
    for (const component of Object.keys(effect.components)) {
      if (!component.startsWith(COMPONENT_PREFIX)) {
        warning(
          "PARTICLE_COMPONENT_NONSTANDARD",
          `$.particle_effect.components.${component}`,
          "Bedrock particle components normally use the minecraft: namespace; the field is preserved for forward/extension compatibility."
        );
      }
    }
    const rateModes = [
      "minecraft:emitter_rate_instant",
      "minecraft:emitter_rate_steady",
      "minecraft:emitter_rate_manual",
    ].filter((name) => name in effect.components!);
    if (rateModes.length > 1) {
      warning(
        "PARTICLE_MULTIPLE_EMITTER_RATES",
        "$.particle_effect.components",
        `Multiple emitter rate modes are authored (${rateModes.join(", ")}); Bedrock effects normally select one.`
      );
    }
    const lifetimeModes = [
      "minecraft:emitter_lifetime_looping",
      "minecraft:emitter_lifetime_once",
      "minecraft:emitter_lifetime_expression",
    ].filter((name) => name in effect.components!);
    if (lifetimeModes.length > 1) {
      warning(
        "PARTICLE_MULTIPLE_EMITTER_LIFETIMES",
        "$.particle_effect.components",
        `Multiple emitter lifetime modes are authored (${lifetimeModes.join(", ")}); Bedrock effects normally select one.`
      );
    }
    const shapeModes = Object.keys(effect.components).filter((name) => name.startsWith("minecraft:emitter_shape_"));
    if (shapeModes.length > 1) {
      warning(
        "PARTICLE_MULTIPLE_EMITTER_SHAPES",
        "$.particle_effect.components",
        `Multiple emitter shape components are authored (${shapeModes.join(", ")}); verify this is intentional.`
      );
    }
  }

  for (const key of Object.keys(input)) {
    if (!REQUIRED_ROOT_KEYS.has(key)) {
      warning("PARTICLE_UNKNOWN_ROOT_FIELD", `$.${key}`, "Unknown root field is preserved during targeted mutation.");
    }
  }
  for (const key of Object.keys(effect)) {
    if (![...REQUIRED_EFFECT_KEYS, "components", "curves", "events"].includes(key)) {
      warning("PARTICLE_UNKNOWN_EFFECT_FIELD", `$.particle_effect.${key}`, "Unknown particle_effect field is preserved during targeted mutation.");
    }
  }

  return diagnostics;
}

export function applyParticleOperations(
  input: ParticleDocument,
  operations: readonly ParticleOperation[]
): ParticleDocument {
  if (operations.length === 0) throw new Error("Particle mutation requires at least one operation.");
  if (operations.length > 64) throw new Error("Particle mutation supports at most 64 operations per bounded batch.");

  const next = cloneJson(input);
  const effect = next.particle_effect;
  const description = effect.description;
  const render = description.basic_render_parameters;
  const touched = new Set<string>();

  for (const [index, operation] of operations.entries()) {
    const target =
      operation.op === "set_identifier" ? "identifier" :
      operation.op === "set_render" ? "render" :
      "component" in operation ? `component:${operation.component}` :
      "name" in operation ? `${operation.op.includes("curve") ? "curve" : "event"}:${operation.name}` : operation.op;
    if (touched.has(target)) {
      throw new Error(`Particle operation ${index} targets ${target} more than once in one batch; submit one final mutation per target.`);
    }
    touched.add(target);

    switch (operation.op) {
      case "set_identifier":
        description.identifier = requireAuthoredString(operation.identifier, "Particle identifier");
        break;
      case "set_render": {
        if (operation.material === undefined && operation.texture === undefined) {
          throw new Error("set_render requires material and/or texture.");
        }
        if (operation.material !== undefined) render.material = requireAuthoredString(operation.material, "Particle material");
        if (operation.texture !== undefined) render.texture = requireAuthoredString(operation.texture, "Particle texture");
        break;
      }
      case "set_component": {
        const component = requireAuthoredString(operation.component, "Particle component");
        if (!isJsonValue(operation.value)) throw new Error(`Particle component ${component} contains a non-JSON or non-finite value.`);
        ensureRecord(effect, "components")[component] = cloneJson(operation.value);
        break;
      }
      case "remove_component": {
        const component = requireAuthoredString(operation.component, "Particle component");
        const components = ensureRecord(effect, "components");
        if (!(component in components)) throw new Error(`Particle component ${component} does not exist.`);
        delete components[component];
        break;
      }
      case "set_curve": {
        const name = requireAuthoredString(operation.name, "Particle curve name");
        if (!isJsonValue(operation.value)) throw new Error(`Particle curve ${name} contains a non-JSON or non-finite value.`);
        ensureRecord(effect, "curves")[name] = cloneJson(operation.value);
        break;
      }
      case "remove_curve": {
        const name = requireAuthoredString(operation.name, "Particle curve name");
        const curves = ensureRecord(effect, "curves");
        if (!(name in curves)) throw new Error(`Particle curve ${name} does not exist.`);
        delete curves[name];
        break;
      }
      case "set_event": {
        const name = requireAuthoredString(operation.name, "Particle event name");
        if (!isJsonValue(operation.value)) throw new Error(`Particle event ${name} contains a non-JSON or non-finite value.`);
        ensureRecord(effect, "events")[name] = cloneJson(operation.value);
        break;
      }
      case "remove_event": {
        const name = requireAuthoredString(operation.name, "Particle event name");
        const events = ensureRecord(effect, "events");
        if (!(name in events)) throw new Error(`Particle event ${name} does not exist.`);
        delete events[name];
        break;
      }
    }
  }

  const diagnostics = validateParticleDocument(next);
  const firstError = diagnostics.find((item) => item.severity === "error");
  if (firstError) throw new Error(`${firstError.code} at ${firstError.path}: ${firstError.message}`);
  if (JSON.stringify(next) === JSON.stringify(input)) {
    throw new Error("Particle mutation is a destructive no-op; no authored state changed.");
  }
  return next;
}

function collectNestedParticleEffects(value: JsonValue, output: Set<string>): void {
  if (Array.isArray(value)) {
    value.forEach((entry) => collectNestedParticleEffects(entry, output));
    return;
  }
  if (!isObject(value)) return;
  const particleEffect = value.particle_effect;
  if (isObject(particleEffect) && typeof particleEffect.effect === "string" && particleEffect.effect.trim()) {
    output.add(particleEffect.effect.trim());
  }
  Object.values(value).forEach((entry) => {
    if (isJsonValue(entry)) collectNestedParticleEffects(entry, output);
  });
}

function countMolangExpressions(value: JsonValue): number {
  if (typeof value === "string") {
    const text = value.trim();
    if (!text) return 0;
    return /(?:variable\.|query\.|math\.|context\.|temp\.|v\.|q\.|c\.|t\.)/i.test(text) ? 1 : 0;
  }
  if (Array.isArray(value)) return value.reduce((sum, entry) => sum + countMolangExpressions(entry), 0);
  if (isObject(value)) {
    return Object.values(value).reduce((sum, entry) => sum + (isJsonValue(entry) ? countMolangExpressions(entry) : 0), 0);
  }
  return 0;
}

export function inspectParticleDocument(input: ParticleDocument): ParticleInspection {
  const effect = input.particle_effect;
  const components = isObject(effect.components) ? effect.components : {};
  const curves = isObject(effect.curves) ? effect.curves : {};
  const events = isObject(effect.events) ? effect.events : {};
  const componentNames = Object.keys(components).sort();
  const nested = new Set<string>();
  collectNestedParticleEffects(input, nested);

  return {
    format_version: input.format_version,
    identifier: String(effect.description.identifier),
    material: String(effect.description.basic_render_parameters.material),
    texture: String(effect.description.basic_render_parameters.texture),
    component_count: componentNames.length,
    component_names: componentNames,
    emitter_components: componentNames.filter((name) => name.startsWith("minecraft:emitter_")),
    particle_components: componentNames.filter((name) => name.startsWith("minecraft:particle_")),
    curve_names: Object.keys(curves).sort(),
    event_names: Object.keys(events).sort(),
    nested_particle_effects: [...nested].sort(),
    molang_expression_count: countMolangExpressions(input),
    diagnostics: validateParticleDocument(input),
  };
}

export function serializeParticleDocument(input: ParticleDocument, space = 2): string {
  const diagnostics = validateParticleDocument(input);
  const firstError = diagnostics.find((item) => item.severity === "error");
  if (firstError) throw new Error(`${firstError.code} at ${firstError.path}: ${firstError.message}`);
  if (!Number.isInteger(space) || space < 0 || space > 8) throw new Error("Particle JSON indentation must be an integer from 0 to 8.");
  return `${JSON.stringify(input, null, space)}\n`;
}

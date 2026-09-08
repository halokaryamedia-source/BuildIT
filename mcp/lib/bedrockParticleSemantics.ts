import { MOLANG_ANIMATION_MATH_SYMBOLS } from "./animationMolangSemantics";
import type {
  JsonObject,
  JsonValue,
  ParticleDiagnostic,
} from "./bedrockParticleDocument";

export const BEDROCK_PARTICLE_SPECIAL_MOLANG_VARIABLES = Object.freeze([
  "variable.emitter_age",
  "variable.emitter_lifetime",
  "variable.emitter_random_1",
  "variable.emitter_random_2",
  "variable.emitter_random_3",
  "variable.emitter_random_4",
  "variable.entity_scale",
  "variable.particle_age",
  "variable.particle_lifetime",
  "variable.particle_random_1",
  "variable.particle_random_2",
  "variable.particle_random_3",
  "variable.particle_random_4",
] as const);

const OFFICIAL_MATH = new Set<string>(MOLANG_ANIMATION_MATH_SYMBOLS);
const RANDOM_MATH = new Set([
  "die_roll",
  "die_roll_integer",
  "random",
  "random_integer",
]);
const NON_EXPRESSION_KEYS = new Set([
  "identifier",
  "material",
  "texture",
  "effect",
  "type",
  "event",
  "event_name",
  "facing_camera_mode",
  "mode",
]);
const STATEMENT_FIELDS = new Set([
  "creation_expression",
  "per_update_expression",
  "per_render_expression",
  "expression",
  "pre_effect_expression",
]);
const MAX_DIAGNOSTICS = 32;

type LocatedExpression = {
  path: string;
  key: string;
  expression: string;
};

function object(value: JsonValue | undefined): JsonObject | null {
  return value !== undefined &&
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
    ? (value as JsonObject)
    : null;
}

function pathSegment(parent: string, key: string | number): string {
  if (typeof key === "number") return `${parent}[${key}]`;
  return parent ? `${parent}.${key}` : key;
}

function isLikelyMolang(value: string, key: string): boolean {
  if (NON_EXPRESSION_KEYS.has(key)) return false;
  const text = value.trim();
  if (!text) return false;
  if (/\b(?:math|variable|query|temp|context|v|q|t|c)\.[a-z_]/i.test(text)) {
    return true;
  }
  if (/[+*/%?<>]=?|==|!=|&&|\|\|/.test(text)) return true;
  if (/\breturn\b|[;{}]/i.test(text)) return true;
  return false;
}

function collectExpressions(
  value: JsonValue,
  path: string,
  key: string,
  output: LocatedExpression[]
): void {
  if (typeof value === "string") {
    if (isLikelyMolang(value, key)) {
      output.push({ path, key, expression: value.trim() });
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      collectExpressions(entry, pathSegment(path, index), key, output)
    );
    return;
  }
  const current = object(value);
  if (!current) return;
  for (const [childKey, child] of Object.entries(current)) {
    collectExpressions(child, pathSegment(path, childKey), childKey, output);
  }
}

function delimiterIssue(expression: string): string | null {
  const stack: string[] = [];
  const matching: Record<string, string> = {
    ")": "(",
    "]": "[",
    "}": "{",
  };
  let quote: "'" | '"' | null = null;
  let escaped = false;

  for (const char of expression) {
    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === quote) quote = null;
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      continue;
    }
    if (char === "(" || char === "[" || char === "{") {
      stack.push(char);
      continue;
    }
    if (char === ")" || char === "]" || char === "}") {
      if (stack.pop() !== matching[char]) return `Unexpected ${char}.`;
    }
  }

  if (quote) return "Unterminated quoted string.";
  if (stack.length > 0) return `Unclosed ${stack[stack.length - 1]}.`;
  return null;
}

function mathSymbols(expression: string): string[] {
  const values = new Set<string>();
  for (const match of expression.matchAll(/\bmath\.([a-z_][a-z0-9_]*)\s*\(/gi)) {
    values.add(match[1].toLowerCase());
  }
  if (/\bmath\.pi\b/i.test(expression)) values.add("pi");
  return [...values].sort();
}

function canonicalVariables(expression: string): string[] {
  const values = new Set<string>();
  const aliases: Record<string, string> = {
    v: "variable",
    variable: "variable",
    q: "query",
    query: "query",
    t: "temp",
    temp: "temp",
    c: "context",
    context: "context",
  };
  for (const match of expression.matchAll(
    /\b(v|variable|q|query|t|temp|c|context)\.([a-z_][a-z0-9_]*)/gi
  )) {
    values.add(`${aliases[match[1].toLowerCase()]}.${match[2].toLowerCase()}`);
  }
  return [...values].sort();
}

function hasLiteralZeroDivisor(expression: string): boolean {
  return /\/\s*(?:\(\s*)?0+(?:\.0+)?(?:\s*\))?(?![\d.])/i.test(expression) ||
    /\bmath\.mod\s*\([^,]+,\s*0+(?:\.0+)?\s*\)/i.test(expression);
}

function isLegacyMolangObject(value: JsonValue | undefined): boolean {
  const current = object(value);
  return Boolean(
    current &&
      typeof current.expression === "string" &&
      (current.version === undefined ||
        (typeof current.version === "number" && Number.isInteger(current.version)))
  );
}

function isMolangScalar(value: JsonValue | undefined): boolean {
  return typeof value === "number" ||
    typeof value === "string" ||
    isLegacyMolangObject(value);
}

function push(
  diagnostics: ParticleDiagnostic[],
  diagnostic: ParticleDiagnostic
): void {
  if (diagnostics.length < MAX_DIAGNOSTICS) diagnostics.push(diagnostic);
}

function validateScalar(
  diagnostics: ParticleDiagnostic[],
  value: JsonValue | undefined,
  path: string,
  required = false
): void {
  if (value === undefined) {
    if (required) {
      push(diagnostics, {
        severity: "error",
        code: "missing_molang_scalar",
        message: `${path} requires a numeric or Molang value.`,
        path,
      });
    }
    return;
  }
  if (!isMolangScalar(value)) {
    push(diagnostics, {
      severity: "error",
      code: "invalid_molang_scalar",
      message: `${path} must be a number, Molang string, or legacy Molang expression object.`,
      path,
    });
  }
}

function validateVector(
  diagnostics: ParticleDiagnostic[],
  value: JsonValue | undefined,
  length: number,
  path: string,
  required = false
): void {
  if (value === undefined) {
    if (required) {
      push(diagnostics, {
        severity: "error",
        code: "missing_molang_vector",
        message: `${path} requires ${length} numeric/Molang values.`,
        path,
      });
    }
    return;
  }
  if (!Array.isArray(value) || value.length !== length) return;
  value.forEach((entry, index) => {
    if (!isMolangScalar(entry)) {
      push(diagnostics, {
        severity: "error",
        code: "invalid_molang_vector_member",
        message: `${path}[${index}] must be a number or Molang expression.`,
        path: `${path}[${index}]`,
      });
    }
  });
}

function validateKnownMathSlots(
  diagnostics: ParticleDiagnostic[],
  components: JsonObject
): void {
  const scalarSlots = [
    ["minecraft:emitter_rate_instant", "num_particles"],
    ["minecraft:emitter_rate_steady", "spawn_rate"],
    ["minecraft:emitter_rate_steady", "max_particles"],
    ["minecraft:emitter_rate_manual", "max_particles"],
    ["minecraft:emitter_lifetime_looping", "active_time"],
    ["minecraft:emitter_lifetime_looping", "sleep_time"],
    ["minecraft:emitter_lifetime_once", "active_time"],
    ["minecraft:emitter_shape_sphere", "radius"],
    ["minecraft:emitter_shape_disc", "radius"],
    ["minecraft:particle_lifetime_expression", "max_lifetime"],
    ["minecraft:particle_initial_spin", "rotation"],
    ["minecraft:particle_initial_spin", "rotation_rate"],
    ["minecraft:particle_motion_dynamic", "linear_drag_coefficient"],
    ["minecraft:particle_motion_dynamic", "rotation_acceleration"],
    ["minecraft:particle_motion_dynamic", "rotation_drag_coefficient"],
    ["minecraft:particle_motion_parametric", "rotation"],
    ["minecraft:particle_motion_collision", "collision_drag"],
    ["minecraft:particle_motion_collision", "coefficient_of_restitution"],
    ["minecraft:particle_motion_collision", "collision_radius"],
  ] as const;
  for (const [component, field] of scalarSlots) {
    const owner = object(components[component]);
    if (owner) {
      validateScalar(
        diagnostics,
        owner[field],
        `particle_effect.components.${component}.${field}`
      );
    }
  }

  const vectorSlots = [
    ["minecraft:emitter_shape_point", "offset", 3],
    ["minecraft:emitter_shape_sphere", "offset", 3],
    ["minecraft:emitter_shape_box", "offset", 3],
    ["minecraft:emitter_shape_box", "half_dimensions", 3],
    ["minecraft:emitter_shape_disc", "offset", 3],
    ["minecraft:emitter_shape_disc", "plane_normal", 3],
    ["minecraft:emitter_shape_custom", "offset", 3],
    ["minecraft:particle_motion_dynamic", "linear_acceleration", 3],
    ["minecraft:particle_motion_parametric", "relative_position", 3],
    ["minecraft:particle_motion_parametric", "direction", 3],
  ] as const;
  for (const [component, field, length] of vectorSlots) {
    const owner = object(components[component]);
    if (owner) {
      validateVector(
        diagnostics,
        owner[field],
        length,
        `particle_effect.components.${component}.${field}`
      );
    }
  }

  const initialSpeed = components["minecraft:particle_initial_speed"];
  if (initialSpeed !== undefined) {
    if (Array.isArray(initialSpeed)) {
      validateVector(
        diagnostics,
        initialSpeed,
        3,
        "particle_effect.components.minecraft:particle_initial_speed"
      );
    } else {
      validateScalar(
        diagnostics,
        initialSpeed,
        "particle_effect.components.minecraft:particle_initial_speed"
      );
    }
  }
  validateVector(
    diagnostics,
    components["minecraft:particle_kill_plane"],
    4,
    "particle_effect.components.minecraft:particle_kill_plane"
  );

  const billboard = object(components["minecraft:particle_appearance_billboard"]);
  if (billboard) {
    validateVector(
      diagnostics,
      billboard.size,
      2,
      "particle_effect.components.minecraft:particle_appearance_billboard.size"
    );
    const direction = object(billboard.direction);
    if (direction) {
      validateVector(
        diagnostics,
        direction.custom_direction,
        3,
        "particle_effect.components.minecraft:particle_appearance_billboard.direction.custom_direction"
      );
      validateScalar(
        diagnostics,
        direction.min_speed_threshold,
        "particle_effect.components.minecraft:particle_appearance_billboard.direction.min_speed_threshold"
      );
    }
  }
}

function validateFlipbook(
  diagnostics: ParticleDiagnostic[],
  components: JsonObject
): void {
  const billboard = object(components["minecraft:particle_appearance_billboard"]);
  const uv = billboard ? object(billboard.uv) : null;
  if (!uv) return;

  for (const dimension of ["texture_width", "texture_height"] as const) {
    const value = uv[dimension];
    if (
      value !== undefined &&
      (typeof value !== "number" || !Number.isInteger(value) || value <= 0)
    ) {
      push(diagnostics, {
        severity: "error",
        code: "invalid_particle_texture_dimension",
        message: `${dimension} must be a positive integer when authored.`,
        path: `particle_effect.components.minecraft:particle_appearance_billboard.uv.${dimension}`,
      });
    }
  }
  validateVector(
    diagnostics,
    uv.uv,
    2,
    "particle_effect.components.minecraft:particle_appearance_billboard.uv.uv"
  );
  validateVector(
    diagnostics,
    uv.uv_size,
    2,
    "particle_effect.components.minecraft:particle_appearance_billboard.uv.uv_size"
  );

  const flipbook = object(uv.flipbook);
  if (!flipbook) return;
  validateVector(
    diagnostics,
    flipbook.base_UV,
    2,
    "particle_effect.components.minecraft:particle_appearance_billboard.uv.flipbook.base_UV"
  );
  validateVector(
    diagnostics,
    flipbook.size_UV,
    2,
    "particle_effect.components.minecraft:particle_appearance_billboard.uv.flipbook.size_UV"
  );
  validateVector(
    diagnostics,
    flipbook.step_UV,
    2,
    "particle_effect.components.minecraft:particle_appearance_billboard.uv.flipbook.step_UV"
  );
  validateScalar(
    diagnostics,
    flipbook.max_frame,
    "particle_effect.components.minecraft:particle_appearance_billboard.uv.flipbook.max_frame"
  );

  const fps = flipbook.frames_per_second;
  if (fps !== undefined && (typeof fps !== "number" || !Number.isFinite(fps) || fps < 0)) {
    push(diagnostics, {
      severity: "error",
      code: "invalid_flipbook_fps",
      message: "frames_per_second must be a finite non-negative number.",
      path: "particle_effect.components.minecraft:particle_appearance_billboard.uv.flipbook.frames_per_second",
    });
  }
  for (const flag of ["stretch_to_lifetime", "loop"] as const) {
    if (flipbook[flag] !== undefined && typeof flipbook[flag] !== "boolean") {
      push(diagnostics, {
        severity: "error",
        code: "invalid_flipbook_flag",
        message: `${flag} must be boolean when authored.`,
        path: `particle_effect.components.minecraft:particle_appearance_billboard.uv.flipbook.${flag}`,
      });
    }
  }

  const width = typeof uv.texture_width === "number" ? uv.texture_width : null;
  const height = typeof uv.texture_height === "number" ? uv.texture_height : null;
  const base = flipbook.base_UV;
  const size = flipbook.size_UV;
  const step = flipbook.step_UV;
  const maxFrame = typeof flipbook.max_frame === "number" ? flipbook.max_frame : null;
  if (
    width &&
    height &&
    Array.isArray(base) &&
    Array.isArray(size) &&
    Array.isArray(step) &&
    base.every((value) => typeof value === "number") &&
    size.every((value) => typeof value === "number") &&
    step.every((value) => typeof value === "number") &&
    maxFrame !== null &&
    Number.isFinite(maxFrame) &&
    maxFrame >= 1
  ) {
    const last = Math.max(0, Math.ceil(maxFrame) - 1);
    const endU = (base[0] as number) + (step[0] as number) * last + (size[0] as number);
    const endV = (base[1] as number) + (step[1] as number) * last + (size[1] as number);
    const minU = Math.min(base[0] as number, (base[0] as number) + (step[0] as number) * last);
    const minV = Math.min(base[1] as number, (base[1] as number) + (step[1] as number) * last);
    if (minU < 0 || minV < 0 || endU > width || endV > height) {
      push(diagnostics, {
        severity: "warning",
        code: "flipbook_frame_outside_texture",
        message: "The literal flipbook frame sequence extends outside the authored particle texture dimensions.",
        path: "particle_effect.components.minecraft:particle_appearance_billboard.uv.flipbook",
      });
    }
  }
}

function validateCurves(
  diagnostics: ParticleDiagnostic[],
  curves: JsonObject
): void {
  for (const [name, raw] of Object.entries(curves)) {
    const curve = object(raw);
    if (!curve) continue;
    const type = typeof curve.type === "string" ? curve.type : null;
    const nodes = curve.nodes;
    if (type === "bezier") {
      if (!Array.isArray(nodes) || nodes.length !== 4) {
        push(diagnostics, {
          severity: "error",
          code: "invalid_bezier_curve_nodes",
          message: `Bezier curve "${name}" requires exactly four equally-spaced control nodes.`,
          path: `particle_effect.curves.${name}.nodes`,
        });
      }
    } else if (type === "linear") {
      if (!Array.isArray(nodes) || nodes.length < 2) {
        push(diagnostics, {
          severity: "error",
          code: "invalid_linear_curve_nodes",
          message: `Linear curve "${name}" requires at least two nodes.`,
          path: `particle_effect.curves.${name}.nodes`,
        });
      }
    } else if (type === "catmull_rom") {
      if (!Array.isArray(nodes) || nodes.length < 4) {
        push(diagnostics, {
          severity: "error",
          code: "invalid_catmull_rom_curve_nodes",
          message: `Catmull-Rom curve "${name}" requires at least four nodes so endpoint slopes are defined.`,
          path: `particle_effect.curves.${name}.nodes`,
        });
      }
    } else if (type === "bezier_chain") {
      const chain = object(nodes);
      if (!chain || Object.keys(chain).length < 2) {
        push(diagnostics, {
          severity: "error",
          code: "invalid_bezier_chain_nodes",
          message: `Bezier-chain curve "${name}" requires at least two keyed node objects.`,
          path: `particle_effect.curves.${name}.nodes`,
        });
      } else {
        for (const [key, nodeRaw] of Object.entries(chain)) {
          if (!Number.isFinite(Number(key))) {
            push(diagnostics, {
              severity: "error",
              code: "invalid_bezier_chain_key",
              message: `Bezier-chain node key "${key}" must be numeric.`,
              path: `particle_effect.curves.${name}.nodes.${key}`,
            });
          }
          const node = object(nodeRaw);
          if (!node || !isMolangScalar(node.value)) {
            push(diagnostics, {
              severity: "error",
              code: "invalid_bezier_chain_value",
              message: `Bezier-chain node "${key}" requires a numeric/Molang value.`,
              path: `particle_effect.curves.${name}.nodes.${key}.value`,
            });
          }
        }
      }
      if (curve.horizontal_range !== undefined) {
        push(diagnostics, {
          severity: "info",
          code: "bezier_chain_ignores_horizontal_range",
          message: `Curve "${name}" is bezier_chain; Bedrock ignores horizontal_range for this curve type.`,
          path: `particle_effect.curves.${name}.horizontal_range`,
        });
      }
    }

    validateScalar(
      diagnostics,
      curve.input,
      `particle_effect.curves.${name}.input`,
      true
    );
    if (curve.horizontal_range !== undefined) {
      validateScalar(
        diagnostics,
        curve.horizontal_range,
        `particle_effect.curves.${name}.horizontal_range`
      );
    }
    if (Array.isArray(nodes)) {
      nodes.forEach((node, index) => {
        if (!isMolangScalar(node)) {
          push(diagnostics, {
            severity: "error",
            code: "invalid_curve_node_value",
            message: `Curve node ${index} must be numeric or Molang.`,
            path: `particle_effect.curves.${name}.nodes[${index}]`,
          });
        }
      });
    }
  }
}

function validateRandomizeWeights(
  diagnostics: ParticleDiagnostic[],
  value: JsonValue,
  path: string
): void {
  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      validateRandomizeWeights(entry, `${path}[${index}]`)
    );
    return;
  }
  const node = object(value);
  if (!node) return;
  if (Array.isArray(node.randomize)) {
    let total = 0;
    let allNumeric = true;
    node.randomize.forEach((raw, index) => {
      const branch = object(raw);
      const weight = branch?.weight;
      if (weight === undefined) {
        total += 1;
      } else if (typeof weight === "number" && Number.isFinite(weight) && weight >= 0) {
        total += weight;
      } else {
        allNumeric = false;
        push(diagnostics, {
          severity: "error",
          code: "invalid_particle_randomize_weight",
          message: "Particle event randomize weight must be a finite non-negative number.",
          path: `${path}.randomize[${index}].weight`,
        });
      }
    });
    if (allNumeric && node.randomize.length > 0 && total <= 0) {
      push(diagnostics, {
        severity: "error",
        code: "zero_particle_randomize_weight",
        message: "Particle event randomize branches must have a positive total weight.",
        path: `${path}.randomize`,
      });
    }
  }
  for (const [key, child] of Object.entries(node)) {
    validateRandomizeWeights(child, `${path}.${key}`);
  }
}

function countNestedEffects(value: JsonValue): number {
  if (Array.isArray(value)) {
    return value.reduce((sum, entry) => sum + countNestedEffects(entry), 0);
  }
  const node = object(value);
  if (!node) return 0;
  let count = object(node.particle_effect) ? 1 : 0;
  for (const child of Object.values(node)) count += countNestedEffects(child);
  return count;
}

function analyzeExpressions(
  diagnostics: ParticleDiagnostic[],
  expressions: readonly LocatedExpression[]
): void {
  let parametricMathCalls = 0;
  let parametricExpressions = 0;
  for (const input of expressions) {
    const delimiter = delimiterIssue(input.expression);
    if (delimiter) {
      push(diagnostics, {
        severity: "error",
        code: "invalid_particle_molang_syntax",
        message: `Molang delimiter/quote structure is invalid: ${delimiter}`,
        path: input.path,
      });
      continue;
    }

    const symbols = mathSymbols(input.expression);
    for (const symbol of symbols) {
      if (!OFFICIAL_MATH.has(symbol)) {
        push(diagnostics, {
          severity: "warning",
          code: "unknown_particle_molang_math",
          message: `math.${symbol} is not in BlockIT's current official Bedrock math catalog; preserve only when intentionally targeting a newer runtime.`,
          path: input.path,
        });
      }
    }
    if (hasLiteralZeroDivisor(input.expression)) {
      push(diagnostics, {
        severity: "warning",
        code: "literal_zero_divisor",
        message: "Molang expression contains an obvious literal zero divisor.",
        path: input.path,
      });
    }
    if (
      !STATEMENT_FIELDS.has(input.key) &&
      input.expression.includes(";") &&
      !/\breturn\b/i.test(input.expression)
    ) {
      push(diagnostics, {
        severity: "warning",
        code: "particle_molang_value_missing_return",
        message: "This value-producing Molang field contains statements but no explicit return.",
        path: input.path,
      });
    }

    const variables = canonicalVariables(input.expression);
    if (
      input.path.includes(".minecraft:emitter_") &&
      variables.some((value) =>
        /^variable\.particle_(?:age|lifetime|random_[1-4])$/.test(value)
      )
    ) {
      push(diagnostics, {
        severity: "warning",
        code: "particle_variable_in_emitter_context",
        message: "Emitter-scoped Molang references a per-particle special variable; verify the runtime context supplies it.",
        path: input.path,
      });
    }

    if (input.path.endsWith("minecraft:particle_initialization.per_render_expression")) {
      const random = symbols.filter((symbol) => RANDOM_MATH.has(symbol));
      if (random.length > 0) {
        push(diagnostics, {
          severity: "warning",
          code: "per_render_random_molang",
          message: `Per-render Molang uses nondeterministic math (${random.map((name) => `math.${name}`).join(", ")}); verify that frame-to-frame variation is intentional.`,
          path: input.path,
        });
      }
      if (symbols.length >= 6 || input.expression.length > 320) {
        push(diagnostics, {
          severity: "warning",
          code: "expensive_per_render_molang",
          message: "Per-render Molang is relatively complex and executes for every rendered particle frame; profile target hardware.",
          path: input.path,
        });
      }
    }

    if (input.path.includes(".minecraft:particle_motion_parametric.")) {
      parametricExpressions += 1;
      parametricMathCalls += symbols.length;
    }
  }

  if (parametricExpressions > 0) {
    push(diagnostics, {
      severity: parametricMathCalls >= 12 ? "warning" : "info",
      code:
        parametricMathCalls >= 12
          ? "complex_parametric_motion_molang"
          : "parametric_motion_molang",
      message:
        parametricMathCalls >= 12
          ? "Parametric particle motion contains many distinct math functions and is evaluated every frame; profile target hardware."
          : "Parametric particle motion uses Molang evaluated every frame; native preview should verify the intended mathematical path.",
      path: "particle_effect.components.minecraft:particle_motion_parametric",
    });
  }
}

export function analyzeBedrockParticleSemantics(
  document: JsonObject
): ParticleDiagnostic[] {
  const diagnostics: ParticleDiagnostic[] = [];
  const effect = object(document.particle_effect);
  if (!effect) return diagnostics;
  const components = object(effect.components) ?? {};
  const curves = object(effect.curves) ?? {};
  const events = object(effect.events) ?? {};

  validateKnownMathSlots(diagnostics, components);
  validateFlipbook(diagnostics, components);
  validateCurves(diagnostics, curves);
  for (const [name, event] of Object.entries(events)) {
    validateRandomizeWeights(
      diagnostics,
      event,
      `particle_effect.events.${name}`
    );
    const fanout = countNestedEffects(event);
    if (fanout > 6) {
      push(diagnostics, {
        severity: "warning",
        code: "high_particle_event_fanout",
        message: `Event "${name}" contains ${fanout} nested particle-effect nodes; verify the runtime fan-out is bounded.`,
        path: `particle_effect.events.${name}`,
      });
    }
  }

  const expressions: LocatedExpression[] = [];
  collectExpressions(document, "", "", expressions);
  analyzeExpressions(diagnostics, expressions);

  const parametric = components["minecraft:particle_motion_parametric"];
  const capOwner = object(components["minecraft:emitter_rate_steady"]) ??
    object(components["minecraft:emitter_rate_manual"]);
  const cap = capOwner?.max_particles;
  if (
    parametric !== undefined &&
    typeof cap === "number" &&
    Number.isFinite(cap) &&
    cap > 512
  ) {
    push(diagnostics, {
      severity: "warning",
      code: "parametric_particle_budget",
      message: `Parametric per-frame motion is combined with max_particles=${cap}; profile target hardware.`,
      path: "particle_effect.components",
    });
  }

  if (diagnostics.length >= MAX_DIAGNOSTICS) {
    diagnostics[MAX_DIAGNOSTICS - 1] = {
      severity: "info",
      code: "particle_semantic_diagnostics_truncated",
      message: `Advanced particle diagnostics were bounded to ${MAX_DIAGNOSTICS} entries.`,
      path: "particle_effect",
    };
  }
  return diagnostics;
}

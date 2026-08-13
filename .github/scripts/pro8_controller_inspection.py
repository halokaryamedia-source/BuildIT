from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text()
    if old not in text:
        raise SystemExit(f"Expected text not found in {path}: {old[:160]!r}")
    p.write_text(text.replace(old, new, 1))

p = Path("mcp/server/tools/animation-inspection.ts")
t = p.read_text()

# Public schema: one focused controller-state selector, no new tool.
old = '''  bone: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Optional Group UUID or unique exact name. Omit for animation/bone summaries; provide for detailed authored keyframes."
    ),
  include_effect_keyframes: z
'''
new = '''  bone: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Optional Group UUID or unique exact name. Use only for authored Animation bone/keyframe detail."
    ),
  state: z
    .string()
    .min(1)
    .optional()
    .describe("Optional AnimationController state UUID or unique exact state name for focused state-machine detail."),
  include_effect_keyframes: z
'''
if old not in t:
    raise SystemExit("inspection schema anchor missing")
t = t.replace(old, new, 1)
t = t.replace(
    '    "Exact Animation UUID or exact unique Animation name. If omitted, uses the currently selected Animation."',
    '    "Exact Animation/AnimationController UUID or unique exact name. If omitted, uses the selected AnimationItem."',
    1,
)
t = t.replace(
    '      "Returns read-only Animation identity/settings plus bone and particle/sound summaries. Supply `bone` for transform keyframes; set `include_effect_keyframes=true` only for full effect timing/data.",',
    '      "Read-only Animation or AnimationController inspection. Use `bone` for transform keyframes, `state` for controller state detail, and effect detail only for authored Animation keyframes.",',
    1,
)

start = t.index("function resolveAnimation(reference?: string): _Animation {")
end = t.index("\nfunction resolveGroup", start)
resolver = '''type InspectableAnimationItem = _Animation | AnimationController;

function isAnimationController(item: InspectableAnimationItem): item is AnimationController {
  return typeof AnimationController !== "undefined" && item instanceof AnimationController;
}

function resolveAnimationItem(reference?: string): InspectableAnimationItem {
  const allItems = AnimationItem.all as unknown as InspectableAnimationItem[];
  if (reference === undefined) {
    const selected = AnimationItem.selected as unknown as InspectableAnimationItem | null;
    if (!selected) {
      throw new Error(
        "No AnimationItem selected. Pass an exact Animation/AnimationController UUID or unique exact name."
      );
    }
    return selected;
  }

  const uuidMatch = allItems.find((item) => item.uuid === reference);
  if (uuidMatch) return uuidMatch;

  const nameMatches = allItems.filter((item) => item.name === reference);
  if (nameMatches.length === 1) return nameMatches[0];
  if (nameMatches.length > 1) {
    throw new Error(
      `AnimationItem name "${reference}" is ambiguous. Use an exact UUID. Candidates: ${nameMatches
        .map((item) => `${item.name} (${item.uuid})`)
        .join(", ")}`
    );
  }

  throw new Error(
    `AnimationItem "${reference}" not found. Pass an exact Animation/AnimationController UUID or unique exact name.`
  );
}
'''
t = t[:start] + resolver + t[end:]

anchor = "\nfunction inspectKeyframe(keyframe: _Keyframe) {"
controller_helpers = r'''
type ControllerStateView = AnimationControllerState & {
  animations: Array<{ uuid: string; key: string; animation: string; blend_value: string | number }>;
  transitions: Array<{ uuid: string; target: string; condition: string }>;
  sounds: Array<{ uuid?: string; effect?: string }>;
  particles: Array<{
    uuid?: string;
    effect?: string;
    locator?: string;
    bind_to_actor?: boolean;
    pre_effect_script?: string;
  }>;
  blend_transition_curve?: Record<string, number>;
};

export function resolveUniqueControllerState<T extends { uuid: string; name: string }>(
  states: readonly T[],
  reference: string
): T {
  const uuidMatch = states.find((state) => state.uuid === reference);
  if (uuidMatch) return uuidMatch;
  const nameMatches = states.filter((state) => state.name === reference);
  if (nameMatches.length === 1) return nameMatches[0];
  if (nameMatches.length > 1) {
    throw new Error(`AnimationController state name "${reference}" is ambiguous. Use an exact state UUID.`);
  }
  throw new Error(`AnimationController state "${reference}" not found.`);
}

function summarizeControllerState(state: ControllerStateView, index: number) {
  return {
    index,
    uuid: state.uuid,
    name: state.name,
    animation_count: state.animations.length,
    transition_count: state.transitions.length,
    sound_count: state.sounds.length,
    particle_count: state.particles.length,
    has_on_entry: Boolean(state.on_entry && state.on_entry.replace(/[\n\s;.]+/g, "")),
    has_on_exit: Boolean(state.on_exit && state.on_exit.replace(/[\n\s;.]+/g, "")),
    blend_transition: state.blend_transition || 0,
    has_blend_transition_curve: Boolean(state.blend_transition_curve && Object.keys(state.blend_transition_curve).length),
    blend_via_shortest_path: Boolean(state.blend_via_shortest_path),
  };
}

function inspectControllerState(controller: AnimationController, reference: string) {
  const state = resolveUniqueControllerState(
    controller.states as ControllerStateView[],
    reference
  );
  const allItems = AnimationItem.all as unknown as InspectableAnimationItem[];
  return {
    uuid: state.uuid,
    name: state.name,
    animations: state.animations.map((link, index) => {
      const loaded = link.animation
        ? allItems.find((item) => item.uuid === link.animation && !isAnimationController(item))
        : undefined;
      return {
        index,
        uuid: link.uuid,
        animation_key: link.key,
        loaded_animation_uuid: link.animation || null,
        loaded_animation_name: loaded?.name || null,
        blend_value: link.blend_value || null,
      };
    }),
    transitions: state.transitions.map((transition, index) => {
      const target = controller.states.find((candidate) => candidate.uuid === transition.target);
      return {
        index,
        uuid: transition.uuid,
        target_uuid: transition.target || null,
        target_name: target?.name || null,
        condition: transition.condition || "",
      };
    }),
    sounds: state.sounds.map((sound, index) => ({
      index,
      effect: sound.effect || null,
    })),
    particles: state.particles.map((particle, index) => ({
      index,
      effect: particle.effect || null,
      locator: particle.locator || null,
      bind_to_actor: particle.bind_to_actor === false ? false : true,
      pre_effect_script: particle.pre_effect_script || null,
    })),
    on_entry: state.on_entry || null,
    on_exit: state.on_exit || null,
    blend_transition: state.blend_transition || 0,
    blend_transition_curve:
      state.blend_transition_curve && Object.keys(state.blend_transition_curve).length
        ? { ...state.blend_transition_curve }
        : null,
    blend_via_shortest_path: Boolean(state.blend_via_shortest_path),
  };
}

function inspectAnimationController(controller: AnimationController, stateReference?: string) {
  const initial = controller.states.find((state) => state.uuid === controller.initial_state);
  return {
    authored_space: "blockbench_animation_controller" as const,
    controller: {
      uuid: controller.uuid,
      name: controller.name,
      path: controller.path || null,
      initial_state: controller.initial_state
        ? { uuid: controller.initial_state, name: initial?.name || null }
        : null,
    },
    state_count: controller.states.length,
    states: (controller.states as ControllerStateView[]).map(summarizeControllerState),
    focused_state: stateReference ? inspectControllerState(controller, stateReference) : null,
  };
}
'''
if anchor not in t:
    raise SystemExit("controller helper insertion anchor missing")
t = t.replace(anchor, "\n" + controller_helpers + anchor, 1)

old_exec = '''      async execute({ animation_id, bone, include_effect_keyframes }) {
        const animation = resolveAnimation(animation_id);
        const boneAnimators = summarizeBoneAnimators(animation);
        const effects = inspectParticleEffects(animation, include_effect_keyframes);

        let focusedBone = null;
'''
new_exec = '''      async execute({ animation_id, bone, state, include_effect_keyframes }) {
        const item = resolveAnimationItem(animation_id);
        if (isAnimationController(item)) {
          if (bone !== undefined) {
            throw new Error("`bone` applies only to authored Animation inspection; use `state` for AnimationController detail.");
          }
          if (include_effect_keyframes) {
            throw new Error("`include_effect_keyframes` applies only to authored Animation effect keyframes, not controller state effects.");
          }
          const result = inspectAnimationController(item, state);
          return {
            content: [{ type: "text" as const, text: JSON.stringify(result) }],
            structuredContent: result,
          };
        }
        if (state !== undefined) {
          throw new Error("`state` applies only to AnimationController inspection; use `bone` for authored Animation detail.");
        }

        const animation = item;
        const boneAnimators = summarizeBoneAnimators(animation);
        const effects = inspectParticleEffects(animation, include_effect_keyframes);

        let focusedBone = null;
'''
if old_exec not in t:
    raise SystemExit("inspection execute anchor missing")
t = t.replace(old_exec, new_exec, 1)
p.write_text(t)

# Focused contract tests.
p = Path("mcp/tests/animation-controller-inspection-contract.test.ts")
p.write_text('''import { describe, expect, test } from "bun:test";\nimport { inspectAnimationParameters, resolveUniqueControllerState } from "@/server/tools/animation-inspection";\n\ndescribe("AnimationController inspection closure", () => {\n  test("adds a focused controller-state selector without a new tool", async () => {\n    expect(inspectAnimationParameters.parse({ state: "idle" }).state).toBe("idle");\n    expect(inspectAnimationParameters.safeParse({ state: "" }).success).toBe(false);\n    const source = await Bun.file("server/tools/animation-inspection.ts").text();\n    expect(source).toContain("instanceof AnimationController");\n    expect(source).toContain('authored_space: "blockbench_animation_controller"');\n    expect(source).toContain("animation_key");\n    expect(source).toContain("target_name");\n    expect(source).not.toContain("create_animation_controller");\n    expect(source).not.toContain("manage_animation_controller");\n  });\n\n  test("state identity is UUID-first then unique exact name", () => {\n    const states = [\n      { uuid: "u1", name: "idle" },\n      { uuid: "u2", name: "attack" },\n      { uuid: "u3", name: "attack" },\n    ];\n    expect(resolveUniqueControllerState(states, "u3")).toEqual(states[2]);\n    expect(resolveUniqueControllerState(states, "idle")).toEqual(states[0]);\n    expect(() => resolveUniqueControllerState(states, "attack")).toThrow("ambiguous");\n    expect(() => resolveUniqueControllerState(states, "missing")).toThrow("not found");\n  });\n});\n''')

# Specialist guidance: inspection is owned; mutation remains a protected state-machine gap.
p = Path(".agents/skills/blockit-bedrock-animation/SKILL.md")
t = p.read_text()
t = t.replace(
    "existing animation state unknown      → inspect_animation",
    "existing animation/controller unknown → inspect_animation",
    1,
)
t = t.replace(
    "New-animation sound effects are owned by `create_animation`; direct sound/timeline-effect mutation on an existing animation, animation controllers, and bone-binding expressions remain protected gaps.",
    "`inspect_animation` may read AnimationController/state structure. Controller creation/mutation remains a protected state-machine gap; existing-animation sound/timeline mutation and bone-binding expressions also remain protected gaps.",
    1,
)
t = t.replace(
    "Do not claim controller/in-game behavior without direct capability and evidence.",
    "Controller inspection is authored-state evidence only. Do not claim controller execution/in-game behavior without direct runtime evidence.",
    1,
)
p.write_text(t)

p = Path("mcp/prompts/bedrock_entity_workflow.md")
t = p.read_text()
t = t.replace(
    "Molang strings use `manage_keyframes`; MCP never evaluates them. TextureMesh, visible bounds, controllers, existing-animation sound/timeline mutation, animated textures, and bone-binding expressions remain gaps; do not fake them.",
    "Molang strings use `manage_keyframes`; MCP never evaluates them. `inspect_animation` can read controller/state structure, but controller creation/mutation remains a gap. TextureMesh, visible bounds, existing-animation sound/timeline mutation, animated textures, and bone-binding expressions remain gaps; do not fake them.",
    1,
)
p.write_text(t)

# Evidence review.
p = Path("docs/knowledge/reviews/professional-animation-controller-prioritization-2026-08-13.md")
p.write_text('''# Professional Animation Controller Prioritization — 2026-08-13\n\nStatus: **BOUNDED INSPECTION APPROVED; AUTHORING/MUTATION DEFERRED**\n\n## Scope\n\nStatic forensic review of the nine supplied professional `.bbmodel` samples plus the native Blockbench `AnimationController` / `AnimationControllerState` model. No local Blockbench/Codex run was performed. Final `.bbmodel` structure proves authored state, not original authoring sequence or runtime correctness.\n\n## Sample Evidence\n\nFour of nine samples contain controllers: Ninja Master, Weapon Katana, Helicopter, and Anky. Across them:\n\n- 21 AnimationControllers\n- 84 states\n- 187 ordered transitions\n- 169 ordered animation links\n- 93 non-empty animation blend-value expressions\n- 42 states with non-zero blend transition\n- 2 non-empty `on_entry` scripts\n- 3 controller-state particle entries\n- 35 animation links with a preserved authored key but no loaded animation UUID\n\nThe supplied set contains no controller-state sound entries, non-empty `on_exit`, blend-transition curves, or shortest-path flags. Those absences are sample facts only, not product rules.\n\n## Native Ownership\n\nBlockbench models controllers as a separate `AnimationController extends AnimationItem`. Each `AnimationControllerState` owns animations, transitions, particles, sounds, `on_entry`, `on_exit`, blend transition state, and state identity. Bedrock compilation preserves animation keys, transition target state names, and array order. Local animation UUID resolution is optional: an authored animation key can remain valid even when its referenced Animation is not loaded in the project.\n\n## Decision\n\nController **creation/mutation is not a bounded extension of `create_animation` or `manage_keyframes`**. A correct authoring contract would need state identity/order, initial-state ownership, ordered transitions with Molang conditions, animation-key versus optional loaded-UUID semantics, blend-value expressions, state effects/scripts, and mutation/Undo rules. Folding that into an existing transform-keyframe tool would create ambiguous ownership and a large schema. No controller framework or new mutation tool is justified from this pass.\n\nRead-only controller inspection **is** bounded and belongs to existing `inspect_animation` because Animation and AnimationController share the native AnimationItem selection/identity surface. The approved closure adds an optional focused `state` selector, compact state summaries, and focused authored state detail. It never evaluates transition/blend/on-entry Molang and does not preview or mutate controller execution.\n\n## Explicit Non-Goals\n\n- no `create_animation_controller` / `manage_animation_controller` tool\n- no controller evaluator or transition simulator\n- no automatic animation-key resolution requirement\n- no controller preset/state template\n- no local preview/runtime claim\n\n## Stop Condition\n\nAfter bounded inspection closure, do not expand controller authoring from sample evidence alone. Reopen only with a concrete user authoring requirement and a narrowly proven native ownership path.\n''')

# Continuation.
p = Path("docs/knowledge/next-action.md")
t = p.read_text()
t = t.replace("PROFESSIONAL_ANIMATION_SOUND_EFFECTS_PRO7_COMPLETE", "PROFESSIONAL_ANIMATION_CONTROLLER_INSPECTION_PRO8_IMPLEMENTED_AWAITING_VERIFY", 1)
t = t.replace(
    "PRO-7  create_animation + inspect_animation Bedrock sound-effect closure",
    "PRO-7  create_animation + inspect_animation Bedrock sound-effect closure\nPRO-8  inspect_animation AnimationController/state read-only closure; authoring deferred",
    1,
)
t = t.replace(
    "animation controllers\nexisting-animation sound-effect mutation",
    "animation controller creation/mutation\nexisting-animation sound-effect mutation",
    1,
)
old_next = '''```text
NON-LOCAL NEXT — ANIMATION_CONTROLLER_GAP_PRIORITIZATION
```

Controllers are sample-evidenced but materially larger than expression/sound keyframe closure. Inspect the native controller owner and supplied controller structures before changing source. If a bounded extension of an existing owner is not sufficient, **defer** rather than add a controller framework. Do not start local testing.'''
new_next = '''```text
AFTER PRO-8 VERIFY — NO FURTHER SAMPLE-DRIVEN SOURCE EXPANSION
```

The professional sample audit now has bounded closures for geometry creation, Box-UV batch state, Molang transform keyframes, sound events, and controller inspection. Controller creation/mutation remains intentionally deferred because it requires state-machine ownership rather than a small existing-tool extension. The supplied samples contain no timeline-effect keyframes and do not justify a new controller/evaluator framework. Keep local testing deferred until the user explicitly reactivates it.'''
if old_next not in t:
    raise SystemExit("next-action PRO-8 marker missing")
t = t.replace(old_next, new_next, 1)
p.write_text(t)

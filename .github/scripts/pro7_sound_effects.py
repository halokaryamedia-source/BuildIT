from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text()
    if old not in text:
        raise SystemExit(f"Expected text not found in {path}: {old[:180]!r}")
    p.write_text(text.replace(old, new, 1))

animation = Path("mcp/server/tools/animation.ts")
text = animation.read_text()
marker = "const finiteCreateAnimationVector3Schema = z\n  .array(z.number().finite())\n  .length(3);\n"
sound_schema = '''const bedrockSoundEffectSchema = z.object({
  effect: z.string().min(1).describe("Bedrock sound effect identifier."),
  locator: z.string().min(1).optional().describe("Optional Locator name for the sound event."),
});

const bedrockSoundEffectsSchema = z
  .record(z.union([bedrockSoundEffectSchema, z.array(bedrockSoundEffectSchema).min(1)]))
  .superRefine((soundEffects, ctx) => {
    const effectiveTimes = new Map<number, string>();
    Object.keys(soundEffects).forEach((timestamp) => {
      const normalizedTimestamp = timestamp.trim();
      const numericTime = Number(normalizedTimestamp);
      const codecTime = Number.parseFloat(normalizedTimestamp);
      if (
        normalizedTimestamp.length === 0 ||
        !Number.isFinite(numericTime) ||
        !Number.isFinite(codecTime) ||
        numericTime !== codecTime ||
        numericTime < 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [timestamp],
          message: `Sound timestamp "${timestamp}" must be a complete finite non-negative numeric value.`,
        });
        return;
      }
      const previousTimestamp = effectiveTimes.get(numericTime);
      if (previousTimestamp !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [timestamp],
          message: `Sound timestamps "${previousTimestamp}" and "${timestamp}" resolve to the same effective time ${numericTime}. Use one timestamp per effective time.`,
        });
        return;
      }
      effectiveTimes.set(numericTime, timestamp);
    });
  })
  .describe("Sound effects keyed by unique finite non-negative timestamps; each value is one effect or a non-empty effect array.");

'''
if sound_schema not in text:
    if marker not in text:
        raise SystemExit("animation sound schema insertion marker missing")
    text = text.replace(marker, sound_schema + marker, 1)

text = text.replace(
    "  particle_effects: bedrockParticleEffectsSchema.optional(),\n});",
    "  particle_effects: bedrockParticleEffectsSchema.optional(),\n  sound_effects: bedrockSoundEffectsSchema.optional(),\n});",
    1,
)
text = text.replace(
    '      "Creates a new Bedrock animation from finite numeric transform values. Accepts `walk` or canonical `animation.walk`; the Bedrock prefix is applied once. Use manage_keyframes for explicit Molang transform strings.",',
    '      "Creates a Bedrock animation from finite numeric transforms plus optional particle/sound effects. Accepts `walk` or canonical `animation.walk`; prefix is applied once. Use manage_keyframes for Molang transforms.",',
    1,
)
text = text.replace(
    "    async execute({ name, loop, animation_length, bones, particle_effects }) {",
    "    async execute({ name, loop, animation_length, bones, particle_effects, sound_effects }) {",
    1,
)
text = text.replace(
    "        ...(particle_effects && { particle_effects }),\n      };",
    "        ...(particle_effects && { particle_effects }),\n        ...(sound_effects && { sound_effects }),\n      };",
    1,
)
text = text.replace(
    "        const result = {\n",
    "        const requestedSoundEffectCount = sound_effects\n          ? Object.values(sound_effects).reduce(\n              (count, soundOrSounds) => count + (Array.isArray(soundOrSounds) ? soundOrSounds.length : 1),\n              0\n            )\n          : 0;\n        const result = {\n",
    1,
)
text = text.replace(
    "          requested_particle_effect_count: requestedParticleEffectCount,\n",
    "          requested_particle_effect_count: requestedParticleEffectCount,\n          requested_sound_effect_count: requestedSoundEffectCount,\n",
    1,
)
animation.write_text(text)

inspection = Path("mcp/server/tools/animation-inspection.ts")
text = inspection.read_text()
text = text.replace(
    '      "Include full particle-effect keyframes. Keep false for the normal summary path; enable only when effect timing/data is needed.",',
    '      "Include full particle/sound effect keyframes. Keep false for summary; enable only when effect timing/data is needed.",',
    1,
)
text = text.replace(
    '      "Returns read-only Animation identity/settings plus bone and particle summaries. Supply `bone` for detailed transform keyframes; set `include_effect_keyframes=true` only when full particle-effect timing/data is needed. UUID is preferred; explicit names must be unique.",',
    '      "Returns read-only Animation identity/settings plus bone and particle/sound summaries. Supply `bone` for transform keyframes; set `include_effect_keyframes=true` only for full effect timing/data.",',
    1,
)
text = text.replace(
    "type ParticleDataPoint = KeyframeDataPoint & {\n",
    "type EffectDataPoint = KeyframeDataPoint & {\n",
    1,
)
text = text.replace(
    "      const particle = dataPoint as ParticleDataPoint;\n",
    "      const particle = dataPoint as EffectDataPoint;\n",
    1,
)
old_no_effects = '''      particle: {
        keyframe_count: 0,
        particle_count: 0,
        ...(includeKeyframes ? { keyframes: [] } : {}),
      },
'''
new_no_effects = old_no_effects + '''      sound: {
        keyframe_count: 0,
        sound_count: 0,
        ...(includeKeyframes ? { keyframes: [] } : {}),
      },
'''
if old_no_effects not in text:
    raise SystemExit("inspection no-effects block missing")
text = text.replace(old_no_effects, new_no_effects, 1)
needle = '''  const inspectedKeyframes = keyframes.map((keyframe) => ({
    uuid: keyframe.uuid,
    time: keyframe.time,
    particles: keyframe.data_points.map((dataPoint) => {
      const particle = dataPoint as EffectDataPoint;
      return {
        effect: particle.effect || null,
        locator: particle.locator || null,
        bind_to_actor: particle.bind_to_actor === false ? false : null,
        pre_effect_script: normalizePreEffectScript(particle.script),
      };
    }),
  }));

  return {
'''
replacement = '''  const inspectedKeyframes = keyframes.map((keyframe) => ({
    uuid: keyframe.uuid,
    time: keyframe.time,
    particles: keyframe.data_points.map((dataPoint) => {
      const particle = dataPoint as EffectDataPoint;
      return {
        effect: particle.effect || null,
        locator: particle.locator || null,
        bind_to_actor: particle.bind_to_actor === false ? false : null,
        pre_effect_script: normalizePreEffectScript(particle.script),
      };
    }),
  }));
  const soundKeyframes = ((existingEffects.sound as _Keyframe[] | undefined) ?? [])
    .slice()
    .sort((a, b) => a.time - b.time || a.uuid.localeCompare(b.uuid));
  const inspectedSoundKeyframes = soundKeyframes.map((keyframe) => ({
    uuid: keyframe.uuid,
    time: keyframe.time,
    sounds: keyframe.data_points.map((dataPoint) => {
      const sound = dataPoint as EffectDataPoint;
      return { effect: sound.effect || null, locator: sound.locator || null };
    }),
  }));

  return {
'''
if needle not in text:
    raise SystemExit("inspection effect insertion marker missing")
text = text.replace(needle, replacement, 1)
particle_return = '''    particle: {
      keyframe_count: inspectedKeyframes.length,
      particle_count: inspectedKeyframes.reduce(
        (count, keyframe) => count + keyframe.particles.length,
        0
      ),
      ...(includeKeyframes ? { keyframes: inspectedKeyframes } : {}),
    },
'''
sound_return = particle_return + '''    sound: {
      keyframe_count: inspectedSoundKeyframes.length,
      sound_count: inspectedSoundKeyframes.reduce(
        (count, keyframe) => count + keyframe.sounds.length,
        0
      ),
      ...(includeKeyframes ? { keyframes: inspectedSoundKeyframes } : {}),
    },
'''
if particle_return not in text:
    raise SystemExit("inspection particle return marker missing")
text = text.replace(particle_return, sound_return, 1)
inspection.write_text(text)

# Contract coverage
p = Path("mcp/tests/create-animation-contract.test.ts")
t = p.read_text()
insert_before = '\n  test("selects the created animation before completing the Undo edit", async () => {'
new_test = '''
  test("accepts bounded Bedrock sound effect maps without a new tool", async () => {
    expect(createAnimationParameters.safeParse({
      name: "sound_test",
      bones: {},
      sound_effects: {
        "0": { effect: "start" },
        "0.5": [{ effect: "loop" }, { effect: "accent", locator: "mouth" }],
      },
    }).success).toBe(true);
    expect(createAnimationParameters.safeParse({
      name: "bad_sound",
      bones: {},
      sound_effects: { "0": { effect: "" } },
    }).success).toBe(false);
    expect(createAnimationParameters.safeParse({
      name: "bad_time",
      bones: {},
      sound_effects: { "0": { effect: "a" }, "0.0": { effect: "b" } },
    }).success).toBe(false);

    const source = await Bun.file("server/tools/animation.ts").text();
    expect(source).toContain("...(sound_effects && { sound_effects })");
    expect(source).toContain("requested_sound_effect_count");
    expect(source).not.toContain("manage_sound_keyframes");
  });
'''
if new_test not in t:
    if insert_before not in t:
        raise SystemExit("create animation test insertion marker missing")
    t = t.replace(insert_before, new_test + insert_before, 1)
p.write_text(t)

# Inspection regression in existing context test
p = Path("mcp/tests/context-payload-cleanup.test.ts")
t = p.read_text()
anchor = '    expect(inspection).toContain("include_effect_keyframes");\n'
addition = anchor + '    expect(inspection).toContain("sound_count");\n    expect(inspection).toContain("existingEffects.sound");\n'
if 'expect(inspection).toContain("sound_count")' not in t:
    if anchor not in t:
        raise SystemExit("inspection regression anchor missing")
    t = t.replace(anchor, addition, 1)
p.write_text(t)

# Animation specialist and runtime wording
p = Path(".agents/skills/blockit-bedrock-animation/SKILL.md")
t = p.read_text()
t = t.replace(
    "mapped particles                      → create_animation / inspect_animation effects",
    "mapped particles / sounds             → create_animation / inspect_animation effects",
    1,
)
t = t.replace(
    "Particle effects use `create_animation.particle_effects` and `inspect_animation.effects`; preserve Locator names.",
    "Particle/sound effects use `create_animation` effect maps and `inspect_animation.effects`; preserve authored effect IDs and Locator names.",
    1,
)
t = t.replace(
    "Direct MCP authoring still does not own animation controllers, sound/timeline-effect keyframes, or bone-binding expressions.",
    "New-animation sound effects are owned by `create_animation`; direct sound/timeline-effect mutation on an existing animation, animation controllers, and bone-binding expressions remain protected gaps.",
    1,
)
p.write_text(t)

p = Path("mcp/prompts/bedrock_entity_workflow.md")
t = p.read_text()
t = t.replace(
    "TextureMesh, visible bounds, controllers, sound/timeline effects, animated textures, and bone-binding expressions remain gaps; do not fake them.",
    "TextureMesh, visible bounds, controllers, existing-animation sound/timeline mutation, animated textures, and bone-binding expressions remain gaps; do not fake them.",
    1,
)
p.write_text(t)

# Current-state docs
p = Path("docs/knowledge/next-action.md")
t = p.read_text()
t = t.replace("PROFESSIONAL_ANIMATION_EXPRESSION_KEYFRAMES_PRO6_COMPLETE", "PROFESSIONAL_ANIMATION_SOUND_EFFECTS_PRO7_IMPLEMENTED_AWAITING_VERIFY", 1)
t = t.replace("PRO-6  manage_keyframes explicit Molang transform-string preservation", "PRO-6  manage_keyframes explicit Molang transform-string preservation\nPRO-7  create_animation + inspect_animation Bedrock sound-effect closure", 1)
t = t.replace(
    "animation controllers\nsound-effect keyframes\ntimeline-effect keyframes\nbone-binding expressions",
    "animation controllers\nexisting-animation sound-effect mutation\ntimeline-effect keyframes\nbone-binding expressions",
    1,
)
old_next = "After PRO-6 verification, continue **non-local** with `SOUND_EFFECT_KEYFRAME_GAP_PRIORITIZATION`. Inspect whether the existing `EffectAnimator`/keyframe contract can support sound authoring narrowly. If it requires unrelated media/runtime framework expansion, defer it. Do not start local testing."
new_next = "After PRO-7 verification, continue **non-local** with `ANIMATION_CONTROLLER_GAP_PRIORITIZATION`. Controllers are sample-evidenced but materially larger than keyframe closure; first determine whether a bounded existing native owner is sufficient. If not, defer rather than add a framework. Do not start local testing."
if old_next not in t:
    raise SystemExit("next-action previous next-step marker missing")
t = t.replace(old_next, new_next, 1)
p.write_text(t)

p = Path("docs/foundation/validation-report.md")
t = p.read_text()
t = t.replace(
    "Controllers and unsupported sound/timeline-effect mappings remain protected gaps.",
    "`create_animation`/`inspect_animation` own bounded new-animation sound-effect authoring/inspection. Existing-animation sound/timeline mutation and controllers remain protected gaps.",
    1,
)
t = t.replace(
    "animation sound/timeline effects\n",
    "existing-animation sound/timeline-effect mutation\n",
    1,
)
p.write_text(t)

p = Path("docs/knowledge/implementation-map.md")
t = p.read_text()
t = t.replace(
    "Controllers and unsupported sound/timeline-effect authoring remain protected gaps.",
    "New-animation sound effects are owned by `create_animation`/`inspect_animation`; controllers and existing-animation sound/timeline mutation remain protected gaps.",
    1,
)
t = t.replace(
    "- animation sound/timeline effects;",
    "- existing-animation sound/timeline-effect mutation;",
    1,
)
p.write_text(t)

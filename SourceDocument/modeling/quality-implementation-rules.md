# Quality Implementation Rules

These rules apply to all four user-visible stages.

Authority:

1. `PRODUCTION_CONTEXT.md` — intent, function, assumptions, and resolved decisions.
2. `<asset>_reference_visual.png` — visible identity, silhouette, proportions, pose, color, materials, and attachments.
3. active category document — implementation detail.
4. `VALIDATION.md` — final test contract.

Use `REFERENCE_CONFLICT` instead of averaging contradictory requirements.

# 1. Geometry Quality

## Creative Cuboid Rule

Minecraft/Bedrock style does not require rigid 1×1 blocks.

Allowed when they improve the approved form:

- varied cuboid sizes;
- long/thin or wide/flat cuboids;
- rotated cuboids;
- offset layers;
- stepped silhouettes;
- intentional asymmetry;
- silhouette-defining attachments.

Do not use small cubes as substitute pixels.

## Geometry Order

```text
scale envelope
→ primary silhouette
→ hierarchy and attachments
→ structural detail
→ cube reduction
```

Scale envelope includes:

- height;
- width;
- depth;
- front direction;
- ground/contact plane;
- highest geometry point;
- major attachment extents.

## Geometry Decision Paths

Before a geometry revision, choose one:

```text
scale envelope
front/side silhouette
back/top/3-4 consistency
parent/pivot/attachment
collision/z-fighting
cube noise reduction
defer to texture
```

Earlier paths take priority. Do not add detail while scale or primary silhouette is wrong.

## Cube Purpose Rule

Every cube must improve at least one:

- silhouette;
- structure;
- depth;
- attachment;
- pose;
- pivot/animation readiness;
- gameplay readability;
- focal identity.

Use texture for:

- stripes;
- seams;
- scratches;
- small panels;
- trim;
- gradients;
- shadows;
- color bands;
- one- or two-pixel details.

## Initial Build and Revision

- Initial Geometry may use bounded multi-part batches.
- Revision work uses one named issue or tightly related issue pair per cycle.
- Accepted areas must not be rebuilt without reopening Geometry.

## Geometry Review Evidence

Required:

- Front;
- Left Side;
- Back;
- Top / Footprint;
- Front-left 3/4;
- scale envelope;
- hierarchy summary;
- cube/group count;
- persistent checkpoint.

Front and Left Side must pass before Geometry approval.

# 2. Texture and UV Quality

## Complexity and Atlas

Use the smallest atlas that preserves required focal detail.

Texture style and atlas size are separate decisions.

Examples:

- `16x style` may use a `128×128` or `256×256` atlas;
- `32x style` may use a larger atlas when justified.

Do not enlarge the atlas without visible need. Do not shrink it until focal details become unreadable.

## UV Rules

- Use Per-face UV by default for custom Bedrock assets unless approved otherwise.
- Pack compactly before painting.
- Reuse/mirror repeated areas only where markings and direction allow it.
- Give focal faces sufficient unique texel space.
- Avoid accidental overlap on active faces.
- Keep hidden/low-priority faces efficient.

## Material and Palette Rules

- Follow the Reference Visual color family.
- Use a limited, intentional palette.
- Separate material families through value and hue, not random noise.
- Large visible faces should not remain flat when the reference shows form depth.
- Use stepped pixel shading rather than smooth blur.
- Preserve directional patterns and unique markings.

## Gradient Standard

For visible large faces, use approximately three stepped values when space permits:

- darker: lower, inner, recessed, or covered areas;
- base: main material body;
- lighter: upper, outer, or exposed areas.

Focal areas may use four or five values when justified.

## Material Pipeline

- Classic Bedrock only.
- No PBR maps.
- No Vibrant Visuals dependency.
- Alpha-test, alpha-blend, and emissive zones only where explicitly approved.

## Texture Review Evidence

Required:

- atlas preview;
- UV summary;
- Front;
- Left Side;
- Back;
- Front-left 3/4;
- material/alpha/emissive summary;
- persistent checkpoint.

# 3. Animation Quality

Animation is optional and runs only when required by the approved package.

When not required, record `ANIMATION_SKIPPED`.

When required:

- preserve approved Geometry and Texture;
- use clean parent-child chains;
- place pivots at functional joints or attachment roots;
- use only approved axes and qualitative ranges;
- preserve rigid cuboid behavior;
- recover exactly to neutral pose;
- preserve required ground contacts;
- prevent clipping and floating.

Animation Review evidence:

- hierarchy/pivot summary;
- required clips or sampled poses;
- neutral-pose recovery;
- ground-contact result;
- clipping/deformation result;
- persistent checkpoint.

# 4. Final Validation Quality

Final Validation must execute `VALIDATION.md` and include:

- `.bbmodel` candidate;
- texture files;
- five standard views;
- hierarchy/pivot result;
- animation evidence when applicable;
- Blockbench validator summary;
- export readiness;
- revision summary.

Codex may automatically repair at most two local validation failures.

Do not silently repair anything that changes:

- identity;
- scale;
- major silhouette;
- approved material read;
- accepted stage scope.

Results:

- `PASS`;
- `REVISION_REQUIRED`;
- `BLOCKER`.

# 5. Reference Conflict Handling

Authority order:

1. explicit user instruction recorded in Production Context;
2. approved Reference Visual for visible form;
3. active category document for technical implementation;
4. manifest for machine-readable values;
5. validation contract for tests.

If a conflict affects identity, scale, major silhouette, attachments, material behavior, hierarchy, or required motion, stop with:

```text
REFERENCE_CONFLICT
Sources:
- ...
Conflict:
- ...
Decision required:
- ...
```

# 6. Naming

- Project name follows the asset.
- Root group is short and asset-specific.
- Use lowercase snake_case for technical names.
- Include role and side where useful.
- Avoid random/generated names.

Examples:

```text
kangaroo_root
body
head
leg_front_left
wheel_rear_right
seat_driver
```

# 7. MCP and Token Efficiency

- Run full preflight once per session.
- Load only the active-stage document and tool profile.
- Use one active MCP write session.
- Prefer bounded initial batches over repeated single-cube calls.
- Use screenshots at stage reviews or meaningful revision checkpoints.
- Avoid full outline/data dumps when a focused structured result is enough.
- Open failure playbooks only after the documented trigger.
- Stop when stage acceptance criteria are met.

# 8. Failure Recovery

When a later stage reveals an earlier-stage problem:

```text
Earlier stage affected:
Part:
Issue:
Why current stage cannot solve it safely:
Preserve:
Required review stage:
```

Local non-destructive corrections may be applied only when they do not change accepted identity, scale, silhouette, or material read.

Broad changes require reopening the relevant approved stage.

# 9. Screenshot and Evidence Cleanup

- Keep stage review evidence and final validation evidence.
- Store failed/temporary experiments in `SavedData/cache/` or remove them after resolution.
- Do not mix temporary images into approved evidence folders.
- Final evidence must use stable camera framing and filenames.

# Acceptance Criteria

- Geometry is recognizable without texture.
- Every cube has a structural purpose.
- UVs are intentional and compact.
- Texture has readable material depth without blur or noise.
- Optional Animation preserves identity, neutral pose, and contacts.
- Final Validation is evidence-based.
- User review is limited to completed Geometry, Texture, optional Animation, and Final Validation stages.

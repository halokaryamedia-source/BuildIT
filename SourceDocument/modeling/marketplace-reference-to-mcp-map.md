# Marketplace Reference → MCP Implementation Intelligence

This is a conditional interpretation aid.

Normal Rework sessions already receive an approved reference package and do not need this document.

Open it only when the package leaves an execution detail genuinely ambiguous.

## Authority

```text
PRODUCTION_CONTEXT.md
→ <asset>_reference_visual.png
→ active category document
```

Samples teach quality and execution patterns only. They never override the approved asset package.

## Reference Signature

Before Geometry, extract only unresolved implementation fields:

```text
Asset type:
Visual priority:
Required silhouette features:
Geometry budget: low / medium / high
Atlas baseline:
Hierarchy/bone strategy:
Texture strategy:
Animation requirement:
Interaction/attachment requirements:
```

Do not duplicate fields already resolved in Production Context or manifest.

## Stage Translation

### Geometry

Translate reference intent into:

- global scale envelope;
- primary masses;
- silhouette-critical secondary forms;
- ground contacts;
- hierarchy and attachments;
- animation-ready separation when required;
- geometry-vs-texture boundary.

Rules:

- build largest masses first;
- use functional lowercase snake_case names;
- add secondary geometry only when it improves silhouette, structure, attachment, pivot, interaction, or gameplay readability;
- move seams, scratches, stripes, nails, stitches, small panels, and 1–2 pixel details to Texture;
- never copy a sample mesh or exact UV layout.

### Texture

Translate reference intent into:

- atlas size and UV strategy;
- material families;
- shared/mirrored and unique/directional UV areas;
- base, shadow, light, and accent values;
- focal texel density;
- texture-only details;
- alpha/emissive zones when approved.

Rules:

- keep one atlas unless the package requires otherwise;
- keep UV islands compact and purposeful;
- reuse safe symmetry;
- reserve unique space for focal/directional details;
- avoid flat hero surfaces and smooth blur;
- do not remodel Geometry to solve a pixel-level issue.

### Animation — when required

Translate only approved motion:

- hierarchy;
- pivots;
- allowed axes/ranges;
- required clips or interaction motions;
- neutral-pose recovery;
- ground-contact and clipping limits.

Do not add optional clips merely for completeness.

### Final Validation

Check:

- silhouette and scale;
- hierarchy and attachments;
- cube-purpose discipline;
- atlas and material read;
- Animation contract or skip;
- validator/export readiness;
- final evidence against the Reference Visual.

Final Validation may fix at most two local failures. Broad failures return to the affected stage.

## Quality Signals

Good:

- strong readable silhouette;
- clear functional hierarchy;
- attached, non-floating parts;
- texture-first micro detail;
- compact purposeful UV;
- material depth with stepped pixel shading;
- only required animations;
- stable five-view evidence.

Warnings:

- tiny decorative cubes;
- floating ornaments;
- fragmented UV without reason;
- one UV strategy forced onto every material;
- flat single-tone large surfaces;
- optional work added outside the approved package;
- sample identity copied into the target asset.

## Category Hints

### Creature

- prioritize mass, posture, contacts, head/readable identity, and articulation-ready separation;
- use texture for fur/skin pattern and minor anatomy cues;
- keep required locomotion readable when Animation exists.

### Weapon / Armor

- prioritize profile, grip/attachment, focal silhouette, and clear material separation;
- use texture for ornament unless it changes profile or attachment.

### Vehicle / Mount

- prioritize scale, seats/attachments, wheels/support contacts, moving groups, and collision clearance;
- model interior only when the approved package requires it.

### Furniture / Static Prop

- prioritize placement plane, usable/interactable parts, dimensions, and all-side readability;
- use UV/material transitions rather than trim-cube noise.

## Conflict Rule

If an unresolved detail materially affects identity, scale, silhouette, hierarchy, material behavior, or required motion:

```text
REFERENCE_CONFLICT
```

Do not average conflicting sources or invent unseen parts.

## Ponytail Rule

Use this document only to resolve a current ambiguity.

Do not create a new analysis artifact when the approved package already contains the answer.

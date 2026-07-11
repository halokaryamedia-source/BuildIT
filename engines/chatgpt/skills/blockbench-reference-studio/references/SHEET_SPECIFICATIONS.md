# Sheet Specifications

## Shared presentation

- Use one approved asset identity across all sheets.
- Use a neutral background, consistent framing, and consistent proportions.
- Use exact labels and dimensions added programmatically.
- Keep the subject readable at normal review scale.
- Do not introduce new accessories, anatomy, materials, or proportions on later sheets.

## Sheet 01 — Form and Scale

Filename:

```text
01_<asset_id>_form_scale_reference.png
```

Required content:

- Front orthographic
- Left orthographic
- Back orthographic
- Front-left three-quarter preview
- Asset envelope in model units
- `16u = 1 Minecraft block`
- Player reference when useful: `28.8u = 1.8 blocks`
- Front direction
- Ground plane
- Approved neutral pose

Authority:

- identity
- silhouette
- proportions
- scale
- major color family
- neutral pose

The handoff alias `<asset_id>_reference_visual.png` must be byte-identical to Sheet 01.

## Sheet 02 — Construction

Filename:

```text
02_<asset_id>_construction_reference.png
```

Required content:

- major groups and parent-child hierarchy
- primary cuboid construction
- required attachments
- geometry-versus-texture split
- left/right symmetry decisions
- ground-contact points
- schematic top footprint
- approximate pivot-ready separations

Authority:

- part boundaries
- hierarchy
- attachment relationships
- construction priority
- silhouette-critical geometry

## Sheet 03 — Texture and Material

Filename:

```text
03_<asset_id>_texture_material_reference.png
```

Required content:

- approved palette
- material zones
- atlas dimensions
- pixel style
- UV strategy
- texture-first detail list
- alpha and emissive decisions
- pattern placement examples

Authority:

- texture style
- atlas size
- UV policy
- color roles
- surface-detail placement

## Sheet 04 — Motion and Pivot

Filename:

```text
04_<asset_id>_motion_pivot_reference.png
```

Required content:

- motion hierarchy
- pivot markers
- allowed rotation axes
- required animation groups
- neutral-pose recovery
- ground-contact constraints
- clipping-risk zones
- explicit animation-required or animation-skipped status

Authority:

- pivot locations
- animation hierarchy
- motion constraints
- clipping warnings

## Cross-sheet failure conditions

Fail the package when:

- any view depicts a different design;
- scale differs between sheets;
- later sheets add new parts;
- a texture detail is incorrectly promoted to micro-geometry;
- animation pivots conflict with construction groups;
- texture atlas and pixel style are confused;
- front direction is inconsistent;
- required labels are AI-generated and unreadable instead of programmatic.

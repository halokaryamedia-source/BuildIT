# Pixel Art QA

Run only the gates applicable to the current artifact. Do not re-audit unchanged areas after every micro-edit.

## Ready-for-review contract

An asset is ready for user review only when all applicable conditions are true:
- artifact class and target mode are resolved;
- production canvas/grid is explicit;
- subject reads at native target size;
- silhouette and major negative spaces are stable;
- visible pixel scale is coherent;
- clusters are deliberate rather than noisy;
- edge topology is deliberate rather than accidental;
- palette ramps/roles are economical;
- material and identity cues are sufficient for the requested use;
- shading follows form/light/material rather than generic center-bright treatment;
- reference-driven identity is preserved where supported;
- set-level Style Lock is respected when applicable;
- transparent edges are clean when alpha is required;
- applicable QA gates pass;
- no unresolved BLOCKING ambiguity remains.

`READY_FOR_REVIEW` is not user approval. Approval remains separate.

## Native-scale review

Use both views when visual review is material:

```text
100% target scale
→ semantic/readability judgment

integer nearest-neighbor enlargement
→ grid/cluster/edge inspection
```

At native scale check recognition, identity landmarks, value separation, important-detail survival, canvas balance, and whether noise collapses into unintended texture. At enlarged scale check staircase intent, banding/hugging/tangents, orphan-pixel justification, alpha cleanliness, cluster coherence, and pixel-scale consistency.

Never approve an asset solely because an enlarged preview looks detailed.

## Core gates

### GRID INTEGRITY
PASS when all authored detail aligns to one intentional integer grid, no blurred/interpolated production edges remain, and visible pixel scale is coherent.

### SILHOUETTE READABILITY
PASS when subject class and defining form read at target scale, negative-space landmarks remain clear, and major functional parts are not lost.

### CLUSTER QUALITY
PASS when clusters communicate mass, lighting, material, or identity; noise/orphan pixels are absent unless intentional; edge staircases follow form.

### EDGE TOPOLOGY
PASS when applicable diagonals/curves have intentional staircase rhythm, cluster boundaries do not create unintended banding/hugging/tangents, corners support form, and cluster interlock reads as one coherent authored surface.

### PALETTE ECONOMY
PASS when every palette role contributes materially, near-duplicate colors are justified, ramp relationships remain coherent, and contrast hierarchy is clear.

### SHADING CAUSALITY
PASS when major light/shadow clusters can be explained by form plane/curvature, light direction, material response, or deliberate flat-style logic. Generic pillow shading, contour-hugging shadow bands, and uniformly distributed highlights fail this gate unless explicitly required by the style.

### MATERIAL READABILITY
PASS when applicable materials are distinguishable through value/cluster/highlight behavior, not hue alone.

### PIXEL-SCALE CONSISTENCY
PASS when no region appears authored at another implicit resolution and detail density matches target mode.

### IDENTITY FIDELITY
For reference-driven work, PASS when silhouette, proportion hierarchy, landmarks, material grouping, and defining color identity preserve supported evidence.

### TARGET COMPATIBILITY
PASS when selected target-mode rules are satisfied and target-size readability is preserved.

For Minecraft-facing assets, also verify the correct family grammar (item/block/entity/GUI/particle/reference) rather than applying one generic Minecraft look.

### EDGE CLEANUP / ALPHA
PASS when there are no accidental halos, matte residue, half-transparent fringe, baked checkerboards, or preview backgrounds in production pixels.

### DETAIL NECESSITY
PASS when secondary clusters materially contribute to form, material, identity, focal hierarchy, or motion/state. Decorative pixels that survive only at zoom but add no native-scale function should be removed.

## Conditional gates

### STYLE LOCK
For series work only. PASS when canvas logic, pixel scale, occupancy, perspective, outline, palette relationship, light direction, contrast, and cluster density remain compatible with the established set.

### FRAME CONSISTENCY
For animated sprites only. PASS when anchor, apparent volume, palette, identity landmarks, and pixel scale remain stable unless motion intentionally changes them.

### TILE SEAM + MACRO REPETITION
For repeating assets only. PASS when required edges repeat without unintended seams or phase jumps and repeated-field review does not reveal dominant stamped landmarks, checker/wallpaper rhythm, or unbalanced motif frequency.

## Anti-pattern guards

Treat these as warnings handled by the relevant gate, not as a second QA system:
- fake pixelation: smooth image → resize/filter → no deliberate cluster cleanup;
- mixed implicit resolution;
- jaggies caused by inconsistent staircase rhythm;
- banding, hugging, or accidental tangents;
- noise-as-detail;
- palette inflation without semantic roles/ramp purpose;
- generic pillow shading;
- compensating for a weak silhouette with shading/outlines;
- over-dithering where clean clusters read better;
- unjustified style drift within one family;
- enlarging the canvas mainly to avoid simplification;
- baked transparency previews instead of true alpha;
- excessive detail that exists only because canvas space is available.

## Verdict

```text
PASS
REVISE
BLOCKED
```

For `REVISE`, identify the smallest causal correction and affected gate(s).

Correction priority:

```text
wrong silhouette / composition
→ wrong identity landmark
→ wrong edge topology / pixel scale / cluster structure
→ wrong value / shading causality / material separation
→ palette/ramp redundancy
→ unnecessary secondary detail
```

Batch one coherent correction, then rerun only affected gates plus any gate the correction could plausibly regress.
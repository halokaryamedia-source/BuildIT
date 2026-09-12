# Pixel Art QA

Run only the gates applicable to the current artifact. Do not re-audit unchanged areas after every micro-edit.

## Core gates

### GRID INTEGRITY
PASS when:
- all authored detail aligns to one intentional integer grid;
- no blurred or interpolated production edges remain;
- visible pixel scale is coherent.

### SILHOUETTE READABILITY
PASS when:
- the subject class and defining form read at target scale;
- negative-space landmarks remain clear;
- major protrusions or functional parts are not lost.

### CLUSTER QUALITY
PASS when:
- pixel groups communicate mass, lighting, material, or identity;
- orphan/noise pixels are absent unless intentionally meaningful;
- edge staircases follow deliberate form rhythm.

### PALETTE ECONOMY
PASS when:
- every palette role contributes materially to readability;
- redundant near-duplicate colors are not accumulating without purpose;
- contrast hierarchy remains clear.

### MATERIAL READABILITY
PASS when applicable when:
- major materials are distinguishable using value/cluster/highlight behavior, not hue alone.

### PIXEL-SCALE CONSISTENCY
PASS when:
- no region appears authored at a different implicit resolution;
- detail density remains consistent with the selected target mode.

### IDENTITY FIDELITY
PASS for reference-driven work when:
- silhouette, proportion hierarchy, landmarks, material grouping, and color identity preserve supported source evidence.

### TARGET COMPATIBILITY
PASS when:
- GENERIC_PIXEL, MINECRAFT_NATIVE, or MIVUBI_HD_PIXEL rules are satisfied;
- target-size readability is preserved.

### EDGE CLEANUP
PASS when:
- no accidental halos, matte residue, half-transparent fringe, or inconsistent jagged artifacts remain.

### BACKGROUND / ALPHA
PASS when:
- requested transparency is true alpha;
- checkerboards or preview backgrounds are not baked into production pixels.

## Conditional gates

### STYLE LOCK
For series work only.

PASS when canvas logic, pixel scale, occupancy, perspective, outline, palette relationship, light direction, and cluster density remain compatible with the established set.

### FRAME CONSISTENCY
For animated sprites only.

PASS when anchor, apparent volume, palette, identity landmarks, and pixel scale remain stable across frames unless intentionally changed by motion.

### TILE SEAM
For repeating tile/pattern assets only.

PASS when required edges repeat without visible unintended seams or phase jumps.

## Verdict

Return one:

```text
PASS
REVISE
BLOCKED
```

For `REVISE`, identify the smallest causal correction and the specific affected gate(s).

Correction priority:

```text
wrong silhouette / composition
→ wrong identity landmark
→ wrong pixel scale / cluster structure
→ wrong value / material separation
→ palette redundancy
→ secondary detail cleanup
```

Batch one coherent correction. Then rerun only the affected gates plus any gate that the correction could plausibly regress.
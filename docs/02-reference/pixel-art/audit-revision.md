# Pixel Art Audit and Revision

## Purpose

Diagnose existing pixel art and make the smallest correction that improves the actual defect.

## Audit order

```text
grid integrity
→ target-size readability
→ silhouette
→ pixel-scale consistency
→ cluster structure
→ value/palette hierarchy
→ material/identity fidelity
→ edge/alpha cleanup
→ style-lock consistency
```

## Causal correction

One visible problem should have one primary owner.

Examples:

```text
unreadable object
→ silhouette/composition

muddy material
→ value/material cluster separation

noisy surface
→ cluster/detail discipline

icon family mismatch
→ Style Lock

white fringe
→ alpha/edge cleanup
```

Do not redraw an entire asset when a bounded cluster correction is sufficient.

## Revision loop

```text
identify cause
→ patch one coherent region/system
→ review at target scale
→ rerun affected QA gates
→ PASS | REVISE | BLOCKED
```

Avoid micro-loops that inspect after every single pixel.

## Preservation

During a targeted correction, preserve unaffected:

- silhouette landmarks;
- palette roles;
- material identity;
- accepted style-lock fields;
- animation anchors/volume when applicable.

A local improvement is a regression if it breaks these elsewhere.
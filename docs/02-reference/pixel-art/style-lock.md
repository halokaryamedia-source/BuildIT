# Pixel Art Style Lock

## Purpose

Keep a series of pixel-art assets visually coherent without forcing every subject into identical geometry or palette values.

## Profile fields

Use only decision-relevant fields:

```text
canvas / target grid
visible pixel scale
subject occupancy
projection family
outline treatment
palette relationship
light direction
contrast range
cluster density
shadow language
material highlight language
alpha/background convention
```

Do not store the full source prompt, full reference corpus, or downstream UV state inside Style Lock.

## Establishing a profile

A profile may come from:

1. explicit user instruction;
2. an accepted existing asset set;
3. a clearly dominant project convention;
4. provisional first-pass choices when no stronger authority exists.

Mark provisional fields internally. Do not present them as user-approved requirements.

## Reuse

For subsequent assets in the same set, preserve the profile unless the subject requires a justified exception for recognition or material behavior.

Example valid exception:

```text
most icons use selective outline
→ glass bottle needs reduced interior outline to preserve transparency read
```

The exception changes local treatment, not the entire family grammar.

## Drift detection

Treat these as likely style drift:

- different implicit pixel scale;
- inconsistent canvas occupancy;
- switching between full and selective outline without reason;
- conflicting light direction;
- substantially different contrast range;
- perspective family changing between comparable icons;
- one asset using micro-noise while the rest use clean clusters;
- arbitrary palette expansion.

## Revision behavior

If the user changes the style direction for the set, update the Style Lock once and propagate only the fields actually changed.

Do not re-author unaffected assets merely because the profile metadata changed.
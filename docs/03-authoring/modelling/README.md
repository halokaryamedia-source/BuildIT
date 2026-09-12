# Modelling

Owns geometry/modelling policy and profile-specific modelling knowledge.

```text
standard.md
profiles/README.md
profiles/<selected-profile>.md
```

`standard.md` owns the universal **Bedrock-native representation and anti-overcube policy**, including Adaptive Cuboid Budget, Marginal Geometry Value, Representation Ladder, segmented-curve rules, and the cohort merge/remove challenge. Profiles may specialize asset decisions but must not replace those universal rules with fixed Cube counts.

AI load rule: load `standard.md` plus exactly one primary profile by default. Secondary profile guidance must be narrow and decision-specific.

# Animation Contract

Status: `APPROVED`

## Decision

- Animation Required: `false`
- Workflow Status: `ANIMATION_SKIPPED`
- Reason: The Golden Sample validates the reference-to-production pipeline without adding clip-production scope.

## Pivot readiness

Even though animation is skipped, preserve these groups and pivots:

- head at the neck transition;
- each leg at its body attachment;
- each foot as a child of its leg;
- ears as children of head;
- horns as rigid children of head;
- tail base at rear body;
- tail tip as child of tail base.

## Required clips

None.

## Forbidden

- walk;
- idle;
- charge;
- attack;
- hurt;
- death;
- procedural motion;
- unapproved pose changes.

## Validation

- `reference_manifest.json` must record `animation.required = false`;
- workflow must route from Texture approval to Final Validation;
- no Animation skill or Animation tool profile is loaded;
- the final model may contain pivot-ready hierarchy but no required clips.

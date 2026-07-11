# Geometry Contract

Status: `APPROVED`

## Authority

- `PRODUCTION_CONTEXT.md`
- `01_black_rhinoceros_form_scale_reference.png`
- `02_black_rhinoceros_construction_reference.png`
- `reference_manifest.json`

## Required output

- Format: Bedrock Entity
- Geometry Type: cuboid-only
- Asset Envelope: `27.2u W × 52.8u L × 40u H`
- Ground Plane: `Y = 0`
- Front Direction: `-Z`
- Expected Cuboid Count: `22–32`
- Root Group: `black_rhinoceros_root`

## Required hierarchy

```text
black_rhinoceros_root
└─ body
   ├─ head
   │  ├─ muzzle
   │  ├─ horn_front
   │  ├─ horn_rear
   │  ├─ ear_left
   │  └─ ear_right
   ├─ leg_front_left
   │  └─ foot_front_left
   ├─ leg_front_right
   │  └─ foot_front_right
   ├─ leg_rear_left
   │  └─ foot_rear_left
   ├─ leg_rear_right
   │  └─ foot_rear_right
   └─ tail_base
      └─ tail_tip
```

## Build order

1. Create the root and body hierarchy.
2. Build the central torso.
3. Add the shoulder mass and rear/belly mass.
4. Build the neck transition, head, and muzzle.
5. Add front and rear horns.
6. Add ears.
7. Add four thick legs and four hoof blocks.
8. Add tail base and tail tip.
9. Align all feet to `Y = 0`.
10. Apply placeholder colors only.

## Shape requirements

- Shoulder must be visibly higher and heavier than the rear.
- Torso must read as a long, deep mass rather than a cube.
- Head must slope downward toward the muzzle.
- Front horn must be longer and taller than rear horn.
- Legs must remain thick and nearly vertical.
- Rear body may taper slightly but must remain heavy.
- Tail must remain short and thin.

## Geometry-vs-texture split

Geometry:

- torso;
- shoulder;
- rear mass;
- head and muzzle;
- horns;
- ears;
- legs;
- feet;
- tail.

Texture only:

- eyes;
- nostrils;
- mouth line;
- wrinkles;
- scars;
- skin folds;
- muscle shading;
- hoof split.

## Forbidden

- mesh geometry;
- spheres or cylinders;
- micro-cube wrinkles;
- nostril cubes;
- eyelid cubes;
- decorative skin strips;
- UV work;
- texture painting;
- animation;
- final export.

## Geometry review acceptance

- recognizable as the approved black rhinoceros;
- bounds within `±1u`;
- all four feet contact ground;
- hierarchy matches this contract;
- cuboid count remains within range;
- no missing horn, ear, leg, foot, or tail part;
- no major z-fighting;
- no unapproved Texture or Animation work.

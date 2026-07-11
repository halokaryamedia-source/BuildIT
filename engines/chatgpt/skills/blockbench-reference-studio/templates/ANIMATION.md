# Animation Contract

Status: `DRAFT`

## Decision

- Animation Required: `true | false`
- Status: `ANIMATION_REQUIRED | ANIMATION_SKIPPED`
- Reason:

When animation is skipped, retain the hierarchy and pivot-readiness required for future use, but do not create clips.

## Authority

- Production Context:
- Sheet 02:
- Sheet 04:

## Required hierarchy

- Root:
- Body Chain:
- Head Chain:
- Limb Chains:
- Tail/Wing/Attachment Chains:

## Pivot and axis rules

- Group:
  - Pivot:
  - Allowed Axes:
  - Rotation Range:
  - Parent:
  - Ground-Contact Constraint:
  - Clipping Risk:

## Required clips

- Clip Name:
  - Purpose:
  - Duration:
  - Loop:
  - Required Channels:
  - Neutral-Pose Recovery:

## Forbidden work

- optional clips not approved by the user;
- Geometry redesign;
- Texture redesign;
- pivot changes that conflict with Sheet 04;
- motion outside approved axes;
- foot sliding or broken ground contact;
- clipping through major body parts or attachments.

## Animation review acceptance

- required hierarchy exists;
- pivots and axes match Sheet 04;
- required clips exist when animation is required;
- neutral pose is recoverable;
- ground contact is preserved;
- no major clipping is visible;
- approved Geometry and Texture remain unchanged.

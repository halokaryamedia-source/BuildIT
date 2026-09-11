# Particle Reference Authoring Status

Particle Reference Authoring is an active ChatGPT-side Reference Preparation capability.

Canonical owners:

```text
docs/02-reference/particle/
.agents/skills/lazydesigner-particle-reference-authoring/
```

It is not an MCP subsystem. It produces Bedrock/Snowstorm particle reference assets and clean packages that may be reviewed directly or handed downstream to Codex/MCP.

## Knowledge maturity

The source/static knowledge foundation is now mature enough to act as the canonical particle reference authority for authoring decisions.

Covered knowledge includes:

```text
Bedrock particle document/components
field/default/evaluation semantics
emitter lifecycle/rate/shapes
motion/collision/rotation
Molang language/math/queries/ownership
curves/events/event timing
billboards/materials/tint/lighting
texture RGBA/atlas/UV/flipbook/filtering/color
entity/locator transform context
Snowstorm/Wintersky editor mapping
Snowstorm release compatibility + round-trip risks
performance/readability/static QA
troubleshooting and delivery
```

## Closure state

```text
SOURCE / DOCUMENT KNOWLEDGE     MATURE
OFFICIAL SCHEMA COVERAGE        TRACKED
SNOWSTORM VERSION KNOWLEDGE     VERSION-AWARE
STATIC AUTHORING QA             MATURE
REAL MULTI-FAMILY VISUAL CASES  DEFERRED BY USER
LIVE MINECRAFT PROOF            NOT CLAIMED
DEVICE / FPS PROOF              NOT CLAIMED
```

Remaining uncertainty is intentionally limited to target-version/runtime facts such as newly introduced Bedrock fields, editor regressions, host-specific Molang query exposure, exact collision/runtime integration, GPU/device performance, and final visual acceptance.

These uncertainties should trigger targeted target-version/runtime verification, not another parallel particle framework.

Historical experimental development has been retired from the working tree. Git history retains provenance.

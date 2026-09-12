# Pixel Art Reference Status

Status: **ACTIVE — initial canonical domain implemented**

## Implemented

- ChatGPT/Codex specialist skill: `.agents/skills/lazydesigner-pixel-art-authoring/SKILL.md`
- artifact classification;
- target modes: `GENERIC_PIXEL`, `MINECRAFT_NATIVE`, `MIVUBI_HD_PIXEL`;
- grid/resolution budgeting;
- silhouette-first authoring;
- cluster discipline;
- palette/material/shading guidance;
- icon, object/prop, sprite, animation, tile/pattern guidance;
- reference conversion;
- texture-reference boundary;
- Style Lock;
- transparency/edge hygiene;
- QA and causal revision loop;
- compact downstream handoff rules.

## Canonical boundary

Pixel Art Authoring is a Reference Preparation specialist. It does not replace LazyDesigner Texturing, Particle, Modelling, or Animation ownership.

## Integration expectation

Repository routing/taxonomy should recognize pixel-art requests as Reference Preparation work and expose only the minimal relevant context bundle.

## Validation goals

Future repository validation should ensure:

1. the specialist is discoverable by pixel-art intent;
2. Pixel Art does not claim UV/Blockbench Painter ownership;
3. Particle texture handoff does not duplicate particle semantics;
4. simple icon routing remains context-light;
5. Style Lock state remains compact;
6. Minecraft modes retain strict pixel-grid rules;
7. QA does not become a per-pixel micro-loop.
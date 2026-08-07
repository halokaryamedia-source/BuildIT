# MCP Geometry AI-Slop Audit

**Status:** BLOCKED
**Date:** 2026-08-02
**Scope:** Generic MCP geometry construction and visual validation
**Test fixture:** Zebra only; no Zebra-specific runtime rule is permitted

## Executive verdict

The previous Zebra result was not a modelling success. It was a technically
valid cube arrangement that was incorrectly reported as visually acceptable.
The model did not match the reference silhouette, proportions, head shape,
leg structure, or tail. The previous `PASS` decisions are invalid.

The central failure is architectural:

> MCP can place and validate cuboids, but it cannot independently determine
> whether a cuboid arrangement visually matches a reference.

The workflow therefore allowed the agent to write a plausible visual report
after producing poor geometry. That is AI-Slop: tool success, attachment
success, and fluent text were treated as evidence of a good model.

## Confirmed issues

| ID | Severity | Issue | Effect |
|---|---|---|---|
| G-01 | Critical | Exact cube transforms were chosen by the agent without a reference-grounded spatial contract. | Arbitrary coordinates could be presented as deliberate modelling decisions. |
| G-02 | Critical | The Geometry Plan described names, order, and attachments, but did not require section envelopes, anchors, or visible shape constraints. | A plan could be structurally complete while still producing the wrong silhouette. |
| G-03 | Critical | The reference manifest supplied overall dimensions but no structured silhouette landmarks or section spatial targets. | The MCP had no machine-checkable reference information for neck slope, torso placement, head projection, leg spacing, or tail bend. |
| G-04 | Critical | The placement gate checked local contact, not global shape. | Cubes could touch correctly and still form a bad animal. |
| G-05 | Critical | Section completion meant that all declared cube items were placed. | “All cubes exist” was incorrectly close to “the section is correct.” |
| G-06 | Critical | The visual gate validated the shape of the written review, not the truth of the image comparison. | Generic observations could produce `PASS`. |
| G-07 | Critical | There was no independent vision-capable verifier inside MCP. | MCP could not reject a false visual claim about a visibly bad model. |
| G-08 | Critical | No regression fixture reproduced the known bad Zebra model and asserted that it must be rejected. | Tests proved schema completeness, not visual honesty. |
| G-09 | Major | The model construction process encouraged cube-by-cube decisions without a proven global stance and proportion plan. | The result became a stack of disconnected-looking or oversized cuboids. |
| G-10 | Major | The old process did not impose a hard global envelope from the reference dimensions. | The model could grow beyond the reference while every local attachment still passed. |
| G-11 | Major | Rotation was syntactically explicit but not semantically enforced by the reference shape. | A visibly sloped neck or tail could still be represented as axis-aligned blocks. |
| G-12 | Major | There was no safe automatic rollback of a whole failed semantic section. | A rejected section could remain partially present and contaminate later reviews. |
| G-13 | Major | Existing partial geometry was not automatically proven to be a clean zero-state before a new run. | Old geometry could influence camera framing and subsequent decisions. |
| G-14 | Major | Re-reviewing dependencies after later mutations caused repeated review loops without improving geometry. | The workflow spent effort re-authorizing state instead of correcting shape. |
| G-15 | Major | The process did not hard-stop after a false or contradictory `PASS`. | A bad review could authorize the next construction section. |
| G-16 | Major | The final full-model gate inherited section `PASS` decisions. | One false section approval could contaminate the entire final review. |
| G-17 | Major | The earlier capture response returned model and reference images as separate blocks without an explicit paired comparison layout. | The reviewer could acknowledge images without performing a direct comparison. |
| G-18 | Major | The prompts contained stale instructions such as `begin_visual_fit` and `projection evidence`. | Old workflow concepts could reintroduce AI-Slop or prohibited evaluation behavior. |
| G-19 | Major | Documentation and runtime rules were temporarily inconsistent: five-view language remained beside the duo-view construction contract. | The agent could choose the wrong review process. |
| G-20 | Major | Technical overlap, valid coordinates, hierarchy, and screenshots were repeatedly treated as if they were visual proof. | Structural correctness was confused with resemblance. |
| G-21 | Major | The visual review fields were free-form prose. | A reviewer could produce fluent but non-specific claims. |
| G-22 | Major | The system did not require evidence to name the actual semantic items inspected. | “The model looks acceptable” was too easy to submit. |
| G-23 | Major | No explicit comparison outcome was recorded per criterion beyond free-form status and text. | The review did not expose exactly which visual question failed. |
| G-24 | Major | The workflow had no reliable correction generator. | When the model was wrong, the agent guessed another transform instead of deriving a supported correction. |
| G-25 | Major | The MCP was asked to “fix” geometry without receiving enough structured reference constraints to know what the fix should be. | Automatic correction would have been guesswork and more AI-Slop. |
| G-26 | Major | The live session and in-memory gate state could be invalidated by reload. | A source change could disconnect the proof from the current Blockbench state. |
| G-27 | Major | The cancelled live draft was left as an unsaved partial model. | The workspace still contains contaminated test state and must not be treated as a valid starting point. |

## Issues observed directly in the Zebra test

The reference clearly shows a continuous low torso, sloped neck, projected head
and muzzle, four separated legs, ears, and a descending bent tail.

The inspected model capture showed:

- a flat rectangular torso;
- stacked leg cubes rather than a convincing leg silhouette;
- fragmented neck and head blocks;
- no convincing muzzle profile;
- no useful tail silhouette;
- incorrect overall visual proportions.

Despite this, the section received `PASS`. This proves that the old visual gate
was not functioning as a reliable quality gate.

## Changes made before the hard reset

The following protections existed in the discarded experimental workflow:

- manifest-matching `target_dimensions` are required;
- mutations exceeding the global width, height, or length envelope are undone;
- review checks must name declared plan items;
- model and reference images are returned as labeled `MODEL | REFERENCE`
  comparisons;
- stale `begin_visual_fit` and projection-evidence instructions were removed;
- the section-state deletion bug was fixed;
- duo capture, current revision, dependency, and incomplete-section checks are
  covered by tests.

They were intentionally discarded by the hard reset and are not active in the
reset `mcp/` source. They reduced false positives but did not create an
independent visual judge. A reviewer could still lie in text about a bad image.

## Unresolved blockers

The following problems remain blockers and must not be hidden by another patch:

1. There is no reference-grounded, generic representation of visible section
   envelopes and landmarks.
2. There is no independent visual verifier available inside the MCP runtime.
3. There is no trustworthy way for the server to prove that Codex inspected the
   returned images rather than generated a plausible report.
4. There is no safe generic automatic correction algorithm for wrong cuboid
   placement without inventing transforms.
5. The cancelled Zebra project is not a clean baseline.

## Hard-reset result and requirements

The hard reset has now been applied to the `mcp/` repository and the saved Zebra
project. Before the next modelling test:

- preserve this audit;
- keep the saved Zebra project empty rather than repairing the old draft;
- start from an empty or verified-clean Blockbench project;
- reset the in-memory Geometry Plan and visual-gate state;
- require a fresh reference inspection;
- prohibit use of old capture IDs, old `PASS` records, and old plan revisions;
- use only the duo `MODEL | REFERENCE` comparison path;
- stop on the first gross silhouette or proportion failure;
- do not continue because cubes are technically connected;
- do not add another evaluator score or projection-based fitting system.

## Final rule

No geometry is approved because it is complete, connected, valid, or
well-described. Geometry is approved only after the visible model is judged to
match the reference in the required views. If that judgement is unavailable or
contradicted by the image, the result is `BLOCKED`.

# Current Validation

Updated: 2026-09-10

This file owns **current proof interpretation**. Continuation belongs in `docs/knowledge/next-action.md`; stable facts in `CONTEXT.md`; source ownership in `docs/knowledge/implementation-map.md`; active asset continuity in `workspace/active/<project>/README.md`.

## Current Source Proof

### Final source verification and build — 2026-09-10

SOURCE_READY for the implemented scope; native/visual acceptance NOT_RUN. verify:full was invoked once and failed first on continuation rules. Resumed failed/unrun stages: repository35 PASS; runtime689 PASS plus the one failed continuation test corrected and rerun in its18-test owner group; authoring158 PASS. This covers883 distinct tests across the final gate partitions, not a claim of one uninterrupted green verify:full invocation. Logs: mcp/.cache/plugin-audit/final-{repository,runtime-retry,continuation,authoring}.log. Typecheck, Gateway typecheck, docs freshness, surface and phase measurements PASS; build PASS.

Integration corrections were fixture/bootstrap isolation, missing native keyframes getter in bake fixture, pivot-only source-test scope and compact continuation. No runtime fallback was added. Default full-catalog response111603 chars/schema94148; narrow schema budgets updated for new plugin functions. This grew versus the earlier101429/85402 baseline; it is not token-efficiency proof. Gateway remains four front-door tools; callable catalog56, generated ToolSpecs68.

Built mcp/dist/blockit_mcp.js: build_identity sha256:3734e2935baff7be0faf14114d65ec0e8fbf3219ab63eb7cb6faf6fb93f27631; file SHA2560722dce7613709a725e8954bf546d9951035c7d3f7492adcf9a5492daa2754f1. Managed package built from Local commit8f50a45974f1f60cb451b81f43da7c1fd2234b8c; no activation/push/main change. ZIP: mcp/dist/managed/blockit-windows-x64.zip; SHA25616d0631917bce8406e89c89e425be1c8b17aee8f468dd7102d73488ae7698827. Package verification, compiled platform self-test, disposable installation and Gateway initialize smoke PASS. First packaging attempt staged its disposable install because the default runtime endpoint was occupied; retry used an isolated unused loopback endpoint for the fixture only, leaving user runtime untouched. Log mcp/.cache/plugin-audit/final-package.log.

Audit closure is bounded source review plus regression/contract coverage, not exhaustive native branch coverage. Known residuals: native Cube AO world/UV/visual correctness, native Undo/persistence/controller/playback, post-commit errors, whole paint palette/GPU transaction rollback and manual-only Brush Tuna pressure. Existing project/export guards and texture target/selection restoration inspected without newly reproduced defects. No new model testing; rejected elephant remains closed. Full-session token cost UNKNOWN.

### Batch animation coverage independent of Timeline visibility

Reproduced selection=all skipping a target animator absent from Timeline.keyframes. Batch all/range/pattern now enumerate target Animation.animators keyframes; selected still uses Timeline.selected with animation ownership filtering. Registered executor covers visible/hidden target bones and foreign-animation exclusion for all four selection modes. Regression FAIL before / PASS after;28 targeted tests200 assertions PASS (batch, ownership and animation mutation contracts), typecheck/diff check PASS. Native UI/playback not tested. Copy/paste inspected for explicit targets, finite snapped times, same-channel collisions, native Undo rollback and count receipts; no additional change justified by that inspection, which is not exhaustive native proof.

Before rebuild: complete the active operation coverage reconciliation (including remaining project/export and texture orchestration branches); fix only reproduced defects; synchronize changed generated contracts; then run final verify:full once. Native visual/Undo/persistence checks belong after installation and must not be presented as source blockers that require speculative plugin features.

### Animation effect removal continuation

Registered-executor reproduction: removing the sole particle/sound point removes its native keyframe from the animator, but the detached keyframe retains data_points; the result incorrectly listed the deleted effect in removed.remaining. The removal branch now returns an empty remaining list when the entire keyframe is removed. Multi-point removals still return surviving points in their new order. No schema or tool count change.

Proof: regression FAIL before / PASS after, both particle/sound channels, sole/multiple points, explicit target despite another selected Animation, and one finish per request.15 targeted tests88 assertions PASS across effect executor/mutation and controller mutation/effect contracts; typecheck PASS. Controller plan validation/target resolution/Undo catch and final snapshot inspected; no additional source change justified by that inspection. Controller contract tests are not native execution proof. No full verifier/build/deploy/live playback run.

Residual: effect results are ordered operation receipts, not a guaranteed final snapshot after later operations in the same batch. Native controller extend behavior, effect preview/Undo and animation export/playback still need runtime evidence. Next source audit owner: animation timeline copy/paste and batch target/result behavior.

### History recovery result audit

Reproduced registered undo executor returning success when native Undo.undo did not move its index. Shared undo/redo owner now rejects active edits, checks each native index transition, and adds an action to the completed count only after return and expected index movement. Exceptions include completed count and current index with inspect-before-retry guidance; no automatic inverse operation is attempted because a throwing native operation may have changed state partially. Index transition is not bitmap/model restoration proof.

Regression FAIL before / PASS after: both directions, no-effect, second-step exception, successful multi-step receipt, exhausted stack and active-edit isolation.16 targeted tests63 assertions PASS across history executor, material-instance results and particle write-revision/contracts. Typecheck and diff check PASS. No generator needed (implementation-only history change); no full verifier/build/deploy/live run.

Additional bounded inspection: material set/bulk/clear preflight targets and no-ops before Undo and return mutation summaries; existing result fixtures PASS. Native material setter/Undo exception behavior remains unproven. Particle executor validates before writes, checks source revisions and reports preview_error separately from verified writes; revision/contract tests PASS. Neither inspection establishes complete material/particle branch coverage. save_checkpoint is disabled at registration; get_undo_stack is bounded read-only history. Remaining active tool audit continues, next animation controller/effects mutation results.

### Resource listing/read identity and prompt audit

CONTEXT: LOCAL_CODE. Reproduced generated resource IDs redirecting to sibling UUIDs, exact names and Texture native IDs. makeResourceId now reserves those identities and falls back to the owner's UUID. Registered list/read callbacks demonstrate target round-trip. Found invalid URI schemes particle_reference and reference_models: URL parsing rejects underscores. Canonical runtime/templates/listings and generated documentation now use particle-reference and reference-models; resource registration names stay unchanged. Unknown explicit particle sections now throw instead of returning discovery. Omitted section still lists available sections.

Proof: new identity tests FAIL before / PASS after; invalid legacy scheme failed URL construction.32 targeted tests406 assertions PASS across URI, resource callbacks, validator freshness, texture knowledge, prompt/skill surface and phase routing. Typecheck PASS after preserving numeric Object3D IDs in the shared item type. docs:build/docs:check PASS; diff check PASS. Two stale prompt prose assertions updated to assert specialist destinations and equivalent authoring exclusion. No source prompt expansion, full verifier, build/deploy or native run.

| Resource/prompt owner | Audited branches and evidence | Limit |
| --- | --- | --- |
| projects/textures/reference_models | Empty list vs explicit target, list-to-read identities, metadata callbacks; targeted tests | Reference resource requires installed plugin; native persistence untested |
| nodes | Scalar serialization and focused ID resolution inspected; shared URI tests | Native Object3D payload still requires runtime proof |
| validator status/checks/warnings/errors | Fresh reads vs cheap listing, focused check not-found and UUID inference inspected; freshness tests | Native Validator execution untested here |
| particle-reference | Every listed URI parses and reads; unknown explicit section rejects | Reference payload semantic freshness not re-researched |
| texture-authoring knowledge | Topic validation and bounded static payload owner checked; resource tests | Knowledge is guidance, not visual-quality proof |
| bedrock_entity_workflow | Canonical manifest/phase filtering, readiness header, specialist routing and scope tests | Does not establish complete active-tool branch audit or autonomous output quality |

Next owner: remaining active tool operation/executor/result branches. Resource scheme change requires clients to refresh listings after eventual activation. Native proof and final full verification remain pending.

### Native paint setting setter rollback

Reproduced registered-executor failure before fix: lock_alpha remained true when a subsequent native setting setter threw. Requested native settings now snapshot/readback their scalar values, apply before Painter fields, and restore all attempted writes in reverse if any setter or the control batch fails. Restore failures name the affected setting and retain the original cause; unaffected restores still run. Replaced six repeated setter blocks with one bounded loop. Source scope is setter/control-stage recovery, not whole-request transactional guarantees for later palette/GPU setters or native side effects outside setting.value.

Verification: regression FAIL before / PASS after;8 targeted tests46 assertions PASS (settings, controls, palette, sampler), typecheck PASS, diff check PASS. Tests cover partial-write exception, missing later control, silent setter rejection and failed restoration. No full verification, build, deployment or native proof performed.

### Paint settings mirror state and control preflight

Registered-executor regression first FAIL: lock_alpha changed despite missing pixel-perfect control rejecting the request. Controls now use existing batch preflight before Painter fields. Explicit mirror axes replace previous axes (including empty list clearing all); texture:false no longer skips the options branch. Unavailable mirror options reject before control writes. Whole-request atomicity across native settings/sampler/palette remains unproven and is the next bounded owner. Native painting proof not claimed. Continuation was consolidated to remove stale completed items from the pending list.
### Native stroke failure recovery

Fill, shape, gradient, copy, eraser and brush now share runPaintStroke. Active Undo rejects before stroke; native cancellation and unfinished edits report failure. Exceptions cancel the native bitmap/layer Undo, then use Painter's canceled-stop branch to release PointerTarget without committing or running end hooks; transient Painter state is cleared. Successful native stop remains the commit owner. Control/color restoration and failures after native commit are not covered by rollback.

Evidence: cached native-painter.js start/stop lifecycle; regression replay with previous unguarded start/stop behavior FAIL (pixel stayed20 instead of10), restored implementation PASS.17 targeted tests/236 assertions PASS; typecheck PASS. Removed brittle stopPaintTool source-string assertions in favor of helper and registered-executor failure tests. No full verifier/build/deploy/live run. Native Undo/layer restoration and pointer release still require installed-runtime proof.

### Remaining native stroke selection order

Fill, shape, gradient and copy now select their own native tool before writing per-tool settings, using setBarItemValues for batch preflight/rollback. Previously all four wrote settings before selection. Registered-executor fixture covers each tool's setter/stroke ordering;16 targeted tests PASS (225 assertions) with texture-authoring contracts. Native painting/render proof pending. Color/selected-tool restoration is not claimed; mid-stroke exception cleanup remains next audit owner.

### Paint setting batch recovery

setBarItemValues snapshots readable scalar controls and preflights setters before writes. On failure it restores attempted controls in reverse order, including a setter that mutated before throwing; rollback failure explicitly names unresolved controls. paint_with_brush and eraser use it. Eraser now selects its native tool before changing per-tool sliders. Eighteen targeted tests PASS (222 assertions); typecheck PASS. Scope is widget values, not selected tool/color/whole paint_settings atomicity. Other native stroke families still need the same selection-order audit. Full/native gates remain deferred.

### Native paint control failures

All setBarItemValue production callers are in paint.ts and use requested/resolved settings, not optional discovery. Missing controls and unsupported setters now throw; native setter/change errors propagate instead of falling through to a value assignment or false success. NumSlider modifier semantics retained. Added failure regression, completed native brush fixtures and removed stale blend source-string assertion in favor of executor evidence. Partial settings before a later error are not yet transactionally restored; no bitmap stroke begins after a setter throws, but multi-setting rollback remains an audit concern. This is source-only evidence, not native validation.

### Painting state audit

paint_with_brush declared default blend mode but only wrote it to native controls when explicitly provided, allowing previous native blend state to leak into later non-exact strokes. It now always applies the resolved blend mode. Registered-executor regression1 PASS; typecheck PASS. Generic click/dialog tools are extended-profile fallbacks, not normal Entity surface; disabled eval remains disabled. Material save already preflights path/native access and checks saved/file existence; no replacement introduced. Remaining audit concern: shared setBarItemValue tolerates missing controls and setter failures; inspect all callers and establish required/optional semantics before changing that owner. Native stroke appearance not verified.

### Resource explicit-target semantics

Confirmed regression: reading projects://missing against empty state returned successful empty data. Explicit missing IDs now error for projects/textures/reference_models; empty listing remains valid. Texture reads now prioritize UUID over runtime ID and reject duplicated runtime IDs, preventing accidental target substitution. Five resource tests PASS (18 assertions), including executor callbacks; typecheck PASS. Reference-model empty branch changed consistently but native/reference callback execution remains unverified. Full-surface audit still open; no build activation or full verifier run.

### Gateway/resource audit — identity and timeline discovery

Resource ID generation previously emitted identical slug~uuid8 for equal names sharing UUID prefixes; generator now falls back to full UUID, with roundtrip regression. Gateway flattened timeline projection previously omitted easing/bone_ids; both fields now survive branch discovery, with a projection regression. Canonical union projections already retained branch fields; this fix closes the flattened-schema path. Resource/Gateway/reliability/project-affinity tests28 PASS before the added projection regression; Gateway suite14 PASS afterward. Typecheck PASS. Full audit and native execution are not complete.

### Autonomous audit continuation — AO transaction and instruction footprint

AO fixture now executes the registered paint_texture_transaction with native-shaped bitmap/Undo mocks and transformed Three geometry: success returns actual revision, stale revision rejects before Undo, corrupted readback cancels and restores bitmap. Test PASS (adapter/transaction fixture; native Blockbench not executed). Nine static footprint tests PASS after removing repeated autonomous-policy paragraphs; no ceilings raised. Workflow reduced9891→9189 characters while retaining explicit autonomous readiness and no fabricated user acceptance. Generated prompt/freshness PASS. This measures instruction characters, not token savings or full-surface audit completion.

### Autonomous Astra audit — in progress, not a full-surface PASS

User requests all tools/resources/prompt support AI-only execution. First confirmed workflow defect: switch_authoring_phase required user approval literals even when end-to-end autonomy was explicitly authorized. Added a strict alternative readiness branch with autonomous_authorized, geometry_verified, texture_verified, UV PASS, current evidence, checkpoint and no_blockers; never fabricates user approval. Runtime readiness text, workflow prompt, root/router/specialist instructions and flow document now carry the explicit-authority exception. Reviewed net.ts phase-switch ownership: actual phase change occurs through requestMcpPhaseSwitch after the tool response, not inside the registration executor.

Resource defect fixed: validator parsed names and selected first matching Cube/Texture/Animation/Group. It now returns inferred UUID only for unique matches. Three resource regressions PASS (25 assertions), nine source-closure tests PASS (45 assertions); typecheck PASS, prompt/API generators and freshness PASS. Full verification remains deferred. Generated inventory is68 tools/10 resources/1 prompt, not proof that every active operation branch is audited. Remaining: exhaustive active Gateway routing/results/failure audit, execution-only/manual dependency review, autonomous semantic mirror/footprint checks, AO transaction integration tests and native proof. Do not report full audit completed from these initial fixes.

### Cube AO integrated source path

paint_texture_transaction now accepts ambient_occlusion instead of operations: explicit cube_ids, radius, samples, bias and strength. Native adapter reads transformed preview triangles, matches target texture material, transforms renderer UV through its texture map, and bakes only nontransparent mapped texels. Other visible Cubes occlude. Conflicting overlapping UV surfaces reject before mutation; alpha/source bytes are preserved; work is capped before ray sampling. Existing revision check, layer restriction, native edit/Undo and readback path are reused. Bake uses current preview pose and repeated application darkens again.

Four AO tests PASS (18 assertions): hemisphere/radius/self-shadow checks, raster alpha/UV conflict checks and a Three.js transformed-mesh adapter fixture. Typecheck/docs freshness PASS. These are source fixtures, not native Blockbench proof. Runtime material/UV conventions, Undo persistence and visual quality remain pending; full verifier deferred. Prior kernel-only status below is superseded by this integration.

### Cube AO computation in progress — not exposed

Added a deterministic cosine-weighted hemisphere ray sampler over world-space triangles. It supports radius, sample count and normal bias, tests both triangle windings, rejects invalid inputs, and returns occlusion fractions without touching textures. Two tests PASS (9 assertions); typecheck PASS. This is only the computation kernel: no AO tool or usable bake is claimed. Remaining necessary work: read transformed Cube surfaces, establish native UV orientation/material ownership, rasterize mapped opaque texels, detect shared-UV conflicts, and commit through the existing revision-checked texture transaction. Native/visual proof remains pending. Full verifier not run.

### Group translation and remaining scope

modify_group.offset translates an explicit Group subtree in authored model coordinates, reusing duplicate translation preflight/mutation mechanics. Offset cannot combine with pivot/rotation/visibility edits; zero/overflow reject before Undo. All descendant Groups/elements enter one Undo; Cube UV and animation keys are retained. This is model-coordinate translation, not camera-plane gizmo UI parity. Regression1 PASS (11 assertions); native transforms with rotated ancestors, Undo and persistence remain pending.

Current remaining implementation: Cube-compatible AO is not implemented. Brush Tuna pressure is an active-plugin bridge, not a standalone engine. Full additive-bake curve linearization is not implemented. Missing native acceptance applies to all recent source increments (render readability, sampler/material behavior, texture persistence, timeline/playback, transforms and reload). Full source verifier is deferred until implementation scope closes. Mesh UV Locker, Image-format Centering and bedrock_block collision are out of Bedrock Entity scope; do not add their format-specific implementations. Easings nine-curve scope is accepted by user. Capture utility, rename, simplify, palette/noise/mirror, sampler/highlight, timeline expansion and dev reloader have bounded source implementations, not blanket upstream UI parity.

### Capture efficiency guidance

Capture size description now recommends256 for quick silhouette/pose,512 for texture/reference detail (unchanged default),32–64 for icons only, and one relevant view before expanding coverage. Each capture reports actual PNG bytes derived from its encoded payload, plus total_png_bytes. Byte counts exclude JSON/base64 transport overhead and are not session-token savings. No claim that256 is visually sufficient for every model; native readability comparison remains pending. Camera tests7 PASS; typecheck and docs freshness PASS.

### Capture/icon sizing and dev reloader audit

capture_model_views now accepts square PNG size 32..1024 (default512). Offscreen resize and both projection bases use the same size; returned dimensions match it. Existing shaded/no-gizmo capture and explicit orientation remain. This supplies model icon/preview images through the existing image result; it does not replicate Menu Icon Exporter panels, preferences, custom backgrounds or filesystem export UI.

camera-framing-contract:7 tests PASS (40 assertions), including 32/48/512/1024 projection sizing and invalid dimensions. Native rendered PNG proof pending. Existing dev:sync already builds/deploys and checks live build identity; index.ts contains file-based native plugin reload watching. No replacement watcher or background process added; live reload was not executed. Full verification remains deferred.

### Easings scope narrowed by user

User accepts Bedrock Entity scope only; additional curve parity is no longer required. set_easing now rejects absent/non-bedrock Format before Undo or data changes. No Mesh-specific implementation exists in the easing owner; bone animation remains supported. Two targeted tests PASS (45 assertions), covering rejection of free/java_block/bedrock_block and accepted bedrock. Typecheck/generated freshness checked; native playback remains pending. This does not remove unrelated retained tools.

### Whole-clip Easings

Timeline set_easing authors anim_time_update with sine/quad/cubic curves and in/out/in_out direction (nine combinations), using standard Molang trigonometry/power instead of custom parser functions. Duration must be positive; loop uses modulo for multi-cycle delta overruns, hold clamps, once returns beyond the endpoint to finish. Per-clip accumulator names encode UUID code points without lossy sanitizing. Existing expressions require explicit replace_existing; previous expression is returned for restoration through set_anim_time_update. Reapply after duration/loop changes. This is bounded whole-clip easing, not per-bone motion, per-keyframe easing or full upstream 24-curve parity.

Two targeted tests PASS (36 assertions): actual installed MolangJS parser evaluates all nine endpoint/midpoint cases and loop/once overruns; registered executor checks overwrite guard before Undo, explicit clip targeting and unchanged selection/unrelated clip. Typecheck and generated freshness checked. Native playback/export acceptance remains pending; parser proof alone does not establish realistic motion. Full verification deferred.

### Expand Bone Timeline

Timeline actions expand_bones/collapse_bones accept explicit bone_ids and include descendants. Shared animationTimelineParameters feeds the public manage_animation_timeline timeline branch. Identity preflight occurs before clip selection. Expansion uses existing keyed animators only; collapse removes matching visible rows without deleting animation data. Group traversal deduplicates roots/descendants. No new UI listeners, plugin dependency or authored-data Undo is needed for this view operation.

Targeted executor plus mutation contracts:26 PASS (195 assertions); typecheck PASS; docs regenerated and freshness PASS. Tests cover descendant inclusion, exclusion of empty/unrelated animators, repeated expansion, missing-target rejection and keyframe preservation. Native timeline rendering remains unverified. Easings source audit confirms whole-clip anim_time_update remapping; implementation remains outstanding.

### Animation bake target isolation

Reproduced via registered executor: selecting rotation keys at 0 and 1 generated seven new keys, including position and rotation beyond time 1. Bake now derives each channel's sampling interval from the selected keys, rejects snapped times outside it, emits new samples with linear interpolation, and rejects non-finite numeric samples before Undo. Original keys/interpolation remain unchanged; this is additive resampling, not full curve linearization or an authored-motion quality fix.

Regression failed before the change and passes after it (animation-bake-selection:1 test,6 assertions); typecheck PASS. Timeline restoration and pre-mutation rejection are covered. Native playback/Undo remain unverified. Full verification remains deferred per user. This bug was not invoked during the rejected elephant test and is not evidence of its cause.

### Brush Tuna pressure preset bridge

Create/load brush presets now retain size/softness/opacity pressure curves as four normalized Bezier point pairs. Validation rejects malformed or non-monotonic pressure control coordinates; stored curves are checked again before loading. Loading pressure curves requires the active BrushTuna instance and passes the preset through native Painter.loadBrushPreset plus BrushTuna.brushPreset. This is an explicit dependency bridge, not a standalone reimplementation of the pressure engine. Actual stylus events and native plugin behavior remain unverified; exact pixel transactions do not synthesize pressure.

Regression evidence: two new tests failed before implementation because curves were silently dropped. After implementation, three tests PASS (17 assertions) across brush-pressure-preset and brush-preset-runtime. Full verifier deliberately deferred. Mr Salmon AO source currently inspected requires exactly one selected Mesh; Cube/Bedrock entity AO needs a separate geometry-to-surface implementation and is not delivered by simply exposing its action.

### Texture increment — diagnostic highlight and brush preset safety

`capture_model_views.highlight_missing_textures` temporarily sets native missing-material brightness during shaded capture, restores exact previous values (including zero) on success/failure, and labels diagnostic render evidence. This is a static diagnostic capture, not the upstream flashing UI. Native render proof remains pending.

Brush presets now persist optional `lock_alpha` and apply the native toggle after loading; unavailable toggle rejects before loading. Duplicate names reject before saving; failed persistence rolls back the added in-memory preset. Native opacity uses /255 and softness /100 in inspected Blockbench painter source, matching existing schema units. Brush Tuna pressure curves and stylus event behavior remain incomplete; exact pixel transactions are unaffected by brush presets.

Two targeted tests PASS (15 assertions): missing-texture-highlight and brush-preset-runtime. Full verification remains deferred until all requested implementations are complete. No native/visual quality claim or installation performed.

### Texture increment — palette, explicit region mirror, preview sampler

Added `paint_settings.palette`: opaque base, odd stepped count retaining exact middle base, independent shadow/highlight hue shifts and lightness extents, saturation falloff; preview default, append/replace native ColorPanel palette without replacing its reactive array identity. Uses existing tinycolor2 dependency. This is a bounded hue-shift generator, not full upstream graph/UI/brightness-offset parity. Native palette persistence/visual quality unverified.

Added `paint_texture_transaction.copy_region`: explicit same-atlas source rect/target and optional horizontal/vertical flip, preserving RGBA. Takes a source snapshot per operation so overlapping destinations cannot smear. Preflight validates source/destination bounds; existing revision and Undo path retained. No hardcoded player-skin regions; caller must establish matching entity UV regions. No cross-atlas/layer support claimed.

Added `paint_settings.texture_preview`: explicit texture identity with nearest/linear filtering and clamp/repeat wrapping via current Blockbench5 material.map; previous numeric sampler state returned, unrelated maps untouched. Scope is current GPU preview only; no claim of persistence across reload, exported Minecraft sampler equivalence or replication of upstream global setting/event lifecycle.

Targeted tests:11 PASS across texture-palette, texture-region-copy, texture-preview-sampler and texture-noise (35 assertions). Typecheck and generated docs performed; full verifier deliberately deferred per user until remaining implementations are complete. No native mutation or rejected-asset retest. Outstanding: missing-texture highlight, Brush Tuna parity, AO, image/capture utilities, format-bound features and Animation queue.

### Ongoing named-plugin implementation — batch rename and bounded noise

User requests full verification only after all implementations; no verify:full executed in this increment. Targeted checks:15 PASS across batch-group-rename, geometry-identity-duplication and texture-noise; typecheck passed before removal of an unreachable Group guard; generated API rebuilt. Final source/native gates remain pending.

`rename_element` now accepts up to128 explicit Group UUID/new_name updates, with dry-run default. Full final namespace is checked case-insensitively before Undo; simultaneous name swaps preserve legacy name-keyed maps rather than overwriting tracks. UUID keys remain unchanged, animator labels/name-keyed maps synchronize, affected animations join the same Undo edit. Single Group rename uses the same planner while retaining its element receipt. Existing ambiguous names are rejected rather than guessed. Tests exercise registered executor preview/apply/preflight and pure map identity; native Undo/persistence not yet observed. Templates, presets and UI filtering from Batch Group Rename are not replicated; callers supply the exact rename map.

`paint_texture_transaction` now supports explicit seeded `noise` with rect, optional pixel mask, selected RGBA channels and amplitude. Transparent pixels remain unchanged unless explicitly opted out; alpha changes require channel a. Coordinate-seeded output is identical across split rect batches. Existing revision check/non-layered bitmap/one Undo wiring is reused. This is a bounded noise subset inspired by Let there Be Noise, not exact upstream random-sequence or UI parity; it does not provide artistic completion. Tests prove deterministic output, split equivalence, mask/channel isolation and bounds rejection. No elephant or native texture changed.

Remaining named-plugin work remains open: richer rename affordances as needed, group translation scope, palette generation, filtering/highlighting/wrapping, entity-safe mirror, native brush preset parity, UV Locker/Image mode boundaries, AO baking, capture utilities, Easings and timeline expansion. Prior bake defect still pending. Do not package/activate or claim the whole list completed from these increments.

### User-named plugin scope — ordered implementation

This list supersedes the earlier candidate inventory. Audit distinguishes native UI convenience, runtime preview state and exported asset changes. Upstream files fetched from the official repository; no upstream code copied into production. `Image Capture` has no separately matched catalog ID; treat as the capture requirement alongside Menu Icon Exporter unless the user supplies another exact plugin.

| User plugin | Source behavior / current disposition |
| --- | --- |
| Translation Plane Gizmo | Mouse plane drag. Existing explicit XYZ Cube updates can express translation; custom gizmo UI parity is not implemented. Group-subtree translation needs separate proof |
| Simplify Models | Coordinate rounding, not Cube-count reduction. New `manage_cubes(operation=simplify)` provides UUID-scoped bounds/rotation rounding, dry-run default and collapse rejection; UV/pivot rounding deliberately not included yet |
| Batch Group Rename | Preview/templates/conflict handling plus animation-name synchronization. Current single rename is not batch parity; next Geometry implementation must preflight all final names and preserve animator UUID bindings/Undo |
| Block Multi-Collision Editor | Source explicitly requires `Format.id === bedrock_block` and block collision JSON. Entity support must not masquerade as block collision support; user scope clarification pending |
| UV Locker | Mesh vertex/face transform compensation. Cube autouv=0 is not equivalent; entity Cube UV preservation and Mesh extension are separate scopes |
| Menu Icon Exporter / Image Capture | Camera/framing/icon output. Existing bounded model capture is partial overlap; exact camera/export options and continuous evidence still need implementation/proof |
| Texture Filtering | Sets texture material min/mag filtering to Nearest/Linear. Preview state, not a new pixel-art generator or exported game sampler guarantee |
| Missing Texture Highlighter | Flashes empty material brightness. Existing missing-face diagnostics do not replicate viewport highlighting; implement bounded highlight with state restoration |
| Colour Gradient Generator | Hue-shift/lightness/saturation palette authoring. Current palette inspection is not generation; queued Texture implementation |
| Skin Mirror | Prescribed player-skin arm/leg regions. Cannot map those coordinates to arbitrary entity UV; general entity mirror must use explicit corresponding face regions |
| Repeating Textures | THREE RepeatWrapping versus ClampToEdgeWrapping. Preview wrapping is not proof of Bedrock entity export behavior |
| Let there Be Noise | Seeded noise, selection mask and selected color channels. Add as controlled texture operation; noise alone is not styled art and alpha must remain opt-in |
| Brush Tuna | Extends brush preset workflow/UI. Existing native presets/brush calls are only partial coverage; inspect authored preset data and execution behavior, not bundled UI similarity |
| Image Centering | Centers viewport in Image format. Does not rearrange atlas UV or center painted islands; image-mode utility only |
| Mr Salmon's Baked Ambient Occlusion | Geometry-dependent texture baking. Distinct from screen-space AO/preview shading; requires UV-aware output, sampling budget, alpha/layer preservation and Undo proof |
| Easings | Generates Molang in `anim_time_update` for whole-clip time remapping. Graph/keyframe easing is not equivalent; preserve previous expressions and expose exact curve/duration semantics |
| Expand Bone Timeline | Shows/hides a group and descendants in animation timeline. Editor utility, not a motion-quality improvement |
| Live Dev Reloader | Watches/reloads plugin/theme files. Existing dev:watch/deploy/runtime lifecycle is overlap; never auto-reload dirty user assets or claim source build means active runtime updated |

Order retained: Geometry first (including its utilities), then Texture, then Animation. No tests on the rejected elephant. Functions unrelated to Bedrock Entity remain explicitly scoped instead of silently changing format/framework. No full-plugin parity claimed for the first Simplify increment.

Simplify first increment source proof: `verify:full` PASS (35 repository +642 runtime +158 authoring =835), both typechecks, generated docs freshness and build; log `mcp/.cache/plugin-audit/geometry-full.log`. Six added tests cover planner semantics and registered dry-run executor with no Undo; applying uses existing batch-update preflight/Undo path. Native apply/Undo/persistence is NOT_RUN. Source build identity `sha256:89d40dbb8d51938f971d40aca99ba63a89611d777deb9dc33abd98501d565879`; not packaged or activated. Public surface remains56 tools; manage_cubes schema grew to8255 measured payload units, dedicated ceiling adjusted7700→8400 for the new branch (not a token-savings claim). UV/pivot rounding remains unimplemented; bounds/rotation are explicit subsets of upstream Simplify. No runtime-code copying from upstream.

### Cross-domain plugin audit — 2026-09-10

Scope: current Local checkout, all four requested domains, existing 56-capability executor audit reused below; source comparison of 11 relevant upstream plugins, not every plugin in the marketplace and not exhaustive native execution of every branch. No elephant mutations, installations, or runtime implementation changes in this audit. Upstream pinned to `JannisX11/blockbench-plugins@38862eb66b219995b09926488f7d1084a0fb6b3a`. Downloaded source and executable reproduction are under ignored `mcp/.cache/plugin-audit/`. Source/license review is still required before copying upstream code; this audit copied no plugin code into production.

**Confirmed defect, high priority:** `animation.ts` bake (around lines 2281–2346) expands selected keys to every transform channel and full channel time extent on each selected animator. Selecting only rotation at 0 and 1 with position keys at 0 and 2 and interval0.5 creates rotation0.5 AND position0.5/1/1.5. New keys use the editor default interpolation (Bezier in the probe); original Bezier keys remain unchanged. Upstream Bakery samples selected channel/range and linearizes target keys. Consequently the current bake is not an export-safe replacement for Bakery. Original timeline time is restored correctly. Reproduction: run Bun `.cache/plugin-audit/bake-probe.ts` from mcp; invokes registered executor with isolated native stubs. This is executor proof, not native playback proof. The public consolidated timeline maps batch to this executor in `server/tools.ts`. Elephant did not invoke bake; do not attribute its robotic motion to this defect.

| Upstream function inspected | Current source behavior | Verdict / action |
| --- | --- | --- |
| Quick Box-UV Layout: six face rectangles laid out as a box while retaining per-face editability | `boxUvLayout.ts` packs Box-UV footprints; Cube face/offset edits exist | Related primitives, not identical one-operation conversion. Preserve existing layout; add explicit conversion only with face-orientation/Undo proof |
| Simplify Models: rounds selected geometry, UV, rotations and origins | `manage_cubes` accepts explicit authored values | Can express updates; no inspected equivalent simplify operation. Rounding is not geometric simplification and can damage approved proportions |
| Bone View: arrows, axes and joints updated as a visual overlay | Hierarchy/pivot inspection and locator/null editing exist | Structural inspection is not Bone View visualization; overlay parity unproven |
| Reference Models: native reference element, external file/project source | `project.ts` checks actual ReferenceModel availability and bridges it | Real dependency/bridge, not standalone replication; requires installed plugin and native evidence |
| Texture Stitcher: combines source images, replaces atlases and remaps Cube/Mesh UV | `create_texture` rebuild targets one existing base atlas through native TextureGenerator | Single-atlas repack is not multi-atlas stitch parity; explicit remap/alpha/identity/persistence proof required |
| Plaster: fractional UV contraction for edge bleeding | Integral physical-texel rules, atlas padding and seam diagnostics | Different operation. Do not silently shrink all UV to claim parity; can conflict with pixel-art alignment |
| Colour Gradient Generator: hue paths, lightness ranges, saturation falloff, palette output | `textureColorProfile.ts` extracts observed color buckets; paint gradient interpolates a painted gradient | Inspection/gradient painting is not hue-shift palette generation. Missing equivalent exposed generation in inspected owners |
| Animation Sliders: tween, amplify, ease, retime, ground-speed and normalize controls | Offset/mirror, time scale/reverse, graph easing, native Molang properties | Partial overlap. Batch scale means time scaling, not amplify-values (including scale about1). Do not present as full parity |
| Bakery: selected transform sampling plus linearization; optional quaternion interpolation | Current bake inserts default-interpolation samples and leaks selection to other channels | Confirmed defect above; no spherical option parity shown |
| Animated Platforms: moving reference ground, textures and per-animation settings | Root-motion diagnostics and timeline playback | No inspected exposed moving-ground review operation. Diagnostic speed is not ground contact visualization |
| Scene Recorder: extends native GIF recorder/export formats | `camera.ts` uses NoAAPreview for bounded still poses | Continuous recording/export absent from inspected public capture route; prioritize native recorder integration, not a new renderer |

Particle: `particle.ts` validates and losslessly patches documents, performs revision-checked writes and invokes `Animator.loadParticleEmitter`; preview failure is reported separately after file preparation. This is native preview integration, not evidence of a full Snowstorm editor reimplementation. Existing source tests/older native receipts are separate from current visual acceptance. Particle was not part of the rejected elephant output.

Painting: native fill/shape/gradient/copy/eraser/brush, presets, selections and layers dispatch into Blockbench/Painter. `paint_with_brush` also intentionally has an exact-pixel fast path for a narrow settings tuple, using bitmap/layer Undo. `paint_texture_transaction` is an exact designed-pixel route, not the native brush engine. Therefore a successful transaction cannot validate copy brush, preset, mirror, layering or artistic brush behavior. Full native action matrix remains missing; no blanket claim that these tools work perfectly or are broken.

Coverage/proof: current runtime suite run during audit: **636 PASS / 0 FAIL across114 files**, log `.cache/plugin-audit/runtime-tests.log`. First run failed only because prior next-action cleanup changed the literal `Do not publish Stable`; restoring the explicit instruction resolved it. This illustrates prose-coupled tests, not a runtime regression. Bake probe demonstrates missing behavioral coverage despite green suite. No new full build/native verification claimed. Existing earlier all-capability matrix below remains the branch inventory; new findings supersede its bake confidence.

Repair order: (1) bake selected-channel/range isolation + numeric linear output + endpoint/Undo tests; (2) continuous native playback capture and explicit contact-review surface; (3) coherent Molang authoring using current tools, then creation expansion only with expression round-trip proof; (4) hue-shift palette and native painting parity with representative samples; (5) multi-atlas stitching/optional UV tools; (6) particle editor/preview parity where user needs it. Geometry that already works is retained. Test-first minimal reproductions precede each source fix; no wholesale rewrite justified by this evidence.

Efficiency: measure chosen executor input/output bytes, pixel/keyframe work and correction rounds; do not call them session token savings. Avoid dumping full affected-key arrays (12 edits previously emitted thousands of UUID fields), scan pixels only at checkpoints, reuse mutation state, validate one representative cohort before expanding. For cyclic secondary motion prefer expressions to arbitrary dense numeric keys. Native parity fixtures must test output/Undo/persistence; string-name checks cannot establish it. Accepted-result cost remains UNKNOWN until actual accepted work is measured.

### Elephant test closed by user — 2026-09-10

Final user verdict: Geometry acceptable in part ("lumayan"), Texture REJECTED, Animation REJECTED (rigid/robotic, no authored Math animation). Asset testing is CLOSED; do not resume polishing this elephant. Both clips were saved, but neither technical validation nor saved output constitutes visual acceptance. Whole-session token totals are UNKNOWN; this rejected result establishes no efficiency success.

Confirmed authoring failures: numeric-only sampled motion was chosen despite an existing Molang edit route; exact-pixel texture transactions did not exercise configured brush behavior; continuous three-loop playback evidence was unavailable; animation finite-difference velocity concerns remained unresolved. These are agent-method/proof failures, not proof that every runtime tool is broken. Source creation rejects Molang deliberately while keyframe editing accepts it; expanding creation requires authored-space/codec sign and complex-expression round-trip proof, not just widening Zod.

Current reimplementation scope: Geometry/UV, Texture, Animation and asset-only Particle. First compare each relevant upstream feature to its actual executor, observable state changes, Undo/persistence and native evidence. Preserve working functionality. Source tests, native operation proof and accepted art are separate outcomes.

Initial upstream inventory: official catalog https://github.com/JannisX11/blockbench-plugins/blob/master/plugins.json (read 2026-09-10). Catalog descriptions are discovery evidence, not source-parity proof:

| Area / upstream candidate | Existing owner / evidence | Outstanding comparison |
| --- | --- | --- |
| Reference Models; Quick Box-UV Layout; Bone View; Simplify Models | project.ts reference bridge, cubes.ts, boxUvLayout.ts; elephant geometry/UV evidence | Reference bridge requires actual plugin; compare cube-preserving layout and pivot visualization; do not apply rounding destructively |
| Texture Stitcher; Plaster | texture.ts native template/repack and UV audit | Multi-atlas stitching is not proven by single-atlas repack; UV shrinking/bleeding corrections need texel-density and alpha tests |
| Colour Gradient Generator; native brush/copy/layers | paint.ts, texture color/alpha owners | Hue-shift palette generation and native brush behavior need actual parity fixtures; none guarantees finished pixel art |
| Animation Sliders; Bakery | animation.ts graph/batch/property/keyframe routes | Compare exact transforms and export baking; existing Molang edit support was unused in elephant |
| Animated Platforms; Scene Recorder | capture_model_views gives bounded pose samples; timeline has playback | Moving-ground contact review and continuous playable capture remain gaps in exposed tooling |
| Particle editor/native preview | particle.ts and bedrockParticleDocument owners | Existing create/patch/save/preview source and older native evidence; no particle feature was tested in elephant, no visual acceptance inferred |

Efficiency priorities from observed work: correct representative cohort before propagation; expressions for continuous secondary motion instead of dense sampled keys; use mutation receipts without confirmation reads; inspect compact diagnostics fields instead of printing every affected key UUID; discovery with texture diagnostics disabled; native painting operations only when their settings affect the chosen executor; one final source gate per coherent delivery. Measure request/response size and native operation counts separately from whole-session tokens.

**Elephant Texture rejection correction (2026-09-10):** User rejected faint/raw pixel art, scattered UV and opaque unused atlas; Geometry remains approved. First wrong owners: agent styling/layout judgement and missing capture shading contract. Source now forces Shading ON during canonical capture, restores state in finally and returns render_evidence (shading/brightness/view_mode, not in-game proof). Installed Blockbench app.asar sourcemap confirms settings.shading.value + Canvas.updateShading ownership. Three regression tests failed before the helper and pass afterward. verify:full PASS: 35 repository + 636 runtime + 158 authoring = 829 tests; both typechecks, freshness and build. Log mcp/.cache/texture-quality-full.log. New runtime identity d303b2c0ef2fd020093b28659027879edc70da673446a4b22a9020d095e791d1; not yet installed. Rules now require semantic UV zones, transparent unused pixels and readable pixel clusters; footprint ceilings increased only for this explicit guidance. Existing tools regrouped 39 elephant UV islands and repainted the rejected texture; native UV audit ready, no transparent mapped faces, no bounded seam candidates. Visual acceptance and measured token savings remain unproven; see asset README. No new framework/capability or source change to painting semantics.

**Native installation connection verified (2026-09-10):** After the user loaded `.blockit/plugin/blockit_mcp.js`, Gateway status returned Runtime ONLINE with matching build `sha256:8fe22f3e1b063498bb0b0a8297979283e981620ec3e0813c56488b0dc4b74227`, geometry phase, 49 exposed tools and zero open projects. Live describe_capability(list_textures) succeeded and exposes diagnostics default true, lightweight false, and explicit intra-Cube-only seam scope. This proves matching native startup and capability discovery, not native mutation, visual quality or token savings. New-model intake remains required.

**Installation relocation (latest, 2026-09-10):** User requested consolidation under BuildIT-refresh. Managed installer installed source `1e842557` under `.blockit`, plugin `.blockit/plugin/blockit_mcp.js`, authoring workspace `.blockit/authoring`, and redirected the BlockIT Codex entry. All 22 installed hashes match. All 52 former workspace files copied with hash verification; former workspace moved to `.blockit/previous-workspace` as preserved backup. AppData path was virtualized into the Codex package LocalCache; Codex restart confirmed both observed Gateway processes use the new `.blockit/versions/1e842557...` executable. Old installation is no longer used by a Gateway process. Automatic approval review rejected its removal with blocked by policy; no removal occurred. Runtime remains offline. Native connection remains unverified; load the new plugin normally. No source rebuild or old asset evaluation was performed.

### Complete rule-owner audit — source closure and managed package preparation

**Managed package INSTALLED; native connection unavailable (2026-09-10):** local source commit `1e842557b69b4095975b4a660eab2d570f612445`; ZIP SHA256 `4169fbfa4122287619d3724b5df9d0bd561f0c579113fe19cd4ec9ce8873c1ab`; Runtime identity `sha256:8fe22f3e1b063498bb0b0a8297979283e981620ec3e0813c56488b0dc4b74227`. Builder passed compiled platform/self-test, repeated isolated installation and installed compiled Gateway initialization. Log: `mcp/.cache/rule-audit-package.log`; artifact: `mcp/dist/managed/blockit-windows-x64.zip`. The installer accepted the new package without adoption/overwriting local edits and replaced the earlier pending candidate. After the normal application restart, installed.json matches `1e842557` and pending is false. All 20 managed non-config files match recorded hashes, including the plugin and four authoring skills; Codex config differs from its recorded hash and was preserved. Blockbench processes are running, but own no listening TCP port; Gateway is ready and reports Runtime offline at localhost:3000. A separate Roaming/Blockbench/plugins/blockit_mcp.js has a different hash; its presence does not establish which plugin is loaded. Next native step is normal Blockbench plugin loading from the managed path, then Gateway/build identity verification. No push/release or user-asset mutation. No native candidate execution or visual/usage acceptance is claimed yet. New-model intake is still missing.

2026-09-10 continuation explicitly authorizes finishing rules, installation and the later new-model evaluation. Review covered root/MCP routing, all eight repository skills, all twelve foundation standards, workspace conventions, Flow, runtime prompt and installed authoring boot. Reused the accepted executor audit; did not replay historical assets or rerun source investigation without a new question.

Corrected rule conflicts at their owners:
- Bounds inspection now consistently permits material envelope/scale/ground/displacement **or bounded surface/contact** questions, with fresh-state reuse.
- Approved-image requirements apply to reference-driven visual work; bounded nonvisual maintenance uses explicit intent/current state. Installed boot and router agree.
- Whole-form blockout uses the structural triad by default; bounded edits use affected views, and source-matched fidelity can justify a 3/4 view. No routine five-view capture was added.
- Original images govern reference preparation; the explicitly approved interpretation governs downstream visuals. Accepted stylization must not silently be reversed. Numeric dimensions retain independent authority.
- Production UV requires explicit Geometry APPROVED. Logical UV is 128 default/256 opt-in; integral physical texels, not integer logical coordinates, determine valid sampling.
- Evidence/View maps and claim IDs are conditional on material ambiguity. Known material identity/state is reused; new material creation does not require discovery of a nonexistent material.
- Group pivot routing uses modify_group(origin); controller blend-curve editing is no longer incorrectly labelled a protected gap. Resource-file wiring is explicitly conditional compatibility/integration work, outside normal visual-asset deliverables.
- Motion contracts ask only applicable facts. Stopped assets remain protected, but later explicit authorization permits a new intake. The runtime correction table reuses target state and reads only when missing/stale.
- Runtime-development proof terminology follows actual REMOTE_GITHUB/LIVE_BLOCKBENCH capability rather than product names.

Useful repetition was retained: actual-image/current-view evidence, numeric dimensions, user-selected strategy, stage approvals, UV readiness, contact/playback quality, bounded correction and final requested deliverables. No additional contradiction requiring edits was found in finalization or surface-pattern standards. No instruction shortening is claimed as measured token savings.

Three new cross-owner policy regressions failed before correction and now pass. Stale assertions locking the contradictory policies were corrected; duplicate bounds/UV assertions remain owned by the cross-owner suite. Small footprint-ceiling adjustments retain explicit safety/quality/applicability semantics instead of compressing them away. Final review also moved file-backed `manage_render_profile` out of normal preview routing into explicitly requested integration. Native preview/evidence does not require an RP file graph.

Canonical prompt manifest regenerated. **`verify:full` PASS: 826 tests (35 repository + 633 runtime + 158 authoring), both typechecks, freshness, surfaces and build**, Bun 1.3.14; 15 managed-install tests also PASS. Log: `mcp/.cache/rule-audit-full.log`. Runtime identity: `sha256:8fe22f3e1b063498bb0b0a8297979283e981620ec3e0813c56488b0dc4b74227`. The final preview-routing clarification is policy-only and receives the owning authoring check after this full gate. Dependency lock unchanged. Source/native proof from the previous section remains bounded to its recorded claims. Managed packaging requires a clean tracked source commit; activation is deferred by the installer while Blockbench/Gateway sessions are active, never forced by killing applications.

### Source-first capability audit and diagnostic repair — SOURCE_READY

2026-09-10 user request: finish source first, then evaluate a **new model**. Tiger is historical failure evidence only; do not replay it, copy it as a test, or resume prior visual fixtures. Future intake must establish the new reference, dimensions, user-selected Geometry Strategy and animation requirements. This scope supersedes older visual-test continuation below.

Audit authority: `D:/Work/AI Stuff/BuildIT-refresh`, branch `Local`, base `66bf0c541d85270f69ca6588e02eae9ddb578074`. Old BuildIT `Local` is `af4ecf5c7641b0b9ba122bf27d5e382cce6e9488`; its code baseline is shared `6b3779c` (the extra old-local commit contains workspace assets). No branch/ref movement, deployment or asset mutation was performed. Gateway status/description established a live connection to the older `e3cadd6a...` runtime, 49 AUTHORING capabilities; installed manifest still identifies `0a36d05e`, pending package `409843cd`. That connection is not proof of this candidate's execution.

**Confirmed and repaired:** omitted/false Animation diagnostics previously performed four keyframe reads on a two-key track; Group creation accepted an empty batch; locator guidance referenced disabled `inspect_element`; four Animation contracts diverged after full Runtime registration (create, inspect, timeline, controller). Canonical ToolSpecs now own final metadata, including native/property/resource branches. Removed redundant metadata overrides and the Animation wiring test that depended on their source spelling; an isolated full-registration metadata test now checks the actual definitions.

**Explicit contract changes:** `list_textures(diagnostics=false)` returns inventory without UV/pixel diagnostics; omitted/true retains the full audit. Metadata-only production alignment remains available. Animation diagnostic enrichments require `diagnostics=true`. Seam results now state `scope=intra_cube` and `cross_cube_continuity=not_evaluated`; matching still uses Cube identity, so local coordinates from unrelated Cubes are not incorrectly paired. These diagnostics do not judge reference fidelity, attractive texture styling, contact, weight or playback quality.

Five targeted regressions were observed red before their fixes: optional Animation, optional Texture, metadata parity, empty Group batch, and explicit seam scope. Subsequent targeted execution passed. `optional-diagnostics-runtime.test.ts` exercises production enrichment wrappers over isolated native-state/core-receipt fixtures, then separately invokes the fully registered texture executor with geometry/pixel access configured to throw. This distinguishes enrichment savings from an end-to-end native measurement.

Measured fixture evidence (UTF-8 JSON bytes, not tokens): Animation omitted/false now performs **0** diagnostic reads and returns **106 bytes**, versus **4 reads / 2300 bytes** with diagnostics true. Texture false now performs **0** pixel reads and returns **66 bytes** in the isolated core-receipt fixture, versus **5 reads / 4049 bytes** with the opaque full audit. A subsequent full call rereads changed pixels (5 reads, transparent coverage updated). Actual full inventory receipts are larger than that fixture's stub receipt. No whole-authoring savings or visual improvement is claimed. Instruction footprint ceilings grew only for the required diagnostic routing/scope text; they remain guardrails, not success metrics.

#### Callable source coverage and native residue

The source audit enumerated all **56 enabled Runtime capabilities**, their discriminated operation paths, Gateway projection/validation, executor owners, result/state handling and available tests. Source review and mock/planner tests are distinguished below from native execution; not every native branch has executable coverage. Disabled compatibility aliases are not missing active tools.

| Capability family and branches reviewed | Source/test evidence | Remaining native proof |
| --- | --- | --- |
| `create_project`, `get_project_info`, `inspect_model_bounds`, `manage_geometry_reference` load/update/remove, `materialize_3d_assisted_scaffold` | Project/reference schemas; gate/hash/dimension preflight, bounds/hierarchy helpers; project semantics, reference and affinity suites | Native tab/discard behavior, GLB loading/materialization, reference fidelity; GPU strategy remains deferred |
| `manage_cubes` create/update/batch_update; `add_group` single/batch; `modify_group`, `remove_element`, `duplicate_element`, `rename_element`, `reparent_element` | Finite-span/identity/collision preflight, ordered hierarchy mutation and compact receipts; geometry preflight/identity/inspection suites | Native transforms, property preservation and Undo/Redo across each operation |
| `inspect_elements` outline/search/detail; `get_selection`, `select_all_of_type`; `bone_rigging` create/parent/unparent/delete/rename/set_pivot/set_ik/mirror; `list_locator_elements`, `manage_locator`, `manage_null_object` create/update | Consolidated schema dispatch, explicit target resolution, empty-update and exported-key guards; locator/rig/identity tests | Native IK/mirror/pivot semantics and exported attachment state |
| `create_texture` blank/template/import/variant; `activate_texture`, `add_texture_group`, `get_texture`, `list_textures` | UV/physical-texel/revision/inventory guards and rollback wiring; atlas, frame mapping, revision and optional-diagnostics tests | Native template/UI behavior, image decoding and texture activation/reopen |
| `paint_fill_tool`, `draw_shape_tool`, `gradient_tool`, `color_picker_tool`, `copy_brush_tool`, `eraser_tool`, `paint_with_brush`, `paint_settings`, `create_brush_preset`, `load_brush_preset`; `texture_selection`, `texture_layer_management`; `paint_texture_transaction` | Painter dispatch, selection/layer branches; transaction revision/clip/operations preflight and receipt; transaction, paint, layer/alpha tests | Full native brush/selection/layer action matrix; transaction intentionally rejects layered targets |
| `manage_material` create/configure/assign/save; `list_materials`, `get_material_info`, `import_texture_set`; `manage_material_instances` list/get/set/bulk/clear; `manage_render_profile` inspect/bind/assign/unassign/set_slot | Shared membership/binding plans, explicit material/texture identity, conflict/no-op validation, production receipts; PBR/material/render tests | Native shading, renderer alpha/emissive appearance, texture-set import and persistence |
| `create_animation`, `inspect_animation`; `manage_animation_timeline` keyframes/graph/timeline/batch/copy_paste/properties; `manage_animation_effects` add/update/remove | Explicit clip identity, keyframe/motion planners, focused filters and preview restoration; Animation mutation/native/effect/optional-diagnostics tests | Native interpolation, playback, contact/foot sliding/weight and Undo |
| `manage_animation_controller` state/transition/link/effect/script operations, native nested-link/blend curves, resource_operations; `inspect_particle`, `manage_particle` create/patch/save/preview | Controller cycle/planner/schema guards, document/revision-checked operations and separate preview result; controller/resource/particle tests | Every native controller mutation branch, actual transitions/effects and renderer output |
| `capture_model_views` named views/framing/Animation samples; `undo`, `redo`, `get_undo_stack`; `export_model` bedrock/project and content/filesystem | Finite framing and temporary-preview restoration helpers; history receipts, path/overwrite/transient-reference guards; camera/export/preview tests | Actual image fidelity, native recovery and save/reopen/export correctness |
| Gateway `status`, `search_capabilities`, `describe_capability`, `invoke_capability`; Runtime `switch_authoring_phase` | Catalog/phase union, SDK schema validation/projection, exclusive queue and project affinity; Gateway/affinity/SDK boundary tests | Installed candidate identity, real multi-client isolation/restart/handoff and native long-running calls |

No evidence justified a wrapper/framework rewrite or capability deletion. Full-registration tests discovered the fourth metadata mismatch that the earlier partial import did not expose. The next visual trial must record whole-task input/cached-input/output token counters, including discovery, boot, corrections and recovery. Missing telemetry is UNKNOWN; a rejected outcome cannot establish Cost to Accepted Result improvement.

Final verification: **`bun run verify:full` PASS**, **823 tests (35 repository + 633 runtime + 155 authoring), 0 failures**, both typechecks, canonical docs/prompt freshness, default/phase surface checks and build under bundled Bun **1.3.14**. Log: `mcp/.cache/source-audit-full.log`; build identity: `sha256:7c4d72ba008e2f30a557616162533bc991ee40d130e034477bc2dc15b2bd82a8`. This is working-tree proof based on the pinned SHA above, not committed-SHA CI proof. Dependencies and lockfile are unchanged. Earlier full-gate attempts exposed stale prose/duplicate footprint assertions and a metadata search regression; those were corrected at their owners. Established runtime descriptions are now preserved in canonical ToolSpecs and discovery assertions pass without lowered thresholds. Supplemental source review found no further actionable change.

Tiger checkpoint SHA256 remains `20cb00616e375daa5c99acab9457a63d935ff656c13140595b6a66ea81796210`. No assets, live project state, installed package or pending package were changed. Asset quality, deployment, native candidate operation and whole-task token savings remain unverified. Source closure is complete; new-model intake and matching managed installation precede later visual evaluation.

### Refresh quality/efficiency delivery — verified package STAGED, not active

Managed package source `409843cd4384975581f7f34cf46d1d460223d249`; ZIP SHA256 `013713148edcd390712c7eec9459a5642df74d9ff1ddf729c0dd6a324b620bd4`. Compiled installer/platform, repeated isolated installation and compiled Gateway initialization passed in the package builder. Production install returned STAGED because Blockbench/current MCP sessions are active. Read-only pending manifest confirms candidate SHA/build identity; installed.json still names `0a36d05e`. Activation and connected-runtime/installed-skill verification remain pending. Do not claim installation complete or run authoring fixtures. Close applications normally after saving, activate through managed update, then verify identity/connection only.

2026-09-10: user authorized source cleanup and managed installation, explicitly without new visual fixtures. Candidate based on `bf1b7454`: `verify:closure` and final `verify:full` PASS, **818 tests (35 repository + 628 runtime + 155 authoring)**, both typechecks, generated freshness, surface checks and build. Bun 1.3.14 / frozen lockfile unchanged. Logs: `mcp/.cache/refresh-closure.log`, `mcp/.cache/refresh-full.log`. Build identity: `sha256:083fc223dd77dd4039751deee0d07b8d587c5f788d2d49f5780a32c16d50c311`.

Restored coherent volume-before-coordinates, shared mass boundaries and landmark proportions; Texture now explicitly directs stepped value/hue ramps, contact shadows, highlights and surface continuity. Coordinate formulas execute observed design. Existing instruction ceilings were retained by removing redundant phrasing; artist decisions remain with specialists, not new runtime gates.

Runtime pixel caching is invocation-local and keyed by texture UUID plus physical rectangle. Deterministic shared-region regression: three 16x16 face mappings previously read 3 times/768 pixels, now 1 read/256 pixels, with all 3 face identities retained. This is 66.7% fewer pixel reads for that input, not token or whole-authoring savings. A later invocation rereads changed pixels. Separate atlases consume separate budget; flipped identical regions reuse data; invalid/out-of-bounds mappings remain omissions. The 32,768-pixel cap counts unique successfully read regions; `pixel_budget_basis=unique_texture_regions` and `pixel_budget_used` expose its meaning. Regressions were red before the cache and green after it (`region-cache-red.log`, `region-cache-green.log`).

The diagnostic result-key migration `coverage.states.styled` → `varied`, empty-scan rejection, flat-face examples and Animation evaluated/skipped counts from the prior candidate are included. No input authoring API or Gateway tool added. No asset changed; native installation/connection remains a separate status below, never inferred from this build. Visual quality and token savings remain unproven.

### MCP diagnostic/workflow repair — source accepted, visual testing stopped

2026-09-10 user scope supersedes prior fixture acceptance: no more asset tests or replacement fixtures. Face/neck output is USER_REJECTED; historical Geometry approval does not accept its Texture. Models remain frozen.

Candidate based on `bf1b7454c4d0183dc6955329d0f758960ffbe7d5`: `verify:closure` and `verify:full` PASS with Bun 1.3.14, frozen lockfile unchanged. **816 tests: 35 repository + 626 runtime + 155 authoring**, generated freshness, both typechecks, Gateway/surface checks and build. Logs: `mcp/.cache/quality-mcp-closure.log`, `mcp/.cache/quality-mcp-full.log`. Runtime build identity: `sha256:d46dd650100342c7739c2337243251f7a170cca27a59d56e5a74f10830ac926d`. New targeted tests failed before implementation and passed after it.

Audit and changes:
- Texture: empty coverage incorrectly returned ready; now incomplete/NO_MAPPED_FACES. Solid-face review now returns bounded named examples and pixel measurements, using the existing scan. `coverage.states.styled` is renamed `varied`: this is a client-visible result-key migration, not an artistic classifier. Visual verdict is explicitly not_evaluated even for varied pixels.
- Animation: numeric endpoint evaluation now reports evaluated and insufficient-key counts separately from non-numeric boundaries; zero seam flags cannot masquerade as evaluated expressions/playback. No math-expression evaluator or contact score added.
- Geometry/UV/visual feedback: existing bounded-risk summaries already report omitted/incomplete diagnostics and no visual verdict; bottom/side capture exists. No renderer or geometry mutation bug was reproduced. Corrected contradictory runtime restrictions on surface inspection and approved atlas dimensions instead of inventing new tools.
- Workflow: preserved shading during corrective painting, diagnosis of paint versus missing surface, and refusal to submit known major defects despite prior approval. Runtime prompt, specialist/router, flow and runbook agree; generated metadata rebuilt. Brittle prose assertions adjusted without weakening runtime tests or increasing footprint ceilings.
- Gateway, identities, transport, history, exports and managed installation: retained implementations covered by the full regression suite, not a claim that every live operation was manually audited or exercised.

No native authoring, visual acceptance, efficiency gain or deployment is claimed. Installed package remains `0a36d05e`; the new bundle is built under `mcp/dist/`. This source result satisfies the revised code-validation scope; do not reactivate visual fixtures automatically.

### Prior quality workflow repair — historical technical proof

Native continuation (2026-09-10): managed package `0a36d05ee031ab9a3e61ea27bae22dc0f2714f0f` activated; no pending update. Gateway observed the matching `e3cadd6a...` runtime identity below, geometry phase and 49 capabilities. `verify-uv-density-live.ts --confirm-disposable` and `--verify-reopen` both PASS on an independent project: physical 256x256/logical 128x128, four fractional-logical faces, native template, exact Undo/Redo mapping and native app close/open retention. Receipt: ignored `mcp/.cache/uv-density-live/receipt.json`. Direct MCP cost: 16 calls/43,663 ms, then 2 read calls/290 ms; UI/startup/wait cost and tokens are not included. These are technical fixture results, not accepted visual quality. Independent `quality-face-contact` is saved in the installed workspace with Geometry user review pending; no Texture/limb-cycle acceptance yet.

User stopped and rejected `tiger-direct-tools-test` (2/10). Its installed-workspace README/report now preserve rejection, historical approvals, the actual three saved animations and the partial 77-call boundary. The .bbmodel remains unchanged (SHA256 `20cb00616e375daa5c99acab9457a63d935ff656c13140595b6a66ea81796210`). No visual acceptance or efficiency gain is claimed.

The new executable UV regression failed before the fix: 256 physical pixels / 128 logical UV with half-unit coordinates was incorrectly blocked. Audit and coverage now check physical texels; fractional logical UV remains diagnostic. Invalid/out-of-bounds/collapsed UV and genuinely non-integral physical mapping remain blocked. Template errors now retain failed gate reasons and the existing rollback boundary. This proves the validator defect, not the sole cause of the historical native generator failures.

Local `bun run verify:full` passed on the candidate built from `871e44f91a7d1a911c07174318af7c41c818eb95` with this repair: **812 tests (35 repository + 623 runtime + 154 authoring)**, docs/prompt freshness, typechecks, surface checks and build under pinned Bun 1.3.14; frozen-lockfile install changed no dependencies. Evidence: ignored `mcp/.cache/quality-workflow-verify.log`. Built runtime identity: `sha256:e3cadd6a7cdd36c68d0a701dbb7ffe89f825a1f1f462753fe3e96d2ae297294c`. This is local working-change proof, not a GitHub CI run or installed runtime acceptance.

Closure: four authoring skills + flow + runtime prompt updated; generated prompt manifest/API docs regenerated. Gateway phase/approval payloads, foundation rules and CI routing verified unchanged. Static footprint caps were adjusted for explicit review procedures; duplicate size assertions removed, behavioral/semantic checks retained. `verify-uv-density-live.ts` prepares native template/Undo/Redo/save/reopen evidence in a separate disposable project. Native UV execution and managed activation are now covered above. Face/contact user review, mapped texture and three-loop limb acceptance remain pending; do not resume the rejected tiger.

Repository: `halokaryamedia-source/BuildIT`  
Branch: **`Local` only**.

Per `GITHUB_RULES.md`, device-independent composite acceptance requires Repository Verify + MCP Verify on the same exact `Local` SHA. Exact-SHA source/CI proof below is reusable only within its stated proof ceiling and does not establish `LOCAL_CODE` or `LIVE_BLOCKBENCH` claims. Documentation-only commits after the accepted SHA do not upgrade or invalidate that executable proof.

### Current LOCAL_CODE candidate

Working checkout: `D:/Work/AI Stuff/BuildIT-refresh`, based on `adcb0d64f8450810cb24ffa425a8f9713ee6564f`.
Bun 1.3.14; SDK 1.30.0. Initial `verify:closure` PASS; final `verify:full` PASS locally on the complete native-fix/harness candidate: 35 repository, 621 runtime, 153 authoring tests; generated freshness, both typechecks, loopback surface checks, and build PASS. Final gate log: `mcp/.verify-native-final.log`.
Source surface: 56 callable / 49 AUTHORING / 20 Animation; four Gateway tools; 68 documented source ToolSpecs and 10 resources.
SDK-boundary regression proves 33 valid keyframes, strict invalid-input rejection, selected-branch required/nested structure and Animation/Particle ToolSpec parity.
Installed package: `f1dcb77e8db800b4307feedba199fe8fff37b720`; ZIP SHA256 `531a18acf1e0aff2484584b32fbfad41679c044f7d8a38e5a18d32fdad5fcf8b`. Runtime identity: `sha256:dff7fc084d883922754d1d7470feac31c339176641d37cdd131d0c50384bbb01`. Host plugin: `%LOCALAPPDATA%/BlockIT/plugin/blockit_mcp.js`; workspace: `%USERPROFILE%/BlockIT-Workspace`. User removed the old native plugin.
Native PASS: Geometry mutation/Undo/Redo/thin per-face UV; shared AUTHORING Texturing alpha/repack/clipping/target isolation/history; installed compiled four-tool Gateway and Animation handoff; explicit animation targeting/playback/history; Particle create/patch/save/preview; verified .bbmodel save, native close/reopen and state comparison.
Live findings fixed: exact-pixel writes now clear only destination pixels before RGBA fill; native Windows realpath resolves MSIX logical/physical installation aliases. Harness fixtures avoid premultiplied-alpha RGB rounding, seed an opaque outside-clip sentinel and send explicit phase-affinity headers. Native test consent is disposable-fixture authorization, not asset visual approval.
Managed PASS: compiled repeated install, active-Gateway staging/activation, recovery and initial-install rollback in disposable paths; actual active-Runtime staging `477061`→`76a572d9`; installed `f1dcb77e` rollback to `76a572d9`, native startup, then restoration of `f1dcb77e`. The latter two packages intentionally share the same Runtime identity; their manager source SHAs differ. Wrapper status is healthy and no pending update remains. User checkpoint SHA256 remained `bf334a6859e0ed105bf42dde676c5b5c9a66427644b1c973b13f35a79ae374d1`.
Evidence logs are local ignored `mcp/.geometry-live-final.log`, `.texturing-live-final.log`, `.gateway-native.log`, `.animation-live.log`, `.particle-live.log`, `.persistence-prepare.log`, `.persistence-verify.log`, `.package-path-fix.log`. Source-only harness edits after the package SHA do not change installed executable identity.
Fresh Codex session PASS (2026-09-09): app-bundled Codex CLI 0.153.4, configured model, ephemeral read-only sessions rooted at `C:/Users/Administrator/BlockIT-Workspace`. Initial context automatically supplied installed AGENTS instructions and all four managed skill catalog entries; the router and Geometry specialist were then read from their installed paths. Actual configured MCP calls exposed the four Gateway tools. `describe_capability(manage_cubes)` followed by `status` established `mcp_client_ready=true`, catalog_count=49, matching connected/runtime signatures and the installed build identity above, with no last error. No asset mutation was needed. Evidence: ignored `mcp/.fresh-codex-current.log`, `.fresh-codex-catalog.log` and `.cache/fresh-codex-last.json`, `.cache/fresh-codex-catalog.json`. This proves fresh CLI-session integration, not an observed new desktop chat. The older npm CLI 0.137.0 could not use the configured model; the app-bundled CLI completed acceptance without changing model or user configuration.
All technical acceptance in the current continuation scope is complete. Technical acceptance does not establish visual quality, user asset approval, Minecraft execution or usage savings.

### Prior REMOTE_GITHUB hardening — historical accepted baseline

The earlier executable/source closure was accepted at exact `Local` SHA `9be8d7e00a78ea7383d70c3988902fff62bdd360`.

GitHub **Repository Verify** run `34346382752` completed successfully for that SHA.

GitHub **MCP Verify** run `34346382820` completed successfully for the same SHA and executed the canonical MCP gate: generated docs/prompt freshness, TypeScript + Gateway typecheck, Runtime tests, authoring tests, source/phase surface measurements, build/provenance generation, and verified bundle upload.

That remote baseline had:

```text
Gateway client surface   4 fixed tools
Runtime callable union   54 tools
AUTHORING surface        49 tools
Animation surface        18 tools
```

Pre-local closure now additionally protects:

- every enabled default capability has one registration family, an executable Runtime definition, and at least one semantic phase surface;
- current Runtime augmentation fields remain attached to their canonical capabilities rather than becoming parallel tools;
- `paint_texture_transaction` is the only explicitly bounded enabled Runtime capability still outside the current generated ToolSpec manifest;
- Particle production exposure is fail-closed as an all-or-nothing contract across Runtime registration, enablement, Animation exposure, generated ToolSpec ownership, and `particle-reference` registration;
- the future public Particle path is asset-only: create/patch/save/native preview remain in `manage_particle`, while client-entity/gameplay binding is downstream integration owned by existing animation/controller infrastructure;
- the live Particle harness is source-prepared around create/patch/save/preview + readback rather than client-entity mutation;
- the four semantic authoring skills read by executable MCP contract tests are explicit `MCP Verify` trigger dependencies, with repository regression protecting that coverage;
- routed phase-scoped tool discovery remains the intended fallback model; the existing discovery evaluation stays inside `test:runtime`, avoiding a duplicate verification pass.

The discovery proxy on this closure reports routed phase-scoped Top-3 and Top-8 recall of **1.0**; Animation Top-1 is **1.0**. These are static/spec-loading proxies, not installed Astra/Codex usage proof.

Verified artifact from MCP Verify:

- name: `blockit-mcp-verified`;
- artifact ID: `10101875068`;
- artifact ZIP digest: `sha256:feb8f4f77525d85a0351da700ce3f210a3d5ec266742e8736e8946e7ef02411a`.

This is **SOURCE/CI/build-artifact proof only**. It does not prove installed Blockbench behavior, native Undo/playback/persistence, visual fidelity, GPU inference quality, or actual Astra/Codex allowance reduction.

Remaining source work is intentionally narrow and belongs to `LOCAL_CODE`: Particle production exposure plus its generator-coupled public-contract/docs closure, current generated ToolSpec alignment (including `paint_texture_transaction` and any import-safe Runtime augmentation parity needed by the generator), then the separate MCP SDK dependency closure. `next-action.md` owns the exact continuation.

No additional speculative Runtime framework or routing layer is justified by the final remote sweep. The accepted closure keeps the established four-tool Gateway and bounded semantic specialist routing.

## Live Acceptance Harness — SOURCE_READY / LIVE NOT_RUN

The GitHub-prepared harness moves test design, fixtures, assertions and evidence capture out of the later desktop session. The product target is generic BlockIT MCP/authoring behavior; any named model is only test media unless a task explicitly targets that asset.

### Shared preflight

`mcp/scripts/live-e2e-common.ts` requires:
- exact built-vs-live `build_identity`;
- expected authoring phase and required live `tools/list` surface;
- stateless JSON transport;
- explicit `--confirm-disposable`;
- observable HTTP/RPC/tool/cost counters. These byte counts are transport measurements, not model-token counts.

### Geometry + UV representation

`verify:geometry-live` now uses the current consolidated `manage_cubes` + `inspect_elements` surface. It creates one disposable body, proves readback/render/update/Undo/Redo, and creates a generic thin fixture `1 x 4 x 0.5` with explicit `per_face` UV. The thin fixture must keep exact geometry size and non-degenerate per-face UV; no geometry thickening is allowed merely to silence UV warnings.

### Texturing / native repack / Painter

`verify:texturing-live` continues the **same shared AUTHORING session**; there is no Geometry→Texturing phase bounce. It is scripted to prove:

- native template at 16x;
- padded native in-place repack with same texture UUID;
- semantic RGBA pixel preservation across repack;
- thin per-face fixture survives template/repack/Undo/Redo without geometry thickening or meaningful-face collapse;
- explicit target mutation while a decoy texture is selected;
- size-2 request uses native Painter, not the size-1 exact-pixel shortcut;
- bounded `draw_shape_tool` does not bleed outside its reported clip;
- atlas + UV state restore exactly through Undo/Redo;
- final UV production gate remains ready.

These are native-behavior acceptance assertions; they are not texture visual-fidelity claims.

### Animation

`verify:animation-live` prepares two animations so B is selected while operations explicitly target A. It is scripted to prove:

- persistent Animation-A property edit does not mutate/select B;
- targeted set-time/play/pause/stop acts on A;
- targeted A keyframe edit leaves B unchanged;
- property and keyframe Undo/Redo restore exact expected state.

This closes the manual-selection workaround at the test level once the live run passes; motion aesthetics remain separate.

### Particle

`verify:particle-live` is already source-prepared but must not run until the LOCAL_CODE Particle public exposure/generator closure is complete and the exact deployed Runtime advertises both `inspect_particle` and `manage_particle` on the Animation surface. Its prepared success path is create/patch/save/native preview + readback; it does not author client-entity integration.

### Native persistence

`verify:persistence-live` is intentionally two-step rather than inventing an open-project fallback.

1. `--prepare`: snapshot body, thin per-face UV, texture/UV gate and both animation states; export a verified disposable `.bbmodel`; hash artifact + write manifest.
2. One manual Blockbench close/reopen of that exact file.
3. `--verify`: require matching build, artifact hash, native `save_path` and exact authored snapshot.

Until step 3 succeeds, native reopen remains UNVERIFIED.

### Representative visual-quality fixture — current example: LIFT

LIFT is **only a representative fixture** for validating the visual-quality/evidence workflow and historical issue closure. It is not a product target and must not create LIFT-specific MCP Runtime, tool schema, routing, packing law, geometry rule, or authoring policy.

`verify:lift-quality-live` remains a bounded **fixture-specific evidence candidate**, not a visual scorer and not a generic MCP acceptance prerequisite.

- requires `BLOCKIT_LIFT_DISPOSABLE_PATH` and rejects canonical `workspace/active/lift/lift.bbmodel`;
- hashes `references/approved-reference.png` and `references/window-detail.png`;
- captures before front/left/front-left-3Q + atlas;
- performs one native 16x, padded, power-of-two in-place repack candidate on the disposable copy;
- records candidate bitmap size and whether native result is `<=512`;
- captures candidate views + atlas;
- Undo must restore the exact original atlas hash and UV packing/gate;
- writes a manifest under `.cache/lift-quality-live/`;
- emits `visual_quality: UNVERIFIED`.

A `<=512` result is only a packing candidate. It cannot become visual PASS without the actual reference plus fresh mapped visual evidence.

## Historical LIFT Issue Mapping — fixture evidence only

`workspace/active/lift/README.md` remains the asset owner. Geometry, UV Layout, Texture and Animation are approved/delivered; any quality-system testing uses a disposable copy. The table below preserves traceability for the historical test report; it is **not** the generic MCP roadmap or acceptance checklist.

| ID | GitHub-prepared closure | Remaining proof |
|---|---|---|
| LIFT-01 | Reference-grounded workflow + representative before/candidate comparable capture are scripted | actual-reference visual review on the fixture |
| LIFT-02 | Better/HD intake rule source-protected | no source defect remains |
| LIFT-03 | palette/ramp + adjoining-surface discipline protected; fixture capture bundle prepared | live visual color/form/shadow review on the fixture |
| LIFT-04 | surface-continuity/seam discipline protected; same evidence bundle prepared | live visual seam review on the fixture |
| LIFT-05 | union/bounds metrics + native padded-repack candidate harness prepared | run representative candidate; `<=512` alone is not visual PASS |
| LIFT-06 | generic thin sub-unit per-face fixture scripted through native template/repack/history/persistence | live generic run |
| LIFT-07 | explicit A-vs-selected-B + playback/property/keyframe history harness prepared | live generic run |
| LIFT-08 | proof vocabulary remains fail-closed | visual gate stays mandatory |
| LIFT-09 | every live harness emits comparable execution-cost counters | comparable-fixture Cost to Accepted Result after quality PASS |
| LIFT-10 | proof/continuation route to executable test commands | keep future status in canonical owners |

No additional speculative Runtime logic is justified unless a generic live verifier or representative fixture reproduces a concrete MCP/source defect.

## SDK Security Follow-up

Current `mcp/bun.lock` resolves `@modelcontextprotocol/sdk` **1.25.3**. `GHSA-345p-7cg4-v4c7` / `CVE-2026-25536` is patched in 1.26.0.

BlockIT currently uses request-owned server/transport objects and has exact-SHA CI regression for concurrent same-ID request isolation. That mitigation evidence does **not** make the dependency version patched.

Dependency closure remains `LOCAL_CODE`: upgrade within a compatible maintained patched **v1.x** line, regenerate canonical `bun.lock` with pinned Bun, then run the owning source verifier. Do not hand-edit the lockfile, migrate protocol major version as part of this security fix, or use Actions as an authoring path.

## Pending Local / Live Sequence

Local source closure should remain ordered and diagnostic:

```text
Particle + generated public-contract closure
→ bun run verify:full
→ SDK v1.x security upgrade + bun.lock regeneration
→ bun run verify:full
→ exact build/deploy
```

After that, the generic MCP/native acceptance sequence is:

```text
shared AUTHORING
→ verify:geometry-live
→ verify:texturing-live
→ one real AUTHORING→Animation handoff/reconnect
→ verify:animation-live
→ verify:particle-live
→ verify:persistence-live --prepare
→ one native close/reopen
→ verify:persistence-live --verify
```

Only when validating the visual-quality/efficiency workflow or the historical LIFT issue report, append the representative-fixture step:

```text
disposable LIFT fixture → verify:lift-quality-live
→ human/multimodal strict visual review
→ only then comparable-fixture efficiency analysis
```

This intentionally removes redundant Geometry↔Texturing reloads and manual test design while keeping fixture-specific evidence outside generic product semantics.

## Visual / Reference Proof Rule

A visual/reference `PASS` requires the **actual approved reference image** plus **fresh evidence** from the current model/revision at a comparable view/scale. Tool success, source/CI success, hashes, coordinates, export, scalar metrics, UV occupancy, native repack success, or a clean structural diagnostic cannot create visual PASS by themselves.

If corresponding live evidence is unavailable, report `UNVERIFIED` or `LOCAL PROOF REQUIRED`.

## Authoring Efficiency

**Authoring Efficiency** means **Cost to Accepted Result**. Static Footprint, raw call count and transport bytes are guardrails only. Efficiency improves only when accepted quality is preserved while avoidable discovery, readback, phase bouncing, retries, recovery or correction cost decreases on a comparable fixture.

## 3D-Assisted Proof Boundary

AUTHORING TAXONOMY remains user-selected `DIRECT | 3D_ASSISTED`. 3D_ASSISTED source/orchestration and environment preparation remain `SOURCE_READY`; GPU inference quality, installed materializer identity, native materializer Undo/stale-state behavior and end-to-end asset quality remain deferred unless explicitly resumed. Source/static/CI proof never upgrades those live claims.

## Historical Generic Quality-First Closure

The generic quality-first authoring contract was source/static accepted at exact `Local` SHA `8e2a54f3016f744e3cd1bedef27379bdb07c3885` with Authoring Policy Verify run `34119139741`. It remains historical proof beneath the current pre-local closure, not the active continuation baseline.

The detailed 2026-09-07 multi-model DIRECT usage audit remains historical evidence only: `Experimental/authoring-usage-audit-2026-09-07.md`. Each defect must be reproduced against current source before it is treated as current.

Package delivery: source 506b79ea8a6e0152ac5b443ca60ae7fb86c5ef0e; ZIP SHA256 e5ae98430faa523a802084775f6c8ae5c4205a435a5d8831c1b7ec6696b23a2e. Compiled package smoke PASS; native_blockbench NOT_RUN. Existing .blockit installer returned STAGED because Runtime/Gateway are active. Model saved before staging. Close Blockbench normally, restart Codex while Blockbench remains closed, then reopen Blockbench; verify matching d303b2c0 build and shaded capture metadata. No file-path migration or new plugin copy required. Post-document targeted continuity checks: 10 PASS.

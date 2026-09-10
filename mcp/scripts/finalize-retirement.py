from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]

def text(path):
    return (ROOT / path).read_text()

def write(path, value):
    (ROOT / path).write_text(value)

def replace(path, old, new, *, required=True):
    s = text(path)
    if old not in s:
        if required:
            raise SystemExit(f"expected text not found in {path}: {old[:80]!r}")
        return
    write(path, s.replace(old, new))

# Production source retirement.
replace('mcp/server/tools/camera.ts', 'import { hasVisibleLoadedBlockItThreeDAssistedReference } from "./project";\n', '', required=False)
replace('mcp/server/tools/camera.ts', 'Model framing requires visible Cubes; explicit framing can also capture a loaded visible 3D-Assisted Evidence reference before blockout.', 'Model and explicit framing require visible Cube geometry in the current Blockbench project.', required=False)
s = text('mcp/server/tools/camera.ts')
s = re.sub(r'''      \} else if \(\n        observed\.rendered_cube_count === 0 &&\n        !hasVisibleLoadedBlockItThreeDAssistedReference\(\)\n      \) \{\n        throw new Error\(\n          "Explicit framing requires visible Cube geometry or a loaded visible BlockIT 3D-Assisted Evidence reference\."\n        \);\n      \}\n''', '      } else if (observed.rendered_cube_count === 0) {\n        throw new Error("Explicit framing requires visible Cube geometry to capture.");\n      }\n', s)
write('mcp/server/tools/camera.ts', s)

s = text('mcp/server/tools/element.ts')
s = s.replace('import { materializeThreeDAssistedScaffoldFromWorkspace } from "@/server/threeDAssistedMaterializer";\n', '')
s = re.sub(r'\nexport const materializeThreeDAssistedParameters = z\.object\(\{.*?\n\};\n', '\n', s, flags=re.S)
s = s.replace('  materializeThreeDAssistedTool,\n', '')
s = re.sub(r'  createTool\(materializeThreeDAssistedTool\.name, \{.*?\n  \}, materializeThreeDAssistedTool\.status\);\n', '', s, flags=re.S)
write('mcp/server/tools/element.ts', s)

s = text('mcp/server/tools/project.ts')
s = s.replace('import { STATUS_EXPERIMENTAL, STATUS_STABLE } from "@/lib/constants";', 'import { STATUS_STABLE } from "@/lib/constants";')
s = s.replace('import { isAbsoluteFilesystemPath } from "@/lib/util";\n', '')
s = re.sub(r'\n// Compatibility-only schema retained until the next LOCAL_CODE docs generation\..*?\nexport const createProjectParameters', '\nexport const createProjectParameters', s, flags=re.S)
s = re.sub(r'\nexport const manageGeometryReferenceParameters = z\n  \.object\(\{.*?\n  \}\);\n', '\n', s, flags=re.S)
s = re.sub(r'\n  \{\n    name: "manage_geometry_reference",.*?\n    status: STATUS_EXPERIMENTAL,\n  \},', '', s, flags=re.S)
s = re.sub(r'\n  // Retained only as a generated-doc compatibility descriptor.*?\n  \}, projectToolDocs\[3\]\.status\);', '', s, flags=re.S)
write('mcp/server/tools/project.ts', s)

s = text('mcp/server/resources.ts')
s = re.sub(r'import \{\n  isBlockItThreeDAssistedReference,.*?\n\} from "@/server/tools/project";\n', '', s, flags=re.S)
s = re.sub(r'\nfunction normalizeHalfTurn\(yaw: unknown\):.*?\n\}\n\n/\*\*\n \* Conditionally registers', '\n/**\n * Conditionally registers', s, flags=re.S)
s = re.sub(r'''      // Helper to extract reference model info\. Tool-owned 3D-Assisted Evidence references.*?      \};\n''', '''      const getReferenceModelInfo = (model: OutlinerElement) => {\n        const refModel = model as OutlinerElement & { path?: string; origin?: unknown; rotation?: unknown; scale?: unknown; visibility?: boolean; wireframe?: boolean; locked?: boolean; export?: boolean; mesh?: { children?: unknown[] } };\n        return { uuid: refModel.uuid, name: refModel.name, path: refModel.path || null, origin: normalizeVec3(refModel.origin, [0, 0, 0]), rotation: normalizeVec3(refModel.rotation, [0, 0, 0]), scale: normalizeVec3(refModel.scale, [1, 1, 1]), visibility: refModel.visibility ?? true, wireframe: refModel.wireframe ?? false, locked: refModel.locked ?? false, export: refModel.export !== false, loaded: Boolean(refModel.mesh?.children?.length) };\n      };\n''', s, flags=re.S)
write('mcp/server/resources.ts', s)

s = text('mcp/server/tools/quality-intelligence.ts')
s = s.replace('  analyzeProjectedEnvelopeFidelity,\n', '')
s = re.sub(r'import \{\n  listBlockItThreeDAssistedReferences,\n  readThreeDAssistedReferenceEvidence,\n\} from "\./project";\n', '', s)
s = re.sub(r'\nfunction referenceEnvelopeFidelityRuntime\(.*?\n\}\n\nfunction textureColorProfileRuntime', '\nfunction textureColorProfileRuntime', s, flags=re.S)
s = re.sub(r'\n    \{\n      field: "reference_envelope_fidelity",\n      read: referenceEnvelopeFidelityRuntime,\n    \},', '', s)
write('mcp/server/tools/quality-intelligence.ts', s)

s = text('mcp/server/tools/export.ts')
s = s.replace('import { listBlockItThreeDAssistedReferences } from "./project";\n', '')
s = re.sub(r'        if \(codec_id === "project"\) \{\n          const activeThreeDAssistedReferences.*?\n        \}\n', '', s, flags=re.S)
write('mcp/server/tools/export.ts', s)

s = text('mcp/lib/authoringPhase.ts')
s = re.sub(r'\nconst RETIRED_CAPABILITIES = new Set\(\[.*?\n\]\);\n', '\n', s, flags=re.S)
s = s.replace('  if (RETIRED_CAPABILITIES.has(toolName)) return null;\n', '')
write('mcp/lib/authoringPhase.ts', s)

s = text('mcp/gateway/contract.ts')
s = re.sub(r'const EXPERIMENTAL_CAPABILITIES = new Set\(\[\n  "manage_geometry_reference",\n\]\);', 'const EXPERIMENTAL_CAPABILITIES = new Set<string>();', s)
write('mcp/gateway/contract.ts', s)

s = text('mcp/prompts/bedrock_entity_workflow.md')
s = s.replace('Choose DIRECT or 3D_ASSISTED with the user; never infer or auto-switch. For DIRECT Geometry: create the project, add required Groups and Cubes, set explicit positions/sizes/parents/transforms, then capture canonical views for visual review. Do not use the retired reference-grounded plan/compiler flow.', 'Use the single native BlockIT Geometry path: create the project, add required Groups and Cubes, set explicit positions/sizes/parents/transforms, then capture canonical views for visual review. Do not revive retired external modelling routes.')
s = s.replace('3D_ASSISTED: after external gates, use Gateway `materialize_3d_assisted_scaffold(workspace_path)`.\n\n', '')
write('mcp/prompts/bedrock_entity_workflow.md', s)
(ROOT / 'mcp/server/threeDAssistedMaterializer.ts').unlink(missing_ok=True)

# Stale contract expectations after intentional two-tool retirement.
s = text('mcp/scripts/evaluate-tool-discovery.ts')
s = re.sub(r'  \[\n    "manage_geometry_reference",\n    "load an approved GLB as a 3D geometry reference",\n    "hide update or remove the 3D-Assisted Evidence model reference",\n  \],\n', '', s)
s = s.replace('report.enabled_tool_count !== 56', 'report.enabled_tool_count !== 54').replace('expected 56`', 'expected 54`')
s = s.replace('report.expected_tool_count !== 39', 'report.expected_tool_count !== 38').replace('expected 39`', 'expected 38`')
write('mcp/scripts/evaluate-tool-discovery.ts', s)

s = text('mcp/tests/surface-integrity-guard.test.ts')
s = s.replace('expect(enabledDefinitions.length).toBe(56);', 'expect(enabledDefinitions.length).toBe(54);')
s = s.replace('    expect(getEnabledToolDefinitions().manage_geometry_reference).toBeDefined();\n', '')
s = s.replace('    expect(exportSource).toContain("listBlockItThreeDAssistedReferences");\n    expect(exportSource).toContain(\n      "Remove them with manage_geometry_reference before project export"\n    );\n', '')
write('mcp/tests/surface-integrity-guard.test.ts', s)

s = text('mcp/tests/default-registration-import-safe.test.ts')
s = s.replace('expect(catalog.length).toBe(80);', 'expect(catalog.length).toBe(78);')
s = s.replace('    expect(catalog.some((tool) => tool.name === "manage_geometry_reference")).toBe(true);\n', '')
s = s.replace('    expect(catalog.some((tool) => tool.name === "materialize_3d_assisted_scaffold")).toBe(true);\n', '')
write('mcp/tests/default-registration-import-safe.test.ts', s)

s = text('mcp/tests/gateway-contract.test.ts')
s = s.replace('''      {\n        name: "manage_geometry_reference",\n        description: "Load an approved GLB as optional 3D Evidence.",\n      },\n''', '')
s = s.replace('    expect(classifyCapabilityTier(tools[2]!)).toBe("experimental");\n    expect(classifyCapabilityTier(tools[3]!)).toBe("maintenance");', '    expect(classifyCapabilityTier(tools[2]!)).toBe("maintenance");')
s = re.sub(r'\n  test\("experimental 3D Evidence remains discoverable only when relevant", \(\) => \{.*?\n  \}\);\n', '\n', s, flags=re.S)
write('mcp/tests/gateway-contract.test.ts', s)

s = text('mcp/tests/local-runtime-gate-contract.test.ts')
s = s.replace('  "manage_geometry_reference",\n', '')
write('mcp/tests/local-runtime-gate-contract.test.ts', s)

s = text('mcp/tests/camera-framing-contract.test.ts')
s = re.sub(r'  test\("keeps model framing Cube-owned while explicit framing can use loaded 3D-Assisted evidence", async \(\) => \{.*?\n  \}\);', '''  test("keeps model and explicit framing Cube-owned", async () => {\n    const cameraSource = await Bun.file(\n      new URL("../server/tools/camera.ts", import.meta.url)\n    ).text();\n    expect(cameraSource).not.toContain("hasVisibleLoadedBlockItThreeDAssistedReference");\n    expect(cameraSource).toContain('framingInput.mode === "model"');\n    expect(cameraSource).toContain("Model framing requires visible Cube geometry");\n    expect(cameraSource).toContain("Explicit framing requires visible Cube geometry to capture.");\n  });''', s, flags=re.S)
write('mcp/tests/camera-framing-contract.test.ts', s)

s = text('mcp/tests/authoring-residue-handoff.test.ts')
s = s.replace('"SOURCE_READY", "verify:full", "AUTHORING TAXONOMY", "DIRECT | 3D_ASSISTED",\n      "user assets", "Do not publish Stable",', '"SOURCE_READY", "verify:full", "AUTHORING TAXONOMY", "one native Geometry",\n      "user assets", "Do not publish Stable",')
write('mcp/tests/authoring-residue-handoff.test.ts', s)

# Canonical current docs: no pending compatibility descriptors.
impl = '''# BlockIT Implementation Map\n\nUpdated: 2026-09-10\n\nThis file maps current source ownership. Continuation belongs in `next-action.md`; proof belongs in `current-validation.md`.\n\n## Runtime Architecture\n\n```text\nCodex / AI client\n→ mcp/gateway/index.ts\n→ mcp/gateway/backend.ts\n→ loopback Runtime transport\n→ mcp/server/**\n→ Blockbench native APIs\n```\n\nGateway client surface remains four tools: `status`, `search_capabilities`, `describe_capability`, `invoke_capability`.\n\nCurrent source surfaces:\n\n```text\ncallable union: 54 tools\nAUTHORING:      47 tools\nAnimation:      20 tools\ndeclared ToolSpecs: 66\n```\n\n## Authoring Ownership\n\n| Domain | Semantic owner | Runtime/source owner | Primary regression |\n| --- | --- | --- | --- |\n| Geometry / rig / pivots / UV Layout | `.agents/skills/blockbench-bedrock-modelling/SKILL.md` | `mcp/server/tools/cubes.ts`, `element.ts`, `locators.ts`, animation rig subset | `mcp/tests/model-effectiveness-correction-accuracy.test.ts` |\n| Locator/Null | `.agents/skills/blockbench-bedrock-modelling/SKILL.md` | `mcp/server/tools/locators.ts` | `mcp/tests/bedrock-locator-coverage.test.ts` |\n| Texture / Painter / PBR | `.agents/skills/blockit-bedrock-texturing/SKILL.md` | `mcp/server/tools/texture.ts`, `paint.ts`, material owners | texture/Painter contract tests |\n| Animation / motion / effects/controllers | `.agents/skills/blockit-bedrock-animation/SKILL.md` | `mcp/server/tools/animation*.ts` | animation contract tests |\n| Asset routing / phase gate | `.agents/skills/blockit-bedrock-entity-mcp/SKILL.md` | `mcp/lib/authoringPhase.ts`, `mcp/server/tools.ts` | `mcp/tests/authoring-phase-surface.test.ts` |\n\nNormal Geometry has one native Group/Cube path. `manage_locator` and `manage_null_object` remain the Locator/Null lifecycle owners.\n\n## Gateway / Navigator Owners\n\n| Concern | Owner |\n| --- | --- |\n| stable four-tool stdio boundary | `mcp/gateway/index.ts` |\n| Runtime connection/catalog/queue/project affinity | `mcp/gateway/backend.ts` |\n| capability priority/result compaction/runtime signature | `mcp/gateway/contract.ts` |\n| branch-specific schema reduction | `mcp/gateway/schemaProjection.ts` |\n| context/state/source routing | `mcp/gateway/navigator/**` |\n\n## Build / Generated Ownership\n\nGenerated API docs are owned by canonical ToolSpecs + `mcp/build/docs.ts`; runtime prompt manifest is owned by `mcp/prompts/*.md` + `mcp/build/generate-manifest.ts`. Never hand-edit generated output.\n\nDeveloper loop ownership: `mcp/build/index.ts`, `mcp/build/watch-policy.ts`, `mcp/scripts/deploy-local.ts`, `mcp/tests/developer-loop.test.ts`.\n\n## Hot-Path Defect Index\n\n| Capability / symptom | Primary source owner | Primary regression owner |\n| --- | --- | --- |\n| `create_project` | `mcp/server/tools/project.ts` | `mcp/tests/p1-core-ownership.test.ts` |\n| `inspect_model_bounds` | `mcp/server/tools/project.ts` | `mcp/tests/rendered-model-bounds-numeric-safety.test.ts` |\n| `manage_cubes` | `mcp/server/tools/cubes.ts` | `mcp/tests/model-effectiveness-correction-accuracy.test.ts` |\n| `capture_model_views` | `mcp/server/tools/camera.ts` | `mcp/tests/camera-framing-contract.test.ts` |\n| `manage_locator` / `manage_null_object` | `mcp/server/tools/locators.ts` | `mcp/tests/bedrock-locator-coverage.test.ts` |\n| project/tab affinity | `mcp/gateway/backend.ts`, `mcp/server/net.ts` | `mcp/tests/project-affinity-gateway.test.ts`, `project-affinity-runtime.test.ts` |\n| phase surface / handoff | `mcp/lib/authoringPhase.ts`, `mcp/server/tools.ts` | `mcp/tests/authoring-phase-surface.test.ts` |\n| UV atlas/template | `mcp/server/tools/texture.ts`, `mcp/lib/boxUvLayout.ts` | texture/UV contract tests |\n| native Painter lifecycle | `mcp/server/tools/paint.ts` | paint runtime tests |\n| Animation timeline | `mcp/server/tools/animation.ts`, `mcp/server/tools.ts` | animation timeline/mutation tests |\n| Animation controller | `mcp/server/tools/animation-controller.ts` | controller contract tests |\n| Particle | `mcp/server/tools/particle.ts` | `mcp/tests/particle-tool-contract.test.ts` |\n\n## Current Capability Notes\n\nTextureMesh direct authoring remains available where required by the Bedrock texture surface. Native visible bounding-box fields, animated textures, bone-binding expressions, and material instances remain current supported semantics. `manage_animation_controller` owns controller composition; blend-transition curves are available through that owner.\n\nProtected gaps remain explicit: static source proof cannot certify native Blockbench behavior, visual fidelity, or accepted-result quality.\n\n## Proof / Efficiency Boundary\n\nStatic Footprint is a source/schema guardrail. Authoring Efficiency means Cost to Accepted Result after quality passes. Installed build identity, native Undo/playback/persistence, actual visual fidelity, and whole-task model usage require the matching higher execution context.\n'''
write('docs/knowledge/implementation-map.md', impl)

next_action = '''# Next Action\nUpdated: 2026-09-10\nBranch: `Local` only.\n\n## SOURCE_READY\n\nAUTHORING TAXONOMY is Geometry/rig/UV → Texture → Animation. BlockIT uses one native Geometry authoring path; retired alternative modelling routes are not current product semantics. User assets remain protected.\n\n## Current Work\n\nNavigator is the current development focus. Keep the managed installation/package and existing four-tool Gateway; no background polling and no second MCP/state system.\n\n```text\nfinish retirement expectation cleanup\n→ regenerate canonical prompt/API outputs\n→ bun run verify:full\n→ measure Navigator static footprint\n→ compare real Cost to Accepted Result when LIVE_BLOCKBENCH testing is available\n```\n\nDo not publish Stable from static source proof alone. Navigator context/token savings require equivalent-quality task evidence; source tests prove routing, hashing, invalidation, and payload boundaries only.\n'''
write('docs/knowledge/next-action.md', next_action)

# Keep artifact identity terminology exact in operator docs.
s = text('mcp/README.md')
if 'build_identity' not in s:
    s = s.replace('live build-identity verification', 'live `build_identity` verification')
write('mcp/README.md', s)

# Navigator workflow handle follows exact canonical prompt bytes after this edit.
prompt_digest = __import__('hashlib').sha256((ROOT / 'mcp/prompts/bedrock_entity_workflow.md').read_bytes()).hexdigest()
s = text('mcp/gateway/navigator/registry.ts')
s = re.sub(r'id: "ctx:prompt/bedrock-entity-workflow@[a-f0-9]+",\n  path: "mcp/prompts/bedrock_entity_workflow.md",\n  sha256: "[a-f0-9]+",', f'id: "ctx:prompt/bedrock-entity-workflow@{prompt_digest[:12]}",\n  path: "mcp/prompts/bedrock_entity_workflow.md",\n  sha256: "{prompt_digest}",', s)
write('mcp/gateway/navigator/registry.ts', s)

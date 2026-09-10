from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]

def read(path): return (ROOT / path).read_text()
def write(path, value): (ROOT / path).write_text(value)

# Repository verification no longer owns a deleted experimental workflow.
p = 'mcp/tests/repository/repository-supply-chain.test.ts'
s = read(p)
s = s.replace('test("verification and experimental workflows pin trusted Actions to immutable revisions", async () => {', 'test("verification workflows pin trusted Actions to immutable revisions", async () => {')
s = s.replace('const [repository, authoring, mcp, release, experimental] = await Promise.all([', 'const [repository, authoring, mcp, release] = await Promise.all([')
s = s.replace('      source("../.github/workflows/release-verify.yml"),\n      source("../.github/workflows/blockbench-web-poc.yml"),', '      source("../.github/workflows/release-verify.yml"),')
s = re.sub(r'\n    expectImmutableActions\(experimental, \[\n      "actions/checkout",\n      "actions/setup-node",\n      "actions/upload-artifact",\n    \]\);', '', s)
write(p, s)

# Current documentation contracts must reflect the 66-spec/54-callable post-retirement source.
p = 'mcp/llms.txt'
s = read(p)
s = re.sub(r'Generated API documentation currently enumerates \*\*68 declared source ToolSpecs\*\*, including disabled/source-preserved definitions and phase control\. The current generated snapshot may temporarily retain two retired 3D-assistance compatibility descriptors until the next canonical local generator pass; they are excluded from active Runtime phase surfaces\.', 'Generated API documentation currently enumerates **66 declared source ToolSpecs**, including disabled/source-preserved definitions and phase control.', s)
write(p, s)

# Keep root routing compact instead of weakening its context budget.
p = 'AGENTS.md'
s = read(p)
s = s.replace('Source / config / scripts / tests:', 'Source/config/scripts/tests:')
s = s.replace('before changing anything', 'before changes')
write(p, s)

# Current proof state: retirement source is coherent here, but installed/native proof remains separate.
validation = '''# Current Validation\n\nUpdated: 2026-09-10\n\nThis file owns **current proof interpretation**. Continuation belongs in `docs/knowledge/next-action.md`; stable facts in `CONTEXT.md`; source ownership in `docs/knowledge/implementation-map.md`; live procedure in `docs/knowledge/operations/local-acceptance-runbook.md`. GitHub execution/proof discipline is owned by `GITHUB_RULES.md`.\n\n## Current Source Baseline\n\nThe last user-identified installed executable baseline is BlockIT MCP `v0.2.0` at commit `b6c29c5d9edb7bb5058c42bbce123efe9dc02ed8`. That prior native evidence does not prove the current `Local` source is installed or active.\n\nCurrent `Local` source uses one native BlockIT Geometry path. The retired alternative modelling implementation and its active capability routes are removed. Canonical generated source shape is:\n\n```text\nphase-union callable tools   54\nAUTHORING tools              47\nAnimation tools              20\ndeclared source ToolSpecs    66\n```\n\nSource/static/CI success can establish `SOURCE_READY` for that source partition. It cannot establish current installed build identity or native Blockbench behavior.\n\n## Navigator\n\nNavigator production source lives under `mcp/gateway/navigator/`. Static tests cover compact state projection, content-addressed context handles, stale-context invalidation, capability/source ownership, development-intent routing, and delta continuation. Static payload reduction is diagnostic only; whole-task usage savings remain `UNKNOWN` until compared at equivalent accepted quality.\n\n## Visual / Reference Proof Rule\n\nA visual/reference `PASS` requires the **actual approved reference image** plus **fresh evidence** from the current model/revision at a comparable view/scale. Tool success, source/CI success, hashes, coordinates, export, scalar metrics, or structural diagnostics cannot create visual PASS by themselves.\n\nIf corresponding live evidence is unavailable, report `UNVERIFIED` or `LOCAL PROOF REQUIRED`.\n\n## Authoring Efficiency\n\n**Authoring Efficiency** means **Cost to Accepted Result**. Static Footprint, raw call count, schema bytes, and transport bytes are guardrails/diagnostics only. Efficiency improves only when accepted quality is preserved while avoidable discovery, readback, phase bouncing, retries, recovery, or correction cost decreases on a comparable task.\n'''
write('docs/knowledge/current-validation.md', validation)

p = 'docs/knowledge/implementation-map.md'
s = read(p)
s = s.replace('This file maps current source ownership. Continuation belongs in `next-action.md`; proof belongs in `current-validation.md`.', 'This file maps current source ownership and carries **no active task status**. Continuation belongs in `next-action.md`; proof belongs in `current-validation.md`.')
s = s.replace('Current source surfaces:\n\n```text\ncallable union: 54 tools\nAUTHORING:      47 tools\nAnimation:      20 tools\ndeclared ToolSpecs: 66\n```', 'Current source surfaces: callable union has **54 tools**; Geometry and Texturing share **47** AUTHORING tools; Animation exposes **20** tools; generated API has **66 declared source ToolSpecs**.')
s = s.replace('Generated API docs are owned by canonical ToolSpecs', 'MCP TypeScript/Bun implementation mechanics remain owned by `mcp/AGENTS.md` and executable source.\n\nDeveloper loop: `dev:watch`, prompt watch regeneration, `deploy:local`, and `dev:sync` are owned by `mcp/build/**`, `mcp/scripts/deploy-local.ts`, and `mcp/tests/developer-loop.test.ts`.\n\nGenerated API docs are owned by canonical ToolSpecs')
s = s.replace('Developer loop ownership: `mcp/build/index.ts`, `mcp/build/watch-policy.ts`, `mcp/scripts/deploy-local.ts`, `mcp/tests/developer-loop.test.ts`.\n', '')
needle = '| `manage_cubes` | `mcp/server/tools/cubes.ts` | `mcp/tests/model-effectiveness-correction-accuracy.test.ts` |\n'
extra = '| `inspect_elements` | `mcp/server/tools.ts` | `mcp/tests/model-effectiveness-correction-accuracy.test.ts` |\n| `export_model` | `mcp/server/tools/export.ts` | `mcp/tests/prelocal-generic-semantics.test.ts` |\n'
if extra not in s: s = s.replace(needle, needle + extra)
s = s.replace('Static Footprint is a source/schema guardrail.', 'Static Footprint is a source/schema guardrail and **cannot upgrade** static evidence into live/native/visual proof.')
if 'UV Layout' not in s: s += '\nUV Layout remains Geometry-owned until its production gate passes.\n'
write(p, s)

# Next-action tests must assert current single-path semantics, not retired terminology.
p = 'mcp/tests/repository/repository-github-discipline.test.ts'
s = read(p)
s = s.replace('    expect(next).toContain("3D_ASSISTED");', '    expect(next).toContain("one native Geometry");')
write(p, s)

# The semantic mirror should require the current wording rather than a removed route token.
p = 'mcp/tests/repository/contract-closure.test.ts'
s = read(p)
# no test weakening: current-doc-sync itself must contain the canonical UV marker expected by this guard.
write(p, s)

p = 'mcp/tests/repository/current-doc-sync.test.ts'
s = read(p)
if '"UV Layout"' not in s.split('test("canonical authoring taxonomy',1)[0]:
    # Put an explicit current invariant into the executable doc-sync owner.
    anchor = 'expect(implementation).toContain("blend-transition curves are available");'
    s = s.replace(anchor, anchor + '\n    expect(implementation).toContain("UV Layout");')
write(p, s)

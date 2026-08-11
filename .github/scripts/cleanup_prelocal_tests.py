from pathlib import Path


def replace_test(path: Path, title: str, replacement: str) -> None:
    text = path.read_text(encoding='utf-8')
    marker = f'  test("{title}"'
    start = text.find(marker)
    if start < 0:
        raise SystemExit(f'{path}: test not found: {title}')
    next_test = text.find('\n  test("', start + len(marker))
    suite_end = text.rfind('\n});')
    if suite_end < 0:
        raise SystemExit(f'{path}: suite end not found')
    end = next_test if next_test >= 0 else suite_end
    path.write_text(text[:start] + replacement.rstrip() + '\n' + text[end:], encoding='utf-8')


def remove_test(path: Path, title: str) -> None:
    replace_test(path, title, '')


# Continuity is not an architecture owner; keep this test on the real profile owner.
replace_test(
    Path('mcp/tests/asset-authoring-usage-slimming.test.ts'),
    'capability architecture is unchanged',
    '''  test("capability architecture is unchanged", async () => {
    const profile = await source("lib/registrationProfile.ts");
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("asset_authoring_profile");
  });''',
)

# Give the standalone prompt real headroom and make this the single continuity-doc test owner.
path = Path('mcp/tests/context-payload-cleanup.test.ts')
text = path.read_text(encoding='utf-8')
old_budget = 'expect(workflow.length).toBeLessThan(10_000);'
if text.count(old_budget) != 1:
    raise SystemExit('context prompt budget anchor changed')
path.write_text(text.replace(old_budget, 'expect(workflow.length).toBeLessThan(9_000);', 1), encoding='utf-8')
replace_test(
    path,
    'context cleanup changes payload, not Bedrock capability/profile architecture',
    '''  test("continuity stays compact and local-only after non-local readiness", async () => {
    const profile = await source("lib/registrationProfile.ts");
    const next = await source("../docs/knowledge/next-action.md");
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("lean_mode");
    expect(profile).not.toContain("context_mode");
    expect(next.length).toBeLessThan(8_000);
    expect(next).toContain("NON_LOCAL_PRELOCAL_READINESS_COMPLETE_LOCAL_ACCEPTANCE_REQUIRED");
    expect(next).toContain("## Next Step");
    expect(next).toContain("LOCAL — Codex + Blockbench acceptance");
    expect(next).not.toContain("If continuing non-local work");
    expect(next).not.toContain("The current source slice has hardened");
  });''',
)

# Correction correctness belongs to the modelling/prompt contract, not next-action history.
path = Path('mcp/tests/model-effectiveness-correction-accuracy.test.ts')
remove_test(path, 'correction safeguards remain active as problem-driven work advances')
text = path.read_text(encoding='utf-8')
anchor = '    expect(workflow).toContain("`BLOCKED`");\n'
addition = '''    expect(modelling).toContain("reuse fresh exact authored state already returned for that target when sufficient");
    expect(workflow).toContain("Reuse fresh exact authored state already returned for that target when sufficient");
    expect(workflow).not.toContain("`inspect_element` before numeric correction and use the authored state it returns");
'''
if text.count(anchor) != 1:
    raise SystemExit('correction fresh-state assertion anchor changed')
path.write_text(text.replace(anchor, anchor + addition, 1), encoding='utf-8')

# These suites already assert their real policy/source owners above; remove changelog coupling.
remove_test(
    Path('mcp/tests/model-effectiveness-cross-view-blocker.test.ts'),
    'cross-view safeguards remain active as problem-driven work advances',
)

replace_test(
    Path('mcp/tests/model-effectiveness-minimum-evidence.test.ts'),
    'cleanup remains decision-layer only with no new efficiency profile or runtime mode',
    '''  test("cleanup remains decision-layer only with no new efficiency profile or runtime mode", async () => {
    const profile = await source("lib/registrationProfile.ts");
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("lean_mode");
    expect(profile).not.toContain("efficiency_mode");
    expect(profile).not.toContain("minimum_evidence");
  });''',
)
replace_test(
    Path('mcp/tests/model-effectiveness-minimum-evidence.test.ts'),
    'CI modelling gates are explicitly contract proof, not behavioral or visual proof',
    '''  test("CI modelling gates are explicitly contract proof, not behavioral or visual proof", async () => {
    const audit = await source("../docs/knowledge/reviews/model-creation-effectiveness-audit-2026-08-10.md");
    expect(audit).toContain("Proof Taxonomy — Do Not Confuse Contract With Behaviour");
    expect(audit).toContain("contract proof");
    expect(audit).toContain("BEHAVIORAL MODELLING PROOF");
    expect(audit).toContain("REFERENCE-FIDELITY OUTCOME PROOF");
  });''',
)

replace_test(
    Path('mcp/tests/model-effectiveness-sequencing.test.ts'),
    'sequencing hardening remains decision-layer only and advances to local acceptance',
    '''  test("sequencing hardening remains decision-layer only", async () => {
    const profile = await source("lib/registrationProfile.ts");
    const audit = await source("../docs/knowledge/reviews/model-creation-effectiveness-audit-2026-08-10.md");
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("sequencing");
    expect(profile).not.toContain("readiness");
    expect(audit).toContain("No runtime readiness state, new profile, or tool gate was added");
  });''',
)

remove_test(
    Path('mcp/tests/model-effectiveness-tool-routing.test.ts'),
    'tool-routing safeguards remain active as sequencing work completes',
)

# next-action must not become a cross-suite changelog fixture again.
owners = []
for test_path in Path('mcp/tests').glob('*.test.ts'):
    if '../docs/knowledge/next-action.md' in test_path.read_text(encoding='utf-8'):
        owners.append(test_path.name)
if owners != ['context-payload-cleanup.test.ts']:
    raise SystemExit(f'next-action remains coupled to unrelated tests: {owners}')

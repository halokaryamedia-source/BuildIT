from pathlib import Path
import json
import re
import subprocess

ROOT = Path.cwd()

# Keep current proof/continuity owners synchronized with this final hygiene pass.
validation_path = Path('docs/foundation/validation-report.md')
validation = validation_path.read_text(encoding='utf-8')
validation = validation.replace('156 Bun contract tests', '159 Bun contract tests')
anchor = 'Non-local source/contract/CI/documentation cleanup is complete. Live runtime, client exposure, visual behavior, and persistence remain the authoritative next evidence boundary.'
replacement = anchor + '\n\nFinal repository hygiene also removed standalone-upstream/editor residue, obsolete planning layers, and tracked transient workspace previews without changing the MCP callable surface.'
if 'Final repository hygiene also removed' not in validation:
    if anchor not in validation:
        raise SystemExit('validation hygiene anchor changed')
    validation = validation.replace(anchor, replacement, 1)
validation_path.write_text(validation, encoding='utf-8')

next_path = Path('docs/knowledge/next-action.md')
next_text = next_path.read_text(encoding='utf-8')
next_anchor = 'The non-local pass is complete. Current source/contract/CI/generated-doc evidence is ready; live Blockbench/MCP/client behavior is not yet proven.'
next_replacement = next_anchor + '\n\nRepository hygiene is also complete: standalone-upstream/editor residue, duplicate planning layers, and tracked transient preview caches have been removed. Current source/runtime capability was not pruned by this cleanup.'
if 'Repository hygiene is also complete' not in next_text:
    if next_anchor not in next_text:
        raise SystemExit('next-action hygiene anchor changed')
    next_text = next_text.replace(next_anchor, next_replacement, 1)
next_path.write_text(next_text, encoding='utf-8')

tracked = subprocess.check_output(['git', 'ls-files'], text=True).splitlines()
tracked_set = set(tracked)

required = {
    '.gitignore', 'LICENSE', 'README.md', 'AGENTS.md', 'CONTEXT.md',
    'docs/knowledge/next-action.md',
    'docs/knowledge/operations/local-acceptance-runbook.md',
    'docs/knowledge/operations/task-board.md',
    'docs/foundation/validation-report.md',
    'mcp/README.md', 'mcp/AGENTS.md', 'mcp/package.json',
    'workspace/active/zebra/zebra.bbmodel',
    'workspace/active/zebra/mcp-data/references/zebra_reference_package/zebra_model_reference.webp',
}
missing = sorted(required - tracked_set)
if missing:
    raise SystemExit('missing required tracked files: ' + ', '.join(missing))

forbidden_exact = {
    'mcp/.coderabbit.yaml', 'mcp/CLAUDE.md', 'mcp/CONTRIBUTING.md',
    'mcp/llms-install.md', 'mcp/docs/llms/install.md', 'mcp/.gitignore', 'mcp/LICENSE',
    'docs/foundation/08-source-selection.md', 'docs/foundation/09-merge-map.md',
    'docs/knowledge/decisions/decision-template.md',
    'docs/knowledge/decisions/obsidian-vault-layout.md',
    'docs/knowledge/glossary.md', 'docs/knowledge/workspace-structure.md',
    'docs/knowledge/operations/bedrock-entity-reduction-execution.md',
    'docs/knowledge/operations/change-log.md',
    'docs/knowledge/operations/context-boot-baseline.md',
    'docs/knowledge/operations/documentation-audit.md',
    'docs/knowledge/operations/mcp-reduction-stabilization-plan.md',
    'docs/knowledge/operations/roadmap.md',
}
left = sorted(forbidden_exact & tracked_set)
if left:
    raise SystemExit('obsolete files still tracked: ' + ', '.join(left))

for prefix in [
    'mcp/.github/', 'mcp/.vscode/', 'docs/knowledge/.obsidian/',
    'docs/knowledge/attachments/', 'docs/knowledge/maintenance/',
    'docs/knowledge/modules/', 'docs/knowledge/flows/',
    'workspace/active/zebra/mcp-data/cache/',
]:
    found = [p for p in tracked if p.startswith(prefix)]
    if found:
        raise SystemExit(f'obsolete/transient prefix still tracked: {prefix}: {found[:5]}')

ignored_tracked = subprocess.check_output(
    ['git', 'ls-files', '-ci', '--exclude-standard'], text=True
).strip()
if ignored_tracked:
    raise SystemExit('tracked files are now ignored:\n' + ignored_tracked)

operations = sorted(p.name for p in Path('docs/knowledge/operations').iterdir() if p.is_file())
if operations != ['README.md', 'local-acceptance-runbook.md', 'task-board.md']:
    raise SystemExit(f'operations surface is not minimal: {operations}')

foundation = sorted(p.name for p in Path('docs/foundation').iterdir() if p.is_file() and p.suffix == '.md')
expected_foundation = [
    '00-agent-policy.md','01-project-overview.md','02-product-requirements.md',
    '03-modelling-workflow.md','04-reference-guide.md','05-geometry-standard.md',
    '06-texture-standard.md','07-visual-validation.md','README.md','validation-report.md'
]
if foundation != sorted(expected_foundation):
    raise SystemExit(f'foundation current-policy surface unexpected: {foundation}')

skills = sorted(p.name for p in Path('.agents/skills').iterdir() if p.is_dir())
expected_skills = sorted([
    'blockbench-bedrock-modelling','blockbench-runtime-development',
    'blockit-bedrock-animation','blockit-bedrock-entity-mcp','blockit-bedrock-texturing',
    'bun-tooling','development-brief','mcp-server-development','typescript-type-safety'
])
if skills != expected_skills:
    raise SystemExit(f'skill inventory mismatch: {skills}')

root_ignore = Path('.gitignore').read_text(encoding='utf-8')
for needle in ['docs/knowledge/.obsidian/', 'workspace/**/mcp-data/cache/', 'node_modules/', 'dist/']:
    if needle not in root_ignore:
        raise SystemExit(f'missing root ignore rule: {needle}')

zebra_ref = Path('workspace/active/zebra/mcp-data/references/zebra_reference_package/ASSET_REFERENCE.md').read_text(encoding='utf-8')
for stale in ['H1 review result', 'H12', 'Draft numeric envelope', 'mcp/workflow/reference-generator']:
    if stale in zebra_ref:
        raise SystemExit(f'stale Zebra experiment remains: {stale}')
manifest = json.loads(Path('workspace/active/zebra/mcp-data/references/zebra_reference_package/reference_manifest.json').read_text(encoding='utf-8'))
if manifest.get('purpose') != 'local_acceptance_fixture' or 'visual_fit' in manifest:
    raise SystemExit('Zebra manifest still carries experimental/calibration state')

# Current routing must remain unambiguous.
active_docs = [
    Path('README.md'), Path('CONTEXT.md'), Path('AGENTS.md'), Path('docs/README.md'),
    Path('docs/foundation/README.md'), Path('docs/foundation/validation-report.md'),
    Path('docs/knowledge/index.md'), Path('docs/knowledge/minimal-nav.md'),
    Path('docs/knowledge/next-action.md'), Path('docs/knowledge/flow.md'),
    Path('docs/knowledge/workspace-map.md'), Path('docs/knowledge/implementation-map.md'),
    Path('docs/knowledge/skills/activation-matrix.md'), Path('docs/knowledge/skills/skill-map.md'),
    Path('docs/knowledge/sources/source-map.md'), Path('docs/knowledge/operations/README.md'),
    Path('docs/knowledge/operations/local-acceptance-runbook.md'),
    Path('docs/knowledge/operations/task-board.md'), Path('docs/knowledge/reviews/review-graph.md'),
    Path('mcp/README.md'), Path('mcp/AGENTS.md'), Path('workspace/README.md'),
    Path('workspace/active/README.md'), Path('workspace/active/zebra/README.md'),
]
joined = '\n'.join(p.read_text(encoding='utf-8') for p in active_docs)
for stale in ['mcp/prompts/bedrock.md', 'Local Blockbench testing is intentionally deferred', 'When local testing becomes the priority']:
    if stale in joined:
        raise SystemExit(f'stale current routing remains: {stale}')
for required_phrase in [
    'mcp/prompts/bedrock_entity_workflow.md',
    'LOCAL — follow operations/local-acceptance-runbook.md',
    'NON_LOCAL_PRELOCAL_READINESS_COMPLETE_LOCAL_ACCEPTANCE_REQUIRED',
]:
    if required_phrase not in joined:
        raise SystemExit(f'missing current handoff phrase: {required_phrase}')

# Every tracked Markdown link should resolve inside this repository unless it is external/anchor-only.
link_re = re.compile(r'\[[^\]]+\]\(([^)]+)\)')
broken = []
for rel in tracked:
    if not rel.endswith('.md'):
        continue
    path = Path(rel)
    text = path.read_text(encoding='utf-8')
    for target in link_re.findall(text):
        target = target.strip()
        if '://' in target or target.startswith('#') or target.startswith('mailto:'):
            continue
        raw = target.split('#', 1)[0]
        if not raw:
            continue
        resolved = (path.parent / raw).resolve()
        try:
            resolved.relative_to(ROOT.resolve())
        except ValueError:
            continue
        if not resolved.exists():
            broken.append(f'{rel} -> {target}')
if broken:
    raise SystemExit('broken internal Markdown links:\n' + '\n'.join(broken))

print(f'tracked_files={len(tracked)}')
print(f'skills={len(skills)}')
print(f'operations_files={operations}')
print(f'foundation_files={len(foundation)}')
print('repo_hygiene=PASS')

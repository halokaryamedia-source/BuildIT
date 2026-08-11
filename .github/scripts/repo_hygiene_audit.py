from pathlib import Path
import re
import subprocess

ROOT = Path.cwd()
tracked = subprocess.check_output(["git", "ls-files"], text=True).splitlines()
print(f"tracked_files={len(tracked)}")

# Top-level counts
counts = {}
for p in tracked:
    top = p.split('/', 1)[0]
    counts[top] = counts.get(top, 0) + 1
print("=== TOP_LEVEL_COUNTS ===")
for k in sorted(counts):
    print(f"{k}: {counts[k]}")

print("=== TRACKED_IGNORED ===")
try:
    out = subprocess.check_output(["git", "ls-files", "-ci", "--exclude-standard"], text=True).strip()
    print(out or "none")
except subprocess.CalledProcessError as e:
    print(e.output)

print("=== SUSPICIOUS_PATHS ===")
suspicious_re = re.compile(r"(^|/)(tmp|temp|backup|bak|old|copy|debug|scratch|draft|test-output|output)(/|$)|(~$|\.bak$|\.tmp$|\.orig$|\.rej$|\.log$)", re.I)
for p in tracked:
    if suspicious_re.search(p):
        print(p)

print("=== LEGACY_RETIRED_PATHS ===")
for p in tracked:
    if p.startswith(("mcp/.agents/", "mcp/.github/", "mcp/workflow/")):
        print(p)

print("=== GENERATED_TRACKED ===")
for p in tracked:
    if p.startswith(("mcp/dist/", "mcp/docs/")):
        print(p)

# Markdown reference heuristic: exact relative links and literal path/name mentions.
mds = [Path(p) for p in tracked if p.endswith('.md')]
all_text = {}
for p in mds:
    try:
        all_text[p] = p.read_text(encoding='utf-8')
    except Exception:
        all_text[p] = ''

print("=== UNREFERENCED_MARKDOWN_HEURISTIC ===")
exempt = {
    Path('README.md'), Path('AGENTS.md'), Path('CONTEXT.md'), Path('docs/README.md'),
    Path('docs/knowledge/index.md'), Path('docs/knowledge/next-action.md'),
    Path('docs/foundation/README.md'), Path('mcp/README.md'), Path('mcp/AGENTS.md'),
}
for p in mds:
    if p in exempt or p.name == 'SKILL.md':
        continue
    rel = p.as_posix()
    name = p.name
    stem = p.stem
    refs = 0
    for other, text in all_text.items():
        if other == p:
            continue
        if rel in text or name in text or (len(stem) > 8 and stem in text):
            refs += 1
    if refs == 0:
        print(rel)

print("=== STALE_CURRENT_MARKERS ===")
current_files = [
    Path('README.md'), Path('CONTEXT.md'), Path('AGENTS.md'), Path('docs/README.md'),
    Path('docs/foundation/README.md'), Path('docs/foundation/validation-report.md'),
    Path('docs/knowledge/index.md'), Path('docs/knowledge/minimal-nav.md'),
    Path('docs/knowledge/next-action.md'), Path('docs/knowledge/implementation-map.md'),
    Path('docs/knowledge/operations/README.md'), Path('docs/knowledge/operations/task-board.md'),
    Path('docs/knowledge/operations/roadmap.md'), Path('docs/knowledge/operations/local-acceptance-runbook.md'),
    Path('docs/knowledge/skills/activation-matrix.md'), Path('docs/knowledge/skills/skill-map.md'),
    Path('docs/knowledge/sources/source-map.md'), Path('mcp/README.md'), Path('mcp/AGENTS.md'),
]
markers = [
    'mcp/prompts/bedrock.md', 'six-skill', 'exactly six',
    'source implementation not started', 'next active source audit',
    'Local Blockbench testing is intentionally deferred',
    'When local testing becomes the priority',
]
for p in current_files:
    if not p.exists():
        print(f"MISSING {p}")
        continue
    text = p.read_text(encoding='utf-8')
    for marker in markers:
        if marker.lower() in text.lower():
            print(f"{p}: {marker}")

# Simple TS/JS orphan heuristic: files under mcp source/build/lib/server/ui that are not referenced by any tracked TS/JS/package/workflow.
code_paths = [Path(p) for p in tracked if p.endswith(('.ts','.js','.mjs','.cjs','.json','.yml','.yaml'))]
code_text = {}
for p in code_paths:
    try:
        code_text[p] = p.read_text(encoding='utf-8')
    except Exception:
        code_text[p] = ''
print("=== POSSIBLE_CODE_ORPHANS_HEURISTIC ===")
for p in code_paths:
    s = p.as_posix()
    if not s.startswith('mcp/') or '/tests/' in s or s.startswith('mcp/docs/') or s.startswith('mcp/dist/'):
        continue
    if p.name in {'index.ts', 'package.json', 'tsconfig.json'}:
        continue
    stem = p.stem
    rel_no_ext = s.rsplit('.',1)[0]
    refs = 0
    for other, text in code_text.items():
        if other == p:
            continue
        if p.name in text or rel_no_ext in text or f'/{stem}' in text or f'./{stem}' in text or f'../{stem}' in text:
            refs += 1
    if refs == 0:
        print(s)

print("=== ROOT_FILES ===")
for p in tracked:
    if '/' not in p:
        print(p)

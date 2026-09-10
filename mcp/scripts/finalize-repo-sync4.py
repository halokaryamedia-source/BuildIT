from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

def read(path): return (ROOT / path).read_text()
def write(path, value): (ROOT / path).write_text(value)

# Discovery fixture follows the intentional retired-tool count.
p = 'mcp/tests/tool-discovery-eval.test.ts'
s = read(p).replace('expect(raw.expected_tool_count).toBe(39);', 'expect(raw.expected_tool_count).toBe(38);')
write(p, s)

# Preserve the exact current capability marker consumed by regression tests.
p = 'docs/knowledge/implementation-map.md'
s = read(p)
s = s.replace(
    '`manage_animation_controller` owns controller composition; blend-transition curves are available through that owner.',
    'blend-transition curves are available through `manage_animation_controller`, which owns controller composition.'
)
write(p, s)

# Keep the operator command explicit and copy-pasteable.
p = 'docs/knowledge/operations/local-acceptance-runbook.md'
s = read(p).replace(
    '`verify:stateless-local` is diagnostic only when that shared preflight fails or exact full-surface diagnosis is explicitly required.',
    '`bun run verify:stateless-local` is diagnostic only when that shared preflight fails or exact full-surface diagnosis is explicitly required.'
)
write(p, s)

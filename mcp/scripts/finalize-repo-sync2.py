from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

def read(path): return (ROOT / path).read_text()
def write(path, value): (ROOT / path).write_text(value)

# Keep root routing under its existing compactness budget without changing semantics.
p = 'AGENTS.md'
s = read(p)
s = s.replace('User-authorized autonomy replaces approval waits with verified checkpoints; never claim user approval.', 'Authorized autonomy replaces approval waits with checkpoints; never claim user approval.')
write(p, s)

# Exact-commit proof language is part of current validation ownership.
p = 'docs/knowledge/current-validation.md'
s = read(p)
needle = 'Source/static/CI success can establish `SOURCE_READY` for that source partition. It cannot establish current installed build identity or native Blockbench behavior.'
replacement = needle + ' Reuse device-independent source proof only when it belongs to the same exact `Local` SHA.'
s = s.replace(needle, replacement)
write(p, s)

# Preserve the established fast-path phrase while keeping the actual acceptance procedure unchanged.
p = 'docs/knowledge/operations/local-acceptance-runbook.md'
s = read(p)
anchor = 'Require a clean tree before reusing proof. Do not reuse source checks from another SHA.\n'
if 'Fast path' not in s:
    s = s.replace(anchor, anchor + '\nFast path: reuse exact green source proof only for the same clean `Local` SHA.\n')
write(p, s)

# Experimental is an isolation area, never a production authority.
p = 'Experimental/README.md'
s = read(p)
if 'NOT PRODUCTION' not in s:
    s = s.replace('# Experimental\n', '# Experimental\n\n**NOT PRODUCTION.**\n')
write(p, s)

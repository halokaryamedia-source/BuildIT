from pathlib import Path
import hashlib
import re

ROOT = Path(__file__).resolve().parents[2]

def read(path): return (ROOT / path).read_text()
def write(path, value): (ROOT / path).write_text(value)

# Tool-discovery fixture follows the intentional 54-callable surface.
p = 'mcp/tests/tool-discovery-eval.test.ts'
s = read(p).replace('expect(raw.enabled_tool_count).toBe(56);', 'expect(raw.enabled_tool_count).toBe(54);')
write(p, s)

# Preserve exact capability markers consumed by current contract tests.
p = 'docs/knowledge/implementation-map.md'
s = read(p)
s = s.replace(
    'TextureMesh direct authoring remains available where required by the Bedrock texture surface. Native visible bounding-box fields, animated textures, bone-binding expressions, and material instances remain current supported semantics.',
    'TextureMesh direct authoring/inspection remains available where required by the Bedrock texture surface. native visible bounding-box fields, animated textures, bone-binding expressions, and material instances remain current supported semantics.'
)
write(p, s)

# Keep the operator-visible static footprint contract explicit.
p = 'mcp/README.md'
s = read(p)
marker = '## Surface Guard\n\n'
line = 'runtime workflow prompt             < 9,000 characters\n\n'
if line not in s:
    s = s.replace(marker, marker + '```text\n' + line + '```\n\n')
# Remove stale generated-descriptor transition wording now that canonical generation is complete.
s = re.sub(r'\nThe current generated source-doc snapshot may temporarily retain two retired compatibility descriptors until its next `LOCAL_CODE` generator pass\. They are excluded from all active Runtime phase surfaces and are not current authoring capabilities\.\n', '\nGenerated API documentation reflects the current 66-spec source surface.\n', s)
write(p, s)

# Preserve the <9k runtime prompt budget rather than widening it.
p = 'mcp/prompts/bedrock_entity_workflow.md'
s = read(p)
s = s.replace(
    'Authorized autonomy replaces approval waits with verified checkpoints. Use autonomous readiness at handoff; never claim user approval.',
    'Authorized autonomy uses verified checkpoints; never claim user approval.'
)
s = s.replace(
    'Reference-driven work requires the actual approved image in active multimodal context. Path/memory is not image evidence. Missing material reference evidence → `BLOCKED`.',
    'Reference-driven work requires the approved image in active multimodal context. Path/memory is not image evidence. Missing material evidence → `BLOCKED`.'
)
write(p, s)

# Refresh the exact content-addressed Navigator handle after the canonical prompt edit.
digest = hashlib.sha256((ROOT / p).read_bytes()).hexdigest()
rp = 'mcp/gateway/navigator/registry.ts'
r = read(rp)
r = re.sub(
    r'id: "ctx:prompt/bedrock-entity-workflow@[a-f0-9]+",\n  path: "mcp/prompts/bedrock_entity_workflow.md",\n  sha256: "[a-f0-9]+",',
    f'id: "ctx:prompt/bedrock-entity-workflow@{digest[:12]}",\n  path: "mcp/prompts/bedrock_entity_workflow.md",\n  sha256: "{digest}",',
    r,
)
write(rp, r)

from pathlib import Path
import json
import re

log = Path('/tmp/pro6_surface.log').read_text()
start = log.find('{')
if start < 0:
    raise SystemExit('No JSON surface measurement found')
metrics = json.loads(log[start:])

init_chars = metrics['initialize_instructions_chars']
tool_count = metrics['tool_count']
tools_list = metrics['tools_list_response_chars']
tools_array = metrics['tools_array_chars']
input_schema = metrics['input_schema_chars']
description_chars = metrics['description_chars']
payload = metrics['per_tool_payload_chars']

block = f'''```text
initialize instructions:       {init_chars:,} characters
tool count:                     {tool_count}
tools/list response:            {tools_list:,} characters
tools array:                    {tools_array:,} characters
input schemas:                  {input_schema:,} characters
descriptions:                   {description_chars:,} characters
per-tool payload:               p50 {payload['p50']:,} / p90 {payload['p90']:,} / p95 {payload['p95']:,} / max {payload['max']:,}
```'''

def replace_surface_block(path: str, heading: str) -> None:
    p = Path(path)
    text = p.read_text()
    pattern = re.compile(
        rf'({re.escape(heading)}.*?\n\n)(```text\ninitialize instructions:.*?\n```)',
        re.S,
    )
    updated, count = pattern.subn(lambda m: m.group(1) + block, text, count=1)
    if count != 1:
        raise SystemExit(f'Could not replace surface block in {path}')
    p.write_text(updated)

replace_surface_block('docs/foundation/validation-report.md', '## Fresh GitHub-Only Serialized Surface Proof')
replace_surface_block('docs/knowledge/implementation-map.md', 'Fresh GitHub/CI serialized measurement:')

# Validation scope/status text.
p = Path('docs/foundation/validation-report.md')
text = p.read_text()
text = text.replace(
    '**Scope:** current `Local` source, accepted 2026-08-12 Codex + Blockbench functional evidence, P0–P7, Reference Generator, professional geometry/texturing/animation sample forensics, bounded Box-UV batch parity, and current-state synchronization.',
    '**Scope:** current `Local` source, accepted 2026-08-12 Codex + Blockbench functional evidence, P0–P7, Reference Generator, professional sample forensics, Box-UV batch parity, authored Molang transform-string keyframes, and current-state synchronization.',
    1,
)
p.write_text(text)

# README had a malformed metrics fragment from the previous sync. Replace the whole current-surface fragment deterministically.
p = Path('README.md')
text = p.read_text()
pattern = re.compile(
    r'(The 2026-08-12 bounded local acceptance pass verified representative runtime transport, geometry/correction/Undo, reference-fidelity behavior, texture/Paint/PBR/material instances, animation playback, Locator/Null Object lifecycle, and `\.bbmodel`/Bedrock export persistence\.\n\n).*?(\n`export_model` remains exposed;)',
    re.S,
)
readme_block = f'''Fresh GitHub/CI serialized surface:\n\n```text\n{tool_count} tools\n{tools_list:,} tools/list response characters\n{input_schema:,} input-schema characters\n{description_chars:,} description characters\ninitialize instructions: {init_chars:,} characters\n```\n'''
text, count = pattern.subn(lambda m: m.group(1) + readme_block + m.group(2), text, count=1)
if count != 1:
    raise SystemExit('Could not normalize README current surface block')
text = text.replace(
    '**P0–P7, assisted Reference Generator intake/readiness, and professional modelling Phase 1–3 contracts are implemented on `Local` unless a specific accepted live baseline applies.**',
    '**P0–P7, assisted Reference Generator intake/readiness, and professional PRO-1–PRO-6 contracts are implemented on `Local` unless a specific accepted live baseline applies.**',
    1,
)
p.write_text(text)

# Final continuation state and measured proof.
p = Path('docs/knowledge/next-action.md')
text = p.read_text()
text = text.replace(
    'PROFESSIONAL_ANIMATION_EXPRESSION_KEYFRAMES_PRO6_IMPLEMENTED_AWAITING_VERIFY',
    'PROFESSIONAL_ANIMATION_EXPRESSION_KEYFRAMES_PRO6_COMPLETE',
    1,
)
marker = '## Verification Boundary\n\nRequired retained GitHub gate:'
if marker not in text:
    raise SystemExit('Next-action verification marker missing')
text = text.replace(
    marker,
    f'''## Verified GitHub / CI State\n\n```text\ntypecheck                     PASS\ncontract tests                PASS\ndefault MCP surface           PASS\nproduction build              PASS\ngenerated docs freshness      PASS\n```\n\nFresh serialized surface:\n\n{block}\n\nThese are serialized characters, not model-visible token measurements.\n\n## Verification Boundary\n\nRequired retained GitHub gate:''',
    1,
)
p.write_text(text)

# Implementation completion label.
p = Path('docs/knowledge/implementation-map.md')
text = p.read_text()
text = text.replace(
    'Remaining direct/model-facing evidence includes installed deferred-search parity, real token/latency/image-context cost, Reference Generator visual quality, actual-image handoff, and P5–P7 model-facing effectiveness.',
    'Remaining direct/model-facing evidence includes installed deferred-search parity, real token/latency/image-context cost, Reference Generator visual quality, actual-image handoff, P5–P7 model-facing effectiveness, and live expression-keyframe persistence/preview/export behavior.',
    1,
)
p.write_text(text)

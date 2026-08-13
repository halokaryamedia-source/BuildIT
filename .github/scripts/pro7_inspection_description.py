from pathlib import Path
p = Path('mcp/server/tools/animation-inspection.ts')
t = p.read_text()
old = '"Include full particle-effect keyframes. Keep false for the normal summary path; enable only when effect timing/data is needed."'
new = '"Include full particle/sound effect keyframes. Keep false for summary; enable only when effect timing/data is needed."'
if old not in t:
    raise SystemExit('stale inspect_animation effect description not found')
p.write_text(t.replace(old, new, 1))

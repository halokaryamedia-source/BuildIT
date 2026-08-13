from pathlib import Path

p = Path('.github/scripts/pro7_sound_effects.py')
t = p.read_text()
old = "anchor = '    expect(inspection).toContain(\"include_effect_keyframes\");\\n'\naddition = anchor + '    expect(inspection).toContain(\"sound_count\");\\n    expect(inspection).toContain(\"existingEffects.sound\");\\n'"
new = "anchor = '    expect(inspection).toContain(\\n      \"inspectParticleEffects(animation, include_effect_keyframes)\"\\n    );\\n'\naddition = anchor + '    expect(inspection).toContain(\"sound_count\");\\n    expect(inspection).toContain(\"existingEffects.sound\");\\n'"
if old not in t:
    raise SystemExit('PRO-7 old inspection anchor block not found')
p.write_text(t.replace(old, new, 1))

from pathlib import Path

path = Path(__file__).with_name("apply_prelocal_e2e_hardening.py")
source = path.read_text(encoding="utf-8")
old = '''replace_once(
    stage_reopen,
    "            reconnect_required: activation.changed,",
    "            reconnect_required: false,",
)'''
new = '''replace_once(
    stage_reopen,
    ''' + "'''" + '''            profile_switch_required: true,
            reconnect_required: activation.changed,''''' + "'" + ''',
    ''' + "'''" + '''            profile_switch_required: true,
            reconnect_required: false,''''' + "'" + ''',
)'''
if source.count(old) != 1:
    raise RuntimeError(f"Expected one ambiguous stage-reopen patch block, found {source.count(old)}")
path.write_text(source.replace(old, new, 1), encoding="utf-8")
print("Narrowed stage-reopen patch anchor.")

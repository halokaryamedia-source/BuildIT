from pathlib import Path

path = Path(__file__).with_name("apply_final_flow_efficiency.py")
source = path.read_text(encoding="utf-8")
old = '''replace_once(
    reference_preview,
    ''' + "'''" + '''               `${Math.round(reduction * 100)}% smaller than source).`,''' + "'''" + ''',
    ''' + "'''" + '''               `${Math.round(reduction * 100)}% smaller than source). ` +
               `Next safe operation: ${nextSafeOperation}.`,''' + "'''" + ''',
)'''
new = '''replace_once(
    reference_preview,
    ''' + "'''" + '''              `${Math.round(reduction * 100)}% smaller than source).`,''' + "'''" + ''',
    ''' + "'''" + '''              `${Math.round(reduction * 100)}% smaller than source). ` +
              `Next safe operation: ${nextSafeOperation}.`,''' + "'''" + ''',
)'''
if source.count(old) != 1:
    raise RuntimeError(
        f"Expected one Reference Visual preview anchor block, found {source.count(old)}"
    )
path.write_text(source.replace(old, new, 1), encoding="utf-8")
print("Fixed Reference Visual preview patch indentation anchor.")

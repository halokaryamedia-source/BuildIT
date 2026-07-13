from pathlib import Path

path = Path(__file__).with_name("apply_final_flow_efficiency.py")
source = path.read_text(encoding="utf-8")

old_preview = '''replace_once(
    reference_preview,
    ''' + "'''" + '''               `${Math.round(reduction * 100)}% smaller than source).`,''' + "'''" + ''',
    ''' + "'''" + '''               `${Math.round(reduction * 100)}% smaller than source). ` +
               `Next safe operation: ${nextSafeOperation}.`,''' + "'''" + ''',
)'''
new_preview = '''replace_once(
    reference_preview,
    ''' + "'''" + '''              `${Math.round(reduction * 100)}% smaller than source).`,''' + "'''" + ''',
    ''' + "'''" + '''              `${Math.round(reduction * 100)}% smaller than source). ` +
              `Next safe operation: ${nextSafeOperation}.`,''' + "'''" + ''',
)'''
if source.count(old_preview) != 1:
    raise RuntimeError(
        f"Expected one Reference Visual preview anchor block, found {source.count(old_preview)}"
    )
source = source.replace(old_preview, new_preview, 1)

old_views = '''  const views = [...BASE_FINAL_VIEWS];'''
new_views = '''  const views: string[] = [...BASE_FINAL_VIEWS];'''
if source.count(old_views) != 1:
    raise RuntimeError(
        f"Expected one final-view array declaration, found {source.count(old_views)}"
    )
source = source.replace(old_views, new_views, 1)

path.write_text(source, encoding="utf-8")
print("Fixed final flow patch anchors and final-view typing.")

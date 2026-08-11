from pathlib import Path

asset_path = Path("mcp/tests/asset-authoring-usage-slimming.test.ts")
asset = asset_path.read_text(encoding="utf-8")
old = '''    expect(readme).toContain("## Session Boot");
    expect(readme).toContain("Task Class First");
    expect(readme).toContain("Do not automatically load `CONTEXT.md`");
    expect(readme).not.toContain("## Mandatory Session Boot");'''
new = '''    expect(readme).toContain("## Task Class First");
    expect(readme).toContain("### Asset authoring");
    expect(readme).toContain("Do not automatically load repository history");
    expect(readme).toContain("local-acceptance-runbook.md");
    expect(readme).not.toContain("## Mandatory Session Boot");'''
if asset.count(old) != 1:
    raise SystemExit("asset-authoring README regression anchor changed")
asset_path.write_text(asset.replace(old, new, 1), encoding="utf-8")

context_path = Path("mcp/tests/context-payload-cleanup.test.ts")
context = context_path.read_text(encoding="utf-8")
old = '    expect(next).toContain("LOCAL — Codex + Blockbench acceptance");'
new = '    expect(next).toContain("LOCAL — follow operations/local-acceptance-runbook.md");'
if context.count(old) != 1:
    raise SystemExit("continuity next-step regression anchor changed")
context_path.write_text(context.replace(old, new, 1), encoding="utf-8")

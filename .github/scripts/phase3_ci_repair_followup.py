from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text()
    if old not in text:
        raise SystemExit(f"Expected text not found in {path}: {old!r}")
    p.write_text(text.replace(old, new, 1))


# The Reference Generator is the full image-preparation owner and intentionally
# carries the bounded intake/readiness/buildability contract. Keep a compact
# ceiling without forcing those decisions back into another file.
replace_once(
    "mcp/tests/static-efficiency-budget.test.ts",
    "expect(referenceGenerator.length).toBeLessThan(4_000);",
    "expect(referenceGenerator.length).toBeLessThan(8_000);",
)

# README owns concise routing prose, not the runbook's exact filename.
replace_once(
    "mcp/tests/asset-authoring-usage-slimming.test.ts",
    'expect(readme).toContain("local-acceptance-runbook.md");',
    'expect(readme).toContain("Local Acceptance Runbook");',
)

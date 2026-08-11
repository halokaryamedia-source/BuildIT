from pathlib import Path
import re

PLAN = Path("docs/knowledge/operations/mcp-reduction-stabilization-plan.md")
text = PLAN.read_text(encoding="utf-8")
old = """# MCP Reduction & Stabilization Plan

Updated: 2026-08-10

Status: **Approved planning direction — source implementation not started**
"""
new = """# MCP Reduction & Stabilization Plan

Updated: 2026-08-11

Status: **Historical/completed — the bounded non-local stabilization pass was implemented and this plan no longer controls current execution.**

Current status is owned by `docs/knowledge/next-action.md`. Current local procedure is `docs/knowledge/operations/local-acceptance-runbook.md`. Keep the body below as implementation provenance; do not restart unchecked items solely because they remain in this historical plan.
"""
if text.count(old) != 1:
    raise SystemExit("stabilization plan header anchor changed")
PLAN.write_text(text.replace(old, new, 1), encoding="utf-8")

expected_skills = sorted([
    "blockbench-bedrock-modelling",
    "blockbench-runtime-development",
    "blockit-bedrock-animation",
    "blockit-bedrock-entity-mcp",
    "blockit-bedrock-texturing",
    "bun-tooling",
    "development-brief",
    "mcp-server-development",
    "typescript-type-safety",
])
actual_skills = sorted(p.name for p in Path(".agents/skills").iterdir() if p.is_dir())
if actual_skills != expected_skills:
    raise SystemExit(f"skill inventory mismatch: {actual_skills}")

active = [
    Path("README.md"),
    Path("CONTEXT.md"),
    Path("AGENTS.md"),
    Path("docs/README.md"),
    Path("docs/foundation/README.md"),
    Path("docs/foundation/validation-report.md"),
    Path("docs/knowledge/index.md"),
    Path("docs/knowledge/minimal-nav.md"),
    Path("docs/knowledge/next-action.md"),
    Path("docs/knowledge/flow.md"),
    Path("docs/knowledge/workspace-map.md"),
    Path("docs/knowledge/implementation-map.md"),
    Path("docs/knowledge/modules/module-map.md"),
    Path("docs/knowledge/modules/skill-ownership.md"),
    Path("docs/knowledge/skills/activation-matrix.md"),
    Path("docs/knowledge/skills/skill-map.md"),
    Path("docs/knowledge/sources/source-map.md"),
    Path("docs/knowledge/operations/README.md"),
    Path("docs/knowledge/operations/local-acceptance-runbook.md"),
    Path("docs/knowledge/operations/task-board.md"),
    Path("docs/knowledge/operations/roadmap.md"),
    Path("docs/knowledge/reviews/review-graph.md"),
    Path("mcp/README.md"),
    Path("mcp/AGENTS.md"),
]
for path in active:
    if not path.exists():
        raise SystemExit(f"missing active owner: {path}")

joined = "\n".join(path.read_text(encoding="utf-8") for path in active)
for phrase in [
    "mcp/prompts/bedrock.md",
    "exactly six canonical skills",
    "Local Blockbench testing is intentionally deferred",
    "When local testing becomes the priority",
    "omitted/empty scope means no Group scope",
    "omitted/empty pattern means no regex filter",
]:
    if phrase in joined:
        raise SystemExit(f"stale active documentation phrase: {phrase}")

next_text = Path("docs/knowledge/next-action.md").read_text(encoding="utf-8")
runbook = Path("docs/knowledge/operations/local-acceptance-runbook.md").read_text(encoding="utf-8")
validation = Path("docs/foundation/validation-report.md").read_text(encoding="utf-8")
operations = Path("docs/knowledge/operations/README.md").read_text(encoding="utf-8")
plan = PLAN.read_text(encoding="utf-8")

checks = [
    ("NON_LOCAL_PRELOCAL_READINESS_COMPLETE_LOCAL_ACCEPTANCE_REQUIRED", next_text),
    ("LOCAL — follow operations/local-acceptance-runbook.md", next_text),
    ("Do not edit source while establishing the baseline", runbook),
    ("Failure Classification Before Fix", runbook),
    ("LOCAL PROOF REQUIRED", validation),
    ("historical/completed", operations),
    ("Historical/completed", plan),
    ("mcp/prompts/bedrock_entity_workflow.md", joined),
]
for needle, haystack in checks:
    if needle not in haystack:
        raise SystemExit(f"missing handoff invariant: {needle}")

if len(next_text) >= 8000:
    raise SystemExit(f"next-action too large: {len(next_text)}")
if len(runbook) >= 18000:
    raise SystemExit(f"runbook unexpectedly bloated: {len(runbook)}")

link_re = re.compile(r"\[[^\]]+\]\(([^)]+)\)")
repo = Path.cwd().resolve()
broken = []
for path in active:
    for target in link_re.findall(path.read_text(encoding="utf-8")):
        if "://" in target or target.startswith("#"):
            continue
        raw = target.split("#", 1)[0]
        if not raw:
            continue
        resolved = (path.parent / raw).resolve()
        try:
            resolved.relative_to(repo)
        except ValueError:
            continue
        if not resolved.exists():
            broken.append(f"{path} -> {target}")
if broken:
    raise SystemExit("broken active documentation links:\n" + "\n".join(broken))

print(f"active_docs={len(active)}")
print(f"skills={len(actual_skills)}")
print(f"next_action_chars={len(next_text)}")
print(f"runbook_chars={len(runbook)}")

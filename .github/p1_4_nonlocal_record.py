from pathlib import Path

PROOF_PATH = "docs/knowledge/reviews/mcp-p1-4-nonlocal-compatibility-proof-2026-08-10.md"

# Keep the active snapshot status unchanged; only point future sessions to the
# strongest non-local evidence that now exists.
next_action = Path("docs/knowledge/next-action.md")
text = next_action.read_text()
pointer = f"Latest P1.4 non-local compatibility proof: `{PROOF_PATH}`.\n"
if pointer not in text:
    needle = "Live Blockbench/MCP behavior remains local proof where applicable.\n"
    if text.count(needle) != 1:
        raise SystemExit(f"next-action pointer anchor mismatch: {text.count(needle)}")
    text = text.replace(needle, needle + "\n" + pointer, 1)
next_action.write_text(text.rstrip() + "\n")

# The original decision review remains the decision owner. Add only a compact
# follow-up pointer rather than duplicating the full proof record.
decision = Path("docs/knowledge/reviews/mcp-transport-session-decision-2026-08-10.md")
text = decision.read_text()
heading = "## Non-local compatibility follow-up"
if heading not in text:
    text = text.rstrip() + f'''\n\n{heading}\n\nThe strongest non-local compatibility evidence is recorded separately at:\n\n```text\n{PROOF_PATH}\n```\n\nIt records the pinned TypeScript SDK stateless example, current Codex direct Streamable HTTP path, exact `rmcp-v3.0.0` stateless behavior, Codex's current `2025-06-18` initialization revision, pinned-SDK executable request sequencing, raw `node:net` TCP integration, canonical 32/32 test proof, and the prepared local smoke command.\n\nThis follow-up does **not** change the decision or proof boundary: P1.4 remains source/non-local complete with real Blockbench + Codex runtime proof still required before P1.5.\n'''
decision.write_text(text.rstrip() + "\n")

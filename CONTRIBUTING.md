# Contributing to BlockIT

BlockIT is developed on the `Local` branch and released or promoted elsewhere only by explicit maintainer instruction. Keep contributions small, evidence-driven, and aligned with the repository owners instead of introducing parallel workflows or frameworks.

## Branch model

```text
Local  → active development / working authority
main   → not a routine development target
```

Maintainers normally work directly on `Local`. External contributions should target `Local` unless a maintainer explicitly requests another base. Do not target or modify `main` as part of ordinary development.

## Before changing code

Start from the smallest owner that can actually explain the requested change:

- repository routing and task class → `AGENTS.md`;
- GitHub delivery/history/CI/security → `GITHUB_RULES.md`;
- stable product facts → `CONTEXT.md`;
- current continuation → `docs/knowledge/next-action.md` only when material;
- source/tool ownership → `docs/knowledge/implementation-map.md`;
- MCP package implementation → `mcp/AGENTS.md`;
- persistent asset work → `workspace/README.md`.

Do not broad-read the repository or historical material for reassurance. Fix the first wrong owner and keep unrelated cleanup outside the change.

## Verification

Use the cheapest check that can falsify the changed claim.

Repository/routing/static-policy changes use the repository or authoring-policy verification surface that owns them. Executable/public MCP changes use the canonical MCP gate from `mcp/`:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:check
```

Do not run the full MCP gate merely because a Markdown or repository-routing file changed. Live Blockbench, visual, playback, persistence, and installed-plugin claims require matching local/runtime evidence.

## Generated files

Generated MCP API documentation and prompt manifests follow their canonical source + generator. Do not hand-edit generated output to make a verifier pass.

Transient captures, previews, sample renders, caches, and per-mutation screenshots do not belong at repository root. Use the existing ignored `.cache/` locations under persistent workspace or `Experimental/` work when temporary visual/debug evidence is needed.

## Commit discipline

One coherent outcome should normally be one reviewable commit.

```text
feat:      new capability
fix:       behavior correction
refactor:  behavior-preserving restructuring
docs:      documentation/policy-only change
test:      test-contract-only change
ci:        workflow/CI change
build:     dependency/toolchain change
chore:     bounded maintenance when no better category fits
```

Do not create checkpoint commits, transfer experiments, placeholder files, temporary workflows, or compatibility layers solely to move data through GitHub.

## Repository hygiene

- never commit credentials, tokens, private keys, or local `.env` values;
- keep dependencies and action revisions pinned according to current repository policy;
- keep `workspace/active/<project>/README.md` resume-critical rather than chronological;
- prefer one current editable `.bbmodel` per persistent asset package;
- keep discarded iterations and retired repository state in Git history instead of parallel live archives;
- do not add new skills, routers, profiles, manifests, registries, or framework layers without a demonstrated requirement.

## License

BlockIT is distributed under the GNU General Public License v3.0. See `LICENSE` for the full terms.

# Next Action
Updated: 2026-09-10
Branch: `Local` only.

## Source closure

SOURCE_READY for the remote retirement partition: obsolete Experimental work and the active 3D-assisted authoring route are retired from current product semantics.

AUTHORING TAXONOMY: Geometry/rig/UV; Texture; Animation. BlockIT now uses one native Geometry authoring path. The previous 3D-assisted/Hunyuan/PrimitiveAnything route is retired and must not be used or revived by routing/discovery.

## Current work

Finish the minimum `LOCAL_CODE` generator residue before treating the retirement as fully generated-source clean:

```text
remove the two retired compatibility ToolSpec descriptors
remove retired text from mcp/prompts/bedrock_entity_workflow.md
→ bun run prompts:build
→ bun run docs:build
→ bun run verify:full
→ commit generated output with its canonical source
```

Do not redo the already-completed Experimental/source retirement or reintroduce a second modelling route merely to preserve old generated docs.

After the retirement source/generator gate is green, resume the separate `Experimental/blockit-navigator/` design/implementation discussion. Navigator remains Experimental until its context/usage benefit is measured without changing canonical meaning.

## Proof boundary

Current remote cleanup does not prove installed Blockbench activation, native authoring behavior, visual quality, or token savings. Do not run old 3D-assisted tests or historical asset experiments. Git history owns retired evidence.

# ChatGPT Upload ZIP Rebuild Instructions

Use this when any ChatGPT-facing source document changes.

Also use this whenever modelling logic changes in any of these files:

- `SourceDocument/modeling/mandatory-blockbench-mcp-procedure.md`
- `SourceDocument/modeling/phase-detail-contract.md`
- `SourceDocument/modeling/quality-implementation-rules.md`
- `SourceDocument/modeling/minecraft-scale-reference.md`
- `SourceDocument/modeling/blockbench-scale-rules.md`
- `SourceDocument/modeling/reference-package-pass-fail-checklist.md`
- `SourceDocument/modeling/model-session-checklist-template.md`
- `SourceDocument/modeling/operator-one-page-checklist.md`
- `SourceDocument/modeling/blockbench-sample-knowledge-base.md`
- `SourceDocument/modeling/chatgpt-image-output-rules.md`
- `SourceDocument/modeling/chatgpt-kangaroo-layout-style-guide.md`
- `SourceDocument/modeling/minecraft-style-image-conversion-preflight.md`
- `SourceDocument/modeling/minecraft-style-image-conversion-rules.md`
- `SourceDocument/modeling/minecraft-style-image-conversion-mandatory-prompt.md`
- `SourceDocument/blockbench-samples/`

Rule: if Codex geometry logic changes, the ChatGPT reference generator ZIP must be rebuilt before the next ChatGPT reference run.

This is intentionally manual. No new script or dependency is required.

## Output

```text
SourceDocument/chatgpt-bedrock-blockbench-reference-generator-upload.zip
```

## Contents

```text
SYSTEM_READ_FIRST.md
START_AFTER_UPLOAD.md
00_START_HERE_UPLOAD_THIS_TO_CHATGPT.md
README.md
sample_reference_images_kangaroo_format_only/
ninja-master-bedrock-entity/
blockbench_samples/
supporting_docs/
reference_templates/
```

## Rebuild Command

Run from the repository root:

```powershell
$pkg = Join-Path $env:TEMP 'chatgpt-bedrock-blockbench-reference-generator-upload'
Remove-Item -Recurse -Force $pkg -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path (Join-Path $pkg 'sample_reference_images_kangaroo_format_only'), (Join-Path $pkg 'supporting_docs'), (Join-Path $pkg 'reference_templates') | Out-Null

Copy-Item -Path 'SourceDocument\\reference-samples\\legacy\\kangaroo_legacy_9sheet\\*.png' -Destination (Join-Path $pkg 'sample_reference_images_kangaroo_format_only') -Force
New-Item -ItemType Directory -Force -Path (Join-Path $pkg 'ninja-master-bedrock-entity') | Out-Null
Copy-Item -Path 'SourceDocument\\reference-samples\\ninja-master-bedrock-entity\\*' -Destination (Join-Path $pkg 'ninja-master-bedrock-entity') -Force
Copy-Item -Path 'SourceDocument\\reference-templates\\*' -Destination (Join-Path $pkg 'reference_templates') -Force
Copy-Item -Path 'SourceDocument\\modeling\\chatgpt-system-read-first.md' -Destination (Join-Path $pkg 'SYSTEM_READ_FIRST.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\chatgpt-start-after-upload.md' -Destination (Join-Path $pkg 'START_AFTER_UPLOAD.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\chatgpt-ready-reference-generator-prompt.md' -Destination (Join-Path $pkg '00_START_HERE_UPLOAD_THIS_TO_CHATGPT.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\chatgpt-context-retention-protocol.md' -Destination (Join-Path $pkg 'supporting_docs\\chatgpt-context-retention-protocol.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\chatgpt-image-output-rules.md' -Destination (Join-Path $pkg 'supporting_docs\\chatgpt-image-output-rules.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\chatgpt-kangaroo-layout-style-guide.md' -Destination (Join-Path $pkg 'supporting_docs\\chatgpt-kangaroo-layout-style-guide.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\phase-detail-contract.md' -Destination (Join-Path $pkg 'supporting_docs\\phase-detail-contract.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\quality-implementation-rules.md' -Destination (Join-Path $pkg 'supporting_docs\\quality-implementation-rules.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\minecraft-scale-reference.md' -Destination (Join-Path $pkg 'supporting_docs\\minecraft-scale-reference.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\blockbench-scale-rules.md' -Destination (Join-Path $pkg 'supporting_docs\\blockbench-scale-rules.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\model-session-checklist-template.md' -Destination (Join-Path $pkg 'supporting_docs\\model-session-checklist-template.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\model-session-folder-convention.md' -Destination (Join-Path $pkg 'supporting_docs\\model-session-folder-convention.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\reference-package-pass-fail-checklist.md' -Destination (Join-Path $pkg 'supporting_docs\\reference-package-pass-fail-checklist.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\ops\\phase-risk-simulation.md' -Destination (Join-Path $pkg 'supporting_docs\\phase-risk-simulation.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\operator-one-page-checklist.md' -Destination (Join-Path $pkg 'supporting_docs\\operator-one-page-checklist.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\ops\\README.md' -Destination (Join-Path $pkg 'supporting_docs\\ops-README.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\ai-reference-generation-guide.md' -Destination (Join-Path $pkg 'supporting_docs\\ai-reference-generation-guide.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\minecraft-style-image-conversion-preflight.md' -Destination (Join-Path $pkg 'supporting_docs\\minecraft-style-image-conversion-preflight.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\minecraft-style-image-conversion-rules.md' -Destination (Join-Path $pkg 'supporting_docs\\minecraft-style-image-conversion-rules.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\minecraft-style-image-conversion-mandatory-prompt.md' -Destination (Join-Path $pkg 'supporting_docs\\minecraft-style-image-conversion-mandatory-prompt.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\common-failure-patterns.md' -Destination (Join-Path $pkg 'supporting_docs\\common-failure-patterns.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\engine-bootstrap-faststart.md' -Destination (Join-Path $pkg 'supporting_docs\\engine-bootstrap-faststart.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\marketplace-quality-baseline.md' -Destination (Join-Path $pkg 'supporting_docs\\marketplace-quality-baseline.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\marketplace-sample-knowledge-base.md' -Destination (Join-Path $pkg 'supporting_docs\\marketplace-sample-knowledge-base.md') -Force
Copy-Item -Path 'SourceDocument\\modeling\\blockbench-sample-knowledge-base.md' -Destination (Join-Path $pkg 'supporting_docs\\blockbench-sample-knowledge-base.md') -Force
New-Item -ItemType Directory -Force -Path (Join-Path $pkg 'blockbench_samples') | Out-Null
Copy-Item -Path 'SourceDocument\\blockbench-samples\\*' -Destination (Join-Path $pkg 'blockbench_samples') -Force

$readme = @"
# ChatGPT Reference Context Package

Start with `START_AFTER_UPLOAD.md`. It tells ChatGPT to read `SYSTEM_READ_FIRST.md`, then `00_START_HERE_UPLOAD_THIS_TO_CHATGPT.md`, and ask the user setup questions before generating anything.

The kangaroo images are format samples only. Do not create a kangaroo unless explicitly requested.
The Blockbench samples are structure and quality calibration only. Do not copy their asset designs, names, textures, or animations.
For non-Minecraft source images, run `supporting_docs/minecraft-style-image-conversion-preflight.md` before image generation and use `supporting_docs/minecraft-style-image-conversion-mandatory-prompt.md` verbatim for the first conversion test.
Package generated: $(Get-Date -Format 'yyyy-MM-dd')
"@

Set-Content -Path (Join-Path $pkg 'README.md') -Value $readme -Encoding UTF8
Compress-Archive -Path (Join-Path $pkg '*') -DestinationPath 'SourceDocument\\chatgpt-bedrock-blockbench-reference-generator-upload.zip' -Force
```

## Acceptance Criteria

- ZIP contains the first-read prompt.
- ZIP contains the start-after-upload prompt.
- ZIP contains the ChatGPT-ready prompt.
- ZIP contains the ChatGPT context retention protocol.
- ZIP contains the ChatGPT image output rules.
- ZIP contains the ChatGPT kangaroo layout and Minecraft style guide.
- ZIP contains the Minecraft style image conversion preflight, rules, and mandatory prompt.
- ZIP contains sample reference images.
- ZIP contains the Ninja Master ground-truth reference test when present.
- ZIP contains reference templates, including `reference_manifest.template.json`.
- ZIP contains `reference_sheet_notes_template.md`.
- ZIP contains `codex_reference_handoff_template.md`.
- ZIP contains phase, quality, session, risk, and reference guide docs.
- ZIP reflects the current Codex geometry logic, including Geometry Blueprint and decision-path rules.
- ZIP reflects the current marketplace-grade quality baseline.
- ZIP includes the Blockbench sample knowledge base and sample `.bbmodel` files when those samples are part of the active reference logic.
- ZIP includes `blockbench_samples/sample_selection_manifest.json`.

## Minimum Expected Supporting Docs in ZIP

```text
SYSTEM_READ_FIRST.md
START_AFTER_UPLOAD.md
00_START_HERE_UPLOAD_THIS_TO_CHATGPT.md
chatgpt-context-retention-protocol.md
chatgpt-image-output-rules.md
chatgpt-kangaroo-layout-style-guide.md
phase-detail-contract.md
quality-implementation-rules.md
minecraft-scale-reference.md
blockbench-scale-rules.md
minecraft-style-image-conversion-preflight.md
minecraft-style-image-conversion-rules.md
minecraft-style-image-conversion-mandatory-prompt.md
model-session-checklist-template.md
model-session-folder-convention.md
reference-package-pass-fail-checklist.md
phase-risk-simulation.md
operator-one-page-checklist.md
ops-README.md
ai-reference-generation-guide.md
common-failure-patterns.md
engine-bootstrap-faststart.md
marketplace-quality-baseline.md
marketplace-sample-knowledge-base.md
blockbench-sample-knowledge-base.md
ninja-master-bedrock-entity/ninja_master_ground_truth.md
blockbench_samples/sample_selection_manifest.json
blockbench_samples/*.bbmodel
reference_templates/reference_manifest.template.json
reference_templates/reference_sheet_notes_template.md
reference_templates/codex_reference_handoff_template.md
reference_templates/geometry_reference_package_template.md
reference_templates/golden_lantern_sprite_entity_example.md
reference_templates/golden_lantern_sprite_entity_manifest.example.json
```

# Export Targets

## Bedrock / Education Target

Bedrock / Education is the primary target unless the brief specifies otherwise.

Expected outputs may include:

- Model file suitable for the selected Bedrock / Education workflow.
- Texture image files.
- Animation files when animation is in scope.
- Supporting metadata when required by the selected project format.

## Java Target

Java is conditional. Use it only when the brief or project format requires Java output.

Expected outputs may include:

- Java block or item model output.
- Texture image files.
- Format-specific metadata when required.

## Export Rules

- Verify the target platform before export.
- Verify output filenames and paths.
- Verify texture references after export.
- Verify animation output only when animation is in scope.
- Do not overwrite important files without approval.

## Known Limitations

- `Needs verification`: Exact export formats depend on active Blockbench project type and installed plugins.
- `Assumption`: Bedrock / Education is the default planning target for Minecraft creator workflows.
- `Out of scope`: Adding new exporters or modifying export tools in this planning phase.

## Acceptance Criteria

- Target platform is explicit.
- Expected model, texture, and animation outputs are documented.
- Java target is treated as conditional.
- Export overwrite risks require approval.
- Limitations are labelled.

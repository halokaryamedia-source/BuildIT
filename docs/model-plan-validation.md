# Model Plan Validation

BuildIT validates every generated `model_plan.json` before sending tool actions to Blockbench MCP.

## Output

Validation reports are stored at:

```txt
outputs/jobs/<jobId>/model_plan_validation.json
```

## Validation goals

- Ensure the plan uses a supported format: `bedrock` or `bedrock_block`.
- Ensure the plan has at least one group and at least one cube part.
- Ensure every part references an existing group.
- Ensure every cube has positive size on every axis.
- Warn when Bedrock Block plans look like entity models.
- Warn when Bedrock Entity plans do not contain a stable entity core group.

## Bedrock Block validation context

Bedrock Block means a placeable Minecraft Bedrock custom block.

Validation warns when a block plan:

- uses entity-like groups such as `head` or `limbs`,
- uses a name that suggests a mob or entity,
- becomes wider than the recommended placeable block footprint.

Warnings do not stop execution. Errors stop execution before Blockbench MCP receives tool actions.

## Report shape

```json
{
  "valid": true,
  "format": "bedrock_block",
  "checkedAt": "2026-01-01T00:00:00.000Z",
  "issues": []
}
```

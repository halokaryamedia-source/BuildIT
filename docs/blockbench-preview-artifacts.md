# Blockbench Preview Artifacts

BuildIT preserves the result of the Blockbench MCP screenshot action.

## Output

```txt
outputs/jobs/<jobId>/blockbench_preview.json
```

## Report shape

```json
{
  "capturedAt": "2026-01-01T00:00:00.000Z",
  "toolName": "capture_screenshot",
  "hasImageDataUrl": true,
  "imageDataUrl": "data:image/png;base64,...",
  "rawResult": {}
}
```

## Desktop behavior

The desktop app lists `blockbench_preview.json` in the job artifact list.

When `imageDataUrl` is available, the desktop app renders the image above the JSON viewer. If the MCP screenshot tool only returns metadata, the JSON remains available for debugging.

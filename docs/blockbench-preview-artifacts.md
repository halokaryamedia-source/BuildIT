# Blockbench Preview Artifacts

BuildIT preserves and validates the result of the Blockbench MCP screenshot action.

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
  "validation": {
    "valid": true,
    "imageMimeType": "image/png",
    "estimatedImageBytes": 123456,
    "issues": []
  },
  "rawResult": {}
}
```

## Validation

Preview validation checks that:

- an image data URL exists,
- the image data URL uses an image MIME type,
- the base64 payload is present,
- the estimated image size is not suspiciously tiny,
- the estimated image size is not excessively large.

Missing or invalid preview image data is treated as an error because preview is the fastest proof that Blockbench MCP created a visible result.

## Desktop behavior

The desktop app lists `blockbench_preview.json` in the job artifact list.

When `imageDataUrl` is available, the desktop app renders the image above the JSON viewer. If the MCP screenshot tool only returns metadata, the JSON remains available for debugging.

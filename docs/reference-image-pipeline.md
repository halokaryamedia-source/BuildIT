# Reference Image Pipeline

The desktop app can attach one reference image to a model generation job.

## Flow

1. The user selects an image in the desktop composer.
2. The desktop app reads the image as a Data URL.
3. The desktop app sends the image through `POST /api/jobs` in the `referenceImages` field.
4. The engine stores the image under `outputs/jobs/<jobId>/references/`.
5. The job input receives both `imagePaths` and `referenceImages` metadata.
6. The workflow sends the saved image path to the vision analyzer.
7. The vision analyzer calls the configured Ollama vision model.
8. The engine saves `image_analysis.json` under the job output folder.

## Request shape

```json
{
  "prompt": "Create a medieval street light.",
  "referenceImages": [
    {
      "fileName": "street-light.png",
      "mimeType": "image/png",
      "dataUrl": "data:image/png;base64,..."
    }
  ],
  "format": "bbmodel",
  "autoReview": true
}
```

## Output locations

```txt
outputs/jobs/<jobId>/references/<safe-file-name>
outputs/jobs/<jobId>/image_analysis.json
```

The saved path is stored in the job as `input.imagePaths` and detailed metadata is stored in `input.referenceImages`.
The image analysis file contains object type, visible parts, shape notes, color palette, material hints, modeling priorities, and risks.

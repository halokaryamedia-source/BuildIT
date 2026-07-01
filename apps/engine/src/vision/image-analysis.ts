import { z } from "zod";

export const ImageAnalysisSchema = z.object({
  objectType: z.string(),
  summary: z.string(),
  visibleParts: z.array(z.string()),
  shapeNotes: z.array(z.string()),
  colorPalette: z.array(z.string()),
  materialHints: z.array(z.string()),
  modelingPriorities: z.array(z.string()),
  risks: z.array(z.string())
});

export type ImageAnalysis = z.infer<typeof ImageAnalysisSchema>;

export function createFallbackImageAnalysis(prompt: string): ImageAnalysis {
  return {
    objectType: "unknown object",
    summary: "The reference image could not be analyzed reliably. Use the user prompt as the primary modeling source.",
    visibleParts: [],
    shapeNotes: ["Prioritize a readable voxel silhouette."],
    colorPalette: [],
    materialHints: [],
    modelingPriorities: ["Create a clear Minecraft-style blockout before adding small details."],
    risks: ["Vision analysis fallback was used for prompt: " + prompt]
  };
}

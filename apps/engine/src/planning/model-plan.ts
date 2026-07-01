import { z } from "zod";

export const CubePartSchema = z.object({
  name: z.string(),
  group: z.string(),
  from: z.tuple([z.number(), z.number(), z.number()]),
  to: z.tuple([z.number(), z.number(), z.number()]),
  material: z.string()
});

export const ModelPlanSchema = z.object({
  name: z.string(),
  format: z.string(),
  groups: z.array(z.string()),
  parts: z.array(CubePartSchema)
});

export type ModelPlan = z.infer<typeof ModelPlanSchema>;

export function createFallbackPlan(prompt: string): ModelPlan {
  const safeName = prompt.trim().split(" ").slice(0, 6).join("_") || "voxel_object";

  return {
    name: safeName,
    format: "bedrock",
    groups: ["root", "base", "body", "details"],
    parts: [
      {
        name: "base_block",
        group: "base",
        from: [-4, 0, -4],
        to: [4, 2, 4],
        material: "stone"
      },
      {
        name: "main_body",
        group: "body",
        from: [-2, 2, -2],
        to: [2, 12, 2],
        material: "wood"
      },
      {
        name: "top_detail",
        group: "details",
        from: [-3, 12, -3],
        to: [3, 15, 3],
        material: "metal"
      }
    ]
  };
}

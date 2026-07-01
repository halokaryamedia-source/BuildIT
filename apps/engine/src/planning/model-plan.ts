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
  format: z.enum(["bedrock", "bedrock_block"]),
  groups: z.array(z.string()),
  parts: z.array(CubePartSchema)
});

export type ModelPlan = z.infer<typeof ModelPlanSchema>;

function createSafeName(prompt: string): string {
  return prompt.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 48) || "voxel_model";
}

export function createFallbackPlan(prompt: string, format: "bedrock" | "bedrock_block" = "bedrock"): ModelPlan {
  const safeName = createSafeName(prompt);

  if (format === "bedrock_block") {
    return {
      name: safeName,
      format: "bedrock_block",
      groups: ["root", "base", "block_body", "decorative_details"],
      parts: [
        {
          name: "block_base",
          group: "base",
          from: [-8, 0, -8],
          to: [8, 2, 8],
          material: "stone"
        },
        {
          name: "block_body",
          group: "block_body",
          from: [-5, 2, -5],
          to: [5, 12, 5],
          material: "wood"
        },
        {
          name: "top_detail",
          group: "decorative_details",
          from: [-6, 12, -6],
          to: [6, 16, 6],
          material: "metal"
        }
      ]
    };
  }

  return {
    name: safeName,
    format: "bedrock",
    groups: ["root", "body", "head", "accessories"],
    parts: [
      {
        name: "body_core",
        group: "body",
        from: [-4, 0, -2],
        to: [4, 10, 2],
        material: "main_material"
      },
      {
        name: "head_core",
        group: "head",
        from: [-3, 10, -3],
        to: [3, 16, 3],
        material: "main_material"
      },
      {
        name: "accessory_detail",
        group: "accessories",
        from: [-5, 4, 2],
        to: [5, 12, 5],
        material: "detail_material"
      }
    ]
  };
}

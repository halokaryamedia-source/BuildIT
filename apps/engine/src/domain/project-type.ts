export type ProjectType = "bedrock_entity" | "bedrock_block";

export const projectTypes: ProjectType[] = ["bedrock_entity", "bedrock_block"];

export function isProjectType(value: unknown): value is ProjectType {
  return value === "bedrock_entity" || value === "bedrock_block";
}

export function getProjectTypeLabel(projectType: ProjectType): string {
  return projectType === "bedrock_entity" ? "Bedrock Entity" : "Bedrock Block";
}

export function getBlockbenchFormat(projectType: ProjectType): string {
  return projectType === "bedrock_entity" ? "bedrock" : "bedrock_block";
}

export function getProjectTypeInstructions(projectType: ProjectType): string {
  if (projectType === "bedrock_entity") {
    return [
      "Target project type: Minecraft Bedrock Entity.",
      "Treat the model as an entity model, not a placeable block.",
      "Prefer entity-style groups such as root, body, head, limbs, accessories, and details.",
      "Keep the model suitable for future animation even if animation is not generated yet."
    ].join("\n");
  }

  return [
    "Target project type: Minecraft Bedrock custom block.",
    "Treat the model as a placeable Minecraft block that exists in the world.",
    "Do not treat it as an entity, mob, wearable, or free prop.",
    "Prefer block-style groups such as root, base, sides, top, core, and decorative details.",
    "Keep the model readable as a static block with world placement context."
  ].join("\n");
}

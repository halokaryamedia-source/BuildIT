import type { ModelPlan } from "./model-plan.js";

export interface ModelPlanValidationIssue {
  severity: "error" | "warning";
  code: string;
  message: string;
}

export interface ModelPlanValidationReport {
  valid: boolean;
  format: string;
  checkedAt: string;
  issues: ModelPlanValidationIssue[];
}

function isFiniteNumber(value: number): boolean {
  return Number.isFinite(value);
}

function validatePartBounds(plan: ModelPlan, issues: ModelPlanValidationIssue[]): void {
  for (const part of plan.parts) {
    const coordinates = [...part.from, ...part.to];

    if (!coordinates.every(isFiniteNumber)) {
      issues.push({
        severity: "error",
        code: "INVALID_COORDINATE",
        message: "Part " + part.name + " contains a non-finite coordinate."
      });
    }

    for (let axis = 0; axis < 3; axis += 1) {
      if (part.to[axis] <= part.from[axis]) {
        issues.push({
          severity: "error",
          code: "INVALID_CUBE_SIZE",
          message: "Part " + part.name + " must have positive size on every axis."
        });
      }
    }
  }
}

function validateGroupReferences(plan: ModelPlan, issues: ModelPlanValidationIssue[]): void {
  const groups = new Set(plan.groups);

  for (const part of plan.parts) {
    if (!groups.has(part.group)) {
      issues.push({
        severity: "error",
        code: "UNKNOWN_GROUP",
        message: "Part " + part.name + " references missing group " + part.group + "."
      });
    }
  }
}

function validateBedrockBlockContext(plan: ModelPlan, issues: ModelPlanValidationIssue[]): void {
  if (plan.format !== "bedrock_block") return;

  const lowerName = plan.name.toLowerCase();
  const joinedGroups = plan.groups.join(" ").toLowerCase();

  if (joinedGroups.includes("head") || joinedGroups.includes("limb")) {
    issues.push({
      severity: "warning",
      code: "ENTITY_GROUP_IN_BLOCK_PLAN",
      message: "Bedrock Block plans should not use entity-like groups such as head or limbs."
    });
  }

  if (lowerName.includes("mob") || lowerName.includes("entity")) {
    issues.push({
      severity: "warning",
      code: "ENTITY_NAME_IN_BLOCK_PLAN",
      message: "Bedrock Block plans should describe a placeable Minecraft custom block, not an entity."
    });
  }

  const minX = Math.min(...plan.parts.map((part) => part.from[0]));
  const maxX = Math.max(...plan.parts.map((part) => part.to[0]));
  const minZ = Math.min(...plan.parts.map((part) => part.from[2]));
  const maxZ = Math.max(...plan.parts.map((part) => part.to[2]));

  if (minX < -16 || maxX > 16 || minZ < -16 || maxZ > 16) {
    issues.push({
      severity: "warning",
      code: "WIDE_BLOCK_BOUNDS",
      message: "Bedrock Block geometry is wider than the recommended placeable block footprint."
    });
  }
}

function validateBedrockEntityContext(plan: ModelPlan, issues: ModelPlanValidationIssue[]): void {
  if (plan.format !== "bedrock") return;

  const joinedGroups = plan.groups.join(" ").toLowerCase();

  if (!joinedGroups.includes("body") && !joinedGroups.includes("root")) {
    issues.push({
      severity: "warning",
      code: "MISSING_ENTITY_CORE_GROUP",
      message: "Bedrock Entity plans should include root or body groups for a stable entity structure."
    });
  }
}

export function validateModelPlan(plan: ModelPlan): ModelPlanValidationReport {
  const issues: ModelPlanValidationIssue[] = [];

  if (plan.format !== "bedrock" && plan.format !== "bedrock_block") {
    issues.push({
      severity: "error",
      code: "UNSUPPORTED_FORMAT",
      message: "Model plan format must be bedrock or bedrock_block."
    });
  }

  if (plan.groups.length === 0) {
    issues.push({
      severity: "error",
      code: "NO_GROUPS",
      message: "Model plan must include at least one group."
    });
  }

  if (plan.parts.length === 0) {
    issues.push({
      severity: "error",
      code: "NO_PARTS",
      message: "Model plan must include at least one cube part."
    });
  }

  validateGroupReferences(plan, issues);
  validatePartBounds(plan, issues);
  validateBedrockBlockContext(plan, issues);
  validateBedrockEntityContext(plan, issues);

  return {
    valid: !issues.some((issue) => issue.severity === "error"),
    format: plan.format,
    checkedAt: new Date().toISOString(),
    issues
  };
}

import type { McpToolCall } from "../mcp/blockbench-client.js";
import type { ModelPlan } from "./model-plan.js";

export function modelPlanToToolActions(plan: ModelPlan): McpToolCall[] {
  const actions: McpToolCall[] = [
    {
      name: "create_project",
      arguments: {
        name: plan.name,
        format: plan.format
      }
    }
  ];

  for (const group of plan.groups) {
    actions.push({
      name: "add_group",
      arguments: {
        name: group,
        origin: [0, 0, 0]
      }
    });
  }

  for (const part of plan.parts) {
    actions.push({
      name: "place_cube",
      arguments: {
        group: part.group,
        elements: [
          {
            name: part.name,
            from: part.from,
            to: part.to
          }
        ]
      }
    });
  }

  actions.push({ name: "capture_screenshot", arguments: {} });

  return actions;
}

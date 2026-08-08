/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_STABLE } from "@/lib/constants";

export const inspectElementParameters = z.object({
  id: z
    .string()
    .min(1)
    .describe(
      "Exact element UUID or exact unique name. Prefer UUID after locating the element with list_outline or find_elements_by_criteria."
    ),
});

export const elementInspectionToolDocs: ToolSpec[] = [
  {
    name: "inspect_element",
    description:
      "Returns focused read-only authored state for one explicit Bedrock Cube or Group in the active project. Cube output includes parent, from/to/size, origin (pivot), rotation, and visibility. Group output includes parent, origin (pivot), rotation, visibility, and child count. Exact names must be unique; UUID is preferred. This tool does not infer whether placement/rotation/pivot is correct, does not modify selection or model state, and does not return visual PASS/FAIL.",
    annotations: {
      title: "Inspect Authored Element",
      readOnlyHint: true,
    },
    parameters: inspectElementParameters,
    status: STATUS_STABLE,
  },
];

type InspectableElement = Cube | Group;
type CandidateElement = Cube | Group | Mesh;

function elementType(element: CandidateElement): "cube" | "group" | "mesh" {
  if (element instanceof Cube) return "cube";
  if (element instanceof Group) return "group";
  return "mesh";
}

function resolveInspectableElement(reference: string): InspectableElement {
  if (!Project) {
    throw new Error(
      "No project is open. Open or create the intended Bedrock project before inspecting an element."
    );
  }

  const candidates: CandidateElement[] = [
    ...Cube.all,
    ...Group.all,
    ...Mesh.all,
  ];

  const uuidMatch = candidates.find((element) => element.uuid === reference);
  if (uuidMatch) {
    if (uuidMatch instanceof Mesh) {
      throw new Error(
        `Element "${reference}" is a Mesh. inspect_element v1 intentionally supports Cube/Group authored state only for the normal Bedrock Cuboid fidelity loop.`
      );
    }
    return uuidMatch;
  }

  const nameMatches = candidates.filter((element) => element.name === reference);
  if (nameMatches.length > 1) {
    const choices = nameMatches
      .map(
        (element) =>
          `${elementType(element)} "${element.name}" (${element.uuid})`
      )
      .join(", ");
    throw new Error(
      `Element name "${reference}" is ambiguous. Use an exact UUID. Candidates: ${choices}`
    );
  }

  if (nameMatches.length === 1) {
    const match = nameMatches[0];
    if (match instanceof Mesh) {
      throw new Error(
        `Element "${reference}" is a Mesh. inspect_element v1 intentionally supports Cube/Group authored state only for the normal Bedrock Cuboid fidelity loop.`
      );
    }
    return match;
  }

  throw new Error(
    `Element "${reference}" not found. Use list_outline or find_elements_by_criteria to locate the intended Cube/Group and then inspect it by UUID.`
  );
}

function parentInfo(
  element: InspectableElement
): { uuid: string; name: string } | null {
  return element.parent instanceof Group
    ? { uuid: element.parent.uuid, name: element.parent.name }
    : null;
}

function cubeSize(cube: Cube): [number, number, number] {
  return [
    cube.to[0] - cube.from[0],
    cube.to[1] - cube.from[1],
    cube.to[2] - cube.from[2],
  ];
}

function inspectCube(cube: Cube) {
  return {
    uuid: cube.uuid,
    name: cube.name,
    type: "cube" as const,
    authored_space: "blockbench_model" as const,
    parent: parentInfo(cube),
    from: [...cube.from] as [number, number, number],
    to: [...cube.to] as [number, number, number],
    size: cubeSize(cube),
    origin: [...cube.origin] as [number, number, number],
    rotation: [...cube.rotation] as [number, number, number],
    visibility: cube.visibility !== false,
  };
}

function inspectGroup(group: Group) {
  return {
    uuid: group.uuid,
    name: group.name,
    type: "group" as const,
    authored_space: "blockbench_model" as const,
    parent: parentInfo(group),
    origin: [...group.origin] as [number, number, number],
    rotation: [...group.rotation] as [number, number, number],
    visibility: group.visibility !== false,
    children_count: group.children?.length ?? 0,
  };
}

export function registerElementInspectionTools() {
  createTool(
    elementInspectionToolDocs[0].name,
    {
      ...elementInspectionToolDocs[0],
      async execute({ id }) {
        const element = resolveInspectableElement(id);
        const result =
          element instanceof Cube ? inspectCube(element) : inspectGroup(element);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
          structuredContent: result,
        };
      },
    },
    elementInspectionToolDocs[0].status
  );
}

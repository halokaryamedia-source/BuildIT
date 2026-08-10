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
      "Exact Cube, Group, Locator, or Null Object UUID, or exact unique name. Prefer UUID after locating the element with the relevant discovery tool."
    ),
});

export const elementInspectionToolDocs: ToolSpec[] = [
  {
    name: "inspect_element",
    description:
      "Returns focused read-only authored state for one explicit Bedrock Cube, Group, Locator, or Null Object in the active project. Cube output includes from/to, size, center, origin, rotation, parent, and visibility so a local correction can be derived from exact current authored state. Locator output includes parent, position, rotation, ignore_inherited_scale, and visibility. Null Object output includes parent, position, current IK editor references, lock_ik_target_rotation, and visibility. Exact names must be unique; UUID is preferred. This tool does not modify selection/model state or return visual PASS/FAIL.",
    annotations: {
      title: "Inspect Authored Element",
      readOnlyHint: true,
    },
    parameters: inspectElementParameters,
    status: STATUS_STABLE,
  },
];

type InspectableElement = Cube | Group | Locator | NullObject;

function elementType(
  element: InspectableElement
): "cube" | "group" | "locator" | "null_object" {
  if (element instanceof Cube) return "cube";
  if (element instanceof Group) return "group";
  if (element instanceof Locator) return "locator";
  return "null_object";
}

function resolveInspectableElement(reference: string): InspectableElement {
  if (!Project) {
    throw new Error(
      "No project is open. Open or create the intended Bedrock project before inspecting an element."
    );
  }

  const candidates: InspectableElement[] = [
    ...Cube.all,
    ...Group.all,
    ...Locator.all,
    ...NullObject.all,
  ];

  const uuidMatch = candidates.find((element) => element.uuid === reference);
  if (uuidMatch) return uuidMatch;

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

  if (nameMatches.length === 1) return nameMatches[0];

  throw new Error(
    `Element "${reference}" not found. Use list_outline, find_elements_by_criteria, or list_locator_elements to locate the intended authored element and then inspect it by UUID.`
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
    center: [
      (cube.from[0] + cube.to[0]) / 2,
      (cube.from[1] + cube.to[1]) / 2,
      (cube.from[2] + cube.to[2]) / 2,
    ] as [number, number, number],
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

function inspectLocator(locator: Locator) {
  return {
    uuid: locator.uuid,
    name: locator.name,
    type: "locator" as const,
    authored_space: "blockbench_model" as const,
    parent: parentInfo(locator),
    position: [...locator.position] as [number, number, number],
    rotation: [...locator.rotation] as [number, number, number],
    ignore_inherited_scale: locator.ignore_inherited_scale,
    visibility: locator.visibility !== false,
  };
}

function inspectNullObject(element: NullObject) {
  return {
    uuid: element.uuid,
    name: element.name,
    type: "null_object" as const,
    authored_space: "blockbench_model" as const,
    parent: parentInfo(element),
    position: [...element.position] as [number, number, number],
    ik_target: element.ik_target || null,
    ik_source: element.ik_source || null,
    lock_ik_target_rotation: element.lock_ik_target_rotation,
    visibility: element.visibility !== false,
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
          element instanceof Cube
            ? inspectCube(element)
            : element instanceof Group
              ? inspectGroup(element)
              : element instanceof Locator
                ? inspectLocator(element)
                : inspectNullObject(element);

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

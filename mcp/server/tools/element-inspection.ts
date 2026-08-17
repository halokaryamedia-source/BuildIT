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
      "Returns focused read-only authored state for one explicit Bedrock Cube, Group, Locator, or Null Object. UUID is preferred and exact names must be unique. Includes the type-specific transform, parent, and visibility state needed for precise correction; it does not modify selection/model state or return visual PASS/FAIL.",
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

export function requireFiniteInspectableVector3(
  values: readonly number[],
  context: string
): [number, number, number] {
  if (values.length !== 3 || values.some((value) => !Number.isFinite(value))) {
    throw new Error(
      `${context} contains a non-finite authored transform and cannot be reported safely.`
    );
  }
  return [values[0], values[1], values[2]];
}

export function requireFiniteInspectableVector2(
  values: readonly number[],
  context: string
): [number, number] {
  if (values.length !== 2 || values.some((value) => !Number.isFinite(value))) {
    throw new Error(
      `${context} contains non-finite authored UV state and cannot be reported safely.`
    );
  }
  return [values[0], values[1]];
}

export function requireFiniteInspectableFaceUv(
  values: readonly number[],
  context: string
): [number, number, number, number] {
  if (values.length !== 4 || values.some((value) => !Number.isFinite(value))) {
    throw new Error(
      `${context} contains a non-finite authored face UV rectangle and cannot be reported safely.`
    );
  }
  return [values[0], values[1], values[2], values[3]];
}

const CUBE_FACE_KEYS = [
  "north",
  "south",
  "east",
  "west",
  "up",
  "down",
] as const;

function inspectCubeUv(cube: Cube) {
  const faces = Object.fromEntries(
    CUBE_FACE_KEYS.map((faceKey) => {
      const face = cube.faces[faceKey];
      return [
        faceKey,
        {
          uv: requireFiniteInspectableFaceUv(
            face.uv,
            `Cube ${cube.name} (${cube.uuid}) face ${faceKey}`
          ),
          rotation: face.rotation,
          enabled: face.enabled !== false,
        },
      ];
    })
  );

  return {
    mode: cube.box_uv ? ("box_uv" as const) : ("per_face" as const),
    box_uv: cube.box_uv === true,
    uv_offset: requireFiniteInspectableVector2(
      cube.uv_offset,
      `Cube ${cube.name} (${cube.uuid}) uv_offset`
    ),
    autouv: cube.autouv,
    mirror_uv: cube.mirror_uv === true,
    faces,
  };
}

function cubeSize(cube: Cube): [number, number, number] {
  const from = requireFiniteInspectableVector3(cube.from, `Cube ${cube.name} (${cube.uuid}) from`);
  const to = requireFiniteInspectableVector3(cube.to, `Cube ${cube.name} (${cube.uuid}) to`);
  const size = [
    to[0] - from[0],
    to[1] - from[1],
    to[2] - from[2],
  ] as [number, number, number];
  if (size.some((value) => !Number.isFinite(value))) {
    throw new Error(
      `Cube ${cube.name} (${cube.uuid}) has a non-finite derived size; exact authored correction state cannot be reported safely.`
    );
  }
  return size;
}

function inspectCube(cube: Cube) {
  const size = cubeSize(cube);
  return {
    uuid: cube.uuid,
    name: cube.name,
    type: "cube" as const,
    authored_space: "blockbench_model" as const,
    parent: parentInfo(cube),
    from: requireFiniteInspectableVector3(cube.from, `Cube ${cube.name} (${cube.uuid}) from`),
    to: requireFiniteInspectableVector3(cube.to, `Cube ${cube.name} (${cube.uuid}) to`),
    size,
    center: [
      cube.from[0] + size[0] / 2,
      cube.from[1] + size[1] / 2,
      cube.from[2] + size[2] / 2,
    ] as [number, number, number],
    origin: requireFiniteInspectableVector3(cube.origin, `Cube ${cube.name} (${cube.uuid}) origin`),
    rotation: requireFiniteInspectableVector3(cube.rotation, `Cube ${cube.name} (${cube.uuid}) rotation`),
    uv: inspectCubeUv(cube),
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
    origin: requireFiniteInspectableVector3(group.origin, `Group ${group.name} (${group.uuid}) origin`),
    rotation: requireFiniteInspectableVector3(group.rotation, `Group ${group.name} (${group.uuid}) rotation`),
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
    position: requireFiniteInspectableVector3(locator.position, `Locator ${locator.name} (${locator.uuid}) position`),
    rotation: requireFiniteInspectableVector3(locator.rotation, `Locator ${locator.name} (${locator.uuid}) rotation`),
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
    position: requireFiniteInspectableVector3(element.position, `Null Object ${element.name} (${element.uuid}) position`),
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
              text: JSON.stringify(result),
            },
          ],
          structuredContent: result,
        };
      },
    },
    elementInspectionToolDocs[0].status
  );
}

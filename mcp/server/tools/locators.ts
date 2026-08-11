/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL, STATUS_STABLE } from "@/lib/constants";
import { resolveCoreGroup } from "@/lib/coreIdentity";

const finiteLocatorVector3Schema = z.tuple([
  z.number().finite(),
  z.number().finite(),
  z.number().finite(),
]);
const locatorCreateSchema = z
  .object({
    action: z
      .literal("create")
      .describe("Create branch: requires name and parent; do not send id."),
    name: z
      .string()
      .min(1)
      .describe("Required when action=create. Locator name; omit for update."),
    parent: z
      .string()
      .min(1)
      .describe("Required when action=create: parent Group UUID or exact unique name."),
    position: finiteLocatorVector3Schema
      .optional()
      .default([0, 0, 0])
      .describe("Create-only initial position; defaults to [0,0,0]."),
    rotation: finiteLocatorVector3Schema
      .optional()
      .default([0, 0, 0])
      .describe("Create-only initial rotation; defaults to [0,0,0]."),
    ignore_inherited_scale: z
      .boolean()
      .optional()
      .default(false)
      .describe("Create-only initial ignore_inherited_scale value."),
  })
  .strict();

const locatorUpdateSchema = z
  .object({
    action: z
      .literal("update")
      .describe("Update branch: requires id plus at least one authored field; do not send name."),
    id: z
      .string()
      .min(1)
      .describe("Required when action=update. Exact Locator UUID or exact unique name."),
    parent: z
      .string()
      .min(1)
      .optional()
      .describe("Update-only optional replacement parent Group UUID or exact unique name."),
    position: finiteLocatorVector3Schema
      .optional()
      .describe("Update-only optional replacement position."),
    rotation: finiteLocatorVector3Schema
      .optional()
      .describe("Update-only optional replacement rotation."),
    ignore_inherited_scale: z
      .boolean()
      .optional()
      .describe("Update-only optional ignore_inherited_scale replacement."),
  })
  .strict();

export const manageLocatorParameters = z
  .discriminatedUnion("action", [locatorCreateSchema, locatorUpdateSchema])
  .superRefine((value, ctx) => {
    if (
      value.action === "update" &&
      value.parent === undefined &&
      value.position === undefined &&
      value.rotation === undefined &&
      value.ignore_inherited_scale === undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Locator update requires at least one of parent, position, rotation, or ignore_inherited_scale.",
      });
    }
  });

const nullObjectCreateSchema = z
  .object({
    action: z
      .literal("create")
      .describe("Create branch: requires name and parent; do not send id."),
    name: z
      .string()
      .min(1)
      .describe("Required when action=create. Null Object name; omit for update."),
    parent: z
      .string()
      .min(1)
      .describe("Required when action=create: parent Group UUID or exact unique name."),
    position: finiteLocatorVector3Schema
      .optional()
      .default([0, 0, 0])
      .describe("Create-only initial position; defaults to [0,0,0]."),
  })
  .strict();

const nullObjectUpdateSchema = z
  .object({
    action: z
      .literal("update")
      .describe("Update branch: requires id plus parent and/or position; do not send name."),
    id: z
      .string()
      .min(1)
      .describe("Required when action=update. Exact Null Object UUID or exact unique name."),
    parent: z
      .string()
      .min(1)
      .optional()
      .describe("Update-only optional replacement parent Group UUID or exact unique name."),
    position: finiteLocatorVector3Schema
      .optional()
      .describe("Update-only optional replacement position."),
  })
  .strict();

export const manageNullObjectParameters = z
  .discriminatedUnion("action", [nullObjectCreateSchema, nullObjectUpdateSchema])
  .superRefine((value, ctx) => {
    if (
      value.action === "update" &&
      value.parent === undefined &&
      value.position === undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Null Object update requires parent or position.",
      });
    }
  });

export const listLocatorElementsParameters = z.object({}).strict();

export const locatorToolDocs: ToolSpec[] = [
  {
    name: "list_locator_elements",
    description:
      "Lists authored Locator and Null Object identity/type/parent. Use inspect_element only when detailed authored state is needed.",
    annotations: {
      title: "List Bedrock Locator Elements",
      readOnlyHint: true,
    },
    parameters: listLocatorElementsParameters,
    status: STATUS_STABLE,
  },
  {
    name: "manage_locator",
    description:
      "Create: action=create requires name+parent. Update: action=update requires id plus at least one of parent/position/rotation/ignore_inherited_scale. Rename/delete use rename_element/remove_element.",
    annotations: {
      title: "Manage Bedrock Locator",
      destructiveHint: true,
    },
    parameters: manageLocatorParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "manage_null_object",
    description:
      "Create: action=create requires name+parent. Update: action=update requires id plus parent and/or position. IK fields remain read-only; rename/delete use rename_element/remove_element.",
    annotations: {
      title: "Manage Bedrock Null Object",
      destructiveHint: true,
    },
    parameters: manageNullObjectParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

type LocatorElement = Locator | NullObject;

function requireBedrockEntityProject(): void {
  if (!Project) {
    throw new Error(
      "No project is open. Open or create a Minecraft Bedrock Entity project first."
    );
  }
  const formatId = (Format as { id?: string } | undefined)?.id;
  if (formatId !== "bedrock") {
    throw new Error(
      `Locator/Null Object tools require the Minecraft Bedrock Entity format (bedrock); current format is ${formatId ?? "unknown"}.`
    );
  }
}

function parentInfo(
  element: LocatorElement
): { uuid: string; name: string } | null {
  return element.parent instanceof Group
    ? { uuid: element.parent.uuid, name: element.parent.name }
    : null;
}

function resolveParent(reference: string): Group {
  return resolveCoreGroup(
    reference,
    "Locator and Null Object elements must be parented to an explicit Bedrock Group/bone. Use list_outline to confirm the Group UUID."
  );
}

function resolveLocator(reference: string): Locator {
  const uuidMatch = Locator.all.find((locator) => locator.uuid === reference);
  if (uuidMatch) return uuidMatch;

  const nameMatches = Locator.all.filter((locator) => locator.name === reference);
  if (nameMatches.length === 1) return nameMatches[0];
  if (nameMatches.length > 1) {
    throw new Error(
      `Locator name "${reference}" is ambiguous. Use an exact UUID. Candidates: ${nameMatches
        .map((locator) => `${locator.name} (${locator.uuid})`)
        .join(", ")}`
    );
  }

  throw new Error(
    `Locator "${reference}" not found. Use list_locator_elements to confirm the intended UUID.`
  );
}

function resolveNullObject(reference: string): NullObject {
  const uuidMatch = NullObject.all.find((element) => element.uuid === reference);
  if (uuidMatch) return uuidMatch;

  const nameMatches = NullObject.all.filter((element) => element.name === reference);
  if (nameMatches.length === 1) return nameMatches[0];
  if (nameMatches.length > 1) {
    throw new Error(
      `Null Object name "${reference}" is ambiguous. Use an exact UUID. Candidates: ${nameMatches
        .map((element) => `${element.name} (${element.uuid})`)
        .join(", ")}`
    );
  }

  throw new Error(
    `Null Object "${reference}" not found. Use list_locator_elements to confirm the intended UUID.`
  );
}

function updatePreview(element: LocatorElement): void {
  element.preview_controller.updateTransform(element);
  Canvas.updateAll();
}

function finiteAuthoredVector3(
  values: readonly number[],
  context: string
): [number, number, number] {
  if (values.length !== 3 || values.some((value) => !Number.isFinite(value))) {
    throw new Error(
      `${context} contains a non-finite authored transform and cannot be reported safely. Correct the project state before continuing.`
    );
  }
  return [values[0], values[1], values[2]];
}
function locatorState(locator: Locator) {
  return {
    uuid: locator.uuid,
    name: locator.name,
    type: "locator" as const,
    parent: parentInfo(locator),
    position: finiteAuthoredVector3(locator.position, `Locator ${locator.name} (${locator.uuid}) position`),
    rotation: finiteAuthoredVector3(locator.rotation, `Locator ${locator.name} (${locator.uuid}) rotation`),
    ignore_inherited_scale: locator.ignore_inherited_scale,
    visibility: locator.visibility !== false,
  };
}

function nullObjectState(element: NullObject) {
  return {
    uuid: element.uuid,
    name: element.name,
    type: "null_object" as const,
    parent: parentInfo(element),
    position: finiteAuthoredVector3(element.position, `Null Object ${element.name} (${element.uuid}) position`),
    ik_target: element.ik_target || null,
    ik_source: element.ik_source || null,
    lock_ik_target_rotation: element.lock_ik_target_rotation,
    visibility: element.visibility !== false,
  };
}

function structuredResult(state: ReturnType<typeof locatorState> | ReturnType<typeof nullObjectState>) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(state),
      },
    ],
    structuredContent: state,
  };
}

export function registerLocatorTools() {
  createTool(
    locatorToolDocs[0].name,
    {
      ...locatorToolDocs[0],
      async execute() {
        requireBedrockEntityProject();
        const locators = Locator.all.map(locatorState);
        const nullObjects = NullObject.all.map(nullObjectState);
        const result = {
          count: locators.length + nullObjects.length,
          locators,
          null_objects: nullObjects,
        };
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
    locatorToolDocs[0].status
  );

  createTool(
    locatorToolDocs[1].name,
    {
      ...locatorToolDocs[1],
      async execute(args) {
        requireBedrockEntityProject();

        if (args.action === "create") {
          const parent = resolveParent(args.parent);
          if (Locator.all.some((locator) => locator.name === args.name)) {
            throw new Error(
              `Locator name "${args.name}" already exists. Locator names must remain unique for deterministic Bedrock references.`
            );
          }

          const edited: OutlinerElement[] = [];
          let locator: Locator | undefined;
          Undo.initEdit({ elements: edited, outliner: true });
          try {
            locator = new Locator({
              name: args.name,
              from: [...args.position] as [number, number, number],
            });
            locator.rotation = [...args.rotation] as [number, number, number];
            locator.ignore_inherited_scale = args.ignore_inherited_scale;
            locator.addTo(parent).init();
            edited.push(locator);
            Undo.finishEdit("Add Bedrock locator");
            updatePreview(locator);
            return structuredResult(locatorState(locator));
          } catch (error) {
            locator?.remove();
            Undo.cancelEdit(true);
            Canvas.updateAll();
            throw error;
          }
        }

        const locator = resolveLocator(args.id);
        const parent = args.parent !== undefined ? resolveParent(args.parent) : undefined;
        Undo.initEdit({ elements: [locator], outliner: true });
        try {
          if (parent) locator.addTo(parent);
          if (args.position !== undefined) {
            locator.position = [...args.position] as [number, number, number];
          }
          if (args.rotation !== undefined) {
            locator.rotation = [...args.rotation] as [number, number, number];
          }
          if (args.ignore_inherited_scale !== undefined) {
            locator.ignore_inherited_scale = args.ignore_inherited_scale;
          }
          updatePreview(locator);
          Undo.finishEdit("Update Bedrock locator");
          return structuredResult(locatorState(locator));
        } catch (error) {
          Undo.cancelEdit(true);
          Canvas.updateAll();
          throw error;
        }
      },
    },
    locatorToolDocs[1].status
  );

  createTool(
    locatorToolDocs[2].name,
    {
      ...locatorToolDocs[2],
      async execute(args) {
        requireBedrockEntityProject();

        if (args.action === "create") {
          const parent = resolveParent(args.parent);
          if (NullObject.all.some((element) => element.name === args.name)) {
            throw new Error(
              `Null Object name "${args.name}" already exists. Null Object names must remain unique for deterministic references.`
            );
          }
          const edited: OutlinerElement[] = [];
          let element: NullObject | undefined;
          Undo.initEdit({ elements: edited, outliner: true });
          try {
            element = new NullObject({
              name: args.name,
              position: [...args.position] as [number, number, number],
            });
            element.addTo(parent).init();
            edited.push(element);
            Undo.finishEdit("Add Bedrock null object");
            updatePreview(element);
            return structuredResult(nullObjectState(element));
          } catch (error) {
            element?.remove();
            Undo.cancelEdit(true);
            Canvas.updateAll();
            throw error;
          }
        }

        const element = resolveNullObject(args.id);
        const parent = args.parent !== undefined ? resolveParent(args.parent) : undefined;
        Undo.initEdit({ elements: [element], outliner: true });
        try {
          if (parent) element.addTo(parent);
          if (args.position !== undefined) {
            element.position = [...args.position] as [number, number, number];
          }
          updatePreview(element);
          Undo.finishEdit("Update Bedrock null object");
          return structuredResult(nullObjectState(element));
        } catch (error) {
          Undo.cancelEdit(true);
          Canvas.updateAll();
          throw error;
        }
      },
    },
    locatorToolDocs[2].status
  );
}

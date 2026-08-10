/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL, STATUS_STABLE } from "@/lib/constants";
import { resolveCoreGroup } from "@/lib/coreIdentity";
import { vector3Schema } from "@/lib/zodObjects";

const locatorCreateSchema = z
  .object({
    action: z.literal("create"),
    name: z.string().min(1).describe("Locator name."),
    parent: z
      .string()
      .min(1)
      .describe("Required parent Group UUID or exact unique Group name."),
    position: vector3Schema.optional().default([0, 0, 0]),
    rotation: vector3Schema.optional().default([0, 0, 0]),
    ignore_inherited_scale: z.boolean().optional().default(false),
  })
  .strict();

const locatorUpdateSchema = z
  .object({
    action: z.literal("update"),
    id: z
      .string()
      .min(1)
      .describe("Exact Locator UUID or exact unique Locator name."),
    parent: z
      .string()
      .min(1)
      .optional()
      .describe("Optional replacement parent Group UUID or exact unique Group name."),
    position: vector3Schema.optional(),
    rotation: vector3Schema.optional(),
    ignore_inherited_scale: z.boolean().optional(),
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
    action: z.literal("create"),
    name: z.string().min(1).describe("Null Object name."),
    parent: z
      .string()
      .min(1)
      .describe("Required parent Group UUID or exact unique Group name."),
    position: vector3Schema.optional().default([0, 0, 0]),
  })
  .strict();

const nullObjectUpdateSchema = z
  .object({
    action: z.literal("update"),
    id: z
      .string()
      .min(1)
      .describe("Exact Null Object UUID or exact unique Null Object name."),
    parent: z
      .string()
      .min(1)
      .optional()
      .describe("Optional replacement parent Group UUID or exact unique Group name."),
    position: vector3Schema.optional(),
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
      "Lists authored Locator and Null Object elements in the active Minecraft Bedrock Entity project with identity, type, and parent Group. Use inspect_element for their detailed authored state.",
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
      "Creates or updates a native Minecraft Bedrock Entity Locator under an explicit Group/bone. Create owns name, position, rotation, and ignore_inherited_scale. Update resolves the Locator UUID first, otherwise an exact name must be unique. Parent targets are preflighted before Undo. Rename/delete remain owned by rename_element/remove_element.",
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
      "Creates or updates a Blockbench Null Object used by the Bedrock Entity workflow. Bedrock geometry serialization round-trips it through a `_null_` locator entry, while IK fields remain Blockbench editor/animation state and are intentionally read-only in this minimum slice. Parent targets are preflighted before Undo. Rename/delete remain owned by rename_element/remove_element.",
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

function locatorState(locator: Locator) {
  return {
    uuid: locator.uuid,
    name: locator.name,
    type: "locator" as const,
    parent: parentInfo(locator),
    position: [...locator.position] as [number, number, number],
    rotation: [...locator.rotation] as [number, number, number],
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
    position: [...element.position] as [number, number, number],
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
        text: JSON.stringify(state, null, 2),
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
              text: JSON.stringify(result, null, 2),
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

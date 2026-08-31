/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL, STATUS_STABLE } from "@/lib/constants";
import { resolveCoreGroup, resolveCoreTexture } from "@/lib/coreIdentity";
import { elementIdSchema } from "@/lib/zodObjects";
import { requireOpenProject } from "@/lib/util";

export const removeElementParameters = z.object({
  id: elementIdSchema.describe(
    "Exact element UUID or exact unique name. Ambiguous names are rejected before removal."
  ),
});

export const elementTypeEnum = z.enum(["cube", "group", "any"]);

const finiteElementVector3Schema = z.tuple([
  z.number().finite(),
  z.number().finite(),
  z.number().finite(),
]);

export const findElementsByCriteriaParameters = z.object({
  name_pattern: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Optional non-empty case-sensitive name regex; invalid/oversized/unsafe patterns are rejected."
    ),
  name_contains: z
    .string()
    .min(1)
    .optional()
    .describe("Optional non-empty substring to match element names. Case-insensitive."),
  type: elementTypeEnum
    .optional()
    .default("any")
    .describe("Restrict to Cube or Group results."),
  parent_group: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Optional Group UUID or unique exact name whose descendant subtree scopes results."
    ),
  min_size: finiteElementVector3Schema
    .optional()
    .describe("Optional finite minimum Cube size [x,y,z]."),
  max_size: finiteElementVector3Schema
    .optional()
    .describe("Optional finite maximum Cube size [x,y,z]."),
  selected_only: z
    .boolean()
    .optional()
    .default(false)
    .describe("Only consider currently selected Cubes/Groups."),
  limit: z
    .number()
    .int()
    .min(1)
    .max(1000)
    .optional()
    .default(50)
    .describe(
      "Maximum results. Default 50; increase only when the search genuinely needs more."
    ),
}).superRefine((params, ctx) => {
  const minSize = params.min_size;
  const maxSize = params.max_size;
  if (minSize === undefined || maxSize === undefined) return;

  minSize.forEach((minimum, axis) => {
    if (minimum > maxSize[axis]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_size", axis],
        message: `max_size[${axis}] must be greater than or equal to min_size[${axis}].`,
      });
    }
  });
});

export const selectAllOfTypeParameters = z.object({
  type: z
    .enum(["cube", "group"])
    .describe("Element type to select."),
  add_to_selection: z
    .boolean()
    .optional()
    .default(false)
    .describe("If true, add to current selection. If false, replace Cube/Group selection."),
  parent_group: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Optional Group UUID/unique-name subtree scope; rejected if ambiguous before selection."
    ),
});

export const filterByMaterialParameters = z.object({
  texture: z
    .string()
    .describe(
      "Explicit texture reference for read-only Cube material discovery. UUID is preferred, then exact texture ID, then exact name only when unique. Ambiguous IDs or names are rejected."
    ),
  include_face_keys: z
    .boolean()
    .optional()
    .default(true)
    .describe(
      "Include the list of cube face keys (e.g., 'north') that reference the texture."
    ),
  limit: z
    .number()
    .int()
    .min(1)
    .max(1000)
    .optional()
    .default(50)
    .describe("Maximum matching Cubes to return."),
});

export const getSelectionParameters = z.object({});

export const addGroupParameters = z
  .object({
    name: z
      .string()
      .min(1)
      .optional()
      .describe("Non-empty Bedrock Group/bone name."),
    origin: finiteElementVector3Schema
      .optional()
      .default([0, 0, 0])
      .describe(
        "Finite Bedrock bone pivot/origin; omit for organizational Groups unless a joint/attachment needs it."
      ),
    rotation: finiteElementVector3Schema
      .optional()
      .default([0, 0, 0])
      .describe("Finite initial Bedrock bone rotation; omit for neutral zero rotation."),
    parent: z
      .string()
      .optional()
      .default("root")
      .describe(
        "Parent Group UUID or unique exact name; omit/use `root` for intentional root."
      ),
    groups: z
      .array(
        z.object({
          name: z.string().min(1).describe("Non-empty unique bone name."),
          origin: finiteElementVector3Schema
            .optional()
            .describe("Finite pivot; omit for [0,0,0]."),
          rotation: finiteElementVector3Schema
            .optional()
            .describe("Finite initial rotation; omit for zero."),
          parent: z
            .string()
            .optional()
            .describe("Parent Group UUID/name or `root`; may reference an earlier batch entry."),
        })
      )
      .optional()
      .describe("Coherent Group/bone batch; ordered, one Undo unit."),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.groups && value.name !== undefined) {
      ctx.addIssue({
        code: "custom",
        message: "Pass either `name` or `groups`, not both.",
        path: ["groups"],
      });
    }
    if (!value.groups && value.name === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "Provide `name` or `groups`.",
        path: ["name"],
      });
    }
  });

export const listOutlineParameters = z.object({
  include_cubes: z
    .boolean()
    .optional()
    .default(true)
    .describe("If true, include cubes as leaves. If false, return groups only."),
  max_depth: z
    .number()
    .int()
    .min(1)
    .max(32)
    .optional()
    .default(8)
    .describe(
      "Maximum tree depth. Default 8; increase only for deeper structure."
    ),
  max_nodes: z
    .number()
    .int()
    .min(1)
    .max(5000)
    .optional()
    .default(120)
    .describe(
      "Maximum Cube/Group nodes returned. Default 120; raise explicitly when truncation matters."
    ),
});

export const duplicateElementParameters = z.object({
  id: elementIdSchema.describe(
    "Exact Cube or Group UUID, or exact unique name. Ambiguous names are rejected before duplication."
  ),
  offset: finiteElementVector3Schema.optional().default([0, 0, 0]).describe("Finite translation offset [x,y,z] applied to the duplicated Cube/Group subtree."),
  newName: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Name for the duplicated root only; descendants keep `<name>_copy` names."
    ),
});

export const renameElementParameters = z.object({
  id: elementIdSchema.describe(
    "Exact element/Group UUID or unique name; ambiguous names are rejected before rename."
  ),
  new_name: z
    .string()
    .min(1)
    .describe("Non-empty new name to assign."),
});

export const modifyGroupParameters = z
  .object({
    id: z.string().min(1).describe("Exact Group UUID or unique exact name."),
    origin: finiteElementVector3Schema.optional().describe("New Group pivot/origin."),
    rotation: finiteElementVector3Schema.optional().describe("New Group rotation [x,y,z]."),
    visibility: z.boolean().optional().describe("New Group visibility."),
  })
  .strict()
  .refine(
    (update) =>
      update.origin !== undefined ||
      update.rotation !== undefined ||
      update.visibility !== undefined,
    { message: "modify_group requires an origin, rotation, or visibility change." }
  );

export const reparentElementParameters = z.object({
  id: elementIdSchema.describe("Exact Cube or Group UUID or unique exact name."),
  parent: z
    .string()
    .min(1)
    .describe("New parent Group UUID or unique exact name; use `root` for root placement."),
});

export const elementToolDocs: ToolSpec[] = [
  {
    name: "remove_element",
    description:
      "Removes one explicit Cube, Group, or outliner target with Undo support.",
    annotations: {
      title: "Remove Element",
      destructiveHint: true,
    },
    parameters: removeElementParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "add_group",
    description:
      "Adds one or more Bedrock Groups/bones with optional parent, pivot, and rotation.",
    annotations: {
      title: "Add Group",
      destructiveHint: true,
    },
    parameters: addGroupParameters,
    status: STATUS_STABLE,
  },
  {
    name: "list_outline",
    description:
      "Lists a bounded Cube/Group hierarchy and reports truncation.",
    annotations: {
      title: "List Outline",
      readOnlyHint: true,
    },
    parameters: listOutlineParameters,
    status: STATUS_STABLE,
  },
  {
    name: "duplicate_element",
    description:
      "Duplicates one explicit Cube/Group with optional offset and root name.",
    annotations: { title: "Duplicate Element", destructiveHint: true },
    parameters: duplicateElementParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "rename_element",
    description:
      "Renames one explicit Cube, Group, or outliner target.",
    annotations: { title: "Rename Element", destructiveHint: true },
    parameters: renameElementParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "find_elements_by_criteria",
    description:
      "Searches Cubes/Groups by identity, type, parent, size, or selection with bounded results.",
    annotations: {
      title: "Find Elements by Criteria",
      readOnlyHint: true,
    },
    parameters: findElementsByCriteriaParameters,
    status: STATUS_STABLE,
  },
  {
    name: "select_all_of_type",
    description:
      "Selects all Cubes or Groups of one type for workflows that require editor selection.",
    annotations: {
      title: "Select All of Type",
      destructiveHint: false,
    },
    parameters: selectAllOfTypeParameters,
    status: STATUS_STABLE,
  },
  {
    name: "filter_by_material",
    description:
      "Legacy raw face-material lookup. Disabled on the Bedrock Entity surface.",
    annotations: {
      title: "Filter Elements by Material",
      readOnlyHint: true,
    },
    parameters: filterByMaterialParameters,
    status: STATUS_STABLE,
  },
  {
    name: "get_selection",
    description:
      "Returns current Cube/Group selection and active Texture when editor selection matters.",
    annotations: {
      title: "Get Selection",
      readOnlyHint: true,
    },
    parameters: getSelectionParameters,
    status: STATUS_STABLE,
  },
  {
    name: "modify_group",
    description:
      "Modifies one explicit Bedrock Group pivot, rotation, or visibility. Use rename_element for names.",
    annotations: { title: "Modify Group", destructiveHint: true },
    parameters: modifyGroupParameters,
    status: STATUS_STABLE,
  },
  {
    name: "reparent_element",
    description:
      "Moves one explicit Cube or Group to a new parent. Rejects self/circular hierarchy; local transform is preserved.",
    annotations: { title: "Reparent Element", destructiveHint: true },
    parameters: reparentElementParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

interface IElementMatch {
  uuid: string;
  name: string;
  type: "cube" | "group";
  parent: string | null;
}

interface IFilterByMaterialMatch {
  uuid: string;
  name: string;
  type: "cube";
  faces?: string[];
}

function getElementType(el: unknown): "cube" | "group" | null {
  if (el instanceof Cube) return "cube";
  if (el instanceof Group) return "group";
  return null;
}

function getParentName(el: { parent?: unknown }): string | null {
  const parent = el.parent as { name?: string; uuid?: string } | undefined;
  if (!parent || typeof parent !== "object") return null;
  return parent.name ?? parent.uuid ?? null;
}

function resolveParentGroup(reference: string): Group | "root" {
  if (reference === "root") return "root";
  return resolveCoreGroup(
    reference,
    'Use list_outline to confirm the intended Group UUID. Use "root" only when root parenting is intentional.'
  );
}

function resolveOptionalGroupScope(reference?: string): Group | null {
  if (reference === undefined) return null;
  return resolveCoreGroup(
    reference,
    "Use list_outline to confirm the intended Group UUID, or omit parent_group when no scope is intended."
  );
}

type ResolvedElement = OutlinerElement | Group;

function continuationElementType(
  element: ResolvedElement
): "cube" | "group" | "locator" | "null_object" | "element" {
  if (element instanceof Cube) return "cube";
  if (element instanceof Group) return "group";
  if (element instanceof Locator) return "locator";
  if (element instanceof NullObject) return "null_object";
  return "element";
}

function elementContinuationState(element: ResolvedElement) {
  const parent = (element as { parent?: unknown }).parent;
  return {
    uuid: element.uuid,
    name: element.name,
    type: continuationElementType(element),
    parent: parent instanceof Group ? parent.uuid : "root",
  };
}

function resolveUniqueDestructiveElement(reference: string): ResolvedElement {
  const candidates = new Map<string, ResolvedElement>();

  for (const element of Outliner.elements ?? []) {
    candidates.set(element.uuid, element);
  }
  for (const group of Group.all ?? []) {
    candidates.set(group.uuid, group);
  }

  const uuidMatch = candidates.get(reference);
  if (uuidMatch) return uuidMatch;

  const nameMatches = [...candidates.values()].filter(
    (element) => element.name === reference
  );
  if (nameMatches.length === 1) return nameMatches[0];

  if (nameMatches.length > 1) {
    throw new Error(
      `Element name "${reference}" is ambiguous. Use an exact UUID. Candidates: ${nameMatches
        .map((element) => {
          const type = getElementType(element) ?? "element";
          return `${type} ${element.name} (${element.uuid})`;
        })
        .join(", ")}`
    );
  }

  throw new Error(
    `Element "${reference}" not found. Use list_outline or find_elements_by_criteria to confirm the intended UUID before retrying the destructive operation.`
  );
}

function resolveUniqueTextureForDiscovery(reference: string): Texture {
  return resolveCoreTexture(
    reference,
    "Use list_textures to confirm the intended UUID or texture ID before retrying material discovery."
  );
}

function isDescendantOf(el: { parent?: unknown }, targetGroup: Group): boolean {
  let current: { parent?: unknown } | undefined = el;
  while (current && current.parent && typeof current.parent === "object") {
    if (current.parent === targetGroup) return true;
    current = current.parent as { parent?: unknown };
  }
  return false;
}

function cubeSize(cube: Cube): [number, number, number] {
  return [
    cube.to[0] - cube.from[0],
    cube.to[1] - cube.from[1],
    cube.to[2] - cube.from[2],
  ];
}

function exceedsBounds(
  size: [number, number, number],
  min?: number[],
  max?: number[]
): boolean {
  if (min && size.some((v, i) => v < (min[i] ?? -Infinity))) return true;
  if (max && size.some((v, i) => v > (max[i] ?? Infinity))) return true;
  return false;
}

const MAX_REGEX_PATTERN_LENGTH = 512;
const CATASTROPHIC_BACKTRACK_HEURISTIC = /\([^)]*[+*?][^)]*\)\s*[+*?{]/;

function safeCompileRegex(pattern: string | undefined): RegExp | null {
  if (pattern === undefined) return null;
  if (pattern.length === 0) {
    throw new Error("name_pattern cannot be empty; omit it only when no regex filter is intended.");
  }
  if (pattern.length > MAX_REGEX_PATTERN_LENGTH) {
    throw new Error(
      `name_pattern rejected: maximum length is ${MAX_REGEX_PATTERN_LENGTH} characters (got ${pattern.length}). Omit name_pattern only when no regex filter is intended.`
    );
  }
  if (CATASTROPHIC_BACKTRACK_HEURISTIC.test(pattern)) {
    throw new Error(
      `name_pattern rejected because it contains nested quantifiers that may cause catastrophic backtracking. Simplify the regex instead of retrying without the filter.`
    );
  }
  try {
    return new RegExp(pattern);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Invalid name_pattern regex: ${reason}. Fix the pattern, or omit name_pattern only when no regex filter is intended.`
    );
  }
}

export function requireFiniteTranslatedElementVector3(
  values: readonly number[],
  offset: readonly number[],
  context: string
): [number, number, number] {
  if (values.length !== 3 || offset.length !== 3) {
    throw new Error(`${context} must be a 3D vector before duplication.`);
  }
  const translated: [number, number, number] = [
    values[0] + offset[0],
    values[1] + offset[1],
    values[2] + offset[2],
  ];
  if (translated.some((value) => !Number.isFinite(value))) {
    throw new Error(
      `${context} plus the requested duplicate offset would produce a non-finite authored coordinate.`
    );
  }
  return translated;
}

export function hasCaseInsensitiveGroupNameCollision(
  groups: readonly { uuid: string; name: string }[],
  requestedName: string,
  excludeUuid?: string
): boolean {
  const normalized = requestedName.toLowerCase();
  return groups.some(
    (group) =>
      group.uuid !== excludeUuid && group.name.toLowerCase() === normalized
  );
}

function assertGroupNameAvailable(name: string, excludeUuid?: string): void {
  if (hasCaseInsensitiveGroupNameCollision(Group.all, name, excludeUuid)) {
    const conflicts = Group.all
      .filter(
        (group) =>
          group.uuid !== excludeUuid &&
          group.name.toLowerCase() === name.toLowerCase()
      )
      .map((group) => `${group.name} (${group.uuid})`)
      .join(", ");
    throw new Error(
      `Bedrock Group/bone name "${name}" collides case-insensitively with existing Group(s): ${conflicts}. Bone names must stay unique for deterministic Bedrock animation/export binding.`
    );
  }
}

function assertBatchGroupNamesAvailable(
  batch: readonly { name: string }[]
): void {
  const occupied = new Map<string, string>();
  for (const group of Group.all) {
    occupied.set(group.name.toLowerCase(), `${group.name} (${group.uuid})`);
  }

  for (const entry of batch) {
    const key = entry.name.toLowerCase();
    const existing = occupied.get(key);
    if (existing) {
      throw new Error(
        `Bedrock Group/bone name "${entry.name}" collides case-insensitively with ${existing}. Group names must be unique before creating the batch.`
      );
    }
    occupied.set(key, `planned Group "${entry.name}"`);
  }
}

type PlannedGroupParent = Group | "root" | number;

function planGroupBatchParents(
  batch: readonly { name: string; parent?: string }[]
): PlannedGroupParent[] {
  const earlierByExactName = new Map<string, number>();
  return batch.map((entry, index) => {
    const reference = entry.parent ?? "root";
    let planned: PlannedGroupParent;
    if (reference === "root") {
      planned = "root";
    } else {
      const earlierIndex = earlierByExactName.get(reference);
      planned = earlierIndex !== undefined
        ? earlierIndex
        : resolveParentGroup(reference);
    }
    earlierByExactName.set(entry.name, index);
    return planned;
  });
}

function locatorExportKey(element: Locator | NullObject, name = element.name): string {
  return element instanceof NullObject ? `_null_${name}` : name;
}

function assertAnchorRenameAvailable(
  element: Locator | NullObject,
  requestedName: string
): void {
  const parent = element.parent;
  if (!(parent instanceof Group)) {
    throw new Error(
      `${continuationElementType(element)} ${element.name} (${element.uuid}) has no Group parent; Bedrock locator identity cannot be validated safely.`
    );
  }
  const requestedKey = locatorExportKey(element, requestedName);
  const conflict = parent.children.find(
    (child) =>
      child !== element &&
      (child instanceof Locator || child instanceof NullObject) &&
      locatorExportKey(child) === requestedKey
  );
  if (conflict && (conflict instanceof Locator || conflict instanceof NullObject)) {
    throw new Error(
      `Renaming ${continuationElementType(element)} "${element.name}" to "${requestedName}" would collide with exported locator key "${requestedKey}" already owned by ${continuationElementType(conflict)} "${conflict.name}" (${conflict.uuid}) under Group "${parent.name}".`
    );
  }
}

function preflightDuplicateTranslation(
  element: unknown,
  offset: readonly number[]
): void {
  if (element instanceof Cube) {
    requireFiniteTranslatedElementVector3(element.from, offset, `Cube ${element.name} (${element.uuid}) from`);
    requireFiniteTranslatedElementVector3(element.to, offset, `Cube ${element.name} (${element.uuid}) to`);
    requireFiniteTranslatedElementVector3(element.origin, offset, `Cube ${element.name} (${element.uuid}) origin`);
    return;
  }
  if (element instanceof Group) {
    requireFiniteTranslatedElementVector3(element.origin, offset, `Group ${element.name} (${element.uuid}) origin`);
    for (const child of element.children) {
      preflightDuplicateTranslation(child, offset);
    }
    return;
  }
  if (element instanceof Locator || element instanceof NullObject) {
    requireFiniteTranslatedElementVector3(
      element.position,
      offset,
      `${continuationElementType(element)} ${element.name} (${element.uuid}) position`
    );
    return;
  }
  throw new Error(
    "The Bedrock Cuboid duplicate workflow supports only Cube/Group targets and Cube/Group/Locator/Null Object descendants."
  );
}

function preflightDuplicateGroupNames(
  source: Cube | Group,
  newName?: string
): void {
  if (!(source instanceof Group)) return;

  const occupied = new Map<string, string>();
  for (const group of Group.all) {
    occupied.set(group.name.toLowerCase(), `${group.name} (${group.uuid})`);
  }

  const visit = (group: Group, isRoot: boolean) => {
    const plannedName = isRoot && newName ? newName : `${group.name}_copy`;
    const key = plannedName.toLowerCase();
    const conflict = occupied.get(key);
    if (conflict) {
      throw new Error(
        `Duplicating Group "${group.name}" would create Bedrock bone name "${plannedName}", which collides case-insensitively with ${conflict}. Choose a different root name or rename the conflicting Group first.`
      );
    }
    occupied.set(key, `planned Group "${plannedName}"`);
    for (const child of group.children) {
      if (child instanceof Group) visit(child, false);
    }
  };

  visit(source, true);
}

function preflightFaithfulDuplicate(
  element: Cube | Group,
  offset: readonly number[],
  newName?: string
): void {
  preflightDuplicateTranslation(element, offset);
  preflightDuplicateGroupNames(element, newName);
}

function translateDuplicatedSubtree(
  element: Cube | Group | Locator | NullObject,
  offset: readonly number[]
): void {
  if (element instanceof Cube) {
    element.from = requireFiniteTranslatedElementVector3(
      element.from,
      offset,
      `Duplicated Cube ${element.name} (${element.uuid}) from`
    );
    element.to = requireFiniteTranslatedElementVector3(
      element.to,
      offset,
      `Duplicated Cube ${element.name} (${element.uuid}) to`
    );
    element.origin = requireFiniteTranslatedElementVector3(
      element.origin,
      offset,
      `Duplicated Cube ${element.name} (${element.uuid}) origin`
    );
    return;
  }

  if (element instanceof Group) {
    element.origin = requireFiniteTranslatedElementVector3(
      element.origin,
      offset,
      `Duplicated Group ${element.name} (${element.uuid}) origin`
    );
    for (const child of element.children) {
      if (
        child instanceof Cube ||
        child instanceof Group ||
        child instanceof Locator ||
        child instanceof NullObject
      ) {
        translateDuplicatedSubtree(child, offset);
      } else {
        throw new Error(
          `Duplicated Group "${element.name}" contains unsupported descendant type ${String((child as { type?: unknown }).type ?? "unknown")}.`
        );
      }
    }
    return;
  }

  element.position = requireFiniteTranslatedElementVector3(
    element.position,
    offset,
    `Duplicated ${continuationElementType(element)} ${element.name} (${element.uuid}) position`
  );
}

function applyDuplicateNames(
  source: Cube | Group | Locator | NullObject,
  copy: Cube | Group | Locator | NullObject,
  newName: string | undefined,
  isRoot: boolean
): void {
  copy.name = isRoot && newName ? newName : `${source.name}_copy`;

  if (source instanceof Group && copy instanceof Group) {
    if (source.children.length !== copy.children.length) {
      throw new Error(
        `Native duplicate of Group "${source.name}" changed descendant count (${source.children.length} -> ${copy.children.length}); refusing to claim faithful duplication.`
      );
    }
    source.children.forEach((sourceChild, index) => {
      const copyChild = copy.children[index];
      if (
        (sourceChild instanceof Cube ||
          sourceChild instanceof Group ||
          sourceChild instanceof Locator ||
          sourceChild instanceof NullObject) &&
        (copyChild instanceof Cube ||
          copyChild instanceof Group ||
          copyChild instanceof Locator ||
          copyChild instanceof NullObject)
      ) {
        applyDuplicateNames(sourceChild, copyChild, undefined, false);
        return;
      }
      throw new Error(
        `Native duplicate of Group "${source.name}" produced an unsupported or mismatched descendant at index ${index}.`
      );
    });
  }
}

function duplicateFaithfully(
  element: Cube | Group,
  offset: readonly number[],
  newName?: string
): Cube | Group {
  const duplicated = element.duplicate();
  if (!(duplicated instanceof Cube) && !(duplicated instanceof Group)) {
    throw new Error(
      `Native Blockbench duplicate returned unsupported type for ${element.name} (${element.uuid}).`
    );
  }

  applyDuplicateNames(element, duplicated, newName, true);
  translateDuplicatedSubtree(duplicated, offset);
  return duplicated;
}

function vector3Equals(
  first: ArrayLike<number>,
  second: ArrayLike<number>
): boolean {
  return (
    first.length === second.length &&
    first[0] === second[0] &&
    first[1] === second[1] &&
    first[2] === second[2]
  );
}

export function registerElementTools() {
  createTool(elementToolDocs[0].name, {
    ...elementToolDocs[0],
    async execute({ id }) {
      requireOpenProject("removing an element");
      const element = resolveUniqueDestructiveElement(id);
      const removedRoot = elementContinuationState(element);
      const deleteElements: OutlinerElement[] = [];
      const deleteGroups: Group[] = [];

      if (element instanceof Group) {
        deleteGroups.push(element);
        element.forEachChild((child: any) => {
          if (child instanceof Group) {
            deleteGroups.push(child);
          } else {
            deleteElements.push(child as OutlinerElement);
          }
        });
      } else {
        deleteElements.push(element);
      }

      const deletedNodeUuids = new Set([
        ...deleteGroups.map((group) => group.uuid),
        ...deleteElements.map((deletedElement) => deletedElement.uuid),
      ]);
      const deleteAnimations: _Animation[] = AnimationItem.all.filter(
        (animation) =>
          Object.keys(animation.animators ?? {}).some((animatorUuid) =>
            deletedNodeUuids.has(animatorUuid)
          )
      );
      const deletionCounts = {
        groups: deleteGroups.length,
        elements: deleteElements.length,
        total_nodes: deleteGroups.length + deleteElements.length,
      };
      const affectedAnimationCount = deleteAnimations.length;

      Undo.initEdit({
        elements: deleteElements,
        groups: deleteGroups,
        outliner: true,
        selection: true,
        animations: deleteAnimations,
        collections: [],
      });

      try {
        if (element instanceof Group) {
          element.remove(false);
          deleteGroups.length = 0;
        } else {
          element.remove();
        }
        deleteElements.length = 0;
        Undo.finishEdit("Agent removed element");
      } catch (error) {
        Undo.cancelEdit(true);
        Canvas.updateAll();
        throw error;
      }

      Canvas.updateAll();
      const result = {
        removed_root: removedRoot,
        removed_counts: deletionCounts,
        affected_animations: affectedAnimationCount,
      };
      return {
        content: [
          {
            type: "text" as const,
            text: `Removed ${removedRoot.type} ${removedRoot.name} (${removedRoot.uuid}); ${deletionCounts.total_nodes} outliner node(s) removed and ${affectedAnimationCount} affected animation(s) included in Undo.`,
          },
        ],
        structuredContent: result,
      };
    },
  }, elementToolDocs[0].status);

  createTool(elementToolDocs[1].name, {
    ...elementToolDocs[1],
    async execute({ name, origin, rotation, parent, groups }) {
      requireOpenProject("adding a Group");
      const batch =
        groups ??
        [
          {
            name: name ?? "",
            origin,
            rotation,
            parent,
          },
        ];

      assertBatchGroupNamesAvailable(batch);
      const parentPlan = planGroupBatchParents(batch);

      Undo.initEdit({
        elements: [],
        outliner: true,
        groups: [],
        collections: [],
      });

      const created: Group[] = [];
      try {
        for (const [index, entry] of batch.entries()) {
          const plannedParent = parentPlan[index];
          const parentGroup =
            typeof plannedParent === "number"
              ? created[plannedParent]
              : plannedParent;
          if (!parentGroup) {
            throw new Error(
              `Internal Group batch parent plan ${plannedParent} was not available for entry ${index}.`
            );
          }
          const group = new Group({
            name: entry.name,
            origin: entry.origin ?? [0, 0, 0],
            rotation: entry.rotation ?? [0, 0, 0],
          }).init();
          group.addTo(parentGroup);
          created.push(group);
        }
        Undo.finishEdit(
          created.length > 1 ? "Agent added groups" : "Agent added group",
          { outliner: true, groups: created }
        );
      } catch (error) {
        Undo.cancelEdit(true);
        Canvas.updateAll();
        throw error;
      }

      Canvas.updateAll();
      const result = {
        groups: created.map((group) => ({
          uuid: group.uuid,
          name: group.name,
          parent: group.parent instanceof Group ? group.parent.uuid : "root",
        })),
        ...(groups
          ? {}
          : {
              group: {
                uuid: created[0].uuid,
                name: created[0].name,
                origin: [...created[0].origin],
                rotation: [...created[0].rotation],
                parent:
                  created[0].parent instanceof Group
                    ? created[0].parent.uuid
                    : "root",
              },
            }),
      };
      return {
        content: [
          {
            type: "text" as const,
            text:
              created.length > 1
                ? `Added ${created.length} Groups: ${created
                    .map((group) => group.name)
                    .join(", ")}.`
                : `Added Group ${created[0].name} (${created[0].uuid}).`,
          },
        ],
        structuredContent: result,
      };
    },
  }, elementToolDocs[1].status);

  createTool(elementToolDocs[2].name, {
    ...elementToolDocs[2],
    async execute({ include_cubes, max_depth, max_nodes }) {
      interface IOutlineNode {
        name: string;
        uuid: string;
        type: "cube" | "group";
        children?: IOutlineNode[];
      }

      const truncated: string[] = [];
      let returnedNodes = 0;
      let nodeLimitReached = false;

      const nodeFor = (el: unknown, depth: number): IOutlineNode | null => {
        if (el instanceof Group) {
          if (returnedNodes >= max_nodes) {
            nodeLimitReached = true;
            return null;
          }
          returnedNodes += 1;
          const node: IOutlineNode = {
            name: el.name,
            uuid: el.uuid,
            type: "group",
            children: [],
          };
          if (depth >= max_depth) {
            truncated.push(el.name);
            delete node.children;
            return node;
          }
          for (const child of el.children ?? []) {
            const childNode = nodeFor(child, depth + 1);
            if (childNode) node.children!.push(childNode);
            if (nodeLimitReached) break;
          }
          return node;
        }
        if (el instanceof Cube) {
          if (!include_cubes) return null;
          if (returnedNodes >= max_nodes) {
            nodeLimitReached = true;
            return null;
          }
          returnedNodes += 1;
          return { name: el.name, uuid: el.uuid, type: "cube" };
        }
        return null;
      };

      const roots: IOutlineNode[] = [];
      for (const element of Outliner.root) {
        const node = nodeFor(element, 0);
        if (node) roots.push(node);
        if (nodeLimitReached) break;
      }

      const counts = {
        groups: Group.all.length,
        cubes: Cube.all.length,
      };

      return JSON.stringify(
        {
          counts,
          returned_nodes: returnedNodes,
          max_nodes,
          truncated_at_max_nodes: nodeLimitReached || undefined,
          truncated_at_max_depth: truncated.length ? truncated : undefined,
          roots,
        }
      );
    },
  }, elementToolDocs[2].status);

  createTool(elementToolDocs[3].name, {
    ...elementToolDocs[3],
    async execute({ id, offset, newName }) {
      requireOpenProject("duplicating an element");
      const element = resolveUniqueDestructiveElement(id);
      if (!(element instanceof Cube) && !(element instanceof Group)) {
        throw new Error(
          `Element "${id}" cannot be duplicated by the Bedrock Cuboid workflow. Use an explicit Cube or Group target.`
        );
      }

      preflightFaithfulDuplicate(element, offset, newName);

      Undo.initEdit({
        elements: [],
        groups: [],
        outliner: true,
        selection: true,
        collections: [],
      });
      let dup: Cube | Group;
      try {
        dup = duplicateFaithfully(element, offset, newName);
        Undo.finishEdit("Agent duplicated element");
      } catch (error) {
        Undo.cancelEdit(true);
        Canvas.updateAll();
        throw error;
      }

      Canvas.updateAll();
      const result = { element: elementContinuationState(dup) };
      return {
        content: [
          {
            type: "text" as const,
            text: `Duplicated "${element.name}" as "${dup.name}" (${dup.uuid}).`,
          },
        ],
        structuredContent: result,
      };
    },
  }, elementToolDocs[3].status);

  createTool(elementToolDocs[4].name, {
    ...elementToolDocs[4],
    async execute({ id, new_name }) {
      requireOpenProject("renaming an element");
      const element = resolveUniqueDestructiveElement(id);

      if (element.name === new_name) {
        throw new Error(
          `rename_element request for ${continuationElementType(element)} ${element.name} (${element.uuid}) has no authored effect.`
        );
      }
      if (element instanceof Group) {
        assertGroupNameAvailable(new_name, element.uuid);
      } else if (element instanceof Locator || element instanceof NullObject) {
        assertAnchorRenameAvailable(element, new_name);
      }

      Undo.initEdit({
        elements: element instanceof Group ? [] : [element],
        groups: element instanceof Group ? [element] : [],
        outliner: true,
        collections: [],
      });

      try {
        element.name = new_name;
        Undo.finishEdit("Agent renamed element");
      } catch (error) {
        Undo.cancelEdit(true);
        Canvas.updateAll();
        throw error;
      }

      Canvas.updateAll();
      const result = { element: elementContinuationState(element) };
      return {
        content: [
          {
            type: "text" as const,
            text: `Renamed ${result.element.type} ${result.element.name} (${result.element.uuid}).`,
          },
        ],
        structuredContent: result,
      };
    },
  }, elementToolDocs[4].status);

  createTool(elementToolDocs[5].name, {
    ...elementToolDocs[5],
    async execute({
      name_pattern,
      name_contains,
      type,
      parent_group,
      min_size,
      max_size,
      selected_only,
      limit,
    }) {
      requireOpenProject("searching elements");
      const regex = safeCompileRegex(name_pattern);
      if (name_contains !== undefined && name_contains.length === 0) {
        throw new Error("name_contains cannot be empty; omit it only when no substring filter is intended.");
      }
      const needle = name_contains?.toLowerCase() ?? null;
      const parentScope = resolveOptionalGroupScope(parent_group);

      const candidates: Array<Cube | Group> = [
        ...(selected_only ? Cube.selected : Cube.all),
        ...(selected_only ? Group.all.filter((g: Group) => g.selected) : Group.all),
      ];

      const matches: IElementMatch[] = [];
      let truncated = false;

      for (const el of candidates) {
        const elType = getElementType(el);
        if (!elType) continue;
        if (type !== "any" && elType !== type) continue;
        if (regex && !regex.test(el.name)) continue;
        if (needle !== null && !el.name.toLowerCase().includes(needle)) continue;
        if (parentScope && !isDescendantOf(el, parentScope)) continue;

        if (el instanceof Cube && (min_size || max_size)) {
          if (exceedsBounds(cubeSize(el), min_size, max_size)) continue;
        }

        if (matches.length >= limit) {
          truncated = true;
          break;
        }
        matches.push({
          uuid: el.uuid,
          name: el.name,
          type: elType,
          parent: getParentName(el),
        });
      }

      return JSON.stringify(
        {
          count: matches.length,
          truncated,
          matches,
        }
      );
    },
  }, elementToolDocs[5].status);

  createTool(elementToolDocs[6].name, {
    ...elementToolDocs[6],
    async execute({ type, add_to_selection, parent_group }) {
      requireOpenProject("selecting elements");
      const parentScope = resolveOptionalGroupScope(parent_group);

      const pool: Array<Cube | Group> =
        type === "cube" ? [...Cube.all] : [...Group.all];

      const targets = parentScope
        ? pool.filter((el) => isDescendantOf(el, parentScope))
        : pool;

      if (!add_to_selection) {
        Cube.all.forEach((c: Cube) => c.selected && c.unselect?.());
        Group.all.forEach((g: Group) => {
          if (g.selected) g.selected = false;
        });
      }

      for (const el of targets) {
        if (el instanceof Group) {
          el.selected = true;
          continue;
        }
        el.select?.(new MouseEvent("click", { shiftKey: true }));
      }

      updateSelection();
      Canvas.updateAll();

      return JSON.stringify(
        {
          type,
          selected: targets.length,
          parent_group: parentScope?.name ?? null,
        }
      );
    },
  }, elementToolDocs[6].status);

  createTool(elementToolDocs[7].name, {
    ...elementToolDocs[7],
    async execute({ texture, include_face_keys, limit }) {
      const tex = resolveUniqueTextureForDiscovery(texture);
      const matches: IFilterByMaterialMatch[] = [];
      let truncated = false;

      for (const cube of Cube.all) {
        const faceKeys: string[] = [];
        for (const [key, face] of Object.entries(cube.faces ?? {})) {
          const faceTexId = (face as { texture?: unknown }).texture;
          if (faceTexId === tex.uuid || faceTexId === tex.id) {
            faceKeys.push(key);
          }
        }
        if (faceKeys.length > 0) {
          if (matches.length >= limit) {
            truncated = true;
            break;
          }
          matches.push({
            uuid: cube.uuid,
            name: cube.name,
            type: "cube",
            ...(include_face_keys ? { faces: faceKeys } : {}),
          });
        }
      }

      return JSON.stringify(
        {
          texture: { uuid: tex.uuid, name: tex.name },
          count: matches.length,
          truncated,
          matches,
        }
      );
    },
  }, elementToolDocs[7].status, false);

  createTool(elementToolDocs[8].name, {
    ...elementToolDocs[8],
    async execute() {
      requireOpenProject("reading the editor selection");
      const cubes = Cube.selected.map((c: Cube) => ({
        uuid: c.uuid,
        name: c.name,
        type: "cube" as const,
      }));
      const groups = Group.all
        .filter((g: Group) => g.selected)
        .map((g: Group) => ({
          uuid: g.uuid,
          name: g.name,
          type: "group" as const,
        }));

      const activeTexture = Texture.selected
        ? {
            uuid: Texture.selected.uuid,
            id: Texture.selected.id,
            name: Texture.selected.name,
            width: Texture.selected.width,
            height: Texture.selected.height,
          }
        : null;

      return JSON.stringify(
        {
          counts: {
            cubes: cubes.length,
            groups: groups.length,
          },
          cubes,
          groups,
          active_texture: activeTexture,
        }
      );
    },
  }, elementToolDocs[8].status);

  createTool("modify_group", {
    description:
      "Modifies one explicit Bedrock Group pivot, rotation, or visibility. Use rename_element for names.",
    annotations: { title: "Modify Group", destructiveHint: true },
    parameters: modifyGroupParameters,
    async execute({ id, origin, rotation, visibility }) {
      requireOpenProject("modifying a Group");
      const group = resolveCoreGroup(
        id,
        "Use list_outline or find_elements_by_criteria, then inspect_element to confirm the intended Group UUID."
      );
      const sameOrigin =
        origin === undefined || vector3Equals(origin, group.origin);
      const sameRotation =
        rotation === undefined || vector3Equals(rotation, group.rotation);
      const sameVisibility =
        visibility === undefined || visibility === group.visibility;
      if (sameOrigin && sameRotation && sameVisibility) {
        throw new Error(
          `modify_group request for Group ${group.name} (${group.uuid}) has no authored effect.`
        );
      }
      if (origin !== undefined && !sameOrigin && !group.mesh) {
        throw new Error(
          `Group ${group.name} (${group.uuid}) has no preview mesh, so transferOrigin() cannot safely preserve descendant visual placement. No mutation was applied.`
        );
      }

      const changedFields = [
        origin !== undefined && !sameOrigin ? "origin" : null,
        rotation !== undefined && !sameRotation ? "rotation" : null,
        visibility !== undefined && !sameVisibility ? "visibility" : null,
      ].filter((field): field is string => field !== null);

      Undo.initEdit({
        elements: [],
        groups: [group],
        outliner: true,
        collections: [],
      });
      try {
        if (origin !== undefined && !sameOrigin) {
          group.transferOrigin(origin as [number, number, number]);
          if (!vector3Equals(group.origin, origin)) {
            throw new Error(
              `Group ${group.name} (${group.uuid}) pivot readback did not match the requested origin.`
            );
          }
        }
        group.extend({
          ...(rotation !== undefined && !sameRotation
            ? { rotation: rotation as [number, number, number] }
            : {}),
          ...(visibility !== undefined && !sameVisibility ? { visibility } : {}),
        });
        Undo.finishEdit("Agent modified group");
      } catch (error) {
        Undo.cancelEdit(true);
        Canvas.updateAll();
        throw error;
      }

      Canvas.updateAll();
      return {
        content: [
          {
            type: "text" as const,
            text: `Modified Group ${group.name} (${group.uuid}); changed: ${changedFields.join(", ")}.`,
          },
        ],
        structuredContent: {
          execution: "applied" as const,
          id: group.uuid,
          name: group.name,
          changed_fields: changedFields,
        },
      };
    },
  }, STATUS_STABLE);

  createTool("reparent_element", {
    description:
      "Moves one explicit Cube or Group to a new parent. Rejects self/circular hierarchy; local transform is preserved.",
    annotations: { title: "Reparent Element", destructiveHint: true },
    parameters: reparentElementParameters,
    async execute({ id, parent }) {
      requireOpenProject("reparenting an element");
      const element = resolveUniqueDestructiveElement(id);
      const nextParent = resolveParentGroup(parent);
      const previousParent =
        element.parent instanceof Group ? element.parent : "root";

      if (nextParent !== "root") {
        if (nextParent === element) {
          throw new Error("An element cannot be parented to itself.");
        }
        if (element instanceof Group && isDescendantOf(nextParent, element)) {
          throw new Error("A Group cannot be reparented into its own descendant.");
        }
      }
      if (previousParent === nextParent) {
        throw new Error(
          `reparent_element request for ${element.name} (${element.uuid}) has no authored effect.`
        );
      }

      Undo.initEdit({
        elements: element instanceof Group ? [] : [element],
        groups: element instanceof Group ? [element] : [],
        outliner: true,
        collections: [],
      });
      try {
        element.addTo(nextParent);
        Undo.finishEdit("Agent reparented element");
      } catch (error) {
        Undo.cancelEdit(true);
        Canvas.updateAll();
        throw error;
      }

      Canvas.updateAll();
      const currentParent =
        element.parent instanceof Group ? element.parent.uuid : "root";
      return {
        content: [
          {
            type: "text" as const,
            text: `Reparented ${element.name} (${element.uuid}): ${previousParent === "root" ? "root" : previousParent.uuid} -> ${currentParent}. Local transform preserved.`,
          },
        ],
        structuredContent: {
          execution: "applied" as const,
          id: element.uuid,
          name: element.name,
          previous_parent:
            previousParent === "root" ? "root" : previousParent.uuid,
          parent: currentParent,
          transform_policy: "preserve_local",
        },
      };
    },
  }, STATUS_EXPERIMENTAL);
}

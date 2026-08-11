/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL, STATUS_STABLE } from "@/lib/constants";
import { resolveCoreGroup, resolveCoreTexture } from "@/lib/coreIdentity";
import {
  elementIdSchema,
  vector3Schema,
  autoUvEnum,
} from "@/lib/zodObjects";

export const removeElementParameters = z.object({
  id: elementIdSchema.describe(
    "Exact element UUID or exact unique name. Ambiguous names are rejected before removal."
  ),
});

export const elementTypeEnum = z.enum(["cube", "group", "any"]);

export const findElementsByCriteriaParameters = z.object({
  name_pattern: z
    .string()
    .optional()
    .describe(
      "Optional case-sensitive name regex; invalid/oversized/unsafe patterns are rejected."
    ),
  name_contains: z
    .string()
    .optional()
    .describe("Substring to match element names. Case-insensitive."),
  type: elementTypeEnum
    .optional()
    .default("any")
    .describe("Restrict to Cube or Group results."),
  parent_group: z
    .string()
    .optional()
    .describe(
      "Optional parent Group UUID or unique exact name."
    ),
  min_size: vector3Schema
    .optional()
    .describe("Minimum Cube size [x,y,z]."),
  max_size: vector3Schema
    .optional()
    .describe("Maximum Cube size [x,y,z]."),
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
    .default(200)
    .describe("Maximum number of results to return."),
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
    .optional()
    .describe(
      "Exact parent Group UUID or exact unique name. Omit for no parent scope. Ambiguous or missing explicit scopes are rejected before selection changes."
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
});

export const getSelectionParameters = z.object({});

export const addGroupParameters = z.object({
  name: z.string().min(1),
  origin: vector3Schema
    .optional()
    .default([0, 0, 0])
    .describe(
      "Group pivot/origin; omit for organizational Groups unless a joint/attachment needs it."
    ),
  rotation: vector3Schema
    .optional()
    .default([0, 0, 0])
    .describe(
      "Initial Group rotation; omit for neutral zero rotation."
    ),
  parent: z
    .string()
    .optional()
    .default("root")
    .describe(
      "Parent Group UUID or unique exact name; omit/use `root` for intentional root."
    ),
  visibility: z.boolean().optional().default(true),
  autouv: autoUvEnum
    .optional()
    .default("0")
    .describe(
      "Auto UV setting. 0 = disabled, 1 = enabled, 2 = relative auto UV."
    ),
  selected: z.boolean().optional().default(false),
  shade: z.boolean().optional().default(false),
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
    .default(32)
    .describe("Maximum tree depth to traverse. Use a small value to summarize large projects."),
  max_nodes: z
    .number()
    .int()
    .min(1)
    .max(5000)
    .optional()
    .default(500)
    .describe(
      "Maximum Cube/Group nodes returned. Increase only when a larger hierarchy is actually needed; use targeted search when truncated."
    ),
});

export const duplicateElementParameters = z.object({
  id: elementIdSchema.describe(
    "Exact Cube or Group UUID, or exact unique name. Ambiguous names are rejected before duplication."
  ),
  offset: vector3Schema.optional().default([0, 0, 0]),
  newName: z.string().optional(),
});

export const renameElementParameters = z.object({
  id: elementIdSchema.describe(
    "Exact outliner element or Group UUID, or exact unique name. Ambiguous names are rejected before rename."
  ),
  new_name: z.string().describe("New name to assign."),
});

export const elementToolDocs: ToolSpec[] = [
  {
    name: "remove_element",
    description:
      "Removes one explicit outliner element or Group target. UUID is resolved first; exact names must be unique. Group removal follows native recursive subtree deletion and captures the deleted subtree plus affected animation state in one Undo edit.",
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
      "Adds a Group with neutral pivot/rotation defaults. Optional explicit parent must resolve uniquely before mutation; use non-zero pivot/rotation only for a real joint/attachment/transform reason.",
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
      "Returns a bounded hierarchical Cube/Group outline. Use `include_cubes=false` for a group-only skeleton; `max_depth` limits depth and `max_nodes` limits total returned nodes. Truncation is reported so targeted search can continue without dumping the whole project.",
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
      "Duplicates one explicit Cube/Group by UUID or unique exact name, with optional offset/name. Use only for established repetition/symmetry; duplication is not a shortcut for deciding primary geometry.",
    annotations: { title: "Duplicate Element", destructiveHint: true },
    parameters: duplicateElementParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "rename_element",
    description:
      "Renames one explicit outliner element or Group target. UUID is resolved first; an exact name is accepted only when unique. Ambiguous names fail before mutation.",
    annotations: { title: "Rename Element", destructiveHint: true },
    parameters: renameElementParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "find_elements_by_criteria",
    description:
      "Read-only Cube/Group search by name, type, parent scope, size range, or selection. Explicit parent scope must resolve uniquely; invalid regex is rejected. Returns metadata only.",
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
      "Selection helper for workflows that require editor selection, mainly texture/Paint. It is not a normal geometry-targeting path; use explicit identities for geometry. Optional parent scope must resolve uniquely.",
    annotations: {
      title: "Select All of Type",
      destructiveHint: true,
    },
    parameters: selectAllOfTypeParameters,
    status: STATUS_STABLE,
  },
  {
    name: "filter_by_material",
    description:
      "Returns Cubes that reference one explicit texture. The texture reference resolves UUID first, then exact texture ID, then exact name only when unique; ambiguous IDs or names fail before discovery. Matching cube face keys are included when requested. This tool is read-only and does not activate, paint, or mutate textures.",
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
      "Returns current Cube/Group selection plus active Texture. Normal geometry inspection and mutation should prefer explicit UUIDs and focused inspection; use this only when editor selection state matters.",
    annotations: {
      title: "Get Selection",
      readOnlyHint: true,
    },
    parameters: getSelectionParameters,
    status: STATUS_STABLE,
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
  if (!reference) return null;
  return resolveCoreGroup(
    reference,
    "Use list_outline to confirm the intended Group UUID, or omit parent_group when no scope is intended."
  );
}

type ResolvedElement = OutlinerElement | Group;

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
// Heuristic: nested quantifiers like (a+)+, (.*)*, (a+|b)*, (foo){2,}+ are the
// classic catastrophic-backtracking shape. Reject quantifiers applied to a
// group whose body already contains a quantifier.
const CATASTROPHIC_BACKTRACK_HEURISTIC = /\([^)]*[+*?][^)]*\)\s*[+*?{]/;

function safeCompileRegex(pattern: string | undefined): RegExp | null {
  if (!pattern) return null;
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

export function registerElementTools() {
  createTool(elementToolDocs[0].name, {
    ...elementToolDocs[0],
    async execute({ id }) {
      const element = resolveUniqueDestructiveElement(id);
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
      return `Removed element with ID ${id}`;
    },
  }, elementToolDocs[0].status);

  createTool(elementToolDocs[1].name, {
    ...elementToolDocs[1],
    async execute({
      name,
      origin,
      rotation,
      parent,
      visibility,
      autouv,
      selected,
      shade,
    }) {
      const parentGroup = resolveParentGroup(parent);

      Undo.initEdit({
        elements: [],
        outliner: true,
        groups: [],
        collections: [],
      });

      let group: Group;
      try {
        group = new Group({
          name,
          origin,
          rotation,
          autouv: Number(autouv) as 0 | 1 | 2,
          visibility: Boolean(visibility),
          selected: Boolean(selected),
          shade: Boolean(shade),
        }).init();
        group.addTo(parentGroup);
        Undo.finishEdit("Agent added group", { outliner: true, groups: [group] });
      } catch (error) {
        Undo.cancelEdit(true);
        Canvas.updateAll();
        throw error;
      }

      Canvas.updateAll();
      const result = {
        group: {
uuid: group.uuid,
name: group.name,
origin: [...group.origin],
rotation: [...group.rotation],
visibility: group.visibility !== false,
parent: group.parent instanceof Group ? group.parent.uuid : "root",
        },
      };
      return {
        content: [
{
  type: "text" as const,
  text: `Added Group ${group.name} (${group.uuid}).`,
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
      const element = resolveUniqueDestructiveElement(id);
      if (!(element instanceof Cube) && !(element instanceof Group)) {
        throw new Error(
          `Element "${id}" cannot be duplicated by the Bedrock Cuboid workflow. Use an explicit Cube or Group target.`
        );
      }

      function cloneCube(cube: Cube, parent: any) {
        const dupe = new Cube({
          name: newName || `${cube.name}_copy`,
          from: [cube.from[0] + offset[0], cube.from[1] + offset[1], cube.from[2] + offset[2]],
          to: [cube.to[0] + offset[0], cube.to[1] + offset[1], cube.to[2] + offset[2]],
          origin: [cube.origin[0] + offset[0], cube.origin[1] + offset[1], cube.origin[2] + offset[2]],
          rotation: cube.rotation,
          autouv: cube.autouv,
          uv_offset: cube.uv_offset,
          mirror_uv: cube.mirror_uv,
          shade: cube.shade,
          inflate: cube.inflate,
          color: cube.color,
          visibility: cube.visibility,
        }).init();
        dupe.addTo(parent);
        return dupe;
      }

      function cloneGroup(group: Group, parent: any) {
        const dupeGroup = new Group({
          name: newName || `${group.name}_copy`,
          origin: [group.origin[0] + offset[0], group.origin[1] + offset[1], group.origin[2] + offset[2]],
          rotation: group.rotation,
          autouv: group.autouv,
          selected: group.selected,
          shade: group.shade,
          visibility: group.visibility,
        }).init();
        dupeGroup.addTo(parent);
        group.children.forEach((child: any) => cloneElement(child, dupeGroup));
        return dupeGroup;
      }

      function cloneElement(el: any, parent: any) {
        if (el instanceof Cube) return cloneCube(el, parent);
        if (el instanceof Group) return cloneGroup(el, parent);
        throw new Error(
          `Group "${parent?.name ?? "(unknown)"}" contains an element type that the Bedrock Cuboid duplicate workflow does not clone.`
        );
      }

      Undo.initEdit({ elements: [], outliner: true, collections: [] });
      let dup: Cube | Group;
      try {
        dup = cloneElement(element, element.parent ?? Outliner);
        Undo.finishEdit("Agent duplicated element");
      } catch (error) {
        Undo.cancelEdit(true);
        Canvas.updateAll();
        throw error;
      }

      Canvas.updateAll();
      return `Duplicated "${element.name}" as "${dup.name}" (ID: ${dup.uuid}).`;
    },
  }, elementToolDocs[3].status);

  /**
   * Rename an element. Mirrors the simple property change seen in the existing tools,
   * using `extend` to apply the change and updating the editor.
   */
  createTool(elementToolDocs[4].name, {
    ...elementToolDocs[4],
    async execute({ id, new_name }) {
      const element = resolveUniqueDestructiveElement(id);
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
      return `Renamed element "${id}" to "${new_name}".`;
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
      const regex = safeCompileRegex(name_pattern);
      const needle = name_contains?.toLowerCase() ?? null;
      const parentScope = resolveOptionalGroupScope(parent_group);

      const candidates: Array<Cube | Group> = [
        ...(selected_only ? Cube.selected : Cube.all),
        ...(selected_only ? Group.all.filter((g: Group) => g.selected) : Group.all),
      ];

      const matches: IElementMatch[] = [];

      for (const el of candidates) {
        if (matches.length >= limit) break;

        const elType = getElementType(el);
        if (!elType) continue;
        if (type !== "any" && elType !== type) continue;
        if (regex && !regex.test(el.name)) continue;
        if (needle && !el.name.toLowerCase().includes(needle)) continue;
        if (parentScope && !isDescendantOf(el, parentScope)) continue;

        if (el instanceof Cube && (min_size || max_size)) {
          if (exceedsBounds(cubeSize(el), min_size, max_size)) continue;
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
          truncated: matches.length >= limit,
          matches,
        }
      );
    },
  }, elementToolDocs[5].status);

  createTool(elementToolDocs[6].name, {
    ...elementToolDocs[6],
    async execute({ type, add_to_selection, parent_group }) {
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
    async execute({ texture, include_face_keys }) {
      const tex = resolveUniqueTextureForDiscovery(texture);
      const matches: IFilterByMaterialMatch[] = [];

      for (const cube of Cube.all) {
        const faceKeys: string[] = [];
        for (const [key, face] of Object.entries(cube.faces ?? {})) {
          const faceTexId = (face as { texture?: unknown }).texture;
          if (faceTexId === tex.uuid || faceTexId === tex.id) {
            faceKeys.push(key);
          }
        }
        if (faceKeys.length > 0) {
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
          matches,
        }
      );
    },
  }, elementToolDocs[7].status);

  createTool(elementToolDocs[8].name, {
    ...elementToolDocs[8],
    async execute() {
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
}

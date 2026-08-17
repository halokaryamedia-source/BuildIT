import { readFileSync } from "node:fs";

const ID_RE = /^[a-z][a-z0-9_-]{0,31}$/;
const NAME_RE = /^[A-Za-z0-9][A-Za-z0-9 ._-]{0,63}$/;
const GEOMETRY_RE = /^geometry\.[a-z0-9][a-z0-9_.-]{0,63}$/;
const PNG_NAME_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,59}\.png$/;
const HEX_RE = /^#[0-9a-fA-F]{6}$/;
const RESOLUTIONS = new Set([16, 32, 64]);
const CHECKER_CELLS = new Set([1, 2, 4, 8, 16]);
const LIMITS = Object.freeze({ operations: 32, groups: 8, cubes: 24, textures: 4 });

function fail(message) {
  throw new Error(`Invalid authoring request: ${message}`);
}

function object(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${label} must be an object`);
  return value;
}

function exactKeys(value, allowed, label) {
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) fail(`${label}.${key} is not allowed`);
  }
}

function requiredString(value, label, pattern) {
  if (typeof value !== "string" || !pattern.test(value)) fail(`${label} has an invalid value`);
  return value;
}

function vector3(value, label) {
  if (!Array.isArray(value) || value.length !== 3) fail(`${label} must be a 3-number array`);
  return value.map((entry, index) => {
    if (typeof entry !== "number" || !Number.isFinite(entry) || entry < -64 || entry > 64) {
      fail(`${label}[${index}] must be finite and within -64..64`);
    }
    return entry;
  });
}

function uvOffset(value, label) {
  if (!Array.isArray(value) || value.length !== 2) fail(`${label} must be a 2-integer array`);
  return value.map((entry, index) => {
    if (!Number.isInteger(entry) || entry < 0 || entry > 64) fail(`${label}[${index}] must be an integer within 0..64`);
    return entry;
  });
}

function resolution(value, label) {
  if (!Number.isInteger(value) || !RESOLUTIONS.has(value)) fail(`${label} must be one of 16, 32, 64`);
  return value;
}

function color(value, label) {
  return requiredString(value, label, HEX_RE).toLowerCase();
}

function safeId(value, label) {
  return requiredString(value, label, ID_RE);
}

function safeName(value, label) {
  return requiredString(value, label, NAME_RE);
}

function validatePattern(raw, width, height, label) {
  const pattern = object(raw, label);
  if (pattern.type === "solid") {
    exactKeys(pattern, ["type", "color"], label);
    return { type: "solid", color: color(pattern.color, `${label}.color`) };
  }
  if (pattern.type === "checker") {
    exactKeys(pattern, ["type", "primary", "secondary", "cell"], label);
    if (!Number.isInteger(pattern.cell) || !CHECKER_CELLS.has(pattern.cell)) {
      fail(`${label}.cell must be one of 1, 2, 4, 8, 16`);
    }
    if (width % pattern.cell !== 0 || height % pattern.cell !== 0) {
      fail(`${label}.cell must divide the texture dimensions`);
    }
    return {
      type: "checker",
      primary: color(pattern.primary, `${label}.primary`),
      secondary: color(pattern.secondary, `${label}.secondary`),
      cell: pattern.cell,
    };
  }
  fail(`${label}.type must be solid or checker`);
}

export function validateAuthoringRequest(raw) {
  const request = object(raw, "request");
  exactKeys(request, ["schema_version", "project", "operations"], "request");
  if (request.schema_version !== 1) fail("schema_version must be 1");

  const project = object(request.project, "project");
  exactKeys(project, ["name", "identifier", "texture_width", "texture_height", "box_uv"], "project");
  const normalizedProject = {
    name: safeName(project.name, "project.name"),
    identifier: requiredString(project.identifier, "project.identifier", GEOMETRY_RE),
    texture_width: resolution(project.texture_width, "project.texture_width"),
    texture_height: resolution(project.texture_height, "project.texture_height"),
    box_uv: project.box_uv,
  };
  if (normalizedProject.box_uv !== true) fail("project.box_uv must be true in contract v1");

  if (!Array.isArray(request.operations) || request.operations.length < 3 || request.operations.length > LIMITS.operations) {
    fail(`operations must contain 3..${LIMITS.operations} entries`);
  }

  const knownIds = new Set();
  const groupIds = new Set();
  const textureIds = new Set();
  const groupNames = new Set();
  const cubeNames = new Set();
  const textureNames = new Set();
  const counts = { groups: 0, cubes: 0, textures: 0 };
  const operations = [];

  function uniqueId(id, label) {
    if (knownIds.has(id)) fail(`${label} duplicates id ${id}`);
    knownIds.add(id);
  }
  function uniqueName(set, name, label) {
    if (set.has(name)) fail(`${label} duplicates name ${name}`);
    set.add(name);
  }

  request.operations.forEach((rawOperation, index) => {
    const label = `operations[${index}]`;
    const operation = object(rawOperation, label);
    if (operation.op === "create_texture") {
      exactKeys(operation, ["op", "id", "name", "width", "height", "pattern"], label);
      const id = safeId(operation.id, `${label}.id`);
      const name = requiredString(operation.name, `${label}.name`, PNG_NAME_RE);
      uniqueId(id, label);
      uniqueName(textureNames, name, label);
      const width = resolution(operation.width, `${label}.width`);
      const height = resolution(operation.height, `${label}.height`);
      if (width !== normalizedProject.texture_width || height !== normalizedProject.texture_height) {
        fail(`${label} texture dimensions must match project resolution`);
      }
      counts.textures++;
      if (counts.textures > LIMITS.textures) fail(`texture count exceeds ${LIMITS.textures}`);
      textureIds.add(id);
      operations.push({
        op: "create_texture",
        id,
        name,
        width,
        height,
        pattern: validatePattern(operation.pattern, width, height, `${label}.pattern`),
      });
      return;
    }

    if (operation.op === "add_group") {
      exactKeys(operation, ["op", "id", "name", "origin", "parent"], label);
      const id = safeId(operation.id, `${label}.id`);
      const name = safeName(operation.name, `${label}.name`);
      uniqueId(id, label);
      uniqueName(groupNames, name, label);
      let parent;
      if (operation.parent !== undefined) {
        parent = safeId(operation.parent, `${label}.parent`);
        if (!groupIds.has(parent)) fail(`${label}.parent must reference an earlier group`);
      }
      counts.groups++;
      if (counts.groups > LIMITS.groups) fail(`group count exceeds ${LIMITS.groups}`);
      groupIds.add(id);
      operations.push({ op: "add_group", id, name, origin: vector3(operation.origin, `${label}.origin`), ...(parent ? { parent } : {}) });
      return;
    }

    if (operation.op === "add_cube") {
      exactKeys(operation, ["op", "id", "name", "parent", "from", "to", "origin", "uv_offset", "texture"], label);
      const id = safeId(operation.id, `${label}.id`);
      const name = safeName(operation.name, `${label}.name`);
      const parent = safeId(operation.parent, `${label}.parent`);
      const texture = safeId(operation.texture, `${label}.texture`);
      if (!groupIds.has(parent)) fail(`${label}.parent must reference an earlier group`);
      if (!textureIds.has(texture)) fail(`${label}.texture must reference an earlier texture`);
      uniqueId(id, label);
      uniqueName(cubeNames, name, label);
      const from = vector3(operation.from, `${label}.from`);
      const to = vector3(operation.to, `${label}.to`);
      for (let axis = 0; axis < 3; axis++) {
        const size = to[axis] - from[axis];
        if (!(size > 0 && size <= 32)) fail(`${label} cube size must be > 0 and <= 32 on every axis`);
      }
      counts.cubes++;
      if (counts.cubes > LIMITS.cubes) fail(`cube count exceeds ${LIMITS.cubes}`);
      operations.push({
        op: "add_cube",
        id,
        name,
        parent,
        from,
        to,
        origin: vector3(operation.origin, `${label}.origin`),
        uv_offset: uvOffset(operation.uv_offset, `${label}.uv_offset`),
        texture,
      });
      return;
    }

    fail(`${label}.op must be create_texture, add_group, or add_cube`);
  });

  if (counts.textures < 1 || counts.groups < 1 || counts.cubes < 1) {
    fail("contract v1 requires at least one texture, one group, and one cube");
  }

  return { schema_version: 1, project: normalizedProject, operations };
}

export function loadAuthoringRequest(path) {
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    fail(`request JSON could not be parsed: ${error instanceof Error ? error.message : String(error)}`);
  }
  return validateAuthoringRequest(parsed);
}

export const AUTHORING_LIMITS = LIMITS;

export {};

import { PRODUCT_ID } from "@/lib/productIdentity";

const DEFAULT_MCP_URL = "http://127.0.0.1:3000/bb-mcp";
const DEFAULT_BUNDLE_PATH = "dist/blockit_mcp.js";
const EXPECTED_PROFILE = "bedrock_entity";
const EXPECTED_PHASE = "geometry";
const PROTOCOL_VERSION = "2025-06-18";
const PROJECT_NAME = "blockit_geometry_e2e_disposable";

const REQUIRED_TOOLS = [
  "create_project",
  "add_group",
  "place_cube",
  "inspect_element",
  "modify_cube",
  "capture_model_views",
  "undo",
  "redo",
] as const;

type JsonObject = Record<string, unknown>;
type ContentItem =
  | { type: "text"; text: string }
  | { type: "image"; data: string; mimeType: string };
type ToolCallPayload = {
  content?: ContentItem[];
  structuredContent?: unknown;
  isError?: boolean;
};
type RpcEnvelope = {
  result?: unknown;
  error?: { code?: number; message?: string; data?: unknown };
};

const args = process.argv.slice(2);
const confirmedDisposable = args.includes("--confirm-disposable");
const targetUrl = (process.env.BLOCKIT_MCP_URL || DEFAULT_MCP_URL).replace(/\/+$/, "");
const bundlePath = process.env.BLOCKIT_MCP_BUNDLE || DEFAULT_BUNDLE_PATH;

function requireDisposableConsent(): void {
  if (!confirmedDisposable) {
    throw new Error(
      "LIVE GEOMETRY E2E REFUSED: pass --confirm-disposable. This replaces/discards the active Blockbench project and intentionally leaves a disposable test project open."
    );
  }
}

function expect(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function sameVec3(actual: unknown, expected: readonly number[]): boolean {
  return (
    Array.isArray(actual) &&
    actual.length === 3 &&
    actual.every((value, index) => value === expected[index])
  );
}

async function responseJson(response: Response): Promise<RpcEnvelope> {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as RpcEnvelope;
  } catch {
    throw new Error(
      `Expected JSON from BlockIT but received HTTP ${response.status}: ${text.slice(0, 400)}`
    );
  }
}

async function postRpc(
  method: string,
  params: JsonObject,
  id: number,
  protocolHeader = true
): Promise<RpcEnvelope> {
  const headers = new Headers({
    accept: "application/json, text/event-stream",
    "content-type": "application/json",
    connection: "close",
  });
  if (protocolHeader) headers.set("mcp-protocol-version", PROTOCOL_VERSION);

  const response = await fetch(targetUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
  });
  const envelope = await responseJson(response);
  expect(
    response.status === 200,
    `${method} returned HTTP ${response.status}: ${JSON.stringify(envelope.error ?? envelope)}`
  );
  expect(
    envelope.error === undefined,
    `${method} returned JSON-RPC error: ${JSON.stringify(envelope.error)}`
  );
  return envelope;
}

let rpcId = 10;
async function callTool(
  name: (typeof REQUIRED_TOOLS)[number],
  toolArgs: JsonObject
): Promise<ToolCallPayload> {
  const envelope = await postRpc(
    "tools/call",
    { name, arguments: toolArgs },
    rpcId++
  );
  const result = (envelope.result ?? {}) as ToolCallPayload;
  expect(result.isError !== true, `${name} returned MCP isError=true.`);
  return result;
}

function structuredObject(result: ToolCallPayload, toolName: string): JsonObject {
  if (
    result.structuredContent &&
    typeof result.structuredContent === "object" &&
    !Array.isArray(result.structuredContent)
  ) {
    return result.structuredContent as JsonObject;
  }

  const text = result.content?.find(
    (item): item is Extract<ContentItem, { type: "text" }> => item.type === "text"
  )?.text;
  if (text) {
    try {
      const parsed = JSON.parse(text) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as JsonObject;
      }
    } catch {
      // The tool may intentionally return a concise human summary only.
    }
  }

  throw new Error(`${toolName} returned no machine-readable object.`);
}

function firstImage(result: ToolCallPayload, toolName: string) {
  const image = result.content?.find(
    (item): item is Extract<ContentItem, { type: "image" }> => item.type === "image"
  );
  expect(image, `${toolName} returned no MCP image content.`);
  expect(image.mimeType === "image/png", `${toolName} returned ${image.mimeType}, expected image/png.`);
  expect(image.data.length > 0, `${toolName} returned empty image data.`);
  return image;
}

async function localBuildIdentity(): Promise<string> {
  const file = Bun.file(bundlePath);
  expect(await file.exists(), `Missing ${bundlePath}. Build and deploy BlockIT first.`);
  const match = (await file.text()).match(
    /globalThis\.__BLOCKIT_BUILD_ID__\s*=\s*["'](sha256:[a-f0-9]{64})["']/
  );
  expect(match?.[1], `${bundlePath} has no valid embedded build identity.`);
  return match[1];
}

async function preflight(): Promise<{ buildIdentity: string }> {
  const buildIdentity = await localBuildIdentity();
  const healthResponse = await fetch(`${targetUrl}/health`, {
    headers: { connection: "close" },
  });
  expect(healthResponse.status === 200, `BlockIT /health returned HTTP ${healthResponse.status}.`);
  const health = (await healthResponse.json()) as JsonObject;
  const product = (health.product ?? {}) as JsonObject;
  const transport = (health.transport ?? {}) as JsonObject;

  expect(product.id === PRODUCT_ID, `Wrong MCP product: ${String(product.id)}.`);
  expect(product.profile === EXPECTED_PROFILE, `Expected profile ${EXPECTED_PROFILE}; live=${String(product.profile)}.`);
  expect(product.authoring_phase === EXPECTED_PHASE, `Expected Geometry phase; live=${String(product.authoring_phase)}.`);
  expect(health.build_identity === buildIdentity, `Stale installed BlockIT build: local=${buildIdentity}; live=${String(health.build_identity)}.`);
  expect(
    transport.mode === "stateless" && transport.response_mode === "json",
    "Live MCP transport is not the expected stateless JSON contract."
  );

  const initialize = await postRpc(
    "initialize",
    {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: { name: "blockit-geometry-live-e2e", version: "1.0.0" },
    },
    1,
    false
  );
  const initializeResult = (initialize.result ?? {}) as JsonObject;
  expect(initializeResult.protocolVersion === PROTOCOL_VERSION, `Unexpected MCP protocol ${String(initializeResult.protocolVersion)}.`);
  const instructions = initializeResult.instructions;
  expect(
    typeof instructions === "string" && instructions.includes("ACTIVE PHASE: GEOMETRY"),
    "Initialize instructions do not prove active Geometry ownership."
  );

  const listed = await postRpc("tools/list", {}, 2);
  const listResult = (listed.result ?? {}) as { tools?: Array<{ name?: string }> };
  const names = new Set((listResult.tools ?? []).map((tool) => tool.name));
  for (const required of REQUIRED_TOOLS) {
    expect(names.has(required), `Live Geometry surface is missing ${required}.`);
  }

  return { buildIdentity };
}

async function captureFront() {
  const result = await callTool("capture_model_views", {
    views: ["front"],
    front_direction: "+z",
    framing: {
      mode: "explicit",
      min: [-8, -2, -6],
      max: [8, 12, 6],
    },
  });
  return firstImage(result, "capture_model_views");
}

async function inspectCube(uuid: string): Promise<JsonObject> {
  return structuredObject(
    await callTool("inspect_element", { id: uuid, detail: "geometry" }),
    "inspect_element"
  );
}

async function main(): Promise<void> {
  requireDisposableConsent();
  const environment = await preflight();

  await callTool("create_project", {
    name: PROJECT_NAME,
    discard_unsaved: true,
    resolution: 128,
  });

  const groupResult = structuredObject(
    await callTool("add_group", {
      name: "e2e_root",
      origin: [0, 8, 0],
    }),
    "add_group"
  );
  const group = (groupResult.group ?? {}) as JsonObject;
  expect(typeof group.uuid === "string", "add_group returned no Group UUID.");

  const placement = structuredObject(
    await callTool("place_cube", {
      group: group.uuid,
      elements: [
        {
          name: "e2e_body",
          from: [-4, 0, -2],
          to: [4, 8, 2],
        },
      ],
    }),
    "place_cube"
  );
  const cubes = placement.cubes as Array<JsonObject> | undefined;
  const cubeUuid = cubes?.[0]?.uuid;
  expect(typeof cubeUuid === "string", "place_cube returned no Cube UUID.");

  const before = await inspectCube(cubeUuid);
  expect(sameVec3(before.from, [-4, 0, -2]), `Unexpected initial from: ${JSON.stringify(before.from)}.`);
  expect(sameVec3(before.to, [4, 8, 2]), `Unexpected initial to: ${JSON.stringify(before.to)}.`);
  expect(
    (before.parent as JsonObject | null)?.uuid === group.uuid,
    "Cube is not parented to the created Group."
  );
  const beforeImage = await captureFront();

  const modification = structuredObject(
    await callTool("modify_cube", {
      id: cubeUuid,
      to: [6, 8, 2],
    }),
    "modify_cube"
  );
  const after = await inspectCube(cubeUuid);
  expect(sameVec3(after.to, [6, 8, 2]), `modify_cube readback stayed stale: ${JSON.stringify(after.to)}.`);
  const afterImage = await captureFront();
  expect(
    beforeImage.data !== afterImage.data,
    "Geometry readback changed but fixed-frame rendered PNG stayed byte-identical."
  );

  const undo = structuredObject(await callTool("undo", { steps: 1 }), "undo");
  expect(undo.undone_count === 1, `Undo count mismatch: ${String(undo.undone_count)}.`);
  const undone = await inspectCube(cubeUuid);
  expect(sameVec3(undone.to, [4, 8, 2]), `Undo did not restore Cube geometry: ${JSON.stringify(undone.to)}.`);

  const redo = structuredObject(await callTool("redo", { steps: 1 }), "redo");
  expect(redo.redone_count === 1, `Redo count mismatch: ${String(redo.redone_count)}.`);
  const redone = await inspectCube(cubeUuid);
  expect(sameVec3(redone.to, [6, 8, 2]), `Redo did not restore modified Cube geometry: ${JSON.stringify(redone.to)}.`);

  console.log(
    JSON.stringify(
      {
        ok: true,
        proof: "live_geometry_e2e",
        product: PRODUCT_ID,
        profile: EXPECTED_PROFILE,
        phase: EXPECTED_PHASE,
        build_identity: environment.buildIdentity,
        project: PROJECT_NAME,
        group_uuid: group.uuid,
        cube_uuid: cubeUuid,
        initial_to: before.to,
        modified_to: after.to,
        render_changed: true,
        undo_restored_initial_geometry: true,
        redo_restored_modified_geometry: true,
        visual_quality: "not_evaluated",
        modification_receipt_present: Object.keys(modification).length > 0,
        note: "The disposable project is intentionally left open. This proves live mutation/readback/render/Undo/Redo behavior, not reference fidelity or accepted model quality.",
      },
      null,
      2
    )
  );
}

if (import.meta.main) {
  await main();
}

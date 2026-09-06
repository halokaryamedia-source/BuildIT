import {
  AUTHORING_E2E_BONE_NAME,
  AUTHORING_E2E_CUBE_NAME,
  AUTHORING_E2E_PROJECT_NAME,
  LiveMcpClient,
  expect,
  firstImage,
  requireDisposableConsent,
  structuredObject,
  type JsonObject,
} from "./live-e2e-common";

const REQUIRED_TOOLS = [
  "create_project",
  "add_group",
  "manage_cubes",
  "inspect_elements",
  "capture_model_views",
  "undo",
  "redo",
] as const;

function sameVec3(actual: unknown, expected: readonly number[]): boolean {
  return (
    Array.isArray(actual) &&
    actual.length === 3 &&
    actual.every((value, index) => value === expected[index])
  );
}

async function inspectCube(client: LiveMcpClient, uuid: string): Promise<JsonObject> {
  return structuredObject(
    await client.callTool(
      "inspect_elements",
      { mode: "detail", id: uuid, detail: "geometry" },
      "inspection"
    ),
    "inspect_elements"
  );
}

async function captureFront(client: LiveMcpClient) {
  return firstImage(
    await client.callTool(
      "capture_model_views",
      {
        views: ["front"],
        front_direction: "+z",
        framing: {
          mode: "explicit",
          min: [-8, -2, -6],
          max: [8, 12, 6],
        },
      },
      "evidence"
    ),
    "capture_model_views"
  );
}

async function main(): Promise<void> {
  requireDisposableConsent();
  const client = new LiveMcpClient({
    expectedPhase: "geometry",
    requiredTools: REQUIRED_TOOLS,
  });
  const environment = await client.preflight();

  await client.callTool(
    "create_project",
    {
      name: AUTHORING_E2E_PROJECT_NAME,
      discard_unsaved: true,
      resolution: 128,
    },
    "mutation"
  );

  const groupResult = structuredObject(
    await client.callTool(
      "add_group",
      {
        name: AUTHORING_E2E_BONE_NAME,
        origin: [0, 8, 0],
      },
      "mutation"
    ),
    "add_group"
  );
  const group = (groupResult.group ?? {}) as JsonObject;
  expect(typeof group.uuid === "string", "add_group returned no Group UUID.");

  const placement = structuredObject(
    await client.callTool(
      "manage_cubes",
      {
        operation: "create",
        group: group.uuid,
        elements: [
          {
            name: AUTHORING_E2E_CUBE_NAME,
            from: [-4, 0, -2],
            to: [4, 8, 2],
          },
        ],
      },
      "mutation"
    ),
    "manage_cubes"
  );
  const cubes = placement.cubes as Array<JsonObject> | undefined;
  const cubeUuid = cubes?.[0]?.uuid;
  expect(typeof cubeUuid === "string", "manage_cubes create returned no Cube UUID.");

  const before = await inspectCube(client, cubeUuid);
  expect(
    sameVec3(before.from, [-4, 0, -2]),
    `Unexpected initial from: ${JSON.stringify(before.from)}.`
  );
  expect(
    sameVec3(before.to, [4, 8, 2]),
    `Unexpected initial to: ${JSON.stringify(before.to)}.`
  );
  expect(
    (before.parent as JsonObject | null)?.uuid === group.uuid,
    "Cube is not parented to the created Group."
  );
  const beforeImage = await captureFront(client);

  const modification = structuredObject(
    await client.callTool(
      "manage_cubes",
      {
        operation: "update",
        id: cubeUuid,
        to: [6, 8, 2],
      },
      "mutation"
    ),
    "manage_cubes"
  );
  const after = await inspectCube(client, cubeUuid);
  expect(
    sameVec3(after.to, [6, 8, 2]),
    `manage_cubes update readback stayed stale: ${JSON.stringify(after.to)}.`
  );
  const afterImage = await captureFront(client);
  expect(
    beforeImage.data !== afterImage.data,
    "Geometry readback changed but fixed-frame rendered PNG stayed byte-identical."
  );

  const undo = structuredObject(
    await client.callTool("undo", { steps: 1 }, "history"),
    "undo"
  );
  expect(undo.undone_count === 1, `Undo count mismatch: ${String(undo.undone_count)}.`);
  const undone = await inspectCube(client, cubeUuid);
  expect(
    sameVec3(undone.to, [4, 8, 2]),
    `Undo did not restore Cube geometry: ${JSON.stringify(undone.to)}.`
  );

  const redo = structuredObject(
    await client.callTool("redo", { steps: 1 }, "history"),
    "redo"
  );
  expect(redo.redone_count === 1, `Redo count mismatch: ${String(redo.redone_count)}.`);
  const redone = await inspectCube(client, cubeUuid);
  expect(
    sameVec3(redone.to, [6, 8, 2]),
    `Redo did not restore modified Cube geometry: ${JSON.stringify(redone.to)}.`
  );

  console.log(
    JSON.stringify(
      {
        ok: true,
        proof: "live_geometry_e2e",
        profile: "bedrock_entity",
        phase: "geometry",
        build_identity: environment.buildIdentity,
        fixture: {
          project: AUTHORING_E2E_PROJECT_NAME,
          animation_bone_name: AUTHORING_E2E_BONE_NAME,
          group_uuid: group.uuid,
          cube_uuid: cubeUuid,
          next: "Keep the same shared AUTHORING session and run verify:texturing-live with --confirm-disposable; no Geometry-to-Texturing phase switch is required.",
        },
        initial_to: before.to,
        modified_to: after.to,
        render_changed: true,
        undo_restored_initial_geometry: true,
        redo_restored_modified_geometry: true,
        modification_receipt_present: Object.keys(modification).length > 0,
        current_public_cube_surface: "manage_cubes",
        current_public_inspection_surface: "inspect_elements",
        cost: client.snapshotMetrics(),
        visual_quality: "not_evaluated",
        note: "Leaves the disposable project open for Texturing in the same shared AUTHORING session. Runtime/readback/render/history proof is not reference-fidelity proof.",
      },
      null,
      2
    )
  );
}

if (import.meta.main) {
  await main();
}

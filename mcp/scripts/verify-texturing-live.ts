import {
  AUTHORING_E2E_PROJECT_NAME,
  LiveMcpClient,
  expect,
  firstImage,
  imageDigest,
  requireDisposableConsent,
  structuredObject,
  type JsonObject,
} from "./live-e2e-common";

const REQUIRED_TOOLS = [
  "get_project_info",
  "create_texture",
  "get_texture",
  "paint_with_brush",
  "undo",
  "redo",
] as const;
const ATLAS_NAME = "e2e_atlas";

async function atlasImage(client: LiveMcpClient, texture: string) {
  return firstImage(
    await client.callTool("get_texture", { texture }, "evidence"),
    "get_texture"
  );
}

async function main(): Promise<void> {
  requireDisposableConsent();
  const client = new LiveMcpClient({
    expectedPhase: "texturing",
    requiredTools: REQUIRED_TOOLS,
  });
  const environment = await client.preflight();

  const projectInfo = structuredObject(
    await client.callTool("get_project_info", {}, "inspection"),
    "get_project_info"
  );
  const project = (projectInfo.project ?? {}) as JsonObject;
  const resolution = (projectInfo.resolution ?? {}) as JsonObject;
  expect(
    project.name === AUTHORING_E2E_PROJECT_NAME,
    `Expected shared disposable project ${AUTHORING_E2E_PROJECT_NAME}; current=${String(project.name)}. Run verify:geometry-live first.`
  );
  expect(
    resolution.texture_width === 128 && resolution.texture_height === 128,
    `Expected 128x128 disposable UV resolution; current=${JSON.stringify(resolution)}.`
  );

  const created = structuredObject(
    await client.callTool(
      "create_texture",
      {
        name: ATLAS_NAME,
        width: 128,
        height: 128,
      },
      "mutation"
    ),
    "create_texture"
  );
  const texture = (created.texture ?? {}) as JsonObject;
  expect(typeof texture.uuid === "string", "create_texture returned no Texture UUID.");

  const beforeImage = await atlasImage(client, texture.uuid);
  const beforeHash = imageDigest(beforeImage);

  const paintReceipt = structuredObject(
    await client.callTool(
      "paint_with_brush",
      {
        texture_id: texture.uuid,
        coordinates: [
          { x: 16, y: 16 },
          { x: 32, y: 24 },
          { x: 48, y: 40 },
          { x: 64, y: 56 },
        ],
        brush_settings: {
          size: 1,
          opacity: 255,
          softness: 0,
          shape: "square",
          color: "#FF2244",
          blend_mode: "default",
        },
        connect_strokes: false,
      },
      "mutation"
    ),
    "paint_with_brush"
  );

  const afterImage = await atlasImage(client, texture.uuid);
  const afterHash = imageDigest(afterImage);
  expect(
    afterHash !== beforeHash,
    "Texturing mutation completed but full-atlas PNG readback stayed byte-identical."
  );

  const undo = structuredObject(
    await client.callTool("undo", { steps: 1 }, "history"),
    "undo"
  );
  expect(undo.undone_count === 1, `Undo count mismatch: ${String(undo.undone_count)}.`);
  const undoneHash = imageDigest(await atlasImage(client, texture.uuid));
  expect(
    undoneHash === beforeHash,
    "Undo did not restore the exact pre-paint atlas PNG."
  );

  const redo = structuredObject(
    await client.callTool("redo", { steps: 1 }, "history"),
    "redo"
  );
  expect(redo.redone_count === 1, `Redo count mismatch: ${String(redo.redone_count)}.`);
  const redoneHash = imageDigest(await atlasImage(client, texture.uuid));
  expect(
    redoneHash === afterHash,
    "Redo did not restore the exact post-paint atlas PNG."
  );

  console.log(
    JSON.stringify(
      {
        ok: true,
        proof: "live_texturing_e2e",
        profile: "bedrock_entity",
        phase: "texturing",
        build_identity: environment.buildIdentity,
        project: AUTHORING_E2E_PROJECT_NAME,
        texture_uuid: texture.uuid,
        atlas_sha256: {
          before: beforeHash,
          after: afterHash,
          undo: undoneHash,
          redo: redoneHash,
        },
        painted_coordinate_count: 4,
        paint_receipt_present: Object.keys(paintReceipt).length > 0,
        exact_atlas_readback_changed: true,
        undo_restored_exact_atlas: true,
        redo_restored_exact_atlas: true,
        cost: client.snapshotMetrics(),
        visual_quality: "not_evaluated",
        next: "Switch BlockIT MCP Authoring Phase to animation, reload/reconnect, then run verify:animation-live with --confirm-disposable.",
        note: "Uses one disconnected-coordinate brush batch and exact full-atlas PNG hashes. This proves live bitmap mutation/readback/history, not texture quality.",
      },
      null,
      2
    )
  );
}

if (import.meta.main) {
  await main();
}

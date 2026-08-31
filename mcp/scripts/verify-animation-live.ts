import {
  AUTHORING_E2E_BONE_NAME,
  AUTHORING_E2E_PROJECT_NAME,
  LiveMcpClient,
  expect,
  requireDisposableConsent,
  structuredObject,
  type JsonObject,
} from "./live-e2e-common";

const REQUIRED_TOOLS = [
  "get_project_info",
  "create_animation",
  "inspect_animation",
  "manage_keyframes",
  "batch_keyframe_operations",
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

function rotationValueAt(inspection: JsonObject, time: number): unknown {
  const focusedBone = (inspection.focused_bone ?? {}) as JsonObject;
  const channels = (focusedBone.channels ?? {}) as JsonObject;
  const rotation = (channels.rotation ?? {}) as JsonObject;
  const keyframes = (rotation.keyframes ?? []) as Array<JsonObject>;
  const frame = keyframes.find(
    (candidate) =>
      typeof candidate.time === "number" && Math.abs(candidate.time - time) < 1e-9
  );
  expect(frame, `inspect_animation returned no rotation keyframe at ${time}s.`);
  const values = frame.values as unknown;
  if (Array.isArray(values) && values.length > 0 && Array.isArray(values[0])) {
    return values[0];
  }
  return values;
}

async function inspectBone(
  client: LiveMcpClient,
  animationId: string
): Promise<JsonObject> {
  return structuredObject(
    await client.callTool(
      "inspect_animation",
      {
        animation_id: animationId,
        bone: AUTHORING_E2E_BONE_NAME,
      },
      "inspection"
    ),
    "inspect_animation"
  );
}

async function main(): Promise<void> {
  requireDisposableConsent();
  const client = new LiveMcpClient({
    expectedPhase: "animation",
    requiredTools: REQUIRED_TOOLS,
  });
  const environment = await client.preflight();

  const projectInfo = structuredObject(
    await client.callTool("get_project_info", {}, "inspection"),
    "get_project_info"
  );
  const project = (projectInfo.project ?? {}) as JsonObject;
  expect(
    project.name === AUTHORING_E2E_PROJECT_NAME,
    `Expected shared disposable project ${AUTHORING_E2E_PROJECT_NAME}; current=${String(project.name)}. Run verify:geometry-live first.`
  );

  const created = structuredObject(
    await client.callTool(
      "create_animation",
      {
        name: "blockit_e2e_motion",
        loop: false,
        animation_length: 1,
        bones: {
          [AUTHORING_E2E_BONE_NAME]: [
            { time: 0, rotation: [0, 0, 0] },
            { time: 0.5, rotation: [0, 20, 0] },
            { time: 1, rotation: [0, 0, 0] },
          ],
        },
      },
      "mutation"
    ),
    "create_animation"
  );
  const animation = (created.animation ?? {}) as JsonObject;
  expect(typeof animation.uuid === "string", "create_animation returned no Animation UUID.");

  const before = await inspectBone(client, animation.uuid);
  expect(
    sameVec3(rotationValueAt(before, 0.5), [0, 20, 0]),
    `Unexpected initial 0.5s rotation: ${JSON.stringify(rotationValueAt(before, 0.5))}.`
  );
  expect(
    sameVec3(rotationValueAt(before, 1), [0, 0, 0]),
    `Unexpected initial 1s rotation: ${JSON.stringify(rotationValueAt(before, 1))}.`
  );

  const editReceipt = structuredObject(
    await client.callTool(
      "manage_keyframes",
      {
        animation_id: animation.uuid,
        action: "edit",
        bone_name: AUTHORING_E2E_BONE_NAME,
        channel: "rotation",
        keyframes: [
          { time: 0.5, values: [0, 35, 0], interpolation: "linear" },
          { time: 1, values: [0, -10, 0], interpolation: "linear" },
        ],
      },
      "mutation"
    ),
    "manage_keyframes"
  );

  const after = await inspectBone(client, animation.uuid);
  expect(
    sameVec3(rotationValueAt(after, 0.5), [0, 35, 0]),
    `0.5s keyframe edit did not persist: ${JSON.stringify(rotationValueAt(after, 0.5))}.`
  );
  expect(
    sameVec3(rotationValueAt(after, 1), [0, -10, 0]),
    `1s keyframe edit did not persist: ${JSON.stringify(rotationValueAt(after, 1))}.`
  );

  const undo = structuredObject(
    await client.callTool("undo", { steps: 1 }, "history"),
    "undo"
  );
  expect(undo.undone_count === 1, `Undo count mismatch: ${String(undo.undone_count)}.`);
  const undone = await inspectBone(client, animation.uuid);
  expect(
    sameVec3(rotationValueAt(undone, 0.5), [0, 20, 0]) &&
      sameVec3(rotationValueAt(undone, 1), [0, 0, 0]),
    "Undo did not restore the two-keyframe cohort in one history step."
  );

  const redo = structuredObject(
    await client.callTool("redo", { steps: 1 }, "history"),
    "redo"
  );
  expect(redo.redone_count === 1, `Redo count mismatch: ${String(redo.redone_count)}.`);
  const redone = await inspectBone(client, animation.uuid);
  expect(
    sameVec3(rotationValueAt(redone, 0.5), [0, 35, 0]) &&
      sameVec3(rotationValueAt(redone, 1), [0, -10, 0]),
    "Redo did not restore the two-keyframe cohort in one history step."
  );

  console.log(
    JSON.stringify(
      {
        ok: true,
        proof: "live_animation_e2e",
        profile: "bedrock_entity",
        phase: "animation",
        build_identity: environment.buildIdentity,
        project: AUTHORING_E2E_PROJECT_NAME,
        animation_uuid: animation.uuid,
        target_bone: AUTHORING_E2E_BONE_NAME,
        edited_keyframe_count: 2,
        multi_key_edit_receipt_present: Object.keys(editReceipt).length > 0,
        exact_readback_changed: true,
        undo_restored_original_cohort: true,
        redo_restored_edited_cohort: true,
        batch_keyframe_operations_exposed: true,
        cost: client.snapshotMetrics(),
        motion_quality: "not_evaluated",
        note: "Uses one manage_keyframes call for two authored values and exact inspect_animation readback. This proves live mutation/history behavior, not playback quality or Minecraft execution.",
      },
      null,
      2
    )
  );
}

if (import.meta.main) {
  await main();
}

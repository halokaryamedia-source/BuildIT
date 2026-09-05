import {
  LiveMcpClient,
  expect,
  requireDisposableConsent,
  structuredObject,
  type JsonObject,
} from "./live-e2e-common";

const REQUIRED_TOOLS = [
  "create_project",
  "add_group",
  "place_cube",
  "inspect_model_bounds",
  "modify_cube",
] as const;

const PROJECT_NAME = "blockit_surface_gap_disposable";
const GROUP_NAME = "surface_gap_root";

function warningStrings(result: JsonObject): string[] {
  const warnings = result.warnings;
  expect(
    Array.isArray(warnings),
    "inspect_model_bounds returned no warnings array."
  );
  expect(
    warnings.every((warning) => typeof warning === "string"),
    "inspect_model_bounds returned a non-string warning entry."
  );
  return warnings as string[];
}

function pairEdgeGapWarning(
  warnings: readonly string[],
  firstUuid: string,
  secondUuid: string
): string | undefined {
  return warnings.find(
    (warning) =>
      warning.includes("Possible coplanar edge-gap:") &&
      warning.includes(firstUuid) &&
      warning.includes(secondUuid)
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
      name: PROJECT_NAME,
      discard_unsaved: true,
      resolution: 128,
    },
    "mutation"
  );

  const groupResult = structuredObject(
    await client.callTool(
      "add_group",
      {
        name: GROUP_NAME,
        origin: [0, 2, 0],
      },
      "mutation"
    ),
    "add_group"
  );
  const group = (groupResult.group ?? {}) as JsonObject;
  expect(typeof group.uuid === "string", "add_group returned no Group UUID.");

  const placement = structuredObject(
    await client.callTool(
      "place_cube",
      {
        group: group.uuid,
        elements: [
          {
            name: "surface_lower",
            from: [-2, 0, -1],
            to: [2, 2, 1],
          },
          {
            name: "surface_upper",
            from: [-2, 2.5, -1],
            to: [2, 4.5, 1],
          },
        ],
      },
      "mutation"
    ),
    "place_cube"
  );
  const cubes = placement.cubes as Array<JsonObject> | undefined;
  const lowerUuid = cubes?.[0]?.uuid;
  const upperUuid = cubes?.[1]?.uuid;
  expect(
    typeof lowerUuid === "string",
    "place_cube returned no lower Cube UUID."
  );
  expect(
    typeof upperUuid === "string",
    "place_cube returned no upper Cube UUID."
  );

  const withGap = structuredObject(
    await client.callTool("inspect_model_bounds", {}, "inspection"),
    "inspect_model_bounds"
  );
  const gapWarnings = warningStrings(withGap);
  const detected = pairEdgeGapWarning(gapWarnings, lowerUuid, upperUuid);
  expect(
    detected,
    `Expected a coplanar edge-gap warning for the 0.5-unit fixture. warnings=${JSON.stringify(gapWarnings)}`
  );
  expect(
    detected.includes("0.5000 Blockbench units"),
    `Edge-gap warning did not report the expected 0.5000-unit distance: ${detected}`
  );

  await client.callTool(
    "modify_cube",
    {
      id: upperUuid,
      from: [-2, 2, -1],
      to: [2, 4, 1],
    },
    "mutation"
  );

  const closed = structuredObject(
    await client.callTool("inspect_model_bounds", {}, "inspection"),
    "inspect_model_bounds"
  );
  const closedWarnings = warningStrings(closed);
  expect(
    pairEdgeGapWarning(closedWarnings, lowerUuid, upperUuid) === undefined,
    `Coplanar edge-gap warning remained after closing the seam. warnings=${JSON.stringify(closedWarnings)}`
  );

  console.log(
    JSON.stringify(
      {
        ok: true,
        proof: "live_surface_gap_regression",
        build_identity: environment.buildIdentity,
        fixture: {
          project: PROJECT_NAME,
          group_uuid: group.uuid,
          lower_cube_uuid: lowerUuid,
          upper_cube_uuid: upperUuid,
          initial_gap_blockbench_units: 0.5,
        },
        detected_warning: detected,
        warning_cleared_after_contact: true,
        cost: client.snapshotMetrics(),
        visual_quality: "not_evaluated",
        note: "Targeted diagnostic regression only. It does not replace reference-fidelity or whole-model visual review.",
      },
      null,
      2
    )
  );
}

if (import.meta.main) {
  await main();
}

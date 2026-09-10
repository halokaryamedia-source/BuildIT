import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  buildNavigatorDelta,
  buildNavigatorPacket,
  type NavigatorPacket,
} from "../gateway/navigator";
import type { GatewayRuntimeStatus } from "../gateway/backend";

const status: GatewayRuntimeStatus = {
  gateway: "ready",
  affinity: { project_uuid: "fixture-project", authoring_phase: "geometry" },
  runtime: {
    online: true,
    endpoint: "http://127.0.0.1:3000/bb-mcp",
    mcp_client_ready: true,
    catalog_stale: false,
    runtime_signature: "fixture-runtime",
    connected_signature: "fixture-runtime",
    catalog_count: 47,
    health: {
      build_identity: "sha256:fixture",
      product: { authoring_phase: "geometry" },
      project_context: {
        active_project_uuid: "fixture-project",
        requested_project_uuid: "fixture-project",
        requested_project_available: true,
        open_project_count: 1,
      },
    },
  },
  operations: {
    active: 0,
    queued: 0,
    max_queue_depth: 8,
    completed: 0,
    failed: 0,
    timed_out: 0,
    rejected_busy: 0,
  },
  last_error: null,
};

function chars(value: unknown): number {
  return JSON.stringify(value).length;
}

const directory = await mkdtemp(join(tmpdir(), "blockit-navigator-measure-"));
try {
  await writeFile(
    join(directory, "README.md"),
    "# Fixture\n\nCurrent Stage: GEOMETRY\n\nGeometry: IN_PROGRESS\n\nUV Layout: NOT_STARTED\n\nTexturing: NOT_STARTED\n\nAnimation: NOT_STARTED\n\nCurrent next step: Continue primary geometry\n\nKnown blocker(s): None\n"
  );

  const full: NavigatorPacket = await buildNavigatorPacket(status, {
    workspacePath: directory,
  });
  const known = full.context.required.map((handle) => handle.id);
  const cached = await buildNavigatorPacket(status, { knownContextIds: known });
  const delta = buildNavigatorDelta({
    capability: "manage_cubes",
    phaseBefore: "geometry",
    phaseAfter: "geometry",
    projectUuid: "fixture-project",
    succeeded: true,
  });

  const fullChars = chars(full);
  const cachedChars = chars(cached);
  const deltaChars = chars(delta);
  const cachedReduction = fullChars > 0
    ? Number((((fullChars - cachedChars) / fullChars) * 100).toFixed(2))
    : 0;

  console.log(JSON.stringify({
    proof: "static Navigator payload footprint; not whole-session model-token usage",
    full_packet_chars: fullChars,
    cached_packet_chars: cachedChars,
    delta_chars: deltaChars,
    cached_packet_reduction_percent: cachedReduction,
    required_context_handles_full: full.context.required.length,
    required_context_handles_cached: cached.context.required.length,
  }, null, 2));
} finally {
  await rm(directory, { recursive: true, force: true });
}

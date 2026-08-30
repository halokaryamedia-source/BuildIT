import {
  DEFAULT_MCP_AUTHORING_PHASE,
  MCP_AUTHORING_PHASES,
} from "@/lib/authoringPhase";
import {
  applyMcpToolSurface,
  getMcpSurfaceToolNames,
} from "@/server/tools";
import {
  CODEX_TOOL_SEARCH_REFERENCE,
  TOOL_DISCOVERY_CASES,
  evaluateToolDiscovery,
} from "./evaluate-tool-discovery";

const originalCases = TOOL_DISCOVERY_CASES.map((testCase) => ({ ...testCase }));
const phaseSurfaces = new Map(
  MCP_AUTHORING_PHASES.map((phase) => [
    phase,
    new Set(getMcpSurfaceToolNames("bedrock_entity", phase)),
  ])
);

function routedPhase(expected: string): (typeof MCP_AUTHORING_PHASES)[number] {
  const matches = MCP_AUTHORING_PHASES.filter((phase) =>
    phaseSurfaces.get(phase)?.has(expected)
  );

  if (matches.length === 1) return matches[0]!;
  if (matches.includes(DEFAULT_MCP_AUTHORING_PHASE)) {
    return DEFAULT_MCP_AUTHORING_PHASE;
  }
  throw new Error(`No routed authoring phase owns expected tool ${expected}`);
}

const phaseReports: Record<string, unknown> = {};
let assignedCaseCount = 0;

try {
  for (const phase of MCP_AUTHORING_PHASES) {
    const cases = originalCases
      .filter((testCase) => routedPhase(testCase.expected) === phase)
      .map((testCase) => ({
        expected: testCase.expected,
        query: testCase.expected,
      }));

    assignedCaseCount += cases.length;
    applyMcpToolSurface("bedrock_entity", phase);
    TOOL_DISCOVERY_CASES.splice(0, TOOL_DISCOVERY_CASES.length, ...cases);

    const report = evaluateToolDiscovery();
    if (report.missing_expected_tools.length > 0) {
      throw new Error(
        `${phase} routed surface is missing expected tools: ${report.missing_expected_tools.join(", ")}`
      );
    }

    phaseReports[phase] = {
      surface_tool_count: report.enabled_tool_count,
      case_count: report.case_count,
      expected_tool_count: report.expected_tool_count,
      metrics: report.metrics,
      collision_pairs: report.collision_pairs,
      top_8_misses: report.top_8_misses,
    };
  }
} finally {
  applyMcpToolSurface("bedrock_entity", DEFAULT_MCP_AUTHORING_PHASE);
  TOOL_DISCOVERY_CASES.splice(
    0,
    TOOL_DISCOVERY_CASES.length,
    ...originalCases
  );
}

if (assignedCaseCount !== originalCases.length) {
  throw new Error(
    `Routed discovery assigned ${assignedCaseCount}/${originalCases.length} cases`
  );
}

console.log(
  JSON.stringify(
    {
      proxy: "codex_mcp_bm25_phase_scoped_static_proxy",
      proxy_note:
        "Static BM25 proxy for deferred spec loading after deterministic routing. Each expected tool is searched only inside its normal BlockIT Core + active-phase surface; Core tools use default Geometry. It is not installed-client proof and does not reproduce the exact upstream tokenizer implementation.",
      upstream_reference: CODEX_TOOL_SEARCH_REFERENCE,
      routed_query_contract: "<exact_selected_tool_name>",
      routed_query_note:
        "Use the exact selected tool name for the first deferred-spec query. A miss may be reformulated once with one distinguishing domain noun; that fallback is not modeled here.",
      phase_surface_contract:
        "phase-specific tools use their owning phase; Core tools use default Geometry",
      catalog_enabled_tool_count: 65,
      case_count: originalCases.length,
      phase_reports: phaseReports,
    },
    null,
    2
  )
);

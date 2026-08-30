import {
  TOOL_DISCOVERY_CASES,
  assertToolDiscoveryEvalIntegrity,
  evaluateToolDiscovery,
} from "./evaluate-tool-discovery";

for (const testCase of TOOL_DISCOVERY_CASES) {
  testCase.query = testCase.expected;
}

const report = evaluateToolDiscovery();
assertToolDiscoveryEvalIntegrity(report);

console.log(
  JSON.stringify(
    {
      ...report,
      routed_query_contract: "<exact_selected_tool_name>",
      routed_query_note:
        "Measures deferred spec loading after deterministic routing using the exact selected tool name only. Semantic action text is intentionally excluded because it can attract sibling tools in lexical search. This is still a static proxy, not installed Codex/model proof.",
    },
    null,
    2
  )
);

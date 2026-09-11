export const CONTROL_ROUTING_POLICY = {
  strategy: "DIRECT_FIRST",
  known_capability: "INVOKE_CAPABILITY",
  unknown_capability: "SEARCH_CAPABILITIES",
  schema_uncertain: "DESCRIBE_CAPABILITY",
  stale_or_lost_context: "STATUS",
  development_unresolved: "BOUNDED_CONTEXT_THEN_TARGETED_SEARCH",
  search_limit: 4,
} as const;

export type ControlRoutingPolicy = typeof CONTROL_ROUTING_POLICY;

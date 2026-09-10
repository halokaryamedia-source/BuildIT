import type { NavigatorSourceOwner } from "./types";
import { sourceOwnerForCapability } from "./registry";

export type NavigatorDevelopmentDomain =
  | "GEOMETRY"
  | "TEXTURING"
  | "ANIMATION"
  | "PARTICLE"
  | "GATEWAY"
  | "PROJECT_AFFINITY"
  | "BUILD_SYNC"
  | "RUNTIME"
  | "UNRESOLVED";

export type NavigatorDevelopmentResolution = {
  task_class: "MCP_DEVELOPMENT";
  intent: string;
  domain: NavigatorDevelopmentDomain;
  confidence: "STRONG" | "AMBIGUOUS" | "UNRESOLVED";
  matched_terms: string[];
  source_owners: NavigatorSourceOwner[];
  required_context_paths: string[];
  avoid_context_classes: string[];
};

type Rule = {
  domain: Exclude<NavigatorDevelopmentDomain, "UNRESOLVED">;
  terms: readonly string[];
  owners: () => NavigatorSourceOwner[];
};

const BASE_CONTEXT = [
  "AGENTS.md",
  "mcp/AGENTS.md",
  ".agents/skills/development-brief/SKILL.md",
] as const;

const owner = (source: string, test_owner: string | null = null): NavigatorSourceOwner => ({
  source,
  specialist: null,
  test_owner,
});

const uniqueOwners = (owners: readonly NavigatorSourceOwner[]): NavigatorSourceOwner[] => {
  const seen = new Set<string>();
  return owners.filter((entry) => {
    const key = `${entry.source}|${entry.specialist ?? ""}|${entry.test_owner ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const RULES: readonly Rule[] = [
  {
    domain: "ANIMATION",
    terms: ["animation", "animasi", "keyframe", "timeline", "motion", "gerak", "stiff", "kaku", "controller", "rigging"],
    owners: () => [
      sourceOwnerForCapability("manage_animation_timeline"),
      sourceOwnerForCapability("manage_animation_controller"),
      sourceOwnerForCapability("manage_animation_effects"),
    ],
  },
  {
    domain: "TEXTURING",
    terms: ["texture", "texturing", "tekstur", "paint", "painter", "uv", "atlas", "material", "pbr", "pixel"],
    owners: () => [
      sourceOwnerForCapability("create_texture"),
      sourceOwnerForCapability("paint_with_brush"),
      sourceOwnerForCapability("manage_material_instances"),
    ],
  },
  {
    domain: "GEOMETRY",
    terms: ["geometry", "geometri", "cube", "cuboid", "shape", "bentuk", "model shape", "floating", "melayang", "pivot", "hierarchy", "bone"],
    owners: () => [
      sourceOwnerForCapability("manage_cubes"),
      sourceOwnerForCapability("capture_model_views"),
      sourceOwnerForCapability("bone_rigging"),
    ],
  },
  {
    domain: "PARTICLE",
    terms: ["particle", "particles", "partikel", "snowstorm"],
    owners: () => [
      owner("mcp/server/tools/particle.ts", "mcp/tests/particle-contract.test.ts"),
    ],
  },
  {
    domain: "PROJECT_AFFINITY",
    terms: ["affinity", "project binding", "project tab", "tab blockbench", "wrong project", "salah project", "project context"],
    owners: () => [
      owner("mcp/gateway/backend.ts", "mcp/tests/project-affinity-gateway.test.ts"),
      owner("mcp/server/net.ts", "mcp/tests/project-affinity-runtime.test.ts"),
    ],
  },
  {
    domain: "BUILD_SYNC",
    terms: ["dev:sync", "hot reload", "live sync", "stale build", "build identity", "deploy", "rebuild", "plugin reload"],
    owners: () => [
      owner("mcp/build/index.ts", "mcp/tests/developer-loop.test.ts"),
      owner("mcp/build/watch-policy.ts", "mcp/tests/developer-loop.test.ts"),
      owner("mcp/scripts/deploy-local.ts", "mcp/tests/developer-loop.test.ts"),
    ],
  },
  {
    domain: "GATEWAY",
    terms: ["gateway", "stdio", "capability catalog", "search_capabilities", "describe_capability", "invoke_capability", "navigator"],
    owners: () => [
      owner("mcp/gateway/index.ts", "mcp/tests/gateway-contract.test.ts"),
      owner("mcp/gateway/backend.ts", "mcp/tests/gateway-backend.test.ts"),
      owner("mcp/gateway/contract.ts", "mcp/tests/gateway-contract.test.ts"),
    ],
  },
  {
    domain: "RUNTIME",
    terms: ["runtime", "blockbench api", "plugin lifecycle", "undo", "persistence", "native blockbench", "runtime error"],
    owners: () => [
      owner("mcp/index.ts", "mcp/tests/plugin-runtime-contract.test.ts"),
      owner("mcp/server/server.ts", "mcp/tests/server-instructions.test.ts"),
    ],
  },
];

function normalizedIntent(intent: string): string {
  return intent.trim().toLocaleLowerCase();
}

function matches(text: string, term: string): boolean {
  return text.includes(term.toLocaleLowerCase());
}

export function resolveDevelopmentIntent(intent: string): NavigatorDevelopmentResolution {
  const normalized = normalizedIntent(intent);
  if (!normalized) {
    return {
      task_class: "MCP_DEVELOPMENT",
      intent: "",
      domain: "UNRESOLVED",
      confidence: "UNRESOLVED",
      matched_terms: [],
      source_owners: [],
      required_context_paths: [...BASE_CONTEXT],
      avoid_context_classes: ["asset workspace history", "unrelated foundation docs", "unrelated Runtime schemas"],
    };
  }

  const scored = RULES.map((rule) => {
    const matched = rule.terms.filter((term) => matches(normalized, term));
    return { rule, matched, score: matched.length };
  })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return {
      task_class: "MCP_DEVELOPMENT",
      intent: intent.trim(),
      domain: "UNRESOLVED",
      confidence: "UNRESOLVED",
      matched_terms: [],
      source_owners: [],
      required_context_paths: [...BASE_CONTEXT],
      avoid_context_classes: ["asset workspace history", "unrelated foundation docs", "unrelated Runtime schemas"],
    };
  }

  const best = scored[0];
  const tied = scored.filter((entry) => entry.score === best.score);
  if (tied.length > 1) {
    return {
      task_class: "MCP_DEVELOPMENT",
      intent: intent.trim(),
      domain: "UNRESOLVED",
      confidence: "AMBIGUOUS",
      matched_terms: [...new Set(tied.flatMap((entry) => entry.matched))],
      source_owners: uniqueOwners(tied.flatMap((entry) => entry.rule.owners())).slice(0, 8),
      required_context_paths: [...BASE_CONTEXT],
      avoid_context_classes: ["asset workspace history", "unrelated foundation docs"],
    };
  }

  const specialistPaths = best.rule
    .owners()
    .map((entry) => entry.specialist)
    .filter((value): value is string => Boolean(value));

  return {
    task_class: "MCP_DEVELOPMENT",
    intent: intent.trim(),
    domain: best.rule.domain,
    confidence: "STRONG",
    matched_terms: best.matched,
    source_owners: uniqueOwners(best.rule.owners()).slice(0, 6),
    required_context_paths: [...new Set([...BASE_CONTEXT, ...specialistPaths])],
    avoid_context_classes: ["asset workspace history", "unrelated foundation docs", "unrelated Runtime schemas"],
  };
}

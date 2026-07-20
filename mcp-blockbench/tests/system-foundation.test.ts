import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");
const json = (path: string) => JSON.parse(read(path)) as Record<string, any>;

describe("BuildIT system foundation", () => {
  test("defines bounded contexts and canonical foundation artifacts", () => {
    for (const path of [
      "../CONTEXT-MAP.md",
      "../engines/chatgpt/CONTEXT.md",
      "CONTEXT.md",
      "../engines/codex/CONTEXT.md",
      "../engines/shared/CONTEXT.md",
      "../docs/architecture/SYSTEM_FOUNDATION.md",
      "../docs/architecture/FOUNDATION_AUDIT.md",
      "../docs/adr/0001-domain-owned-control-plane.md",
      "../docs/adr/0002-routellm-evaluation-boundary.md",
      "../openspec/changes/buildit-system-foundation/proposal.md",
      "../openspec/changes/buildit-system-foundation/design.md",
      "../openspec/changes/buildit-system-foundation/tasks.md",
      "../openspec/changes/buildit-system-foundation/DECISION_MAP.md",
    ]) {
      expect(existsSync(path), path).toBe(true);
    }

    const map = read("../CONTEXT-MAP.md");
    for (const context of [
      "Reference Design",
      "Asset Production",
      "Agent Orchestration",
      "Workflow Governance",
      "Repository Development",
    ]) {
      expect(map).toContain(context);
    }
  });

  test("selects domain-owned control plane and deep module seams", () => {
    const foundation = read("../docs/architecture/SYSTEM_FOUNDATION.md");
    for (const marker of [
      "Domain-owned control plane",
      "Design A — Linear hierarchy",
      "**Decision:** rejected.",
      "Design B — Domain-owned control plane",
      "**Decision:** selected.",
      "Deep modules and seams",
      "start_asset",
      "continue_asset",
      "submit_current_stage",
      "apply_review_decision",
      "finalize_asset",
      "Capability Gate",
      "Model Selector",
      "DeterministicBaselineSelector",
      "RouteLLMSelector",
      "Source-string marker tests",
      "real Blockbench end-to-end acceptance harness",
    ]) {
      expect(foundation).toContain(marker);
    }
  });

  test("keeps RouteLLM behind capability policy in evaluation mode", () => {
    const routing = read("../engines/codex/MODEL_ROUTING.md");
    const adr = read("../docs/adr/0002-routellm-evaluation-boundary.md");

    for (const marker of [
      "Capability Gate",
      "Candidate Pool",
      "Model Selector",
      "DeterministicBaselineSelector",
      "EVALUATION_ONLY",
      "A Model Selector cannot add candidates",
      "single-candidate pool does not call a Model Selector",
      "RouteLLM provider prototype unsupported",
    ]) {
      expect(routing).toContain(marker);
    }
    expect(adr).toContain(
      "Introduce RouteLLM only through an evaluation adapter behind the Capability Gate"
    );
    expect(adr).toContain("Protected task classes");
  });

  test("removes stale manual coordination from active workflow contracts", () => {
    const stateMachine = read("../engines/shared/workflow/STATE_MACHINE.md");
    const ponytail = read(
      "../openspec/changes/codex-local-workflow-rework/PONYTAIL_EXECUTION.md"
    );

    expect(stateMachine).toContain("Automatic project and writer readiness");
    expect(stateMachine).toContain("diagnostic recovery tools only");
    expect(stateMachine).not.toContain("→ rebind_active_project_identity");
    expect(stateMachine).not.toContain("→ manage_project_write_lease acquire");

    expect(ponytail).toContain("Automatic coordination");
    expect(ponytail).not.toContain("→ identity/lease");
    expect(ponytail).not.toContain(
      "normal implementation  → Terra Medium parent directly"
    );
  });

  test("assigns one canonical owner per shared rule class", () => {
    const governance = read("../engines/shared/workflow/GOVERNANCE.md");
    for (const marker of [
      "Domain ownership",
      "Requested outcome, non-goals, acceptance criteria",
      "Minimum-sufficient execution slice",
      "Active Asset Runtime State",
      "Capability and model eligibility",
      "Implementation correctness",
      "A Model Selector cannot grant capability",
      "No bounded OpenSpec change becomes a permanent store",
    ]) {
      expect(governance).toContain(marker);
    }
  });

  test("keeps the foundation change bounded and the old rework historical", () => {
    const proposal = read(
      "../openspec/changes/buildit-system-foundation/proposal.md"
    );
    const tasks = read("../openspec/changes/buildit-system-foundation/tasks.md");
    const oldDecision = read(
      "../openspec/changes/codex-local-workflow-rework/DEVELOPMENT_SUPPORT_LAYERS.md"
    );

    expect(proposal).toContain("Problem Statement");
    expect(proposal).toContain("Acceptance Criteria");
    expect(proposal).toContain("RouteLLM isolated behind a deterministic Capability Gate");
    expect(tasks).toContain("Tasks are tracer bullets through public seams");
    expect(tasks).toContain("Real Blockbench acceptance");
    expect(oldDecision).toContain("historical change");
    expect(oldDecision).toContain("buildit-system-foundation");
  });

  test("records an explicit critical readiness assessment", () => {
    const audit = read("../docs/architecture/FOUNDATION_AUDIT.md");
    for (const marker of [
      "not yet a repeatable production system",
      "approximately **5.5/10 as a repeatable internal production system**",
      "No real end-to-end proof",
      "Authority drift is already present",
      "The active OpenSpec change is no longer a bounded change",
      "RouteLLM cannot yet be treated as a working Codex router",
      "Quality is overfit to too few subjects",
      "Source-marker tests create false confidence",
      "Direct work on `Rework` weakens change review",
      "Not suitable now",
    ]) {
      expect(audit).toContain(marker);
    }
  });

  test("preserves production skill limits while changing development logic", () => {
    const profiles = json("../engines/shared/skills/skill-profiles.json");
    expect(profiles.max_production_skills_loaded).toBe(2);
    expect(profiles.profiles.GEOMETRY.max_loaded).toBe(2);
    expect(profiles.profiles.TEXTURE.max_loaded).toBe(2);
    expect(profiles.repository_development.authority_order).toBeUndefined();
    expect(profiles.repository_development.domain_ownership).toBeDefined();
  });
});

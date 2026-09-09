import { describe, expect, test } from "bun:test";
import "@/server/server";
import "@/server/resources";
import "@/server/resources/texture-authoring-knowledge";
import {
  getAllToolDefinitions,
  resources,
} from "@/lib/factories";
import { DEFAULT_MCP_REGISTRATION_PROFILE } from "@/lib/registrationProfile";
import { MCP_AUTHORING_PHASES } from "@/lib/authoringPhase";
import {
  getMcpSurfaceToolNames,
  getToolRegistrationFamily,
  isCatalogToolEnabled,
  tools,
} from "@/server/tools";
import { toolManifest, resourceDocs } from "@/build/docs-manifest";
import { particleToolDocs } from "@/server/tools/particle";
import { particleReferenceResourceDocs } from "@/server/resources/particle";

const KNOWN_GENERATOR_COUPLED_TOOL_DOC_RESIDUE = new Set([
  "paint_texture_transaction",
]);

function enabledCatalogNames(): string[] {
  return Object.keys(tools)
    .filter((name) => isCatalogToolEnabled(name))
    .sort((a, b) => a.localeCompare(b));
}

function documentedToolNames(): Set<string> {
  return new Set(
    toolManifest.flatMap((group) => group.tools.map((tool) => tool.name))
  );
}

describe("pre-local MCP surface closure", () => {
  test("every enabled default capability is family-owned and reachable from at least one semantic surface", () => {
    const phaseUnion = new Set(
      MCP_AUTHORING_PHASES.flatMap((phase) =>
        getMcpSurfaceToolNames(DEFAULT_MCP_REGISTRATION_PROFILE, phase)
      )
    );
    const enabled = enabledCatalogNames();

    expect([...phaseUnion].sort((a, b) => a.localeCompare(b))).toEqual(enabled);
    for (const name of enabled) {
      expect(getToolRegistrationFamily(name), `${name} has no registration family`).toBeDefined();
      expect(
        getAllToolDefinitions()[name],
        `${name} has no executable runtime definition`
      ).toBeDefined();
    }
  });

  test("runtime augmentation owners remain wired through the canonical capabilities", () => {
    const definitions = getAllToolDefinitions() as Record<
      string,
      { inputSchema: Record<string, unknown> }
    >;
    const requiredFields: Record<string, readonly string[]> = {
      create_texture: ["source_texture_id"],
      get_texture: ["expected_revision", "region"],
      capture_model_views: ["animation_preview"],
      inspect_animation: ["diagnostics", "channel", "time_range"],
      manage_animation_timeline: ["anim_time_update", "rotation_spaces"],
      manage_animation_controller: ["native_operations"],
    };

    for (const [name, fields] of Object.entries(requiredFields)) {
      const definition = definitions[name];
      expect(definition, `${name} runtime definition missing`).toBeDefined();
      for (const field of fields) {
        expect(
          definition?.inputSchema[field],
          `${name} lost runtime augmentation field ${field}`
        ).toBeDefined();
      }
    }

    expect(definitions.paint_texture_transaction).toBeDefined();
    expect(definitions.manage_render_profile).toBeDefined();
  });

  test("generated ToolSpec coverage has no hidden callable orphan beyond the named local residue", () => {
    const documented = documentedToolNames();
    const undocumentedEnabled = enabledCatalogNames().filter(
      (name) => !documented.has(name)
    );
    const unexpected = undocumentedEnabled.filter(
      (name) => !KNOWN_GENERATOR_COUPLED_TOOL_DOC_RESIDUE.has(name)
    );

    expect(unexpected).toEqual([]);
    for (const name of KNOWN_GENERATOR_COUPLED_TOOL_DOC_RESIDUE) {
      if (undocumentedEnabled.includes(name)) {
        expect(getAllToolDefinitions()[name]).toBeDefined();
      }
    }
  });

  test("Particle production exposure is all-or-nothing across runtime, phase, docs and resource wiring", () => {
    const particleNames = particleToolDocs
      .map((tool) => tool.name)
      .sort((a, b) => a.localeCompare(b));
    const registeredParticleNames = particleNames.filter((name) =>
      Object.hasOwn(tools, name)
    );
    expect([0, particleNames.length]).toContain(registeredParticleNames.length);

    const documented = documentedToolNames();
    const documentedParticleNames = particleNames.filter((name) =>
      documented.has(name)
    );
    const particleResourceName = particleReferenceResourceDocs[0]?.name;
    expect(particleResourceName).toBe("particle-reference");

    const resourceDeclared = resourceDocs.some(
      (resource) => resource.name === particleResourceName
    );
    const resourceRegistered = Boolean(
      particleResourceName && resources[particleResourceName]
    );

    if (registeredParticleNames.length === 0) {
      expect(documentedParticleNames).toEqual([]);
      expect(resourceDeclared).toBe(false);
      expect(resourceRegistered).toBe(false);
      return;
    }

    expect(documentedParticleNames).toEqual(particleNames);
    expect(resourceDeclared).toBe(true);
    expect(resourceRegistered).toBe(true);

    const animation = new Set(
      getMcpSurfaceToolNames(DEFAULT_MCP_REGISTRATION_PROFILE, "animation")
    );
    const geometry = new Set(
      getMcpSurfaceToolNames(DEFAULT_MCP_REGISTRATION_PROFILE, "geometry")
    );
    const texturing = new Set(
      getMcpSurfaceToolNames(DEFAULT_MCP_REGISTRATION_PROFILE, "texturing")
    );
    for (const name of particleNames) {
      expect(isCatalogToolEnabled(name)).toBe(true);
      expect(animation.has(name)).toBe(true);
      expect(geometry.has(name)).toBe(false);
      expect(texturing.has(name)).toBe(false);
    }
  });
});

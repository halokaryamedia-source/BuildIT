import { createResource, type ResourceSpec } from "@/lib/factories";
import {
  BEDROCK_PARTICLE_COMPONENT_REFERENCE,
  BEDROCK_PARTICLE_CURVE_REFERENCE,
  BEDROCK_PARTICLE_EVENT_REFERENCE,
  BEDROCK_PARTICLE_PRESET_REFERENCE,
} from "@/lib/bedrockParticleDocument";

export const PARTICLE_REFERENCE_IDS = [
  "components",
  "curves",
  "events",
  "presets",
  "molang",
  "workflow",
] as const;

export type ParticleReferenceId = (typeof PARTICLE_REFERENCE_IDS)[number];

export const particleReferenceResourceDocs: ResourceSpec[] = [
  {
    name: "particle-reference",
    uriTemplate: "particle_reference://{id}",
    title: "Bedrock Particle Reference",
    description:
      "Lazy reference for Bedrock particle component families, compact starting presets, particle Molang variables, and authoring workflow. Read only the section needed for the current particle decision.",
  },
];

const PARTICLE_MOLANG_REFERENCE = {
  principle:
    "Particle numeric/vector fields may use Molang strings. Preserve authored expressions; BlockIT does not evaluate arbitrary Molang during document mutation.",
  variables: {
    "variable.emitter_age": "Age since the current emitter loop started.",
    "variable.emitter_lifetime": "Duration of the current emitter loop.",
    "variable.emitter_random_1": "Stable 0..1 random for the current emitter loop.",
    "variable.emitter_random_2": "Stable 0..1 random for the current emitter loop.",
    "variable.emitter_random_3": "Stable 0..1 random for the current emitter loop.",
    "variable.emitter_random_4": "Stable 0..1 random for the current emitter loop.",
    "variable.entity_scale": "Entity scale when the effect is attached to an entity.",
    "variable.particle_age": "Current particle age.",
    "variable.particle_lifetime": "Particle lifetime.",
    "variable.particle_random_1": "Stable 0..1 random for this particle lifetime.",
    "variable.particle_random_2": "Stable 0..1 random for this particle lifetime.",
    "variable.particle_random_3": "Stable 0..1 random for this particle lifetime.",
    "variable.particle_random_4": "Stable 0..1 random for this particle lifetime.",
  },
};

const PARTICLE_WORKFLOW_REFERENCE = {
  fast_path: [
    "intent",
    "choose closest preset only as a starting point",
    "targeted component/curve/event edits",
    "inspect summary diagnostics",
    "native Blockbench preview when a stable path exists",
    "smallest causal correction",
    "save verified .particle.json",
    "bind through existing animation/controller tools",
  ],
  ownership: {
    particle_asset: "inspect_particle / manage_particle",
    animation_timing: "manage_animation_effects",
    controller_state_binding: "manage_animation_controller",
    locator_authoring: "manage_locator",
  },
  quality: [
    "Particle JSON validity is not visual approval.",
    "Prefer bounded particle counts and profile collision-heavy effects on target hardware.",
    "Use patch for deep changes when sibling fields are not fully known.",
    "Do not regenerate a complex imported particle from a shallow preset when a targeted edit is sufficient.",
  ],
};

export function getParticleReferencePayload(id: ParticleReferenceId) {
  switch (id) {
    case "components":
      return BEDROCK_PARTICLE_COMPONENT_REFERENCE;
    case "curves":
      return BEDROCK_PARTICLE_CURVE_REFERENCE;
    case "events":
      return BEDROCK_PARTICLE_EVENT_REFERENCE;
    case "presets":
      return BEDROCK_PARTICLE_PRESET_REFERENCE;
    case "molang":
      return PARTICLE_MOLANG_REFERENCE;
    case "workflow":
      return PARTICLE_WORKFLOW_REFERENCE;
  }
}

export function registerParticleResources(): void {
  createResource("particle-reference", {
    ...particleReferenceResourceDocs[0],
    async listCallback() {
      return {
        resources: PARTICLE_REFERENCE_IDS.map((id) => ({
          uri: `particle_reference://${id}`,
          name: id,
          description: `Bedrock particle ${id} reference`,
          mimeType: "application/json",
        })),
      };
    },
    async readCallback(uri, { id }) {
      if (!id || !PARTICLE_REFERENCE_IDS.includes(id as ParticleReferenceId)) {
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "application/json",
              text: JSON.stringify({ sections: PARTICLE_REFERENCE_IDS }),
            },
          ],
        };
      }
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(getParticleReferencePayload(id as ParticleReferenceId)),
          },
        ],
      };
    },
  });
}

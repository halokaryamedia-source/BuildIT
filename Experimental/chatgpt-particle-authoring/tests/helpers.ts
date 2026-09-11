import type { JsonObject } from "../src";

export function particle(
  components: JsonObject,
  events?: JsonObject,
  identifier = "test:particle"
): JsonObject {
  return {
    format_version: "1.10.0",
    particle_effect: {
      description: { identifier },
      components,
      ...(events ? { events } : {}),
    },
  };
}

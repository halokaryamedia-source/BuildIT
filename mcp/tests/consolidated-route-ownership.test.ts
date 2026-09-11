import { describe, expect, test } from "bun:test";
import {
  CONSOLIDATED_EXECUTOR_ROUTES,
  getConsolidatedFamily,
} from "@/server/runtime/consolidatedRoutes";

describe("Consolidated route ownership", () => {
  test("keeps one canonical family owner per consolidated capability", () => {
    expect(getConsolidatedFamily("inspect_elements")).toBe("element_inspection");
    expect(getConsolidatedFamily("manage_material")).toBe("textures");
    expect(getConsolidatedFamily("manage_animation_timeline")).toBe("animation");
    expect(getConsolidatedFamily("manage_material_instances")).toBe("material_instances");
  });

  test("every consolidated route declares family, discriminator and retained executors", () => {
    for (const route of Object.values(CONSOLIDATED_EXECUTOR_ROUTES)) {
      expect(route.family.length).toBeGreaterThan(0);
      expect(route.discriminator.length).toBeGreaterThan(0);
      expect(Object.keys(route.routes).length).toBeGreaterThan(0);
      expect(Object.values(route.routes).every((executor) => executor.length > 0)).toBe(true);
    }
  });
});

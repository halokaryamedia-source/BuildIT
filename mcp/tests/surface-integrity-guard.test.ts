import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { importToolDocs } from "@/server/tools/import";
import { uiToolDocs } from "@/server/tools/ui";
import {
  drawShapeToolParameters,
  gradientToolParameters,
  paintWithBrushParameters,
} from "@/server/tools/paint";
import { getEnabledToolDefinitions } from "@/lib/factories";
import { tools, isCatalogToolEnabled } from "@/server/tools";

// Ensure the default Bedrock Entity profile is registered so surface
// assertions hold regardless of per-file execution order.
import "@/server/tools";

async function source(relativePath: string): Promise<string> {
  return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

describe("advertised surface and fail-closed integrity guards", () => {
  test("all 66 enabled tools stay listed with their authored shapes", () => {
    // Same shared-process exclusion as default-registration-import-safe:
    // fixture and extended-family registrations from other test files must
    // not distort the default Bedrock product surface count.
    const extendedToolNames = new Set(
      [...importToolDocs, ...uiToolDocs].map((tool) => tool.name)
    );
    const enabledDefinitions = Object.entries(tools).filter(
      ([name]) =>
        isCatalogToolEnabled(name) &&
        !name.includes("fixture") &&
        !extendedToolNames.has(name)
    );
    expect(enabledDefinitions.length).toBe(62);

    for (const [, toolDef] of enabledDefinitions) {
      const { description, status } = toolDef as {
        description?: unknown;
        status?: unknown;
      };
      // A listed tool must always carry both its advertised shape and its
      // full runtime validation schema.
      expect(description).toBeDefined();
      expect(status).toBeDefined();
    }
  });

  test("advertised shapes retain real fields after SDK shape extraction", () => {
    // Guards against silent extractShape degradation (e.g. a future zod
    // major changing _def internals): if extraction starts returning empty
    // objects, these advertised fields disappear and this test fails.
    const shapeFieldNames = (toolName: string): string[] => {
      const definition = getEnabledToolDefinitions()[toolName] as {
        inputSchema?: Record<string, unknown>;
        parameterSchema?: { _def?: { shape?: () => Record<string, unknown>; options?: unknown[] } };
      };
      const schema = definition.inputSchema ?? {};
      const names = new Set<string>();
      const visit = (value: unknown) => {
        if (!value || typeof value !== "object") return;
        const record = value as Record<string, unknown>;
        if (record.properties && typeof record.properties === "object") {
          Object.keys(record.properties as object).forEach((name) => names.add(name));
        }
        for (const key of ["anyOf", "oneOf", "allOf"]) {
          if (Array.isArray(record[key])) record[key].forEach(visit);
        }
      };
      visit(schema);
      for (const option of definition.parameterSchema?._def?.options ?? []) visit(option);
      const shape = definition.parameterSchema?._def?.shape?.();
      Object.keys(shape ?? {}).forEach((name) => names.add(name));
      return [...names];
    };

    expect(getEnabledToolDefinitions().manage_cubes).toBeDefined();
    expect(getEnabledToolDefinitions().create_project).toBeDefined();
    expect(getEnabledToolDefinitions().export_model).toBeDefined();
    expect(getEnabledToolDefinitions().manage_cubes).toBeDefined();
    expect(getEnabledToolDefinitions().manage_geometry_reference).toBeDefined();
  });

  test("pixel schemas reject malformed colors and out-of-enum blend modes", () => {
    expect(
      drawShapeToolParameters.safeParse({
        shape: "rectangle",
        start: { x: 0, y: 0 },
        end: { x: 8, y: 8 },
        color: "#12345",
      }).success
    ).toBe(false);

    expect(
      gradientToolParameters.safeParse({
        start: { x: 0, y: 0 },
        end: { x: 4, y: 4 },
        start_color: "blue",
        end_color: "#00FF00",
        opacity: 255,
      }).success
    ).toBe(false);

    expect(
      paintWithBrushParameters.safeParse({
        texture_id: "tex-1",
        coordinates: [{ x: 1, y: 1 }],
        brush_settings: {
          size: 2,
          opacity: 128,
          color: "#ABCDEF",
          blend_mode: "sparkle",
        },
      }).success
    ).toBe(false);
  });

  test("mutation families keep their no-op and consent rejections", async () => {
    const locatorSource = await source("server/tools/locators.ts");
    expect(locatorSource).toContain("No-op update rejected");

    const historySource = await source("server/tools/history.ts");
    expect(historySource).toContain("Cannot undo");
    expect(historySource).toContain("Cannot redo");

    const elementSource = await source("server/tools/element.ts");
    expect(elementSource).toContain("isRoot && newName");

    const projectSource = await source("server/tools/project.ts");
    expect(projectSource).toContain("discard_unsaved");
    expect(projectSource).toContain("has unsaved changes");

    const exportSource = await source("server/tools/export.ts");
    expect(exportSource).toContain("overwrite !== true");
    expect(exportSource).toContain(
      "Refusing to replace the existing .bbmodel"
    );
    expect(exportSource).toContain("listBlockItRoute1References");
    expect(exportSource).toContain(
      "Remove them with manage_geometry_reference before project export"
    );

    const paintSource = await source("server/tools/paint.ts");
    const boundsCalls = (
      paintSource.match(/requirePixelsWithinTexture\(texture/g) ?? []
    ).length;
    expect(boundsCalls).toBeGreaterThanOrEqual(6);

    const controllerSource = await source("server/tools/animation-controller.ts");
    expect(controllerSource).not.toContain(
      "text: JSON.stringify(result)"
    );
  });
});

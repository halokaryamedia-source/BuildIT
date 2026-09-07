import { describe, expect, test } from "bun:test";
import { buildMaterialInstanceMutationSummary } from "@/server/tools/material-instances";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("material-instance mutation result contract", () => {
  test("mutation summaries keep resolved target identity compact", () => {
    const summary = buildMaterialInstanceMutationSummary(
      "set",
      [
        { uuid: "cube-a", name: "body" },
        { uuid: "cube-b", name: "trim" },
      ],
      4,
      {
        material_name: "metal",
        faces: ["north", "south"],
      }
    );

    expect(JSON.parse(JSON.stringify(summary))).toEqual({
      operation: "set",
      cube_count: 2,
      face_count: 4,
      cubes: [
        { uuid: "cube-a", name: "body" },
        { uuid: "cube-b", name: "trim" },
      ],
      material_name: "metal",
      faces: ["north", "south"],
    });
  });

  test("set, bulk-set, and clear mutations return structured continuation receipts", async () => {
    const implementation = await source("server/tools/material-instances.ts");

    expect(
      implementation.match(/buildMaterialInstanceMutationSummary\(/g)?.length ?? 0
    ).toBeGreaterThanOrEqual(5);
    expect(
      implementation.match(/materialInstanceMutationResult\(/g)?.length ?? 0
    ).toBeGreaterThanOrEqual(5);
    expect(implementation).toContain("structuredContent: result");
    expect(implementation).toContain('"set",\n          cubes,');
    expect(implementation).toContain('"bulk_set",\n          cubesToEdit,');
    expect(implementation).toContain('"clear",\n          cubes,');
    expect(implementation).not.toContain(
      'return `Set material instance "${material_name}"'
    );
    expect(implementation).not.toContain(
      "return `Applied ${assignments.length} material instance assignment(s)"
    );
    expect(implementation).not.toContain(
      "return `Cleared material instances from ${clearedCount}"
    );
  });
});

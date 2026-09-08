import { describe, expect, test } from "bun:test";
import { BLOCKIT_USER_GUIDE_TEMPLATES } from "@/ui/userGuide";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("BlockIT in-plugin user guide", () => {
  test("guide is user-facing English and keeps internal workflow details out of prompt templates", async () => {
    const panel = await source("ui/panel.html");
    const allTemplates = Object.values(BLOCKIT_USER_GUIDE_TEMPLATES).join("\n");

    for (const text of [
      "Guide",
      "Start here",
      "Build with Codex. Review in Blockbench.",
      "Copy Prompt",
      "DIRECT",
      "3D_ASSISTED",
      "Continue",
      "Geometry",
      "Texture",
      "Animation",
      "Final",
    ]) expect(panel).toContain(text);

    for (const text of [
      "Dimensions:",
      "Geometry method: DIRECT / 3D_ASSISTED",
      "Animation needed: YES / NO",
    ]) expect(BLOCKIT_USER_GUIDE_TEMPLATES.new_model).toContain(text);

    for (const internal of [
      "READY_FOR_USER_REVIEW",
      "LIVE_BLOCKBENCH",
      "invoke_capability",
      "search_capabilities",
      "router_loaded",
    ]) {
      expect(panel).not.toContain(internal);
      expect(allTemplates).not.toContain(internal);
    }

    for (const nonEnglish of ["Ukuran", "Metode", "Lanjut", "Panduan", "Referensi"]) {
      expect(allTemplates).not.toContain(nonEnglish);
    }
  });

  test("guide templates support new, resume, and existing-model workflows", () => {
    expect(BLOCKIT_USER_GUIDE_TEMPLATES.new_model).toContain("reference image I attached");
    expect(BLOCKIT_USER_GUIDE_TEMPLATES.continue_project).toContain("last saved stage");
    expect(BLOCKIT_USER_GUIDE_TEMPLATES.improve_model).toContain("currently open in Blockbench");
  });
});

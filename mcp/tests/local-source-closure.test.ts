import { afterEach, describe, expect, test } from "bun:test";
import { buildUvAtlasAudit, createTextureParameters, runNativeTemplateEdit } from "@/server/tools/texture";
import { getAllToolDefinitions } from "@/lib/factories";
import { phaseControlToolDocs, registerMcpProfile } from "@/server/tools";
import { buildMcpPhaseHandoffContract } from "@/lib/authoringPhase";
import { setBarItemValue } from "@/lib/util";

const original = new Map<string, PropertyDescriptor | undefined>();
function mockGlobal(name: string, value: unknown) {
  original.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
  Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
}
afterEach(() => {
  for (const [name, descriptor] of original) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor);
    else Reflect.deleteProperty(globalThis, name);
  }
  original.clear();
});

function nativeFixture() {
  const project = { saved: true };
  const state = { uv: 128, pixels: "original", atlas: "same-uuid" };
  const prior = { action: "previous" };
  const redo = { action: "redo" };
  const undo = {
    history: [prior, redo] as any[], index: 1, current_save: undefined as any,
    initEdit() { this.current_save = { ...state }; },
    cancelEdit() { this.current_save = undefined; },
    loadSave(save: typeof state) { Object.assign(state, save); },
  };
  mockGlobal("Undo", undo);
  mockGlobal("Project", project);
  mockGlobal("Cube", { all: [] });
  mockGlobal("Texture", { all: [] });
  mockGlobal("Canvas", { updateAll() {} });
  mockGlobal("Dialog", { open: null });
  mockGlobal("Blockbench", { setProgress() {} });
  const generate = async () => {
    undo.initEdit();
    state.uv = 64;
    state.pixels = "repacked";
    await Promise.resolve();
    undo.history.splice(undo.index, Infinity, { before: {}, post: { ...state }, action: "Create template" });
    undo.index = undo.history.length;
    undo.cancelEdit();
    project.saved = false;
  };
  return { state, project, undo, prior, redo, generate };
}

describe("local source closure", () => {
  test("native numeric sliders persist tool settings through their modifier API", () => {
    class Slider {
      value = 1;
      setting = 1;
      change(modifier: (value: number) => number) { this.setting = modifier(this.setting); }
      update() { this.value = this.setting; }
    }
    const slider = new Slider();
    mockGlobal("NumSlider", Slider);
    mockGlobal("BarItems", { slider_brush_size: slider });
    setBarItemValue("slider_brush_size", 2);
    expect(slider.setting).toBe(2);
    expect(slider.value).toBe(2);
  });
  test("native template success retains exactly one complete Undo entry", async () => {
    const f = nativeFixture();
    expect(await runNativeTemplateEdit(f.generate, () => f.state.atlas)).toBe("same-uuid");
    expect(f.undo.history).toHaveLength(2);
    expect(f.undo.history[1].before.pixels).toBe("original");
    expect(f.undo.history[1].post.pixels).toBe("repacked");
    expect(f.undo.current_save).toBeUndefined();
  });

  for (const failure of ["reject", "cancel", "audit"] as const) {
    test(`native template ${failure} restores UV, pixels, saved state and redo history`, async () => {
      const f = nativeFixture();
      const generate = async () => {
        if (failure === "audit") return f.generate();
        f.undo.initEdit();
        f.state.uv = 32;
        f.state.pixels = "partial";
        await Promise.resolve();
        if (failure === "reject") throw new Error("async native failure");
        f.undo.cancelEdit(); // Native cancellation discards its own snapshot.
      };
      await expect(runNativeTemplateEdit(generate, () => { throw new Error("invalid atlas"); })).rejects.toThrow();
      expect(f.state).toEqual({ uv: 128, pixels: "original", atlas: "same-uuid" });
      expect(f.project.saved).toBe(true);
      expect(f.undo.history).toEqual([f.prior, f.redo]);
      expect(f.undo.index).toBe(1);
      expect(f.undo.current_save).toBeUndefined();
    });
  }

  test("template rebuild is explicit and blank creation cannot target an existing atlas", () => {
    expect(createTextureParameters.safeParse({ name: "atlas", texture_id: "atlas" }).success).toBe(false);
    expect(createTextureParameters.parse({ name: "atlas", type: "template", texture_id: "atlas", pixel_density: 32 }).pixel_density).toBe(32);
  });

  test("collapsed UV blocks meaningful faces but not zero-area geometry", () => {
    const face = { cube_uuid: "cube", cube_name: "cube", face: "north", uv: [0, 0, 0, 4], box_uv: true, autouv: 0, mirror_uv: false, face_rotation: 0 };
    for (const [area, blocked] of [[16, true], [0, false]] as const) {
      const audit = buildUvAtlasAudit([{ ...face, surface_area: area }], 128, 128);
      if (audit.state !== "available") throw new Error("missing audit");
      expect(audit.production_gate.reasons.includes("COLLAPSED_SURFACE_UV")).toBe(blocked);
      expect(audit.degenerate_uv.count).toBe(1);
    }
  });

  test("consolidated discovery preserves authored fields and nested payload schemas", () => {
    registerMcpProfile();
    const definitions = getAllToolDefinitions();
    const material = definitions.manage_material.inputSchema;
    const timeline = definitions.manage_animation_timeline.inputSchema;
    expect(material).toHaveProperty("texture");
    expect(timeline).toHaveProperty("operation");
    expect(timeline).toHaveProperty("keyframes");
    expect(timeline.keyframes.safeParse("not a keyframe payload").success).toBe(false);
  });

  test("Animation handoff requires approval evidence; AUTHORING focus stays available", () => {
    const base = { reason: "test", resume_from: "animation" };
    expect(phaseControlToolDocs.parameters.safeParse({ ...base, target_phase: "animation" }).success).toBe(false);
    expect(phaseControlToolDocs.parameters.safeParse({ ...base, target_phase: "texturing" }).success).toBe(true);
    const autonomous={autonomous_authorized:true,geometry_verified:true,uv_layout:"PASS",texture_verified:true,checkpoint:"fixture.bbmodel",evidence:"Current revision visual and technical checks passed",no_blockers:true};
    expect(phaseControlToolDocs.parameters.safeParse({...base,target_phase:"animation",readiness:autonomous}).success).toBe(true);
    expect(phaseControlToolDocs.parameters.safeParse({...base,target_phase:"animation",readiness:{...autonomous,autonomous_authorized:false}}).success).toBe(false);
    expect(phaseControlToolDocs.parameters.safeParse({...base,target_phase:"animation",readiness:{...autonomous,evidence:""}}).success).toBe(false);
    expect(phaseControlToolDocs.parameters.safeParse({ ...base, target_phase: "animation", readiness: { geometry_approved: true, uv_layout: "PASS", texture_approved: true, checkpoint: "fixture.bbmodel", no_blockers: true } }).success).toBe(true);
    for (const phase of ["geometry", "texturing"] as const) {
      expect(buildMcpPhaseHandoffContract(phase)).toContain("READY_FOR_USER_REVIEW");
      expect(buildMcpPhaseHandoffContract(phase)).toContain("same task");
    }
  });
});

import {test, expect} from "bun:test";
import "@/server/tools";
import {getAllToolDefinitions} from "@/lib/factories";

test("paint settings preflight controls and replace explicit mirror axes", async () => {
  const g = globalThis as any;
  const old = {Painter:g.Painter, BarItems:g.BarItems, NumSlider:g.NumSlider};
  g.NumSlider = class {};
  g.Painter = {lock_alpha:false, mirror_painting:false, mirror_painting_options:{x:true,y:true,z:false,texture:true}};
  g.BarItems = {mirror_painting:{value:false,set(value:boolean){this.value=value;}}};
  const tool = getAllToolDefinitions().paint_settings;
  const run = async (args:unknown) => tool.execute(await tool.parameterSchema.parseAsync(args));
  try {
    await expect(run({lock_alpha:true,pixel_perfect:true})).rejects.toThrow();
    expect(g.Painter.lock_alpha).toBe(false);
    await run({mirror_painting:{enabled:true,axis:["z"]}});
    expect(g.Painter.mirror_painting_options).toMatchObject({x:false,y:false,z:true,texture:true});
    await run({mirror_painting:{enabled:true,texture:false}});
    expect(g.Painter.mirror_painting_options.texture).toBe(false);
    await run({mirror_painting:{enabled:true,axis:[]}});
    expect(g.Painter.mirror_painting_options).toMatchObject({x:false,y:false,z:false});
  } finally {Object.assign(g,old);}
});

test("native setting failures restore attempted writes before Painter changes", async () => {
  const g = globalThis as any, old = {settings:g.settings, Painter:g.Painter, BarItems:g.BarItems};
  const calls:string[]=[];
  g.Painter={lock_alpha:false};
  g.BarItems={};
  g.settings={};
  for (const id of ["paint_side_restrict","pick_color_opacity"]) {
    g.settings[id]={value:false,set(value:boolean){this.value=value; calls.push(`${id}:${value}`); if(id==="pick_color_opacity" && value) throw new Error("native failure");}};
  }
  const tool=getAllToolDefinitions().paint_settings;
  try {
    await expect(tool.execute(await tool.parameterSchema.parseAsync({lock_alpha:true,paint_side_restrict:true,pick_color_opacity:true}))).rejects.toThrow("native failure");
    expect(g.Painter.lock_alpha).toBe(false);
    expect(g.settings.paint_side_restrict.value).toBe(false);
    expect(g.settings.pick_color_opacity.value).toBe(false);
    expect(calls.slice(-2)).toEqual(["pick_color_opacity:false","paint_side_restrict:false"]);
    await expect(tool.execute(await tool.parameterSchema.parseAsync({paint_side_restrict:true,pixel_perfect:true}))).rejects.toThrow("unavailable");
    expect(g.settings.paint_side_restrict.value).toBe(false);
    g.settings.pick_color_opacity.set=()=>{};
    await expect(tool.execute(await tool.parameterSchema.parseAsync({paint_side_restrict:true,pick_color_opacity:true}))).rejects.toThrow("did not apply");
    expect(g.settings.paint_side_restrict.value).toBe(false);
    g.settings.pick_color_opacity.set=()=>{throw new Error("always fails");};
    await expect(tool.execute(await tool.parameterSchema.parseAsync({paint_side_restrict:true,pick_color_opacity:true}))).rejects.toThrow("rollback failed: pick_color_opacity");
    expect(g.settings.paint_side_restrict.value).toBe(false);
  } finally {Object.assign(g,old);}
});

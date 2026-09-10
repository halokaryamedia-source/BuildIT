import {test, expect} from "bun:test";
import {registerPaintTools} from "@/server/tools/paint";
import {getAllToolDefinitions} from "@/lib/factories";

test("presets persist lock alpha, reject duplicate names and roll back failed saves", async () => {
  const g = globalThis as any;
  const previous = {StateMemory:g.StateMemory, Painter:g.Painter, BarItems:g.BarItems};
  let alpha = true, loads = 0, failSave = false;
  g.StateMemory = {brush_presets:[], save:()=>{if(failSave)throw new Error("save failed");}};
  g.Painter = {loadBrushPreset:()=>{loads++;}};
  g.BarItems = {lock_alpha:{set:(value:boolean)=>{alpha=value;}}};
  try {
    if(!getAllToolDefinitions().create_brush_preset)registerPaintTools();
    const run = async (name:string, args:unknown) => {
      const tool=getAllToolDefinitions()[name];
      return tool.execute(await tool.parameterSchema.parseAsync(args));
    };
    await run("create_brush_preset", {name:"skin", lock_alpha:false});
    expect(g.StateMemory.brush_presets[0].lock_alpha).toBe(false);
    await expect(run("create_brush_preset", {name:"skin"})).rejects.toThrow("already exists");
    await run("load_brush_preset", {preset_name:"skin"});
    expect(alpha).toBe(false);expect(loads).toBe(1);
    delete g.BarItems.lock_alpha;
    await expect(run("load_brush_preset", {preset_name:"skin"})).rejects.toThrow("unavailable");
    expect(loads).toBe(1);
    failSave=true;
    await expect(run("create_brush_preset", {name:"failed"})).rejects.toThrow("save failed");
    expect(g.StateMemory.brush_presets.map((p:any)=>p.name)).toEqual(["skin"]);
  } finally {Object.assign(g, previous);}
});

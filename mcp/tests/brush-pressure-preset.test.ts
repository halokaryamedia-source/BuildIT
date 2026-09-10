import {test, expect} from "bun:test";
import {createBrushPresetParameters, registerPaintTools} from "@/server/tools/paint";
import {getAllToolDefinitions} from "@/lib/factories";

const curve = [0,0,0.25,0.25,0.75,0.75,1,1];
test("pressure curves are validated and retained by the public schema", () => {
  expect(createBrushPresetParameters.parse({name:"pressure",size_pressure_curve:curve})).toHaveProperty("size_pressure_curve",curve);
  for (const invalid of [[0,1], [0,0,0.8,0.2,0.2,0.8,1,1], [0,0,0.2,2,0.8,0.8,1,1]]) {
    expect(createBrushPresetParameters.safeParse({name:"bad",size_pressure_curve:invalid}).success).toBe(false);
  }
});

test("pressure presets reject absent plugin before loading and reach the active Brush Tuna instance", async () => {
  const g=globalThis as any;
  const previous={StateMemory:g.StateMemory,Painter:g.Painter,BarItems:g.BarItems,BrushTuna:g.BrushTuna};
  let loads=0;
  g.StateMemory={brush_presets:[],save(){}};g.BarItems={};delete g.BrushTuna;
  g.Painter={loadBrushPreset(preset:unknown){loads++;if(g.BrushTuna)g.BrushTuna.brushPreset=preset;}};
  try {
    if(!getAllToolDefinitions().create_brush_preset)registerPaintTools();
    const run=async(name:string,args:unknown)=>{
      const tool=getAllToolDefinitions()[name];return tool.execute(await tool.parameterSchema.parseAsync(args));
    };
    await run("create_brush_preset",{name:"pressure",size_pressure_curve:curve});
    expect(g.StateMemory.brush_presets[0].size_pressure_curve).toEqual(curve);
    await expect(run("load_brush_preset",{preset_name:"pressure"})).rejects.toThrow("Brush Tuna");
    expect(loads).toBe(0);
    g.BrushTuna={brushPreset:null};
    await run("load_brush_preset",{preset_name:"pressure"});
    expect(g.BrushTuna.brushPreset).toBe(g.StateMemory.brush_presets[0]);
    expect(loads).toBe(1);
  }finally{Object.assign(g,previous);}
});

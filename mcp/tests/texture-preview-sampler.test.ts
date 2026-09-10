import {test,expect} from "bun:test";
import {registerPaintTools} from "@/server/tools/paint";
import {getAllToolDefinitions} from "@/lib/factories";
test("preview sampler targets one texture and leaves other maps unchanged",async()=>{
  const g=globalThis as any, previous={Project:g.Project,THREE:g.THREE};
  const map={minFilter:1003,magFilter:1003,wrapS:1001,wrapT:1001,needsUpdate:false};
  const untouched={...map};
  g.Project={textures:[{uuid:"a",name:"skin",material:{map}},{uuid:"b",name:"other",material:{map:untouched}}]};
  g.THREE={NearestFilter:1003,LinearFilter:1006,RepeatWrapping:1000,ClampToEdgeWrapping:1001};
  try{
    if(!getAllToolDefinitions().paint_settings)registerPaintTools();
    const tool=getAllToolDefinitions().paint_settings;
    const result:any=await tool.execute(await tool.parameterSchema.parseAsync({texture_preview:{texture_id:"a",filtering:"linear",wrapping:"repeat"}}));
    expect(map).toEqual({minFilter:1006,magFilter:1006,wrapS:1000,wrapT:1000,needsUpdate:true});
    expect(untouched.minFilter).toBe(1003);expect(untouched.needsUpdate).toBe(false);
    expect(result.structuredContent.texture_preview.previous.min_filter).toBe(1003);
    await expect(tool.execute(await tool.parameterSchema.parseAsync({texture_preview:{texture_id:"missing",filtering:"linear"}}))).rejects.toThrow();
  }finally{Object.assign(g,previous)}
});

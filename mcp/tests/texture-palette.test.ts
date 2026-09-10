import {describe,expect,test} from "bun:test";
import tinycolor from "tinycolor2";
import {texturePaletteParameters,generateTexturePalette} from "@/lib/texturePalette";
import {registerPaintTools} from "@/server/tools/paint";
import {getAllToolDefinitions} from "@/lib/factories";
describe("hue shifted palette",()=>{
  test("retains exact base and orders shadows through highlights",()=>{
    const input=texturePaletteParameters.parse({base:"#806040"});
    const result=generateTexturePalette(input);
    expect(result.colors).toHaveLength(7);expect(result.colors[result.base_index]).toBe(input.base);
    const light=result.colors.map(color=>tinycolor(color).toHsl().l);
    expect(light).toEqual([...light].sort((a,b)=>a-b));
    expect(result.unique_colors).toBe(7);
  });
  test("validates opaque base and odd count",()=>{
    for(const args of [{base:"#ffffffff"},{base:"red"},{base:"#123456",count:4}])expect(texturePaletteParameters.safeParse(args).success).toBe(false);
  });
  test("executor previews without ColorPanel and applies explicit append/replace",async()=>{
    const g=globalThis as any, previous=g.ColorPanel;
    try{
      delete g.ColorPanel;
      if(!getAllToolDefinitions().paint_settings)registerPaintTools();
      const tool=getAllToolDefinitions().paint_settings;
      const run=async(mode:string)=>tool.execute(await tool.parameterSchema.parseAsync({palette:{base:"#806040",mode}}));
      const preview:any=await run("preview");expect(preview.structuredContent.palette.colors).toHaveLength(7);
      await expect(run("replace")).rejects.toThrow("unavailable");
      g.ColorPanel={palette:["#010101"]};const original=g.ColorPanel.palette;
      await run("append");expect(original).toHaveLength(8);expect(original[0]).toBe("#010101");
      await run("replace");expect(original).toHaveLength(7);expect(original).not.toContain("#010101");
      expect(g.ColorPanel.palette).toBe(original);
    }finally{g.ColorPanel=previous;}
  });
});

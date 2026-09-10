import {test,expect} from "bun:test";
import {withMissingTextureHighlight} from "@/server/tools/camera";
test("missing-material highlight restores exact values on success and failure",()=>{
  const g=globalThis as any, previous=g.Canvas;
  const a={value:0},b={value:1.7};
  g.Canvas={emptyMaterials:[{uniforms:{BRIGHTNESS:a}},{uniforms:{BRIGHTNESS:b}},{uniforms:{BRIGHTNESS:a}}]};
  try{
    expect(withMissingTextureHighlight(true,()=>{expect(a.value).toBe(2.5);expect(b.value).toBe(2.5);return "image"})).toBe("image");
    expect([a.value,b.value]).toEqual([0,1.7]);
    expect(()=>withMissingTextureHighlight(true,()=>{throw new Error("render failed")})).toThrow("render failed");
    expect([a.value,b.value]).toEqual([0,1.7]);
    delete g.Canvas;
    expect(withMissingTextureHighlight(false,()=>42)).toBe(42);
  }finally{g.Canvas=previous;}
});

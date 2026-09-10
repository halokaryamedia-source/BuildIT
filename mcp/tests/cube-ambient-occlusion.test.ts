import {test,expect} from "bun:test";
import {sampleCubeAmbientOcclusion as sample,bakeCubeAmbientOcclusionRgba as bake,type AoTriangle,type AoUvTriangle} from "@/lib/cubeAmbientOcclusion";
const surface=[{position:[0,0,0] as const,normal:[0,1,0] as const}];
const options={radius:3,samples:32,bias:.001};
const ceiling:AoTriangle[]=[[[ -10,1,-10],[10,1,-10],[10,1,10]],[[-10,1,-10],[10,1,10],[-10,1,10]]];
test("AO measures nearby occlusion and respects radius and surface orientation",()=>{
  expect(sample(surface,[],options)).toEqual([0]);
  const blocked=sample(surface,ceiling,options)[0];expect(blocked).toBeGreaterThan(.8);
  expect(sample(surface,ceiling,{...options,radius:.5})).toEqual([0]);
  expect(sample([{position:[0,0,0],normal:[0,-1,0]}],ceiling,options)).toEqual([0]);
  expect(sample(surface,ceiling,options)).toEqual([blocked]);
});
test("AO bias avoids self-shadowing and rejects invalid geometry",()=>{
  const floor=ceiling.map(t=>t.map(v=>[v[0],0,v[2]])) as unknown as AoTriangle[];
  expect(sample(surface,floor,options)).toEqual([0]);
  expect(()=>sample(surface,ceiling,{...options,bias:0})).toThrow();
  expect(()=>sample([{position:[0,0,0],normal:[0,0,0]}],[],options)).toThrow();
  expect(()=>sample(surface,[[[NaN,0,0],[1,0,0],[0,1,0]]],options)).toThrow();
});

test("UV bake darkens mapped RGB, preserves alpha and rejects conflicting islands",()=>{
  const source=new Uint8ClampedArray([200,180,160,128, 9,8,7,0]);
  const face:AoUvTriangle={vertices:[[-1,0,-1],[-1,0,1],[1,0,-1]],uv:[[0,0],[0,2],[2,0]]};
  // Only the first pixel is opaque; bitmap is two pixels wide and two high.
  const pixels=new Uint8ClampedArray(16);pixels.set(source);
  const result=bake(pixels,2,2,[face],ceiling,{...options,strength:.5});
  expect(result.pixels[0]).toBeLessThan(200);expect(result.pixels[3]).toBe(128);
  expect([...result.pixels.slice(4,8)]).toEqual([9,8,7,0]);expect(pixels[0]).toBe(200);
  const conflict={...face,vertices:face.vertices.map(v=>[v[0],v[1]+.2,v[2]]) as unknown as AoTriangle};
  expect(()=>bake(pixels,2,2,[face,conflict],ceiling,{...options,strength:.5})).toThrow("overlapping UV");
});

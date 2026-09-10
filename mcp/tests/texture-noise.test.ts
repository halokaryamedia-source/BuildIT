import {describe, expect, test} from "bun:test";
import {applyPaintTransactionRgba, paintTransactionOperationSchema} from "@/lib/paintTransaction";
const source=new Uint8ClampedArray([100,100,100,255,80,90,100,0,150,150,150,255,20,30,40,255]);
const operation=(extra={})=>paintTransactionOperationSchema.parse({operation:"noise",rect:{x:0,y:0,width:4,height:1},seed:123,amplitude:40,channels:["r","g","b"],...extra});
describe("masked deterministic texture noise",()=>{
  test("repeatable with alpha and transparent background preserved",()=>{
    const a=applyPaintTransactionRgba(source,4,1,[operation()]).pixels;
    const b=applyPaintTransactionRgba(source,4,1,[operation()]).pixels;
    expect(a).toEqual(b);expect(a).not.toEqual(source);
    expect(a.slice(4,8)).toEqual(source.slice(4,8));
    expect([a[3],a[7],a[11],a[15]]).toEqual([255,0,255,255]);
    expect(source[0]).toBe(100);
  });
  test("channel and pixel selection limit mutations",()=>{
    const a=applyPaintTransactionRgba(source,4,1,[operation({seed:1,channels:["b"],mask:[{x:0,y:0}]})]).pixels;
    expect(a[2]).not.toBe(source[2]);
    expect([...a].filter((_,i)=>i!==2)).toEqual([...source].filter((_,i)=>i!==2));
  });
  test("splitting the same region does not change its output",()=>{
    const whole=applyPaintTransactionRgba(source,4,1,[operation()]).pixels;
    const split=applyPaintTransactionRgba(source,4,1,[operation({rect:{x:0,y:0,width:2,height:1}}),operation({rect:{x:2,y:0,width:2,height:1}})]).pixels;
    expect(split).toEqual(whole);
  });
  test("invalid mask is rejected before altering source",()=>{
    expect(()=>applyPaintTransactionRgba(source,4,1,[operation({rect:{x:0,y:0,width:1,height:1},mask:[{x:2,y:0}]})])).toThrow("outside");
    expect(source[0]).toBe(100);
  });
});

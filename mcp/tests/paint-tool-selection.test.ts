import {test,expect} from "bun:test";
import "@/server/tools";
import {getAllToolDefinitions} from "@/lib/factories";
test("fill shape gradient and copy apply sliders to their own selected tool before strokes",async()=>{
  const g=globalThis as any,keys=["Undo","Project","Texture","BarItems","NumSlider","Painter","ColorPanel","Canvas"];
  const old=Object.fromEntries(keys.map(k=>[k,g[k]]));let selected="previous";const writes:string[]=[],strokes:string[]=[];
  const texture={uuid:"atlas",name:"atlas",width:16,height:16,display_height:16,getUVWidth:()=>16,getUVHeight:()=>16};
  g.Undo={};g.Project={textures:[texture]};g.Texture={all:[texture],selected:texture};g.NumSlider=class {};
  g.BarItems={};
  for(const id of ["fill_tool","draw_shape_tool","gradient_tool","copy_brush"])g.BarItems[id]={select(){selected=id;}};
  for(const id of ["slider_brush_opacity","slider_brush_size","blend_mode","fill_mode","draw_shape_type","copy_brush_mode"])g.BarItems[id]={value:1,set(value:unknown){this.value=value;writes.push(selected);}};
  g.ColorPanel={set(){}};g.Canvas={updateAll(){}};
  g.Painter={startPaintTool(){strokes.push(selected)},stopPaintTool(){},useShapeTool(){},useGradientTool(){}};
  const start={x:1,y:1},end={x:3,y:3};
  try{
    for(const [name,native,args] of [
      ["paint_fill_tool","fill_tool",{x:1,y:1,opacity:128}],
      ["draw_shape_tool","draw_shape_tool",{shape:"rectangle",start,end,opacity:128}],
      ["gradient_tool","gradient_tool",{start,end,start_color:"#000000",end_color:"#ffffff",opacity:128}],
      ["copy_brush_tool","copy_brush",{source:start,target:end,brush_size:2,opacity:128}],
    ] as const){
      writes.length=0;strokes.length=0;selected="previous";
      const tool=getAllToolDefinitions()[name];
      await tool.execute(await tool.parameterSchema.parseAsync({texture_id:"atlas",...args}));
      expect(writes.length).toBeGreaterThan(0);expect(writes.every(id=>id===native)).toBe(true);
      expect(strokes.length).toBeGreaterThan(0);expect(strokes.every(id=>id===native)).toBe(true);
      const startPaint = g.Painter.startPaintTool;
      let canceled = 0;
      g.Undo.cancelEdit = () => {canceled++; g.Undo.current_save = undefined;};
      g.Painter.startPaintTool = () => {g.Undo.current_save = {}; throw new Error("stroke failure");};
      await expect(tool.execute(await tool.parameterSchema.parseAsync({texture_id:"atlas",...args}))).rejects.toThrow("stroke failure");
      expect(canceled).toBe(1); expect(g.Painter.current).toEqual({});
      g.Painter.startPaintTool = startPaint;
    }
  }finally{Object.assign(g,old);}
});

import {test,expect} from "bun:test";
import "@/server/tools";
import {registerPaintTools} from "@/server/tools/paint";
import {getAllToolDefinitions} from "@/lib/factories";
test("native brush resets omitted blend mode instead of inheriting previous strokes",async()=>{
  const g=globalThis as any,keys=["Undo","Project","Texture","Painter","BarItems","NumSlider","ColorPanel","Canvas"];
  const old=Object.fromEntries(keys.map(k=>[k,g[k]]));let blend="multiply";const observed:string[]=[];
  const texture={uuid:"atlas",name:"atlas",width:16,height:16};
  g.Undo={};g.Project={textures:[texture]};g.Texture={all:[texture],selected:texture};g.NumSlider=class {};
  g.BarItems={brush_tool:{select(){}},blend_mode:{get(){return blend;},set(value:string){blend=value;}}};
  for(const key of ["slider_brush_size","slider_brush_opacity","slider_brush_softness","brush_shape"])g.BarItems[key]={value:1,set(value:unknown){this.value=value;}};
  g.Painter={startPaintTool(){observed.push(blend)},stopPaintTool(){},movePaintTool(){}};
  g.ColorPanel={set(){}};g.Canvas={updateAll(){}};
  try{
    if(!getAllToolDefinitions().paint_with_brush)registerPaintTools();
    const tool=getAllToolDefinitions().paint_with_brush;
    await tool.execute(await tool.parameterSchema.parseAsync({texture_id:"atlas",coordinates:[{x:1,y:1}],brush_settings:{size:2}}));
    expect(observed).toEqual(["default"]);
    let selected="brush";const changedUnder:string[]=[];
    g.BarItems.eraser={select(){selected="eraser";}};
    g.BarItems.slider_brush_size={value:1,set(value:number){changedUnder.push(selected);this.value=value;}};
    const eraser=getAllToolDefinitions().eraser_tool;
    await eraser.execute(await eraser.parameterSchema.parseAsync({texture_id:"atlas",coordinates:[{x:1,y:1}],brush_size:2}));
    expect(changedUnder).toEqual(["eraser"]);
  }finally{Object.assign(g,old);}
});

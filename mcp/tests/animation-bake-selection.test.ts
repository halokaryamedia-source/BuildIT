import {test, expect} from "bun:test";
import "@/server/tools";
import {getAllToolDefinitions} from "@/lib/factories";
import {registerAnimationTools} from "@/server/tools/animation";

test("bake samples only the selected channel interval and restores timeline after invalid samples", async()=>{
  const g=globalThis as any;
  const names=["AnimationItem","Timeline","Animator","Undo","settings","updateKeyframeSelection"];
  const previous=Object.fromEntries(names.map(name=>[name,g[name]]));
  const made:any[]=[];let edits=0, invalid=false;
  const animation:any={uuid:"audit",name:"audit",snapping:20,setLength(){}};
  const animator:any={animation,rotation:[],position:[],scale:[],interpolate(){return invalid?[NaN,2,3]:[1,2,3]},addKeyframe(k:any){made.push(k);return k}};
  const key=(time:number,channel:string)=>({time,channel,animator,interpolation:"bezier",transform:true});
  animator.rotation=[key(0,"rotation"),key(1,"rotation"),key(3,"rotation")];
  animator.position=[key(0,"position"),key(2,"position")];
  animator.keyframes=[...animator.rotation,...animator.position];
  animation.animators={bone:animator};
  g.AnimationItem={all:[animation],selected:animation};
  g.Timeline={time:7,keyframes:[...animator.rotation,...animator.position],selected:animator.rotation.slice(0,2),snapTime:(t:number)=>t};
  g.Animator={preview(){}};g.Undo={initEdit(){edits++},finishEdit(){},cancelEdit(){}};
  g.settings={default_keyframe_interpolation:{value:"bezier"}};g.updateKeyframeSelection=()=>{};
  try{
    if(!getAllToolDefinitions().batch_keyframe_operations)registerAnimationTools();
    const tool=getAllToolDefinitions().batch_keyframe_operations;
    const args=await tool.parameterSchema.parseAsync({operation:"bake",selection:"selected",parameters:{bake_interval:.5}});
    await tool.execute(args);
    expect(made.map(k=>[k.channel,k.time,k.interpolation])).toEqual([["rotation",.5,"linear"]]);
    expect(g.Timeline.time).toBe(7);expect(edits).toBe(1);
    invalid=true;
    await expect(tool.execute(args)).rejects.toThrow("sample");
    expect(g.Timeline.time).toBe(7);expect(edits).toBe(1);
  }finally{Object.assign(g,previous);}
});

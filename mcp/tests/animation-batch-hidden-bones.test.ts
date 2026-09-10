import {test,expect} from "bun:test";
import "@/server/tools";
import {getAllToolDefinitions} from "@/lib/factories";

test("batch all includes hidden bones while selected stays selection-owned",async()=>{
  const g=globalThis as any,keys=["AnimationItem","Timeline","Undo","Animator"];
  const old=Object.fromEntries(keys.map(k=>[k,g[k]]));
  const target:any={uuid:"a",name:"a",animators:{}};
  const other:any={uuid:"b",name:"b",animators:{}};
  const make=(animation:any)=>{const animator:any={animation,keyframes:[]};const frame:any={animator,time:0,channel:"rotation",transform:true,flips:0,flip(){this.flips++;}};animator.keyframes=[frame];return frame;};
  const visible=make(target),hidden=make(target),foreign=make(other);
  target.animators={visible:visible.animator,hidden:hidden.animator};
  g.AnimationItem={all:[target,other],selected:target};
  g.Timeline={keyframes:[visible,foreign],selected:[visible,foreign]};
  g.Undo={initEdit(){},finishEdit(){},cancelEdit(){}};g.Animator={preview(){}};
  try{
    const tool=getAllToolDefinitions().batch_keyframe_operations;
    for(const selection of ["all","selected","range","pattern"]){
      await tool.execute(await tool.parameterSchema.parseAsync({selection,...(selection==="range"?{range:{start:0,end:1}}:{}),...(selection==="pattern"?{pattern:{interval:1,offset:0}}:{}),operation:"mirror",parameters:{mirror_axis:"x"}}));
    }
    expect(visible.flips).toBe(4);expect(hidden.flips).toBe(3);expect(foreign.flips).toBe(0);
  }finally{Object.assign(g,old);}
});

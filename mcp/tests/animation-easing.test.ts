import {test,expect} from "bun:test";
import MolangParser from "molangjs";
import {animationEasingSchema,buildAnimationEasing} from "@/lib/animationEasing";
import {registerAnimationTools} from "@/server/tools/animation";
import {getAllToolDefinitions} from "@/lib/factories";

test("generated Molang evaluates curve endpoints, midpoint and loop overrun",()=>{
  for(const curve of ["sine","quad","cubic"] as const){
    for(const direction of ["in","out","in_out"] as const){
      const options=animationEasingSchema.parse({curve,direction});
      for(const [delta,expected] of [[0,0],[2,2]] as const){
        expect(new MolangParser().parse(buildAnimationEasing("a",2,"hold",options),{"query.anim_time":0,"query.delta_time":delta})).toBeCloseTo(expected,5);
      }
      const midpoint=new MolangParser().parse(buildAnimationEasing("a",2,"hold",options),{"query.anim_time":0,"query.delta_time":1});
      if(direction==="in_out")expect(midpoint).toBeCloseTo(1,5);
      else if(direction==="in")expect(midpoint).toBeLessThan(1);
      else expect(midpoint).toBeGreaterThan(1);
    }
  }
  const options=animationEasingSchema.parse({curve:"quad",direction:"in"});
  expect(new MolangParser().parse(buildAnimationEasing("a",2,"loop",options),{"query.anim_time":0,"query.delta_time":5})).toBeCloseTo(.5,5);
  expect(new MolangParser().parse(buildAnimationEasing("a",2,"once",options),{"query.anim_time":0,"query.delta_time":3})).toBeCloseTo(2.1,5);
  expect(()=>buildAnimationEasing("a",0,"loop",options)).toThrow();
});

test("easing targets explicit clip and protects authored time expressions before Undo",async()=>{
  const g=globalThis as any,previous={AnimationItem:g.AnimationItem,Undo:g.Undo,Animator:g.Animator,Format:g.Format};
  g.Format={id:"bedrock"};
  let edits=0;
  const clip={uuid:"target",name:"target",length:2,loop:"loop",anim_time_update:"q.anim_time+q.delta_time",extend(data:object){Object.assign(this,data);}};
  const other={...clip,uuid:"other"};g.AnimationItem={all:[clip,other],selected:other};
  g.Undo={initEdit(){edits++},finishEdit(){},cancelEdit(){}};g.Animator={preview(){}};
  try{
    if(!getAllToolDefinitions().animation_timeline)registerAnimationTools();
    const tool=getAllToolDefinitions().animation_timeline;
    const run=async(replace_existing:boolean)=>tool.execute(await tool.parameterSchema.parseAsync({animation_id:"target",action:"set_easing",easing:{curve:"sine",direction:"in_out",replace_existing}}));
    await expect(run(false)).rejects.toThrow("replace_existing");expect(edits).toBe(0);
    for(const id of ["free","java_block","bedrock_block"]){
      g.Format={id};
      await expect(run(true)).rejects.toThrow("Bedrock Entity");
      expect(edits).toBe(0);
      expect(clip.anim_time_update).toBe("q.anim_time+q.delta_time");
    }
    g.Format={id:"bedrock"};
    await run(true);expect(edits).toBe(1);expect(clip.anim_time_update).toContain("math.cos");
    expect(other.anim_time_update).toBe("q.anim_time+q.delta_time");expect(g.AnimationItem.selected).toBe(other);
  }finally{Object.assign(g,previous);}
});

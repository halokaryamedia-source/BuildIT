import {test,expect} from "bun:test";
import "@/server/tools";
import {getAllToolDefinitions} from "@/lib/factories";

test("effect removal receipt matches retained native keyframes and points",async()=>{
  const g=globalThis as any,keys=["AnimationItem","EffectAnimator","Undo","Animator","updateKeyframeSelection"];
  const old=Object.fromEntries(keys.map(key=>[key,g[key]]));
  class Effects {particle:any[]=[];sound:any[]=[];timeline:any[]=[];}
  g.EffectAnimator=Effects;
  let finishes=0;
  g.Undo={initEdit(){},finishEdit(){finishes++;},cancelEdit(){}};
  g.Animator={preview(){}};g.updateKeyframeSelection=()=>{};
  const tool=getAllToolDefinitions().manage_animation_effects;
  try{
    for(const channel of ["particle","sound"] as const){
      for(const count of [1,2]){
        const effects=new Effects();
        const frame={uuid:"kf",time:0,data_points:Array.from({length:count},(_,i)=>({effect:`effect${i}`,script:""})),remove(){effects[channel].splice(effects[channel].indexOf(this),1);}};
        effects[channel].push(frame);
        const animation={uuid:"target",name:"target",animators:{effects},setLength(){}};
        const other={uuid:"other",name:"other",animators:{effects:new Effects()}};
        g.AnimationItem={all:[animation,other],selected:other};
        const result=await tool.execute(await tool.parameterSchema.parseAsync({animation_id:"target",operations:[{operation:"remove",channel,keyframe_uuid:"kf",data_point_index:0}]})) as any;
        const retained=effects[channel].flatMap(kf=>kf.data_points.map((p:any)=>({effect:p.effect,script:p.script})));
        expect(result.structuredContent.results[0].removed.remaining).toEqual(retained);
        expect(effects[channel].length).toBe(count===1?0:1);
        expect(other.animators.effects[channel]).toEqual([]);
      }
    }
    expect(finishes).toBe(4);
  }finally{Object.assign(g,old);}
});

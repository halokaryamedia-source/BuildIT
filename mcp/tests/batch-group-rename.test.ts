import {describe, expect, test} from "bun:test";
import {planGroupRename, applyGroupRename} from "@/lib/batchGroupRename";
import {registerElementTools} from "@/server/tools/element";
import {getAllToolDefinitions} from "@/lib/factories";
describe("Group batch rename",()=>{
  test("registered executor previews without Undo and applies one atomic edit",async()=>{
    const g=globalThis as any;
    const keys=["Project","Group","AnimationItem","Undo","Canvas"];
    const previous=keys.map(key=>g[key]);
    const group={uuid:"bone",name:"before"}, animator={uuid:"bone",name:"before"};
    const animation={animators:{bone:animator},saved:true};
    const edits:any[]=[];let finished=0;
    g.Project={};g.Group={all:[group]};g.AnimationItem={all:[animation]};
    g.Canvas={updateAll(){}};
    g.Undo={initEdit(edit:any){edits.push(edit)},finishEdit(){finished++},cancelEdit(){throw new Error("unexpected rollback")}};
    try {
      if(!getAllToolDefinitions().rename_element)registerElementTools();
      const tool=getAllToolDefinitions().rename_element;
      const run=async(dry_run:boolean)=>tool.execute(await tool.parameterSchema.parseAsync({updates:[{id:"bone",new_name:"after"}],dry_run}));
      await expect(tool.execute(await tool.parameterSchema.parseAsync({updates:[{id:"missing",new_name:"after"}],dry_run:false}))).rejects.toThrow("not found");
      expect(edits).toHaveLength(0);
      await run(true);expect(edits).toHaveLength(0);expect(group.name).toBe("before");
      await run(false);expect(finished).toBe(1);expect(edits).toHaveLength(1);
      expect(edits[0].groups).toEqual([group]);expect(edits[0].animations).toEqual([animation]);
      expect(animator.name).toBe("after");expect(animation.animators.bone).toBe(animator);
    } finally {keys.forEach((key,index)=>g[key]=previous[index])}
  });
  test("preview is pure and application preserves UUID animation binding",()=>{
    const group={uuid:"u1",name:"leg"}, animator={uuid:"u1",name:"leg"};
    const animation={animators:{u1:animator},saved:true};
    const plan=planGroupRename([group],[{id:"u1",new_name:"front_leg"}],[animation]);
    expect(group.name).toBe("leg");expect(animator.name).toBe("leg");
    applyGroupRename(plan);
    expect(group.name).toBe("front_leg");expect(animation.animators.u1).toBe(animator);
    expect(animator.name).toBe("front_leg");expect(animation.saved).toBe(false);
  });
  test("simultaneous name swaps retain both legacy tracks and group maps",()=>{
    const groups=[{uuid:"a",name:"left"},{uuid:"b",name:"right"}];
    const left={name:"left"},right={name:"right"};
    const animation={animators:{left,right},groups:{left:1,right:2}};
    applyGroupRename(planGroupRename(groups,[{id:"a",new_name:"right"},{id:"b",new_name:"left"}],[animation]));
    expect(animation.animators.right).toBe(left);expect(animation.animators.left).toBe(right);
    expect(animation.groups).toEqual({right:1,left:2});
  });
  test("conflicts and missing targets fail before changes",()=>{
    const groups=[{uuid:"a",name:"left"},{uuid:"b",name:"right"}];
    for(const updates of [[{id:"a",new_name:"RIGHT"}],[{id:"x",new_name:"x"}],[{id:"a",new_name:"x"},{id:"a",new_name:"y"}]]){
      expect(()=>planGroupRename(groups,updates,[])).toThrow();
      expect(groups[0].name).toBe("left");
    }
  });
  test("unbound animation-map collision cannot destroy a track",()=>{
    const groups=[{uuid:"a",name:"old"}];
    expect(()=>planGroupRename(groups,[{id:"a",new_name:"new"}],[{animators:{old:{name:"old"},new:{name:"new"}}}])).toThrow("collision");
    expect(groups[0].name).toBe("old");
  });
});

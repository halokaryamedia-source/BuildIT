import {test,expect} from "bun:test";
import "@/server/tools";
import {getAllToolDefinitions} from "@/lib/factories";

test("undo and redo report only completed transitions and reject native no-effect",async()=>{
  const g=globalThis as any,old={Project:g.Project,Undo:g.Undo,Canvas:g.Canvas};
  g.Project={};g.Canvas={updateAll(){}};
  try{
    for(const direction of ["undo","redo"] as const){
      const initial=direction==="undo"?2:0,delta=direction==="undo"?-1:1;
      let calls=0;
      g.Undo={index:initial,history:[{action:"first"},{action:"second"}]};
      const tool=getAllToolDefinitions()[direction];
      const run=async(steps:number)=>tool.execute(await tool.parameterSchema.parseAsync({steps}));
      g.Undo[direction]=()=>{calls++;};
      await expect(run(1)).rejects.toThrow("did not move");
      expect(g.Undo.index).toBe(initial);
      g.Undo[direction]=()=>{if(calls++===1)throw new Error("native failure");g.Undo.index+=delta;};
      calls=0;
      await expect(run(2)).rejects.toThrow("1 completed step(s)");
      expect(calls).toBe(2);expect(g.Undo.index).toBe(initial+delta);
      g.Undo.index=initial;g.Undo[direction]=()=>{g.Undo.index+=delta;};
      const result=await run(2) as any;
      expect(result.structuredContent[direction==="undo"?"undone_count":"redone_count"]).toBe(2);
      expect(result.structuredContent.new_index).toBe(initial+2*delta);
      await expect(run(1)).rejects.toThrow("Nothing to");
      g.Undo.index=initial;g.Undo.current_save={};
      await expect(run(1)).rejects.toThrow("active Undo edit");
      expect(g.Undo.index).toBe(initial);
    }
  }finally{Object.assign(g,old);}
});

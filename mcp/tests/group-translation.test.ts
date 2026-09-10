import {test,expect} from "bun:test";
import {registerElementTools,modifyGroupParameters} from "@/server/tools/element";
import {getAllToolDefinitions} from "@/lib/factories";

test("Group translation includes descendant Undo, preserves UV and rejects overflow before mutation",async()=>{
  const g=globalThis as any,keys=["Project","Group","Cube","Locator","NullObject","Undo","Canvas"];
  const old=Object.fromEntries(keys.map(k=>[k,g[k]]));
  class Bone {static all:Bone[]=[];uuid="bone";name="bone";origin=[0,0,0];children:any[]=[];constructor(){Bone.all.push(this);}}
  class Box {from=[0,0,0];to=[1,2,3];origin=[0,1,0];uuid="cube";name="cube";faces={north:{uv:[0,0,1,2]}};}
  const root=new Bone(),cube=new Box();root.children=[cube];let edits:any[]=[];
  g.Project={};g.Group=Bone;g.Cube=Box;g.Locator=class {};g.NullObject=class {};
  g.Canvas={updateAll(){}};g.Undo={initEdit(e:any){edits.push(e)},finishEdit(){},cancelEdit(){}};
  try{
    if(!getAllToolDefinitions().modify_group)registerElementTools();
    const tool=getAllToolDefinitions().modify_group;
    const run=async(offset:number[])=>tool.execute(await tool.parameterSchema.parseAsync({id:"bone",offset}));
    const uv=JSON.stringify(cube.faces);
    await run([2,0,-1]);expect(cube.from).toEqual([2,0,-1]);expect(cube.to).toEqual([3,2,2]);
    expect(root.origin).toEqual([2,0,-1]);expect(cube.origin).toEqual([2,1,-1]);expect(JSON.stringify(cube.faces)).toBe(uv);
    expect(edits[0].groups).toEqual([root]);expect(edits[0].elements).toEqual([cube]);
    cube.to[0]=1e308;
    await expect(run([1e308,0,0])).rejects.toThrow();expect(edits).toHaveLength(1);expect(cube.from).toEqual([2,0,-1]);
    expect(modifyGroupParameters.safeParse({id:"bone",offset:[1,0,0],origin:[0,0,0]}).success).toBe(false);
  }finally{Object.assign(g,old);}
});

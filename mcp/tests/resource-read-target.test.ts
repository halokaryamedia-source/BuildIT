import {test,expect} from "bun:test";
import {registerReferenceModelsResource} from "@/server/resources";
import {getAllResourceDefinitions} from "@/lib/factories";
import {registerParticleResources} from "@/server/resources/particle";

test("reference model listing emits readable URLs",async()=>{
  const g=globalThis as any,old={Plugins:g.Plugins,Outliner:g.Outliner};
  g.Plugins={installed:[{id:"reference_models"}]};
  g.Outliner={elements:[{type:"reference_model",uuid:"ref-a",name:"Reference A"}]};
  try{
    registerReferenceModelsResource();
    const resource=getAllResourceDefinitions().reference_models;
    const list=await resource.listCallback!();
    const uri=new URL(list.resources[0].uri);
    const result=await resource.readCallback(uri,{id:uri.hostname});
    expect(JSON.parse((result.contents[0] as {text:string}).text).uuid).toBe("ref-a");
  }finally{Object.assign(g,old);}
});

test("particle reference rejects unknown sections instead of returning discovery",async()=>{
  if(!getAllResourceDefinitions()["particle-reference"])registerParticleResources();
  const resource=getAllResourceDefinitions()["particle-reference"];
  await expect(resource.readCallback(new URL("particle-reference://missing"),{id:"missing"})).rejects.toThrow("Unknown");
  const listed=await resource.listCallback!();
  for(const entry of listed.resources){
    const uri=new URL(entry.uri);
    const result=await resource.readCallback(uri,{id:uri.hostname});
    expect(result.contents.length).toBe(1);
  }
});

test("listed texture names cannot collide with runtime IDs",async()=>{
  const g=globalThis as any,old=g.Project;
  const a={uuid:"uuid-a",id:"0",name:"shared",getUVWidth:()=>16,getUVHeight:()=>16};
  const b={...a,uuid:"uuid-b",id:"shared",name:"other"};g.Project={textures:[a,b]};
  try{
    const resource=getAllResourceDefinitions().textures;
    const list=await resource.listCallback!();
    const uri=new URL(list.resources[0].uri);
    const result=await resource.readCallback(uri,{id:uri.hostname});
    expect(JSON.parse((result.contents[0] as {text:string}).text).uuid).toBe(a.uuid);
  }finally{g.Project=old;}
});

test("empty resource lists do not disguise missing explicit targets",async()=>{
  const g=globalThis as any,old={Project:g.Project,ModelProject:g.ModelProject};
  g.Project={textures:[]};g.ModelProject={all:[]};
  try{
    const definitions=getAllResourceDefinitions();
    for(const name of ["projects","textures"]){
      const resource=definitions[name];
      await expect(resource.readCallback(new URL(`${name}://missing`),{id:"missing"})).rejects.toThrow("not found");
      expect(await resource.listCallback!()).toEqual({resources:[]});
    }
  }finally{Object.assign(g,old);}
});
test("texture resource prioritizes UUID and rejects ambiguous runtime IDs",async()=>{
  const g=globalThis as any,old=g.Project;
  const make=(uuid:string,id:string)=>({uuid,id,name:uuid,getUVWidth:()=>16,getUVHeight:()=>16});
  const a=make("a","shared"),b=make("b","shared"),shadow=make("c","a");g.Project={textures:[a,b,shadow]};
  try{
    const read=getAllResourceDefinitions().textures.readCallback;
    await expect(read(new URL("textures://shared"),{id:"shared"})).rejects.toThrow("ambiguous");
    const result=await read(new URL("textures://a"),{id:"a"});
    expect(JSON.parse((result.contents[0] as {text:string}).text).uuid).toBe("a");
  }finally{g.Project=old;}
});

import {test,expect} from "bun:test";
import {extractElementRefs} from "@/server/resources/validator";
test("validator never assigns an arbitrary UUID to duplicate-name warnings",()=>{
  const g=globalThis as any,keys=["Cube","Texture","Animation","Group"],old=Object.fromEntries(keys.map(k=>[k,g[k]]));
  try{
    for(const key of keys)g[key]={all:[{uuid:"first",name:"part"},{uuid:"second",name:"part"}]};
    for(const message of ['cube "part"','texture "part"','in "part"','on "part"']){
      expect(extractElementRefs({message,buttons:[]})).toEqual([]);
    }
    g.Cube.all.pop();expect(extractElementRefs({message:'cube "part"',buttons:[]})).toEqual([{type:"cube",uuid:"first",name:"part"}]);
  }finally{Object.assign(g,old);}
});

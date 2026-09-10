import {test,expect} from "bun:test";
import {setBarItemValue,setBarItemValues} from "@/lib/util";
test("paint settings report unavailable and failing setters instead of false success",()=>{
  const g=globalThis as any,old={BarItems:g.BarItems,NumSlider:g.NumSlider};
  g.NumSlider=class {};g.BarItems={};
  try{
    expect(()=>setBarItemValue("missing",1)).toThrow("unavailable");
    const failed={value:"unchanged",set(){throw new Error("native rejected")}};
    g.BarItems.failed=failed;expect(()=>setBarItemValue("failed",2)).toThrow("native rejected");expect(failed.value).toBe("unchanged");
    g.BarItems.unsupported={};expect(()=>setBarItemValue("unsupported",1)).toThrow("no supported setter");
    g.BarItems.change={change(){throw new Error("change rejected")}};expect(()=>setBarItemValue("change",1)).toThrow("change rejected");
  }finally{Object.assign(g,old);}
});
test("brush batch preflights all controls and restores partial native writes",()=>{
  const g=globalThis as any,old={BarItems:g.BarItems,NumSlider:g.NumSlider};
  const first={value:1},second={value:2,set(value:number){this.value=value;if(value===9)throw new Error("rejected after write");}};
  g.BarItems={first,second};g.NumSlider=class {};
  try{
    expect(()=>setBarItemValues({first:8,missing:9})).toThrow("unavailable");expect(first.value).toBe(1);
    expect(()=>setBarItemValues({first:8,second:9})).toThrow("rejected after write");
    expect([first.value,second.value]).toEqual([1,2]);
    second.set=()=>{throw new Error("broken")};
    expect(()=>setBarItemValues({first:8,second:9})).toThrow("rollback failed for second");expect(first.value).toBe(1);
  }finally{Object.assign(g,old);}
});

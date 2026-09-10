import { describe, expect, test } from "bun:test";
import { findByResourceId, makeResourceId } from "@/lib/resourceUri";

describe("resource URI identity", () => {
  test("listed ids cannot be shadowed by sibling UUIDs or exact names", () => {
    for (const items of [
      [{uuid:"a",name:"b"},{uuid:"b",name:"other"}],
      [{uuid:"aaaaaaaa-1",name:"Part"},{uuid:"bbbbbbbb-2",name:"Part"},{uuid:"c",name:"part~aaaaaaaa"}],
    ]) {
      for (const item of items) expect(findByResourceId(items,makeResourceId(item,items))).toBe(item);
    }
  });
  test("identical UUID prefixes cannot collide in generated resource ids",()=>{
    const items=[{uuid:"aaaaaaaa-1111-2222-3333-444444444444",name:"part"},{uuid:"aaaaaaaa-9999-2222-3333-444444444444",name:"part"}];
    const ids=items.map(item=>makeResourceId(item,items));
    expect(new Set(ids).size).toBe(2);
    items.forEach((item,index)=>expect(findByResourceId(items,ids[index])).toBe(item));
  });
  test("collision-safe listed ids stay deterministic", () => {
    const items = [
      { uuid: "aaaaaaaa-1111-2222-3333-444444444444", name: "Door Panel" },
      { uuid: "bbbbbbbb-1111-2222-3333-444444444444", name: "Door-Panel" },
    ];

    expect(makeResourceId(items[0], items)).toBe("door-panel~aaaaaaaa");
    expect(makeResourceId(items[1], items)).toBe("door-panel~bbbbbbbb");
    expect(findByResourceId(items, items[0].uuid)).toBe(items[0]);
    expect(findByResourceId(items, "Door Panel")).toBe(items[0]);
    expect(findByResourceId(items, "door-panel~bbbbbbbb")).toBe(items[1]);
  });

  test("ambiguous explicit names and plain slugs fail closed", () => {
    const sameName = [
      { uuid: "11111111-aaaa-bbbb-cccc-111111111111", name: "Panel" },
      { uuid: "22222222-aaaa-bbbb-cccc-222222222222", name: "Panel" },
    ];
    expect(() => findByResourceId(sameName, "Panel")).toThrow("ambiguous by name");
    expect(() => findByResourceId(sameName, "panel")).toThrow("ambiguous by slug");

    const sameSlug = [
      { uuid: "33333333-aaaa-bbbb-cccc-333333333333", name: "Door Panel" },
      { uuid: "44444444-aaaa-bbbb-cccc-444444444444", name: "Door-Panel" },
    ];
    expect(() => findByResourceId(sameSlug, "door-panel")).toThrow("ambiguous by slug");
    expect(findByResourceId(sameSlug, "missing")).toBeUndefined();
  });
});

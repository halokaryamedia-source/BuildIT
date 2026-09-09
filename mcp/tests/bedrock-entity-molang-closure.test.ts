import { describe, expect, test } from "bun:test";
import { MOLANG_STABLE_QUERY_NAMES, inspectMolangQuery } from "@/lib/molangQueryCatalog";
import { lintMolangExpression } from "@/lib/molangSyntax";
import { analyzeAnimationMolangExpressions } from "@/lib/animationMolangSemantics";
import { applyClientEntityAnimationRuntimeOperations, inspectClientEntityAnimationRuntime } from "@/lib/bedrockAnimationRuntimeResources";
import type { JsonObject } from "@/lib/bedrockParticleDocument";
import { clientEntityAnimationResourceParameters } from "@/server/tools/animation-runtime-resource-intelligence";

const clientEntity=():JsonObject=>({format_version:"1.10.0","minecraft:client_entity":{description:{identifier:"test:molang"}}});

describe("Bedrock entity Molang closure",()=>{
 test("tracks the complete current stable Microsoft QueryFunctions TOC without internal/deprecated aliases",()=>{
  expect(MOLANG_STABLE_QUERY_NAMES.length).toBe(306);
  expect(new Set(MOLANG_STABLE_QUERY_NAMES).size).toBe(306);
  for(const name of ["query.anim_time","query.bone_orientation_trs","query.last_input_mode_is_any","query.property","query.yaw_speed"])expect(inspectMolangQuery(name).status).toBe("stable");
  expect(inspectMolangQuery("query_overlay_alpha").status).toBe("internal_or_deprecated");
  expect(inspectMolangQuery("query.future_query").status).toBe("unknown");
 });
 test("lints Molang structure and current language features without evaluating gameplay truth",()=>{
  const result=lintMolangExpression("v.other = q.get_nearby_entities(4); for_each(t.e, v.other, { v.x = t.e->v.public_value ?? 0; }); return v.x;");
  expect(result.features).toEqual(expect.arrayContaining(["actor_reference","for_each","null_coalescing","brace_scope","return"]));
  expect(result.queries.unknown).toContain("query.get_nearby_entities");
  expect(result.valid_structure).toBe(true);
  expect(lintMolangExpression("q.property('test:value'").valid_structure).toBe(false);
  expect(lintMolangExpression('v.x = "bad";').valid_structure).toBe(false);
 });
 test("animation Molang diagnostics include global scope plus query catalog/version/context evidence",()=>{
  const result=analyzeAnimationMolangExpressions([{source:"test",expression:"global.frame_alpha + q.last_input_mode_is_any('gamepad') + q.property('test:speed')"}]);
  expect(result.dependencies.global).toContain("global.frame_alpha");
  expect(result.queries.client_only).toContain("query.last_input_mode_is_any");
  expect(result.queries.version_sensitive).toContainEqual({name:"query.last_input_mode_is_any",min_format_version:"1.21.60"});
  expect(result.syntax.valid).toBe(true);
 });
 test("client entity authoring owns initialize, public variables, scale, pre_animation and existing wiring in one bounded branch",()=>{
  const doc=applyClientEntityAnimationRuntimeOperations(clientEntity(),[
   {op:"set_initialize_variable",name:"oink",expression:"0"},
   {op:"set_public_variable",name:"oink"},
   {op:"set_pre_animation_variable",name:"blend",expression:"math.lerp(variable.prev, variable.next, global.frame_alpha)"},
   {op:"set_scale",expression:"0.35 + variable.blend * 0.01"},
  ]);
  const summary=inspectClientEntityAnimationRuntime(doc);
  expect(summary.initialize_assigned_variables).toEqual(["variable.oink"]);
  expect(summary.pre_animation_assigned_variables).toEqual(["variable.blend"]);
  expect(summary.public_variables).toEqual(["variable.oink"]);
  expect(summary.scale).toBe("0.35 + variable.blend * 0.01");
  expect(summary.molang_analysis.dependencies.global).toContain("global.frame_alpha");
  const scripts=(((doc["minecraft:client_entity"] as JsonObject).description as JsonObject).scripts as JsonObject);
  expect((scripts.variables as JsonObject)["variable.oink"]).toBe("public");
 });
 test("new client-entity Molang targets keep deterministic batch and removal guards",()=>{
  expect(()=>applyClientEntityAnimationRuntimeOperations(clientEntity(),[{op:"set_scale",expression:"1"},{op:"remove_scale"}])).toThrow(/appears more than once/);
  expect(()=>applyClientEntityAnimationRuntimeOperations(clientEntity(),[{op:"remove_scale"}])).toThrow(/does not exist/);
  expect(()=>applyClientEntityAnimationRuntimeOperations(clientEntity(),[{op:"remove_public_variable",name:"x"}])).toThrow(/not declared public/);
 });

 test("runtime schema accepts the new Molang entity operations and remains strict",()=>{
  const source={content:JSON.stringify(clientEntity())};
  expect(clientEntityAnimationResourceParameters.safeParse({resource_kind:"client_entity",resource_source:source,resource_operations:[{op:"set_initialize_variable",name:"x",expression:"0"},{op:"set_public_variable",name:"x"},{op:"set_scale",expression:"1"}]}).success).toBe(true);
  expect(clientEntityAnimationResourceParameters.safeParse({resource_kind:"client_entity",resource_source:source,resource_operations:[{op:"set_public_variable",name:"bad name"}]}).success).toBe(false);
 });
});

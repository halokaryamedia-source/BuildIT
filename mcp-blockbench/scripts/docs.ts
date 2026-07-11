import { mkdir } from "node:fs/promises";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { toolManifest, promptDocs, resourceDocs } from "./docs-manifest";
import type { ToolSpec, PromptSpec, ResourceSpec } from "../src/lib/factories";
import { version } from "../package.json";
import { log } from "./utils";

interface ToolDocEntry {
  name: string;
  title: string;
  description: string;
  status: string;
  category: string;
  annotations: Record<string, boolean | undefined>;
  parameters: object;
}

interface PromptDocEntry {
  name: string;
  title: string;
  description: string;
  status: string;
  arguments: object | null;
}

interface ResourceDocEntry {
  name: string;
  title: string;
  description: string;
  uriTemplate: string;
}

interface DocOutput {
  version: string;
  generatedAt: string;
  tools: ToolDocEntry[];
  prompts: PromptDocEntry[];
  resources: ResourceDocEntry[];
}

function schema(name: string, value: z.ZodType): object {
  try {
    // @ts-ignore - Zod schema conversion has deep generic types.
    return zodToJsonSchema(value, {
      name,
      $refStrategy: "none",
      errorMessages: true,
      markdownDescription: true,
    });
  } catch {
    return { type: "object", description: "Schema conversion failed" };
  }
}

function tool(spec: ToolSpec, category: string): ToolDocEntry {
  return {
    name: spec.name,
    title: spec.annotations?.title ?? spec.name,
    description: spec.description,
    status: spec.status,
    category,
    annotations: {
      destructiveHint: spec.annotations?.destructiveHint,
      readOnlyHint: spec.annotations?.readOnlyHint,
      openWorldHint: spec.annotations?.openWorldHint,
    },
    parameters: schema(spec.name, spec.parameters),
  };
}

function prompt(spec: PromptSpec): PromptDocEntry {
  return {
    name: spec.name,
    title: spec.title ?? spec.name,
    description: spec.description,
    status: spec.status,
    arguments: spec.argsSchema ? schema(spec.name, spec.argsSchema) : null,
  };
}

function resource(spec: ResourceSpec): ResourceDocEntry {
  return {
    name: spec.name,
    title: spec.title ?? spec.name,
    description: spec.description,
    uriTemplate: spec.uriTemplate,
  };
}

function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

function generateHtml(data: DocOutput): string {
  const categories = toolManifest
    .map(({ category }) => {
      const cards = data.tools
        .filter((entry) => entry.category === category)
        .map(
          (entry) => `<article id="tool-${escape(entry.name)}">
<h3><code>${escape(entry.name)}</code> <small>${escape(entry.status)}</small></h3>
<p>${escape(entry.description)}</p>
<details><summary>Parameters</summary><pre>${escape(JSON.stringify(entry.parameters, null, 2))}</pre></details>
</article>`
        )
        .join("\n");
      return `<section><h2>${escape(category)}</h2>${cards}</section>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Blockbench MCP API</title>
<style>
body{font:15px/1.5 system-ui,sans-serif;max-width:1100px;margin:auto;padding:24px;background:#111;color:#eee}
a{color:#8cc8ff}article{border:1px solid #333;border-radius:8px;padding:12px;margin:12px 0;background:#181818}code,pre{font-family:ui-monospace,monospace}pre{overflow:auto;background:#0b0b0b;padding:12px}small{font-weight:400;color:#aaa}input{width:100%;padding:10px;margin:12px 0;background:#181818;color:#fff;border:1px solid #444}
</style>
</head>
<body>
<header><h1>Blockbench MCP API</h1><p>Version ${escape(data.version)} · ${data.tools.length} tools · ${data.prompts.length} prompts · ${data.resources.length} resources</p></header>
<input id="search" placeholder="Filter tools" />
<main>${categories}</main>
<script>
const input=document.getElementById('search');input.addEventListener('input',()=>{const q=input.value.toLowerCase();document.querySelectorAll('article').forEach(x=>x.hidden=!x.textContent.toLowerCase().includes(q));});
</script>
</body>
</html>`;
}

async function main(): Promise<void> {
  const tools = toolManifest.flatMap(({ category, tools }) =>
    tools.map((entry) => tool(entry, category))
  );
  const output: DocOutput = {
    version,
    generatedAt: new Date().toISOString(),
    tools,
    prompts: promptDocs.map(prompt),
    resources: resourceDocs.map(resource),
  };

  const outputDir = `${import.meta.dir}/../../docs/api`;
  await mkdir(outputDir, { recursive: true });
  await Bun.write(`${outputDir}/api.json`, JSON.stringify(output, null, 2));
  await Bun.write(`${outputDir}/index.html`, generateHtml(output));
  log.success(`Generated API docs in docs/api: ${tools.length} tools.`);
}

main().catch((error) => {
  log.error(`Documentation generation failed: ${error}`);
  process.exit(1);
});

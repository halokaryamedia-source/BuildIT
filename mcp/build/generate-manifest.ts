import { log } from "./utils";
import { version } from "../package.json";
import type { PromptManifest } from "../lib/promptLoader";

const RUNTIME_PROMPT_FILES = ["bedrock_entity_workflow.md"] as const;

async function main() {
  log.header("Prompt Manifest Generator");

  const promptsDir = import.meta.dir + "/../prompts";
  const prompts: Record<string, string> = {};

  log.step("Bundling runtime prompts...");
  for (const file of RUNTIME_PROMPT_FILES) {
    const name = file.replace(/\.md$/, "");
    const content = await Bun.file(`${promptsDir}/${file}`).text();
    prompts[name] = content;
    log.step(`${name} (${content.length} chars)`);
  }

  const manifest: PromptManifest = {
    version,
    generatedAt: new Date().toISOString(),
    prompts,
  };

  const manifestPath = `${promptsDir}/manifest.json`;
  await Bun.write(manifestPath, JSON.stringify(manifest, null, 2));

  log.success(
    `Manifest generated: ${RUNTIME_PROMPT_FILES.length} runtime prompt(s), v${version}`
  );
}

main().catch((err) => {
  log.error(`Prompt manifest generation failed: ${err}`);
  process.exit(1);
});

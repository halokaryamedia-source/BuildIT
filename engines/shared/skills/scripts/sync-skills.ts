import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { resolve } from "node:path";

const skillNames = [
  "blockbench-production",
  "blockbench-geometry",
  "blockbench-texture",
  "blockbench-animation",
  "blockbench-validation",
];
const deprecated = [
  "blockbench-use",
  "blockbench-modeling",
  "blockbench-texturing",
];
const checkOnly = Bun.argv.includes("--check");
const repoRoot = resolve(import.meta.dir, "../../../..");
const canonicalRoot = resolve(repoRoot, "engines/shared/skills");
const destinations = [
  resolve(repoRoot, ".agents/skills"),
  resolve(repoRoot, ".codex/skills"),
];
const errors: string[] = [];

function hash(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

for (const destinationRoot of destinations) {
  mkdirSync(destinationRoot, { recursive: true });

  for (const name of deprecated) {
    const destination = resolve(destinationRoot, name);
    if (checkOnly) {
      if (existsSync(destination)) errors.push(`Deprecated skill remains: ${destination}`);
    } else {
      rmSync(destination, { recursive: true, force: true });
    }
  }

  for (const name of skillNames) {
    const source = resolve(canonicalRoot, name);
    const destination = resolve(destinationRoot, name);
    const sourceFile = resolve(source, "SKILL.md");
    const destinationFile = resolve(destination, "SKILL.md");

    if (!existsSync(sourceFile)) {
      errors.push(`Missing canonical skill: ${sourceFile}`);
      continue;
    }

    if (checkOnly) {
      if (!existsSync(destinationFile)) {
        errors.push(`Missing adapter skill: ${destinationFile}`);
      } else if (hash(sourceFile) !== hash(destinationFile)) {
        errors.push(`Adapter drift: ${destinationFile}`);
      }
      continue;
    }

    rmSync(destination, { recursive: true, force: true });
    cpSync(source, destination, { recursive: true });
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  checkOnly
    ? `Skill adapters PASS: ${skillNames.length} canonical skills.`
    : `Skill adapters synchronized: ${skillNames.length} canonical skills.`
);

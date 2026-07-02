import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const issues: string[] = [];

const requiredFiles = [
  'app-launcher/package.json',
  'app-launcher/src-tauri/Cargo.toml',
  'app-launcher/src-tauri/tauri.conf.json',
  'app-launcher/src-tauri/src/main.rs',
  'app-launcher/src/app.d.ts',
  'app-launcher/src/routes/+layout.svelte',
  'app-launcher/src/routes/+layout.js',
  'app-launcher/src/routes/+page.svelte',
];

for (const file of requiredFiles) {
  const abs = path.join(root, file);
  if (!fs.existsSync(abs)) {
    issues.push(`Missing required launcher artifact: ${file}`);
  }
}

try {
  const appPackage = JSON.parse(fs.readFileSync(path.join(root, 'app-launcher/package.json'), 'utf8'));
  if (!appPackage.name) {
    issues.push('app-launcher/package.json missing "name" field.');
  }
} catch (error) {
  issues.push(`Invalid app-launcher/package.json: ${String(error)}`);
}

const requiredSnippets = [
  'Start Workspace',
  'uvx ollmcp -u',
  'Codex Configuration',
  'Settings',
];

const pageContent = fs.readFileSync(path.join(root, 'app-launcher/src/routes/+page.svelte'), 'utf8');
for (const snippet of requiredSnippets) {
  if (!pageContent.includes(snippet)) {
    issues.push(`app-launcher/src/routes/+page.svelte missing snippet: ${snippet}`);
  }
}

if (issues.length > 0) {
  console.error('app-launcher verification failed:');
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log('app-launcher verification passed.');
process.exit(0);

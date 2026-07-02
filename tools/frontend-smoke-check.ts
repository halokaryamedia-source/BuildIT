import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const issues: string[] = [];

const requiredFiles = [
  'app-launcher/package.json',
  'app-launcher/src/routes/+page.svelte',
  'app-launcher/src/routes/+layout.svelte',
  'app-launcher/src/routes/+layout.js',
  'app-launcher/src-tauri/src/main.rs',
  'app-launcher/src-tauri/tauri.conf.json',
  'app-launcher/src-tauri/Cargo.toml',
  'app-launcher/src/app.d.ts',
];

for (const file of requiredFiles) {
  const abs = path.join(root, file);
  if (!fs.existsSync(abs)) {
    issues.push(`Missing required UI/bridge file: ${file}`);
  }
}

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'app-launcher/package.json'), 'utf8'));
const packageDeps = {
  ...(packageJson.dependencies || {}),
  ...(packageJson.devDependencies || {}),
};

for (const dep of ['@tauri-apps/api', 'svelte']) {
  if (!packageDeps[dep]) {
    issues.push(`Missing dependency in app-launcher/package.json: ${dep}`);
  }
}

const pageContent = fs.readFileSync(path.join(root, 'app-launcher/src/routes/+page.svelte'), 'utf8');
const smokeSnippets = [
  'Start Workspace',
  'BlockIT',
  'Start / Prepare Blockbench MCP Workspace',
  'uvx ollmcp -u',
  'Codex Configuration',
  'Copy direct config',
  'Write direct config',
  'Remote endpoint',
  'Write fallback config',
  'Dashboard',
  'Documentation',
];

for (const snippet of smokeSnippets) {
  if (!pageContent.includes(snippet)) {
    issues.push(`Smoke check failed in +page.svelte: missing "${snippet}"`);
  }
}

if (!pageContent.includes("import { invoke } from '@tauri-apps/api/core'")) {
  issues.push('Missing required Tauri API import in +page.svelte');
}

const tauriConf = JSON.parse(fs.readFileSync(path.join(root, 'app-launcher/src-tauri/tauri.conf.json'), 'utf8'));
if (!tauriConf.build?.distDir) {
  issues.push('tauri.conf.json missing build.distDir');
}

if (!tauriConf.app?.windows || !Array.isArray(tauriConf.app.windows) || tauriConf.app.windows.length < 1) {
  issues.push('tauri.conf.json missing app.windows definition');
}

if (!fs.existsSync(path.join(root, 'tools/verify-app-launcher.ts'))) {
  issues.push('tools/verify-app-launcher.ts is missing');
}

if (issues.length > 0) {
  console.error('Frontend smoke check failed:');
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log('Frontend smoke check passed.');
process.exit(0);

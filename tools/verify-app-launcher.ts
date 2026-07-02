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
  'documentation/03-app-launcher.md',
  'documentation/04-mcp-engine.md',
  'documentation/05-ollama-ollmcp-mode.md',
  'documentation/06-codex-mode.md',
  'documentation/09-testing-plan.md',
  'documentation/10-release-checklist.md',
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
  if (!appPackage.version) {
    issues.push('app-launcher/package.json missing "version" field.');
  }

  const dependencies = {
    ...(appPackage.dependencies || {}),
    ...(appPackage.devDependencies || {}),
  };
  const requiredDeps = ['@tauri-apps/api', 'svelte'];
  for (const dep of requiredDeps) {
    if (!dependencies[dep]) {
      issues.push(`app-launcher/package.json missing dependency: ${dep}`);
    }
  }
} catch (error) {
  issues.push(`Invalid app-launcher/package.json: ${String(error)}`);
}

const requiredSnippets = [
  'Start Workspace',
  'uvx ollmcp -u',
  'Codex Configuration',
  'Settings',
  'Enable confirmation before writing configuration.',
  "id: '03-app-launcher'",
  "id: '04-mcp-engine'",
  "id: '09-testing-plan'",
  "id: '10-release-checklist'",
];

const pageContent = fs.readFileSync(path.join(root, 'app-launcher/src/routes/+page.svelte'), 'utf8');
for (const snippet of requiredSnippets) {
  if (!pageContent.includes(snippet)) {
    issues.push(`app-launcher/src/routes/+page.svelte missing snippet: ${snippet}`);
  }
}

const mandatoryDocs = [
  'documentation/00-overview.md',
  'documentation/01-source-contract.md',
  'documentation/02-architecture.md',
  'documentation/03-app-launcher.md',
  'documentation/04-mcp-engine.md',
  'documentation/05-ollama-ollmcp-mode.md',
  'documentation/06-codex-mode.md',
  'documentation/07-start-workspace-flow.md',
  'documentation/08-safety-policy.md',
  'documentation/09-testing-plan.md',
  'documentation/10-release-checklist.md',
];

const catalogFromFile = Array.from(pageContent.matchAll(/id:\s*'([^']+)'[\s\S]*?file:\s*'([^']+)'/g)).map((entry) => ({
  id: entry[1],
  file: entry[2],
}));

const catalogFiles = new Set(catalogFromFile.map((item) => item.file));
for (const doc of mandatoryDocs) {
  if (!catalogFiles.has(doc)) {
    issues.push(`Launcher doc catalog missing file: ${doc}`);
  }
}

if (!catalogFromFile.some((item) => item.id === '03-app-launcher' && item.file === 'documentation/03-app-launcher.md')) {
  issues.push(`Launcher doc catalog missing expected pair: 03-app-launcher -> documentation/03-app-launcher.md`);
}

if (!catalogFromFile.some((item) => item.id === '04-mcp-engine' && item.file === 'documentation/04-mcp-engine.md')) {
  issues.push(`Launcher doc catalog missing expected pair: 04-mcp-engine -> documentation/04-mcp-engine.md`);
}

if (!catalogFromFile.some((item) => item.id === '09-testing-plan' && item.file === 'documentation/09-testing-plan.md')) {
  issues.push(`Launcher doc catalog missing expected pair: 09-testing-plan -> documentation/09-testing-plan.md`);
}

if (!catalogFromFile.some((item) => item.id === '10-release-checklist' && item.file === 'documentation/10-release-checklist.md')) {
  issues.push(`Launcher doc catalog missing expected pair: 10-release-checklist -> documentation/10-release-checklist.md`);
}

if (!fs.existsSync(path.join(root, 'documentation'))) {
  issues.push('documentation folder missing');
} else {
  const docsList = fs
    .readdirSync(path.join(root, 'documentation'))
    .filter((item) => /^\d{2}-/.test(item) && item.endsWith('.md'));
  const expectedNames = [
    '00-overview.md',
    '01-source-contract.md',
    '02-architecture.md',
    '03-app-launcher.md',
    '04-mcp-engine.md',
    '05-ollama-ollmcp-mode.md',
    '06-codex-mode.md',
    '07-start-workspace-flow.md',
    '08-safety-policy.md',
    '09-testing-plan.md',
    '10-release-checklist.md',
  ];

  const docsSet = new Set(docsList);
  for (const file of expectedNames) {
    if (!docsSet.has(file)) {
      issues.push(`Expected documentation file missing in documentation folder: ${file}`);
    }
  }
}

const forbiddenFolderNames = ['legacy', 'old', 'v1', 'v2', 'v3', 'new-engine', 'engine-final', 'engine-fixed'];
for (const forbidden of forbiddenFolderNames) {
  const forbiddenPath = path.join(root, 'app-launcher', forbidden);
  if (fs.existsSync(forbiddenPath)) {
    issues.push(`Forbidden launcher subfolder detected: app-launcher/${forbidden}`);
  }
}

const engineRoot = path.join(root, 'app-launcher/src-tauri/src');
const bannedTerms = ['cube count', 'cube placement', 'texture logic', 'animation logic', 'modeling logic'];
const mainRust = path.join(root, 'app-launcher/src-tauri/src/main.rs');
if (fs.existsSync(mainRust)) {
  const content = fs.readFileSync(mainRust, 'utf8').toLowerCase();
  if (bannedTerms.some((term) => content.includes(term))) {
    issues.push('app-launcher/src-tauri/src/main.rs contains model-behavior terms');
  }
}

const hasDuplicateEngineStart = (fs.existsSync(engineRoot) && fs.readFileSync(path.join(root, 'app-launcher/src-tauri/src/main.rs'), 'utf8').split('Command::new').length - 1) > 1;
if (hasDuplicateEngineStart) {
  issues.push('Detected multiple Command::new calls in app-launcher/src-tauri/src/main.rs; verify single bridge runtime path');
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

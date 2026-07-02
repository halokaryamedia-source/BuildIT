import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'SOURCE_CONTRACT.md',
  'contracts/upstream/mcp-blockbench/api.json',
  'contracts/upstream/mcp-blockbench/SOURCE.md',
  'contracts/upstream/mcp-blockbench/pinned-commit.txt',
  'contracts/upstream/blockbench-skills/blockbench-use.md',
  'contracts/upstream/ollmcp/SOURCE.md',
  'tools/check-environment.ps1',
  'tools/generate-codex-config.ts',
];

const requiredSnippets = [
  'Blockbench MCP source',
  'Use docs/api.json as the tool schema contract',
  'Do not invent MCP tools, parameters, schemas, or workflows',
  'No folders named legacy',
  'uvx ollmcp -u',
  'mcp_servers.blockbench',
];

const requiredSourceUrls = [
  'https://github.com/achmadawdi/mcp-blockbench',
  'https://github.com/achmadawdi/mcp-blockbench/blob/master/README.md',
  'https://github.com/achmadawdi/mcp-blockbench/blob/master/docs/api.json',
  'https://github.com/achmadawdi/mcp-blockbench/blob/master/AGENTS.md',
  'https://github.com/jasonjgardner/blockbench-mcp-project',
  'https://github.com/jasonjgardner/blockbench-mcp-project/tree/main/skills/blockbench-use',
  'https://github.com/jonigl/mcp-client-for-ollama',
  'https://modelcontextprotocol.io/specification/2025-06-18/basic/transports',
  'https://v2.tauri.app/',
  'https://docs.astral.sh/uv/guides/tools/',
  'https://github.com/ollama/ollama/blob/main/docs/api.md',
];

const forbiddenFolderNames = ['legacy', 'old', 'v1', 'v2', 'v3', 'new-engine', 'engine-final', 'engine-fixed'];

const issues: string[] = [];

function fail(message: string) {
  issues.push(message);
}

function exists(filePath: string) {
  return fs.existsSync(path.join(root, filePath));
}

function readFile(filePath: string) {
  return fs.readFileSync(path.join(root, filePath), 'utf8');
}

for (const filePath of requiredFiles) {
  if (!exists(filePath)) {
    fail(`Missing required file: ${filePath}`);
  }
}

if (exists('contracts/upstream/mcp-blockbench/pinned-commit.txt')) {
  const pinned = readFile('contracts/upstream/mcp-blockbench/pinned-commit.txt').trim();
  if (!pinned || pinned.length < 7) {
    fail('contracts/upstream/mcp-blockbench/pinned-commit.txt is empty or too short.');
  }
}

for (const snippet of requiredSnippets) {
  const content = exists('SOURCE_CONTRACT.md') ? readFile('SOURCE_CONTRACT.md') : '';
  if (!content.includes(snippet)) {
    fail(`Missing contract rule in SOURCE_CONTRACT.md: ${snippet}`);
  }
}

const sourceContractContent = exists('SOURCE_CONTRACT.md') ? readFile('SOURCE_CONTRACT.md') : '';
for (const sourceUrl of requiredSourceUrls) {
  if (!sourceContractContent.includes(sourceUrl)) {
    fail(`Missing required source URL in SOURCE_CONTRACT.md: ${sourceUrl}`);
  }
}

try {
  const api = exists('contracts/upstream/mcp-blockbench/api.json')
    ? JSON.parse(readFile('contracts/upstream/mcp-blockbench/api.json'))
    : null;
  if (!api) {
    fail('Could not parse api.json as JSON.');
  }
} catch (error) {
  fail(`Failed to parse contracts/upstream/mcp-blockbench/api.json: ${String(error)}`);
}

for (const forbidden of forbiddenFolderNames) {
  const dirPath = path.join(root, forbidden);
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    fail(`Forbidden folder detected at root: ${forbidden}`);
  }
}

const bannedSchemaTerms = ['cube count', 'cube placement', 'texture logic', 'animation logic', 'modeling logic'];
const engineRoot = path.join(root, 'mcp-engine');
if (exists('mcp-engine') && fs.statSync(engineRoot).isDirectory()) {
  const engineFiles = listFilesRecursive(engineRoot);
  for (const file of engineFiles) {
    const content = fileToText(file);
    if (content && bannedSchemaTerms.some((term) => content.toLowerCase().includes(term))) {
      fail(`Found disallowed model-behavior term in mcp-engine: ${path.relative(root, file)}`);
      break;
    }
  }
}

if (issues.length > 0) {
  console.error('Source contract verification failed:');
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log('Source contract verification passed.');
process.exit(0);

function fileToText(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function listFilesRecursive(dir: string): string[] {
  const stack = [dir];
  const files: string[] = [];

  while (stack.length) {
    const current = stack.pop() as string;
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (entry.name === '.git' || entry.name === 'node_modules') continue;
        stack.push(path.join(current, entry.name));
      } else if (entry.isFile()) {
        files.push(path.join(current, entry.name));
      }
    }
  }

  return files;
}

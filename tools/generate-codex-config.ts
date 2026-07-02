import process from 'node:process';

const DEFAULT_ENDPOINT = 'http://localhost:3000/bb-mcp';

export function generateDirectHttpConfig(endpoint = DEFAULT_ENDPOINT): string {
  const safeEndpoint = endpoint.trim();
  return [
    '[mcp_servers.blockbench]',
    `url = "${safeEndpoint}"`,
    '',
  ].join('\n');
}

export function generateMcpRemoteConfig(endpoint = DEFAULT_ENDPOINT): string {
  const safeEndpoint = endpoint.trim();
  return [
    '[mcp_servers.blockbench]',
    'command = "npx"',
    `args = ["mcp-remote", "${safeEndpoint}"]`,
    '',
  ].join('\n');
}

function runCli() {
  const endpoint = process.argv[2] || DEFAULT_ENDPOINT;
  console.log('--- direct-http ---');
  console.log(generateDirectHttpConfig(endpoint));
  console.log('--- mcp-remote ---');
  console.log(generateMcpRemoteConfig(endpoint));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runCli();
}

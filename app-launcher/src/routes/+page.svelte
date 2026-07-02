<script>
  import { onMount } from 'svelte';
  import { invoke } from '@tauri-apps/api/core';
  import { listen } from '@tauri-apps/api/event';

  let mode = 'ollama';
  let selectedEndpoint = 'http://localhost:3000/bb-mcp';
  let endpoints = [];
  let uvx = { installed: false, message: '' };
  let ollama = { installed: false, message: '' };
  let loading = false;
  let workspaceMessage = '';
  let logs = [];
  let directConfig = '';
  let fallbackConfig = '';
  let endpointWarning = '';

  async function loadEnvironment() {
    const response = await invoke('detect_environment');
    endpoints = response.endpoints || [];
    uvx = response.uvx || uvx;
    ollama = response.ollama || ollama;
    selectedEndpoint = response.selected_endpoint || selectedEndpoint;
  }

  function formatLine(line) {
    return typeof line === 'string' ? line : JSON.stringify(line);
  }

  function updateStatus(message) {
    workspaceMessage = message;
  }

  async function startWorkspace() {
    loading = true;
    updateStatus('Preparing workspace...');

    try {
      const target = selectedEndpoint || 'http://localhost:3000/bb-mcp';
      endpointWarning = target.includes('localhost:') ? '' : 'Remote endpoint was selected. Localhost default is recommended.';

      if (mode === 'ollama') {
        if (!uvx?.installed) {
          updateStatus('uvx is required to start Ollama mode. Install uv/uvx tooling.');
          return;
        }
        if (!ollama?.installed) {
          updateStatus('Ollama is not available. Start Ollama before launching bridge.');
          return;
        }

        await invoke('start_bridge', { endpoint: target });
        updateStatus('Bridge started. Logs are now streaming.');
      } else {
        const [direct, fallback] = await invoke('prepare_codex_config', { endpoint: target });
        directConfig = direct;
        fallbackConfig = fallback;
        updateStatus('Codex config generated. Confirm before writing.');
      }
    } catch (error) {
      updateStatus(`Failed to prepare workspace: ${error}`);
    } finally {
      loading = false;
    }
  }

  async function stopBridge() {
    loading = true;
    try {
      await invoke('stop_bridge');
      updateStatus('Bridge stopped.');
    } catch (error) {
      updateStatus(`Failed to stop: ${error}`);
    } finally {
      loading = false;
    }
  }

  function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
      updateStatus('Copied to clipboard.');
    });
  }

  onMount(() => {
    void loadEnvironment();
    let unlisten = null;

    listen('bridge-log', (event) => {
      logs = [...logs, event.payload];
      if (logs.length > 400) {
        logs = logs.slice(-400);
      }
    }).then((unlistenFn) => {
      unlisten = unlistenFn;
    });

    const timer = setInterval(loadEnvironment, 8000);
    return () => {
      clearInterval(timer);
      if (unlisten) {
        unlisten();
      }
    };
  });
</script>

<main>
  <h1>BlockIT</h1>
  <p>Start Workspace from one place: Blockbench endpoint, ollmcp launcher, and Codex helper.</p>

  <section>
    <h2>Environment</h2>
    <p>UVX: {uvx.message || 'Unknown'}</p>
    <p>Ollama: {ollama.message || 'Unknown'}</p>
    <p>Detected endpoints (3000-3010): {endpoints.filter((item) => item.reachable).length}</p>
  </section>

  <section>
    <h2>Prepare Blockbench MCP Workspace</h2>
    <label>
      Mode
      <select bind:value={mode}>
        <option value="ollama">Ollama Mode</option>
        <option value="codex">Codex Mode</option>
      </select>
    </label>

    <label>
      Endpoint
      <select bind:value={selectedEndpoint}>
        {#each endpoints as endpoint}
          <option value={endpoint.url}>{endpoint.url} {endpoint.reachable ? 'reachable' : 'not reachable'}</option>
        {/each}
      </select>
    </label>

    {#if endpointWarning}
      <p>{endpointWarning}</p>
    {/if}

    <button on:click={startWorkspace} disabled={loading}>Start / Prepare Blockbench MCP Workspace</button>
    <button on:click={stopBridge} disabled={loading}>Stop Bridge</button>
    <button on:click={loadEnvironment} disabled={loading}>Refresh</button>
  </section>

  {#if workspaceMessage}
    <p>{workspaceMessage}</p>
  {/if}

  {#if mode === 'codex' && directConfig}
    <section>
      <h2>Codex MCP Config</h2>
      <p>Direct HTTP</p>
      <pre>{directConfig}</pre>
      <button on:click={() => copyText(directConfig)}>Copy direct config</button>
      <p>Fallback mcp-remote</p>
      <pre>{fallbackConfig}</pre>
      <button on:click={() => copyText(fallbackConfig)}>Copy fallback config</button>
    </section>
  {/if}

  <section>
    <h2>Bridge Logs</h2>
    <pre>{logs.map(formatLine).join('\n')}</pre>
  </section>
</main>

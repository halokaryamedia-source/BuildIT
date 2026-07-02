<script>
  import { onMount } from 'svelte';
  import { invoke } from '@tauri-apps/api/core';
  import { listen } from '@tauri-apps/api/event';

  const docCatalog = [
    {
      id: '00-overview',
      title: 'Overview',
      file: 'documentation/00-overview.md',
      purpose: 'High-level product summary and workspace goals.',
    },
    {
      id: '01-source-contract',
      title: 'Source Contract',
      file: 'documentation/01-source-contract.md',
      purpose: 'Pinned source references and bridge safety rules.',
    },
    {
      id: '02-architecture',
      title: 'Architecture',
      file: 'documentation/02-architecture.md',
      purpose: 'App launcher, bridge runtime, and mode separation.',
    },
    {
      id: '05-ollama-ollmcp-mode',
      title: 'Ollama Mode',
      file: 'documentation/05-ollama-ollmcp-mode.md',
      purpose: 'Official uvx ollmcp command flow and process handling.',
    },
    {
      id: '06-codex-mode',
      title: 'Codex Mode',
      file: 'documentation/06-codex-mode.md',
      purpose: 'Preview and write Codex MCP config with confirmation.',
    },
    {
      id: '07-start-workspace-flow',
      title: 'Start Workspace',
      file: 'documentation/07-start-workspace-flow.md',
      purpose: 'One-click preparation flow for Blockbench MCP workspaces.',
    },
    {
      id: '08-safety-policy',
      title: 'Safety Policy',
      file: 'documentation/08-safety-policy.md',
      purpose: 'Localhost defaults, remote warnings, and refusal rules.',
    },
  ];

  const defaultSettings = {
    autoRefresh: true,
    refreshInterval: 8000,
    selectedMode: 'ollama',
    preferCodexFallback: false,
  };

  let activeTab = 'dashboard';
  let mode = defaultSettings.selectedMode;
  let selectedEndpoint = 'http://localhost:3000/bb-mcp';
  let endpoints = [];
  let uvx = { installed: false, message: '' };
  let ollama = { installed: false, message: '' };
  let hasBlockbenchEndpoint = false;
  let blockbenchMessage = '';
  let loading = false;
  let workspaceMessage = '';
  let logs = [];
  let directConfig = '';
  let fallbackConfig = '';
  let endpointWarning = '';
  let endpointSuggestion = [];
  let writeTargetPath = '';
  let confirmWrite = false;
  let bridgeStatus = { running: false, endpoint: null, mode: null, logs: [] };
  let selectedDoc = docCatalog[0];
  let settings = { ...defaultSettings };
  let refreshTimer = null;
  let logUnlisten = null;

  function safeParseJSON(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function persistSettings(nextSettings) {
    settings = { ...settings, ...nextSettings };
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('blockit-settings', JSON.stringify(settings));
    }
  }

  function syncEndpointOptions(response) {
    endpointSuggestion = (response.endpoints || [])
      .filter((item) => item.reachable)
      .map((item) => ({
        value: item.url,
        text: `${item.url} ${item.plugin_enabled ? '(plugin enabled)' : '(reachable only)'}`,
      }));
  }

  function syncWarnings(response) {
    endpointWarning = response.has_blockbench_endpoint
      ? ''
      : 'No active Blockbench MCP plugin endpoint found. Open Blockbench, enable the MCP plugin, and keep one MCP window active.';
  }

  async function loadEnvironment() {
    const response = await invoke('detect_environment');
    endpoints = response.endpoints || [];
    uvx = response.uvx || uvx;
    ollama = response.ollama || ollama;
    hasBlockbenchEndpoint = !!response.has_blockbench_endpoint;
    blockbenchMessage = response.blockbench_message || '';
    selectedEndpoint = response.selected_endpoint || selectedEndpoint;
    syncEndpointOptions(response);
    syncWarnings(response);
  }

  async function loadBridgeStatus() {
    bridgeStatus = await invoke('bridge_status').catch(() => bridgeStatus);
  }

  async function refreshWorkspace() {
    await loadEnvironment();
    await loadBridgeStatus();
  }

  function formatLine(line) {
    return typeof line === 'string' ? line : JSON.stringify(line);
  }

  function updateStatus(message) {
    workspaceMessage = message;
  }

  async function startWorkspace() {
    loading = true;
    try {
      const target = selectedEndpoint || 'http://localhost:3000/bb-mcp';
      const isRemote = !target.includes('localhost:');

      if (isRemote && !window.confirm('You selected a remote MCP endpoint. Continue with the remote endpoint warning?')) {
        updateStatus('Remote endpoint start cancelled by user.');
        return;
      }

      if (!hasBlockbenchEndpoint) {
        if (!window.confirm('No Blockbench endpoint is currently detected. Continue anyway?')) {
          updateStatus('Start cancelled. Open Blockbench and enable MCP plugin first.');
          return;
        }
      }

      if (mode === 'ollama') {
        if (!uvx?.installed) {
          updateStatus('uvx is required to start Ollama mode. Install uv/uvx tooling.');
          return;
        }
        if (!ollama?.installed) {
          updateStatus('Ollama is not available. Start Ollama before launching bridge.');
          return;
        }

        await invoke('start_bridge', { endpoint: target, allowRemote: isRemote });
        updateStatus(`Bridge started for ${target}. Logs are now streaming.`);
      } else {
        const [direct, fallback] = await invoke('prepare_codex_config', { endpoint: target });
        directConfig = direct;
        fallbackConfig = fallback;
        updateStatus('Codex config generated. Confirm before writing.');
        activeTab = 'settings';
      }
    } catch (error) {
      updateStatus(`Failed to prepare workspace: ${error}`);
    } finally {
      loading = false;
      await loadBridgeStatus();
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
      await loadBridgeStatus();
    }
  }

  function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
      updateStatus('Copied to clipboard.');
    });
  }

  async function writeCodexConfig(useFallback = false) {
    if (!confirmWrite) {
      updateStatus('Aktifkan konfirmasi sebelum menulis file konfigurasi.');
      return;
    }

    loading = true;
    try {
      const endpoint = selectedEndpoint || 'http://localhost:3000/bb-mcp';
      const path = await invoke('write_codex_config', {
        endpoint,
        useRemoteFallback: useFallback,
        allowWrite: true,
        targetPath: writeTargetPath || null,
      });
      updateStatus(`Codex config written to ${path}`);
    } catch (error) {
      updateStatus(`Failed to write config: ${error}`);
    } finally {
      loading = false;
    }
  }

  function selectDoc(docId) {
    selectedDoc = docCatalog.find((item) => item.id === docId) || docCatalog[0];
  }

  function handleModeChange(value) {
    mode = value;
    persistSettings({ selectedMode: value });
  }

  onMount(() => {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('blockit-settings') : null;
    if (stored) {
      settings = { ...settings, ...safeParseJSON(stored, {}) };
      mode = settings.selectedMode || mode;
    }

    void refreshWorkspace();

    invoke('get_default_codex_path').then((path) => {
      writeTargetPath = path || '';
    });

    listen('bridge-log', (event) => {
      logs = [...logs, event.payload];
      if (logs.length > 400) {
        logs = logs.slice(-400);
      }
    }).then((fn) => {
      logUnlisten = fn;
    });

    refreshTimer = setInterval(() => {
      if (settings.autoRefresh) {
        void refreshWorkspace();
      }
    }, Math.max(2000, Number(settings.refreshInterval) || 8000));

    return () => {
      if (refreshTimer) clearInterval(refreshTimer);
      if (logUnlisten) logUnlisten();
    };
  });

</script>

<svelte:head>
  <title>BlockIT</title>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  />
</svelte:head>

<main class="shell">
  <section class="hero">
    <div>
      <p class="eyebrow">BlockIT local launcher</p>
      <h1>Blockbench MCP workspace, prepared from one screen.</h1>
      <p class="lede">
        Local endpoint detection, Ollama bridge launch, Codex config preview, and diagnostics are grouped together.
      </p>
    </div>

    <div class="hero-card">
      <div class="stat">
        <span>Active endpoint</span>
        <strong>{selectedEndpoint}</strong>
      </div>
      <div class="stat">
        <span>Bridge</span>
        <strong>{bridgeStatus.running ? 'Running' : 'Stopped'}</strong>
      </div>
      <div class="stat">
        <span>Mode</span>
        <strong>{mode}</strong>
      </div>
    </div>
  </section>

  <nav class="tabs" aria-label="BlockIT sections">
    <button class:active={activeTab === 'dashboard'} on:click={() => (activeTab = 'dashboard')}>Dashboard</button>
    <button class:active={activeTab === 'workspace'} on:click={() => (activeTab = 'workspace')}>Start Workspace</button>
    <button class:active={activeTab === 'logs'} on:click={() => (activeTab = 'logs')}>Logs</button>
    <button class:active={activeTab === 'docs'} on:click={() => (activeTab = 'docs')}>Documentation</button>
    <button class:active={activeTab === 'settings'} on:click={() => (activeTab = 'settings')}>Settings</button>
  </nav>

  {#if activeTab === 'dashboard'}
    <section class="panel grid-2">
      <article class="card">
        <h2>Environment</h2>
        <p>{blockbenchMessage}</p>
        <ul class="meta-list">
          <li>UVX: {uvx.message || 'Unknown'}</li>
          <li>Ollama: {ollama.message || 'Unknown'}</li>
          <li>Detected reachable endpoints: {endpoints.filter((item) => item.reachable).length}</li>
          <li>Blockbench endpoint detected: {hasBlockbenchEndpoint ? 'Yes' : 'No'}</li>
        </ul>
      </article>

      <article class="card">
        <h2>Bridge Status</h2>
        <ul class="meta-list">
          <li>Running: {bridgeStatus.running ? 'Yes' : 'No'}</li>
          <li>Endpoint: {bridgeStatus.endpoint || 'None'}</li>
          <li>Mode: {bridgeStatus.mode || 'None'}</li>
          <li>Log lines: {bridgeStatus.logs?.length || 0}</li>
        </ul>
        <div class="actions">
          <button on:click={refreshWorkspace} disabled={loading}>Refresh status</button>
          <button on:click={startWorkspace} disabled={loading}>Start / Prepare Workspace</button>
          <button on:click={stopBridge} disabled={loading}>Stop Bridge</button>
        </div>
      </article>
    </section>
  {/if}

  {#if activeTab === 'workspace'}
    <section class="panel grid-2">
      <article class="card">
        <h2>Prepare Blockbench MCP Workspace</h2>

    <label>
      Mode
      <select bind:value={mode} on:change={(event) => handleModeChange(event.currentTarget.value)}>
        <option value="ollama">Ollama Mode</option>
        <option value="codex">Codex Mode</option>
      </select>
    </label>

        <label>
          Endpoint
          <select bind:value={selectedEndpoint}>
            {#if endpointSuggestion.length > 0}
              {#each endpointSuggestion as option}
                <option value={option.value}>{option.text}</option>
              {/each}
            {/if}
            {#if !endpointSuggestion.length}
              <option value={selectedEndpoint}>{selectedEndpoint}</option>
            {/if}
          </select>
        </label>

        {#if endpointWarning}
          <p class="warning">{endpointWarning}</p>
        {/if}

        <div class="actions">
          <button on:click={startWorkspace} disabled={loading}>Start / Prepare Blockbench MCP Workspace</button>
          <button on:click={loadEnvironment} disabled={loading}>Check endpoints</button>
        </div>
      </article>

      <article class="card">
        <h2>Workspace Output</h2>
        {#if workspaceMessage}
          <p>{workspaceMessage}</p>
        {/if}
        <div class="command-box">
          <span>ollmcp command</span>
          <code>uvx ollmcp -u {selectedEndpoint}</code>
        </div>
        <p class="small">
          The app prepares the environment, but it does not decide modeling logic, object count, or workflow behavior.
        </p>
      </article>
    </section>
  {/if}

  {#if activeTab === 'logs'}
    <section class="panel">
      <article class="card">
        <div class="card-head">
          <h2>Bridge Logs</h2>
          <button on:click={() => (logs = [])}>Clear logs</button>
        </div>
        <pre class="log-box">{logs.map(formatLine).join('\n')}</pre>
      </article>
    </section>
  {/if}

  {#if activeTab === 'docs'}
    <section class="panel grid-2">
      <article class="card">
        <h2>Documentation Viewer</h2>
        <div class="doc-list">
          {#each docCatalog as doc}
            <button class:selected={selectedDoc.id === doc.id} on:click={() => selectDoc(doc.id)}>
              <span>{doc.title}</span>
              <small>{doc.file}</small>
            </button>
          {/each}
        </div>
      </article>

      <article class="card">
        <h2>{selectedDoc.title}</h2>
        <p>{selectedDoc.purpose}</p>
        <div class="doc-preview">
          <p><strong>File:</strong> {selectedDoc.file}</p>
          <p><strong>Scope:</strong> Bridge, launcher, diagnostics, and source contract guardrails.</p>
          <p><strong>Acceptance:</strong> Docs stay English-only and aligned with the current source contract.</p>
        </div>
      </article>
    </section>
  {/if}

  {#if activeTab === 'settings'}
    <section class="panel grid-2">
      <article class="card">
        <h2>Codex Configuration</h2>
        <div class="stack">
          <label>
            Config file path
            <input bind:value={writeTargetPath} placeholder="./.codex/config.toml" />
          </label>

          <label>
            <input type="checkbox" bind:checked={confirmWrite} />
            I confirm I want to write the selected config file
          </label>
        </div>

        {#if directConfig || fallbackConfig}
          <div class="actions">
            <button on:click={() => copyText(directConfig)} disabled={!directConfig}>Copy direct config</button>
            <button on:click={() => copyText(fallbackConfig)} disabled={!fallbackConfig}>Copy fallback config</button>
          </div>

          <div class="preview-block">
            <p>Direct HTTP</p>
            <pre>{directConfig}</pre>
          </div>
          <div class="preview-block">
            <p>Fallback mcp-remote</p>
            <pre>{fallbackConfig}</pre>
          </div>
        {/if}

        <div class="actions">
          <button on:click={() => writeCodexConfig(false)} disabled={!confirmWrite || loading}>Write direct config</button>
          <button on:click={() => writeCodexConfig(true)} disabled={!confirmWrite || loading}>Write fallback config</button>
        </div>
      </article>

      <article class="card">
        <h2>Preferences</h2>

        <label>
          Auto refresh
          <input
            type="checkbox"
            checked={settings.autoRefresh}
            on:change={(event) => persistSettings({ autoRefresh: event.currentTarget.checked })}
          />
        </label>

        <label>
          Refresh interval (ms)
          <input
            type="number"
            min="2000"
            step="1000"
            bind:value={settings.refreshInterval}
            on:change={(event) => persistSettings({ refreshInterval: Number(event.currentTarget.value) || 8000 })}
          />
        </label>

        <label>
          Default mode
          <select
            bind:value={settings.selectedMode}
            on:change={(event) => {
              mode = event.currentTarget.value;
              persistSettings({ selectedMode: mode });
            }}
          >
            <option value="ollama">Ollama Mode</option>
            <option value="codex">Codex Mode</option>
          </select>
        </label>

        <label>
          Prefer Codex fallback
          <input
            type="checkbox"
            checked={settings.preferCodexFallback}
            on:change={(event) => persistSettings({ preferCodexFallback: event.currentTarget.checked })}
          />
        </label>

        <p class="small">
          Settings are stored locally in browser storage only. They do not change the official source contract or bridge behavior.
        </p>
      </article>
    </section>
  {/if}

  <footer class="footer">
    <span>BlockIT</span>
    <span>{loading ? 'Working...' : 'Idle'}</span>
  </footer>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background:
      radial-gradient(circle at top left, rgba(84, 170, 255, 0.18), transparent 30%),
      radial-gradient(circle at top right, rgba(248, 196, 113, 0.14), transparent 28%),
      linear-gradient(180deg, #0f1221 0%, #13182a 48%, #0c1020 100%);
    color: #eef3ff;
  }

  .shell {
    min-height: 100vh;
    padding: 32px;
    max-width: 1280px;
    margin: 0 auto;
  }

  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1.7fr) minmax(320px, 0.9fr);
    gap: 20px;
    align-items: stretch;
    margin-bottom: 20px;
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: #92a8ff;
    font-size: 0.75rem;
    margin: 0 0 12px;
  }

  h1 {
    margin: 0;
    font-size: clamp(2.2rem, 4vw, 4.6rem);
    line-height: 0.96;
    max-width: 12ch;
  }

  .lede {
    color: #c3cbea;
    max-width: 62ch;
    margin-top: 14px;
    font-size: 1.05rem;
  }

  .hero-card,
  .card,
  .tabs {
    background: rgba(11, 15, 31, 0.72);
    border: 1px solid rgba(158, 173, 233, 0.18);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
    backdrop-filter: blur(18px);
  }

  .hero-card {
    border-radius: 24px;
    padding: 22px;
    display: grid;
    gap: 14px;
  }

  .stat {
    padding: 14px 16px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.04);
  }

  .stat span {
    display: block;
    color: #9fb0de;
    font-size: 0.78rem;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .stat strong {
    font-size: 1rem;
    word-break: break-word;
  }

  .tabs {
    display: flex;
    gap: 10px;
    padding: 10px;
    border-radius: 20px;
    margin-bottom: 20px;
    overflow-x: auto;
  }

  .tabs button,
  .actions button,
  .card-head button {
    border: 0;
    border-radius: 14px;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.06);
    color: #eef3ff;
    cursor: pointer;
  }

  .tabs button.active,
  .doc-list button.selected {
    background: linear-gradient(135deg, #5f86ff, #8d69ff);
    color: white;
  }

  .panel {
    display: grid;
    gap: 20px;
  }

  .grid-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .card {
    border-radius: 24px;
    padding: 22px;
  }

  .card h2 {
    margin-top: 0;
  }

  .meta-list {
    margin: 0;
    padding-left: 18px;
    color: #d8def4;
    display: grid;
    gap: 8px;
  }

  label {
    display: grid;
    gap: 8px;
    margin: 14px 0;
    color: #d8def4;
  }

  input,
  select {
    width: 100%;
    border: 1px solid rgba(163, 178, 229, 0.18);
    background: rgba(255, 255, 255, 0.04);
    color: #eef3ff;
    padding: 12px 14px;
    border-radius: 14px;
  }

  .warning {
    color: #ffd58a;
  }

  .actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 16px;
  }

  .command-box,
  .preview-block,
  .doc-preview {
    margin-top: 16px;
    padding: 16px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.04);
  }

  .command-box code {
    display: block;
    margin-top: 8px;
    color: #8ef0c2;
    word-break: break-word;
  }

  .small {
    color: #aab7de;
    font-size: 0.92rem;
  }

  .log-box {
    min-height: 340px;
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-word;
    background: rgba(2, 8, 20, 0.45);
    border-radius: 18px;
    padding: 18px;
    color: #d7e6ff;
  }

  .doc-list {
    display: grid;
    gap: 10px;
  }

  .doc-list button {
    text-align: left;
    border: 0;
    border-radius: 18px;
    padding: 14px 16px;
    background: rgba(255, 255, 255, 0.05);
    color: #eef3ff;
    cursor: pointer;
    display: grid;
    gap: 4px;
  }

  .doc-list small {
    color: #aab7de;
  }

  .card-head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
  }

  .stack {
    display: grid;
    gap: 10px;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 22px 6px 0;
    color: #9fb0de;
    font-size: 0.92rem;
  }

  @media (max-width: 900px) {
    .shell {
      padding: 18px;
    }

    .hero,
    .grid-2 {
      grid-template-columns: 1fr;
    }

    .tabs {
      gap: 8px;
    }
  }
</style>

<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import { onMount } from "svelte";

  const engineUrl = "http://localhost:3987";
  const maxReferenceImageBytes = 10 * 1024 * 1024;

  type TargetFormat = "bedrock" | "bedrock_block";
  type MessageRole = "user" | "assistant";

  interface Message {
    role: MessageRole;
    content: string;
  }

  interface ReferenceImageUpload {
    fileName: string;
    mimeType: string;
    dataUrl: string;
  }

  interface JobLog {
    at: string;
    message: string;
  }

  interface ModelJob {
    id: string;
    status: string;
    stage?: string;
    createdAt?: string;
    updatedAt?: string;
    logs: JobLog[];
    error?: string;
  }

  interface JobArtifactSummary {
    name: string;
    fileName: string;
    available: boolean;
    sizeBytes?: number;
    updatedAt?: string;
  }

  interface StoredDataManifest {
    openTargetPath: string;
    ready: boolean;
    missingRequiredFiles: string[];
  }

  interface JobArtifactContent extends JobArtifactSummary {
    content?: unknown;
    error?: string;
  }

  interface RuntimeStatus {
    engine_connected: boolean;
    ollama_connected: boolean;
    blockbench_mcp_port_open: boolean;
    installed_ollama_models: string[];
    missing_ollama_models: string[];
  }

  interface RuntimeCommandResult {
    started: boolean;
    path?: string;
    message: string;
  }

  interface HealthState {
    ollamaConnected: boolean;
    visionConnected: boolean;
    blockbench?: { connected?: boolean };
    mcpCapabilities?: { valid?: boolean; missingTools?: string[] };
  }

  let prompt = "";
  let targetFormat: TargetFormat = "bedrock_block";
  let selectedFile: File | null = null;
  let activeJob: ModelJob | null = null;
  let recentJobs: ModelJob[] = [];
  let artifacts: JobArtifactSummary[] = [];
  let storedDataManifest: StoredDataManifest | null = null;
  let selectedArtifact: JobArtifactContent | null = null;
  let runtimeStatus: RuntimeStatus | null = null;
  let health: HealthState | null = null;
  let messages: Message[] = [
    {
      role: "assistant",
      content:
        "BuildIT is running as a Tauri + Svelte desktop app. Use Desktop Controls to start/check Engine, Ollama, and Blockbench MCP before generating."
    }
  ];

  const notifiedJobIds = new Set<string>();
  let pollTimer: number | undefined;
  let activeJobId: string | undefined;
  let previewArtifact: JobArtifactSummary | undefined;
  let executionReportArtifact: JobArtifactSummary | undefined;
  let schemaMatchArtifact: JobArtifactSummary | undefined;
  let readyCardVisible = false;
  let previewDataUrl: string | undefined;

  $: activeJobId = activeJob?.id;
  $: previewArtifact = artifacts.find((artifact) => artifact.name === "blockbench_preview" && artifact.available);
  $: executionReportArtifact = artifacts.find((artifact) => artifact.name === "mcp_execution_report" && artifact.available);
  $: schemaMatchArtifact = artifacts.find((artifact) => artifact.name === "mcp_action_schema_match" && artifact.available);
  $: readyCardVisible = Boolean(activeJob && ["completed", "failed", "cancelled"].includes(activeJob.status));
  $: previewDataUrl = getPreviewDataUrl(selectedArtifact);

  function pushAssistantMessage(content: string): void {
    messages = [...messages, { role: "assistant", content }];
  }

  function getTargetLabel(format: TargetFormat): string {
    return format === "bedrock" ? "Bedrock Entity" : "Bedrock Block";
  }

  function getStageLabel(stage: string | undefined): string {
    const labels: Record<string, string> = {
      queued: "Queued",
      saving_references: "Saving references",
      analyzing_image: "Analyzing image",
      planning_model: "Planning model",
      validating_plan: "Validating plan",
      building_mcp_actions: "Building MCP actions",
      checking_mcp_capabilities: "Checking MCP capabilities",
      executing_mcp: "Executing in Blockbench",
      capturing_preview: "Capturing preview",
      exporting_model: "Exporting model",
      completed: "Ready in Blockbench",
      failed: "Needs attention"
    };

    return stage ? labels[stage] ?? stage : "Not started";
  }

  function formatList(values: string[]): string {
    return values.length > 0 ? values.join(", ") : "none";
  }

  function formatJobTime(value: string | undefined): string {
    if (!value) return "Unknown time";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
  }

  function formatBytes(value: number | undefined): string {
    if (typeof value !== "number") return "pending";
    if (value < 1024) return value + " B";
    if (value < 1024 * 1024) return Math.round(value / 1024) + " KB";
    return (value / 1024 / 1024).toFixed(1) + " MB";
  }

  function isTerminalJob(job: ModelJob): boolean {
    return ["completed", "failed", "cancelled"].includes(job.status);
  }

  function getPreviewDataUrl(artifact: JobArtifactContent | null): string | undefined {
    if (!artifact || artifact.name !== "blockbench_preview") return undefined;
    if (!artifact.content || typeof artifact.content !== "object") return undefined;

    const content = artifact.content as { imageDataUrl?: unknown };
    return typeof content.imageDataUrl === "string" && content.imageDataUrl.startsWith("data:image/")
      ? content.imageDataUrl
      : undefined;
  }

  async function readJsonResponse<T>(response: Response, fallbackError: string): Promise<T> {
    const data = (await response.json()) as T & { error?: string };
    if (!response.ok) throw new Error(data.error ?? fallbackError);
    return data;
  }

  async function fetchHealth(): Promise<void> {
    try {
      const response = await fetch(engineUrl + "/api/health");
      health = await readJsonResponse<HealthState>(response, "Unable to fetch engine health.");
    } catch {
      health = null;
    }
  }

  async function fetchJobs(): Promise<void> {
    try {
      const response = await fetch(engineUrl + "/api/jobs");
      const data = await readJsonResponse<{ jobs?: ModelJob[] }>(response, "Unable to fetch jobs.");
      recentJobs = (data.jobs ?? []).slice(0, 8);
    } catch {
      recentJobs = [];
    }
  }

  async function fetchJob(jobId: string): Promise<ModelJob> {
    const response = await fetch(engineUrl + "/api/jobs/" + jobId);
    const data = await readJsonResponse<{ job: ModelJob }>(response, "Unable to fetch job.");
    return data.job;
  }

  async function fetchArtifacts(jobId: string): Promise<void> {
    const response = await fetch(engineUrl + "/api/jobs/" + jobId + "/artifacts");
    const data = await readJsonResponse<{
      artifacts?: JobArtifactSummary[];
      artifactIndex?: { artifacts: JobArtifactSummary[] };
      storedDataManifest?: StoredDataManifest;
    }>(response, "Unable to fetch job artifacts.");

    artifacts = data.artifactIndex?.artifacts ?? data.artifacts ?? [];
    storedDataManifest = data.storedDataManifest ?? null;
  }

  async function checkDesktopRuntime(showMessage = true): Promise<void> {
    try {
      const status = await invoke<RuntimeStatus>("check_runtime");
      runtimeStatus = status;
      if (showMessage) {
        pushAssistantMessage(
          "Runtime checked. Engine: " +
            (status.engine_connected ? "connected" : "offline") +
            ", Ollama: " +
            (status.ollama_connected ? "connected" : "offline") +
            ", Blockbench MCP port: " +
            (status.blockbench_mcp_port_open ? "open" : "closed") +
            ", missing models: " +
            formatList(status.missing_ollama_models) +
            "."
        );
      }
    } catch (error) {
      pushAssistantMessage(error instanceof Error ? error.message : "Unable to check Tauri runtime.");
    }
  }

  async function runRuntimeCommand(commandName: string, fallbackMessage: string): Promise<void> {
    try {
      const result = await invoke<RuntimeCommandResult>(commandName);
      pushAssistantMessage(result.message + (result.path ? " Path: " + result.path : ""));
      await checkDesktopRuntime(false);
      await fetchHealth();
    } catch (error) {
      pushAssistantMessage(error instanceof Error ? error.message : fallbackMessage);
    }
  }

  function validateSelectedImage(file: File): void {
    if (!file.type.startsWith("image/")) throw new Error("Please select an image file.");
    if (file.size > maxReferenceImageBytes) throw new Error("Reference image must be 10 MB or smaller.");
  }

  function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Unable to read selected image."));
      reader.readAsDataURL(file);
    });
  }

  async function createReferenceImageUpload(): Promise<ReferenceImageUpload[]> {
    if (!selectedFile) return [];
    validateSelectedImage(selectedFile);
    const dataUrl = await readFileAsDataUrl(selectedFile);
    return [{ fileName: selectedFile.name, mimeType: selectedFile.type, dataUrl }];
  }

  function onFileChange(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    try {
      if (file) validateSelectedImage(file);
      selectedFile = file;
    } catch (error) {
      selectedFile = null;
      pushAssistantMessage(error instanceof Error ? error.message : "Invalid reference image.");
    }
  }

  async function submitJob(): Promise<void> {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    messages = [...messages, { role: "user", content: getTargetLabel(targetFormat) + ": " + trimmedPrompt }];
    prompt = "";
    artifacts = [];
    selectedArtifact = null;
    storedDataManifest = null;

    try {
      const referenceImages = await createReferenceImageUpload();
      const response = await fetch(engineUrl + "/api/jobs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: trimmedPrompt, referenceImages, imagePaths: [], format: targetFormat, autoReview: true })
      });
      const data = await readJsonResponse<{ job?: ModelJob }>(response, "Unable to create job.");
      if (!data.job) throw new Error("Unable to create job.");

      activeJob = data.job;
      selectedFile = null;
      pushAssistantMessage("Job created. BuildIT will notify you when the model is ready in Blockbench.");
      await fetchJobs();
      startPolling();
    } catch (error) {
      pushAssistantMessage(error instanceof Error ? error.message : "Unable to reach the engine API.");
    }
  }

  async function openJob(jobId: string): Promise<void> {
    try {
      activeJob = await fetchJob(jobId);
      await fetchArtifacts(jobId);
      selectedArtifact = null;
      if (isTerminalJob(activeJob) && !notifiedJobIds.has(activeJob.id)) {
        notifiedJobIds.add(activeJob.id);
        pushAssistantMessage(activeJob.status === "completed" ? "Model ready in Blockbench." : activeJob.error ?? "Generation needs attention.");
      }
      startPolling();
    } catch (error) {
      pushAssistantMessage(error instanceof Error ? error.message : "Unable to open job.");
    }
  }

  async function openArtifact(artifact: JobArtifactSummary | undefined): Promise<void> {
    if (!activeJobId || !artifact?.available) return;

    try {
      const response = await fetch(engineUrl + "/api/jobs/" + activeJobId + "/artifacts/" + artifact.name);
      const data = await readJsonResponse<{ artifact: JobArtifactContent }>(response, "Unable to fetch artifact.");
      selectedArtifact = data.artifact;
    } catch (error) {
      pushAssistantMessage(error instanceof Error ? error.message : "Unable to open artifact.");
    }
  }

  async function openStoredData(): Promise<void> {
    if (!activeJobId) return;

    try {
      const response = await fetch(engineUrl + "/api/jobs/" + activeJobId + "/open-stored-data", { method: "POST" });
      const data = await readJsonResponse<{ opened?: { path: string }; storedDataManifest?: StoredDataManifest }>(
        response,
        "Unable to open Stored Data Root."
      );
      storedDataManifest = data.storedDataManifest ?? storedDataManifest;
      pushAssistantMessage("Opened Stored Data Root: " + (data.opened?.path ?? storedDataManifest?.openTargetPath ?? activeJobId));
    } catch (error) {
      pushAssistantMessage(error instanceof Error ? error.message : "Unable to open Stored Data Root.");
    }
  }

  async function pollActiveJob(): Promise<void> {
    if (!activeJobId) return;

    try {
      activeJob = await fetchJob(activeJobId);
      await fetchArtifacts(activeJobId);
      await fetchJobs();
      if (isTerminalJob(activeJob) && !notifiedJobIds.has(activeJob.id)) {
        notifiedJobIds.add(activeJob.id);
        pushAssistantMessage(activeJob.status === "completed" ? "Model ready in Blockbench." : activeJob.error ?? "Generation needs attention.");
      }
    } catch (error) {
      pushAssistantMessage(error instanceof Error ? error.message : "Unable to refresh active job.");
    }
  }

  function startPolling(): void {
    if (pollTimer) window.clearInterval(pollTimer);
    pollTimer = window.setInterval(() => {
      if (activeJob && !isTerminalJob(activeJob)) void pollActiveJob();
    }, 1500);
  }

  onMount(() => {
    void checkDesktopRuntime(false);
    void fetchHealth();
    void fetchJobs();
    const healthTimer = window.setInterval(() => {
      void checkDesktopRuntime(false);
      void fetchHealth();
      void fetchJobs();
    }, 5000);
    startPolling();
    return () => {
      window.clearInterval(healthTimer);
      if (pollTimer) window.clearInterval(pollTimer);
    };
  });
</script>

<main class="app-shell">
  <aside class="sidebar">
    <h1>BuildIT</h1>
    <p>Tauri + Svelte Auto Model Studio</p>

    <div class="status-card">
      <strong>Desktop controls</strong>
      <span>Engine: {runtimeStatus?.engine_connected ? "connected" : "unknown/offline"}</span>
      <span>Ollama: {runtimeStatus?.ollama_connected ? "connected" : "unknown/offline"}</span>
      <span>Blockbench MCP port: {runtimeStatus?.blockbench_mcp_port_open ? "open" : "unknown/offline"}</span>
      <span>Installed models: {formatList(runtimeStatus?.installed_ollama_models ?? [])}</span>
      <span>Missing models: {formatList(runtimeStatus?.missing_ollama_models ?? [])}</span>
      <button onclick={() => runRuntimeCommand("start_buildit_engine", "Unable to start BuildIT engine from app.")}>Start Engine</button>
      <button onclick={() => runRuntimeCommand("start_ollama", "Unable to start Ollama from app.")}>Start Ollama</button>
      <button onclick={() => runRuntimeCommand("pull_required_ollama_models", "Unable to pull required Ollama models from app.")}>Pull Models</button>
      <button onclick={() => runRuntimeCommand("open_blockbench", "Unable to open Blockbench app.")}>Open Blockbench App</button>
      <button onclick={() => runRuntimeCommand("open_mcp_plugin_page", "Unable to open MCP plugin page.")}>Open MCP Plugin</button>
      <button onclick={() => checkDesktopRuntime()}>Check Runtime</button>
    </div>

    <div class="status-card">
      <strong>Engine health</strong>
      <span>Main model: {health?.ollamaConnected ? "connected" : "offline"}</span>
      <span>Vision model: {health?.visionConnected ? "connected" : "offline"}</span>
      <span>Blockbench MCP: {health?.blockbench?.connected ? "connected" : "offline"}</span>
      <span>MCP tools: {health?.mcpCapabilities?.valid ? "valid" : "not ready"}</span>
    </div>

    <div class="status-card">
      <strong>Active job</strong>
      <span>{activeJob ? activeJob.status : "No active job"}</span>
      <span>Stage: {getStageLabel(activeJob?.stage)}</span>
    </div>

    <div class="status-card">
      <strong>Stored Data Root</strong>
      <span>{storedDataManifest?.openTargetPath ?? "No stored data yet"}</span>
      <span>{storedDataManifest?.ready ? "Ready to open" : "Waiting for required outputs"}</span>
      <button disabled={!activeJobId || !storedDataManifest} onclick={openStoredData}>Open Stored Data</button>
    </div>

    <div class="recent-jobs">
      <strong>Recent jobs</strong>
      {#if recentJobs.length === 0}<span>No saved jobs</span>{/if}
      {#each recentJobs as job}
        <button class="recent-job-button" onclick={() => openJob(job.id)}>
          <span>{job.id}</span>
          <small>{job.status} · {getStageLabel(job.stage)}</small>
          <small>{formatJobTime(job.updatedAt ?? job.createdAt)}</small>
        </button>
      {/each}
    </div>
  </aside>

  <section class="chat-panel">
    <div class="messages">
      {#each messages as message}
        <article class="message {message.role}">{message.content}</article>
      {/each}

      {#if readyCardVisible && activeJob}
        <article class="ready-card {activeJob.status === 'completed' ? 'success' : 'failed'}">
          <strong>{activeJob.status === "completed" ? "Model ready in Blockbench" : "Generation needs attention"}</strong>
          <span>{activeJob.status === "completed" ? "The generated model should now be available inside Blockbench." : activeJob.error ?? "Check MCP diagnostics."}</span>
          <div class="ready-actions">
            <button disabled={!previewArtifact} onclick={() => openArtifact(previewArtifact)}>View Preview</button>
            <button disabled={!activeJobId || !storedDataManifest} onclick={openStoredData}>Open Stored Data</button>
            <button disabled={!executionReportArtifact} onclick={() => openArtifact(executionReportArtifact)}>Check MCP Report</button>
            <button disabled={!schemaMatchArtifact} onclick={() => openArtifact(schemaMatchArtifact)}>Check Schema Match</button>
          </div>
        </article>
      {/if}

      {#if activeJob}
        <article class="job-card">
          <strong>{activeJob.id}</strong>
          <span>Status: {activeJob.status}</span>
          <span>Stage: {getStageLabel(activeJob.stage)}</span>
          <ul>{#each activeJob.logs.slice(-5) as log}<li>{log.message}</li>{/each}</ul>
        </article>
      {/if}

      {#if artifacts.length > 0}
        <article class="artifact-card">
          <strong>Job artifacts</strong>
          <ul>
            {#each artifacts as artifact}
              <li class={artifact.available ? "available" : "missing"}>
                <span><span>{artifact.fileName}</span><small>{artifact.available ? formatBytes(artifact.sizeBytes) + " · " + formatJobTime(artifact.updatedAt) : "pending"}</small></span>
                <button disabled={!artifact.available} onclick={() => openArtifact(artifact)}>{artifact.available ? "View" : "Pending"}</button>
              </li>
            {/each}
          </ul>
        </article>
      {/if}

      {#if selectedArtifact}
        <article class="artifact-viewer">
          <strong>{selectedArtifact.fileName}</strong>
          {#if previewDataUrl}<img class="preview-image" src={previewDataUrl} alt="Blockbench preview" />{/if}
          <pre>{JSON.stringify(selectedArtifact.content ?? selectedArtifact.error, null, 2)}</pre>
        </article>
      {/if}
    </div>

    <div class="composer">
      <div class="target-selector">
        <label>
          <span>Project type</span>
          <select bind:value={targetFormat}>
            <option value="bedrock">Bedrock Entity</option>
            <option value="bedrock_block">Bedrock Block</option>
          </select>
        </label>
        <p>Bedrock Block is a placeable Minecraft Bedrock custom block. Bedrock Entity is an entity model.</p>
      </div>
      <label class="file-picker">
        <span>{selectedFile ? selectedFile.name : "Select reference image up to 10 MB"}</span>
        <input type="file" accept="image/*" onchange={onFileChange} />
      </label>
      <textarea bind:value={prompt} placeholder="Describe the model you want to create..."></textarea>
      <button onclick={submitJob}>Generate</button>
    </div>
  </section>
</main>

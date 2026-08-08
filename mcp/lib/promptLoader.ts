import { VERSION } from "@/lib/constants";
import bundledPromptManifest from "@/prompts/manifest.json";
import { z } from "zod";

// ============================================================================
// Types
// ============================================================================

export interface PromptManifest {
  version: string;
  generatedAt: string;
  prompts: Record<string, string>;
}

// ============================================================================
// Constants
// ============================================================================

const CDN_BASE_URL =
  "https://cdn.jsdelivr.net/gh/jasonjgardner/blockbench-mcp-plugin";
const MANIFEST_PATH = "prompts/manifest.json";
const FETCH_TIMEOUT_MS = 10_000;

const STORAGE_KEY_MANIFEST = "bbmcp_prompt_manifest";
const STORAGE_KEY_VERSION = "bbmcp_prompt_manifest_version";
const STORAGE_KEY_OVERRIDES = "bbmcp_prompt_overrides";

const promptManifestSchema = z.object({
  version: z.string(),
  generatedAt: z.string(),
  prompts: z.record(z.string(), z.string()),
});

// The canonical build scripts regenerate this JSON from mcp/prompts/*.md before
// bundling. Keeping it in the module graph makes Local prompt content available
// without network or filesystem access at runtime.
const localManifest: PromptManifest = promptManifestSchema.parse(
  bundledPromptManifest
);

// ============================================================================
// State
// ============================================================================

let remoteManifest: PromptManifest | null = null;
let overrides: Record<string, string> = {};
let initialized = false;

// ============================================================================
// localStorage helpers (safe for CLI environments)
// ============================================================================

function hasLocalStorage(): boolean {
  return typeof localStorage !== "undefined";
}

function storageGet(key: string): string | null {
  if (!hasLocalStorage()) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string): void {
  if (!hasLocalStorage()) return;
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn("[MCP] localStorage write failed:", err);
  }
}

function storageRemove(key: string): void {
  if (!hasLocalStorage()) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

// ============================================================================
// CDN helpers
// ============================================================================

function getManifestUrl(): string {
  return `${CDN_BASE_URL}@v${VERSION}/${MANIFEST_PATH}`;
}

async function fetchManifestFromCDN(): Promise<PromptManifest> {
  const url = getManifestUrl();
  console.log(`[MCP] Fetching optional prompt manifest from ${url}`);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (err) {
    if (controller.signal.aborted) {
      throw new Error(
        `Fetch timed out after ${FETCH_TIMEOUT_MS}ms while loading prompt manifest from ${url}`
      );
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();
  const result = promptManifestSchema.safeParse(json);

  if (!result.success) {
    throw new Error(`Invalid manifest: ${result.error.message}`);
  }

  return result.data;
}

// ============================================================================
// Cache helpers
// ============================================================================

function loadCachedManifest(): PromptManifest | null {
  const raw = storageGet(STORAGE_KEY_MANIFEST);
  if (!raw) return null;

  try {
    const parsed = promptManifestSchema.safeParse(JSON.parse(raw));
    if (parsed.success) return parsed.data;
  } catch {
    // handled below
  }

  storageRemove(STORAGE_KEY_MANIFEST);
  storageRemove(STORAGE_KEY_VERSION);
  return null;
}

function cacheManifest(m: PromptManifest): void {
  storageSet(STORAGE_KEY_MANIFEST, JSON.stringify(m));
  storageSet(STORAGE_KEY_VERSION, VERSION);
}

function loadOverrides(): Record<string, string> {
  const raw = storageGet(STORAGE_KEY_OVERRIDES);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    if (typeof parsed === "object" && parsed !== null) {
      return parsed;
    }
  } catch {
    storageRemove(STORAGE_KEY_OVERRIDES);
  }

  return {};
}

function persistOverrides(): void {
  if (Object.keys(overrides).length === 0) {
    storageRemove(STORAGE_KEY_OVERRIDES);
  } else {
    storageSet(STORAGE_KEY_OVERRIDES, JSON.stringify(overrides));
  }
}

function getEffectiveManifest(): PromptManifest {
  return {
    version: localManifest.version,
    generatedAt: localManifest.generatedAt,
    // Remote content is fallback-only. Repository-owned Local prompt names
    // always win so a CDN response cannot silently replace Local workflow rules.
    prompts: {
      ...(remoteManifest?.prompts ?? {}),
      ...localManifest.prompts,
    },
  };
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Initialize the prompt loader.
 *
 * Local/bundled prompts are always available and authoritative. User overrides
 * remain highest priority. When CDN support is explicitly enabled, remote/cache
 * content is loaded only as fallback for prompt names not present in Local.
 */
export async function initPromptLoader(
  cdnEnabled: boolean = false
): Promise<void> {
  overrides = loadOverrides();
  remoteManifest = null;

  console.log(
    `[MCP] Local prompt manifest loaded (v${localManifest.version}, ${Object.keys(localManifest.prompts).length} prompts)`
  );

  if (cdnEnabled) {
    const cachedVersion = storageGet(STORAGE_KEY_VERSION);
    const cacheHit = cachedVersion === VERSION;

    if (cacheHit) {
      remoteManifest = loadCachedManifest();
      if (remoteManifest) {
        console.log(
          `[MCP] Optional prompt fallback loaded from cache (v${VERSION}, ${Object.keys(remoteManifest.prompts).length} prompts)`
        );
      }
    }

    if (!remoteManifest) {
      try {
        remoteManifest = await fetchManifestFromCDN();
        cacheManifest(remoteManifest);
        console.log(
          `[MCP] Optional prompt fallback fetched from CDN (v${VERSION}, ${Object.keys(remoteManifest.prompts).length} prompts)`
        );
      } catch (err) {
        console.warn("[MCP] Optional CDN prompt fallback unavailable:", err);

        const staleManifest = loadCachedManifest();
        if (staleManifest) {
          remoteManifest = staleManifest;
          const staleVersion = cachedVersion ?? "unknown";
          console.warn(
            `[MCP] Using stale optional prompt fallback (cached: v${staleVersion}, current: v${VERSION})`
          );
        }
      }
    }
  }

  initialized = true;
}

/**
 * Get prompt content by name.
 * Priority: user override > bundled Local > optional remote fallback > empty.
 */
export function getPromptContent(name: string): string {
  if (!initialized) {
    console.warn(
      "[MCP] getPromptContent called before initPromptLoader — returning empty"
    );
    return "";
  }

  const override = overrides[name];
  if (override !== undefined && override !== "") {
    return override;
  }

  const local = localManifest.prompts[name];
  if (local !== undefined) {
    return local;
  }

  return remoteManifest?.prompts[name] ?? "";
}

/**
 * Set a user override for a specific prompt. Persists to localStorage.
 */
export function setPromptOverride(name: string, content: string): void {
  overrides = { ...overrides, [name]: content };
  persistOverrides();
}

/**
 * Remove a user override, reverting to the bundled Local prompt first.
 */
export function clearPromptOverride(name: string): void {
  const { [name]: _, ...rest } = overrides;
  overrides = rest;
  persistOverrides();
}

/**
 * Check if a specific prompt has a user override.
 */
export function hasPromptOverride(name: string): boolean {
  return name in overrides && overrides[name] !== "";
}

/**
 * Get all current user overrides.
 */
export function getPromptOverrides(): Record<string, string> {
  return { ...overrides };
}

/**
 * Get all available prompt names from Local plus optional remote fallback.
 */
export function getAvailablePromptNames(): string[] {
  return Object.keys(getEffectiveManifest().prompts);
}

/**
 * Get the effective prompt manifest for UI display. Local prompt names override
 * any same-named remote entry.
 */
export function getManifest(): PromptManifest {
  const effective = getEffectiveManifest();
  return { ...effective, prompts: { ...effective.prompts } };
}

/**
 * Explicitly refresh optional CDN fallback content. Local prompt names remain
 * authoritative and cannot be replaced by the fetched manifest.
 */
export async function refreshFromCDN(): Promise<void> {
  try {
    remoteManifest = await fetchManifestFromCDN();
    cacheManifest(remoteManifest);
    console.log(
      `[MCP] Optional prompt fallback refreshed from CDN (v${VERSION}, ${Object.keys(remoteManifest.prompts).length} prompts)`
    );
  } catch (err) {
    console.error("[MCP] CDN refresh failed:", err);
    throw err;
  }
}

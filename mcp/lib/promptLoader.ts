import bundledPromptManifest from "@/prompts/manifest.json";
import { z } from "zod";

export interface PromptManifest {
  version: string;
  generatedAt: string;
  prompts: Record<string, string>;
}

const STORAGE_KEY_OVERRIDES = "bbmcp_prompt_overrides";

const promptManifestSchema = z.object({
  version: z.string(),
  generatedAt: z.string(),
  prompts: z.record(z.string(), z.string()),
});

const localManifest: PromptManifest = promptManifestSchema.parse(
  bundledPromptManifest
);

let overrides: Record<string, string> = {};
let initialized = false;

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
    // Ignore storage cleanup failures.
  }
}

function loadOverrides(): Record<string, string> {
  const raw = storageGet(STORAGE_KEY_OVERRIDES);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return Object.fromEntries(
        Object.entries(parsed).filter((entry): entry is [string, string] =>
          typeof entry[1] === "string"
        )
      );
    }
  } catch {
    // Invalid legacy override payload is removed below.
  }

  storageRemove(STORAGE_KEY_OVERRIDES);
  return {};
}

function persistOverrides(): void {
  if (Object.keys(overrides).length === 0) {
    storageRemove(STORAGE_KEY_OVERRIDES);
    return;
  }
  storageSet(STORAGE_KEY_OVERRIDES, JSON.stringify(overrides));
}

/** Initialize bundled Local prompts and persisted user overrides. */
export async function initPromptLoader(): Promise<void> {
  overrides = loadOverrides();
  initialized = true;
  console.log(
    `[MCP] Local prompt manifest loaded (v${localManifest.version}, ${Object.keys(localManifest.prompts).length} prompts)`
  );
}

/** Priority: user override > bundled Local prompt > empty. */
export function getPromptContent(name: string): string {
  if (!initialized) {
    console.warn(
      "[MCP] getPromptContent called before initPromptLoader — returning empty"
    );
    return "";
  }

  const override = overrides[name];
  if (override !== undefined && override !== "") return override;
  return localManifest.prompts[name] ?? "";
}

export function setPromptOverride(name: string, content: string): void {
  overrides = { ...overrides, [name]: content };
  persistOverrides();
}

export function clearPromptOverride(name: string): void {
  const { [name]: _removed, ...rest } = overrides;
  overrides = rest;
  persistOverrides();
}

export function hasPromptOverride(name: string): boolean {
  return name in overrides && overrides[name] !== "";
}

export function getPromptOverrides(): Record<string, string> {
  return { ...overrides };
}

export function getAvailablePromptNames(): string[] {
  return Object.keys(localManifest.prompts);
}

export function getManifest(): PromptManifest {
  return {
    ...localManifest,
    prompts: { ...localManifest.prompts },
  };
}

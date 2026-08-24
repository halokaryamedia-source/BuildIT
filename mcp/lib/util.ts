import { resolveCoreTexture } from "@/lib/coreIdentity";

export function isAbsoluteFilesystemPath(value: string): boolean {
  return (
    value.startsWith("/") ||
    /^[A-Za-z]:[\\/]/.test(value) ||
    /^\\\\[^\\]+\\[^\\]+(?:\\|$)/.test(value)
  );
}

/**
 * Shared fail-closed precondition for tools that need an open project.
 * One consistent error vocabulary instead of a raw getter TypeError escaping
 * for the same caller mistake across tool families.
 */
export function requireOpenProject(action: string): void {
  if (!Project) {
    throw new Error(
      `No project is open. Open or create the intended Bedrock project before ${action}.`
    );
  }
}

/**
 * Helper function to create properly formatted image content for MCP responses.
 * Handles data URLs, base64 strings, and objects with url property.
 *
 * @param dataOrOptions - Image data as base64/data URL string, or object with { url: string }
 * @param mimeType - MIME type of the image (e.g., 'image/png', 'image/jpeg')
 * @returns Formatted MCP tool result with image content
 */
export function imageContent(
  dataOrOptions: string | { url: string },
  mimeType: string = "image/png"
): { content: Array<{ type: "image"; data: string; mimeType: string }> } {
  // Handle object with url property
  const data = typeof dataOrOptions === "string" ? dataOrOptions : dataOrOptions.url;
  let base64Data = data;

  // If it's a data URL, extract the base64 part
  if (data.startsWith("data:")) {
    const matches = data.match(/^data:([^;]+);base64,(.+)$/);
    if (matches) {
      mimeType = matches[1] || mimeType;
      base64Data = matches[2];
    } else {
      throw new Error(
        "imageContent received an unsupported data URL; expected base64-encoded image data."
      );
    }
  }

  return {
    content: [
      {
        type: "image" as const,
        data: base64Data,
        mimeType,
      },
    ],
  };
}

export function fixCircularReferences<
  T extends Record<string, any>,
  K extends keyof T,
  V extends T[K]
>(o: T): (k: K, v: V) => V | string {
  const weirdTypes = [
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    BigInt64Array,
    BigUint64Array,
    //Float16Array,
    Float32Array,
    Float64Array,
    ArrayBuffer,
    // SharedArrayBuffer,
    DataView,
  ];

  const defs = new Map();

  return function (k: K, v: V): V | string {
    if (k && (v as unknown) === o)
      return "[" + (k as string) + " is the same as original object]";
    if (v === undefined) return undefined as V;
    if (v === null) return null as V;
    const weirdType = weirdTypes.find((t) => (v as unknown) instanceof t);
    if (weirdType) return weirdType.toString();
    if (typeof v == "function") {
      return v.toString();
    }
    if (v && typeof v == "object") {
      const def = defs.get(v);
      if (def)
        return "[" + (k as string) + " is the same as " + (def as string) + "]";
      defs.set(v, k);
    }
    return v;
  };
}

type RuntimeMutableBarItem = BarItem & {
  set?: (value: unknown) => unknown;
  change?: (value: unknown) => unknown;
  update?: () => unknown;
  value?: unknown;
};

/**
 * Programmatically sets a BarItems slider/widget's value, tolerating the API
 * drift between Blockbench widget subclasses where some expose `.set(n)`,
 * `.change(n)`, or only a mutable `.value`. Blockbench's public BarItems type is
 * the common BarItem base class, so subclass-only mutators are localized behind
 * this runtime adapter instead of being cast throughout paint tools.
 */
export function setBarItemValue(id: string, value: unknown): void {
  const item = BarItems?.[id] as RuntimeMutableBarItem | undefined;
  if (!item) return;

  if (typeof item.set === "function") {
    try {
      item.set(value);
      return;
    } catch {
      // Fall through to another runtime-supported mutator.
    }
  }

  if ("value" in item) {
    item.value = value;
    if (typeof item.update === "function") item.update();
    return;
  }

  if (typeof item.change === "function") {
    try {
      item.change(value);
    } catch {
      // Best-effort UI setting; callers should not fail because Blockbench
      // changed an optional widget mutator signature.
    }
  }
}

/**
 * Resolves a texture reference and activates it in the panel so that paint
 * tools, which historically act on `Texture.selected` regardless of their
 * `texture_id` argument, target the intended texture.
 *
 * With exactly one loaded texture, omission may use selected/default state.
 * With multiple textures (for example PBR support channels or explicit
 * variants), callers must pass an explicit texture identity so production
 * painting cannot drift to whichever panel texture happens to be selected.
 */
export function getAndActivateTexture(id?: string): Texture {
  if (!id) {
    const available = Project?.textures ?? Texture.all;
    if (available.length > 1) {
      // Prefer the single base-color atlas when the request is implicit.
      // This keeps iterative paint to-the-point without forcing the caller
      // to pin texture_id on every brush stroke, while still requiring
      // explicit identity when the base atlas is fragmented.
      const baseCandidates = available.filter((texture: Texture) => {
        const channel = (texture as Texture & { pbr_channel?: string }).pbr_channel ?? "color";
        if (channel !== "color") return false;
        const groupId = (texture as Texture & { group?: string }).group;
        if (!groupId) return true;
        const group = (globalThis as unknown as { TextureGroup?: { all: Array<{ uuid: string; is_material?: boolean }> } }).TextureGroup?.all.find(
          (candidate) => candidate.uuid === groupId
        );
        return !group || group.is_material !== false;
      });
      if (baseCandidates.length === 1) {
        const base = baseCandidates[0];
        if (Texture.selected?.uuid !== base.uuid) base.select();
        return base;
      }
      throw new Error(
        "Multiple textures are loaded. Pass texture_id explicitly so painting targets the intended base-color atlas or support channel instead of implicit selected/default state."
      );
    }

    const active = Texture.selected ?? Texture.getDefault();
    if (!active) {
      throw new Error(
        "No texture available. Use create_texture first, or pass texture_id explicitly."
      );
    }
    if (Texture.selected?.uuid !== active.uuid) {
      active.select();
    }
    return active;
  }

  const texture = resolveCoreTexture(
    id,
    "Use list_textures to confirm the intended UUID or texture ID before painting."
  );
  if (Texture.selected?.uuid !== texture.uuid) {
    texture.select();
  }
  return texture;
}

// ============================================================================
// Texture-group / channel helpers
// ============================================================================

/**
 * Returns compact discovery identity for one PBR channel.
 * Focused material/config detail remains owned by get_material_info.
 */
export function getChannelTextureInfo(textures: Texture[], channel: string) {
  const tex = textures.find((t: Texture) => t.pbr_channel === channel);
  return tex ? { name: tex.name, uuid: tex.uuid } : null;
}

/**
 * Captures a screenshot of the 3D preview canvas.
 * Uses Blockbench's native rendering pipeline for accurate capture.
 */
export function captureScreenshot() {
  if (!Project) {
    throw new Error("No active project found in the Blockbench editor.");
  }

  const preview = Preview.selected;
  if (!preview) {
    throw new Error("No preview available for the selected project.");
  }

  // Capture the preview canvas using Blockbench's native approach
  // Canvas.withoutGizmos temporarily hides gizmos, executes the callback, then restores them
  let dataUrl: string | undefined;
  Canvas.withoutGizmos(() => {
    preview.render();
    dataUrl = preview.canvas.toDataURL();
  });

  if (!dataUrl) {
    throw new Error("Failed to capture preview screenshot.");
  }

  return imageContent(dataUrl, "image/png");
}

/**
 * Captures a screenshot of the entire Blockbench application window.
 * Uses Electron's native capturePage API through Blockbench's Screencam.
 * Only available when running as a desktop application.
 */
export async function captureAppScreenshot(): Promise<ReturnType<typeof imageContent>> {
  return new Promise((resolve, reject) => {
    let resolved = false;

    // Add a timeout in case the callback is never called
    const timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        reject(new Error("App screenshot timed out after 5 seconds."));
      }
    }, 5000);

    // Use Blockbench's native Screencam.fullScreen which uses Electron's capturePage
    // @ts-ignore - Screencam.fullScreen callback type is incomplete in public typings.
    Screencam.fullScreen({}, (dataUrl: string) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeoutId);
        if (dataUrl) {
          resolve(imageContent(dataUrl, "image/png"));
        } else {
          reject(
            new Error("Failed to capture app screenshot - no data returned.")
          );
        }
      }
    });
  });
}

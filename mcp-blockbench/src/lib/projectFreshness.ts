/// <reference types="blockbench-types" />

interface RuntimeCodec {
  compile?: (options?: unknown) => unknown;
  getExportOptions?: () => Record<string, unknown>;
}

function buffer(value: unknown): Buffer {
  if (value instanceof ArrayBuffer) return Buffer.from(value);
  if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
    const view = value as ArrayBufferView;
    return Buffer.from(view.buffer, view.byteOffset, view.byteLength);
  }
  if (typeof value === "string") return Buffer.from(value, "utf8");
  return Buffer.from(JSON.stringify(value ?? null), "utf8");
}

function sha256(value: Buffer): string {
  // @ts-ignore Blockbench runtime permission API.
  const crypto = requireNativeModule("crypto", {
    message: "Project freshness verification needs SHA-256 hashing.",
    optional: false,
  }) as {
    createHash(name: string): {
      update(value: Buffer): { digest(encoding: string): string };
    };
  };
  if (!crypto) throw new Error("Crypto access was denied.");
  return crypto.createHash("sha256").update(value).digest("hex");
}

/**
 * Hashes the current canonical .bbmodel serialization. This includes Geometry,
 * hierarchy, UV, embedded texture data, and Animation state represented by the
 * project codec, so stage reports become stale after any active-project change.
 */
export function computeProjectContentSignature(): string {
  // @ts-ignore Blockbench runtime codec registry.
  const codec = (Codecs as Record<string, RuntimeCodec>).project;
  if (!codec || typeof codec.compile !== "function") {
    throw new Error("PROJECT_CONTENT_SIGNATURE_CODEC_MISSING");
  }
  const compiled = codec.compile(
    typeof codec.getExportOptions === "function"
      ? codec.getExportOptions()
      : undefined
  );
  const data = buffer(compiled);
  if (!data.byteLength) throw new Error("PROJECT_CONTENT_SIGNATURE_EMPTY");
  return sha256(data);
}

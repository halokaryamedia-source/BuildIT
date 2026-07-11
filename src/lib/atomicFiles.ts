export interface NativeFsLike {
  existsSync(path: string): boolean;
  mkdirSync(path: string, options?: { recursive?: boolean }): void;
  readFileSync(path: string, encoding?: string): string | Buffer;
  readdirSync?(path: string): string[];
  writeFileSync(path: string, data: string | Buffer): void;
  renameSync(from: string, to: string): void;
  rmSync(path: string, options?: { force?: boolean }): void;
}

export function normalizePathForCompare(path: string): string {
  const slashed = path.replace(/\\/g, "/");
  const driveMatch = slashed.match(/^([a-zA-Z]:)(?:\/|$)/);
  const isAbsolutePosix = !driveMatch && slashed.startsWith("/");
  const prefix = driveMatch
    ? `${driveMatch[1].toLowerCase()}/`
    : isAbsolutePosix
      ? "/"
      : "";
  const remainder = driveMatch
    ? slashed.slice(driveMatch[0].length)
    : isAbsolutePosix
      ? slashed.slice(1)
      : slashed;
  const parts: string[] = [];

  for (const segment of remainder.split("/")) {
    if (!segment || segment === ".") continue;
    if (segment === "..") {
      if (parts.length > 0 && parts[parts.length - 1] !== "..") {
        parts.pop();
      } else if (!prefix) {
        parts.push("..");
      }
      continue;
    }
    parts.push(segment);
  }

  const normalized = `${prefix}${parts.join("/")}`.replace(/\/$/, "");
  return driveMatch ? normalized.toLowerCase() : normalized;
}

export function assertInsideRoot(path: string, root: string): void {
  const target = normalizePathForCompare(path);
  const normalizedRoot = normalizePathForCompare(root);
  if (!normalizedRoot || normalizedRoot === "." || normalizedRoot === "..") {
    throw new Error("Approved output root must resolve to a concrete directory.");
  }
  if (target !== normalizedRoot && !target.startsWith(`${normalizedRoot}/`)) {
    throw new Error(`Output path "${path}" is outside approved root "${root}".`);
  }
}

export function parentDirectory(path: string): string | null {
  const normalized = path.replace(/\\/g, "/");
  const index = normalized.lastIndexOf("/");
  if (index <= 0) return null;
  return path.slice(0, index);
}

function removeIfPresent(fs: NativeFsLike, path: string): void {
  if (fs.existsSync(path)) fs.rmSync(path, { force: true });
}

export function writeFileAtomically(
  fs: NativeFsLike,
  path: string,
  data: string | Buffer
): void {
  const directory = parentDirectory(path);
  if (directory) fs.mkdirSync(directory, { recursive: true });

  const temp = `${path}.tmp`;
  const backup = `${path}.bak`;
  removeIfPresent(fs, temp);
  removeIfPresent(fs, backup);

  fs.writeFileSync(temp, data);
  if (fs.existsSync(path)) fs.renameSync(path, backup);

  try {
    fs.renameSync(temp, path);
    removeIfPresent(fs, backup);
  } catch (error) {
    removeIfPresent(fs, path);
    if (fs.existsSync(backup)) fs.renameSync(backup, path);
    removeIfPresent(fs, temp);
    throw error;
  }
}

export function readJsonFile<T>(fs: NativeFsLike, path: string): T {
  if (!fs.existsSync(path)) throw new Error(`Required JSON file not found: ${path}`);
  const raw = fs.readFileSync(path, "utf8");
  return JSON.parse(String(raw)) as T;
}

export function writeJsonAtomically(
  fs: NativeFsLike,
  path: string,
  value: unknown
): void {
  writeFileAtomically(fs, path, JSON.stringify(value, null, 2));
}

export function bufferFromDataUrl(dataUrl: string): Buffer {
  const match = dataUrl.match(/^data:([^;,]+)?(;base64)?,(.*)$/s);
  if (!match) throw new Error("Texture source is not a valid data URL.");
  const encoded = match[3] ?? "";
  return match[2]
    ? Buffer.from(encoded, "base64")
    : Buffer.from(decodeURIComponent(encoded), "utf8");
}

export function directoryHasFiles(fs: NativeFsLike, path: string): boolean {
  if (!fs.existsSync(path)) return false;
  if (!fs.readdirSync) return true;
  return fs.readdirSync(path).length > 0;
}

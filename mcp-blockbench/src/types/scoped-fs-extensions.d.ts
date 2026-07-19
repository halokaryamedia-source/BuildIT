interface ScopedFS {
  cpSync(
    source: string,
    target: string,
    options: { recursive: true; force?: boolean }
  ): void;
  copyFileSync(source: string, target: string): void;
  readdirSync(
    path: string,
    options: { withFileTypes: true }
  ): Array<{
    name: string;
    isDirectory(): boolean;
    isFile(): boolean;
  }>;
  rmSync(
    path: string,
    options?: { force?: boolean; recursive?: boolean }
  ): void;
}

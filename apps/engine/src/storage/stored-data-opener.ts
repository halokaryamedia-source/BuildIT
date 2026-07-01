import { access } from "node:fs/promises";
import { platform } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";

export interface OpenStoredDataResult {
  openedAt: string;
  path: string;
  command: string;
}

function getOpenCommand(path: string): { command: string; args: string[] } {
  const currentPlatform = platform();

  if (currentPlatform === "win32") {
    return { command: "explorer", args: [path] };
  }

  if (currentPlatform === "darwin") {
    return { command: "open", args: [path] };
  }

  return { command: "xdg-open", args: [path] };
}

export async function openStoredDataRoot(outputRoot: string, jobId: string): Promise<OpenStoredDataResult> {
  const storedDataRoot = join(outputRoot, "jobs", jobId);
  await access(storedDataRoot);

  const { command, args } = getOpenCommand(storedDataRoot);

  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      detached: true,
      stdio: "ignore"
    });

    child.once("error", reject);
    child.once("spawn", () => {
      child.unref();
      resolve();
    });
  });

  return {
    openedAt: new Date().toISOString(),
    path: storedDataRoot,
    command
  };
}

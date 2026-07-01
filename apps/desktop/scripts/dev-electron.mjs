import { spawn } from "node:child_process";
import { request } from "node:http";
import process from "node:process";

const devServerUrl = "http://127.0.0.1:5173";
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const cwd = process.cwd();

function spawnProcess(command, args, options = {}) {
  return spawn(command, args, {
    cwd,
    stdio: "inherit",
    shell: false,
    ...options
  });
}

function waitForUrl(url, timeoutMs = 30000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    function attempt() {
      const req = request(url, { method: "GET" }, (res) => {
        res.resume();
        resolve();
      });

      req.on("error", () => {
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error("Timed out waiting for Vite dev server: " + url));
          return;
        }

        setTimeout(attempt, 500);
      });

      req.end();
    }

    attempt();
  });
}

const vite = spawnProcess(npmCommand, ["run", "dev:renderer"]);

try {
  await waitForUrl(devServerUrl);
  const electron = spawnProcess(npmCommand, ["exec", "--", "electron", "."], {
    env: {
      ...process.env,
      BUILDIT_DESKTOP_DEV_SERVER_URL: devServerUrl
    }
  });

  electron.on("exit", (code) => {
    vite.kill();
    process.exit(code ?? 0);
  });
} catch (error) {
  vite.kill();
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

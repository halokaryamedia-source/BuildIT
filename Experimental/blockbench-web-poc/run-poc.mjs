import { chromium } from "playwright";
import { closeSync, mkdirSync, openSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { once } from "node:events";
import { execFileSync, spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const outputDir = join(scriptDir, "output");
const blockbenchDir = process.env.BLOCKBENCH_DIR;
const expectedBlockbenchCommit = process.env.BLOCKBENCH_COMMIT;
const serverUrl = "http://127.0.0.1:4173/";

if (!blockbenchDir || !expectedBlockbenchCommit) {
  throw new Error("BLOCKBENCH_DIR and BLOCKBENCH_COMMIT are required");
}
if (!/^[0-9a-f]{40}$/.test(expectedBlockbenchCommit)) {
  throw new Error("BLOCKBENCH_COMMIT must be an exact 40-character commit SHA");
}

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

const playwrightPackage = JSON.parse(
  readFileSync(join(scriptDir, "node_modules", "playwright", "package.json"), "utf8"),
);
const proof = {
  schema_version: 1,
  status: "RUNNING",
  attempt: "A",
  execution: "github-hosted-headed-xvfb-swiftshader",
  blockbench_commit_expected: expectedBlockbenchCommit,
  blockbench_commit_actual: null,
  node_version: process.version,
  playwright_version: playwrightPackage.version,
  browser_version: null,
  stage: "bootstrap",
  webgl: null,
  authored: null,
  reparsed: null,
  outputs: {},
  cleanup: {
    browser_closed: false,
    server_terminated: false,
  },
  failure: null,
};

const serverLogPath = join(outputDir, "blockbench-server.log");
const serverLogFd = openSync(serverLogPath, "w");
const browserLogPath = join(outputDir, "browser.log");
let browserLog = "";
let server;
let browser;

function writeProof() {
  writeFileSync(join(outputDir, "proof.json"), `${JSON.stringify(proof, null, 2)}\n`);
}
function setStage(stage) {
  proof.stage = stage;
  writeProof();
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function stopChild(child) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return true;
  child.kill("SIGTERM");
  await Promise.race([once(child, "exit"), delay(2500)]);
  if (child.exitCode === null && child.signalCode === null) {
    child.kill("SIGKILL");
    await Promise.race([once(child, "exit"), delay(1500)]);
  }
  return child.exitCode !== null || child.signalCode !== null;
}
async function waitForServer(url, timeoutMs = 90000) {
  const deadline = Date.now() + timeoutMs;
  let lastError = "no response";
  while (Date.now() < deadline) {
    if (server?.exitCode !== null) {
      throw new Error(`Blockbench web server exited early with code ${server.exitCode}`);
    }
    try {
      const response = await fetch(url, { redirect: "follow" });
      if (response.ok) return;
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await delay(500);
  }
  throw new Error(`Timed out waiting for Blockbench Web: ${lastError}`);
}
function pngBuffer(dataUrl, label) {
  const match = /^data:image\/png;base64,(.+)$/s.exec(dataUrl);
  if (!match) throw new Error(`${label} is not a PNG data URL`);
  const buffer = Buffer.from(match[1], "base64");
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (buffer.length < 256 || !buffer.subarray(0, 8).equals(signature)) {
    throw new Error(`${label} is empty or does not have a valid PNG signature`);
  }
  return buffer;
}

try {
  setStage("pin_blockbench_source");
  proof.blockbench_commit_actual = execFileSync(
    "git",
    ["-C", blockbenchDir, "rev-parse", "HEAD"],
    { encoding: "utf8" },
  ).trim();
  if (proof.blockbench_commit_actual !== expectedBlockbenchCommit) {
    throw new Error(
      `Pinned Blockbench mismatch: expected ${expectedBlockbenchCommit}, got ${proof.blockbench_commit_actual}`,
    );
  }

  setStage("serve_blockbench_web");
  server = spawn(
    process.execPath,
    ["build.js", "--target=web", "--serve", "--host=127.0.0.1", "--port=4173"],
    {
      cwd: blockbenchDir,
      env: process.env,
      stdio: ["ignore", serverLogFd, serverLogFd],
    },
  );
  await waitForServer(serverUrl);

  setStage("launch_browser");
  browser = await chromium.launch({
    headless: false,
    args: [
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--ignore-gpu-blocklist",
      "--enable-webgl",
    ],
  });
  proof.browser_version = browser.version();

  const context = await browser.newContext({
    viewport: { width: 1100, height: 800 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.on("console", (message) => {
    browserLog += `[console:${message.type()}] ${message.text()}\n`;
  });
  page.on("pageerror", (error) => {
    browserLog += `[pageerror] ${error.stack || error.message}\n`;
  });

  setStage("boot_blockbench_web");
  await page.goto(serverUrl, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForFunction(
    () =>
      globalThis.Blockbench &&
      globalThis.Formats?.bedrock &&
      globalThis.setupProject &&
      globalThis.Group &&
      globalThis.Cube &&
      globalThis.Texture &&
      globalThis.Codecs?.project &&
      globalThis.Preview?.selected?.renderer &&
      globalThis.Screencam?.screenshotPreview,
    null,
    { timeout: 90000 },
  );

  setStage("native_author_render_compile");
  const result = await page.evaluate(async () => {
    const preview = Preview.selected;
    const gl = preview.renderer.getContext();
    if (!gl) throw new Error("Blockbench Preview renderer did not expose a WebGL context");
    const debug = gl.getExtension("WEBGL_debug_renderer_info");
    const webgl = {
      available: true,
      version: gl.getParameter(gl.VERSION),
      shading_language_version: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
      vendor: debug
        ? gl.getParameter(debug.UNMASKED_VENDOR_WEBGL)
        : gl.getParameter(gl.VENDOR),
      renderer: debug
        ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)
        : gl.getParameter(gl.RENDERER),
    };

    setupProject(Formats.bedrock);
    Project.name = "blockit_web_poc";
    Project.model_identifier = "geometry.blockit_web_poc";
    Project.texture_width = 16;
    Project.texture_height = 16;
    Project.box_uv = true;

    const root = new Group({ name: "root", origin: [0, 0, 0] }).init();
    const cube = new Cube({
      name: "poc_cube",
      from: [-4, 0, -4],
      to: [4, 8, 4],
      origin: [0, 4, 0],
      box_uv: true,
      uv_offset: [0, 0],
    })
      .addTo(root)
      .init();

    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 16;
    textureCanvas.height = 16;
    const textureContext = textureCanvas.getContext("2d");
    textureContext.fillStyle = "#c77a2b";
    textureContext.fillRect(0, 0, 16, 16);
    textureContext.fillStyle = "#4c2c18";
    for (let y = 0; y < 16; y += 4) {
      for (let x = (y / 4) % 2 === 0 ? 0 : 4; x < 16; x += 8) {
        textureContext.fillRect(x, y, 4, 4);
      }
    }
    const textureDataUrl = textureCanvas.toDataURL("image/png");
    const texture = new Texture({ name: "poc.png" }).fromDataURL(textureDataUrl).add(false);

    const textureDeadline = performance.now() + 10000;
    while ((texture.width !== 16 || texture.height !== 16) && performance.now() < textureDeadline) {
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
    if (texture.width !== 16 || texture.height !== 16) {
      throw new Error(`Texture did not load as 16x16; got ${texture.width}x${texture.height}`);
    }

    cube.applyTexture(texture, true);
    cube.preview_controller.updateAll(cube);
    Canvas.updateAllBones();
    Canvas.updateAllPositions();
    Canvas.updateAllFaces();

    async function capture(preset) {
      preview.loadAnglePreset(preset);
      preview.render();
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      preview.render();
      return await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Native screenshot timed out")), 10000);
        Screencam.screenshotPreview(
          preview,
          { crop: true, width: 512, height: 512 },
          (dataUrl) => {
            clearTimeout(timeout);
            if (!dataUrl) reject(new Error("Native screenshot returned no image data"));
            else resolve(dataUrl);
          },
        );
      });
    }

    const perspective = await capture({
      position: [18, 14, 18],
      target: [0, 4, 0],
      projection: "perspective",
      fov: 45,
    });
    const front = await capture({
      position: [0, 4, 24],
      target: [0, 4, 0],
      projection: "perspective",
      fov: 40,
    });

    const authored = {
      groups: Group.all.map((item) => item.name),
      cubes: Cube.all.map((item) => ({ name: item.name, from: [...item.from], to: [...item.to] })),
      textures: Texture.all.map((item) => ({ name: item.name, width: item.width, height: item.height })),
    };
    if (authored.groups.length !== 1 || authored.cubes.length !== 1 || authored.textures.length !== 1) {
      throw new Error(`Unexpected authored state: ${JSON.stringify(authored)}`);
    }

    const compiled = Codecs.project.compile({ bitmaps: true, minify: false });
    if (typeof compiled !== "string" || compiled.length < 256) {
      throw new Error("Native project codec did not return a usable bbmodel string");
    }

    const parsedModel = JSON.parse(compiled);
    setupProject(Formats.bedrock);
    Codecs.project.parse(parsedModel, "");
    await new Promise((resolve) => setTimeout(resolve, 100));

    const reparsed = {
      groups: Group.all.map((item) => item.name),
      cubes: Cube.all.map((item) => item.name),
      textures: Texture.all.map((item) => item.name),
    };
    if (
      reparsed.groups.length !== 1 ||
      reparsed.cubes.length !== 1 ||
      reparsed.textures.length !== 1 ||
      reparsed.groups[0] !== "root" ||
      reparsed.cubes[0] !== "poc_cube" ||
      reparsed.textures[0] !== "poc.png"
    ) {
      throw new Error(`Native bbmodel reparse mismatch: ${JSON.stringify(reparsed)}`);
    }

    return { webgl, authored, reparsed, compiled, perspective, front };
  });

  proof.webgl = result.webgl;
  proof.authored = result.authored;
  proof.reparsed = result.reparsed;

  setStage("write_artifacts");
  const modelPath = join(outputDir, "model.bbmodel");
  const perspectivePath = join(outputDir, "preview-perspective.png");
  const frontPath = join(outputDir, "preview-front.png");
  writeFileSync(modelPath, result.compiled, "utf8");
  writeFileSync(perspectivePath, pngBuffer(result.perspective, "perspective screenshot"));
  writeFileSync(frontPath, pngBuffer(result.front, "front screenshot"));

  proof.outputs = {
    model_bbmodel_bytes: statSync(modelPath).size,
    preview_perspective_bytes: statSync(perspectivePath).size,
    preview_front_bytes: statSync(frontPath).size,
  };
  proof.status = "PASS";
  proof.stage = "complete";
} catch (error) {
  proof.status = "FAIL";
  proof.failure = {
    stage: proof.stage,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  };
  process.exitCode = 1;
} finally {
  if (browser) {
    try {
      await browser.close();
      proof.cleanup.browser_closed = true;
    } catch (error) {
      browserLog += `[cleanup-browser] ${error instanceof Error ? error.message : String(error)}\n`;
    }
  }
  try {
    proof.cleanup.server_terminated = await stopChild(server);
  } catch (error) {
    browserLog += `[cleanup-server] ${error instanceof Error ? error.message : String(error)}\n`;
  }
  if (proof.status === "PASS" && (!proof.cleanup.browser_closed || !proof.cleanup.server_terminated)) {
    proof.status = "FAIL";
    proof.stage = "cleanup";
    proof.failure = {
      stage: "cleanup",
      message: `Cleanup incomplete: ${JSON.stringify(proof.cleanup)}`,
    };
    process.exitCode = 1;
  }
  try {
    closeSync(serverLogFd);
  } catch (error) {
    browserLog += `[cleanup-server-log] ${error instanceof Error ? error.message : String(error)}\n`;
  }
  writeFileSync(browserLogPath, browserLog, "utf8");
  writeProof();
}

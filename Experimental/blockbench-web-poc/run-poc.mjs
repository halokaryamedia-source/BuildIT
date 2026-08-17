import { chromium } from "playwright";
import { closeSync, mkdirSync, openSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { once } from "node:events";
import { createHash } from "node:crypto";
import { execFileSync, spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadAuthoringRequest } from "./authoring-contract.mjs";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const outputDir = join(scriptDir, "output");
const requestPath = join(scriptDir, "request.json");
const blockbenchDir = process.env.BLOCKBENCH_DIR;
const expectedBlockbenchCommit = process.env.BLOCKBENCH_COMMIT;
const serverUrl = "http://127.0.0.1:4173/";

if (!blockbenchDir || !expectedBlockbenchCommit) {
  throw new Error("BLOCKBENCH_DIR and BLOCKBENCH_COMMIT are required");
}
if (!/^[0-9a-f]{40}$/.test(expectedBlockbenchCommit)) {
  throw new Error("BLOCKBENCH_COMMIT must be an exact 40-character commit SHA");
}

const authoringRequest = loadAuthoringRequest(requestPath);
const canonicalRequest = `${JSON.stringify(authoringRequest, null, 2)}\n`;
const requestSha256 = createHash("sha256").update(canonicalRequest).digest("hex");
const operationCounts = authoringRequest.operations.reduce((counts, operation) => {
  counts[operation.op] = (counts[operation.op] || 0) + 1;
  return counts;
}, {});

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

const playwrightPackage = JSON.parse(
  readFileSync(join(scriptDir, "node_modules", "playwright", "package.json"), "utf8"),
);
const proof = {
  schema_version: 2,
  status: "RUNNING",
  attempt: "A-data-only-v1",
  execution: "github-hosted-headed-xvfb-swiftshader",
  authoring_contract: "data-only-v1",
  request_sha256: requestSha256,
  request_operation_counts: operationCounts,
  blockbench_commit_expected: expectedBlockbenchCommit,
  blockbench_commit_actual: null,
  node_version: process.version,
  playwright_version: playwrightPackage.version,
  browser_version: null,
  stage: "validate_authoring_request",
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
  writeFileSync(join(outputDir, "request.json"), canonicalRequest, "utf8");

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

  setStage("execute_data_only_authoring");
  const result = await page.evaluate(async (request) => {
    const preview = Preview.selected;
    const gl = preview.renderer.getContext();
    if (!gl) throw new Error("Blockbench Preview renderer did not expose a WebGL context");
    const debug = gl.getExtension("WEBGL_debug_renderer_info");
    const webgl = {
      available: true,
      version: gl.getParameter(gl.VERSION),
      shading_language_version: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
      vendor: debug ? gl.getParameter(debug.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
      renderer: debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
    };

    const expected = {
      groups: request.operations.filter((operation) => operation.op === "add_group").map((operation) => operation.name).sort(),
      cubes: request.operations.filter((operation) => operation.op === "add_cube").map((operation) => operation.name).sort(),
      textures: request.operations.filter((operation) => operation.op === "create_texture").map((operation) => operation.name).sort(),
    };

    setupProject(Formats.bedrock);
    Project.name = request.project.name;
    Project.model_identifier = request.project.identifier;
    Project.texture_width = request.project.texture_width;
    Project.texture_height = request.project.texture_height;
    Project.box_uv = true;

    const groups = new Map();
    const textures = new Map();

    async function waitForTexture(texture, width, height) {
      const deadline = performance.now() + 10000;
      while ((texture.width !== width || texture.height !== height) && performance.now() < deadline) {
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
      if (texture.width !== width || texture.height !== height) {
        throw new Error(`Texture ${texture.name} did not load as ${width}x${height}; got ${texture.width}x${texture.height}`);
      }
    }

    for (const operation of request.operations) {
      if (operation.op === "create_texture") {
        const canvas = document.createElement("canvas");
        canvas.width = operation.width;
        canvas.height = operation.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not create 2D canvas context for texture generation");

        if (operation.pattern.type === "solid") {
          ctx.fillStyle = operation.pattern.color;
          ctx.fillRect(0, 0, operation.width, operation.height);
        } else {
          ctx.fillStyle = operation.pattern.primary;
          ctx.fillRect(0, 0, operation.width, operation.height);
          ctx.fillStyle = operation.pattern.secondary;
          const cell = operation.pattern.cell;
          for (let y = 0; y < operation.height; y += cell) {
            for (let x = 0; x < operation.width; x += cell) {
              if (((x / cell) + (y / cell)) % 2 === 1) ctx.fillRect(x, y, cell, cell);
            }
          }
        }

        const texture = new Texture({ name: operation.name })
          .fromDataURL(canvas.toDataURL("image/png"))
          .add(false);
        await waitForTexture(texture, operation.width, operation.height);
        textures.set(operation.id, texture);
        continue;
      }

      if (operation.op === "add_group") {
        const group = new Group({ name: operation.name, origin: operation.origin });
        if (operation.parent) group.addTo(groups.get(operation.parent));
        group.init();
        groups.set(operation.id, group);
        continue;
      }

      const parent = groups.get(operation.parent);
      const texture = textures.get(operation.texture);
      if (!parent || !texture) throw new Error(`Validated references were unavailable for cube ${operation.name}`);
      const cube = new Cube({
        name: operation.name,
        from: operation.from,
        to: operation.to,
        origin: operation.origin,
        box_uv: true,
        uv_offset: operation.uv_offset,
      })
        .addTo(parent)
        .init();
      cube.applyTexture(texture, true);
      cube.preview_controller.updateAll(cube);
    }

    Canvas.updateAllBones();
    Canvas.updateAllPositions();
    Canvas.updateAllFaces();

    const authored = {
      groups: Group.all.map((item) => item.name).sort(),
      cubes: Cube.all.map((item) => ({ name: item.name, from: [...item.from], to: [...item.to] })).sort((a, b) => a.name.localeCompare(b.name)),
      textures: Texture.all.map((item) => ({ name: item.name, width: item.width, height: item.height })).sort((a, b) => a.name.localeCompare(b.name)),
    };
    const authoredNames = {
      groups: authored.groups,
      cubes: authored.cubes.map((item) => item.name),
      textures: authored.textures.map((item) => item.name),
    };
    for (const key of ["groups", "cubes", "textures"]) {
      if (JSON.stringify(authoredNames[key]) !== JSON.stringify(expected[key])) {
        throw new Error(`Authored ${key} mismatch: expected ${JSON.stringify(expected[key])}, got ${JSON.stringify(authoredNames[key])}`);
      }
    }

    const bounds = {
      min: [Infinity, Infinity, Infinity],
      max: [-Infinity, -Infinity, -Infinity],
    };
    for (const cube of Cube.all) {
      for (let axis = 0; axis < 3; axis++) {
        bounds.min[axis] = Math.min(bounds.min[axis], cube.from[axis]);
        bounds.max[axis] = Math.max(bounds.max[axis], cube.to[axis]);
      }
    }
    const center = bounds.min.map((value, axis) => (value + bounds.max[axis]) / 2);
    const span = Math.max(8, ...bounds.max.map((value, axis) => value - bounds.min[axis]));

    async function capture(preset) {
      preview.loadAnglePreset(preset);
      preview.render();
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      preview.render();
      return await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Native screenshot timed out")), 10000);
        Screencam.screenshotPreview(preview, { crop: true, width: 512, height: 512 }, (dataUrl) => {
          clearTimeout(timeout);
          if (!dataUrl) reject(new Error("Native screenshot returned no image data"));
          else resolve(dataUrl);
        });
      });
    }

    const perspective = await capture({
      position: [center[0] + span * 1.6, center[1] + span * 1.2, center[2] + span * 1.6],
      target: center,
      projection: "perspective",
      fov: 45,
    });
    const front = await capture({
      position: [center[0], center[1], center[2] + span * 2.4],
      target: center,
      projection: "perspective",
      fov: 40,
    });

    const compiled = Codecs.project.compile({ bitmaps: true, minify: false });
    if (typeof compiled !== "string" || compiled.length < 256) {
      throw new Error("Native project codec did not return a usable bbmodel string");
    }
    const parsedModel = JSON.parse(compiled);
    if (parsedModel.meta?.model_format !== "bedrock") {
      throw new Error(`Compiled project model_format is not bedrock: ${parsedModel.meta?.model_format}`);
    }

    setupProject(Formats.bedrock);
    Codecs.project.parse(parsedModel, "");
    const textureDeadline = performance.now() + 10000;
    while (Texture.all.some((texture) => !texture.width || !texture.height) && performance.now() < textureDeadline) {
      await new Promise((resolve) => setTimeout(resolve, 25));
    }

    const reparsed = {
      groups: Group.all.map((item) => item.name).sort(),
      cubes: Cube.all.map((item) => item.name).sort(),
      textures: Texture.all.map((item) => item.name).sort(),
    };
    for (const key of ["groups", "cubes", "textures"]) {
      if (JSON.stringify(reparsed[key]) !== JSON.stringify(expected[key])) {
        throw new Error(`Native bbmodel reparse ${key} mismatch: expected ${JSON.stringify(expected[key])}, got ${JSON.stringify(reparsed[key])}`);
      }
    }

    return { webgl, authored, reparsed, compiled, perspective, front, bounds, center, span };
  }, authoringRequest);

  proof.webgl = result.webgl;
  proof.authored = result.authored;
  proof.reparsed = result.reparsed;
  proof.framing = { bounds: result.bounds, center: result.center, span: result.span };

  setStage("write_artifacts");
  const modelPath = join(outputDir, "model.bbmodel");
  const perspectivePath = join(outputDir, "preview-perspective.png");
  const frontPath = join(outputDir, "preview-front.png");
  const requestOutputPath = join(outputDir, "request.json");
  writeFileSync(modelPath, result.compiled, "utf8");
  writeFileSync(perspectivePath, pngBuffer(result.perspective, "perspective screenshot"));
  writeFileSync(frontPath, pngBuffer(result.front, "front screenshot"));

  proof.outputs = {
    request_json_bytes: statSync(requestOutputPath).size,
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

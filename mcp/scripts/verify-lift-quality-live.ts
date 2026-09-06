import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import {
  LiveMcpClient,
  expect,
  firstImage,
  imageDigest,
  requireDisposableConsent,
  structuredObject,
  type ContentItem,
  type JsonObject,
  type ToolCallPayload,
} from "./live-e2e-common";

const REQUIRED_TOOLS = [
  "get_project_info",
  "list_textures",
  "get_texture",
  "capture_model_views",
  "create_texture",
  "undo",
] as const;
const CANONICAL_LIFT_PATH = resolve("../workspace/active/lift/lift.bbmodel");
const APPROVED_REFERENCE_PATH = resolve(
  "../workspace/active/lift/references/approved-reference.png"
);
const WINDOW_REFERENCE_PATH = resolve(
  "../workspace/active/lift/references/window-detail.png"
);
const EVIDENCE_ROOT = resolve(".cache/lift-quality-live");
const VIEWS = ["front", "left", "front_left_3q"] as const;

type ImageItem = Extract<ContentItem, { type: "image" }>;

async function sha256File(path: string): Promise<string> {
  const file = Bun.file(path);
  expect(await file.exists(), `Missing required evidence file ${path}.`);
  return new Bun.CryptoHasher("sha256")
    .update(new Uint8Array(await file.arrayBuffer()))
    .digest("hex");
}

async function writeImage(path: string, image: ImageItem): Promise<string> {
  await Bun.write(path, Buffer.from(image.data, "base64"));
  return new Bun.CryptoHasher("sha256")
    .update(Buffer.from(image.data, "base64"))
    .digest("hex");
}

function labeledImages(result: ToolCallPayload): Map<string, ImageItem> {
  const images = new Map<string, ImageItem>();
  let pendingView: string | null = null;
  for (const item of result.content ?? []) {
    if (item.type === "text") {
      const match = item.text.match(/^VIEW\s+(.+)$/);
      if (match) pendingView = match[1];
      continue;
    }
    if (pendingView) {
      images.set(pendingView, item);
      pendingView = null;
    }
  }
  return images;
}

async function captureViews(client: LiveMcpClient) {
  const result = await client.callTool(
    "capture_model_views",
    {
      views: [...VIEWS],
      front_direction: "+z",
      framing: { mode: "model" },
    },
    "evidence"
  );
  const images = labeledImages(result);
  for (const view of VIEWS) {
    expect(images.has(view), `capture_model_views returned no ${view} image.`);
  }
  return images;
}

async function textureInventory(client: LiveMcpClient): Promise<JsonObject> {
  return structuredObject(
    await client.callTool("list_textures", {}, "inspection"),
    "list_textures"
  );
}

function singleBaseTexture(inventory: JsonObject): JsonObject {
  const textures = (inventory.textures ?? []) as JsonObject[];
  const bases = textures.filter((texture) => texture.role === "base_color_candidate");
  expect(
    bases.length === 1,
    `Lift quality verifier requires exactly one base-color atlas; found ${bases.length}.`
  );
  expect(
    textures.length === 1,
    `Lift quality verifier requires the pre-PBR/single-atlas state; found ${textures.length} textures.`
  );
  return bases[0];
}

function stablePacking(inventory: JsonObject): unknown {
  const audit = (inventory.uv_audit ?? {}) as JsonObject;
  return {
    state: audit.state ?? null,
    packing: audit.packing ?? null,
    production_gate: audit.production_gate ?? null,
  };
}

async function atlasImage(client: LiveMcpClient, textureUuid: string) {
  return firstImage(
    await client.callTool(
      "get_texture",
      { texture: textureUuid },
      "evidence"
    ),
    "get_texture"
  );
}

async function saveCaptureSet(
  directory: string,
  prefix: string,
  images: Map<string, ImageItem>
) {
  const saved: Record<string, { path: string; sha256: string }> = {};
  for (const view of VIEWS) {
    const image = images.get(view)!;
    const path = resolve(directory, `${prefix}-${view}.png`);
    saved[view] = { path, sha256: await writeImage(path, image) };
  }
  return saved;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  requireDisposableConsent(args);
  const requestedPath = process.env.BLOCKIT_LIFT_DISPOSABLE_PATH;
  expect(
    requestedPath,
    "Set BLOCKIT_LIFT_DISPOSABLE_PATH to the exact absolute .bbmodel copy opened in Blockbench."
  );
  const disposablePath = resolve(requestedPath);
  expect(
    disposablePath !== CANONICAL_LIFT_PATH,
    "Lift quality verifier refuses the canonical workspace/active/lift/lift.bbmodel. Open a disposable copy instead."
  );

  const client = new LiveMcpClient({
    expectedPhase: "geometry",
    requiredTools: REQUIRED_TOOLS,
  });
  const environment = await client.preflight();
  const projectInfo = structuredObject(
    await client.callTool("get_project_info", {}, "inspection"),
    "get_project_info"
  );
  const project = (projectInfo.project ?? {}) as JsonObject;
  expect(
    project.save_path === disposablePath,
    `Wrong live Lift copy: save_path=${String(project.save_path)} expected=${disposablePath}.`
  );

  const evidenceDir = resolve(
    EVIDENCE_ROOT,
    environment.buildIdentity.replace("sha256:", "").slice(0, 12)
  );
  await mkdir(evidenceDir, { recursive: true });

  const referenceHashes = {
    approved_reference: {
      path: APPROVED_REFERENCE_PATH,
      sha256: await sha256File(APPROVED_REFERENCE_PATH),
    },
    window_detail: {
      path: WINDOW_REFERENCE_PATH,
      sha256: await sha256File(WINDOW_REFERENCE_PATH),
    },
  };

  const beforeInventory = await textureInventory(client);
  const base = singleBaseTexture(beforeInventory);
  expect(typeof base.uuid === "string", "Base atlas inventory has no UUID.");
  expect(typeof base.name === "string", "Base atlas inventory has no name.");
  const baseUuid = base.uuid;
  const beforeAtlas = await atlasImage(client, baseUuid);
  const beforeAtlasHash = imageDigest(beforeAtlas);
  const beforeAtlasPath = resolve(evidenceDir, "before-atlas.png");
  await writeImage(beforeAtlasPath, beforeAtlas);
  const beforeViews = await saveCaptureSet(
    evidenceDir,
    "before",
    await captureViews(client)
  );

  const candidate = structuredObject(
    await client.callTool(
      "create_texture",
      {
        name: base.name,
        texture_id: baseUuid,
        type: "template",
        pixel_density: 16,
        rearrange_uv: true,
        power_of_two: true,
        keep_multi_texture_occupancy: true,
        padding: true,
      },
      "mutation"
    ),
    "create_texture"
  );
  const candidateTexture = (candidate.texture ?? {}) as JsonObject;
  const candidateBitmap = (candidateTexture.bitmap ?? {}) as JsonObject;
  const candidateAudit = (candidate.uv_audit ?? {}) as JsonObject;
  const candidateGate = (candidateAudit.production_gate ?? {}) as JsonObject;
  expect(candidateTexture.uuid === baseUuid, "Native Lift repack changed atlas UUID.");
  expect(
    candidateGate.state === "ready",
    `Native Lift repack did not produce a ready UV gate: ${JSON.stringify(candidateGate)}.`
  );
  expect(
    typeof candidateBitmap.width === "number" &&
      typeof candidateBitmap.height === "number",
    "Native Lift repack returned no bitmap size."
  );

  const candidateAtlas = await atlasImage(client, baseUuid);
  const candidateAtlasHash = imageDigest(candidateAtlas);
  const candidateAtlasPath = resolve(evidenceDir, "candidate-atlas.png");
  await writeImage(candidateAtlasPath, candidateAtlas);
  const candidateViews = await saveCaptureSet(
    evidenceDir,
    "candidate",
    await captureViews(client)
  );

  const undo = structuredObject(
    await client.callTool("undo", { steps: 1 }, "history"),
    "undo"
  );
  expect(undo.undone_count === 1, `Lift repack Undo count mismatch: ${String(undo.undone_count)}.`);
  const restoredAtlasHash = imageDigest(await atlasImage(client, baseUuid));
  expect(
    restoredAtlasHash === beforeAtlasHash,
    "Lift repack Undo did not restore the exact original atlas PNG."
  );
  const restoredInventory = await textureInventory(client);
  expect(
    JSON.stringify(stablePacking(restoredInventory)) ===
      JSON.stringify(stablePacking(beforeInventory)),
    "Lift repack Undo did not restore the original UV packing/gate state."
  );

  const nativeWidth = candidateBitmap.width;
  const nativeHeight = candidateBitmap.height;
  const manifest = {
    version: 1,
    proof: "lift_quality_evidence_candidate",
    build_identity: environment.buildIdentity,
    disposable_project_path: disposablePath,
    references: referenceHashes,
    before: {
      atlas: { path: beforeAtlasPath, sha256: beforeAtlasHash },
      views: beforeViews,
      uv: stablePacking(beforeInventory),
    },
    candidate: {
      atlas: { path: candidateAtlasPath, sha256: candidateAtlasHash },
      views: candidateViews,
      bitmap: { width: nativeWidth, height: nativeHeight },
      native_power_of_two_512_or_less:
        nativeWidth <= 512 && nativeHeight <= 512,
      uv: {
        packing: candidateAudit.packing ?? null,
        production_gate: candidateAudit.production_gate ?? null,
      },
    },
    restored_after_undo: {
      atlas_sha256: restoredAtlasHash,
      packing_matches_before: true,
    },
    visual_verdict: "UNVERIFIED",
    efficiency_verdict: "UNVERIFIED",
  };
  const manifestPath = resolve(evidenceDir, "manifest.json");
  await Bun.write(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(
    JSON.stringify(
      {
        ok: true,
        proof: "lift_quality_evidence_candidate",
        build_identity: environment.buildIdentity,
        evidence_dir: evidenceDir,
        manifest_path: manifestPath,
        native_candidate_bitmap: { width: nativeWidth, height: nativeHeight },
        native_power_of_two_512_or_less:
          nativeWidth <= 512 && nativeHeight <= 512,
        original_restored_exactly_after_undo: true,
        cost: client.snapshotMetrics(),
        visual_quality: "UNVERIFIED",
        next:
          "Review approved-reference.png against before/candidate front, left and front_left_3q at comparable framing. A <=512 native candidate is only a packing candidate until mapped visual evidence passes.",
        note:
          "This verifier never mutates the canonical Lift. It creates one native padded-repack candidate on the explicitly opened disposable copy, captures evidence, then restores the original atlas/UV state with Undo. No similarity score or automatic visual PASS is produced.",
      },
      null,
      2
    )
  );
}

if (import.meta.main) {
  await main();
}

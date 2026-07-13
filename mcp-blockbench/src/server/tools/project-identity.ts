/// <reference types="blockbench-types" />

import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL } from "@/lib/constants";
import {
  assertInsideRoot,
  normalizePathForCompare,
  readJsonFile,
  writeJsonFilesAtomically,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import { getProjectWriteLeaseSnapshot } from "@/lib/writeLease";

const hash = z.string().regex(/^[a-f0-9]{64}$/i);
const parameters = z.object({
  asset_id: z.string().regex(/^[a-z0-9_]+$/),
  session_root: z.string().min(1),
  expected_state_revision: z.number().int().nonnegative(),
  expected_previous_project_uuid: z.string().min(1).nullable(),
  expected_runtime_project_uuid: z.string().min(1),
  expected_geometry_fingerprint: hash,
  expected_reference_sha256: hash,
});

export const projectIdentityToolDocs: ToolSpec[] = [
  {
    name: "rebind_active_project_identity",
    description:
      "Safely synchronizes workspace metadata with the currently open canonical Blockbench project inside the existing Geometry session. It never modifies model Geometry and does not require a profile switch or reconnect.",
    annotations: {
      title: "Synchronize Active Project Identity",
      destructiveHint: true,
      openWorldHint: true,
    },
    parameters,
    status: STATUS_EXPERIMENTAL,
  },
];

function fs(): NativeFsLike {
  // @ts-ignore Blockbench runtime permission API.
  const value = requireNativeModule("fs", {
    message: "Project identity synchronization needs coordinated workspace metadata access.",
    optional: false,
  });
  if (!value) throw new Error("Filesystem access was denied.");
  return value as NativeFsLike;
}

function sha256(value: string | Buffer): string {
  // @ts-ignore Blockbench runtime permission API.
  const crypto = requireNativeModule("crypto", {
    message: "Project identity synchronization needs integrity verification.",
    optional: false,
  }) as {
    createHash(name: string): {
      update(value: string | Buffer): { digest(encoding: string): string };
    };
  };
  return crypto.createHash("sha256").update(value).digest("hex");
}

function geometryFingerprint(): string {
  return sha256(
    JSON.stringify(
      (Cube.all ?? [])
        .map((cube) => ({
          uuid: cube.uuid,
          name: cube.name,
          from: [...cube.from],
          to: [...cube.to],
          origin: [...cube.origin],
          rotation: [...cube.rotation],
          inflate: cube.inflate,
          parent:
            typeof cube.parent === "string" ? cube.parent : cube.parent?.uuid,
        }))
        .sort((a, b) => String(a.uuid).localeCompare(String(b.uuid)))
    )
  );
}

export function registerProjectIdentityTools(): void {
  createTool(
    projectIdentityToolDocs[0].name,
    {
      ...projectIdentityToolDocs[0],
      async execute(input) {
        if (!Project) throw new Error("PROJECT_IDENTITY_NO_ACTIVE_PROJECT");
        if (getProjectWriteLeaseSnapshot().status === "ACTIVE") {
          throw new Error("PROJECT_IDENTITY_LEASE_ACTIVE");
        }
        if (Project.uuid !== input.expected_runtime_project_uuid) {
          throw new Error("PROJECT_IDENTITY_RUNTIME_MISMATCH");
        }
        if (input.expected_previous_project_uuid && Project.uuid === input.expected_previous_project_uuid) {
          throw new Error("PROJECT_IDENTITY_ALREADY_CURRENT");
        }

        const fileSystem = fs();
        const root = input.session_root.replace(/[\\/]$/, "");
        const statePath = `${root}/state.json`;
        const projectPath = `${root}/project.json`;
        for (const path of [statePath, projectPath]) {
          assertInsideRoot(path, input.session_root);
        }

        const state = readJsonFile<Record<string, any>>(fileSystem, statePath);
        const metadata = readJsonFile<Record<string, any>>(
          fileSystem,
          projectPath
        );
        if (state.state_revision !== input.expected_state_revision) {
          throw new Error("STATE_REVISION_MISMATCH");
        }
        if (
          state.asset?.id !== input.asset_id ||
          metadata.asset_id !== input.asset_id
        ) {
          throw new Error("PROJECT_IDENTITY_STATE_MISMATCH");
        }
        if (
          state.project?.uuid !== input.expected_previous_project_uuid ||
          metadata.project?.uuid !== input.expected_previous_project_uuid
        ) {
          throw new Error("PROJECT_IDENTITY_STATE_MISMATCH");
        }
        if (
          (state.project?.name !== null && Project.name !== state.project?.name) ||
          Project.name !== metadata.asset_id
        ) {
          throw new Error("PROJECT_IDENTITY_STATE_MISMATCH");
        }
        if (
          Project.format?.id !== state.project?.format ||
          Project.format?.id !== metadata.project?.format
        ) {
          throw new Error("PROJECT_IDENTITY_STATE_MISMATCH");
        }

        const runtimePath = normalizePathForCompare(
          (Project as unknown as { save_path?: string }).save_path ?? ""
        );
        const canonicalPath = normalizePathForCompare(
          metadata.paths?.model ?? state.project?.save_path ?? ""
        );
        if (
          !runtimePath ||
          !canonicalPath ||
          !runtimePath.endsWith(canonicalPath)
        ) {
          throw new Error("PROJECT_IDENTITY_SAVE_PATH_MISMATCH");
        }

        const manifestPath = `${root}/references/reference_manifest.json`;
        assertInsideRoot(manifestPath, input.session_root);
        const manifest = readJsonFile<Record<string, any>>(
          fileSystem,
          manifestPath
        );
        const visualPath = `${root}/references/${manifest.reference_visual_lock?.filename}`;
        assertInsideRoot(visualPath, input.session_root);
        const referenceHash = sha256(fileSystem.readFileSync(visualPath));
        if (
          referenceHash !==
            String(manifest.reference_visual_lock?.sha256 ?? "").toLowerCase() ||
          referenceHash !== input.expected_reference_sha256.toLowerCase()
        ) {
          throw new Error("PROJECT_IDENTITY_REFERENCE_MISMATCH");
        }

        const fingerprint = geometryFingerprint();
        if (
          fingerprint !== input.expected_geometry_fingerprint.toLowerCase()
        ) {
          throw new Error("PROJECT_IDENTITY_FINGERPRINT_MISMATCH");
        }

        const previous = input.expected_previous_project_uuid;
        const nextRevision = input.expected_state_revision + 1;
        const audit = {
          operation: "rebind_active_project_identity",
          previous_uuid: previous,
          new_uuid: Project.uuid,
          state_revision_before: input.expected_state_revision,
          state_revision_after: nextRevision,
          geometry_fingerprint: fingerprint,
          reference_visual_sha256: referenceHash,
          canonical_model_path: metadata.paths.model,
          timestamp: new Date().toISOString(),
        };

        state.project.uuid = Project.uuid;
        state.project.name = Project.name;
        state.state_revision = nextRevision;
        state.project_identity_audit = [
          ...(state.project_identity_audit ?? []),
          audit,
        ];
        metadata.project.uuid = Project.uuid;
        metadata.project_identity_audit = [
          ...(metadata.project_identity_audit ?? []),
          audit,
        ];

        writeJsonFilesAtomically(fileSystem, [
          { path: statePath, value: state },
          { path: projectPath, value: metadata },
        ]);

        return {
          content: [
            {
              type: "text",
              text: `Project identity synchronized from ${previous} to ${Project.uuid}. Continue in the current Geometry session.`,
            },
          ],
          structuredContent: {
            status: "PASS",
            previous_uuid: previous,
            new_uuid: Project.uuid,
            new_state_revision: nextRevision,
            project_identity_status: "CURRENT",
            reconnect_required: false,
            profile_switch_required: false,
            lease_acquisition_required: true,
            model_geometry_changed: false,
          },
        };
      },
    },
    projectIdentityToolDocs[0].status
  );
}

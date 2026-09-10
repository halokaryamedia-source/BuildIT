from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]
p = ROOT / 'mcp/server/resources.ts'
s = p.read_text()

# Remove retired specialized imports if the earlier cleanup has not already done so.
s = re.sub(
    r'import \{\n  isBlockItThreeDAssistedReference,.*?\n\} from "@/server/tools/project";\n',
    '',
    s,
    flags=re.S,
)

marker = '/**\n * Conditionally registers the reference_models resource at plugin runtime.'
idx = s.find(marker)
if idx < 0:
    raise SystemExit('reference_models function marker not found')

replacement = r'''/**
 * Conditionally registers the reference_models resource at plugin runtime.
 * The Plugins global must never be read at module scope so this module stays
 * import-safe for Bun tests and docs generation.
 */
export function registerReferenceModelsResource(): void {
  if (resources["reference_models"]) return;
  if (
    !Plugins.installed.some((plugin: { id: string }) => plugin.id === "reference_models")
  ) {
    return;
  }

  createResource("reference_models", {
    uriTemplate: "reference-models://{id}",
    title: "Reference Models",
    description:
      "Returns information about reference models in the current Blockbench project. Requires the Reference Models plugin. List URIs use the slugified name when unique, with a UUID-prefix suffix on collision. Reads also accept the raw UUID or exact name.",
    async listCallback() {
      const elements = Outliner?.elements ?? [];
      const referenceModels = elements.filter(
        (element) => element.type === "reference_model"
      );
      if (referenceModels.length === 0) return { resources: [] };

      return {
        resources: referenceModels.map((model) => ({
          uri: makeResourceUri("reference-models", model, referenceModels),
          name: model.name || model.uuid,
          description: (model as { path?: string }).path
            ? `Reference model from ${(model as { path?: string }).path}`
            : "Reference model",
          mimeType: "application/json",
        })),
      };
    },
    async readCallback(uri, { id }) {
      const elements = Outliner?.elements ?? [];
      const referenceModels = elements.filter(
        (element) => element.type === "reference_model"
      );

      if (referenceModels.length === 0) {
        if (id) throw new Error(`Reference model with ID "${id}" not found.`);
        return {
          contents: [
            {
              uri: uri.href,
              text: JSON.stringify({ referenceModels: [], count: 0 }),
              mimeType: "application/json",
            },
          ],
        };
      }

      const normalizeVec3 = (
        value: unknown,
        defaultValue: [number, number, number]
      ): [number, number, number] => {
        if (!value) return defaultValue;
        if (Array.isArray(value) && value.length >= 3) {
          return [Number(value[0]), Number(value[1]), Number(value[2])];
        }
        if (
          typeof value === "object" &&
          "x" in value &&
          "y" in value &&
          "z" in value
        ) {
          const vector = value as { x: number; y: number; z: number };
          return [Number(vector.x), Number(vector.y), Number(vector.z)];
        }
        return defaultValue;
      };

      const getReferenceModelInfo = (model: OutlinerElement) => {
        const reference = model as OutlinerElement & {
          path?: string;
          origin?: unknown;
          rotation?: unknown;
          scale?: unknown;
          visibility?: boolean;
          wireframe?: boolean;
          locked?: boolean;
          export?: boolean;
          mesh?: { children?: unknown[] };
        };
        return {
          uuid: reference.uuid,
          name: reference.name,
          path: reference.path || null,
          origin: normalizeVec3(reference.origin, [0, 0, 0]),
          rotation: normalizeVec3(reference.rotation, [0, 0, 0]),
          scale: normalizeVec3(reference.scale, [1, 1, 1]),
          visibility: reference.visibility ?? true,
          wireframe: reference.wireframe ?? false,
          locked: reference.locked ?? false,
          export: reference.export !== false,
          loaded: Boolean(reference.mesh?.children?.length),
        };
      };

      if (id) {
        const model = findByResourceId(referenceModels, id);
        if (!model) {
          throw new Error(`Reference model with ID "${id}" not found.`);
        }
        return {
          contents: [
            {
              uri: uri.href,
              text: JSON.stringify(getReferenceModelInfo(model)),
              mimeType: "application/json",
            },
          ],
        };
      }

      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify({
              referenceModels: referenceModels.map(getReferenceModelInfo),
              count: referenceModels.length,
            }),
            mimeType: "application/json",
          },
        ],
      };
    },
  });
}
'''

p.write_text(s[:idx] + replacement)

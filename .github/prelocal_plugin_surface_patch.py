from pathlib import Path

ROOT = Path.cwd()


def read(path: str) -> str:
    return (ROOT / path).read_text()


def write(path: str, content: str) -> None:
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content.rstrip() + "\n")


def replace_once(path: str, old: str, new: str) -> None:
    text = read(path)
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{path}: expected exactly one marker, found {count}: {old[:120]!r}")
    write(path, text.replace(old, new, 1))


replace_once(
    "mcp/build/index.ts",
    'const entryFile = resolve("./index.ts");',
    '''const entryFile = resolve("./index.ts");

function resolveBuildRevision(): string {
  const githubSha = process.env.GITHUB_SHA?.trim();
  if (githubSha) return githubSha.slice(0, 12);

  try {
    const result = Bun.spawnSync({
      cmd: ["git", "rev-parse", "--short=12", "HEAD"],
      stdout: "pipe",
      stderr: "ignore",
    });
    if (result.exitCode === 0) {
      const revision = new TextDecoder().decode(result.stdout).trim();
      if (revision) return revision;
    }
  } catch {
    // Source archives or constrained build environments may not have git.
  }

  return "local";
}

const buildRevision = resolveBuildRevision();
const buildChannel = process.env.BLOCKIT_BUILD_CHANNEL?.trim() || "Local";''',
)

replace_once(
    "mcp/build/index.ts",
    '''      "process.env.NODE_ENV": isProduction ? '\"production\"' : '\"development\"',
      __DEV__: isProduction ? "false" : "true",''',
    '''      "process.env.NODE_ENV": isProduction ? '\"production\"' : '\"development\"',
      __DEV__: isProduction ? "false" : "true",
      __BLOCKIT_BUILD_REVISION__: JSON.stringify(buildRevision),
      __BLOCKIT_BUILD_CHANNEL__: JSON.stringify(buildChannel),''',
)

write(
    "mcp/lib/productIdentity.ts",
    '''import { VERSION } from "@/lib/constants";
import type { McpRegistrationProfile } from "@/lib/registrationProfile";

declare const __BLOCKIT_BUILD_REVISION__: string;
declare const __BLOCKIT_BUILD_CHANNEL__: string;

export const PRODUCT_ID = "blockit-bedrock-entity-mcp";
export const PRODUCT_NAME = "BlockIT — Bedrock Entity MCP";
export const PRODUCT_DESCRIPTION =
  "Minecraft Bedrock Entity-focused MCP server for Blockbench.";
export const PRODUCT_REPOSITORY =
  "https://github.com/halokaryamedia-source/BuildIT";
export const PRODUCT_BUG_TRACKER = `${PRODUCT_REPOSITORY}/issues`;
export const PRODUCT_VERSION = VERSION;

export const PRODUCT_BUILD_REVISION =
  typeof __BLOCKIT_BUILD_REVISION__ !== "undefined"
    ? __BLOCKIT_BUILD_REVISION__
    : "source";

export const PRODUCT_BUILD_CHANNEL =
  typeof __BLOCKIT_BUILD_CHANNEL__ !== "undefined"
    ? __BLOCKIT_BUILD_CHANNEL__
    : "source";

export function createProductIdentity(profile: McpRegistrationProfile) {
  return {
    id: PRODUCT_ID,
    name: PRODUCT_NAME,
    version: PRODUCT_VERSION,
    build_channel: PRODUCT_BUILD_CHANNEL,
    build_revision: PRODUCT_BUILD_REVISION,
    profile,
    repository: PRODUCT_REPOSITORY,
  } as const;
}''',
)

write(
    "mcp/lib/surfaceManifest.ts",
    '''import type { IMCPPrompt, IMCPResource, IMCPTool } from "@/types";
import type { McpRegistrationProfile } from "@/lib/registrationProfile";

function sortedNames(values: Array<{ name: string }>): string[] {
  return values.map((value) => value.name).sort((a, b) => a.localeCompare(b));
}

export function createSurfaceManifest({
  profile,
  tools,
  resources,
  prompts,
}: {
  profile: McpRegistrationProfile;
  tools: Record<string, IMCPTool>;
  resources: Record<string, IMCPResource>;
  prompts: Record<string, IMCPPrompt>;
}) {
  const toolCatalog = Object.values(tools);
  const exposedTools = toolCatalog.filter((tool) => tool.enabled);
  const disabledTools = toolCatalog.filter((tool) => !tool.enabled);
  const promptCatalog = Object.values(prompts);
  const exposedPrompts = promptCatalog.filter((prompt) => prompt.enabled);
  const disabledPrompts = promptCatalog.filter((prompt) => !prompt.enabled);
  const availableResources = Object.values(resources);

  return {
    profile,
    tools: {
      exposed_count: exposedTools.length,
      disabled_count: disabledTools.length,
      catalog_count: toolCatalog.length,
      exposed: sortedNames(exposedTools),
      disabled: sortedNames(disabledTools),
    },
    resources: {
      available_count: availableResources.length,
      available: sortedNames(availableResources),
    },
    prompts: {
      exposed_count: exposedPrompts.length,
      disabled_count: disabledPrompts.length,
      catalog_count: promptCatalog.length,
      exposed: sortedNames(exposedPrompts),
      disabled: sortedNames(disabledPrompts),
    },
  } as const;
}''',
)

replace_once(
    "mcp/index.ts",
    'import { VERSION } from "@/lib/constants";',
    '''import { VERSION } from "@/lib/constants";
import {
  PRODUCT_BUG_TRACKER,
  PRODUCT_DESCRIPTION,
  PRODUCT_NAME,
  PRODUCT_REPOSITORY,
} from "@/lib/productIdentity";''',
)
replace_once(
    "mcp/index.ts",
    '''  title: "MCP Server",
  author: "Jason J. Gardner",
  contributors: ["jasonjgardner", "brokestar233"],
  description: "Create an MCP server inside Blockbench.",
  tags: ["MCP", "AI"],
  website: "https://jasonjgardner.github.io/blockbench-mcp-plugin/",
  repository: "https://github.com/jasonjgardner/blockbench-mcp-plugin",
  bug_tracker: "https://github.com/jasonjgardner/blockbench-mcp-plugin/issues",''',
    '''  title: PRODUCT_NAME,
  author: "Halo Karya Media",
  contributors: ["jasonjgardner", "brokestar233"],
  description: PRODUCT_DESCRIPTION,
  tags: ["MCP", "AI", "Minecraft", "Bedrock"],
  website: PRODUCT_REPOSITORY,
  repository: PRODUCT_REPOSITORY,
  bug_tracker: PRODUCT_BUG_TRACKER,''',
)
replace_once(
    "mcp/index.ts",
    '''    registerMcpProfile(
      resolveMcpRegistrationProfile(
        Settings.get(MCP_EXTENDED_FAMILIES_SETTING_ID)
      )
    );''',
    '''    const registrationProfile = resolveMcpRegistrationProfile(
      Settings.get(MCP_EXTENDED_FAMILIES_SETTING_ID)
    );
    registerMcpProfile(registrationProfile);''',
)
replace_once(
    "mcp/index.ts",
    '''      endpoint: String(Settings.get("mcp_endpoint") || "/bb-mcp"),
      host: "127.0.0.1",
    });''',
    '''      endpoint: String(Settings.get("mcp_endpoint") || "/bb-mcp"),
      host: "127.0.0.1",
      profile: registrationProfile,
    });''',
)
replace_once(
    "mcp/index.ts",
    '''      tools,
      resources,
      prompts,
    });''',
    '''      tools,
      resources,
      prompts,
      profile: registrationProfile,
    });''',
)
replace_once("mcp/index.ts", 'Blockbench.showQuickMessage("Installed MCP Server plugin", 2000);', 'Blockbench.showQuickMessage("Installed BlockIT Bedrock Entity MCP", 2000);')
replace_once("mcp/index.ts", 'Blockbench.showQuickMessage("Uninstalled MCP Server plugin", 2000);', 'Blockbench.showQuickMessage("Uninstalled BlockIT Bedrock Entity MCP", 2000);')
replace_once("mcp/ui/settings.ts", '"Generate simple, low-poly models for Minecraft inside Blockbench.",', '"Create or revise Minecraft Bedrock Entity models with explicit Cube/Group structure and evidence-backed visual checks.",')

replace_once(
    "mcp/ui/index.ts",
    'import { VERSION } from "@/lib/constants";',
    '''import { VERSION } from "@/lib/constants";
import type { McpRegistrationProfile } from "@/lib/registrationProfile";
import {
  PRODUCT_BUILD_CHANNEL,
  PRODUCT_BUILD_REVISION,
  PRODUCT_NAME,
  PRODUCT_REPOSITORY,
} from "@/lib/productIdentity";
import { createSurfaceManifest } from "@/lib/surfaceManifest";''',
)
replace_once(
    "mcp/ui/index.ts",
    '''  prompts,
}: {
  tools: Record<string, IMCPTool>;
  resources: Record<string, IMCPResource>;
  prompts: Record<string, IMCPPrompt>;
}) {
  Blockbench.addCSS(panelCSS);''',
    '''  prompts,
  profile,
}: {
  tools: Record<string, IMCPTool>;
  resources: Record<string, IMCPResource>;
  prompts: Record<string, IMCPPrompt>;
  profile: McpRegistrationProfile;
}) {
  const surface = createSurfaceManifest({ profile, tools, resources, prompts });
  Blockbench.addCSS(panelCSS);''',
)
replace_once(
    "mcp/ui/index.ts",
    '''        server: {
          name: "Blockbench MCP",
          version: VERSION,
          transport: "Streamable HTTP (stateless)",
        },''',
    '''        server: {
          name: PRODUCT_NAME,
          version: VERSION,
          repositoryUrl: PRODUCT_REPOSITORY,
          build: PRODUCT_BUILD_REVISION,
          channel: PRODUCT_BUILD_CHANNEL,
          profile,
          endpoint: `127.0.0.1:${Settings.get("mcp_port") || 3000}${Settings.get("mcp_endpoint") || "/bb-mcp"}`,
          transport: "Streamable HTTP (stateless JSON)",
        },
        surface,''',
)
replace_once("mcp/ui/index.ts", '''        toolsFilter: {
          search: "",
          showExperimental: true,
        },''', '''        toolsFilter: {
          search: "",
          showExperimental: true,
          showDisabled: false,
        },''')
replace_once("mcp/ui/index.ts", '''        promptsFilter: {
          search: "",
          showExperimental: true,
        },''', '''        promptsFilter: {
          search: "",
          showExperimental: true,
          showDisabled: false,
        },''')
replace_once("mcp/ui/index.ts", '''          return tools.filter((tool: { name: string; status: string }) => {
            if (tool.status === "experimental" && !toolsFilter.showExperimental) return false;''', '''          return tools.filter((tool: { name: string; status: string; enabled: boolean }) => {
            if (!tool.enabled && !toolsFilter.showDisabled) return false;
            if (tool.status === "experimental" && !toolsFilter.showExperimental) return false;''')
replace_once("mcp/ui/index.ts", '''          return prompts.filter((prompt: { name: string; status: string }) => {
            if (prompt.status === "experimental" && !promptsFilter.showExperimental) return false;''', '''          return prompts.filter((prompt: { name: string; status: string; enabled: boolean }) => {
            if (!prompt.enabled && !promptsFilter.showDisabled) return false;
            if (prompt.status === "experimental" && !promptsFilter.showExperimental) return false;''')

replace_once("mcp/ui/panel.html", '''            <dd><a href="https://github.com/jasonjgardner/blockbench-mcp-plugin/releases/" target="_blank"
                    rel="noopener noreferrer">{{server.version}}</a>
            </dd>
            <dt>Transport</dt>
            <dd>{{server.transport}}</dd>''', '''            <dd><a :href="server.repositoryUrl" target="_blank"
                    rel="noopener noreferrer">{{server.version}}</a>
            </dd>
            <dt>Build</dt>
            <dd>{{server.channel}} @ {{server.build}}</dd>
            <dt>Profile</dt>
            <dd>{{server.profile}}</dd>
            <dt>Endpoint</dt>
            <dd>{{server.endpoint}}</dd>
            <dt>Transport</dt>
            <dd>{{server.transport}}</dd>''')
replace_once("mcp/ui/panel.html", "<summary>{{tl('mcp.panel.tools')}} ({{filteredTools.length}}/{{tools.length}})</summary>", "<summary>{{tl('mcp.panel.tools')}} ({{surface.tools.exposed_count}} exposed / {{surface.tools.catalog_count}} catalog)</summary>")
replace_once("mcp/ui/panel.html", '''            <label class="filter-switch">
                <input type="checkbox" v-model="toolsFilter.showExperimental">
                <span class="switch-slider"></span>
                <span class="switch-label">{{tl('mcp.filter.show_experimental')}}</span>
            </label>''', '''            <label class="filter-switch">
                <input type="checkbox" v-model="toolsFilter.showExperimental">
                <span class="switch-slider"></span>
                <span class="switch-label">{{tl('mcp.filter.show_experimental')}}</span>
            </label>
            <label class="filter-switch">
                <input type="checkbox" v-model="toolsFilter.showDisabled">
                <span class="switch-slider"></span>
                <span class="switch-label">Show disabled</span>
            </label>''')
replace_once("mcp/ui/panel.html", '''            <div v-for="tool in filteredTools" :key="tool.name" class="tool-toggle-row clickable"
                @click="openToolTest(tool.name)" :title="tl('mcp.tooltip.click_to_test', [getDisplayName(tool.name)])">''', '''            <div v-for="tool in filteredTools" :key="tool.name" class="tool-toggle-row"
                :class="{ clickable: tool.enabled, disabled: !tool.enabled }"
                @click="tool.enabled && openToolTest(tool.name)"
                :title="tool.enabled ? tl('mcp.tooltip.click_to_test', [getDisplayName(tool.name)]) : 'Disabled tools are not executable from the BlockIT panel.'">''')
replace_once("mcp/ui/panel.html", '''                        <span v-if="tool.status === 'experimental'" class="tool-status experimental" :title="tl('mcp.status.experimental_tooltip')"></span>
                    </div>''', '''                        <span v-if="tool.status === 'experimental'" class="tool-status experimental" :title="tl('mcp.status.experimental_tooltip')"></span>
                        <span v-if="!tool.enabled" class="surface-badge disabled">disabled</span>
                    </div>''')
replace_once("mcp/ui/panel.html", "<summary>{{tl('mcp.panel.resources')}} ({{filteredResources.length}}/{{resources.length}})</summary>", "<summary>{{tl('mcp.panel.resources')}} ({{surface.resources.available_count}} available)</summary>")
replace_once("mcp/ui/panel.html", "<summary>{{tl('mcp.panel.prompts')}} ({{filteredPrompts.length}}/{{prompts.length}})</summary>", "<summary>{{tl('mcp.panel.prompts')}} ({{surface.prompts.exposed_count}} exposed / {{surface.prompts.catalog_count}} catalog)</summary>")
replace_once("mcp/ui/panel.html", '''            <label class="filter-switch">
                <input type="checkbox" v-model="promptsFilter.showExperimental">
                <span class="switch-slider"></span>
                <span class="switch-label">{{tl('mcp.filter.show_experimental')}}</span>
            </label>''', '''            <label class="filter-switch">
                <input type="checkbox" v-model="promptsFilter.showExperimental">
                <span class="switch-slider"></span>
                <span class="switch-label">{{tl('mcp.filter.show_experimental')}}</span>
            </label>
            <label class="filter-switch">
                <input type="checkbox" v-model="promptsFilter.showDisabled">
                <span class="switch-slider"></span>
                <span class="switch-label">Show disabled</span>
            </label>''')
replace_once("mcp/ui/panel.html", '''            <div v-for="prompt in filteredPrompts" :key="prompt.name" class="tool-toggle-row clickable"
                @click="openPromptPreview(prompt.name)"
                :title="tl('mcp.tooltip.click_to_preview', [getDisplayName(prompt.name)])">''', '''            <div v-for="prompt in filteredPrompts" :key="prompt.name" class="tool-toggle-row"
                :class="{ clickable: prompt.enabled, disabled: !prompt.enabled }"
                @click="prompt.enabled && openPromptPreview(prompt.name)"
                :title="prompt.enabled ? tl('mcp.tooltip.click_to_preview', [getDisplayName(prompt.name)]) : 'Disabled prompts are not exposed through MCP.'">''')
replace_once("mcp/ui/panel.html", '''                        <span v-if="prompt.status === 'experimental'" class="tool-status experimental" :title="tl('mcp.status.experimental_tooltip')"></span>
                        <span v-if="isPromptOverridden(prompt.name)" style="''', '''                        <span v-if="prompt.status === 'experimental'" class="tool-status experimental" :title="tl('mcp.status.experimental_tooltip')"></span>
                        <span v-if="!prompt.enabled" class="surface-badge disabled">disabled</span>
                        <span v-if="prompt.enabled && isPromptOverridden(prompt.name)" style="''')
replace_once("mcp/ui/panel.html", '<div @click.stop style="display: flex; align-items: center; padding-left: 4px;">', '<div v-if="prompt.enabled" @click.stop style="display: flex; align-items: center; padding-left: 4px;">')

replace_once("mcp/ui/panel.css", '''    .tool-toggle-row.clickable:active {
        background-color: var(--color-accent);
    }
''', '''    .tool-toggle-row.clickable:active {
        background-color: var(--color-accent);
    }

    .tool-toggle-row.disabled {
        opacity: 0.58;
    }

    .surface-badge {
        display: inline-block;
        margin-left: 6px;
        padding: 1px 4px;
        border: 1px solid var(--color-border);
        border-radius: 3px;
        color: var(--color-subtle_text);
        font-size: 9px;
        font-weight: normal;
        line-height: 1.2;
        vertical-align: middle;
    }
''')

replace_once("mcp/ui/toolTestDialog.ts", 'import { getAllToolDefinitions } from "@/lib/factories";', 'import { getAllToolDefinitions, tools } from "@/lib/factories";')
replace_once("mcp/ui/toolTestDialog.ts", '''  if (!toolDef) {
    Blockbench.showQuickMessage(tl("mcp.dialog.tool_not_found", [toolName]), 2000);
    return;
  }

  currentDialog?.hide();''', '''  if (!toolDef) {
    Blockbench.showQuickMessage(tl("mcp.dialog.tool_not_found", [toolName]), 2000);
    return;
  }

  if (!tools[toolName]?.enabled) {
    Blockbench.showQuickMessage(
      `Tool "${toolName}" is disabled and cannot be executed from the BlockIT panel.`,
      2500
    );
    return;
  }

  currentDialog?.hide();''')
replace_once("mcp/ui/toolTestDialog.ts", '''    try {
      const result = await toolDef.execute(args);''', '''    try {
      if (!tools[toolName]?.enabled) {
        throw new Error(`Tool "${toolName}" is disabled.`);
      }
      const validatedArgs = await toolDef.parameterSchema.parseAsync(args);
      const result = await toolDef.execute(validatedArgs);''')

replace_once("mcp/ui/promptPreviewDialog.ts", 'import { getAllPromptDefinitions } from "@/lib/factories";', 'import { getAllPromptDefinitions, prompts } from "@/lib/factories";')
replace_once("mcp/ui/promptPreviewDialog.ts", '''  if (!promptDef) {
    Blockbench.showQuickMessage(tl("mcp.dialog.prompt_not_found", [promptName]), 2000);
    return;
  }

  // Close any existing dialog''', '''  if (!promptDef) {
    Blockbench.showQuickMessage(tl("mcp.dialog.prompt_not_found", [promptName]), 2000);
    return;
  }

  if (!prompts[promptName]?.enabled) {
    Blockbench.showQuickMessage(
      `Prompt "${promptName}" is disabled and is not exposed through MCP.`,
      2500
    );
    return;
  }

  // Close any existing dialog''')

replace_once("mcp/server/net.ts", "import { createServer as createMcpServer } from '@/server/server'", '''import { createServer as createMcpServer } from '@/server/server'
import {
  DEFAULT_MCP_REGISTRATION_PROFILE,
  type McpRegistrationProfile
} from '@/lib/registrationProfile'
import { createProductIdentity } from '@/lib/productIdentity' ''')
replace_once("mcp/server/net.ts", '''    port,
    endpoint,
    host = '127.0.0.1'
  }: {
    endpoint: string
    port: number
    host?: string
  }
): NetServer {''', '''    port,
    endpoint,
    host = '127.0.0.1',
    profile = DEFAULT_MCP_REGISTRATION_PROFILE
  }: {
    endpoint: string
    port: number
    host?: string
    profile?: McpRegistrationProfile
  }
): NetServer {''')
replace_once("mcp/server/net.ts", '''                status: 'ok',
                timestamp: new Date().toISOString(),
                transport: {''', '''                status: 'ok',
                timestamp: new Date().toISOString(),
                product: createProductIdentity(profile),
                transport: {''')

write("mcp/README.md", '''# BlockIT — Bedrock Entity MCP

BlockIT is a Minecraft **Bedrock Entity-focused** MCP server that runs inside the desktop version of Blockbench. The default product surface preserves native/relevant Bedrock Entity capabilities while generic Blockbench fallback families remain outside the normal profile.

## Current development source

Repository: `halokaryamedia-source/BuildIT`  
Working branch for this stabilization line: `Local`

Do **not** use the upstream hosted `jasonjgardner.github.io/.../mcp.js` URL when validating BlockIT. That URL installs a different upstream product surface and cannot prove the behavior of this repository.

### Build and load the Local plugin

```bash
git checkout Local
cd mcp
bun install --frozen-lockfile
bun run build
```

Load the generated `mcp/dist/mcp.js` as a local Blockbench plugin. The BlockIT panel displays the product name, version, build channel/revision, active registration profile, endpoint, and transport so the loaded artifact can be identified before runtime acceptance.

## MCP endpoint

Default local endpoint:

```text
http://127.0.0.1:3000/bb-mcp
```

The server binds to loopback and uses request-owned stateless Streamable HTTP with JSON responses. Configure MCP clients to connect directly to that URL when they support Streamable HTTP.

Settings are under Blockbench **Settings → General**:

- MCP Server Port
- MCP Server Endpoint
- Optional prompt CDN fallback (off by default)
- Extended MCP Families (off by default)

The Extended toggle exposes only source-preserved generic fallback families; individually quarantined tools such as `risky_eval` and `from_geo_json` remain disabled.

## Product boundary

Normal BlockIT work targets Minecraft Bedrock Entity projects (`bedrock`). The trusted path centers on Cube/Cuboid geometry, Group/bone hierarchy, deterministic inspection/canonical views, Bedrock texture/paint/PBR/material-instance capability, Bedrock animation/BoneAnimator capability, undo/history, and current-format export outcomes.

Native Bedrock capabilities must not be removed merely to reduce tool count. See the capability surface audit/matrix under `docs/knowledge/reviews/` before narrowing any family.

## Surface truth

The Blockbench panel distinguishes **exposed** tools/prompts from disabled catalog entries. Resources are reported as **available** for the current runtime. Disabled tool definitions are not executable through the panel test dialog.

## Verification

```bash
bun run typecheck
bun run test
bun run build
bun run docs:check
```

Local stateless transport smoke harness (requires the current BlockIT plugin running in Blockbench):

```bash
bun run verify:stateless-local
```

## Agent skills

The upstream `jasonjgardner/blockbench-mcp-project` skills are useful historical/reference material, but they describe a broader generic Blockbench MCP including Mesh, Hytale, risky evaluation, and other paths that are not the normal BlockIT Bedrock Entity workflow. Do not install them as the canonical BlockIT orchestration layer without adaptation.

A BlockIT-specific skill pack is a separate pre-local hardening step and should be generated from the current capability matrix and actual MCP contract.

## Upstream attribution

BlockIT's MCP implementation is derived from the open-source Blockbench MCP work by Jason J. Gardner and contributors. Upstream attribution and the repository license remain preserved; BlockIT product identity distinguishes this Bedrock-focused fork from the upstream hosted plugin.''')

write("mcp/about.md", '''## BlockIT — Bedrock Entity MCP

BlockIT provides a Minecraft **Bedrock Entity-focused** Model Context Protocol server inside desktop Blockbench.

### Default endpoint

`http://127.0.0.1:3000/bb-mcp`

The default transport is loopback-only, stateless Streamable HTTP with JSON responses. The BlockIT panel shows the loaded version, build revision/channel, active profile, endpoint, and truthful exposed surface counts.

### Product boundary

The normal profile is `bedrock_entity`. It preserves capability that genuinely belongs to Minecraft Bedrock Entity while broad generic Blockbench fallback families are not exposed by default. Native Bedrock capability is not removed merely to minimize the surface.

The panel distinguishes exposed tools/prompts from disabled catalog entries, and disabled definitions cannot be executed through the panel's Tool Test path.

### Local development builds

For this stabilization line, build `halokaryamedia-source/BuildIT` branch `Local` and load the generated `mcp/dist/mcp.js`. Do not use the upstream hosted plugin URL as evidence for BlockIT runtime behavior; it is a different artifact/product surface.

### Expectations

AI-assisted modeling remains human-in-the-loop. Tool success, valid coordinates, a validator pass, or a screenshot call succeeding are not proof that a model visually matches its reference. BlockIT's Bedrock workflow uses explicit inspection, bounded corrections, canonical views, and fresh visual comparison.

### Upstream attribution

This implementation is derived from Jason J. Gardner's open-source Blockbench MCP project and retains upstream attribution/license information while presenting a distinct BlockIT Bedrock Entity product identity.''')

write("docs/knowledge/reviews/bedrock-entity-capability-surface-matrix.md", '''# Bedrock Entity Capability Surface Matrix

Updated: 2026-08-10

## Purpose

This matrix connects the official Blockbench Bedrock Entity capability audit to the current BlockIT MCP product surface. It is a deletion guardrail: **a missing or partial MCP mapping is a capability gap to investigate, not evidence that the native Bedrock capability may be removed.**

Primary evidence owners:

- `docs/knowledge/reviews/bedrock-entity-capability-surface-audit.md`
- official Blockbench Bedrock format: `js/formats/bedrock/bedrock.js`
- official Blockbench Bedrock animation format: `js/formats/bedrock/bedrock_animation.js`
- current registration truth: `mcp/lib/registrationProfile.ts`
- current tool/resource/prompt definitions under `mcp/server/`

## Matrix

| Bedrock Entity capability | Current BlockIT mapping | Surface status | Guardrail / next audit |
|---|---|---|---|
| Project format/orientation | `create_project`, `get_project_info` | **Mapped** | Normal project format is `bedrock`; later narrowing should prevent arbitrary format drift without removing Bedrock project creation. |
| Cube/Cuboid geometry | `place_cube`, `modify_cube`, `modify_cubes_batch`, `inspect_element`, `list_outline`, targeted find/filter tools | **Strong mapping** | Keep explicit geometry + UUID-first mutation ownership. |
| Group hierarchy / bones | `add_group`, `bone_rigging`, `list_outline`, `inspect_element` | **Strong mapping** | Groups are Bedrock bones/organization; preserve pivot and parent semantics. |
| Cube face UV / box UV / UV rotation | Cube face/UV fields in Cube tools + texture application | **Partial mapping** | Audit native `box_uv`, face UV rotation, mirror/offset semantics explicitly before any further UV reduction. Generic Mesh UV remains outside product scope. |
| Texture creation/application/read | `create_texture`, `apply_texture`, `list_textures`, `get_texture`, `textures://{id}` | **Mapped** | Keep identity-strict texture targeting. |
| Paint | Paint family | **Mapped, runtime-heavy** | Native Painter integration remains Bedrock-relevant; local Blockbench proof still required. |
| PBR / TextureGroup material workflows | texture/PBR family | **Mapped** | Preserve native Bedrock PBR support; audit individual generic file-path operations separately. |
| Per-face `material_instance` | `get_face_material_instances`, `set_face_material_instance`, `list_material_instances`, bulk set/clear | **Mapped** | Official Bedrock geometry codec preserves this field; do not remove as a Bedrock Block-only assumption. |
| Animation / BoneAnimator transforms | `create_animation`, `manage_keyframes`, graph/batch/copy tools, `inspect_animation` | **Mapped** | `create_animation` is explicitly bound to Bedrock AnimationCodec. |
| Particle animation effects | `create_animation.particle_effects`, `inspect_animation.effects` | **Mapped** | Preserve locator reference strings used by particle effects. |
| Sound animation effects | No dedicated current mapping confirmed | **MCP GAP — protected** | Audit official EffectAnimator/Bedrock animation codec before adding or consolidating. Do not delete native sound capability. |
| Timeline animation effects | No dedicated current mapping confirmed | **MCP GAP — protected** | Audit official EffectAnimator timeline channel before making animation family completeness claims. |
| Animation controllers | No dedicated authoring/inspection mapping confirmed | **MCP GAP — protected** | Native Bedrock format enables animation controllers; must remain a protected capability target. |
| Locators / NullObject locators | Particle effect schema can reference locator names, but direct locator authoring/inspection is not mapped | **MCP GAP — protected** | Native Bedrock codec parses/serializes locators. Add/inspect mapping only after official-source contract audit. |
| TextureMesh | No current direct authoring/inspection mapping | **MCP GAP — protected** | Distinct from generic Blockbench `Mesh`; native Bedrock codec support must not be confused with removed generic Mesh family. |
| Native Bedrock bounding-box fields | `inspect_model_bounds` provides rendered Cube observation, not native bounding-box authoring | **Partial / semantic distinction** | Do not claim `inspect_model_bounds` covers Bedrock bounding-box capability; audit format fields separately. |
| Animated textures | Texture metadata exposes frame information; dedicated authoring mapping not confirmed | **Partial / protected** | Native Bedrock format enables animated textures. Audit before surface reduction. |
| Bone binding expression | No dedicated current mapping confirmed | **MCP GAP — protected** | Native Bedrock format enables bone binding expressions; preserve as audit target. |
| Current-format Bedrock export | `list_export_formats`, `export_model` | **Available but broad** | Later audit should prefer current-format Bedrock outcomes while avoiding arbitrary-codec generic drift. |
| Undo / redo / checkpoints | history family | **Mapped** | Keep recoverability for bounded mutations. |
| Validator evidence | validator status/check/warning/error resources | **Mapped support evidence** | Text-to-element references are heuristic unless backed by direct object identity; do not present inferred links as authoritative. |
| Canonical visual observation | `capture_model_views`, `capture_screenshot`, `inspect_model_bounds` | **Mapped BlockIT workflow support** | Product evidence helpers, not proof of resemblance by themselves. |
| Reference Models plugin integration | conditional `reference_models://{id}` | **Optional external integration** | Not a native Bedrock capability and must not affect baseline capability counts. |

## Surface semantics

- **Exposed** — currently registered through MCP and callable by a client.
- **Disabled** — definition may exist in the loaded source profile but is not callable through MCP or the BlockIT panel test path.
- **Available resource** — resource actually registered for the current Blockbench runtime; conditional integrations may change this count.
- **Catalog** — known metadata/definitions in the loaded plugin; catalog count is not an MCP exposure count.
- **MCP GAP — protected** — official native Bedrock capability whose current MCP authoring/inspection mapping is incomplete or unproven. It must not be removed from the product boundary.

## Immediate follow-up

Use this matrix to audit remaining broad semantics inside retained families: arbitrary project-format creation, arbitrary codec enumeration/export, generic camera/app UI helpers, generic resource object dumps, and Bedrock prompt/skill coverage for protected gaps. Do not start deletion from tool names alone; trace every proposed reduction through official Blockbench Bedrock source first.''')

write("mcp/tests/prelocal-plugin-surface.test.ts", '''import { describe, expect, test } from "bun:test";
import { createSurfaceManifest } from "@/lib/surfaceManifest";
import { PRODUCT_NAME, PRODUCT_REPOSITORY } from "@/lib/productIdentity";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("pre-local BlockIT plugin surface hardening", () => {
  test("surface manifest distinguishes exposed/disabled/catalog entries deterministically", () => {
    const manifest = createSurfaceManifest({
      profile: "bedrock_entity",
      tools: {
        exposed_b: { name: "exposed_b", description: "", enabled: true, status: "stable" },
        disabled_a: { name: "disabled_a", description: "", enabled: false, status: "experimental" },
        exposed_a: { name: "exposed_a", description: "", enabled: true, status: "stable" },
      },
      resources: {
        texture: { name: "texture", description: "", uriTemplate: "textures://{id}" },
      },
      prompts: {
        disabled_prompt: { name: "disabled_prompt", description: "", arguments: [], enabled: false, status: "stable" },
        bedrock_prompt: { name: "bedrock_prompt", description: "", arguments: [], enabled: true, status: "stable" },
      },
    });

    expect(manifest.tools).toEqual({
      exposed_count: 2,
      disabled_count: 1,
      catalog_count: 3,
      exposed: ["exposed_a", "exposed_b"],
      disabled: ["disabled_a"],
    });
    expect(manifest.resources.available_count).toBe(1);
    expect(manifest.prompts.exposed_count).toBe(1);
    expect(manifest.prompts.disabled).toEqual(["disabled_prompt"]);
  });

  test("plugin identity is BlockIT-owned while upstream attribution remains documentation-only", async () => {
    expect(PRODUCT_NAME).toContain("BlockIT");
    expect(PRODUCT_REPOSITORY).toBe("https://github.com/halokaryamedia-source/BuildIT");
    const indexSource = await source("index.ts");
    const readme = await source("README.md");
    expect(indexSource).toContain("title: PRODUCT_NAME");
    expect(indexSource).toContain("repository: PRODUCT_REPOSITORY");
    expect(indexSource).not.toContain("jasonjgardner.github.io/blockbench-mcp-plugin");
    expect(readme).toContain("Do **not** use the upstream hosted");
  });

  test("panel count language reflects MCP exposure instead of visible filter count", async () => {
    const panel = await source("ui/panel.html");
    const uiSource = await source("ui/index.ts");
    expect(panel).toContain("surface.tools.exposed_count");
    expect(panel).toContain("surface.prompts.exposed_count");
    expect(panel).toContain("surface.resources.available_count");
    expect(panel).not.toContain("filteredTools.length}}/{{tools.length");
    expect(uiSource).toContain("showDisabled: false");
    expect(uiSource).toContain("createSurfaceManifest");
  });

  test("Blockbench Tool Test cannot bypass disabled registration or full schema validation", async () => {
    const dialog = await source("ui/toolTestDialog.ts");
    const disabledGuard = dialog.indexOf("!tools[toolName]?.enabled");
    const fullValidation = dialog.indexOf("toolDef.parameterSchema.parseAsync(args)");
    const execute = dialog.indexOf("toolDef.execute(validatedArgs)");
    expect(disabledGuard).toBeGreaterThan(-1);
    expect(fullValidation).toBeGreaterThan(disabledGuard);
    expect(execute).toBeGreaterThan(fullValidation);
  });

  test("capability matrix protects native Bedrock gaps from deletion-by-absence", async () => {
    const matrix = await source("../docs/knowledge/reviews/bedrock-entity-capability-surface-matrix.md");
    for (const capability of [
      "TextureMesh",
      "Locators / NullObject locators",
      "Animation controllers",
      "Native Bedrock bounding-box fields",
      "Animated textures",
      "Bone binding expression",
      "Per-face `material_instance`",
    ]) {
      expect(matrix).toContain(capability);
    }
    expect(matrix).toContain("MCP GAP — protected");
    expect(matrix).toContain("not evidence that the native Bedrock capability may be removed");
  });
});''')

print("Pre-local plugin-surface A-D patch applied.")

# Orca CLI and Orca MCP Audit

Date: 2026-07-30  
Scope: official Orca websites and documentation, the deployed Orca web client,
official Orca GitHub repositories, package metadata, and live public endpoint
metadata only.

## Verdict

Orca CLI and Orca MCP are two access surfaces over Orca's closed creation,
asset, Minecraft-instance, and server capabilities. They are not open-source
extensions of `img2blockbench`.

Orca does expose a user-facing automatic model workflow:

1. submit a prompt and an optional PNG, JPEG, or WebP reference;
2. approve a generated concept;
3. start a remote model job;
4. receive a preview and `.bbmodel` download.

This is stronger automation than the open-source `img2blockbench` compiler.
However, the server implementation is not public. There is no primary-source
proof of a dedicated image-to-cuboid algorithm, five-view fitting, or
reference-accurate reconstruction. The safest description is:

> Orca provides a closed cloud generation job that accepts an optional image
> and returns a Blockbench model. Its internal visual geometry reasoning and
> fidelity are unverified.

Therefore Orca may be evaluated as an optional external geometry provider, but
it should not replace the local MCP-Blockbench workflow or become its source of
truth without a real output review.

## Source quality and limits

Evidence was ranked as follows:

1. deployed first-party client code and live endpoint metadata;
2. official product documentation and legal pages;
3. official product/marketing capability pages;
4. the public `orca-gamedev` GitHub account and `img2blockbench` source.

No public Orca CLI or Orca MCP server repository was found in the
[official GitHub account](https://github.com/orca-gamedev?tab=repositories).
The official CLI page says the CLI is distributed with Orca Desktop rather
than as a standalone npm package. The likely npm package names
`orcaclient`, `@orca-gamedev/cli`, and `@orca-gamedev/mcp` returned `404` on
2026-07-30. This is consistent with the official distribution statement, but
does not prove that no private package exists.

The authenticated MCP tool list and server implementation could not be
inspected without authorizing an Orca account. Public examples and frontend
code are not treated as proof of undisclosed server behavior.

## 1. What each product actually does

### Orca CLI

The [official CLI page](https://orcaclient.com/minecraft-cli) describes a
terminal interface that can:

- discover Orca actions;
- inspect local Minecraft instances and installed mods;
- install creations and launch Minecraft;
- create item, block, GUI, texture, skin, and model assets;
- inspect and operate account-owned servers;
- return structured JSON for coding agents.

The page shows `orca tool run generate_model --name ... --description ...` as
the model-generation command and says CLI and MCP share the same canonical
capability contracts. It also says Orca Desktop installs and updates the CLI;
the CLI is not distributed as a standalone npm package.

The CLI is therefore an Orca product client and command surface, not a local
image-to-cuboid library.

### Orca MCP

The [official MCP page](https://orcaclient.com/minecraft-mcp) describes a
remote MCP gateway at:

```text
https://app.orcaclient.com/api/mcp
```

The public page advertises 19 tools spanning project scaffolding, generation,
build/load testing, downloads, and owner-scoped server actions. It presents
`generate_model` as a generation tool and says CLI and MCP use the same
creation and server capabilities.

A live unauthenticated request to the endpoint returned `401 Unauthorized`.
The endpoint's
[OAuth authorization metadata](https://app.orcaclient.com/.well-known/oauth-authorization-server)
and
[protected-resource metadata](https://app.orcaclient.com/.well-known/oauth-protected-resource/api/mcp)
confirm OAuth authorization-code/PKCE support and the scopes
`mods:read`, `mods:write`, `servers:read`, `servers:write`, and
`offline_access`.

The public site exposes examples for only four of the advertised tools. The
full live schemas remain unverified until an authenticated MCP connection
lists them.

## 2. Is image-to-Minecraft cuboid geometry automatic?

### User-facing behavior: yes, as a hosted job

The [official mob maker page](https://orcaclient.com/minecraft-mob-generator)
says a model can start from a description or concept image, produce clean
Minecraft cuboids and a bone hierarchy, and be downloaded as `.bbmodel`.

More concretely, the
[deployed Orca app bundle](https://app.orcaclient.com/_next/static/chunks/2xl56j95yb9kg.js?dpl=dpl_AbA6Z2EQYvRiRPk63ffMkxYL9z2p)
shows the current client submitting this payload to
`/api/assets/generate`:

```json
{
  "projectId": "...",
  "kind": "model",
  "prompt": "...",
  "referenceBase64": "...",
  "generationId": "...",
  "approved": true
}
```

The same client code:

- accepts PNG, JPEG, or WebP references;
- scales the longest image edge to at most 1024 pixels;
- sends the encoded reference to the hosted API;
- requires concept approval before queuing the model job;
- polls the remote job;
- reads `result.bbmodel_url` when generation succeeds.

This proves that Orca's current web application is designed to automate the
workflow from optional image/prompt to downloadable Blockbench model. The user
does not author a cuboid specification in this UI.

### Geometry mechanism and accuracy: not verified

No public server source, model card, algorithm description, test dataset, or
authenticated tool schema proves:

- that the output cuboids are measured from the submitted image;
- that multiple orthographic views are supported as one geometric constraint;
- that contacts, rotations, pivots, and hidden geometry are solved rather than
  inferred by an agent;
- that output resembles the source at a stated threshold;
- that the Zebra five-view reference can be reconstructed accurately.

The product claim establishes an automatic service workflow, not reference
fidelity.

## 3. Local/cloud execution and authentication

| Surface | Execution boundary | Authentication |
|---|---|---|
| Orca MCP | Remote endpoint on `app.orcaclient.com`; generation/build actions are hosted | OAuth sign-in; no pasted API key |
| Orca CLI local actions | CLI talks through a private Orca Desktop handoff for local instance/install/launch actions | Exact anonymous/local-only behavior is undocumented |
| Orca CLI cloud/server actions | Authenticated, owner-scoped Orca hosts | Orca account through the desktop/service handoff |
| Model generation | Current web client queues `/api/assets/generate` and polls a remote job | Signed-in Orca project/account required by the app workflow |

The [MCP setup guide](https://orcaclient.com/mcp-setup) confirms OAuth 2.0 and
states that no API key is required. The
[CLI documentation](https://orcaclient.com/minecraft-cli) says the CLI never
stores service credentials: local actions use the private desktop handoff,
while cloud and server actions use authenticated hosts.

There is no evidence that the visual model generator or its AI model can run
fully offline. Orca Desktop is a launcher/client boundary, not proof of local
geometry inference.

## 4. Outputs

### Verified or directly documented

- `.bbmodel`: the deployed app reads `result.bbmodel_url`; the official mob
  page says the result can be downloaded and edited in Blockbench.
- Preview images: the deployed app reads `result.preview_urls`.
- Rig, texture, and animation data: claimed by the official mob workflow and
  shown in Orca's product output descriptions.
- Java mod/plugin archives and Bedrock add-ons: documented by
  [How Orca builds a mod](https://orcaclient.com/docs/how-orca-builds-a-mod).

### `geo.json`

The open-source
[`img2blockbench` README](https://github.com/orca-gamedev/img2blockbench/blob/315fff912f83a9923e954ff6c596c00dc9832fa3/README.md)
proves that its deterministic compiler emits `.bbmodel`, texture, and
`.geo.json`.

For the closed Orca `generate_model` service, the current public app client
only requires a `.bbmodel` URL. Orca documents Bedrock add-on generation, but
the live `generate_model` response schema and the exact location of a
standalone `.geo.json` are not public. Treat direct `geo.json` delivery from
Orca CLI/MCP as **Needs Validation**.

## 5. Licensing, pricing, and usage restrictions

### Licensing

- `img2blockbench` version `0.1.0` is alpha software under MIT, as shown by its
  [package metadata](https://github.com/orca-gamedev/img2blockbench/blob/315fff912f83a9923e954ff6c596c00dc9832fa3/pyproject.toml)
  and [license](https://github.com/orca-gamedev/img2blockbench/blob/315fff912f83a9923e954ff6c596c00dc9832fa3/LICENSE).
- Orca CLI, Orca MCP, the hosted service, and their server implementation have
  no public open-source license. Orca's
  [Terms of Service](https://orcaclient.com/terms) state that the service code
  and documentation belong to Orca or its licensors.
- The same Terms say users own their creations, while granting Orca a
  non-exclusive license to host, copy, transmit, display, and process uploaded
  or generated content as needed to operate, secure, and improve the service.
- AI output has no fitness, correctness, compatibility, or non-infringement
  warranty. Users remain responsible for third-party licenses and Minecraft's
  rules.

### Pricing conflict

Official first-party sources disagree:

- the [public pricing page](https://orcaclient.com/pricing) advertises
  unlimited free Lite generation and Orca Pro at USD 19.99/month;
- the
  [plans documentation](https://orcaclient.com/docs/plans-billing-and-programs)
  says Free receives 250 lifetime starter credits, Pro receives 12,500 weekly
  credits at USD 19.99/month, and Max receives 62,500 weekly credits at
  USD 99.99/month;
- the deployed Orca app labels 3D model generation `Pro/Max` and charges
  400 credits on a successful model job.

Because the deployed client is the closest evidence to actual current model
generation, budgeting should assume **Pro/Max plus 400 credits per successful
model** until Orca confirms otherwise. The pricing inconsistency itself is an
integration risk.

### Usage and data restrictions

The [Acceptable Use Policy](https://orcaclient.com/aup) prohibits evading
limits, using multiple accounts to extend free access, extracting protected
prompts/keys, and scraping undocumented APIs. It also requires compliance with
Minecraft and third-party distribution rules.

The [Privacy Policy](https://orcaclient.com/privacy) says Orca collects AI chat
transcripts including attached code, configuration, and files. It identifies
Anthropic, accessed through Orca's managed AI gateway, as the AI processor and
says Anthropic does not train on Orca user content. This means reference images
and prompts should be treated as cloud-processed data, not local-only assets.

## 6. Does Orca contain the missing visual geometry reasoner?

### `img2blockbench`: no

The public repository is explicit:

- the agent supplies visual reasoning;
- `new` creates a starter specification for the agent to complete;
- the compiler validates and emits files;
- the compiler does not invent anatomy or judge resemblance.

See the
[`img2blockbench` README](https://github.com/orca-gamedev/img2blockbench/blob/315fff912f83a9923e954ff6c596c00dc9832fa3/README.md)
and its
[`SKILL.md`](https://github.com/orca-gamedev/img2blockbench/blob/315fff912f83a9923e954ff6c596c00dc9832fa3/skill/img2blockbench/SKILL.md).

### Orca CLI/MCP: an opaque hosted reasoner, not a reusable component

Orca's service accepts a prompt/reference and returns a generated model, so it
does more for the user than merely compile a user-authored spec. However:

- no Orca CLI/MCP server source is public;
- no public evidence shows that the service calls `img2blockbench`;
- no public evidence identifies a dedicated geometry model;
- no public evidence distinguishes a geometry solver from an AI agent that
  writes the same kind of cuboid specification;
- the privacy policy confirms an Anthropic-backed AI assistant but does not
  specify which model or workflow produces geometry.

Conclusion: Orca offers the missing capability only as a **black-box cloud
service claim and job interface**. It does not provide a verified local visual
geometry reasoner that MCP-Blockbench can import, inspect, tune, or guarantee.

## 7. Integration risks for local MCP-Blockbench

| Risk | Impact | Minimal mitigation |
|---|---|---|
| Closed remote implementation | Cannot diagnose or patch bad geometry | Treat Orca output as an optional candidate, never authority |
| No proven five-view/1:1 fitting | Zebra may remain inaccurate | Keep Model Reference and local visual approval gate |
| Cloud upload | Reference images/prompts leave the workstation | Require user consent and avoid confidential references |
| OAuth/account coupling | Automation depends on user session and revocable access | Keep connector isolated from the local Blockbench MCP |
| Credit/pricing conflict | Cost and availability are unpredictable | Confirm actual account charge before production use |
| Beta/no warranty | API, output, or availability may change | Do not make Orca the only geometry path |
| Proprietary service code | Cannot copy or vendor CLI/MCP implementation | Integrate only through documented public surfaces |
| Unpublished tool schemas | Contract may differ from marketing examples | List authenticated tools before writing an adapter |
| Async concept/job workflow | Requires approval, polling, and artifact download | Reuse existing approval gate; do not bypass it |
| `.geo.json` delivery unverified | Bedrock handoff may require unpacking an add-on | Accept `.bbmodel` first; inspect actual Bedrock artifact later |

## Recommended boundary

Do not rewrite MCP-Blockbench around Orca or `img2blockbench`.

The smallest defensible integration is:

```text
Model Reference
        ↓
Optional Orca cloud generation
        ↓
Candidate .bbmodel
        ↓
Import into local Blockbench
        ↓
Existing local inspection and user Geometry Approval
```

This uses Orca for the one capability it may provide—automatic candidate
generation—while keeping reference authority, validation, editing, and final
approval local. The MIT `img2blockbench` compiler can remain an independent
fallback for agent-authored specifications; it is not a reason to couple the
local MCP to Orca.

## Unknowns requiring a real authenticated proof

1. The full live Orca MCP tool list and exact `generate_model` input/output
   schema.
2. Whether MCP or CLI accepts a reference image directly, by attachment,
   project file, URL, or base64.
3. Whether a five-view image is handled as one reference, split into views, or
   reduced to a concept.
4. Whether generated cuboids are derived by a dedicated solver, an Anthropic
   agent, `img2blockbench`, another pipeline, or a mixture.
5. Actual Zebra fidelity, rotations, contacts, pivots, hierarchy, and hidden
   geometry.
6. Whether Bedrock generation exposes a standalone `.geo.json` through
   `generate_model`.
7. Which pricing statement governs CLI/MCP model generation for the current
   account.

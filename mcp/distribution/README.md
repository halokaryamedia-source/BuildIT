# Managed BlockIT installation — Windows x64

Install/update automation without a desktop app, background service, new MCP tool, source checkout, Git, or a separately installed Bun on the user's machine. Runtime/Gateway source contracts and native authoring behavior are unchanged. The installer is a maintenance command; Codex connects directly to the compiled existing four-tool Gateway.

## User path

Obtain a **published BlockIT release** from this repository, extract its ZIP once, and run:

```powershell
.\blockit.exe install
```

Defaults: installation under `%LOCALAPPDATA%\BlockIT`, an asset workspace at `%USERPROFILE%\BlockIT-Workspace`, and the current Codex home `config.toml` (`CODEX_HOME` is respected).

For an existing installation, pass the already-loaded plugin's path once so its native registration stays valid:

```powershell
.\blockit.exe install --workspace "D:\Art\BlockIT" --plugin-path "C:\MyPlugins\blockit_mcp.js" --adopt
```

`--adopt` explicitly backs up and replaces **only named BlockIT-owned installation files** and the existing local `mcp_servers.blockit` configuration. It does not authorize changing other MCP servers, models, PNGs, arbitrary scripts, application security settings, or remote MCP configurations. Local modifications otherwise fail closed. Existing root AGENTS.md content is preserved outside the managed section.

A new installation still needs Blockbench's normal **Load Plugin from File** trust/permission step once, using the managed plugin path printed by the installer. The installer does not edit Electron localStorage, fake trust, or inject code into the editor. Open the printed asset workspace in Codex. Existing Codex sessions may need a normal restart to read changed skills/configuration. No manual config editing or recurring plugin/file copying is required.

Once installed:

```powershell
& "$env:LOCALAPPDATA\BlockIT\blockit.cmd" update
& "$env:LOCALAPPDATA\BlockIT\blockit.cmd" status
& "$env:LOCALAPPDATA\BlockIT\blockit.cmd" rollback
```

Use the equivalent installed path when `--root` was specified. `update --preview` opts into published prereleases; `update --tag blockit-vX.Y.Z` selects an exact published release. Neither installs a draft or executes source from `Local`/a moving branch.

## What changes automatically

- Verified versioned Gateway/manager executable and the existing plugin at its pinned location.
- Four current canonical authoring skills, required foundation references and workspace conventions.
- Only the BlockIT part of Codex TOML; other server/settings semantics and unrelated comments remain intact. Existing BlockIT environment and timeout options are retained. Disabled/remote entries are not silently overridden.
- A stable `blockit.cmd` maintenance entrypoint; normal MCP launch bypasses this script and starts the versioned executable directly.

User assets remain under `workspace/active` or the user's own locations. They are not package files and never belong to application rollback. This installer does not create model history or a Git repository; instructions mentioning Git history do not imply that an unversioned workspace has backups. Optional 3D_ASSISTED GPU providers are still separately provisioned; selecting that strategy never silently falls back to DIRECT.

## Safe activation and recovery

Updates are explicit, not network polling during authoring. The package is downloaded and verified before activation. Active Gateway process leases or a responding Runtime postpone replacement. A pending update is reused without redownloading and can activate on the next Gateway start **only when no other Gateway/Runtime is active**. Otherwise close Blockbench, finish existing Codex MCP sessions, and invoke `update` again. The command performs the replacement; users do not move files. No application is killed, no unsaved model is closed, and a loaded plugin is not hot-swapped mid-operation.

Each activation preflights all targets, records a disk-backed transaction, backs up existing bytes, stages writes beside their destinations, atomically renames individual files, verifies hashes and commits installation state last. A write failure restores the previous set when current bytes still match the transaction. This is a recoverable multi-file transaction, not a claim that the filesystem offers one atomic multi-file operation or power-loss durability.

`rollback` restores the last completed installation transaction, including its configuration and managed plugin/skills, but refuses to overwrite files edited afterward. `recover` resolves a prepared transaction after a process interruption; a lock is reclaimed only from a known dead owner. Unknown/live owners fail closed. Immutable version directories and transaction backups are retained; no automatic disk-pruning policy is claimed in v1.

## Integrity boundary

Updater discovery is restricted to this repository's GitHub Releases API. It requires GitHub's `sha256:` asset digest, checks download origin and size, verifies ZIP entry paths/types/expanded bounds, and then verifies every allowlisted package file, source SHA and embedded Runtime build identity. No remote installer scripts or arbitrary archive paths are executed. HTTPS/repository authority plus digest integrity is not a code-signing or vulnerability-free claim. Initial sideloaded packages must come from a trusted release; self-authored manifest hashes alone cannot authenticate their author.

## Maintainer path and proof

Owning files: `managed-install.ts` = bounded file transactions/configuration; `cli.ts` = lifecycle and published-release update; `package.ts` = build-only packaging; `authoring-AGENTS.md` = installed-workspace boot; `tests/managed-install.test.ts` = executable regressions.

The existing MCP Verify remains the full Runtime/source owner on Local. `Managed Distribution` independently runs Windows filesystem tests, compiles the package with pinned Bun, installs it into disposable locations twice and initializes its real compiled stdio Gateway. It produces `blockit-managed-windows-x64` as a CI artifact, not a stable release.

Pushing an explicitly approved `blockit-vX.Y.Z` or `blockit-vX.Y.Z-preview.N` tag runs `verify:release` and the Windows gate, then creates a **draft** GitHub release with the ZIP. A maintainer must review the existing schema/Particle/SDK residues, native acceptance and redistribution notices before publishing. No release is published by a normal Local push. Drafts are invisible to the updater.

A local maintainer with the pinned toolchain can run, from `mcp/`:

```text
bun test tests/managed-install.test.ts
bun run build
bun run ./distribution/package.ts
```

The package builder requires Windows x64 and a clean tracked checkout. It never writes generated source or commits back. Compiled and filesystem tests do **not** prove installed Blockbench permissions, native plugin registration/reload, actual Codex skill pickup, visual quality, or usage savings. First-machine acceptance must exercise those remaining host boundaries.

Official integration references (checked 2026-09-09):
- Codex MCP: https://developers.openai.com/codex/mcp
- Codex skills: https://developers.openai.com/codex/skills
- Blockbench plugin lifecycle: https://blockbench.net/wiki/docs/plugin/
- Bun standalone compilation: https://bun.com/docs/bundler/executables

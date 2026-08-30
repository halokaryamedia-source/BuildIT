# Security Policy

## Supported state

BlockIT is under active development on the `Local` branch. Security reports for development behavior should be checked against the current `Local` HEAD. No public stable release line is currently maintained; when stable releases are published, support will follow the latest supported release unless stated otherwise.

## Reporting a vulnerability

Do not publish security-sensitive details, credentials, exploit steps, or private user data in a public issue.

Report suspected vulnerabilities privately to the Halo Karya Media maintainers through the established private project channel. If GitHub offers a private vulnerability-reporting option for this repository, that is also appropriate.

Include only the information needed to reproduce and assess the issue:

- affected BlockIT commit or version;
- Blockbench and operating-system versions when relevant;
- affected MCP endpoint, tool, import/export path, or setting;
- minimal reproduction steps;
- expected versus observed behavior;
- security impact and whether user interaction is required.

## Scope

Security-relevant areas include the local MCP transport, network permission and loopback exposure, filesystem import/export behavior, plugin settings, tool/resource/prompt exposure, and handling of untrusted input.

Ordinary functional bugs, visual-quality issues, and feature requests should use the normal issue workflow instead.

Runtime prompt source folder.

Do not move or rename files in this folder casually.

Why:
- build/generate-manifest.ts scans prompts/*.md.
- src/lib/promptLoader.ts expects prompts/manifest.json.
- build/docs-manifest.ts documents prompt names used by the MCP server.

Use README.txt instead of README.md because *.md files are included in the generated prompt manifest.

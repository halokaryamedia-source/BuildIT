# 07-start-workspace-flow

## Purpose
- Describe end-to-end user flow for starting a Blockbench MCP workspace from app.

## Flow steps
1. Open Start Workspace tab.
2. Select folder and validate local structure.
3. Optionally pilih server mode (Ollama/OLLmcp).
4. Press Start and wait for init status.
5. Validate MCP endpoint and Codex readiness.
6. Confirm config write if needed.

## Validation
- Workspace path exists and writable.
- Endpoint can be reached after runtime start.
- Process lifecycle can be controlled (start/stop).

## Implementation notes
- Pada validasi, menampilkan checklist singkat: path, binary availability, write permission.
- Jika fail pada step tertentu, flow berhenti dan user diberikan rekomendasi recovery.

## Acceptance criteria
- Workspace dapat mulai dari state kosong menjadi running tanpa langkah manual tambahan.
- Error path menyebutkan langkah berikutnya secara eksplisit.

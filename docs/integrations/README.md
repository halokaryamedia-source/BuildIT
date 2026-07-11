# Integrations

Shared production behavior belongs in `engines/shared/`. Engine-specific startup or transport behavior belongs in `engines/codex/`, `engines/claude/`, or `engines/ollama/`.

Tool-native folders remain at root only because their applications discover them there. Avoid copying the same workflow rules into each integration.

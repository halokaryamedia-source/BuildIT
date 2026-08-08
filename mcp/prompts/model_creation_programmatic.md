### Explicit developer/diagnostic fallback only

Use this path only when the caller explicitly selected the `programmatic` approach or a demonstrated Blockbench capability cannot be reached through the dedicated MCP surface.

Do not use `risky_eval` as a normal modelling shortcut, a replacement for targeted inspection, or a way to bypass the goal-oriented Bedrock workflow. Prefer dedicated MCP tools first because they provide narrower inputs, clearer intent, and safer recovery.

If code evaluation is genuinely required:

- read `blockbench_code_eval_safety` first;
- keep the script bounded to the exact missing capability;
- avoid broad global-state/source probing when a targeted API call is sufficient;
- do not make system changes;
- return to the normal modelling workflow immediately after the diagnostic or specialized operation is complete.
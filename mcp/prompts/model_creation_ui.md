### Explicit UI fallback only

Use this path only when the caller explicitly selected the `ui` approach or when a demonstrated Blockbench operation is unavailable through a dedicated MCP tool.

Normal modelling should stay on the direct MCP surface: inspect with `get_project_info`, `list_outline`, or `find_elements_by_criteria`; create/edit with dedicated project, Cube, hierarchy, texture, animation, history, and screenshot tools.

`trigger_action`, `fill_dialog`, and `emulate_clicks` are last-resort UI automation. Do not use them as normal model-construction steps, do not replace a working dedicated tool with UI clicks, and return to the normal goal-oriented modelling workflow after the specific UI-only operation is complete.
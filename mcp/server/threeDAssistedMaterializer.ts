/**
 * Compatibility tombstone for an authoring path retired on 2026-09-10.
 *
 * `mcp/server/tools/element.ts` still imports this symbol only so the current
 * generated ToolSpec snapshot can remain reproducible until the next
 * LOCAL_CODE generator pass removes the legacy descriptor completely.
 * Active phase routing excludes the capability from every Runtime surface.
 */
export function materializeThreeDAssistedScaffoldFromWorkspace(
  _workspacePath: string
): never {
  throw new Error(
    "materialize_3d_assisted_scaffold is retired. Use the normal native BlockIT Geometry path."
  );
}

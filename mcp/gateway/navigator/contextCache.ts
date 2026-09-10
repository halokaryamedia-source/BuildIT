import type { NavigatorContextHandle } from "./types";

export function contextIds(handles: readonly NavigatorContextHandle[]): string[] {
  return handles.map((handle) => handle.id);
}

export function contextSetChanged(
  previous: readonly string[],
  next: readonly NavigatorContextHandle[]
): boolean {
  if (previous.length !== next.length) return true;
  const expected = new Set(previous);
  return next.some((handle) => !expected.has(handle.id));
}

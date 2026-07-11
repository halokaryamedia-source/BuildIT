/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL, STATUS_STABLE } from "@/lib/constants";

export const undoParameters = z.object({
  steps: z.number().int().min(1).max(100).optional().default(1),
});

export const redoParameters = z.object({
  steps: z.number().int().min(1).max(100).optional().default(1),
});

export const getUndoStackParameters = z.object({
  limit: z.number().int().min(1).max(200).optional().default(20),
});

export const saveCheckpointParameters = z.object({
  name: z.string().min(1).max(120),
});

export const historyToolDocs: ToolSpec[] = [
  {
    name: "undo",
    description: "Undoes one or more recent edits and returns a compact structured summary.",
    annotations: { title: "Undo", destructiveHint: true },
    parameters: undoParameters,
    status: STATUS_STABLE,
  },
  {
    name: "redo",
    description: "Redoes one or more undone edits and returns a compact structured summary.",
    annotations: { title: "Redo", destructiveHint: true },
    parameters: redoParameters,
    status: STATUS_STABLE,
  },
  {
    name: "get_undo_stack",
    description:
      "Returns a bounded structured undo/redo summary. Default limit is 20 to avoid unnecessary history payload.",
    annotations: { title: "Get Undo Stack", readOnlyHint: true },
    parameters: getUndoStackParameters,
    status: STATUS_STABLE,
  },
  {
    name: "save_checkpoint",
    description:
      "Inserts a named marker into in-memory undo history. Use save_project_checkpoint for durable recovery.",
    annotations: { title: "Save Checkpoint", destructiveHint: false },
    parameters: saveCheckpointParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

interface IUndoEntrySummary {
  index: number;
  action: string;
  type: string;
  time: number;
  is_applied: boolean;
  is_current: boolean;
}

function summarizeHistory(limit: number) {
  const history = (Undo.history ?? []) as Array<{
    action?: string;
    type?: string;
    time?: number;
  }>;
  const index = Undo.index ?? 0;
  const start = Math.max(0, history.length - limit);
  const entries: IUndoEntrySummary[] = history
    .slice(start)
    .map((entry, offset) => {
      const absoluteIndex = start + offset;
      return {
        index: absoluteIndex,
        action: entry.action ?? "(unnamed edit)",
        type: entry.type ?? "edit",
        time: entry.time ?? 0,
        is_applied: absoluteIndex < index,
        is_current: absoluteIndex === index - 1,
      };
    })
    .reverse();

  return {
    index,
    total: history.length,
    returned: entries.length,
    can_undo: index > 0,
    can_redo: index < history.length,
    entries,
  };
}

export function registerHistoryTools() {
  createTool(
    historyToolDocs[0].name,
    {
      ...historyToolDocs[0],
      async execute({ steps }) {
        const history = Undo.history ?? [];
        const available = Undo.index ?? 0;
        if (available === 0) throw new Error("Nothing to undo.");

        const count = Math.min(steps, available);
        const undone: string[] = [];
        for (let index = 0; index < count; index++) {
          const entry = history[(Undo.index ?? 0) - 1] as { action?: string } | undefined;
          undone.push(entry?.action ?? "(unnamed edit)");
          Undo.undo();
        }
        Canvas.updateAll();
        const result = {
          requested: steps,
          undone_count: undone.length,
          undone,
          new_index: Undo.index ?? 0,
        };
        return {
          content: [{ type: "text" as const, text: `Undid ${undone.length} edit(s).` }],
          structuredContent: { status: "PASS", ...result },
        };
      },
    },
    historyToolDocs[0].status
  );

  createTool(
    historyToolDocs[1].name,
    {
      ...historyToolDocs[1],
      async execute({ steps }) {
        const history = Undo.history ?? [];
        const available = history.length - (Undo.index ?? 0);
        if (available === 0) throw new Error("Nothing to redo.");

        const count = Math.min(steps, available);
        const redone: string[] = [];
        for (let index = 0; index < count; index++) {
          const entry = history[Undo.index ?? 0] as { action?: string } | undefined;
          redone.push(entry?.action ?? "(unnamed edit)");
          Undo.redo();
        }
        Canvas.updateAll();
        const result = {
          requested: steps,
          redone_count: redone.length,
          redone,
          new_index: Undo.index ?? 0,
        };
        return {
          content: [{ type: "text" as const, text: `Redid ${redone.length} edit(s).` }],
          structuredContent: { status: "PASS", ...result },
        };
      },
    },
    historyToolDocs[1].status
  );

  createTool(
    historyToolDocs[2].name,
    {
      ...historyToolDocs[2],
      async execute({ limit }) {
        const summary = summarizeHistory(limit);
        return {
          content: [{
            type: "text" as const,
            text: `Undo history: ${summary.index}/${summary.total}, returning ${summary.returned} entries.`,
          }],
          structuredContent: { status: "PASS", ...summary },
        };
      },
    },
    historyToolDocs[2].status
  );

  createTool(
    historyToolDocs[3].name,
    {
      ...historyToolDocs[3],
      async execute({ name }) {
        const label = `[checkpoint] ${name}`;
        Undo.initEdit({ elements: [], outliner: true, collections: [] });
        Undo.finishEdit(label);
        const result = {
          name,
          label,
          index: Undo.index ?? 0,
          total: Undo.history?.length ?? 0,
        };
        return {
          content: [{ type: "text" as const, text: `Added undo marker ${label}.` }],
          structuredContent: { status: "PASS", ...result },
        };
      },
    },
    historyToolDocs[3].status
  );
}

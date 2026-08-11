/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL, STATUS_STABLE } from "@/lib/constants";

export const undoParameters = z.object({
  steps: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .default(1)
    .describe("Number of steps to undo."),
});

export const redoParameters = z.object({
  steps: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .default(1)
    .describe("Number of steps to redo."),
});

export const getUndoStackParameters = z.object({
  limit: z
    .number()
    .int()
    .min(1)
    .max(200)
    .optional()
    .default(20)
    .describe(
      "Maximum recent entries returned. Defaults to 20; increase explicitly for deeper recovery history."
    ),
});

export const saveCheckpointParameters = z.object({
  name: z
    .string()
    .min(1)
    .max(120)
    .describe(
      "Descriptive name for the checkpoint. Shown in undo history so agents can navigate back to this point."
    ),
});

export const historyToolDocs: ToolSpec[] = [
  {
    name: "undo",
    description:
      "Undoes recent edits. Use `steps` to undo multiple edits in one call; returns the actions undone.",
    annotations: {
      title: "Undo",
      destructiveHint: true,
    },
    parameters: undoParameters,
    status: STATUS_STABLE,
  },
  {
    name: "redo",
    description:
      "Redoes recently undone edits. Use `steps` to redo multiple edits in one call; returns the actions redone.",
    annotations: {
      title: "Redo",
      destructiveHint: true,
    },
    parameters: redoParameters,
    status: STATUS_STABLE,
  },
  {
    name: "get_undo_stack",
    description:
      "Returns bounded recent undo/redo history and checkpoints for actual recovery/navigation; it should not be polled between successful bounded edits.",
    annotations: {
      title: "Get Undo Stack",
      readOnlyHint: true,
    },
    parameters: getUndoStackParameters,
    status: STATUS_STABLE,
  },
  {
    name: "save_checkpoint",
    description:
      "Adds a named Undo marker before meaningful risky rework. Do not create a checkpoint after every Cube/edit; normal bounded edits already participate in Undo.",
    annotations: {
      title: "Save Checkpoint",
      destructiveHint: false,
    },
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

function summarizeHistory(limit: number): {
  index: number;
  total: number;
  can_undo: boolean;
  can_redo: boolean;
  entries: IUndoEntrySummary[];
} {
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
    can_undo: index > 0,
    can_redo: index < history.length,
    entries,
  };
}

export function registerHistoryTools() {
  createTool(historyToolDocs[0].name, {
    ...historyToolDocs[0],
    async execute({ steps }) {
      const history = Undo.history ?? [];
      const available = Undo.index ?? 0;
      if (available === 0) {
        throw new Error("Nothing to undo. The undo stack is empty.");
      }

      const count = Math.min(steps, available);
      const undone: string[] = [];
      for (let i = 0; i < count; i++) {
        const entry = history[(Undo.index ?? 0) - 1] as
          | { action?: string }
          | undefined;
        undone.push(entry?.action ?? "(unnamed edit)");
        Undo.undo();
      }

      Canvas.updateAll();
      return JSON.stringify(
        {
          undone_count: undone.length,
          requested: steps,
          undone,
          new_index: Undo.index,
        }
      );
    },
  }, historyToolDocs[0].status);

  createTool(historyToolDocs[1].name, {
    ...historyToolDocs[1],
    async execute({ steps }) {
      const history = Undo.history ?? [];
      const available = history.length - (Undo.index ?? 0);
      if (available === 0) {
        throw new Error(
          "Nothing to redo. No edits have been undone or the redo stack has been cleared."
        );
      }

      const count = Math.min(steps, available);
      const redone: string[] = [];
      for (let i = 0; i < count; i++) {
        const entry = history[Undo.index ?? 0] as
          | { action?: string }
          | undefined;
        redone.push(entry?.action ?? "(unnamed edit)");
        Undo.redo();
      }

      Canvas.updateAll();
      return JSON.stringify(
        {
          redone_count: redone.length,
          requested: steps,
          redone,
          new_index: Undo.index,
        }
      );
    },
  }, historyToolDocs[1].status);

  createTool(historyToolDocs[2].name, {
    ...historyToolDocs[2],
    async execute({ limit }) {
      return JSON.stringify(summarizeHistory(limit));
    },
  }, historyToolDocs[2].status);

  createTool(historyToolDocs[3].name, {
    ...historyToolDocs[3],
    async execute({ name }) {
      const label = `[checkpoint] ${name}`;
      Undo.initEdit({
        elements: [],
        outliner: true,
        collections: [],
      });
      Undo.finishEdit(label);

      return JSON.stringify(
        {
          name,
          label,
          index: Undo.index,
          total: Undo.history?.length ?? 0,
        }
      );
    },
  }, historyToolDocs[3].status);
}

export type TodoId = string;

export const predefinedTags = [
  "work",
  "school",
  "church",
  "family",
  "random",
] as const;
export type PredefinedTag = (typeof predefinedTags)[number];
export type Tag = PredefinedTag | (string & {});

export type Todo =
  | {
      id: TodoId;
      title: string;
      notes?: string;
      status: "active";
      createdAt: Date;
      tags: readonly string[];
      dueAt: Date | null;
    }
  | {
      id: TodoId;
      title: string;
      notes?: string;
      status: "completed";
      createdAt: Date;
      tags: readonly string[];
      dueAt: Date | null;
      completedAt: Date;
    };

export type TodoDraft = {
  title: string;
  notes?: string;
  dueAt: string; // form input text, not Date yet
  tags: string[]; // array of tag strings
};

export type TodoUpdateDraft = {
  title: string;
  notes?: string;
  dueAt: string;
  tags: string[];
};

export type Action =
  | { type: "create"; draft: TodoDraft }
  | { type: "update"; id: TodoId; draft: TodoDraft }
  | { type: "delete"; id: TodoId }
  | { type: "markCompleted"; id: TodoId }
  | { type: "markActive"; id: TodoId };

export type TodoSortKey = "createdAt" | "dueAt" | "title";
export type TodoSortDirection = "asc" | "desc";

export type PersistedState = {
    todos: readonly Todo[];
    customTags: string[];
  };
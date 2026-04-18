import type { Todo, Action } from "../types/types";

type ActiveTodo = Extract<Todo, { status: "active" }>;
type CompletedTodo = Extract<Todo, { status: "completed" }>;

function normalizeTags(tags: readonly string[]): readonly string[] {
  return [...new Set(tags.map((t) => t.trim()).filter(Boolean))];
}

function parseDate(input: string): Date | null {
  if (input.trim() === "") return null;
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toCompletedTodo(todo: ActiveTodo): CompletedTodo {
  return {
    id: todo.id,
    title: todo.title,
    notes: todo.notes,
    status: "completed",
    createdAt: todo.createdAt,
    tags: todo.tags,
    dueAt: todo.dueAt,
    completedAt: new Date(),
  };
}

function toActiveTodo(todo: CompletedTodo): ActiveTodo {
  return {
    id: todo.id,
    title: todo.title,
    notes: todo.notes,
    status: "active",
    createdAt: todo.createdAt,
    tags: todo.tags,
    dueAt: todo.dueAt,
  };
}

export function todoReducer(
  state: readonly Todo[],
  action: Action,
): readonly Todo[] {
  switch (action.type) {
    case "create": {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        title: action.draft.title.trim(),
        notes: action.draft.notes?.trim() || undefined,
        status: "active",
        createdAt: new Date(),
        dueAt: parseDate(action.draft.dueAt),
        tags: normalizeTags(action.draft.tags),
      };
      return [...state, newTodo];
    }

    case "delete":
      return state.filter((t) => t.id !== action.id);

    case "markCompleted":
      return state.map((todo) => {
        if (todo.id !== action.id) return todo;
        return todo.status === "completed" ? todo : toCompletedTodo(todo);
      });

    case "markActive":
      return state.map((todo) => {
        if (todo.id !== action.id) return todo;
        return todo.status === "active" ? todo : toActiveTodo(todo);
      });

    case "update":
      return state.map((todo) => {
        if (todo.id !== action.id) return todo;

        const updatedBase = {
          id: todo.id,
          title: action.draft.title.trim(),
          notes: action.draft.notes?.trim() || undefined,
          createdAt: todo.createdAt,
          tags: normalizeTags(action.draft.tags),
          dueAt: parseDate(action.draft.dueAt),
        };

        if (todo.status === "completed") {
          return {
            ...updatedBase,
            status: "completed",
            completedAt: todo.completedAt,
          };
        }

        return {
          ...updatedBase,
          status: "active",
        };
      });

    default:
      return state;
  }
}

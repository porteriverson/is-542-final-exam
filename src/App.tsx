import { useEffect, useReducer, useState } from "react";
import { todoReducer } from "./reducers/todoReducer";
import { TodoForm } from "./components/TodoForm";
import { TodoBoard } from "./components/Todoboard";
import { predefinedTags, type PersistedState, type Todo } from "./types/types";
import "./index.css";

const STORAGE_KEY = "todo-app-v1";

// Defines the raw data structure as it comes from JSON (dates are strings)
type SerializedTodo = Omit<Todo, "createdAt" | "dueAt" | "completedAt"> & {
  createdAt: string;
  dueAt: string | null;
  completedAt?: string;
};

type SerializedState = {
  todos: SerializedTodo[];
  customTags: string[];
};

function loadState(): PersistedState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      todos: [],
      customTags: ["urgent", "health", "homework"],
    };
  }

  try {
    const parsed = JSON.parse(raw) as SerializedState;

    const revivedTodos: Todo[] = parsed.todos.map((todo): Todo => {
      const base = {
        ...todo,
        createdAt: new Date(todo.createdAt),
        dueAt: todo.dueAt ? new Date(todo.dueAt) : null,
      };

      if (base.status === "completed") {
        return {
          ...base,
          status: "completed",
          completedAt: new Date(todo.completedAt as string),
        };
      }

      return {
        ...base,
        status: "active",
      };
    });

    return {
      todos: revivedTodos,
      customTags: parsed.customTags || ["urgent", "health", "homework"],
    };
  } catch {
    return {
      todos: [],
      customTags: ["urgent", "health", "homework"],
    };
  }
}

function saveState(state: PersistedState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export default function App() {
  const initial = loadState();
  const [todos, dispatch] = useReducer(todoReducer, initial.todos);
  const [customTags, setCustomTags] = useState<string[]>(initial.customTags);

  useEffect(() => {
    saveState({ todos, customTags });
  }, [todos, customTags]);

  const availableTags = [...predefinedTags, ...customTags];

  const handleAddCustomTag = (tag: string) => {
    setCustomTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
  };

  return (
    <main>
      <h1>Todo App</h1>
      <p>Welcome to your new to do list app. Create a new todo item to get started. You'll feel so good as you check them off</p>

      <TodoForm
        availableTags={availableTags}
        onCreate={(draft) => dispatch({ type: "create", draft })}
        onAddCustomTag={handleAddCustomTag}
      />

      <TodoBoard
        todos={todos}
        dispatch={dispatch}
        availableTags={availableTags}
        onAddCustomTag={handleAddCustomTag}
      />
    </main>
  );
}

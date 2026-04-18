import { useMemo, useState } from "react";
import type {
  Todo,
  Action,
  TodoSortKey,
  TodoSortDirection,
} from "../types/types";
import { TodoList } from "./ToDoList";


type Props = {
  todos: readonly Todo[];
  dispatch: React.Dispatch<Action>;
  availableTags: readonly string[];
  onAddCustomTag: (tag: string) => void;
};

function matchesQuery(todo: Todo, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q === "") return true;

  return (
    todo.title.toLowerCase().includes(q) ||
    todo.notes?.toLowerCase().includes(q) ||
    todo.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

function compareTodos(
  a: Todo,
  b: Todo,
  sortBy: TodoSortKey,
  sortDirection: TodoSortDirection,
): number {
  let result = 0;

  switch (sortBy) {
    case "title":
      result = a.title.localeCompare(b.title);
      break;
    case "createdAt":
      result = a.createdAt.getTime() - b.createdAt.getTime();
      break;
    case "dueAt":
      result = compareMaybeDate(a.dueAt, b.dueAt);
      break;
  }

  return sortDirection === "asc" ? result : -result;
}

function compareMaybeDate(a: Date | null, b: Date | null): number {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return a.getTime() - b.getTime();
}

export function TodoBoard({
  todos,
  dispatch,
  availableTags,
  onAddCustomTag,
}: Props) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<TodoSortKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<TodoSortDirection>("desc");

  const visibleTodos = useMemo(() => {
    return [...todos]
      .filter((todo) => matchesQuery(todo, query))
      .sort((a, b) => compareTodos(a, b, sortBy, sortDirection));
  }, [todos, query, sortBy, sortDirection]);

  const active = visibleTodos.filter((t) => t.status === "active");
  const completed = visibleTodos.filter((t) => t.status === "completed");

  return (
    <div>
      <div className="controls-row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, notes, or tags"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as TodoSortKey)}
        >
          <option value="createdAt">Created date</option>
          <option value="dueAt">Due date</option>
          <option value="title">Title</option>
        </select>

        <button
          type="button"
          onClick={() =>
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
          }
        >
          {sortDirection === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>

      <div className="board-container">
        <div className="board-column">
          <h2>Active</h2>
          <TodoList
            todos={active}
            dispatch={dispatch}
            availableTags={availableTags}
            onAddCustomTag={onAddCustomTag}
          />
        </div>

        <div className="board-column">
          <h2>Completed</h2>
          <TodoList
            todos={completed}
            dispatch={dispatch}
            availableTags={availableTags}
            onAddCustomTag={onAddCustomTag}
          />
        </div>
      </div>
    </div>
  );
}

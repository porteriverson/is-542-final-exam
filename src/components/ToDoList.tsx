import type { Todo, Action } from "../types/types";
import { TodoItem } from "./TodoItem";

type Props = {
  todos: readonly Todo[];
  dispatch: React.Dispatch<Action>;
  availableTags: readonly string[];
  onAddCustomTag: (tag: string) => void;
};

export function TodoList({
  todos,
  dispatch,
  availableTags,
  onAddCustomTag,
}: Props) {
  if (todos.length === 0) return <p>No todos</p>;

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          dispatch={dispatch}
          availableTags={availableTags}
          onAddCustomTag={onAddCustomTag}
        />
      ))}
    </ul>
  );
}

import { useState } from "react";
import { type Action, type Todo } from "../types/types";

type TodoItemProps = {
  todo: Todo;
  dispatch: React.Dispatch<Action>;
  availableTags: readonly string[];
  onAddCustomTag: (tag: string) => void;
};

type EditDraft = {
  title: string;
  dueAt: string;
  tags: string[];
  notes: string;
};

function draftFromTodo(todo: Todo): EditDraft {
  return {
    title: todo.title,
    dueAt: todo.dueAt ? todo.dueAt.toISOString().slice(0, 10) : "",
    tags: [...todo.tags],
    notes: todo.notes ?? "",
  };
}

export function TodoItem({
  todo,
  dispatch,
  availableTags,
  onAddCustomTag,
}: TodoItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<EditDraft>(() => draftFromTodo(todo));
  const [selectedTag, setSelectedTag] = useState<string>(
    availableTags[0] ?? "",
  );
  const [customTag, setCustomTag] = useState("");

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (!trimmed) return;

    setDraft((prev) =>
      prev.tags.includes(trimmed)
        ? prev
        : { ...prev, tags: [...prev.tags, trimmed] },
    );
  }

  function removeTag(tag: string) {
    setDraft((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }

  function handleAddSelectedTag() {
    addTag(selectedTag);
  }

  function handleAddCustomTag() {
    const trimmed = customTag.trim();
    if (!trimmed) return;
    onAddCustomTag(trimmed);
    addTag(trimmed);
    setCustomTag("");
  }

  function beginEditing() {
    setDraft(draftFromTodo(todo));
    setSelectedTag(availableTags[0] ?? "");
    setCustomTag("");
    setIsEditing(true);
    setMenuOpen(false);
  }

  function handleSave() {
    dispatch({
      type: "update",
      id: todo.id,
      draft: {
        title: draft.title,
        dueAt: draft.dueAt,
        tags: draft.tags,
        notes: draft.notes,
      },
    });

    setIsEditing(false);
    setMenuOpen(false);
  }

  function handleCancel() {
    setIsEditing(false);
    setMenuOpen(false);
    setDraft(draftFromTodo(todo));
    setSelectedTag(availableTags[0] ?? "");
    setCustomTag("");
  }

  const dueAtText = todo.dueAt ? todo.dueAt.toLocaleDateString() : "None";

  return (
    <li className="todo-item">
      {isEditing ? (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <div>
            <label>
              Title <br />
              <input
                value={draft.title}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </label>
          </div>

          <div>
            <label>
              Due date <br />
              <input
                type="date"
                value={draft.dueAt}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, dueAt: e.target.value }))
                }
              />
            </label>
          </div>

          <div>
            <label>Tags</label>
            <div style={{ marginBottom: "0.5rem", marginTop: "0.25rem" }}>
              {draft.tags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => removeTag(tag)}
                  style={{
                    marginRight: "0.25rem",
                    marginBottom: "0.25rem",
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.875rem",
                  }}
                >
                  {tag} ×
                </button>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                {availableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>

              <button type="button" onClick={handleAddSelectedTag}>
                Add tag
              </button>

              <input
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="new custom tag"
              />
              <button type="button" onClick={handleAddCustomTag}>
                Add custom tag
              </button>
            </div>
          </div>

          <div>
            <label>
              Notes <br />
              <textarea
                value={draft.notes}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, notes: e.target.value }))
                }
                rows={3}
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </label>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            <button type="button" onClick={handleSave}>
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              style={{ background: "#6b7280" }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="todo-item-header">
            <label className="todo-item-label">
              <input
                type="checkbox"
                checked={todo.status === "completed"}
                onChange={(e) =>
                  dispatch({
                    type: e.target.checked ? "markCompleted" : "markActive",
                    id: todo.id,
                  })
                }
              />
              <strong
                style={{
                  textDecoration:
                    todo.status === "completed" ? "line-through" : "none",
                  color: todo.status === "completed" ? "#6b7280" : "inherit",
                }}
              >
                {todo.title}
              </strong>
            </label>

            <div style={{ position: "relative" }}>
              <button
                type="button"
                aria-label="Todo actions"
                onClick={() => setMenuOpen((prev) => !prev)}
                style={{
                  background: "transparent",
                  color: "inherit",
                  padding: "0.25rem 0.5rem",
                  fontSize: "1.25rem",
                }}
              >
                ⋮
              </button>

              {menuOpen && (
                <div className="todo-menu">
                  <button
                    type="button"
                    onClick={beginEditing}
                    style={{
                      background: "transparent",
                      color: "inherit",
                      textAlign: "left",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: "delete", id: todo.id });
                      setMenuOpen(false);
                    }}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      textAlign: "left",
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              marginTop: "0.5rem",
              color: "#4b5563",
              fontSize: "0.875rem",
              display: "grid",
              gap: "0.25rem",
            }}
          >
            <div>Status: {todo.status}</div>
            <div>Created: {todo.createdAt.toLocaleDateString()}</div>
            <div>Due: {dueAtText}</div>
            {todo.status === "completed" && (
              <div>Completed: {todo.completedAt.toLocaleDateString()}</div>
            )}
            {todo.tags.length > 0 && <div>Tags: {todo.tags.join(", ")}</div>}
            {todo.notes && (
              <div style={{ marginTop: "0.25rem" }}>Notes: {todo.notes}</div>
            )}
          </div>
        </>
      )}
    </li>
  );
}

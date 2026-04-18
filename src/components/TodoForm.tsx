import { useState } from "react";
import { type TodoDraft } from "../types/types";

type TodoFormProps = {
  onCreate: (draft: TodoDraft) => void;
  availableTags: readonly string[];
  onAddCustomTag: (tag: string) => void;
};

export function TodoForm({
  onCreate,
  availableTags,
  onAddCustomTag,
}: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>(
    availableTags[0] ?? "",
  );
  const [customTag, setCustomTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (!trimmed) return;

    setTags((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
  }

  function handleCreateCustomTag() {
    const trimmed = customTag.trim();
    if (!trimmed) return;

    onAddCustomTag(trimmed);
    addTag(trimmed);
    setCustomTag("");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (trimmedTitle === "") {
      return;
    }

    onCreate({
      title: trimmedTitle,
      notes: notes.trim() || undefined,
      dueAt,
      tags,
    });

    setTitle("");
    setNotes("");
    setDueAt("");
    setTags([]);
    setSelectedTag(availableTags[0] ?? "");
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div>
        <label>
          Title <br />
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Notes <br />
          <input value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          Due date <br />
          <input
            type="date"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Tag <br />
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            {availableTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => addTag(selectedTag)}
          style={{ marginLeft: "0.5rem" }}
        >
          Add tag
        </button>
      </div>

      <div>
        <label>
          Custom tag <br />
          <input
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            placeholder="type a new tag"
          />
        </label>
        <button
          type="button"
          onClick={handleCreateCustomTag}
          style={{ marginLeft: "0.5rem" }}
        >
          Add custom tag
        </button>
      </div>

      <div>
        <strong>Current Tags:</strong> {tags.join(", ")}
      </div>

      <button type="submit">Add todo</button>
    </form>
  );
}

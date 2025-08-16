import { useState } from "react";
import { addTask } from "../api/tasks";

export default function TaskForm({ onTaskAdded }) {
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    await addTask(description);
    setDescription("");
    onTaskAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mb-6">
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter task..."
        className="flex-1 border rounded px-3 py-2"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer flex flex-wrap"
      >
        Add
      </button>
    </form>
  );
}

import { deleteTask, updateTask } from "../api/tasks";

export default function TaskItem({ task, onUpdate }) {
  const handleNext = async () => {
    let nextStatus = "done";
    if (task.status === "todo") nextStatus = "in-progress";
    else if (task.status === "in-progress") nextStatus = "done";

    await updateTask(task.id, { status: nextStatus });
    onUpdate();
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
    onUpdate();
  };

  const statusColors = {
    todo: "text-red-500",
    "in-progress": "text-yellow-500",
    done: "text-green-500",
  };

  return (
    <div className="flex flex-wrap justify-between items-center border p-2 rounded my-1">
      <div>
        <span className={`font-bold ${statusColors[task.status]}`}>
          {task.status}
        </span>{" "}
        - {task.description}
      </div>
      <div className="flex gap-2">
        {task.status !== "done" && (
          <button
            onClick={handleNext}
            className="bg-yellow-400 px-2 rounded text-black cursor-pointer"
          >
            Next
          </button>
        )}
        <button
          onClick={handleDelete}
          className="bg-red-500 px-2 rounded text-white cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

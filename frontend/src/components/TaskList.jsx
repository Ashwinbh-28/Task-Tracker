import { useEffect, useState, useCallback } from "react";
import { getTasks } from "../api/tasks";
import TaskItem from "./TaskItem";

export default function TaskList({ filter }) {
  const [tasks, setTasks] = useState([]);

  // ✅ fetch tasks from backend
  const fetchTasks = useCallback(async () => {
    const res = await getTasks();
    let data = res.data;

    // ✅ filter only if filter is not ""
    if (filter && filter !== "") {
      data = data.filter((t) => t.status === filter);
    }

    setTasks(data);
  }, [filter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks found.</p>
      ) : (
        tasks.map((task) => (
          <TaskItem key={task.id} task={task} onUpdate={fetchTasks} />
        ))
      )}
    </div>
  );
}

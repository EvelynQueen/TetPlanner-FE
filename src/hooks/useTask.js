import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from "../api/taskApi";

/**
 * useTask — low-level hook that owns all task state and API calls.
 * Consumed by TaskProvider to expose via context.
 */
export const useTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data ?? []);
    } catch (error) {
      console.error("Fetch tasks failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (payload) => {
    const newTask = await createTask(payload);
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const handleUpdate = async (id, payload) => {
    const updated = await updateTask(id, payload);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleStatusChange = async (id, status) => {
    // Optimistic update
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      await updateTaskStatus(id, status);
    } catch (error) {
      console.error("Status update failed", error);
      // Revert on failure
      fetchTasks();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    fetchTasks,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleStatusChange,
  };
};

export default useTask;

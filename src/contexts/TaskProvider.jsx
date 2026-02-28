/**
 * TaskProvider.jsx — state management and API interaction for tasks.
 *
 * Responsibilities:
 *   • Fetch and cache paginated tasks
 *   • Expose CRUD handlers to the component tree
 *   • Centralise all error toasts (one place, no duplicates)
 *   • Sort tasks by due_date asc, then priority desc
 *
 * Architecture:
 *   UI components → useTask() → TaskProvider → api/taskApi.js → mocks/backend
 */
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import TaskContext from "./TaskContext";
import {
  apiGetTasks,
  apiGetTaskById,
  apiCreateTask,
  apiUpdateTask,
  apiDeleteTask,
} from "../api/taskApi";

// ── Constants ──────────────────────────────────────────────────────────────────
const PAGE_SIZE = 10;
const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Sort tasks by due_date asc, then priority desc.
 * Tasks without a due_date are pushed to the end.
 */
const sortTasks = (arr) =>
  [...arr].sort((a, b) => {
    const da = a.due_date ? new Date(a.due_date).getTime() : Infinity;
    const db = b.due_date ? new Date(b.due_date).getTime() : Infinity;
    if (da !== db) return da - db;
    return (PRIORITY_WEIGHT[b.priority] ?? 0) - (PRIORITY_WEIGHT[a.priority] ?? 0);
  });

/**
 * Extract a single user-facing error message from any thrown value.
 * Never throws — always returns a string.
 */
const extractMessage = (err, fallback = "An unexpected error occurred.") =>
  (typeof err?.message === "string" && err.message) ? err.message : fallback;

// ── Provider ───────────────────────────────────────────────────────────────────
export default function TaskProvider({ children }) {
  const [tasks,   setTasks]   = useState([]);
  const [meta,    setMeta]    = useState({ page: 1, size: PAGE_SIZE, totalPages: 1, totalElements: 0 });
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────────────────

  const fetchTasks = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const res             = await apiGetTasks(p, PAGE_SIZE);
      const { content, meta: m } = res.data ?? res;
      setTasks(sortTasks(content ?? []));
      setMeta(m ?? {});
    } catch (err) {
      toast.error(extractMessage(err, "Failed to load tasks."));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchTasks(page);
  }, [page, fetchTasks]);

  // ── Fetch single (EditTask) ──────────────────────────────────────────────────

  const fetchTaskById = async (id) => {
    const res = await apiGetTaskById(id);
    return res.data ?? res;
  };

  // ── Create ───────────────────────────────────────────────────────────────────

  /**
   * Creates a task and optimistically prepends it to the list.
   * Returns the created task so callers can show success feedback.
   * Throws on failure so the form page can catch and stay open.
   */
  const handleCreate = async (data) => {
    try {
      const res     = await apiCreateTask(data);
      const newTask = res.data ?? res;
      setTasks((prev) => sortTasks([newTask, ...prev]));
      setMeta((prev) => ({ ...prev, totalElements: (prev.totalElements ?? 0) + 1 }));
      return newTask;
    } catch (err) {
      toast.error(extractMessage(err, "Failed to create task."));
      throw err;
    }
  };

  // ── Update ───────────────────────────────────────────────────────────────────

  /**
   * Updates a task in-place.
   * Returns the updated task so callers can show before/after feedback.
   * Throws on failure so the form page can catch and stay open.
   */
  const handleUpdate = async (id, data) => {
    try {
      const res     = await apiUpdateTask(id, data);
      const updated = res.data ?? res;
      setTasks((prev) => sortTasks(prev.map((t) => (t.id === updated.id ? updated : t))));
      return updated;
    } catch (err) {
      toast.error(extractMessage(err, "Failed to update task."));
      throw err;
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────

  /**
   * Deletes a task with optimistic local removal.
   * Throws on failure so the caller can revert UI.
   */
  const handleDelete = async (id) => {
    try {
      await apiDeleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setMeta((prev) => ({ ...prev, totalElements: Math.max(0, (prev.totalElements ?? 1) - 1) }));
    } catch (err) {
      toast.error(extractMessage(err, "Failed to delete task."));
      throw err;
    }
  };

  // ── Restore (undo delete) ────────────────────────────────────────────────────

  /**
   * Re-inserts a previously deleted task (undo flow).
   * Uses create endpoint; the task gets a new id from the server.
   */
  const handleRestore = async (task) => {
    try {
      const { id: _id, created_at: _ca, updated_at: _ua, ...payload } = task;
      return await handleCreate(payload);
    } catch {
      // handleCreate already toasted — swallow here to avoid double toast
    }
  };

  // ── Status (optimistic inline toggle) ───────────────────────────────────────

  const handleStatusUpdate = (id, status) => {
    setTasks((prev) => sortTasks(prev.map((t) => (t.id === id ? { ...t, status } : t))));
    apiUpdateTask(id, { status }).catch(() => {
      toast.error("Failed to update status. Refreshing…");
      fetchTasks(page);
    });
  };

  // ── Pagination ───────────────────────────────────────────────────────────────

  const handlePageChange = (next) => {
    if (next < 1 || next > (meta.totalPages ?? 1)) return;
    setPage(next);
  };

  // ── Context value ────────────────────────────────────────────────────────────

  const value = {
    // State
    tasks,
    loading,
    page,
    meta,
    // Operations
    fetchTasks,
    fetchTaskById,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleRestore,
    handleStatusUpdate,
    handlePageChange,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}


/**
 * taskService.js — re-exports task API functions.
 * Business logic lives in hooks/useTask.js; HTTP calls in api/taskApi.js.
 */
export {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../api/taskApi";



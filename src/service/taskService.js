
import {
  mockGetTasks,
  mockGetTaskById,
  mockCreateTask,
  mockUpdateTask,
  mockDeleteTask,
} from "../mocks/taskMock";

/**
 * GET /tasks?page=1&size=10
 * @param {number} page  1-based page index
 * @param {number} size  items per page
 * @returns {Promise<{ content: Task[], meta: PageMeta }>}
 */
export const getTasks = (page = 1, size = 10) => mockGetTasks(page, size);

/**
 * GET /tasks/:id
 * @param {number} id
 * @returns {Promise<Task>}
 */
export const getTaskById = (id) => mockGetTaskById(id);

/**
 * POST /tasks
 * @param {{ title, description, category_id, priority, status, start_date, start_time, due_date, due_time }} payload
 * @returns {Promise<Task>}
 */
export const createTask = (payload) => mockCreateTask(payload);

/**
 * PUT /tasks/:id
 * @param {string} id  UUID
 * @param {{ title, description, category_id, priority, status, start_date, start_time, due_date, due_time }} payload
 * @returns {Promise<Task>}
 */
export const updateTask = (id, payload) => mockUpdateTask(id, payload);

/**
 * DELETE /tasks/:id
 * @param {string} id  UUID
 * @returns {Promise<void>}
 */
export const deleteTask = (id) => mockDeleteTask(id);


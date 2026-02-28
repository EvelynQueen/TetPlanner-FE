import {
  mockGetTasks,
  mockGetTaskById,
  mockCreateTask,
  mockUpdateTask,
  mockDeleteTask,
} from "../mocks/taskMock";

/** GET /tasks?page=&size= */
export const apiGetTasks = (page = 1, size = 10) =>
  mockGetTasks(page, size);

/** GET /tasks/:id */
export const apiGetTaskById = (id) =>
  mockGetTaskById(id);

/** POST /tasks */
export const apiCreateTask = (payload) =>
  mockCreateTask(payload);

/** PUT /tasks/:id */
export const apiUpdateTask = (id, payload) =>
  mockUpdateTask(id, payload);

/** DELETE /tasks/:id */
export const apiDeleteTask = (id) =>
  mockDeleteTask(id);

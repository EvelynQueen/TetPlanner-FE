import { api } from "../config/api";

/**
 * GET /api/task-categories
 * Returns all task categories for the authenticated user.
 * Response: BaseResponse<List<TaskCategoryResponse>>
 */
export const getTaskCategories = async () => {
    const res = await api.get("/task-categories");
    return res.data.data;
};

/**
 * GET /api/task-categories/:id
 * Returns a single task category by ID.
 * Response: BaseResponse<TaskCategoryResponse>
 */
export const getTaskCategoryById = async (id) => {
    const res = await api.get(`/task-categories/${id}`);
    return res.data.data;
};

/**
 * POST /api/task-categories
 * @param {{ name: string }} payload
 * Response: BaseResponse<TaskCategoryResponse>
 */
export const createTaskCategory = async (payload) => {
    const res = await api.post("/task-categories", payload);
    return res.data.data;
};

/**
 * PUT /api/task-categories/:id
 * @param {number} id
 * @param {{ name: string }} payload
 * Response: BaseResponse<TaskCategoryResponse>
 */
export const updateTaskCategory = async (id, payload) => {
    const res = await api.put(`/task-categories/${id}`, payload);
    return res.data.data;
};

/**
 * DELETE /api/task-categories/:id
 * Response: BaseResponse<?>
 */
export const deleteTaskCategory = async (id) => {
    const res = await api.delete(`/task-categories/${id}`);
    return res.data.success;
};

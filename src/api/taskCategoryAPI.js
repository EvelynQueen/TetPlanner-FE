import { api } from "../config/api";

export const taskCategoryAPI = {
  // GET /api/task-categories
  getTaskCategories: async () => {
    const response = await api.get("/task-categories");
    return response.data.data;
  },
  // POST /api/task-categories
  // Expected payload: { name: "string" }
  createTaskCategory: async (categoryData) => {
    const response = await api.post("/task-categories", categoryData);
    return response.data;
  },

  // PUT /api/task-categories/{id}
  // Expected payload: { name: "string" }
  updateTaskCategory: async (id, categoryData) => {
    const response = await api.put(`/task-categories/${id}`, categoryData);
    return response.data;
  },

  // GET /api/task-categories/{id}
  getTaskCategoryDetail: async (id) => {
    const response = await api.get(`/task-categories/${id}`);
    return response.data;
  },

  // DELETE /api/task-categories/{id}
  deleteTaskCategory: async (id) => {
    const response = await api.delete(`/task-categories/${id}`);
    return response.data;
  },
};

// Named exports for convenience and compatibility with existing imports
export const getTaskCategories = taskCategoryAPI.getTaskCategories;
export const createTaskCategory = taskCategoryAPI.createTaskCategory;
export const updateTaskCategory = taskCategoryAPI.updateTaskCategory;
export const getTaskCategoryDetail = taskCategoryAPI.getTaskCategoryDetail;
export const deleteTaskCategory = taskCategoryAPI.deleteTaskCategory;

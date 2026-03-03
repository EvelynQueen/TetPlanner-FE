import { api } from "../config/api";

export const budgetAPI = {
  // GET /api/budget
  getBudgets: async (page = 0, size = 10) => {
    try {
      const response = await api.get("/budget", {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching budgets:", error);
      throw error;
    }
  },

  // GET /api/budget/{budgetId}/summary
  getBudgetSummary: async (budgetId) => {
    const response = await api.get(`/budget/${budgetId}/summary`);
    return response.data;
  },

  // [BỔ SUNG] GET /api/budget/{budgetId}/progress
  getBudgetProgress: async (budgetId) => {
    const response = await api.get(`/budget/${budgetId}/progress`);
    return response.data;
  },

  // POST /api/budget
  createBudget: async (budgetData) => {
    const response = await api.post("/budget", budgetData);
    return response.data;
  },

  // PUT /api/budget/{budgetId}
  updateBudget: async (budgetId, budgetData) => {
    const response = await api.put(`/budget/${budgetId}`, budgetData);
    return response.data;
  },

  // DELETE /api/budget/{budgetId}
  deleteBudget: async (budgetId) => {
    const response = await api.delete(`/budget/${budgetId}`);
    return response.data;
  },
};

export const {
  getBudgets,
  getBudgetSummary,
  getBudgetProgress,
  createBudget,
  updateBudget,
  deleteBudget,
} = budgetAPI;

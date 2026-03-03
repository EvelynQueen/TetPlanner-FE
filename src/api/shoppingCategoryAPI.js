import { api } from "../config/api";

export const shoppingCategoryAPI = {
  // GET /api/shopping-categories
  getShoppingCategories: async () => {
    const response = await api.get("/shopping-categories");
    return response.data;
  },

  // POST /api/shopping-categories
  // Expected payload: { name: "string" }
  createShoppingCategory: async (categoryData) => {
    const response = await api.post("/shopping-categories", categoryData);
    return response.data;
  },

  // PUT /api/shopping-categories/{id}
  // Expected payload: { name: "string" }
  updateShoppingCategory: async (id, categoryData) => {
    const response = await api.put(`/shopping-categories/${id}`, categoryData);
    return response.data;
  },

  // GET /api/shopping-categories/{id}
  getShoppingCategoryDetail: async (id) => {
    const response = await api.get(`/shopping-categories/${id}`);
    return response.data;
  },

  // DELETE /api/shopping-categories/{id}
  deleteShoppingCategory: async (id) => {
    const response = await api.delete(`/shopping-categories/${id}`);
    return response.data;
  },
};

// Named exports để tiện import trực tiếp vào các component hoặc Context
export const getShoppingCategories = shoppingCategoryAPI.getShoppingCategories;
export const createShoppingCategory =
  shoppingCategoryAPI.createShoppingCategory;
export const updateShoppingCategory =
  shoppingCategoryAPI.updateShoppingCategory;
export const getShoppingCategoryDetail =
  shoppingCategoryAPI.getShoppingCategoryDetail;
export const deleteShoppingCategory =
  shoppingCategoryAPI.deleteShoppingCategory;

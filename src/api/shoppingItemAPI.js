import { api } from "../config/api";

const BASE_URL = "/shopping-items";

export const shoppingItemAPI = {
  // GET ITEMS BY BUDGET (Đã bọc giáp chống crash)
  getItemsByBudget: async (budgetId, page = 0, size = 10) => {
    try {
      const response = await api.get(`${BASE_URL}/budget/${budgetId}`, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      // Nếu lỗi 404, tự động trả về mảng rỗng để bảng Shopping không bị sập
      if (error.response?.status === 404) {
        console.warn(
          `Backend trả về 404 cho Budget ID: ${budgetId}. Có thể endpoint chưa được deploy.`,
        );
        return {
          success: true,
          data: { content: [], totalElements: 0, totalPages: 0 },
        };
      }
      throw error; // Quăng các lỗi khác (500, 401...) ra ngoài
    }
  },

  // POST
  createItem: async (itemData) => {
    const response = await api.post(BASE_URL, itemData);
    return response.data;
  },

  // PUT
  updateItem: async (itemId, updateData) => {
    const response = await api.put(`${BASE_URL}/${itemId}`, updateData);
    return response.data;
  },

  // GET DETAIL
  getItemDetail: async (itemId) => {
    const response = await api.get(`${BASE_URL}/${itemId}`);
    return response.data;
  },

  // DELETE
  deleteItem: async (itemId) => {
    const response = await api.delete(`${BASE_URL}/${itemId}`);
    return response.data;
  },
};

export const {
  getItemsByBudget,
  createItem,
  updateItem,
  getItemDetail,
  deleteItem,
} = shoppingItemAPI;

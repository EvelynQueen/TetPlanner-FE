import axios from "axios";

const BASE_URL = "/api/shopping-items";

export const shoppingItemAPI = {
  // POST
  createItem: async (itemData) => {
    const response = await axios.post(`${BASE_URL}`, itemData);
    return response.data;
  },

  // PUT
  updateItem: async (itemId, updateData) => {
    const response = await axios.put(`${BASE_URL}/${itemId}`, updateData);
    return response.data;
  },

  // DELETE
  deleteItem: async (itemId) => {
    const response = await axios.delete(`${BASE_URL}/${itemId}`);
    return response.data;
  },

  // GET ALL ITEMS
  getAllItems: async (page = 0, size = 10) => {
    const response = await axios.get(`${BASE_URL}`, {
      params: { page, size },
    });
    return response.data;
  },

  // GET DETAIL
  getItemDetail: async (itemId) => {
    const response = await axios.get(`${BASE_URL}/${itemId}`);
    return response.data;
  },
};

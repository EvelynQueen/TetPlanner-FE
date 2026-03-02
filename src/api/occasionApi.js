import { api } from "../config/api";

/**
 * GET /api/occasions
 * Returns all occasions for the authenticated user.
 * Response: BaseResponse<List<OccasionResponse>>
 */
export const getOccasions = async () => {
  const res = await api.get("/occasions");
  return res.data.data;
};

/**
 * GET /api/occasions/:id
 * Returns a single occasion by ID.
 * Response: BaseResponse<OccasionResponse>
 */
export const getOccasionById = async (id) => {
  const res = await api.get(`/occasions/${id}`);
  return res.data.data;
};

/**
 * POST /api/occasions
 * @param {{ name: string, date: string }} payload
 * Response: BaseResponse<OccasionResponse>
 */
export const createOccasion = async (payload) => {
  const res = await api.post("/occasions", payload);
  return res.data.data;
};

/**
 * PUT /api/occasions/:id
 * @param {string} id
 * @param {{ name?: string, date?: string }} payload
 * Response: BaseResponse<OccasionResponse>
 */
export const updateOccasion = async (id, payload) => {
  const res = await api.put(`/occasions/${id}`, payload);
  return res.data.data;
};

/**
 * DELETE /api/occasions/:id
 * Response: BaseResponse<Void>
 */
export const deleteOccasion = async (id) => {
  const res = await api.delete(`/occasions/${id}`);
  return res.data.success;
};

/**
 * GET /api/occasions/range?from=...&to=...
 * Returns occasions within a date range.
 * Response: BaseResponse<List<OccasionResponse>>
 */
export const getOccasionsByDateRange = async (from, to) => {
  const res = await api.get("/occasions/range", { params: { from, to } });
  return res.data.data;
};

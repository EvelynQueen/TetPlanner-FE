/**
 * occasionService.js — service layer for occasion CRUD.
 * Now delegates to real API calls (backend is ready).
 */
export {
  getOccasions,
  getOccasionById,
  createOccasion,
  updateOccasion,
  deleteOccasion,
  getOccasionsByDateRange,
} from "../api/occasionApi";

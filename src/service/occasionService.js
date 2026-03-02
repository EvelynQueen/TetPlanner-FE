/**
 * occasionService.js — service layer for occasion CRUD.
 * Delegates to mock; swap for real API calls when backend is ready.
 */
export {
  mockGetOccasions    as getOccasions,
  mockCreateOccasion  as createOccasion,
  mockUpdateOccasion  as updateOccasion,
  mockDeleteOccasion  as deleteOccasion,
} from "../mock/occasionMock";

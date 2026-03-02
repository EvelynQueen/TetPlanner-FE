/**
 * categoryService.js — service layer for category CRUD.
 * Delegates to mock; swap for real API calls when backend is ready.
 */
export {
  mockGetCategories    as getCategories,
  mockCreateCategory   as createCategory,
  mockUpdateCategory   as updateCategory,
  mockDeleteCategory   as deleteCategory,
} from "../mock/categoryMock";

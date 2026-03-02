/**
 * categoryService.js — service layer for task category CRUD.
 * Now delegates to real API calls (backend is ready).
 */
export {
  getTaskCategories as getCategories,
  getTaskCategoryById as getCategoryById,
  createTaskCategory as createCategory,
  updateTaskCategory as updateCategory,
  deleteTaskCategory as deleteCategory,
} from "../api/taskCategoryApi";

import React, { useState, useCallback, useEffect } from "react";
import { taskCategoryAPI } from "../api/taskCategoryAPI";
import { toast } from "react-toastify";
import { TaskCategoryContext } from "./TaskCategoryContext";

// 1. Phải export Context để custom hook (useTaskCategory) có thể sử dụng

// 2. Create the Provider Component
export const TaskCategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  // READ: Fetch all categories
  const fetchCategories = useCallback(async () => {
    // Nếu đang tải rồi thì không gọi lại nữa để tránh lặp
    if (loading) return;

    setLoading(true);
    try {
      const res = await taskCategoryAPI.getTaskCategories();
      // QUAN TRỌNG NHẤT LÀ ĐOẠN NÀY:
      // Tuỳ thuộc vào API file của bạn trả về `res` hay `res.data`
      // Dựa theo file taskCategoryAPI.js của bạn, nó trả về res.data.data (là mảng)
      if (res && Array.isArray(res)) {
        setCategories(res); // Nếu file API đã return response.data.data
      } else if (res && res.success && Array.isArray(res.data)) {
        setCategories(res.data); // Nếu file API return response.data
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching task categories:", error);
      toast.error(
        error.response?.data?.message || "Failed to load categories.",
      );
      setCategories([]);
    } finally {
      setLoading(false);
      setInitialFetchDone(true);
    }
  }, [loading]); // Bỏ qua dependency loading nếu bạn muốn an toàn tuyệt đối, nhưng nên giữ để tránh gọi đúp

  // Fetch categories automatically when the provider mounts
  useEffect(() => {
    if (!initialFetchDone) {
      fetchCategories();
    }
  }, [fetchCategories, initialFetchDone]);

  // CREATE: Add a new category
  const addCategory = async (categoryData) => {
    setLoading(true);
    try {
      const res = await taskCategoryAPI.createTaskCategory(categoryData);
      if (res && res.success) {
        // Optimistically update the state with the new category
        // Kiểm tra chắc chắn res.data tồn tại
        const newCat = res.data;
        if (newCat) {
          setCategories((prev) => [...prev, newCat]);
        }
        toast.success("Category created successfully!");
        return { success: true, data: newCat };
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(
        error.response?.data?.message || "Failed to create category.",
      );
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // UPDATE: Edit an existing category
  const editCategory = async (id, categoryData) => {
    setLoading(true);
    try {
      const res = await taskCategoryAPI.updateTaskCategory(id, categoryData);
      if (res && res.success) {
        const updatedCat = res.data;
        // Update the specific category in the local state
        setCategories((prev) =>
          prev.map((cat) => (cat.id === id ? updatedCat : cat)),
        );
        toast.success("Category updated successfully!");
        return { success: true, data: updatedCat };
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(
        error.response?.data?.message || "Failed to update category.",
      );
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // DELETE: Remove a category
  const removeCategory = async (id) => {
    setLoading(true);
    try {
      const res = await taskCategoryAPI.deleteTaskCategory(id);
      if (res && res.success) {
        // Remove the category from local state
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        toast.success("Category deleted successfully!");
        return { success: true };
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete category.",
      );
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // The value object to be provided to consuming components
  const value = {
    categories,
    loading,
    fetchCategories,
    addCategory,
    editCategory,
    removeCategory,
  };

  return (
    <TaskCategoryContext.Provider value={value}>
      {children}
    </TaskCategoryContext.Provider>
  );
};

import React, { useState, useCallback } from "react";
import {
  getBudgets,
  getBudgetSummary,
  getBudgetProgress,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../api/budgetAPI";
import { BudgetContext } from "./BudgetContext";

// Tạo Context

export function BudgetProvider({ children }) {
  const [budgets, setBudgets] = useState([]);
  const [generalSummary, setGeneralSummary] = useState(null);

  const [currentBudgetDetails, setCurrentBudgetDetails] = useState(null);
  const [currentBudgetProgress, setCurrentBudgetProgress] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearError = useCallback(() => setError(""), []);

  // --- Actions ---

  const fetchBudgets = useCallback(async (page = 0, size = 10) => {
    setLoading(true);
    setError("");
    try {
      const response = await getBudgets(page, size);
      if (response.success && response.data) {
        setBudgets(response.data.budgets || []);
        setGeneralSummary(response.data.summary || null);
      }
      return response;
    } catch (err) {
      setError(err.message || "Lỗi khi tải danh sách ngân sách.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBudgetDetails = useCallback(async (budgetId) => {
    setLoading(true);
    setError("");
    try {
      const response = await getBudgetSummary(budgetId);
      if (response.success && response.data) {
        setCurrentBudgetDetails(response.data);
      }
      return response;
    } catch (err) {
      setError(err.message || "Lỗi khi tải chi tiết ngân sách.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBudgetProgress = useCallback(async (budgetId) => {
    setLoading(true);
    setError("");
    try {
      const response = await getBudgetProgress(budgetId);
      if (response.success && response.data) {
        setCurrentBudgetProgress(response.data);
      }
      return response;
    } catch (err) {
      setError(err.message || "Lỗi khi tải tiến độ ngân sách.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addBudget = useCallback(async (budgetData) => {
    setLoading(true);
    setError("");
    try {
      const response = await createBudget(budgetData);
      return response;
    } catch (err) {
      setError(err.message || "Lỗi khi tạo ngân sách mới.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const editBudget = useCallback(async (budgetId, budgetData) => {
    setLoading(true);
    setError("");
    try {
      const response = await updateBudget(budgetId, budgetData);
      return response;
    } catch (err) {
      setError(err.message || "Lỗi khi cập nhật ngân sách.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeBudget = useCallback(async (budgetId) => {
    setLoading(true);
    setError("");
    try {
      const response = await deleteBudget(budgetId);
      return response;
    } catch (err) {
      setError(err.message || "Lỗi khi xóa ngân sách.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <BudgetContext.Provider
      value={{
        // State
        budgets,
        generalSummary,
        currentBudgetDetails,
        currentBudgetProgress,
        loading,
        error,
        // Methods
        fetchBudgets,
        fetchBudgetDetails,
        fetchBudgetProgress,
        addBudget,
        editBudget,
        removeBudget,
        clearError,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

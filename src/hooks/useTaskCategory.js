import { useContext } from "react";
import { TaskCategoryContext } from "../contexts/TaskCategoryContext";

// 3. Create a custom hook for easy consumption
export const useTaskCategory = () => {
  const context = useContext(TaskCategoryContext);
  if (!context) {
    throw new Error(
      "useTaskCategory must be used within a TaskCategoryProvider",
    );
  }
  return context;
};

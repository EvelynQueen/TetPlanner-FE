/**
 * useTask.js — custom hook to consume TaskContext.
 *
 * Components must use this hook instead of calling useContext(TaskContext) directly.
 * Throws a clear error when used outside a <TaskProvider>.
 */
import { useContext } from "react";
import TaskContext from "../contexts/TaskContext";

const useTask = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error("useTask must be used within a <TaskProvider>. Wrap the relevant route/component tree with <TaskProvider>.");
  }
  return ctx;
};

export default useTask;

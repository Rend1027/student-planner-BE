import { useState, useEffect } from "react";
import {
  apiGetTasks,
  apiCreateTask,
  apiUpdateTask,
  apiDeleteTask,
} from "../api/client";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await apiGetTasks();
      setTasks(data || []);
    } catch (err) {
      console.error("Failed to load tasks", err);
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  async function createTask(taskData) {
    try {
      await apiCreateTask(taskData);
      await loadTasks();
      return { success: true };
    } catch (err) {
      throw err;
    }
  }

  async function updateTask(taskData) {
    try {
      await apiUpdateTask(taskData);
      await loadTasks();
      return { success: true };
    } catch (err) {
      throw err;
    }
  }

  async function deleteTask(id) {
    try {
      await apiDeleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      return { success: true };
    } catch (err) {
      throw err;
    }
  }

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks: loadTasks,
  };
}


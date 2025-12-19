import { useState, useEffect } from "react";
import {
  apiGetEvents,
  apiCreateEvent,
  apiUpdateEvent,
  apiDeleteEvent,
} from "../api/client";

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    setError("");
    try {
      const data = await apiGetEvents();
      setEvents(data || []);
    } catch (err) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  }

  async function createEvent(eventData) {
    try {
      const response = await apiCreateEvent(eventData);
      const newEvent = response?.data || response;
      await loadEvents();
      return newEvent;
    } catch (err) {
      throw err;
    }
  }

  async function updateEvent(eventData) {
    try {
      await apiUpdateEvent(eventData);
      await loadEvents();
      return { success: true };
    } catch (err) {
      throw err;
    }
  }

  async function deleteEvent(id) {
    try {
      await apiDeleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      return { success: true };
    } catch (err) {
      throw err;
    }
  }

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refreshEvents: loadEvents,
  };
}


import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";

export function EventForm({
  isOpen,
  onClose,
  onSubmit,
  editingEvent,
  loading,
  error,
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
    day_of_week: "mon",
    type: "event",
  });
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (editingEvent) {
      setForm({
        title: editingEvent.title || "",
        description: editingEvent.description || "",
        date: editingEvent.date || "",
        start_time: editingEvent.start_time || "",
        end_time: editingEvent.end_time || "",
        day_of_week: editingEvent.day_of_week || "mon",
        type: editingEvent.type || "event",
      });
    } else {
      setForm({
        title: "",
        description: "",
        date: "",
        start_time: "",
        end_time: "",
        day_of_week: "mon",
        type: "event",
      });
    }
    setValidationError("");
  }, [editingEvent, isOpen]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setValidationError("");

    // Validate required fields
    if (!form.title || form.title.trim() === "") {
      setValidationError("Title is required");
      return;
    }
    if (!form.start_time || !form.end_time) {
      setValidationError("Start time and end time are required");
      return;
    }
    if (form.type === "event" && !form.date) {
      setValidationError("Date is required for events");
      return;
    }
    if (form.type === "class" && !form.day_of_week) {
      setValidationError("Day of week is required for classes");
      return;
    }

    // Format date to YYYY-MM-DD if it's not already
    // HTML date inputs return YYYY-MM-DD format, but we'll ensure it's correct
    let formattedDate = form.date;
    if (form.type === "event" && form.date) {
      // If date is already in YYYY-MM-DD format (from date input), use it directly
      // Otherwise, try to parse and format it
      if (!/^\d{4}-\d{2}-\d{2}$/.test(form.date)) {
        const dateObj = new Date(form.date);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString().split('T')[0];
        }
      }
    }

    // Calculate day_of_week from date for events
    // Database requires day_of_week to be a valid ENUM value, not NULL or empty
    let dayOfWeek = form.day_of_week;
    if (form.type === "event" && form.date) {
      const dateObj = new Date(formattedDate);
      const dayIndex = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      dayOfWeek = dayMap[dayIndex];
    }

    const payload = {
      title: form.title.trim(),
      description: form.description ? form.description.trim() : null,
      start_time: form.start_time,
      end_time: form.end_time,
      type: form.type,
      date: form.type === "event" ? formattedDate : null,
      day_of_week: dayOfWeek, // Valid ENUM value for both classes and events
    };

    console.log("Event payload being sent:", JSON.stringify(payload, null, 2));
    onSubmit(editingEvent ? { id: editingEvent.id, ...payload } : payload);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingEvent ? "Edit Event" : "New Event"}
    >
      {(error || validationError) && (
        <div className="toast toast-error">{error || validationError}</div>
      )}
      <form className="sheet-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Title</span>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="CIS 211 Lecture, Dentist..."
            required
          />
        </label>

        <label className="field">
          <span>Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Optional notes"
          />
        </label>

        <label className="field">
          <span>Type</span>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="event">Event / Appointment</option>
            <option value="class">Class</option>
          </select>
        </label>

        {form.type === "event" && (
          <label className="field">
            <span>Date</span>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </label>
        )}

        {form.type === "class" && (
          <label className="field">
            <span>Day of Week</span>
            <select
              name="day_of_week"
              value={form.day_of_week}
              onChange={handleChange}
              required
            >
              <option value="mon">Monday</option>
              <option value="tue">Tuesday</option>
              <option value="wed">Wednesday</option>
              <option value="thu">Thursday</option>
              <option value="fri">Friday</option>
              <option value="sat">Saturday</option>
              <option value="sun">Sunday</option>
            </select>
          </label>
        )}

        <div className="field inline-fields">
          <label>
            <span>Start time</span>
            <input
              type="time"
              name="start_time"
              value={form.start_time}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <span>End time</span>
            <input
              type="time"
              name="end_time"
              value={form.end_time}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-small"></span>
              <span>Saving...</span>
            </>
          ) : editingEvent ? (
            "Save changes"
          ) : (
            "Create event"
          )}
        </button>
      </form>
    </Modal>
  );
}


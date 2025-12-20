import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";

export function TaskForm({
  isOpen,
  onClose,
  onSubmit,
  editingTask,
  loading,
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
    due_time: "",
  });

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || "",
        description: editingTask.description || "",
        due_date: editingTask.due_date || "",
        due_time: editingTask.due_time || "",
      });
    } else {
      setForm({
        title: "",
        description: "",
        due_date: "",
        due_time: "",
      });
    }
  }, [editingTask, isOpen]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.title) {
      return;
    }

    const payload = {
      title: form.title,
      description: form.description || null,
      due_date: form.due_date || null,
      due_time: form.due_time || null,
      alarm_time: null,
    };

    onSubmit(editingTask ? { id: editingTask.id, ...payload } : payload);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTask ? "Edit Task" : "New Task"}
    >
      <form className="sheet-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Title</span>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Finish CSC homework..."
            required
          />
        </label>

        <label className="field">
          <span>Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Optional details"
          />
        </label>

        <label className="field">
          <span>Due date</span>
          <input
            type="date"
            name="due_date"
            value={form.due_date}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>Due time</span>
          <input
            type="time"
            name="due_time"
            value={form.due_time}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-small"></span>
              <span>Saving...</span>
            </>
          ) : editingTask ? (
            "Save task"
          ) : (
            "Create task"
          )}
        </button>
      </form>
    </Modal>
  );
}


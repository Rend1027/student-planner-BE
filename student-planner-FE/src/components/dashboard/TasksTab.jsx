import { useState } from "react";
import { formatDate, formatTime } from "../../utils/dateHelpers";

export function TasksTab({ tasks, loading, onEdit, onDelete, onComplete }) {
  // Show all tasks (completed tasks are deleted, so no need to filter)
  const activeTasks = tasks || [];

  if (loading) {
    return (
      <section className="panel-shell">
        <h2 className="panel-title">Tasks</h2>
        <p className="muted">Loading your tasks...</p>
      </section>
    );
  }

  if (!activeTasks || activeTasks.length === 0) {
    return (
      <section className="panel-shell">
        <h2 className="panel-title">Tasks</h2>
        <p className="panel-subtext">
          No active tasks. Tap the + button to add your first task.
        </p>
      </section>
    );
  }

  return (
    <section className="panel-shell">
      <h2 className="panel-title">Tasks</h2>
      <ul className="task-checklist">
        {activeTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onComplete={onComplete}
          />
        ))}
      </ul>
    </section>
  );
}

function TaskItem({ task, onEdit, onDelete, onComplete }) {
  const [isCompleting, setIsCompleting] = useState(false);

  async function handleCheckboxChange() {
    setIsCompleting(true);
    // Wait for animation to complete before calling onComplete
    setTimeout(() => {
      if (onComplete) {
        onComplete(task);
      }
    }, 300);
  }

  return (
    <li className={`task-item ${isCompleting ? "task-item-completing" : ""}`}>
      <div className="task-item-content">
        <label className="task-checkbox-wrapper">
          <input
            type="checkbox"
            className="task-checkbox"
            checked={false}
            onChange={handleCheckboxChange}
            aria-label={`Mark "${task.title}" as complete`}
          />
          <span className="task-checkbox-custom"></span>
        </label>
        
        <div className="task-details">
          <h3 className="task-title">{task.title}</h3>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          {task.due_date && (
            <span className="task-due-date">
              Due {formatDate(task.due_date)}
              {task.due_time && ` at ${formatTime(task.due_time)}`}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button 
          className="task-action-btn task-edit-btn" 
          onClick={() => onEdit(task)}
          aria-label="Edit task"
        >
          Edit
        </button>
        <button
          className="task-action-btn task-delete-btn"
          onClick={() => onDelete(task)}
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

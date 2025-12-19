import { formatDate } from "../../utils/dateHelpers";
import { Modal } from "../ui/Modal";

export function TaskHistory({ isOpen, onClose, completedTasks }) {
  if (!isOpen) return null;

  const sortedTasks = [...(completedTasks || [])].sort((a, b) => {
    const dateA = new Date(a.completed_at || a.created_at || 0);
    const dateB = new Date(b.completed_at || b.created_at || 0);
    return dateB - dateA; // Most recent first
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task History">
      <div className="task-history-content">
        {!sortedTasks || sortedTasks.length === 0 ? (
          <div className="task-history-empty">
            <p>No completed tasks yet.</p>
            <p className="muted">Complete tasks to see them here.</p>
          </div>
        ) : (
          <ul className="task-history-list">
            {sortedTasks.map((task) => (
              <li key={task.id} className="task-history-item">
                <div className="task-history-checkbox">
                  <span className="task-history-checkmark">✓</span>
                </div>
                <div className="task-history-details">
                  <h4 className="task-history-title">{task.title}</h4>
                  {task.description && (
                    <p className="task-history-description">{task.description}</p>
                  )}
                  <span className="task-history-date">
                    {(() => {
                      const dateStr = task.completed_at || task.created_at;
                      if (!dateStr) return "Completed";
                      try {
                        // Handle ISO date strings
                        const date = new Date(dateStr);
                        return `Completed ${date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
                      } catch {
                        return "Completed";
                      }
                    })()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}


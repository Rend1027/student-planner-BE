import { TYPE_META, DAY_LABELS } from "../../utils/constants";
import {
  formatTime,
  formatDate,
  isToday,
  isTomorrow,
  formatNextUpShort,
} from "../../utils/dateHelpers";
import { isEventPast } from "../../utils/eventHelpers";

export function EventCard({
  event,
  isUpcoming,
  upcomingMins,
  onEdit,
  onDelete,
  isNewlyCreated = false,
}) {
  const typeMeta = TYPE_META[event.type] || {
    label: event.type,
    emoji: "•",
  };

  const isTodayEvent = event.type === "event" && isToday(event.date);
  const isTomorrowEvent = event.type === "event" && isTomorrow(event.date);
  const past = event.type === "event" && isEventPast(event);

  let dateLine = "";
  if (event.type === "class") {
    dateLine = `${
      DAY_LABELS[event.day_of_week] || event.day_of_week?.toUpperCase()
    } · ${formatTime(event.start_time)} – ${formatTime(event.end_time)}`;
  } else {
    let prefix = formatDate(event.date);
    if (isTodayEvent) prefix = "Today";
    else if (isTomorrowEvent) prefix = "Tomorrow";

    dateLine = `${prefix} · ${formatTime(event.start_time)} – ${formatTime(
      event.end_time
    )}`;
  }

  return (
    <li
      className={`event-card event-${event.type} ${past ? "event-past" : ""} ${isNewlyCreated ? "event-created" : ""} ${isUpcoming && !past ? "event-upcoming" : ""}`}
    >
      <div className="event-main">
        <div className="event-header">
          <div className="event-type-badge">
            <span className="event-type-emoji">{typeMeta.emoji}</span>
            <span className="event-type-label">{typeMeta.label}</span>
          </div>
          {isUpcoming && !past && (
            <span className="tag-nextup">
              <span className="tag-nextup-icon">⏰</span>
              <span className="tag-nextup-text">
                {upcomingMins !== undefined
                  ? formatNextUpShort(upcomingMins)
                  : "Next up"}
              </span>
            </span>
          )}
        </div>

        <h3 className="event-title">{event.title}</h3>

        {event.description && (
          <p className="event-description">{event.description}</p>
        )}

        <div className="event-meta">
          <div className="event-time-display">
            <span className="event-time-icon">🕐</span>
            <span className="event-time-text">{dateLine}</span>
          </div>
          {past && <span className="tag-done">Done ✓</span>}
        </div>
      </div>

      <div className="event-actions">
        <button 
          className="btn-event-action btn-edit" 
          onClick={() => onEdit(event)}
          aria-label="Edit event"
        >
          <span className="btn-icon">✏️</span>
          <span className="btn-text">Edit</span>
        </button>
        <button 
          className="btn-event-action btn-delete" 
          onClick={() => onDelete(event)}
          aria-label="Delete event"
        >
          <span className="btn-icon">🗑️</span>
          <span className="btn-text">Delete</span>
        </button>
      </div>
    </li>
  );
}


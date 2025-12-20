import { EventCard } from "./EventCard";
import { minutesUntil } from "../../utils/dateHelpers";

export function EventList({ events, upcomingEvent, onEdit, onDelete, newlyCreatedEventId }) {
  if (events.length === 0) {
    return (
      <div className="empty-state">
        <p>No events yet.</p>
        <p className="muted">
          Tap the + button to add your first class or event.
        </p>
      </div>
    );
  }

  return (
    <ul className="event-list">
      {events.map((ev) => {
        const isUpcoming = upcomingEvent && upcomingEvent.id === ev.id;
        const upcomingMins = isUpcoming
          ? minutesUntil(upcomingEvent.start_time, upcomingEvent.date)
          : undefined;

        const isNewlyCreated = newlyCreatedEventId === ev.id;

        return (
          <EventCard
            key={ev.id}
            event={ev}
            isUpcoming={isUpcoming}
            upcomingMins={upcomingMins}
            onEdit={onEdit}
            onDelete={onDelete}
            isNewlyCreated={isNewlyCreated}
          />
        );
      })}
    </ul>
  );
}


import { useState } from "react";
import { parseLocalDate } from "../../utils/dateHelpers";

export function Calendar({ events = [], onDateClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Helper functions
  const getMonthName = (date) => {
    return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isSameMonth = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth()
    );
  };

  const isToday = (date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  // Get day of week abbreviation from date (0 = Sunday, 1 = Monday, etc.)
  const getDayOfWeekAbbr = (date) => {
    const dayIndex = date.getDay();
    const dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return dayMap[dayIndex];
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dayOfWeek = getDayOfWeekAbbr(date);
    
    return events.filter((event) => {
      // For events/appointments: check if the date matches
      if (event.type === 'event' && event.date) {
        const eventDate = parseLocalDate(event.date);
        if (!eventDate) return false;
        return isSameDay(eventDate, date);
      }
      
      // For classes: check if the day_of_week matches
      if (event.type === 'class' && event.day_of_week) {
        return event.day_of_week === dayOfWeek;
      }
      
      return false;
    });
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Build calendar days - only current month
  const buildCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Add empty cells to align first day of month with correct weekday
    for (let i = 0; i < firstDay; i++) {
      days.push({ date: null, isCurrentMonth: false, isEmpty: true });
    }

    // Current month days only
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true, isEmpty: false });
    }

    return days;
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarDays = buildCalendarDays();

  return (
    <div className="calendar-container">
      {/* Calendar Header */}
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={goToPreviousMonth} aria-label="Previous month">
          ‹
        </button>
        <div className="calendar-month-year">
          <h3 className="calendar-month-title">{getMonthName(currentDate)}</h3>
          <button className="calendar-today-btn" onClick={goToToday}>
            Today
          </button>
        </div>
        <button className="calendar-nav-btn" onClick={goToNextMonth} aria-label="Next month">
          ›
        </button>
      </div>

      {/* Week Days Header */}
      <div className="calendar-weekdays">
        {weekDays.map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {calendarDays.map((dayObj, idx) => {
          const { date: day, isCurrentMonth, isEmpty } = dayObj;
          
          // Empty cell for alignment
          if (isEmpty) {
            return (
              <div
                key={idx}
                className="calendar-day calendar-day-empty"
                aria-hidden="true"
              />
            );
          }

          const isTodayDate = isToday(day);
          const dayEvents = getEventsForDate(day);
          const hasEvents = dayEvents.length > 0;

          return (
            <button
              key={idx}
              className={`calendar-day ${isTodayDate ? "calendar-day-today" : ""} ${hasEvents ? "calendar-day-has-events" : ""}`}
              onClick={() => onDateClick && onDateClick(day)}
              aria-label={day.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            >
              <span className="calendar-day-number">{day.getDate()}</span>
              {hasEvents && (
                <div className="calendar-day-events">
                  {dayEvents.slice(0, 3).map((event, eventIdx) => (
                    <div
                      key={eventIdx}
                      className={`calendar-day-event-dot ${event.type === "class" ? "calendar-dot-class" : "calendar-dot-event"}`}
                      title={event.title}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="calendar-day-more">+{dayEvents.length - 3}</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <div className="calendar-legend-item">
          <span className="calendar-legend-dot calendar-dot-class"></span>
          <span>Classes</span>
        </div>
        <div className="calendar-legend-item">
          <span className="calendar-legend-dot calendar-dot-event"></span>
          <span>Events</span>
        </div>
      </div>
    </div>
  );
}

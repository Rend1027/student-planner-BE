import { DAY_ORDER } from "./constants";
import { parseLocalDate } from "./dateHelpers";

export function sortEvents(events) {
  return [...events].sort((a, b) => {
    const hasDateA = !!a.date;
    const hasDateB = !!b.date;

    if (hasDateA && hasDateB) {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      if (a.start_time && b.start_time) {
        return a.start_time.localeCompare(b.start_time);
      }
      return 0;
    }

    if (hasDateA && !hasDateB) return -1;
    if (!hasDateA && hasDateB) return 1;

    const dayA = DAY_ORDER[a.day_of_week] || 99;
    const dayB = DAY_ORDER[b.day_of_week] || 99;
    if (dayA !== dayB) return dayA - dayB;

    if (a.start_time && b.start_time) {
      return a.start_time.localeCompare(b.start_time);
    }

    return 0;
  });
}

export function isEventPast(ev) {
  if (ev.type === "class") {
    return false;
  }
  if (!ev.date || !ev.end_time) return false;

  const end = parseLocalDate(ev.date);
  if (!end) return false;

  const [h, min] = ev.end_time.split(":");
  end.setHours(Number(h), Number(min), 0, 0);

  return end.getTime() < Date.now();
}


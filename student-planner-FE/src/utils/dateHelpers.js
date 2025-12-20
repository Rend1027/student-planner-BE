export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return "Good night ⋆.˚ ☾⭒.˚";
  if (hour < 12) return "Good morning 🫧🌤️☁";
  if (hour < 18) return "Good afternoon 🌤️";
  return "Good evening 🌓";
}

export function formatTime(timeStr) {
  if (!timeStr) return "";
  const [hStr, mStr] = timeStr.split(":");
  let h = parseInt(hStr, 10);
  const minutes = mStr ?? "00";

  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;

  return `${h}:${minutes}${suffix}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  if (Number.isNaN(d.getTime())) return dateStr;

  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isToday(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  const d = parseLocalDate(dateStr);
  if (!d) return false;
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

export function isTomorrow(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  const d = parseLocalDate(dateStr);
  if (!d) return false;

  const todayMid = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const targetMid = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const diffDays =
    (targetMid.getTime() - todayMid.getTime()) / (1000 * 60 * 60 * 24);

  return diffDays === 1;
}

export function minutesUntil(startTime, dateStr) {
  if (!startTime || !dateStr) return Infinity;
  const now = new Date();

  const target = parseLocalDate(dateStr);
  if (!target) return Infinity;

  const [h, min] = startTime.split(":");
  target.setHours(Number(h), Number(min), 0, 0);

  return Math.floor((target.getTime() - now.getTime()) / (1000 * 60));
}

export function formatNextUpShort(mins) {
  if (mins <= 0) return "Next up now";
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;

  if (mins < 60) return `Next up in ${minutes} min`;
  if (mins < 10 * 60) return `Next up in ${hours}h`;
  return "Next up";
}


import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getEvents as apiGetEvents,
  createEvent as apiCreateEvent,
  updateEvent as apiUpdateEvent,
  deleteEvent as apiDeleteEvent,
} from "../api/client";

const DAY_LABELS = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

const TYPE_META = {
  event: { label: "Event", emoji: "📅" },
  class: { label: "Class", emoji: "📚" },
};

// For sorting classes by weekday
const DAY_ORDER_SORT = {
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
  sun: 7,
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  const [hStr, mStr] = timeStr.split(":");
  let h = parseInt(hStr, 10);
  const minutes = mStr ?? "00";

  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;

  return `${h}:${minutes}${suffix}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  if (Number.isNaN(d.getTime())) return dateStr;

  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function isToday(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  const d = new Date(dateStr);
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

function isTomorrow(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  const d = new Date(dateStr);
  const diffDays = Math.round(
    (d.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) /
    (1000 * 60 * 60 * 24)
  );
  return diffDays === 1;
}

function minutesUntil(startTime, dateStr) {
  if (!startTime || !dateStr) return Infinity;
  const now = new Date();

  const [y, m, d] = dateStr.split("-");
  const target = new Date(Number(y), Number(m) - 1, Number(d));

  const [h, min] = startTime.split(":");
  target.setHours(Number(h), Number(min), 0, 0);

  const diffMs = target - now;
  return Math.floor(diffMs / 60000);
}

function isEventPast(ev) {
  if (!ev?.date || !ev?.end_time) return false;
  const [y, m, d] = ev.date.split("-");
  const end = new Date(Number(y), Number(m) - 1, Number(d));

  const [h, min] = ev.end_time.split(":");
  end.setHours(Number(h), Number(min), 0, 0);

  return end.getTime() < Date.now();
}

function formatNextUpShort(mins) {
  if (mins <= 0) return "Next up now";
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;

  if (mins < 60) return `Next up in ${minutes} min`;
  if (mins < 10 * 60) return `Next up in ${hours}h`;
  return "Next up";
}

// Helper to build a Date for dated events
function getEventDateTime(ev) {
  if (ev.type === "event" && ev.date) {
    const time = ev.start_time || "00:00";
    return new Date(`${ev.date}T${time}`);
  }
  return null;
}

// Sorting logic: dated events → by datetime, classes → by weekday then time
function sortEventsForDisplay(a, b) {
  const da = getEventDateTime(a);
  const db = getEventDateTime(b);

  // both properly dated events
  if (da && db) return da - db;

  // one is dated, one isn't → show dated first
  if (da && !db) return -1;
  if (!da && db) return 1;

  // both are undated (likely classes) → weekday then time
  const dayA = DAY_ORDER_SORT[a.day_of_week] || 99;
  const dayB = DAY_ORDER_SORT[b.day_of_week] || 99;
  if (dayA !== dayB) return dayA - dayB;

  if (a.start_time && b.start_time) {
    return a.start_time.localeCompare(b.start_time);
  }
  return 0;
}

function DashboardPage() {
  const { logout, user } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
    day_of_week: "mon",
    type: "event",
  });

  // Tabs: schedule / tasks / profile
  const [activeTab, setActiveTab] = useState("schedule");

  const greeting = getGreeting();
  const displayName =
    user?.username ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : null) ||
    "there";

  const profileName =
    user?.username ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "Student");

  const profileEmail = user?.email || "student@example.com";

  const greetingSub =
    activeTab === "schedule"
      ? "Here’s what your day looks like."
      : activeTab === "tasks"
        ? "Capture the tasks that keep you moving."
        : "Manage your account and preferences.";

  useEffect(() => {
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

    loadEvents();
  }, []);

  // soonest upcoming dated event for "Next up" label
  const upcomingEvent =
    events && events.length
      ? events
        .filter(
          (ev) =>
            ev.type === "event" && ev.date && ev.start_time
        )
        .map((ev) => ({
          ...ev,
          _minsUntil: minutesUntil(ev.start_time, ev.date),
        }))
        .filter((ev) => ev._minsUntil > 0)
        .sort((a, b) => a._minsUntil - b._minsUntil)[0] || null
      : null;

  // sorted list for display
  const sortedEvents = [...events].sort(sortEventsForDisplay);

  function openCreateForm() {
    setEditingEvent(null);
    setForm({
      title: "",
      description: "",
      date: "",
      start_time: "",
      end_time: "",
      day_of_week: "mon",
      type: "event",
    });
    setShowForm(true);
  }

  function openEditForm(ev) {
    setEditingEvent(ev);
    setForm({
      title: ev.title || "",
      description: ev.description || "",
      date: ev.date || "",
      start_time: ev.start_time || "",
      end_time: ev.end_time || "",
      day_of_week: ev.day_of_week || "mon",
      type: ev.type || "event",
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingEvent(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    setSuccessMsg("");

    if (!form.title) {
      setError("Title is required");
      setFormLoading(false);
      return;
    }
    if (!form.start_time || !form.end_time) {
      setError("Start and end time are required");
      setFormLoading(false);
      return;
    }
    if (form.type === "event" && !form.date) {
      setError("Date is required for events");
      setFormLoading(false);
      return;
    }
    if (form.type === "class" && !form.day_of_week) {
      setError("Day of week is required for classes");
      setFormLoading(false);
      return;
    }

    const dayFromDate =
      form.date
        ? ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][
        new Date(form.date).getDay()
        ]
        : null;

    const payload = {
      title: form.title,
      description: form.description || null,
      start_time: form.start_time,
      end_time: form.end_time,
      type: form.type,
      date: form.type === "event" ? form.date : null,
      day_of_week:
        form.type === "class" ? form.day_of_week : dayFromDate,
    };

    try {
      if (editingEvent) {
        await apiUpdateEvent({ id: editingEvent.id, ...payload });
        setSuccessMsg("Event updated.");
      } else {
        await apiCreateEvent(payload);
        setSuccessMsg("Event created.");
      }

      const data = await apiGetEvents();
      setEvents(data || []);
      closeForm();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save event");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(ev) {
    const confirmDelete = window.confirm(
      `Delete "${ev.title}" from your schedule?`
    );
    if (!confirmDelete) return;

    setError("");
    setSuccessMsg("");
    try {
      await apiDeleteEvent(ev.id);
      setSuccessMsg("Event deleted.");
      setEvents((prev) => prev.filter((e) => e.id !== ev.id));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete event");
    }
  }

  // Tab renderers
  const renderScheduleTab = () => {
    if (loading) {
      return <p className="muted">Loading your schedule...</p>;
    }

    if (sortedEvents.length === 0) {
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
        {sortedEvents.map((ev) => {
          const typeMeta = TYPE_META[ev.type] || {
            label: ev.type,
            emoji: "•",
          };

          const isTodayEvent =
            ev.type === "event" && isToday(ev.date);
          const isTomorrowEvent =
            ev.type === "event" && isTomorrow(ev.date);
          const past = ev.type === "event" && isEventPast(ev);
          const isUpcoming =
            upcomingEvent && upcomingEvent.id === ev.id;

          let dateLine = "";
          if (ev.type === "class") {
            dateLine = `${DAY_LABELS[ev.day_of_week] ||
              ev.day_of_week?.toUpperCase()
              } · ${formatTime(ev.start_time)} – ${formatTime(
                ev.end_time
              )}`;
          } else {
            let prefix = formatDate(ev.date);
            if (isTodayEvent) prefix = "Today";
            else if (isTomorrowEvent) prefix = "Tomorrow";

            dateLine = `${prefix} · ${formatTime(
              ev.start_time
            )} – ${formatTime(ev.end_time)}`;

            if (isTodayEvent && !past) {
              dateLine += " 🔥";
            }
          }

          return (
            <li
              key={ev.id}
              className={`event-card event-${ev.type} ${past ? "event-past" : ""
                }`}
            >
              <div className="event-main">
                {isUpcoming && !past && upcomingEvent && (
                  <div className="event-nextup-label">
                    <span className="tag-nextup">
                      {formatNextUpShort(
                        upcomingEvent._minsUntil
                      )}{" "}
                      ⏰
                    </span>
                  </div>
                )}

                <div className="event-title-row">
                  <div className="event-title-main">
                    <span className="event-type-pill">
                      <span className="event-type-emoji">
                        {typeMeta.emoji}
                      </span>
                      {typeMeta.label.toUpperCase()}
                    </span>
                    <h3 className="event-title">{ev.title}</h3>
                  </div>
                </div>

                {ev.description && (
                  <p className="event-description">
                    {ev.description}
                  </p>
                )}

                <div className="event-meta">
                  {past && (
                    <span className="tag-done">Done ✓</span>
                  )}
                  <span>{dateLine}</span>
                </div>
              </div>

              <div className="event-actions">
                <button
                  className="btn-small"
                  onClick={() => openEditForm(ev)}
                >
                  Edit
                </button>
                <button
                  className="btn-small btn-danger"
                  onClick={() => handleDelete(ev)}
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderTasksTab = () => (
    <section className="panel-shell">
      <h2 className="panel-title">Tasks (coming soon)</h2>
      <p className="panel-subtext">
        Soon you&apos;ll be able to track to-dos right next to your
        classes and events.
      </p>
      <div className="chip-row">
        <span className="chip soft">School</span>
        <span className="chip soft">Work</span>
        <span className="chip soft">Personal</span>
      </div>
    </section>
  );

  const renderProfileTab = () => {
    const initial =
      profileName && typeof profileName === "string"
        ? profileName.trim().charAt(0).toUpperCase()
        : "S";

    return (
      <section className="profile-panel">
        <div className="profile-avatar">
          <span>{initial}</span>
        </div>
        <h2 className="profile-name">{profileName}</h2>
        <p className="profile-email">{profileEmail}</p>
        <p className="profile-role">Student · Smart Scheduler</p>

        <div className="profile-divider" />

        <div className="profile-settings">
          <div className="profile-setting-row">
            <span>Theme</span>
            <span className="badge-soft">Dark</span>
          </div>
          <div className="profile-setting-row">
            <span>Notifications</span>
            <span className="badge-soft subtle">
              Coming soon
            </span>
          </div>
          <div className="profile-setting-row">
            <span>App version</span>
            <span className="badge-soft subtle">v1.0</span>
          </div>
        </div>

        <button className="btn-profile-logout" onClick={logout}>
          Log out
        </button>
      </section>
    );
  };

  return (
    <div className="mobile-shell">
      <div className="mobile-app">
        <header className="mobile-header">
          <div className="app-header-left">
            <div className="app-logo">SS</div>
            <div>
              <h1 className="app-title">Smart Student Scheduler</h1>
              <p className="app-subtitle">
                Classes · Events · Appointments
              </p>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </header>

        <section className="greeting-strip">
          <p className="greeting-title">
            {greeting}, <span>{displayName}</span> 👋
          </p>
          <p className="greeting-sub">{greetingSub}</p>
        </section>

        {error && <div className="toast toast-error">{error}</div>}
        {successMsg && (
          <div className="toast toast-success">{successMsg}</div>
        )}

        <main className="mobile-main">
          {activeTab === "schedule" && renderScheduleTab()}
          {activeTab === "tasks" && renderTasksTab()}
          {activeTab === "profile" && renderProfileTab()}
        </main>

        {activeTab === "schedule" && (
          <button className="fab" onClick={openCreateForm}>
            +
          </button>
        )}

        <nav className="bottom-nav">
          <button
            className={`nav-item ${activeTab === "schedule" ? "nav-item-active" : ""
              }`}
            onClick={() => setActiveTab("schedule")}
          >
            Schedule
          </button>
          <button
            className={`nav-item ${activeTab === "tasks" ? "nav-item-active" : ""
              }`}
            onClick={() => setActiveTab("tasks")}
          >
            Tasks
          </button>
          <button
            className={`nav-item ${activeTab === "profile" ? "nav-item-active" : ""
              }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </nav>

        {showForm && (
          <div className="sheet-backdrop" onClick={closeForm}>
            <div
              className="sheet"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sheet-header">
                <h2>{editingEvent ? "Edit Event" : "New Event"}</h2>
                <button className="sheet-close" onClick={closeForm}>
                  ✕
                </button>
              </div>

              <form className="sheet-form" onSubmit={handleSubmit}>
                <label className="field">
                  <span>Title</span>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="CIS 211 Lecture, Dentist..."
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
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
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
                    />
                  </label>
                  <label>
                    <span>End time</span>
                    <input
                      type="time"
                      name="end_time"
                      value={form.end_time}
                      onChange={handleChange}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={formLoading}
                >
                  {formLoading
                    ? "Saving..."
                    : editingEvent
                      ? "Save changes"
                      : "Create event"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;

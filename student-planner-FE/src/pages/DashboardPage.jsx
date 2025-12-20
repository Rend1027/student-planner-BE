import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useEvents, useTasks } from "../hooks";
import { sortEvents } from "../utils/eventHelpers";
import { minutesUntil } from "../utils/dateHelpers";
import {
  Header,
  BottomNav,
  GreetingStrip,
} from "../components/layout";
import { Toast, ConfirmationDialog } from "../components/ui";
import { EventList, EventForm } from "../components/events";
import { TasksTab, TaskForm, ProfileTab } from "../components/dashboard";
import { Calendar } from "../components/calendar";

function DashboardPage() {
  const { logout, user } = useAuth();
  const { events, loading, error: eventsError, createEvent, updateEvent, deleteEvent, refreshEvents } = useEvents();
  const { tasks, loading: tasksLoading, createTask, updateTask, deleteTask } = useTasks();

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [activeTab, setActiveTab] = useState("schedule");
  const [newlyCreatedEventId, setNewlyCreatedEventId] = useState(null);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
    title: "Confirm Delete",
  });

  // Event form state
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventFormLoading, setEventFormLoading] = useState(false);

  // Task form state
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskFormLoading, setTaskFormLoading] = useState(false);

  const displayName =
    user?.username ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : null) ||
    "there";

  const greetingSub =
    activeTab === "schedule"
      ? "Here's what your day looks like."
      : activeTab === "tasks"
      ? "Capture the tasks that keep you moving."
      : "Manage your account and preferences.";

  // Find upcoming event
  const upcomingEvent =
    events && events.length
      ? events
          .filter((ev) => ev.type === "event" && ev.date && ev.start_time)
          .map((ev) => ({
            ...ev,
            _minsUntil: minutesUntil(ev.start_time, ev.date),
          }))
          .filter((ev) => ev._minsUntil > 0)
          .sort((a, b) => a._minsUntil - b._minsUntil)[0] || null
      : null;

  const sortedEvents = sortEvents(events);

  // Event handlers
  function openCreateEventForm() {
    setEditingEvent(null);
    setShowEventForm(true);
  }

  function openEditEventForm(ev) {
    setEditingEvent(ev);
    setShowEventForm(true);
  }

  function closeEventForm() {
    setShowEventForm(false);
    setEditingEvent(null);
  }

  async function handleEventSubmit(eventData) {
    setEventFormLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (editingEvent) {
        await updateEvent(eventData);
        setSuccessMsg("Event updated.");
      } else {
        const newEvent = await createEvent(eventData);
        setSuccessMsg("Event created.");
        // Set the newly created event ID for animation
        const eventId = newEvent?.id || newEvent?.data?.id;
        if (eventId) {
          setNewlyCreatedEventId(eventId);
          // Clear the animation class after animation completes
          setTimeout(() => {
            setNewlyCreatedEventId(null);
          }, 1000);
        } else {
          // Fallback: find the newest event after refresh
          setTimeout(() => {
            if (sortedEvents && sortedEvents.length > 0) {
              const latestEvent = sortedEvents[sortedEvents.length - 1];
              if (latestEvent && latestEvent.id) {
                setNewlyCreatedEventId(latestEvent.id);
                setTimeout(() => {
                  setNewlyCreatedEventId(null);
                }, 1000);
              }
            }
          }, 300);
        }
      }
      closeEventForm();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save event");
    } finally {
      setEventFormLoading(false);
    }
  }

  function openDeleteEventDialog(ev) {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Event",
      message: `Are you sure you want to delete "${ev.title}" from your schedule?`,
      onConfirm: async () => {
        setError("");
        setSuccessMsg("");
        try {
          await deleteEvent(ev.id);
          setSuccessMsg("Event deleted.");
        } catch (err) {
          console.error(err);
          setError(err.message || "Failed to delete event");
        }
      },
    });
  }

  function closeConfirmDialog() {
    setConfirmDialog({
      isOpen: false,
      message: "",
      onConfirm: null,
      title: "Confirm Delete",
    });
  }

  // Task handlers
  function openCreateTaskForm() {
    setEditingTask(null);
    setShowTaskForm(true);
  }

  function openEditTaskForm(task) {
    setEditingTask(task);
    setShowTaskForm(true);
  }

  function closeTaskForm() {
    setShowTaskForm(false);
    setEditingTask(null);
  }

  async function handleTaskSubmit(taskData) {
    setTaskFormLoading(true);

    try {
      if (editingTask) {
        await updateTask(taskData);
      } else {
        await createTask(taskData);
      }
      closeTaskForm();
    } catch (err) {
      console.error("Failed to save task", err);
      alert("Failed to save task");
    } finally {
      setTaskFormLoading(false);
    }
  }

  function openDeleteTaskDialog(task) {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Task",
      message: `Are you sure you want to delete task "${task.title}"?`,
      onConfirm: async () => {
        try {
          await deleteTask(task.id);
        } catch (err) {
          console.error("Failed to delete task", err);
          setError("Failed to delete task");
        }
      },
    });
  }

  async function handleTaskComplete(task) {
    try {
      // Delete the task when it's checked off
      await deleteTask(task.id);
      setSuccessMsg("Task completed!");
    } catch (err) {
      console.error("Failed to complete task", err);
      setError("Failed to complete task");
    }
  }

  // Handle calendar date click
  function handleDateClick(date) {
    // Could scroll to events on that date or filter
    console.log("Date clicked:", date);
  }

  // Render tabs
  function renderScheduleTab() {
    if (loading) {
      return <p className="muted">Loading your schedule...</p>;
    }

    return (
      <div className="dashboard-split-layout">
        {/* Left Side - Events List */}
        <div className="dashboard-events-panel">
          <EventList
            events={sortedEvents}
            upcomingEvent={upcomingEvent}
            onEdit={openEditEventForm}
            onDelete={openDeleteEventDialog}
            newlyCreatedEventId={newlyCreatedEventId}
          />
        </div>

        {/* Right Side - Calendar */}
        <div className="dashboard-calendar-panel">
          <Calendar events={events} onDateClick={handleDateClick} />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
        <Header />

        <div className="dashboard-content">
          <GreetingStrip displayName={displayName} subtitle={greetingSub} />

          {error && <Toast message={error} type="error" />}
          {successMsg && <Toast message={successMsg} type="success" />}
          {eventsError && <Toast message={eventsError} type="error" />}

          <main className="dashboard-main">
            {activeTab === "schedule" && renderScheduleTab()}
            {activeTab === "tasks" && (
              <TasksTab
                tasks={tasks}
                loading={tasksLoading}
                onEdit={openEditTaskForm}
                onDelete={openDeleteTaskDialog}
                onComplete={handleTaskComplete}
              />
            )}
            {activeTab === "profile" && (
              <ProfileTab 
                user={user} 
                onLogout={logout}
              />
            )}
          </main>
        </div>

        {/* FABs */}
        {activeTab === "schedule" && (
          <button className="fab" onClick={openCreateEventForm}>
            +
          </button>
        )}
        {activeTab === "tasks" && (
          <button className="fab" onClick={openCreateTaskForm}>
            +
          </button>
        )}

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Event Form Modal */}
        <EventForm
          isOpen={showEventForm}
          onClose={closeEventForm}
          onSubmit={handleEventSubmit}
          editingEvent={editingEvent}
          loading={eventFormLoading}
          error={error}
        />

        {/* Task Form Modal */}
        <TaskForm
          isOpen={showTaskForm}
          onClose={closeTaskForm}
          onSubmit={handleTaskSubmit}
          editingTask={editingTask}
          loading={taskFormLoading}
        />

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={confirmDialog.isOpen}
          onClose={closeConfirmDialog}
          onConfirm={confirmDialog.onConfirm || (() => {})}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />

    </div>
  );
}

export default DashboardPage;

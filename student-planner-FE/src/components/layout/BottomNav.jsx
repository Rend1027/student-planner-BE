export function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="bottom-nav">
      <button
        className={`nav-item ${
          activeTab === "schedule" ? "nav-item-active" : ""
        }`}
        onClick={() => onTabChange("schedule")}
      >
        Schedule
      </button>
      <button
        className={`nav-item ${activeTab === "tasks" ? "nav-item-active" : ""}`}
        onClick={() => onTabChange("tasks")}
      >
        Tasks
      </button>
      <button
        className={`nav-item ${
          activeTab === "profile" ? "nav-item-active" : ""
        }`}
        onClick={() => onTabChange("profile")}
      >
        Profile
      </button>
    </nav>
  );
}


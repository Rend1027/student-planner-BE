export function ProfileTab({ user, onLogout }) {
  const profileName =
    user?.username ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "Student");

  const profileEmail = user?.email || "student@example.com";

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
          <span>App version</span>
          <span className="badge-soft subtle">v1.0</span>
        </div>
      </div>

      <button className="btn-profile-logout" onClick={onLogout}>
        Log out
      </button>
    </section>
  );
}


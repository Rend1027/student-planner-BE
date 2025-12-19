export function Header() {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header-content">
        <div className="dashboard-header-left">
          <div className="app-logo">
            <img 
              src="/logo.svg" 
              alt="Smart Student Scheduler Logo"
              className="logo-image"
            />
          </div>
          <div className="dashboard-header-text">
            <h1 className="app-title">Smart Student Scheduler</h1>
            <p className="app-subtitle">Classes · Events · Appointments</p>
          </div>
        </div>
      </div>
    </header>
  );
}

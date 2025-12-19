export function Toast({ message, type = "error", onClose }) {
  if (!message) return null;

  return (
    <div className={`toast toast-${type}`}>
      {message}
      {onClose && (
        <button
          onClick={onClose}
          style={{
            marginLeft: "0.5rem",
            background: "transparent",
            border: "none",
            color: "inherit",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}


export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger", // 'danger' or 'warning'
}) {
  if (!isOpen) return null;

  function handleConfirm() {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div className="sheet-backdrop confirmation-backdrop" onClick={handleBackdropClick}>
      <div className="sheet confirmation-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-header">
          <h2>{title}</h2>
          <button className="sheet-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="confirmation-dialog">
          <p className="confirmation-message">{message}</p>
          <div className="confirmation-actions">
            <button
              type="button"
              className="confirmation-btn confirmation-btn-cancel"
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className={`confirmation-btn confirmation-btn-${variant}`}
              onClick={handleConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


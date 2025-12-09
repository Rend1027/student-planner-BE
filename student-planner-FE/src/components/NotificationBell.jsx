import React, { useEffect, useState, useRef } from "react";
import {
  getUnreadCount,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../api/client";

function formatTimestamp(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleString();
  } catch (e) {
    return ts;
  }
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function loadCount() {
      try {
        const c = await getUnreadCount();
        if (mounted) setCount(c);
      } catch (err) {
        // ignore
      }
    }
    loadCount();

    const iv = setInterval(loadCount, 30000);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, []);

  useEffect(() => {
    // close on outside click
    function onDoc(e) {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  async function openPanel() {
    setOpen((s) => {
      const next = !s;
      if (!s) fetchItems();
      return next;
    });
  }

  async function fetchItems() {
    setLoading(true);
    try {
      const data = await getNotifications(1, 30);
      // data expected shape { notifications: [...], page, total, unread_count }
      const list = data.notifications || data;
      setItems(list || []);
      // sync count if backend provided it
      if (data.unread_count !== undefined) setCount(data.unread_count);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkRead(id) {
    try {
      await markNotificationRead(id);
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, is_read: 1 } : it)));
      setCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("Mark read failed", err);
    }
  }

  async function handleMarkAll() {
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((it) => ({ ...it, is_read: 1 })));
      setCount(0);
    } catch (err) {
      console.error("Mark all failed", err);
    }
  }

  return (
    <div className="notification-bell" style={{ position: "relative" }}>
      <button
        className="btn-bell"
        onClick={openPanel}
        aria-label="Notifications"
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
      >
        <span style={{ fontSize: "1.4rem" }}>🔔</span>
        {count > 0 && (
          <span
            className="badge"
            style={{
              background: "#ef4444",
              color: "white",
              borderRadius: "999px",
              padding: "2px 6px",
              fontSize: "0.75rem",
              marginLeft: "6px",
            }}
          >
            {count}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="notifications-panel"
          style={{
            position: "absolute",
            right: 0,
            top: "36px",
            width: "320px",
            maxHeight: "420px",
            overflow: "auto",
            background: "white",
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            borderRadius: "8px",
            zIndex: 60,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid #eee" }}>
            <strong>Notifications</strong>
            <div>
              <button onClick={handleMarkAll} style={{ marginRight: 8 }} className="btn-link">Mark all</button>
              <button onClick={() => setOpen(false)} className="btn-link">Close</button>
            </div>
          </div>

          <div style={{ padding: 8 }}>
            {loading && <div>Loading…</div>}
            {!loading && items.length === 0 && <div style={{ padding: 12, color: "#666" }}>No notifications</div>}

            {items.map((it) => (
              <div key={it.id} style={{ display: "flex", gap: 8, padding: 10, alignItems: "flex-start", borderBottom: "1px solid #f3f3f3", background: it.is_read ? "#fff" : "#f9fbff" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: it.is_read ? 400 : 600 }}>{it.message || it.title || "Notification"}</div>
                  {it.metadata && <div style={{ fontSize: "0.85rem", color: "#666" }}>{JSON.stringify(it.metadata)}</div>}
                  <div style={{ fontSize: "0.75rem", color: "#999", marginTop: 6 }}>{formatTimestamp(it.created_at || it.createdAt || it.ts)}</div>
                </div>

                {!it.is_read && (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button onClick={() => handleMarkRead(it.id)} className="btn-primary" style={{ padding: "6px 8px" }}>Mark</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

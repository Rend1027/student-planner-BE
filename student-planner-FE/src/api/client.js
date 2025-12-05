const API_URL = "http://localhost:8000/api";
const TOKEN_KEY = "jwt";

// --- Token Helpers ---
export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// --- Generic API Request ---
async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

// ---- AUTH ----
export async function login(email, password) {
  const res = await apiFetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  saveToken(res.data.token);
  return res.data.user;
}

export function register(username, email, password) {
  return apiFetch("/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

// ---- STUDENT EVENTS ----
export async function getEvents() {
  const res = await apiFetch("/events", { method: "GET" });
  return res.data;
}

export function createEvent(event) {
  return apiFetch("/events/create", {
    method: "POST",
    body: JSON.stringify(event),
  });
}

export function deleteEvent(id) {
  return apiFetch("/events/delete", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}

// ---- ADMIN ----
export async function getAllUsers() {
  const res = await apiFetch("/admin/users", { method: "GET" });
  return res.data;
}

export async function getAllEvents() {
  const res = await apiFetch("/admin/events", { method: "GET" });
  return res.data;
}

export function adminDeleteUser(id) {
  return apiFetch("/admin/users/delete", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}

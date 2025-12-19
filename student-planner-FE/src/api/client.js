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

  // Get response text first to check if it's JSON
  const text = await res.text();
  let data;
  
  try {
    data = JSON.parse(text);
  } catch (e) {
    // If response is not JSON (likely a PHP error), show a helpful error
    console.error("API Error - Non-JSON response:", text);
    throw new Error(
      "Server error: " + 
      (text.includes("<b>") 
        ? "Please check the backend server logs for details." 
        : text.substring(0, 200))
    );
  }

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

  // Save token for future requests
  saveToken(res.data.token);
  return res.data.user;
}

export function register(username, email, password) {
  return apiFetch("/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

// Optional: more detailed login return (user + token)
export async function apiLogin(email, password) {
  const response = await apiFetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  console.log("LOGIN RESPONSE", response);

  const token = response.data?.token;
  if (!token) {
    throw new Error("Token missing from login response");
  }

  saveToken(token);

  return response.data; // { user, token }
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

export function updateEvent(event) {
  return apiFetch("/events/update", {
    method: "PUT",
    body: JSON.stringify(event),
  });
}

// ---- TASKS ----
// These match the routes you tested with curl:
// GET    /api/tasks
// POST   /api/tasks/create
// DELETE /api/tasks/delete
export async function getTasks() {
  const res = await apiFetch("/tasks", { method: "GET" });
  return res.data;
}

export function createTask(task) {
  return apiFetch("/tasks/create", {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export function updateTask(task) {
  return apiFetch("/tasks/update", {
    method: "PUT",
    body: JSON.stringify(task),
  });
}

export function deleteTask(id) {
  return apiFetch("/tasks/delete", {
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

// ---- Legacy aliases for existing frontend code ----
export const apiGetEvents = getEvents;
export const apiCreateEvent = createEvent;
export const apiDeleteEvent = deleteEvent;
export const apiUpdateEvent = updateEvent;

// NEW: aliases for tasks so we keep the same pattern
export const apiGetTasks = getTasks;
export const apiCreateTask = createTask;
export const apiUpdateTask = updateTask;
export const apiDeleteTask = deleteTask;

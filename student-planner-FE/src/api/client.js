const BASE_URL = "/api";
const TOKEN_KEY = "jwt";

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ----- Base request wrapper -----
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const headers = { ...(options.headers || {}) };

  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // 🔥 Attach JWT for ALL requests
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.log("REQUEST", url, headers); // <-- add this temporarily

  const res = await fetch(url, { ...options, headers });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error(`Invalid response from server (${res.status})`);
  }

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}


// ----- Auth API -----
export async function apiRegister(username, email, password) {
  return request("/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

export async function apiLogin(email, password) {
  const response = await request("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // Backend: { success, message, data: { user, token } }
  const token = response.data?.token;
  if (!token) {
    throw new Error("Token missing from login response");
  }

  // Save JWT so future requests include Authorization header
  saveToken(token);

  return response.data; // { user, token }
}

// ----- Events API -----
export async function apiGetEvents() {
  const response = await request("/events", {
    method: "GET",
  });
  return response.data || [];
}

export async function apiCreateEvent(event) {
  return request("/events/create", {
    method: "POST",
    body: JSON.stringify(event),
  });
}

export async function apiUpdateEvent(event) {
  return request("/events/update", {
    method: "PUT",
    body: JSON.stringify(event),
  });
}

export async function apiDeleteEvent(id) {
  return request("/events/delete", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}

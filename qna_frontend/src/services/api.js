/**
 * API client for interacting with Django backend REST endpoints.
 * Uses session cookie or token stored in localStorage for auth.
 * Adds automatic Django CSRF handling for mutating requests.
 * PUBLIC_INTERFACE
 */
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

/**
 * Read a cookie value by name from document.cookie
 */
function getCookie(name) {
  // Basic cookie parsing; safe for simple name=value pairs
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

/**
 * Ensure we have a CSRF token in cookies.
 * For Django, the cookie is typically named "csrftoken".
 * If missing, we can perform a safe (GET) request to a lightweight endpoint
 * that sets cookies (e.g., /health/ or a CSRF endpoint) with credentials included.
 * This function is a no-op if the token already exists.
 */
async function ensureCsrfToken() {
  const existing = getCookie("csrftoken");
  if (existing) return existing;
  // Attempt a safe fetch to prompt the backend to set cookies.
  // We choose /health/ as it is public and idempotent.
  try {
    await fetch(`${API_BASE_URL}/health/`.replace(/\/api\/?$/, "/health/"), {
      method: "GET",
      credentials: "include",
      headers: { "Accept": "application/json, text/plain,*/*" }
    });
  } catch {
    // Ignore network errors; caller may proceed without token if backend doesn't require it.
  }
  return getCookie("csrftoken");
}

/**
 * Compute base headers. Includes Authorization if a Bearer token is present.
 */
const defaultHeaders = () => {
  const token = localStorage.getItem("authToken");
  const headers = {
    "Content-Type": "application/json"
  };
  // If backend uses JWT/Bearer; if session cookie, this is ignored by server
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

/**
 * Build headers for mutating requests (POST/PUT/PATCH/DELETE),
 * automatically including X-CSRFToken from Django's csrftoken cookie.
 */
async function mutatingHeaders() {
  // Start with base headers
  const headers = defaultHeaders();
  // Ensure csrftoken exists; try to obtain if missing
  const csrf = (getCookie("csrftoken")) || (await ensureCsrfToken());
  if (csrf) {
    headers["X-CSRFToken"] = csrf; // Django expects X-CSRFToken header
  }
  // Some deployments expect X-Requested-With; harmless to include
  headers["X-Requested-With"] = "XMLHttpRequest";
  return headers;
}

async function handleResponse(res) {
  const contentType = res.headers.get("content-type");
  let data;
  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }
  if (!res.ok) {
    const message = (data && data.detail) || data?.message || res.statusText;
    throw new Error(message || "Request failed");
  }
  return data;
}

// PUBLIC_INTERFACE
export async function apiRegister({ username, email, password }) {
  const res = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: "POST",
    headers: await mutatingHeaders(),
    credentials: "include", // include cookies for CSRF/session
    body: JSON.stringify({ username, email, password })
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function apiLogin({ username, password }) {
  const res = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    headers: await mutatingHeaders(),
    credentials: "include",
    body: JSON.stringify({ username, password })
  });
  const data = await handleResponse(res);
  // Store token if backend issues one; otherwise rely on cookies.
  if (data?.token) {
    localStorage.setItem("authToken", data.token);
  }
  localStorage.setItem("authUser", JSON.stringify({ username }));
  return data;
}

// PUBLIC_INTERFACE
export async function apiLogout() {
  const res = await fetch(`${API_BASE_URL}/auth/logout/`, {
    method: "POST",
    headers: await mutatingHeaders(),
    credentials: "include"
  });
  const data = await handleResponse(res);
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
  return data;
}

// PUBLIC_INTERFACE
export async function apiAskQuestion({ question, conversation_id }) {
  const res = await fetch(`${API_BASE_URL}/chat/ask/`, {
    method: "POST",
    headers: await mutatingHeaders(),
    credentials: "include",
    body: JSON.stringify(
      conversation_id ? { question, conversation_id } : { question }
    )
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function apiListConversations() {
  const res = await fetch(`${API_BASE_URL}/chat/conversations/`, {
    method: "GET",
    headers: defaultHeaders(),
    credentials: "include"
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function apiGetConversationDetail(conversation_id) {
  const res = await fetch(`${API_BASE_URL}/chat/conversations/${conversation_id}/`, {
    method: "GET",
    headers: defaultHeaders(),
    credentials: "include"
  });
  return handleResponse(res);
}

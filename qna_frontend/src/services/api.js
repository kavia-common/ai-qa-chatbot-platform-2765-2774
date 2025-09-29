/**
 * API client for interacting with Django backend REST endpoints.
 * Uses session cookie or token stored in localStorage for auth.
 * PUBLIC_INTERFACE
 */
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

const defaultHeaders = () => {
  const token = localStorage.getItem("authToken");
  const headers = {
    "Content-Type": "application/json"
  };
  // If backend uses JWT/Bearer; if session cookie, this is ignored by server
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

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
    headers: defaultHeaders(),
    body: JSON.stringify({ username, email, password })
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function apiLogin({ username, password }) {
  const res = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    headers: defaultHeaders(),
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
    headers: defaultHeaders(),
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
    headers: defaultHeaders(),
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

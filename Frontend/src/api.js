const BASE = "http://localhost:8000";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const message = typeof err.detail === "string"
      ? err.detail
      : JSON.stringify(err.detail);
    throw new Error(message);
  }
  return res.json();
}
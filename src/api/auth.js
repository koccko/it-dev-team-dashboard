const API_BASE = "";

async function apiFetch(path, { method = "GET", body, headers } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text().catch(() => "");

  if (!res.ok) {
    throw new Error(
      data?.detail ||
        data?.message ||
        data?.error ||
        `Request failed with status ${res.status}`,
    );
  }

  return data;
}

export async function login({ username, password }) {
  return apiFetch("/api/login", {
    method: "POST",
    body: {
      email: username,
      password,
    },
  });
}

export async function getMe() {
  return apiFetch("/api/user");
}

export async function logout() {
  try {
    return await apiFetch("/api/logout", {
      method: "POST",
    });
  } catch (error) {
    return { ok: true };
  }
}

export { apiFetch };

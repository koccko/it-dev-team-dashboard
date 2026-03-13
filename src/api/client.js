const API_BASE = "http://192.168.10.5";

export async function apiFetch(path, options = {}) {
  const { method = "GET", body, headers = {} } = options;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type") || "";

  let data;
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => ({}));
  } else {
    data = await res.text().catch(() => "");
  }

  if (!res.ok) {
    const message =
      data?.detail ||
      data?.message ||
      data?.error ||
      `Request failed with status ${res.status}`;

    throw new Error(message);
  }

  return data;
}

export async function apiFetch(path, { method = "GET", body, headers } = {}) {
  const url = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(url, {
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

  let data = null;

  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  } else {
    data = await res.text().catch(() => "");
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}`;

    if (typeof data === "string" && data.trim()) {
      message = data;
    }

    if (data && typeof data === "object") {
      if (data.message) {
        message = data.message;
      } else if (data.error) {
        message = data.error;
      } else if (data.errors && typeof data.errors === "object") {
        const firstKey = Object.keys(data.errors)[0];
        const firstValue = data.errors[firstKey];

        if (Array.isArray(firstValue) && firstValue.length > 0) {
          message = firstValue[0];
        } else if (typeof firstValue === "string") {
          message = firstValue;
        }
      }
    }

    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

import { apiFetch } from "./http";

export function login({ username, password }) {
  return apiFetch("/api/login", {
    method: "POST",
    body: {
      email: username,
      password: password,
    },
  });
}

export function getMe() {
  return apiFetch("/api/user", {
    method: "GET",
  });
}

export function logout() {
  return apiFetch("/api/logout", {
    method: "POST",
  });
}

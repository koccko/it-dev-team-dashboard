import { apiFetch } from "./auth";

export async function listTickets() {
  const data = await apiFetch("/api/tickets");
  return Array.isArray(data?.member) ? data.member : [];
}

export async function createTicket(payload) {
  return apiFetch("/api/tickets/create", {
    method: "POST",
    body: payload,
  });
}

export async function updateTicketStatus(id, status) {
  return apiFetch(`/api/tickets/${id}`, {
    method: "PUT",
    body: { status },
  });
}

export async function closeTicket(id) {
  return updateTicketStatus(id, "CLOSED");
}

export async function getOpenTicketsCount() {
  return apiFetch("/api/user/open/tickets");
}

export async function getClosedTicketsCount() {
  return apiFetch("/api/user/close/tickets");
}

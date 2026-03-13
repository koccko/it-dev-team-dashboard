import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { getMe, logout } from "../api/auth";
import { closeTicket, createTicket, listTickets } from "../api/tickets";

const initialForm = {
  title: "",
  description: "",
  priority: "MEDIUM",
};

function ticketCardStyle() {
  return {
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "20px",
    padding: "18px",
    background:
      "linear-gradient(180deg, rgba(16,24,45,0.95) 0%, rgba(10,16,30,0.95) 100%)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
  };
}

function pageWrapStyle() {
  return {
    display: "grid",
    gap: "20px",
  };
}

function formGridStyle() {
  return {
    display: "grid",
    gap: "14px",
  };
}

function inputStyle() {
  return {
    width: "100%",
    minHeight: "48px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    padding: "0 14px",
    outline: "none",
  };
}

function textareaStyle() {
  return {
    ...inputStyle(),
    minHeight: "140px",
    padding: "14px",
    resize: "vertical",
  };
}

function buttonStyle(primary = false) {
  return {
    minHeight: "46px",
    padding: "0 16px",
    borderRadius: "14px",
    border: primary
      ? "1px solid rgba(120,140,255,0.24)"
      : "1px solid rgba(255,255,255,0.08)",
    background: primary
      ? "linear-gradient(135deg, rgba(54,94,255,0.28), rgba(109,54,255,0.20))"
      : "rgba(255,255,255,0.04)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  };
}

export default function TicketsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    setError("");

    try {
      const [userData, ticketData] = await Promise.all([
        getMe(),
        listTickets(),
      ]);
      setUser(userData);
      setTickets(ticketData);
    } catch (err) {
      setError(err.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function onChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function onCreate(e) {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.");
      return;
    }

    setSaving(true);

    try {
      await createTicket({
        title: form.title.trim(),
        description: form.description.trim(),
        status: "OPEN",
        priority: form.priority,
      });

      setForm(initialForm);
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to create ticket");
    } finally {
      setSaving(false);
    }
  }

  async function handleCloseTicket(id) {
    try {
      await closeTicket(id);
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to close ticket");
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      navigate("/", { replace: true });
    }
  }

  return (
    <AppShell onLogout={handleLogout} user={user}>
      <div style={pageWrapStyle()}>
        <section style={ticketCardStyle()}>
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                color: "#8ea2cc",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: 1.2,
              }}
            >
              Ticketing
            </div>
            <h2 style={{ color: "#fff", margin: "8px 0 0" }}>
              Create new ticket
            </h2>
          </div>

          <form onSubmit={onCreate} style={formGridStyle()}>
            <input
              name="title"
              placeholder="Ticket title"
              value={form.title}
              onChange={onChange}
              style={inputStyle()}
              disabled={saving}
            />

            <textarea
              name="description"
              placeholder="Describe the problem"
              value={form.description}
              onChange={onChange}
              style={textareaStyle()}
              disabled={saving}
            />

            <select
              name="priority"
              value={form.priority}
              onChange={onChange}
              style={inputStyle()}
              disabled={saving}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>

            {error ? (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "rgba(239,68,68,0.14)",
                  color: "#ffd3d3",
                  border: "1px solid rgba(239,68,68,0.18)",
                }}
              >
                {error}
              </div>
            ) : null}

            <div style={{ display: "flex", gap: 12 }}>
              <button type="submit" style={buttonStyle(true)} disabled={saving}>
                {saving ? "Creating..." : "Create ticket"}
              </button>
            </div>
          </form>
        </section>

        <section style={ticketCardStyle()}>
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                color: "#8ea2cc",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: 1.2,
              }}
            >
              Queue
            </div>
            <h2 style={{ color: "#fff", margin: "8px 0 0" }}>All tickets</h2>
          </div>

          {loading ? (
            <p style={{ color: "#9fb0d7" }}>Loading tickets...</p>
          ) : tickets.length === 0 ? (
            <p style={{ color: "#9fb0d7" }}>No tickets found.</p>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              {tickets.map((ticket) => (
                <article
                  key={ticket.id}
                  style={{
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 16,
                    padding: 16,
                    background: "rgba(255,255,255,0.025)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "flex-start",
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <strong style={{ color: "#fff", fontSize: 16 }}>
                        #{ticket.id} {ticket.title}
                      </strong>
                      <div
                        style={{ color: "#93a5cc", fontSize: 13, marginTop: 6 }}
                      >
                        {ticket.creator?.firstName} {ticket.creator?.lastName}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span
                        style={{
                          padding: "6px 10px",
                          borderRadius: 999,
                          background: "rgba(99,102,241,0.16)",
                          color: "#cdd5ff",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {ticket.priority}
                      </span>

                      <span
                        style={{
                          padding: "6px 10px",
                          borderRadius: 999,
                          background:
                            ticket.status === "CLOSED"
                              ? "rgba(34,197,94,0.16)"
                              : "rgba(245,158,11,0.16)",
                          color:
                            ticket.status === "CLOSED" ? "#86efac" : "#fcd34d",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {ticket.status}
                      </span>
                    </div>
                  </div>

                  <p style={{ color: "#dbe4ff", margin: "0 0 12px" }}>
                    {ticket.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ color: "#8ea2cc", fontSize: 13 }}>
                      Agent:{" "}
                      {ticket.agent
                        ? `${ticket.agent.firstName} ${ticket.agent.lastName}`
                        : "Unassigned"}
                      {" · "}
                      {new Date(ticket.createdAt).toLocaleString()}
                    </div>

                    {ticket.status !== "CLOSED" && (
                      <button
                        type="button"
                        style={buttonStyle()}
                        onClick={() => handleCloseTicket(ticket.id)}
                      >
                        Close ticket
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

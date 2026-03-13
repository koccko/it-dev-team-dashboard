import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, logout } from "../api/auth";
import {
  getClosedTicketsCount,
  getOpenTicketsCount,
  listTickets,
} from "../api/tickets";
import AppShell from "../components/layout/AppShell";
import "./Dashboard.css";

const quickActions = [
  {
    title: "Create new ticket",
    meta: "Open a new support request",
    icon: "＋",
  },
  {
    title: "Open support chat",
    meta: "Start live team conversation",
    icon: "💬",
  },
  {
    title: "Check server status",
    meta: "Review infrastructure health",
    icon: "🖥",
  },
  {
    title: "View latest alerts",
    meta: "See warnings and incidents",
    icon: "🚨",
  },
  {
    title: "Assign ticket",
    meta: "Send issue to a teammate",
    icon: "👤",
  },
  {
    title: "Create incident",
    meta: "Log a critical event",
    icon: "⚡",
  },
];

const teamLeave = [
  {
    id: 1,
    name: "Emir",
    type: "Annual leave",
    status: "Approved",
    duration: "4 days",
    time: "Starts tomorrow",
    badgeClass: "dashboard-badge--low",
  },
  {
    id: 2,
    name: "Ivan",
    type: "Personal leave",
    status: "Pending",
    duration: "1 day",
    time: "Awaiting approval",
    badgeClass: "dashboard-badge--medium",
  },
  {
    id: 3,
    name: "Maria",
    type: "Sick leave",
    status: "Approved",
    duration: "2 days left",
    time: "Active now",
    badgeClass: "dashboard-badge--low",
  },
];

function AnimatedNumber({ value, duration = 900 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let current = 0;
    let animationFrame;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const nextValue = Math.floor(progress * value);

      if (nextValue !== current) {
        current = nextValue;
        setDisplayValue(nextValue);
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(update);
      } else {
        setDisplayValue(value);
      }
    }

    animationFrame = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <>{displayValue}</>;
}

function getActivityClass(type) {
  switch (type) {
    case "ticket":
      return "dashboard-activity-dot--ticket";
    case "resolved":
      return "dashboard-activity-dot--resolved";
    case "chat":
      return "dashboard-activity-dot--chat";
    case "review":
      return "dashboard-activity-dot--review";
    case "system":
      return "dashboard-activity-dot--system";
    case "closed":
      return "dashboard-activity-dot--closed";
    default:
      return "";
  }
}

function formatRole(roles) {
  if (!Array.isArray(roles) || !roles.length) return "User";
  return roles[0].replace("ROLE_", "").replaceAll("_", " ");
}

function safeCount(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  if (typeof value?.count === "number") return value.count;
  if (typeof value?.total === "number") return value.total;
  if (typeof value?.totalItems === "number") return value.totalItems;
  return 0;
}

function mapTicketToActivity(ticket) {
  const creatorName = ticket.creator
    ? `${ticket.creator.firstName || ""} ${ticket.creator.lastName || ""}`.trim()
    : "User";

  const type = ticket.status === "CLOSED" ? "closed" : "ticket";

  return {
    id: `activity-${ticket.id}`,
    type,
    title: `${creatorName} created ticket #${ticket.id}`,
    text: ticket.title,
    time: new Date(ticket.createdAt).toLocaleString(),
  };
}

function mapTicketToQueue(ticket) {
  return {
    id: `#${ticket.id}`,
    title: ticket.title,
    status: ticket.status,
    priority: ticket.priority,
    time: new Date(ticket.createdAt).toLocaleString(),
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [openCount, setOpenCount] = useState(0);
  const [closedCount, setClosedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const stats = useMemo(
    () => [
      {
        title: "Open Tickets",
        value: openCount,
        meta: "Current active issues",
      },
      {
        title: "Closed Tickets",
        value: closedCount,
        meta: "Resolved by team",
      },
      {
        title: "Total Tickets",
        value: tickets.length,
        meta: "Loaded from API",
      },
      {
        title: "Your Role",
        value: Array.isArray(user?.roles) ? user.roles.length : 0,
        meta: formatRole(user?.roles),
      },
    ],
    [openCount, closedCount, tickets.length, user],
  );

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        const [userData, openData, closedData, ticketsData] = await Promise.all(
          [
            getMe(),
            getOpenTicketsCount(),
            getClosedTicketsCount(),
            listTickets(),
          ],
        );

        if (!mounted) return;

        setUser(userData);
        setOpenCount(safeCount(openData));
        setClosedCount(safeCount(closedData));
        setTickets(ticketsData.slice(0, 6).map(mapTicketToQueue));
        setActivityFeed(ticketsData.slice(0, 6).map(mapTicketToActivity));
      } catch (error) {
        console.error("Dashboard load failed:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

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
      <div className="dashboard-page">
        <section className="dashboard-gradient-border">
          <div className="dashboard-activity-hero">
            <div className="dashboard-card__header dashboard-card__header--activity">
              <div>
                <span className="dashboard-card__eyebrow">Activity feed</span>
                <h2 className="dashboard-activity-hero__title">
                  Live workspace updates
                </h2>
                {user ? (
                  <p style={{ marginTop: 8, color: "#9fb0d7" }}>
                    {user.firstName} {user.lastName} · {formatRole(user.roles)}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="dashboard-activity-list">
              {activityFeed.length ? (
                activityFeed.map((item) => (
                  <article key={item.id} className="dashboard-activity-item">
                    <div
                      className={`dashboard-activity-dot ${getActivityClass(item.type)}`}
                    />
                    <div className="dashboard-activity-item__content">
                      <strong>{item.title}</strong>
                      <p>{item.text}</p>
                    </div>
                    <span className="dashboard-activity-item__time">
                      {item.time}
                    </span>
                  </article>
                ))
              ) : (
                <article className="dashboard-activity-item">
                  <div className="dashboard-activity-item__content">
                    <strong>
                      {loading ? "Loading..." : "No recent activity"}
                    </strong>
                    <p>Activity feed will appear here.</p>
                  </div>
                </article>
              )}
            </div>
          </div>
        </section>

        <section className="dashboard-stats">
          {stats.map((item) => (
            <article
              key={item.title}
              className="dashboard-stat-card dashboard-gradient-border"
            >
              <span className="dashboard-stat-card__label">{item.title}</span>
              <strong className="dashboard-stat-card__value">
                <AnimatedNumber value={item.value} />
              </strong>
              <span className="dashboard-stat-card__meta">{item.meta}</span>
            </article>
          ))}
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-card dashboard-card--actions dashboard-gradient-border">
            <article className="dashboard-card dashboard-gradient-border">
              <div className="dashboard-card__header">
                <div>
                  <span className="dashboard-card__eyebrow">
                    Infrastructure
                  </span>
                  <h3 className="dashboard-card__title">System status</h3>
                </div>
              </div>

              <div className="dashboard-system">
                <div className="dashboard-system-row">
                  <span>API Gateway</span>
                  <span className="dashboard-system-status online">Online</span>
                </div>

                <div className="dashboard-system-row">
                  <span>Database cluster</span>
                  <span className="dashboard-system-status online">
                    Healthy
                  </span>
                </div>

                <div className="dashboard-system-row">
                  <span>Ticket engine</span>
                  <span className="dashboard-system-status online">
                    Running
                  </span>
                </div>

                <div className="dashboard-system-row">
                  <span>Notification bus</span>
                  <span className="dashboard-system-status online">Online</span>
                </div>
              </div>
            </article>

            <div className="dashboard-card__header">
              <div>
                <span className="dashboard-card__eyebrow">Quick actions</span>
                <h3 className="dashboard-card__title">Common actions</h3>
              </div>
            </div>

            <div className="dashboard-actions">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  className="dashboard-action-tile"
                  type="button"
                  onClick={() => {
                    if (action.title === "Create new ticket") {
                      navigate("/tickets");
                    }
                  }}
                >
                  <span className="dashboard-action-tile__icon">
                    {action.icon}
                  </span>
                  <span className="dashboard-action-tile__content">
                    <strong>{action.title}</strong>
                    <span>{action.meta}</span>
                  </span>
                </button>
              ))}
            </div>
          </article>

          <div className="dashboard-side-stack">
            <article className="dashboard-card dashboard-gradient-border">
              <div className="dashboard-card__header">
                <div>
                  <span className="dashboard-card__eyebrow">Overview</span>
                  <h3 className="dashboard-card__title">Today summary</h3>
                </div>
              </div>

              <div className="dashboard-summary">
                <div className="dashboard-summary__row">
                  <span>Resolved tickets</span>
                  <strong>{closedCount}</strong>
                </div>
                <div className="dashboard-summary__row">
                  <span>Open requests</span>
                  <strong>{openCount}</strong>
                </div>
                <div className="dashboard-summary__row">
                  <span>Total queue</span>
                  <strong>{tickets.length}</strong>
                </div>
                <div className="dashboard-summary__row">
                  <span>Logged user</span>
                  <strong>{user ? user.firstName : "..."}</strong>
                </div>
              </div>
            </article>

            <article className="dashboard-card dashboard-gradient-border">
              <div className="dashboard-card__header">
                <div>
                  <span className="dashboard-card__eyebrow">Leave tracker</span>
                  <h3 className="dashboard-card__title">Team leave</h3>
                </div>
              </div>

              <div className="dashboard-ticket-list">
                {teamLeave.map((leave) => (
                  <article key={leave.id} className="dashboard-ticket-item">
                    <div className="dashboard-ticket-item__main">
                      <div className="dashboard-ticket-item__top">
                        <strong>{leave.name}</strong>
                        <span className={`dashboard-badge ${leave.badgeClass}`}>
                          {leave.status}
                        </span>
                      </div>
                      <p>{leave.type}</p>
                    </div>

                    <div className="dashboard-ticket-item__side">
                      <span className="dashboard-ticket-status">
                        {leave.duration}
                      </span>
                      <span className="dashboard-ticket-time">
                        {leave.time}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="dashboard-card dashboard-gradient-border">
          <div className="dashboard-card__header">
            <div>
              <span className="dashboard-card__eyebrow">Real-time tickets</span>
              <h3 className="dashboard-card__title">Latest queue updates</h3>
            </div>
          </div>

          <div className="dashboard-ticket-list">
            {tickets.length ? (
              tickets.map((ticket) => (
                <article key={ticket.id} className="dashboard-ticket-item">
                  <div className="dashboard-ticket-item__main">
                    <div className="dashboard-ticket-item__top">
                      <strong>{ticket.id}</strong>
                      <span
                        className={`dashboard-badge dashboard-badge--${String(
                          ticket.priority || "medium",
                        ).toLowerCase()}`}
                      >
                        {ticket.priority}
                      </span>
                    </div>

                    <p>{ticket.title}</p>
                  </div>

                  <div className="dashboard-ticket-item__side">
                    <span className="dashboard-ticket-status">
                      {ticket.status}
                    </span>
                    <span className="dashboard-ticket-time">{ticket.time}</span>
                  </div>
                </article>
              ))
            ) : (
              <article className="dashboard-ticket-item">
                <div className="dashboard-ticket-item__main">
                  <div className="dashboard-ticket-item__top">
                    <strong>{loading ? "Loading..." : "No tickets yet"}</strong>
                  </div>
                  <p>The queue will appear here.</p>
                </div>
              </article>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

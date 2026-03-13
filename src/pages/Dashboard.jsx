import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import AppShell from "../components/layout/AppShell";
import "./Dashboard.css";

const baseStats = [
  {
    title: "Open Tickets",
    value: 18,
    meta: "+3 today",
  },
  {
    title: "Active Chats",
    value: 7,
    meta: "2 waiting",
  },
  {
    title: "Systems Online",
    value: 24,
    meta: "All stable",
  },
  {
    title: "Pending Tasks",
    value: 12,
    meta: "5 high priority",
  },
];

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

const initialTickets = [
  {
    id: "#2451",
    title: "Network issue in office segment A",
    status: "In Progress",
    priority: "High",
    time: "5 min ago",
  },
  {
    id: "#2450",
    title: "Printer not reachable from finance PC",
    status: "Open",
    priority: "Medium",
    time: "12 min ago",
  },
  {
    id: "#2449",
    title: "User account permission update",
    status: "Resolved",
    priority: "Low",
    time: "28 min ago",
  },
  {
    id: "#2448",
    title: "Backup verification on archive node",
    status: "In Review",
    priority: "Medium",
    time: "42 min ago",
  },
];

const initialActivity = [
  {
    id: 1,
    type: "ticket",
    title: "Emir created ticket #2451",
    text: "Network issue reported in office segment A.",
    time: "2 min ago",
  },
  {
    id: 2,
    type: "resolved",
    title: "API authentication issue resolved",
    text: "Session refresh flow is now responding normally.",
    time: "9 min ago",
  },
  {
    id: 3,
    type: "chat",
    title: "New support chat started",
    text: "Finance operator opened a priority conversation.",
    time: "14 min ago",
  },
  {
    id: 4,
    type: "review",
    title: "Ticket #2448 moved to In Review",
    text: "Backup verification completed.",
    time: "26 min ago",
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

export default function Dashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState(initialTickets);
  const [activityFeed, setActivityFeed] = useState(initialActivity);

  const stats = useMemo(() => baseStats, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickets((prev) => {
        const next = [...prev];
        const first = next.shift();

        if (first) {
          next.push({
            ...first,
            time: "Just now",
          });
        }

        return next;
      });

      setActivityFeed((prev) => {
        const next = [...prev];
        const first = next.pop();

        if (first) {
          next.unshift({
            ...first,
            id: Date.now(),
            time: "Just now",
          });
        }

        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
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
    <AppShell onLogout={handleLogout}>
      <div className="dashboard-page">
        <section className="dashboard-gradient-border">
          <div className="dashboard-activity-hero">
            <div className="dashboard-card__header dashboard-card__header--activity">
              <div>
                <span className="dashboard-card__eyebrow">Activity feed</span>
                <h2 className="dashboard-activity-hero__title">
                  Live workspace updates
                </h2>
              </div>
            </div>

            <div className="dashboard-activity-list">
              {activityFeed.map((item) => (
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
              ))}
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
                <button key={action.title} className="dashboard-action-tile">
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
                  <strong>9</strong>
                </div>
                <div className="dashboard-summary__row">
                  <span>New requests</span>
                  <strong>4</strong>
                </div>
                <div className="dashboard-summary__row">
                  <span>Team response rate</span>
                  <strong>96%</strong>
                </div>
                <div className="dashboard-summary__row">
                  <span>Average wait time</span>
                  <strong>12 min</strong>
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
            {tickets.map((ticket) => (
              <article key={ticket.id} className="dashboard-ticket-item">
                <div className="dashboard-ticket-item__main">
                  <div className="dashboard-ticket-item__top">
                    <strong>{ticket.id}</strong>
                    <span
                      className={`dashboard-badge dashboard-badge--${ticket.priority.toLowerCase()}`}
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
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const menuItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h7v7H4V4Zm9 0h7v4h-7V4ZM13 10h7v10h-7V10ZM4 13h7v7H4v-7Z" />
      </svg>
    ),
  },
  {
    to: "/tickets",
    label: "Tickets",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5V9a2 2 0 0 0 0 4v1.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 14.5V13a2 2 0 0 0 0-4V7.5Zm7 1.25a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Zm0 5a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Z" />
      </svg>
    ),
  },
  {
    to: "/chat",
    label: "Chat",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 5h12a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H11l-4.5 3.2A1 1 0 0 1 5 19.4V17a3 3 0 0 1-2-2.8V8a3 3 0 0 1 3-3Zm2.5 6.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm3.5 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm3.5 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z" />
      </svg>
    ),
  },
  {
    to: "/info",
    label: "Info",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm0 4.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm-1 5.25a.75.75 0 0 0 0 1.5h.25V17a.75.75 0 0 0 1.5 0v-4.5A.75.75 0 0 0 12 11h-1Z" />
      </svg>
    ),
  },
];

const leaveItems = [
  {
    id: 1,
    name: "Emir",
    status: "Approved",
    statusClass: "sidebar__leave-badge--approved",
    meta: "Starts tomorrow",
  },
  {
    id: 2,
    name: "Ivan",
    status: "Pending",
    statusClass: "sidebar__leave-badge--pending",
    meta: "Awaiting approval",
  },
];

function ChevronIcon({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`sidebar__accordion-chevron ${open ? "sidebar__accordion-chevron--open" : ""}`}
    >
      <path
        d="M8 10l4 4 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LeaveIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3.75a.75.75 0 0 1 .75.75V6h8.5V4.5a.75.75 0 0 1 1.5 0V6h.75A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-9A2.5 2.5 0 0 1 5.5 6h.75V4.5A.75.75 0 0 1 7 3.75ZM4.5 10v7.5c0 .552.448 1 1 1h13c.552 0 1-.448 1-1V10h-15Zm1-2.5a1 1 0 0 0-1 1V8.5h15v-.001a1 1 0 0 0-1-1h-13Z" />
    </svg>
  );
}

export default function Sidebar({ onLogout, collapsed, onToggleCollapse }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(true);

  function handleUserCardClick() {
    setUserMenuOpen((prev) => !prev);
  }

  function handleLogoutClick(e) {
    e.stopPropagation();
    setUserMenuOpen(false);
    onLogout();
  }

  function handleMenuPlaceholder(e) {
    e.stopPropagation();
  }

  function handleToggleCollapse() {
    setUserMenuOpen(false);
    onToggleCollapse();
  }

  function handleLeaveToggle() {
    if (collapsed) return;
    setLeaveOpen((prev) => !prev);
  }

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
      <div className="sidebar__neon-divider" aria-hidden="true" />
      <div className="sidebar__inner">
        <div className="sidebar__header">
          <div className="sidebar__brand">
            <div className="sidebar__brand-glow" />
            <div className="sidebar__logo-wrap">
              <img
                src="/logo.png"
                alt="IT DEV TEAM"
                className="sidebar__logo"
              />
            </div>

            {!collapsed && (
              <div className="sidebar__brand-text">
                <span className="sidebar__brand-eyebrow">Workspace</span>
                <strong>IT DEV TEAM</strong>
                <span>Internal Panel</span>
              </div>
            )}
          </div>

          <button
            className="sidebar__collapse"
            onClick={handleToggleCollapse}
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15.5 5.5 9 12l6.5 6.5" />
            </svg>
            {!collapsed && <span>Collapse sidebar</span>}
          </button>
        </div>

        <div className="sidebar__content">
          <nav className="sidebar__nav" aria-label="Main navigation">
            {!collapsed && (
              <span className="sidebar__section-label">Navigation</span>
            )}

            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
                }
                title={item.label}
                onClick={() => setUserMenuOpen(false)}
              >
                <span className="sidebar__icon-wrap">
                  <span className="sidebar__icon">{item.icon}</span>
                </span>
                {!collapsed && (
                  <span className="sidebar__label">{item.label}</span>
                )}
              </NavLink>
            ))}
          </nav>

          {!collapsed && (
            <div className="sidebar__accordion">
              <span className="sidebar__section-label">Leave tracker</span>

              <button
                type="button"
                className={`sidebar__link sidebar__accordion-trigger ${leaveOpen ? "sidebar__accordion-trigger--open" : ""}`}
                onClick={handleLeaveToggle}
              >
                <span className="sidebar__icon-wrap">
                  <span className="sidebar__icon">
                    <LeaveIcon />
                  </span>
                </span>

                <span className="sidebar__label">Team leave</span>

                <span className="sidebar__accordion-right">
                  <ChevronIcon open={leaveOpen} />
                </span>
              </button>

              <div
                className={`sidebar__accordion-content ${leaveOpen ? "sidebar__accordion-content--open" : ""}`}
              >
                <div className="sidebar__accordion-inner">
                  <div className="sidebar__leave-list sidebar__leave-list--compact">
                    {leaveItems.map((item) => (
                      <div
                        key={item.id}
                        className="sidebar__leave-item sidebar__leave-item--compact"
                      >
                        <div className="sidebar__leave-top">
                          <strong>{item.name}</strong>
                          <span
                            className={`sidebar__leave-badge ${item.statusClass}`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <span className="sidebar__leave-meta">{item.meta}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="sidebar__leave-view-all"
                    onClick={() => {}}
                  >
                    View all leave
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sidebar__footer">
          {!collapsed && (
            <>
              <span className="sidebar__section-label">Account</span>

              <div
                className="sidebar__user"
                onClick={handleUserCardClick}
                role="button"
                tabIndex={0}
                title="Open user menu"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleUserCardClick();
                  }
                }}
              >
                <div className="sidebar__user-avatar">
                  E
                  <span className="sidebar__user-status" />
                </div>

                <div className="sidebar__user-info">
                  <strong>Emir</strong>
                  <span>Support Engineer</span>
                </div>
              </div>

              {userMenuOpen && (
                <div className="sidebar__user-menu">
                  <button
                    className="sidebar__user-menu-item"
                    type="button"
                    onClick={handleMenuPlaceholder}
                  >
                    👤 Profile
                  </button>

                  <button
                    className="sidebar__user-menu-item"
                    type="button"
                    onClick={handleMenuPlaceholder}
                  >
                    ⚙ Settings
                  </button>

                  <button
                    className="sidebar__user-menu-item sidebar__user-menu-item--danger"
                    type="button"
                    onClick={handleLogoutClick}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </>
          )}

          <button
            className="sidebar__logout"
            onClick={onLogout}
            type="button"
            title="Logout"
          >
            <span className="sidebar__icon-wrap sidebar__icon-wrap--logout">
              <span className="sidebar__icon">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 17l5-5-5-5" />
                  <path d="M21 12H9" />
                  <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" />
                </svg>
              </span>
            </span>
            {!collapsed && <span className="sidebar__label">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

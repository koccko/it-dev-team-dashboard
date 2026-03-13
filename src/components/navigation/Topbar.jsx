import { useEffect, useState } from "react";
import "./Topbar.css";

function getWeatherType(temp) {
  if (temp === null) return "cloud";
  if (temp <= 0) return "snow";
  if (temp <= 10) return "fog";
  if (temp <= 18) return "cloud-sun";
  if (temp <= 25) return "sun";
  if (temp <= 32) return "hot";
  return "hot";
}

function WeatherIcon({ type }) {
  switch (type) {
    case "snow":
      return (
        <svg
          viewBox="0 0 24 24"
          className="topbar-weather-svg"
          aria-hidden="true"
        >
          <path
            d="M12 3v18M7.5 5.5 16.5 18.5M16.5 5.5 7.5 18.5M4 9h16M4 15h16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "fog":
      return (
        <svg
          viewBox="0 0 24 24"
          className="topbar-weather-svg"
          aria-hidden="true"
        >
          <path
            d="M6 9.5a4.5 4.5 0 1 1 8.7-1.6A3.8 3.8 0 1 1 17.5 15H7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 18h11M6 21h8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "cloud-sun":
      return (
        <svg
          viewBox="0 0 24 24"
          className="topbar-weather-svg"
          aria-hidden="true"
        >
          <circle
            cx="9"
            cy="8"
            r="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M9 2.8v1.7M9 11.5v1.7M3.8 8H5.5M12.5 8h1.7M5.4 4.4l1.2 1.2M11.4 10.4l1.2 1.2M12.6 4.4l-1.2 1.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M8 17h8a3.5 3.5 0 0 0 .4-7A5 5 0 0 0 7 11a3 3 0 0 0 1 6Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "sun":
      return (
        <svg
          viewBox="0 0 24 24"
          className="topbar-weather-svg"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "hot":
      return (
        <svg
          viewBox="0 0 24 24"
          className="topbar-weather-svg"
          aria-hidden="true"
        >
          <path
            d="M14 14.8V5.5a2 2 0 1 0-4 0v9.3a4.5 4.5 0 1 0 4 0Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 10v6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          className="topbar-weather-svg"
          aria-hidden="true"
        >
          <path
            d="M8 17h8a3.5 3.5 0 0 0 .4-7A5 5 0 0 0 7 11a3 3 0 0 0 1 6Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="topbar-logout-svg"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" />
      <path d="M13 8l5 4-5 4" />
      <path d="M18 12H9" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="topbar-bell-svg"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 17H9" />
      <path d="M18 17H6c1.1-1.1 2-2.7 2-4.5V10a4 4 0 1 1 8 0v2.5c0 1.8.9 3.4 2 4.5Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

function formatDate(date) {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

const initialNotifications = [
  {
    id: 1,
    type: "ticket",
    title: "New ticket created",
    text: "Ticket #2457 was opened by Emir.",
    time: "2 min ago",
  },
  {
    id: 2,
    type: "system",
    title: "Server sync completed",
    text: "Archive node finished the latest sync job.",
    time: "9 min ago",
  },
  {
    id: 3,
    type: "chat",
    title: "New support chat",
    text: "Finance team started a live conversation.",
    time: "14 min ago",
  },
];

export default function Topbar({ onLogout }) {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications] = useState(initialNotifications);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadWeather() {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=42.1354&longitude=24.7453&current=temperature_2m&timezone=Europe%2FSofia",
        );

        if (!res.ok) throw new Error("Failed to load weather");
        const data = await res.json();

        if (mounted && data?.current?.temperature_2m !== undefined) {
          setWeather(Math.round(data.current.temperature_2m));
        }
      } catch (err) {
        console.log("Weather unavailable");
      }
    }

    loadWeather();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside() {
      setNotificationOpen(false);
    }

    if (notificationOpen) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [notificationOpen]);

  const weatherType = getWeatherType(weather);
  const date = formatDate(time);
  const clock = time.toLocaleTimeString("en-GB");
  const unreadCount = notifications.length;

  return (
    <header className="topbar">
      <div className="topbar__left">
        <span className="topbar__eyebrow">Internal workspace</span>

        <div className="topbar__title-row">
          <h1 className="topbar__title">Dashboard</h1>
          <span className="topbar__subtitle">
            Overview of tickets, activity and team operations
          </span>
        </div>
      </div>

      <div className="topbar__right">
        <div className="topbar-strip">
          <div className="topbar-strip__item">
            <span className="topbar-strip__icon">
              <WeatherIcon type={weatherType} />
            </span>
            <span className="topbar-strip__value">
              Plovdiv {weather !== null ? `${weather}°C` : "--°C"}
            </span>
          </div>

          <span className="topbar-strip__divider" />

          <div className="topbar-strip__item">
            <span className="topbar-strip__muted">{date}</span>
            <span className="topbar-strip__clock">{clock}</span>
          </div>

          <span className="topbar-strip__divider" />

          <div className="topbar-strip__item topbar-strip__item--status">
            <span className="topbar-live-dot" />
            <span className="topbar-strip__status-text">
              All systems operational
            </span>
          </div>

          <span className="topbar-strip__divider" />

          <div
            className="topbar-notifications"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="topbar__notifications-btn"
              type="button"
              aria-label="Notifications"
              title="Notifications"
              onClick={() => setNotificationOpen((prev) => !prev)}
            >
              <BellIcon />
              {unreadCount > 0 && (
                <span className="topbar__notifications-badge">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationOpen && (
              <div className="topbar__notifications-menu">
                <div className="topbar__notifications-header">
                  <strong>Notifications</strong>
                  <span>{unreadCount} new</span>
                </div>

                <div className="topbar__notifications-list">
                  {notifications.map((item) => (
                    <div key={item.id} className="topbar__notification-item">
                      <span
                        className={`topbar__notification-dot topbar__notification-dot--${item.type}`}
                      />
                      <div className="topbar__notification-content">
                        <strong>{item.title}</strong>
                        <p>{item.text}</p>
                      </div>
                      <span className="topbar__notification-time">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <span className="topbar-strip__divider" />

          <button
            className="topbar__logout"
            onClick={onLogout}
            type="button"
            aria-label="Logout"
            title="Logout"
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </header>
  );
}

import { useState } from "react";
import Sidebar from "../navigation/Sidebar";
import Topbar from "../navigation/Topbar";
import "./AppShell.css";

export default function AppShell({ children, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`app-shell ${collapsed ? "app-shell--collapsed" : ""}`}>
      <Sidebar
        onLogout={onLogout}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
      />

      <div className="app-shell__main">
        <Topbar
          onLogout={onLogout}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((prev) => !prev)}
        />

        <main className="app-shell__content">{children}</main>
      </div>
    </div>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import TicketsPage from "./pages/TicketsPage";
import ProtectedRoute from "./components/ProtectedRoute";

function PlaceholderPage({ title }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#070d18",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ marginBottom: 8 }}>{title}</h1>
        <p style={{ opacity: 0.7 }}>Page coming soon</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <TicketsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <PlaceholderPage title="Chat" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/info"
          element={
            <ProtectedRoute>
              <PlaceholderPage title="Info" />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

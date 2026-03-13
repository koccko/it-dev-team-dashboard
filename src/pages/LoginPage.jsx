import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { login, getMe } from "../api/auth";
import "./LoginPage.css";

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticles(count = 28) {
  return Array.from({ length: count }, (_, index) => ({
    id: `p-${index}-${Math.random().toString(36).slice(2, 8)}`,
    left: `${randomBetween(0, 100)}%`,
    size: `${randomBetween(2, 6)}px`,
    duration: `${randomBetween(8, 18)}s`,
    delay: `${randomBetween(0, 10)}s`,
    opacity: randomBetween(0.2, 0.9),
  }));
}

export default function LoginPage() {
  const navigate = useNavigate();
  const pageRef = useRef(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");

  const particles = useMemo(() => createParticles(30), []);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        await getMe();

        if (mounted) {
          navigate("/dashboard", { replace: true });
        }
      } catch (err) {
        console.log("No active session");
      } finally {
        if (mounted) {
          setCheckingSession(false);
        }
      }
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;

    let rafId = null;

    function handleMouseMove(e) {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;

      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        el.style.setProperty("--mx", x.toFixed(3));
        el.style.setProperty("--my", y.toFixed(3));
      });
    }

    function resetParallax() {
      el.style.setProperty("--mx", "0");
      el.style.setProperty("--my", "0");
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", resetParallax);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", resetParallax);

      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      await login({
        username: username.trim(),
        password,
      });

      await getMe();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="login-page" ref={pageRef}>
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>

        <div className="particles-layer" aria-hidden="true">
          {particles.map((particle) => (
            <span
              key={particle.id}
              className="particle"
              style={{
                left: particle.left,
                width: particle.size,
                height: particle.size,
                animationDuration: particle.duration,
                animationDelay: particle.delay,
                opacity: particle.opacity,
              }}
            />
          ))}
        </div>

        <div className="login-center">
          <div className="login-card">
            <img src="/logo.png" className="login-logo" alt="IT DEV TEAM" />
            <p className="login-welcome">Checking session...</p>
            <h2 className="login-title">Please wait</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page" ref={pageRef}>
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <div className="bg-orb bg-orb-3"></div>

      <div className="particles-layer" aria-hidden="true">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="particle"
            style={{
              left: particle.left,
              width: particle.size,
              height: particle.size,
              animationDuration: particle.duration,
              animationDelay: particle.delay,
              opacity: particle.opacity,
            }}
          />
        ))}
      </div>

      <div className="login-center">
        <div className="login-card">
          <img src="/logo.png" className="login-logo" alt="IT DEV TEAM" />

          <p className="login-welcome">Welcome back</p>
          <h2 className="login-title">Sign in to your account</h2>

          <form className="login-form" onSubmit={handleLogin}>
            <label htmlFor="username">Email</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />

            <label htmlFor="password">Password</label>

            <div className="password-field">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />

              <button
                type="button"
                className="show-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            <div className="login-options">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={loading}
                />
                Remember me
              </label>

              <a href="#" className="forgot">
                Forgot password?
              </a>
            </div>

            {error ? (
              <div className="login-error" role="alert">
                {error}
              </div>
            ) : null}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

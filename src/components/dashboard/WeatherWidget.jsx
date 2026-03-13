import { useEffect, useState } from "react";
import "./WeatherWidget.css";

const WEATHER_CODE_MAP = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Rain showers",
  81: "Moderate showers",
  82: "Violent showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Heavy thunderstorm with hail",
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState({
    loading: true,
    error: "",
    city: "Plovdiv",
    temperature: null,
    windSpeed: null,
    description: "",
  });

  useEffect(() => {
    let mounted = true;

    async function loadWeather() {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=42.1354&longitude=24.7453&current=temperature_2m,weather_code,wind_speed_10m&timezone=Europe%2FSofia",
        );

        if (!res.ok) {
          throw new Error("Failed to load weather");
        }

        const data = await res.json();
        const current = data?.current;

        if (!mounted || !current) return;

        setWeather({
          loading: false,
          error: "",
          city: "Plovdiv",
          temperature: Math.round(current.temperature_2m),
          windSpeed: Math.round(current.wind_speed_10m),
          description: WEATHER_CODE_MAP[current.weather_code] || "Unknown",
        });
      } catch (error) {
        if (!mounted) return;

        setWeather({
          loading: false,
          error: "Weather unavailable",
          city: "Plovdiv",
          temperature: null,
          windSpeed: null,
          description: "",
        });
      }
    }

    loadWeather();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <article className="weather-widget">
      <div className="weather-widget__top">
        <div>
          <span className="weather-widget__eyebrow">Weather</span>
          <h3 className="weather-widget__title">{weather.city}</h3>
        </div>

        <div className="weather-widget__icon">☁</div>
      </div>

      {weather.loading ? (
        <div className="weather-widget__loading">Loading weather...</div>
      ) : weather.error ? (
        <div className="weather-widget__error">{weather.error}</div>
      ) : (
        <>
          <div className="weather-widget__temp">{weather.temperature}°C</div>
          <p className="weather-widget__desc">{weather.description}</p>

          <div className="weather-widget__meta">
            <div className="weather-widget__meta-item">
              <span>Wind</span>
              <strong>{weather.windSpeed} km/h</strong>
            </div>

            <div className="weather-widget__meta-item">
              <span>Timezone</span>
              <strong>Sofia</strong>
            </div>
          </div>
        </>
      )}
    </article>
  );
}

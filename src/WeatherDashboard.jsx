import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  Wind,
  Droplets,
  Sun,
  Sunrise,
  Sunset,
  Compass,
  Eye,
  Gauge,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  RefreshCw,
  AlertTriangle,
  Navigation,
  Globe
} from 'lucide-react';
import { MOCK_WEATHER_DATA } from './mockWeatherData';
import { fetchFreeLiveWeather } from './services/freeLiveWeather';
import LivingWeatherBackground from './components/LivingWeatherBackground';
import './WeatherDashboard.css';

export default function WeatherDashboard() {
  const [city, setCity] = useState('London');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search input state
  const [searchInput, setSearchInput] = useState('');

  // API Key management (Environment Variable or User Provided or LocalStorage)
  const defaultEnvKey = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('owm_user_api_key') || defaultEnvKey;
  });

  // Popular quick-selection presets
  const popularCities = ['London', 'Tokyo', 'New York', 'Reykjavik', 'Singapore', 'San Francisco', 'Paris', 'Mumbai'];

  // Core API Fetching Function (Matches Assignment Specification)
  const fetchWeather = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const urlObj = new URL(url);
      const qParam = urlObj.searchParams.get('q');
      const latParam = urlObj.searchParams.get('lat');
      const lonParam = urlObj.searchParams.get('lon');

      // 1. If user entered a custom OpenWeatherMap API Key, use official OpenWeatherMap API
      if (apiKey && apiKey.trim() !== '' && apiKey !== 'YOUR_KEY') {
        const res = await fetch(url);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('City not found (HTTP 404). Please verify city name.');
          } else if (res.status === 401) {
            throw new Error('Invalid OpenWeatherMap API Key (HTTP 401). Falling back to Live Global Feed.');
          } else {
            throw new Error('Location not found or permissions blocked.');
          }
        }
        const data = await res.json();
        setWeather(data);
        return;
      }

      // 2. Default: Real-time Live Global Meteorological Telemetry (No API Key Required!)
      const liveData = await fetchFreeLiveWeather({
        city: qParam,
        lat: latParam ? parseFloat(latParam) : null,
        lon: lonParam ? parseFloat(lonParam) : null
      });
      setWeather(liveData);
    } catch (err) {
      // If network fails, try fallback mock if available
      try {
        const urlObj = new URL(url);
        const qParam = urlObj.searchParams.get('q');
        if (qParam && MOCK_WEATHER_DATA[qParam]) {
          setWeather(MOCK_WEATHER_DATA[qParam]);
          return;
        }
      } catch {
        // pass
      }
      setError(err.message || 'Location not found or permissions blocked.');
    } finally {
      setLoading(false);
    }
  };

  // Synchronous city update via useEffect as specified in documentation
  useEffect(() => {
    const activeKey = apiKey && apiKey.trim() !== '' ? apiKey.trim() : 'YOUR_KEY';
    fetchWeather(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&units=metric&appid=${activeKey}`
    );
  }, [city, apiKey]);

  // Live Location Detection using HTML5 Geolocation API
  const handleLiveLocation = () => {
    if (!navigator.geolocation) {
      return setError('Geolocation is not supported by your browser.');
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const activeKey = apiKey && apiKey.trim() !== '' ? apiKey.trim() : 'YOUR_KEY';
        fetchWeather(
          `https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=metric&appid=${activeKey}`
        );
      },
      (geoError) => {
        setLoading(false);
        if (geoError.code === 1) {
          setError('Permission denied. Please allow location access in your browser.');
        } else if (geoError.code === 2) {
          setError('Position unavailable. Unable to determine physical GPS coordinates.');
        } else {
          setError('Unable to retrieve your live location.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput.trim());
      setSearchInput('');
    }
  };



  // Dynamic Weather Color Grading determination
  const weatherCondition = weather?.weather?.[0]?.main || 'Clear';
  const themeClass = useMemo(() => {
    switch (weatherCondition.toLowerCase()) {
      case 'clear':
        return 'theme-clear'; // Warm amber / golden
      case 'rain':
      case 'drizzle':
        return 'theme-rain'; // Deep slate blue
      case 'clouds':
        return 'theme-clouds'; // Neutral grey-blue
      case 'snow':
        return 'theme-snow'; // Icy blue
      case 'thunderstorm':
        return 'theme-thunderstorm'; // Electric violet / dark navy
      case 'mist':
      case 'fog':
      case 'haze':
      case 'smoke':
      case 'dust':
        return 'theme-atmosphere'; // Atmospheric muted teal-slate
      default:
        return 'theme-clear';
    }
  }, [weatherCondition]);

  // Format Unix timestamp into localized time string
  const formatTime = (unixTimestamp, timezoneOffset = 0) => {
    if (!unixTimestamp) return '--:--';
    // Calculate timestamp according to location's timezone offset
    const date = new Date((unixTimestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    });
  };

  // Helper for weather icons
  const getWeatherIcon = (mainCondition) => {
    switch (mainCondition?.toLowerCase()) {
      case 'clear':
        return <Sun className="weather-svg-icon text-amber" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="weather-svg-icon text-cyan" />;
      case 'snow':
        return <CloudSnow className="weather-svg-icon text-ice" />;
      case 'thunderstorm':
        return <CloudLightning className="weather-svg-icon text-purple" />;
      case 'clouds':
        return <Cloud className="weather-svg-icon text-slate" />;
      case 'mist':
      case 'fog':
      case 'haze':
        return <CloudFog className="weather-svg-icon text-teal" />;
      default:
        return <Sun className="weather-svg-icon text-amber" />;
    }
  };

  // Calculate daylight percentage
  const daylightProgress = useMemo(() => {
    if (!weather?.sys?.sunrise || !weather?.sys?.sunset) return 50;
    const now = Math.floor(Date.now() / 1000);
    const total = weather.sys.sunset - weather.sys.sunrise;
    const current = now - weather.sys.sunrise;
    if (total <= 0) return 50;
    const pct = Math.min(Math.max((current / total) * 100, 0), 100);
    return Math.round(pct);
  }, [weather]);

  return (
    <div className={`dashboard-wrapper ${themeClass}`}>
      {/* Living Atmospheric Weather Background (Vivid dynamic sky, celestial sun/moon, clouds, lightning, particles) */}
      <LivingWeatherBackground
        condition={weather?.weather?.[0]?.main || 'Clear'}
        isDay={weather?.weather?.[0]?.icon?.includes('d') ?? true}
        coord={weather?.coord}
      />

      <div className="dashboard-content">
        {/* Top Header & Geospatial Control Bar */}
        <header className="control-header">
          <div className="brand-section">
            <div className="radar-status-dot" />
            <div>
              <h1 className="brand-title">AERO<span className="brand-accent">MET</span></h1>
              <p className="brand-subtitle">Weather Analytics & Geolocation Intelligence</p>
            </div>
          </div>

          {/* Clean Status Indicator (Custom Key & Exit Map buttons removed) */}
          <div className="header-actions">
            <div
              className="mode-badge-live"
              title="Real-time global meteorological telemetry is active"
            >
              <span className="badge-indicator-live" />
              <span>Live Weather Telemetry</span>
            </div>
          </div>
        </header>

        {/* Search & Geolocation Action Bar */}
        <section className="search-bar-section">
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <div className="input-field-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search any global city (e.g., London, Tokyo, New York)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="city-search-input"
              />
              {loading && <div className="inline-pulse-dot" />}
            </div>

            <button type="submit" className="search-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="spin-icon" size={18} />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search size={18} />
                  <span>Search City</span>
                </>
              )}
            </button>

            {/* One-click HTML5 Geolocation Trigger */}
            <button
              type="button"
              onClick={handleLiveLocation}
              className="geolocation-trigger-btn"
              disabled={loading}
              title="Detect your real physical position via HTML5 Geolocation"
            >
              <Navigation size={18} className="geo-icon" />
              <span>Live Location</span>
            </button>
          </form>

          {/* Quick preset city chips */}
          <div className="quick-cities-strip">
            <span className="quick-label">Geospatial Presets:</span>
            <div className="chips-container">
              {popularCities.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`city-chip ${weather?.name?.toLowerCase() === c.toLowerCase() ? 'active' : ''}`}
                  onClick={() => setCity(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Error Alert Banner */}
        {error && (
          <div className="error-alert-banner" role="alert">
            <div className="error-icon-wrapper">
              <AlertTriangle size={22} />
            </div>
            <div className="error-text">
              <strong>Telemetry Error:</strong> {error}
            </div>
            <div className="error-actions">
              <button
                type="button"
                className="retry-btn"
                onClick={() => setCity('London')}
              >
                Reset to London
              </button>
              <button
                type="button"
                className="dismiss-btn"
                onClick={() => setError(null)}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Loading Spinner Feedback Component */}
        {loading && (
          <div className="loading-state-container">
            <div className="radar-pulse-spinner">
              <div className="radar-sweep" />
              <div className="radar-ring r1" />
              <div className="radar-ring r2" />
              <div className="radar-ring r3" />
            </div>
            <p className="loading-label">Acquiring atmospheric metrics...</p>
          </div>
        )}

        {/* Weather Dashboard Core Analytics View */}
        {weather && !loading && (
          <main className="dashboard-grid">
            {/* Primary Hero Meteorological Card */}
            <div className="telemetry-card hero-weather-card">
              <div className="card-ambient-glow" />
              
              <div className="card-top-meta">
                <div className="location-heading">
                  <MapPin className="pin-icon" size={22} />
                  <h2>{weather.name}</h2>
                  {weather.sys?.state && (
                    <span className="state-tag">{weather.sys.state}</span>
                  )}
                  {weather.sys?.country && (
                    <span className="country-tag">{weather.sys.country}</span>
                  )}
                </div>
                <div className="coords-badge">
                  <Globe size={14} />
                  <span>
                    {weather.coord?.lat?.toFixed(2)}°, {weather.coord?.lon?.toFixed(2)}°
                  </span>
                </div>
              </div>

              <div className="hero-metrics-layout">
                {/* Visual Icon & Main Condition */}
                <div className="weather-visual-block">
                  {weather.weather?.[0]?.icon ? (
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                      alt={weather.weather[0].description}
                      className="official-weather-img"
                      onError={(e) => {
                        // fallback to SVG if image CDN fails
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : null}
                  <div className="svg-fallback-icon">
                    {getWeatherIcon(weather.weather?.[0]?.main)}
                  </div>
                  <div className="condition-pill">
                    {weather.weather?.[0]?.main || 'Clear'}
                  </div>
                  <p className="weather-desc">
                    {weather.weather?.[0]?.description || 'Clear sky'}
                  </p>
                </div>

                {/* Primary Temperature */}
                <div className="temperature-block">
                  <div className="temp-display">
                    <span className="temp-val">{Math.round(weather.main?.temp ?? 0)}</span>
                    <span className="temp-unit">°C</span>
                  </div>
                  <div className="temp-sub-metrics">
                    <span className="feels-like">
                      Feels like <strong>{Math.round(weather.main?.feels_like ?? 0)}°C</strong>
                    </span>
                    <div className="min-max-range">
                      <span>↓ {Math.round(weather.main?.temp_min ?? 0)}°C</span>
                      <span className="sep">/</span>
                      <span>↑ {Math.round(weather.main?.temp_max ?? 0)}°C</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Theme Color Status Bar */}
              <div className="theme-condition-footer">
                <span className="theme-dot" />
                <span className="theme-text">
                  Atmospheric Palette: <strong>{weather.weather?.[0]?.main} Dynamic Grading</strong>
                </span>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="metrics-side-grid">
              {/* Humidity Card */}
              <div className="telemetry-card metric-item-card">
                <div className="metric-header">
                  <div className="metric-icon-box bg-blue">
                    <Droplets size={20} />
                  </div>
                  <span className="metric-title">Humidity</span>
                </div>
                <div className="metric-body">
                  <div className="metric-value">
                    {weather.main?.humidity ?? '--'}
                    <span className="metric-unit">%</span>
                  </div>
                  <p className="metric-desc">
                    {weather.main?.humidity > 70
                      ? 'High Moisture / Muggy'
                      : weather.main?.humidity < 35
                      ? 'Dry Conditions'
                      : 'Comfortable Level'}
                  </p>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill fill-blue"
                    style={{ width: `${Math.min(weather.main?.humidity || 0, 100)}%` }}
                  />
                </div>
              </div>

              {/* Wind Speed Card */}
              <div className="telemetry-card metric-item-card">
                <div className="metric-header">
                  <div className="metric-icon-box bg-teal">
                    <Wind size={20} />
                  </div>
                  <span className="metric-title">Wind Speed</span>
                </div>
                <div className="metric-body">
                  <div className="metric-value">
                    {weather.wind?.speed ?? '--'}
                    <span className="metric-unit">m/s</span>
                  </div>
                  <p className="metric-desc">
                    {weather.wind?.deg ? `Direction: ${weather.wind.deg}°` : 'Calm breeze'} •{' '}
                    {weather.wind?.speed ? `${(weather.wind.speed * 3.6).toFixed(1)} km/h` : ''}
                  </p>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill fill-teal"
                    style={{ width: `${Math.min(((weather.wind?.speed || 0) / 25) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Atmospheric Pressure Card */}
              <div className="telemetry-card metric-item-card">
                <div className="metric-header">
                  <div className="metric-icon-box bg-purple">
                    <Gauge size={20} />
                  </div>
                  <span className="metric-title">Pressure</span>
                </div>
                <div className="metric-body">
                  <div className="metric-value">
                    {weather.main?.pressure ?? '--'}
                    <span className="metric-unit">hPa</span>
                  </div>
                  <p className="metric-desc">
                    {weather.main?.pressure > 1013 ? 'High Barometer' : 'Standard / Low Barometer'}
                  </p>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill fill-purple"
                    style={{
                      width: `${Math.min(Math.max((((weather.main?.pressure || 1013) - 970) / 70) * 100, 0), 100)}%`
                    }}
                  />
                </div>
              </div>

              {/* Visibility / Clouds Card */}
              <div className="telemetry-card metric-item-card">
                <div className="metric-header">
                  <div className="metric-icon-box bg-amber">
                    <Eye size={20} />
                  </div>
                  <span className="metric-title">Visibility & Clouds</span>
                </div>
                <div className="metric-body">
                  <div className="metric-value">
                    {weather.visibility ? `${(weather.visibility / 1000).toFixed(1)}` : '--'}
                    <span className="metric-unit">km</span>
                  </div>
                  <p className="metric-desc">
                    Cloud Cover: {weather.clouds?.all ?? 0}% • Horizon Clear
                  </p>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill fill-amber"
                    style={{ width: `${weather.clouds?.all ?? 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Celestial Card: Sunrise & Sunset Timestamps */}
            <div className="telemetry-card celestial-card">
              <div className="celestial-header">
                <div className="celestial-title-wrap">
                  <Sun className="celestial-sun-icon" size={24} />
                  <div>
                    <h3>Celestial Horizon Data</h3>
                    <p>Solar cycle timings for local coordinates</p>
                  </div>
                </div>
                <div className="daylight-indicator-badge">
                  <span>Daylight Cycle: {daylightProgress}%</span>
                </div>
              </div>

              <div className="celestial-data-grid">
                {/* Sunrise */}
                <div className="celestial-item sunrise-box">
                  <div className="celestial-icon-wrap">
                    <Sunrise size={28} className="sunrise-icon" />
                  </div>
                  <div className="celestial-text">
                    <span className="celestial-label">Sunrise</span>
                    <span className="celestial-time">
                      {formatTime(weather.sys?.sunrise, weather.timezone)}
                    </span>
                    <span className="celestial-sub">Dawn Horizon</span>
                  </div>
                </div>

                {/* Sun Arc Path Visualizer */}
                <div className="solar-arc-visualizer">
                  <div className="arc-path">
                    <div
                      className="sun-marker"
                      style={{
                        left: `${daylightProgress}%`,
                        transform: `translate(-50%, ${Math.sin((daylightProgress / 100) * Math.PI) * -24}px)`
                      }}
                    >
                      <Sun size={18} />
                    </div>
                  </div>
                  <div className="arc-endpoints">
                    <span>Dawn</span>
                    <span className="arc-mid">Solar Noon</span>
                    <span>Dusk</span>
                  </div>
                </div>

                {/* Sunset */}
                <div className="celestial-item sunset-box">
                  <div className="celestial-icon-wrap">
                    <Sunset size={28} className="sunset-icon" />
                  </div>
                  <div className="celestial-text">
                    <span className="celestial-label">Sunset</span>
                    <span className="celestial-time">
                      {formatTime(weather.sys?.sunset, weather.timezone)}
                    </span>
                    <span className="celestial-sub">Dusk Horizon</span>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}



        {/* Footer Specification Compliance Info */}
        <footer className="dashboard-footer">
          <div className="footer-left">
            <span>Assignment 4: Weather Dashboard with API & Geolocation</span>
            <span className="dot-sep">•</span>
            <span>React Hooks (<code>useState</code>, <code>useEffect</code>)</span>
          </div>
          <div className="footer-right">
            <span>Dynamic Weather Color Grading & Map Grid Engine</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

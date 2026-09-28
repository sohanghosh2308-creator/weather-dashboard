# Meteorological Weather Dashboard using API & Geolocation
**Assignment 4 Submission & Implementation**

A professional meteorological weather application developed with **React 19 & Vite**, integrating the **OpenWeatherMap API**, asynchronous data fetching via React lifecycle hooks (`useEffect`, `useState`), dynamic weather-based color grading, cartographic map-patterned background UI, and automatic physical position resolution via the browser's HTML5 **Geolocation API**.

---

## 📋 Features & Specifications Compliance Matrix

| Requirement Item | Status | Technical Details |
| :--- | :---: | :--- |
| **OpenWeatherMap Integration** |  Configured | Asynchronous `fetch` with `async/await`, metric units (`units=metric`), query params for city & coordinates. |
| **Live Geolocation Support** |  Implemented | `navigator.geolocation.getCurrentPosition` mapping physical GPS coordinates directly to current weather metrics with real reverse-geocoded place names (e.g. City, Neighborhood, Region). |
| **Living Weather Background** |  Implemented | Dynamic full-screen sky engine with condition-based celestial sun/moon, flashing lightning strikes, falling rain sheets, drifting snowflakes, and cloud silhouettes. |
| **Real-Time Global Feed** |  Active | Built-in free real-time global meteorological satellite telemetry (Open-Meteo & Nominatim) working out-of-the-box with zero API key configuration required, alongside custom OpenWeatherMap API key support. |
| **Core Meteorological Metrics** |  Fully Displayed | Temperature (°C, Feels like, Min/Max), Humidity (%), Wind Speed (m/s & km/h), Weather Condition Icon, Atmospheric Pressure, Visibility, and Cloud Cover. |
| **Celestial Data** |  Active | `sys.sunrise` & `sys.sunset` converted to local 12-hour formatted timestamps (AM/PM) with solar arc progress indicator. |
| **Map Background & Grading** |  Implemented | Custom cartographic SVG grid pattern overlay with dynamic condition-based palette grading. |
| **Loading & Error Handling** |  Active | Animated CSS radar-pulse spinner and defensive error alerts for 404 (Not Found), 401 (Unauthorized), and Geolocation permission blocks. |

---

## 🎨 Visual Design & Dynamic Weather Color Grading

The dashboard dynamically adjusts its entire styling palette, border glows, radar rings, and ambient background lighting based on current meteorological conditions:

1. **Clear Skies (`theme-clear`)**: Warm Amber / Sunset Gold (`#f59e0b`, `#d97706`).
2. **Rain & Drizzle (`theme-rain`)**: Deep Slate Blue / Cool Oceanic Navy (`#0ea5e9`, `#0284c7`).
3. **Clouds & Overcast (`theme-clouds`)**: Neutral Grey-Blue / Steel Slate (`#94a3b8`, `#64748b`).
4. **Snow & Flurries (`theme-snow`)**: Icy Blue / Frost Cyan (`#7dd3fc`, `#38bdf8`).
5. **Thunderstorm (`theme-thunderstorm`)**: Electric Violet / Deep Indigo (`#c084fc`, `#7e22ce`).
6. **Mist, Fog & Haze (`theme-atmosphere`)**: Atmospheric Muted Sage-Teal Slate (`#2dd4bf`).

---

## 🌐 OpenWeatherMap API Integration Schema

| API Endpoint | Parameter / Query | Mapped Dashboard Property |
| :--- | :--- | :--- |
| **Current Weather (City)** | `/data/2.5/weather?q={city}&units=metric&appid={KEY}` | Temperature, Humidity, Wind Speed, Weather Icon, City Name |
| **Current Weather (Geolocation)** | `/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={KEY}` | Local coordinates translated to real-time city metrics |
| **Celestial Data** | `sys.sunrise` & `sys.sunset` | Converted local sunrise and sunset timestamps with solar arc indicator |
| **Error Responses** | HTTP 404 / 401 status handling | Friendly user alert banner (`"City not found"` or `"Permission denied"`) |

---

## 💻 Opening in Visual Studio Code

This project is saved directly on your Desktop at:
```text
C:\Users\Argya\Desktop\Weather
```

### Method 1: Using Terminal / Command Prompt
Open a terminal and run:
```bash
code C:\Users\Argya\Desktop\Weather
```

### Method 2: From VS Code Menu
1. Launch **Visual Studio Code**.
2. Go to **File** -> **Open Folder...** (or press `Ctrl + K, Ctrl + O`).
3. Select the folder `Weather` on your Desktop.

---

## 🚀 Running the Project

### 1. Install Dependencies
Open the integrated terminal in VS Code (`Ctrl + ~`) and run:
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
The application will launch automatically at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```

---

## 🔑 OpenWeatherMap API Key Setup

1. **Option A (In-App UI)**: Click the **"Set API Key"** button in the top right corner of the dashboard to enter your free OpenWeatherMap API Key. It is stored securely in your browser's `localStorage`.
2. **Option B (Environment Variable)**: Copy `.env.example` to `.env` and set:
   ```env
   VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
   ```
3. **Option C (Built-in Demo Mode)**: If you do not have an active API key yet or your key is still activating (new keys take 10–30 mins), toggle **"Demo Mode"** in the top bar to test live interactive weather shifts across Tokyo, London, New York, Reykjavik, Singapore, Paris, and GPS simulation!

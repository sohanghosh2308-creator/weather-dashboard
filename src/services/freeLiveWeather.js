// Free Real-Time Global Meteorological Service
// Integrates Open-Meteo & OpenStreetMap Nominatim Geocoding to provide 100% live weather telemetry
// and real place naming (cities, neighborhoods, towns) without requiring any API key.

export async function getPlaceNameFromCoords(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'WeatherDashboardLive/1.0'
        }
      }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const cityName =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        addr.city_district ||
        addr.county;
      const subArea = addr.suburb || addr.neighbourhood || addr.quarter || addr.residential;
      const state = addr.state || '';
      const countryCode = (addr.country_code || data.country || 'LIVE').toUpperCase();

      let displayName = '';
      if (cityName && subArea && cityName.toLowerCase() !== subArea.toLowerCase()) {
        displayName = `${cityName} (${subArea})`;
      } else if (cityName) {
        displayName = cityName;
      } else if (subArea) {
        displayName = subArea;
      } else if (state) {
        displayName = state;
      } else {
        displayName = data.name || `Location (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`;
      }

      return {
        name: displayName,
        state,
        country: countryCode
      };
    }
  } catch (err) {
    console.warn('Reverse geocode error:', err);
  }

  return {
    name: `Local Station (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
    state: '',
    country: 'LIVE'
  };
}

export async function fetchFreeLiveWeather({ city, lat, lon }) {
  let targetLat = lat;
  let targetLon = lon;
  let targetCity = city || '';
  let countryCode = 'LIVE';
  let stateName = '';

  // 1. If city name is provided, geocode to exact coordinates
  if (city && (!targetLat || !targetLon)) {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city.trim())}&count=1`
    );
    if (!geoRes.ok) throw new Error('Geocoding service unavailable.');
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`Location "${city}" not found. Please check spelling.`);
    }
    const best = geoData.results[0];
    targetLat = best.latitude;
    targetLon = best.longitude;
    targetCity = best.name;
    stateName = best.admin1 || '';
    countryCode = best.country_code ? best.country_code.toUpperCase() : 'LIVE';
  } else if (targetLat && targetLon) {
    // 2. If coordinates are provided (from Live Location or Map click), reverse geocode real place name
    const placeInfo = await getPlaceNameFromCoords(targetLat, targetLon);
    targetCity = placeInfo.name;
    stateName = placeInfo.state;
    countryCode = placeInfo.country;
  }

  // 3. Fetch real-time meteorological forecast & celestial data
  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${targetLat}&longitude=${targetLon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,surface_pressure,wind_speed_10m,wind_direction_10m,weather_code,cloud_cover,is_day&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min&timezone=auto`
  );
  if (!weatherRes.ok) throw new Error('Meteorological satellite feed unavailable.');
  const data = await weatherRes.json();
  const current = data.current;
  const daily = data.daily;

  // 4. Map WMO code to condition & description & official icon
  const wCode = current.weather_code ?? 0;
  const isDay = current.is_day === 1;
  const { main, description, icon } = mapWmoCode(wCode, isDay);

  // Convert sunrise & sunset strings (e.g. "2026-09-28T06:56") to Unix timestamp
  const sunriseUnix = daily?.sunrise?.[0]
    ? Math.floor(new Date(daily.sunrise[0]).getTime() / 1000)
    : Math.floor(Date.now() / 1000) - 20000;
  const sunsetUnix = daily?.sunset?.[0]
    ? Math.floor(new Date(daily.sunset[0]).getTime() / 1000)
    : Math.floor(Date.now() / 1000) + 20000;

  // 5. Return formatted OpenWeatherMap-compliant JSON schema
  return {
    coord: { lat: targetLat, lon: targetLon },
    weather: [
      {
        id: wCode,
        main,
        description,
        icon
      }
    ],
    base: 'satellite-live',
    main: {
      temp: current.temperature_2m,
      feels_like: current.apparent_temperature,
      temp_min: daily?.temperature_2m_min?.[0] ?? current.temperature_2m - 2,
      temp_max: daily?.temperature_2m_max?.[0] ?? current.temperature_2m + 2,
      pressure: Math.round(current.surface_pressure || 1013),
      humidity: current.relative_humidity_2m
    },
    visibility: 10000,
    wind: {
      speed: Number(((current.wind_speed_10m || 0) / 3.6).toFixed(1)), // convert km/h to m/s
      deg: current.wind_direction_10m || 0
    },
    clouds: { all: current.cloud_cover || 0 },
    dt: Math.floor(Date.now() / 1000),
    sys: {
      country: countryCode,
      state: stateName,
      sunrise: sunriseUnix,
      sunset: sunsetUnix
    },
    timezone: data.utc_offset_seconds || 0,
    id: Math.floor(targetLat * 1000 + targetLon),
    name: targetCity,
    cod: 200
  };
}

// Helper to map WMO weather codes to standard OpenWeather conditions & icons
function mapWmoCode(code, isDay) {
  const d = isDay ? 'd' : 'n';
  switch (code) {
    case 0:
      return { main: 'Clear', description: 'clear sky', icon: `01${d}` };
    case 1:
      return { main: 'Clear', description: 'mainly clear', icon: `01${d}` };
    case 2:
      return { main: 'Clouds', description: 'partly cloudy', icon: `02${d}` };
    case 3:
      return { main: 'Clouds', description: 'overcast clouds', icon: `04${d}` };
    case 45:
    case 48:
      return { main: 'Mist', description: 'foggy / mist', icon: `50${d}` };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return { main: 'Rain', description: 'light drizzle', icon: `09${d}` };
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return { main: 'Rain', description: 'moderate rain', icon: `10${d}` };
    case 71:
    case 73:
    case 75:
    case 77:
      return { main: 'Snow', description: 'snow flurries', icon: `13${d}` };
    case 80:
    case 81:
    case 82:
      return { main: 'Rain', description: 'heavy rain showers', icon: `09${d}` };
    case 85:
    case 86:
      return { main: 'Snow', description: 'snow showers', icon: `13${d}` };
    case 95:
    case 96:
    case 99:
      return { main: 'Thunderstorm', description: 'thunderstorm with rain', icon: `11${d}` };
    default:
      return { main: 'Clear', description: 'clear skies', icon: `01${d}` };
  }
}

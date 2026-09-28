// Realistic OpenWeatherMap API responses for demo & testing
export const MOCK_WEATHER_DATA = {
  London: {
    coord: { lon: -0.1257, lat: 51.5085 },
    weather: [
      { id: 804, main: "Clouds", description: "overcast clouds", icon: "04d" }
    ],
    base: "stations",
    main: {
      temp: 14.8,
      feels_like: 14.2,
      temp_min: 13.1,
      temp_max: 16.2,
      pressure: 1016,
      humidity: 78
    },
    visibility: 10000,
    wind: { speed: 4.6, deg: 230 },
    clouds: { all: 92 },
    dt: Math.floor(Date.now() / 1000),
    sys: {
      country: "GB",
      sunrise: Math.floor(Date.now() / 1000) - 21600,
      sunset: Math.floor(Date.now() / 1000) + 18000
    },
    timezone: 3600,
    id: 2643743,
    name: "London",
    cod: 200
  },
  Tokyo: {
    coord: { lon: 139.6917, lat: 35.6895 },
    weather: [
      { id: 800, main: "Clear", description: "clear sky", icon: "01d" }
    ],
    base: "stations",
    main: {
      temp: 23.4,
      feels_like: 23.1,
      temp_min: 21.0,
      temp_max: 25.0,
      pressure: 1020,
      humidity: 52
    },
    visibility: 10000,
    wind: { speed: 3.1, deg: 160 },
    clouds: { all: 5 },
    dt: Math.floor(Date.now() / 1000),
    sys: {
      country: "JP",
      sunrise: Math.floor(Date.now() / 1000) - 25000,
      sunset: Math.floor(Date.now() / 1000) + 14000
    },
    timezone: 32400,
    id: 1850147,
    name: "Tokyo",
    cod: 200
  },
  "New York": {
    coord: { lon: -74.006, lat: 40.7128 },
    weather: [
      { id: 501, main: "Rain", description: "moderate rain", icon: "10d" }
    ],
    base: "stations",
    main: {
      temp: 11.6,
      feels_like: 10.4,
      temp_min: 9.8,
      temp_max: 13.0,
      pressure: 1008,
      humidity: 89
    },
    visibility: 7000,
    wind: { speed: 6.7, deg: 70 },
    clouds: { all: 100 },
    dt: Math.floor(Date.now() / 1000),
    sys: {
      country: "US",
      sunrise: Math.floor(Date.now() / 1000) - 18000,
      sunset: Math.floor(Date.now() / 1000) + 21000
    },
    timezone: -14400,
    id: 5128581,
    name: "New York",
    cod: 200
  },
  Reykjavik: {
    coord: { lon: -21.8954, lat: 64.1355 },
    weather: [
      { id: 601, main: "Snow", description: "snow flurry", icon: "13d" }
    ],
    base: "stations",
    main: {
      temp: -2.4,
      feels_like: -7.1,
      temp_min: -4.0,
      temp_max: -1.0,
      pressure: 998,
      humidity: 85
    },
    visibility: 4000,
    wind: { speed: 8.2, deg: 340 },
    clouds: { all: 88 },
    dt: Math.floor(Date.now() / 1000),
    sys: {
      country: "IS",
      sunrise: Math.floor(Date.now() / 1000) - 15000,
      sunset: Math.floor(Date.now() / 1000) + 12000
    },
    timezone: 0,
    id: 3413829,
    name: "Reykjavik",
    cod: 200
  },
  Singapore: {
    coord: { lon: 103.8501, lat: 1.2897 },
    weather: [
      { id: 211, main: "Thunderstorm", description: "thunderstorm with heavy rain", icon: "11d" }
    ],
    base: "stations",
    main: {
      temp: 29.5,
      feels_like: 35.2,
      temp_min: 28.0,
      temp_max: 31.0,
      pressure: 1009,
      humidity: 88
    },
    visibility: 8000,
    wind: { speed: 5.1, deg: 190 },
    clouds: { all: 75 },
    dt: Math.floor(Date.now() / 1000),
    sys: {
      country: "SG",
      sunrise: Math.floor(Date.now() / 1000) - 20000,
      sunset: Math.floor(Date.now() / 1000) + 19000
    },
    timezone: 28800,
    id: 1880252,
    name: "Singapore",
    cod: 200
  },
  "San Francisco": {
    coord: { lon: -122.4194, lat: 37.7749 },
    weather: [
      { id: 701, main: "Mist", description: "dense coastal mist", icon: "50d" }
    ],
    base: "stations",
    main: {
      temp: 14.1,
      feels_like: 13.8,
      temp_min: 12.0,
      temp_max: 16.0,
      pressure: 1018,
      humidity: 86
    },
    visibility: 5000,
    wind: { speed: 3.8, deg: 270 },
    clouds: { all: 60 },
    dt: Math.floor(Date.now() / 1000),
    sys: {
      country: "US",
      sunrise: Math.floor(Date.now() / 1000) - 22000,
      sunset: Math.floor(Date.now() / 1000) + 17000
    },
    timezone: -25200,
    id: 5391959,
    name: "San Francisco",
    cod: 200
  },
  Mumbai: {
    coord: { lon: 72.8777, lat: 19.076 },
    weather: [
      { id: 721, main: "Haze", description: "hazy sunshine", icon: "50d" }
    ],
    base: "stations",
    main: {
      temp: 31.8,
      feels_like: 37.6,
      temp_min: 30.0,
      temp_max: 33.0,
      pressure: 1012,
      humidity: 68
    },
    visibility: 6000,
    wind: { speed: 4.2, deg: 280 },
    clouds: { all: 40 },
    dt: Math.floor(Date.now() / 1000),
    sys: {
      country: "IN",
      sunrise: Math.floor(Date.now() / 1000) - 23000,
      sunset: Math.floor(Date.now() / 1000) + 16000
    },
    timezone: 19800,
    id: 1275339,
    name: "Mumbai",
    cod: 200
  },
  Paris: {
    coord: { lon: 2.3522, lat: 48.8566 },
    weather: [
      { id: 802, main: "Clouds", description: "scattered clouds", icon: "03d" }
    ],
    base: "stations",
    main: {
      temp: 18.2,
      feels_like: 17.9,
      temp_min: 16.0,
      temp_max: 20.0,
      pressure: 1015,
      humidity: 64
    },
    visibility: 10000,
    wind: { speed: 3.6, deg: 210 },
    clouds: { all: 45 },
    dt: Math.floor(Date.now() / 1000),
    sys: {
      country: "FR",
      sunrise: Math.floor(Date.now() / 1000) - 21000,
      sunset: Math.floor(Date.now() / 1000) + 18500
    },
    timezone: 7200,
    id: 2988507,
    name: "Paris",
    cod: 200
  }
};

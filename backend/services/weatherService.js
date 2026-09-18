const axios = require("axios");

const weatherCodeMap = {
    0: "Clear sky",
    1: "Mostly clear",
    2: "Partly cloudy",
    3: "Cloudy",
    45: "Foggy",
    48: "Foggy",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Heavy drizzle",
    56: "Freezing drizzle",
    57: "Heavy freezing drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    66: "Freezing rain",
    67: "Heavy freezing rain",
    71: "Light snow",
    73: "Snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Showers",
    81: "Heavy showers",
    82: "Very heavy showers",
    85: "Light snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Severe thunderstorm"
};

const getWeatherForLocation = async ({ latitude, longitude, name, country }) => {
    if (!latitude || !longitude) {
        return null;
    }

    try {
        const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
            params: {
                latitude,
                longitude,
                current: "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code",
                timezone: "auto",
                forecast_days: 1
            },
            timeout: 15000
        });

        const current = response.data?.current;

        if (!current) {
            return null;
        }

        const temperature = Number(current.temperature_2m ?? 0);
        const feelsLike = Number(current.apparent_temperature ?? temperature);
        const humidity = Number(current.relative_humidity_2m ?? 0);
        const windSpeed = Number(current.wind_speed_10m ?? 0);
        const code = Number(current.weather_code ?? 0);

        return {
            temperature: Number.isFinite(temperature) ? Math.round(temperature) : null,
            feelsLike: Number.isFinite(feelsLike) ? Math.round(feelsLike) : null,
            humidity: Number.isFinite(humidity) ? Math.round(humidity) : null,
            windSpeed: Number.isFinite(windSpeed) ? Math.round(windSpeed) : null,
            condition: weatherCodeMap[code] || "Weather update",
            summary: `${weatherCodeMap[code] || "Weather update"} in ${name || country || "this destination"}`,
            source: "open-meteo"
        };
    } catch (error) {
        return null;
    }
};

module.exports = {
    getWeatherForLocation
};

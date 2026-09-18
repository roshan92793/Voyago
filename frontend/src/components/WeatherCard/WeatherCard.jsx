const WeatherCard = ({ weather, destinationName = 'this destination' }) => {
  const getWeatherIconLabel = (temperature, condition) => {
    if (temperature != null && temperature >= 28) return 'HOT';
    if (temperature != null && temperature <= 15) return 'COOL';
    if ((condition || '').toLowerCase().includes('rain')) return 'RAIN';
    if ((condition || '').toLowerCase().includes('cloud')) return 'CLOUD';
    return 'NOW';
  };

  if (!weather || typeof weather !== 'object') {
    return (
      <div className="weather-card weather-card--fallback">
        <div className="weather-card__icon"><span>NOW</span></div>
        <div className="weather-card__content">
          <p className="weather-card__label">Current weather</p>
          <h3>Weather currently unavailable</h3>
          <p className="weather-card__condition">Please try again shortly.</p>
        </div>
      </div>
    );
  }

  const temperature = weather.temperature != null ? `${weather.temperature}°C` : '—';
  const feelsLike = weather.feelsLike != null ? `${weather.feelsLike}°C` : '—';
  const humidity = weather.humidity != null ? `${weather.humidity}%` : '—';
  const wind = weather.windSpeed != null ? `${weather.windSpeed} km/h` : '—';
  const iconLabel = getWeatherIconLabel(weather.temperature, weather.condition);

  return (
    <div className="weather-card">
      <div className="weather-card__icon"><span>{iconLabel}</span></div>
      <div className="weather-card__content">
        <p className="weather-card__label">Current weather in {destinationName}</p>
        <h3>{temperature}</h3>
        <p className="weather-card__condition">{weather.condition || 'Weather update'}</p>
        <div className="weather-card__grid">
          <span>Feels like {feelsLike}</span>
          <span>Humidity {humidity}</span>
          <span>Wind {wind}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;

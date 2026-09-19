const WeatherCard = ({ weather, destinationName = 'this destination' }) => {
  const getWeatherIcon = (temperature, condition) => {
    const normalizedCondition = (condition || '').toLowerCase();

    if (normalizedCondition.includes('rain')) return '🌧️';
    if (normalizedCondition.includes('cloud')) return '☁️';
    if (temperature != null && temperature >= 28) return '☀️';
    return '🌤️';
  };

  if (!weather || typeof weather !== 'object') {
    return (
      <div className="weather-card weather-card--fallback">
        <div className="weather-card__icon"><span>🌤️</span></div>
        <div className="weather-card__content">
          <p className="weather-card__label">Current weather</p>
          <div className="weather-card__summary">
            <h3>Unavailable</h3>
          </div>
          <p className="weather-card__feels-like">Please try again shortly.</p>
        </div>
      </div>
    );
  }

  const temperature = weather.temperature != null ? `${weather.temperature}°C` : '—';
  const feelsLike = weather.feelsLike != null ? `${weather.feelsLike}°C` : '—';
  const humidity = weather.humidity != null ? `${weather.humidity}%` : '—';
  const wind = weather.windSpeed != null ? `${weather.windSpeed} km/h` : '—';
  const icon = getWeatherIcon(weather.temperature, weather.condition);

  return (
    <div className="weather-card">
      <p className="weather-card__label">Current weather</p>
      <div className="weather-card__main">
        <div className="weather-card__icon"><span>{icon}</span></div>
        <div className="weather-card__content">
          <div className="weather-card__summary">
            <h3>{temperature}</h3>
            <span className="weather-card__condition">{weather.condition || 'Weather update'}</span>
          </div>
          <p className="weather-card__feels-like">Feels like {feelsLike}</p>
        </div>
      </div>
      <div className="weather-card__grid">
        <span>💧 {humidity}</span>
        <span>💨 {wind}</span>
      </div>
    </div>
  );
};

export default WeatherCard;

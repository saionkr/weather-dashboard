export default function WeatherCard({ fetchedWeatherInformation }) {
    if (!fetchedWeatherInformation) {
      return null; // No weather yet, show nothing
    }
  
    return (
      <div className="max-w-md mx-auto bg-white/80 backdrop-blur-md shadow-lg rounded-xl p-8 text-center mt-8">
        <h2 className="text-2xl font-bold mb-4">{fetchedWeatherInformation.cityName}</h2>
        <div className="flex flex-col items-center space-y-4">
          <img
            src={`https://openweathermap.org/img/wn/${fetchedWeatherInformation.weatherIconCode}@2x.png`}
            alt={fetchedWeatherInformation.weatherConditionDescription}
            className="w-20 h-20"
          />
          <p className="text-4xl font-semibold">
            {Math.round(fetchedWeatherInformation.temperatureInCelsius)}°C
          </p>
          <p className="text-lg text-gray-700">{fetchedWeatherInformation.weatherConditionDescription}</p>
          <div className="text-sm mt-4 space-y-1">
            <p>💧 Humidity: {fetchedWeatherInformation.humidityPercentage}%</p>
            <p>🌬️ Wind Speed: {fetchedWeatherInformation.windSpeedInKilometersPerHour} km/h</p>
          </div>
        </div>
      </div>
    );
  }
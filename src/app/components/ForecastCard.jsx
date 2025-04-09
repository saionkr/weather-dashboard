export default function ForecastCard({ dayForecastData }) {
    return (
      <div className="bg-white/70 backdrop-blur-md rounded-lg p-4 shadow-md text-center w-32">
        <h4 className="font-semibold mb-2">{dayForecastData.dateText}</h4>
        <img
          src={`https://openweathermap.org/img/wn/${dayForecastData.weatherIconCode}@2x.png`}
          alt={dayForecastData.weatherDescription}
          className="w-12 h-12 mx-auto"
        />
        <p className="text-lg">{Math.round(dayForecastData.temperatureInCelsius)}°C</p>
        <p className="text-sm text-gray-700">{dayForecastData.weatherDescription}</p>
      </div>
    );
  }
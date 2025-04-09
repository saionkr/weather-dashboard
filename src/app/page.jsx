'use client';

import Head from 'next/head';
import { useState } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import LoadingSpinner from './components/LoadingSpinner';
import ForecastCard from './components/ForecastCard';

export default function HomePage() {
  const [currentCityWeatherData, setCurrentCityWeatherData] = useState(null);
  const [isWeatherDataLoading, setIsWeatherDataLoading] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [weatherDataFetchErrorMessage, setWeatherDataFetchErrorMessage] = useState('');
  const [recentSearchedCityNamesList, setRecentSearchedCityNamesList] = useState([]);
  const [fiveDayWeatherForecastDataList, setFiveDayWeatherForecastDataList] = useState([]);

  const handleCityWeatherSearch = async (cityNameEnteredByUser) => {
    const apiKeyFromEnvironmentVariable = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  
    try {
      setIsWeatherDataLoading(true);
      setWeatherDataFetchErrorMessage('');
  
      // Fetch current weather
      const weatherApiResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityNameEnteredByUser}&appid=${apiKeyFromEnvironmentVariable}&units=metric`
      );
  
      if (!weatherApiResponse.ok) {
        throw new Error('Could not retrieve weather information for the specified city.');
      }
  
      const weatherApiJsonResponse = await weatherApiResponse.json();
  
      setCurrentCityWeatherData({
        cityName: weatherApiJsonResponse.name,
        temperatureInCelsius: weatherApiJsonResponse.main.temp,
        weatherConditionDescription: weatherApiJsonResponse.weather[0].main,
        humidityPercentage: weatherApiJsonResponse.main.humidity,
        windSpeedInKilometersPerHour: weatherApiJsonResponse.wind.speed,
        weatherIconCode: weatherApiJsonResponse.weather[0].icon,
      });
  
      // 🆕 Fetch 5-day forecast
      const forecastApiResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityNameEnteredByUser}&appid=${apiKeyFromEnvironmentVariable}&units=metric`
      );
  
      if (!forecastApiResponse.ok) {
        throw new Error('Could not retrieve forecast information for the specified city.');
      }
  
      const forecastApiJsonResponse = await forecastApiResponse.json();
  
      // Pick forecasts around 12:00 noon each day
      const dailyForecasts = forecastApiJsonResponse.list.filter((item) =>
        item.dt_txt.includes('12:00:00')
      );
  
      const formattedForecasts = dailyForecasts.slice(0, 5).map((item) => ({
        dateText: new Date(item.dt_txt).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        temperatureInCelsius: item.main.temp,
        weatherDescription: item.weather[0].main,
        weatherIconCode: item.weather[0].icon,
      }));
  
      setFiveDayWeatherForecastDataList(formattedForecasts);
  
      // Update recent search history
      setRecentSearchedCityNamesList((previousCityNames) => {
        const updatedCityNamesList = [cityNameEnteredByUser, ...previousCityNames];
        const uniqueCityNamesList = [...new Set(updatedCityNamesList)];
        return uniqueCityNamesList.slice(0, 5);
      });
  
    } catch (error) {
      setWeatherDataFetchErrorMessage(error.message);
      setCurrentCityWeatherData(null);
      setFiveDayWeatherForecastDataList([]);
    } finally {
      setIsWeatherDataLoading(false);
    }
  };

  return (
    <>
    <Head>
      <title>Weather App</title>
      <meta name="description" content="Live Weather Dashboard with 5-Day Forecast" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main
          className={`min-h-screen flex flex-col items-center justify-start p-6 transition-all ${
            darkModeEnabled
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white'
              : 'bg-gradient-to-br from-blue-300 to-blue-500 text-black'
          }`}
    > 
      <h1 className="text-4xl font-bold text-white my-8">🌤️ Live Weather Dashboard</h1>
      <button
                onClick={() => setDarkModeEnabled(!darkModeEnabled)}
                className="mb-6 px-4 py-2 bg-white text-blue-500 rounded-lg font-semibold shadow hover:bg-blue-100 transition-all"
                >
                {darkModeEnabled ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>

      <SearchBar onCitySearchTriggered={handleCityWeatherSearch} />

      {/* 🆕 Add Recent Search History */}
      {recentSearchedCityNamesList.length > 0 && (
        <div className="bg-white/70 rounded-lg shadow-md p-4 mt-4 max-w-md w-full">
          <h3 className="text-xl font-semibold mb-2 text-center text-gray-800">Recent Searches</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {recentSearchedCityNamesList.map((cityName, index) => (
              <button
                key={index}
                onClick={() => handleCityWeatherSearch(cityName)}
                className="bg-blue-400 hover:bg-blue-500 text-white py-1 px-3 rounded-full text-sm transition-all"
              >
                {cityName}
              </button>
            ))}
          </div>
        </div>
      )}

      {isWeatherDataLoading && <LoadingSpinner />}

      {weatherDataFetchErrorMessage && (
        <p className="text-red-500 font-semibold mt-8">{weatherDataFetchErrorMessage}</p>
      )}

      <WeatherCard fetchedWeatherInformation={currentCityWeatherData} />
                {fiveDayWeatherForecastDataList.length > 0 && (
            <div className="mt-10 max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold text-center mb-6">5-Day Forecast</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {fiveDayWeatherForecastDataList.map((forecastItem, index) => (
                  <ForecastCard key={index} dayForecastData={forecastItem} />
                ))}
              </div>
            </div>
        )}
    </main>
    </>
  );
}

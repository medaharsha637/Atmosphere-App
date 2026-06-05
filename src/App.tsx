import React, { useState, useEffect, useCallback } from 'react';
import { 
  CloudSun, 
  MapPin, 
  Search, 
  RefreshCw, 
  ShieldAlert, 
  Sparkles,
  Github,
  Sun
} from 'lucide-react';
import SearchHeader from './components/SearchHeader';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import ForecastHourly from './components/ForecastHourly';
import ForecastDaily from './components/ForecastDaily';
import WeatherAIAssistant from './components/WeatherAIAssistant';
import { WeatherData, WeatherUnit, AIVerdict } from './types';
import { getWeatherCondition } from './utils/weatherHelpers';

// Safe initial coordinates (New York City)
const DEFAULT_CITY = {
  name: 'New York',
  country: 'United States',
  lat: 40.7128,
  lon: -74.0060
};

// Preset cities for single-click search discovery
const HOT_PRESETS = [
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lon: 31.2357 }
];

export default function App() {
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY.name);
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_CITY.country);
  const [latitude, setLatitude] = useState(DEFAULT_CITY.lat);
  const [longitude, setLongitude] = useState(DEFAULT_CITY.lon);

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<WeatherUnit>('C');
  const [advice, setAdvice] = useState<AIVerdict | null>(null);

  // Loaders and errors
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [adviceError, setAdviceError] = useState<string | null>(null);

  // Fetch Weather Forecast
  const fetchWeather = useCallback(async (lat: number, lon: number, cityName: string, countryName: string) => {
    setIsWeatherLoading(true);
    setWeatherError(null);
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
      );
      
      if (!response.ok) {
        throw new Error('Failed to gather meteorological readings.');
      }

      const data = await response.json();
      
      const structuredData: WeatherData = {
        city: cityName,
        country: countryName,
        latitude: lat,
        longitude: lon,
        current: {
          temperature: data.current.temperature_2m,
          apparentTemperature: data.current.apparent_temperature,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          precipitation: data.current.precipitation,
          isDay: data.current.is_day === 1,
          weatherCode: data.current.weather_code,
          time: data.current.time
        },
        hourly: {
          time: data.hourly.time,
          temperature: data.hourly.temperature_2m,
          weatherCode: data.hourly.weather_code
        },
        daily: {
          time: data.daily.time,
          weatherCode: data.daily.weather_code,
          tempMax: data.daily.temperature_2m_max,
          tempMin: data.daily.temperature_2m_min,
          sunrise: data.daily.sunrise,
          sunset: data.daily.sunset
        }
      };

      setWeatherData(structuredData);
      
      // Auto trigger AI recommendation advice
      fetchAIAdvice(structuredData);
    } catch (err: any) {
      console.error(err);
      setWeatherError(err.message || 'An unexpected error occurred while fetching weather.');
    } finally {
      setIsWeatherLoading(false);
    }
  }, [unit]);

  // Fetch AI Climate Planner Advice
  const fetchAIAdvice = async (currentWeather: WeatherData) => {
    setIsAdviceLoading(true);
    setAdviceError(null);
    try {
      const condResult = getWeatherCondition(
        currentWeather.current.weatherCode, 
        currentWeather.current.isDay
      );

      const response = await fetch('/api/weather/ai-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: currentWeather.city,
          temperature: currentWeather.current.temperature,
          tempUnit: 'C', // Send C, display handles F convert
          condition: condResult.label,
          windSpeed: currentWeather.current.windSpeed,
          humidity: currentWeather.current.humidity
        })
      });

      if (!response.ok) {
        throw new Error('Could not access Gemini AI recommendations.');
      }

      const advisoryData = await response.json();
      setAdvice(advisoryData);
    } catch (err: any) {
      console.error(err);
      setAdviceError(err.message || 'Could not load personalized AI insights.');
    } finally {
      setIsAdviceLoading(false);
    }
  };

  // Trigger default fetch on mount
  useEffect(() => {
    fetchWeather(latitude, longitude, selectedCity, selectedCountry);
  }, []);

  const handleSelectCity = (lat: number, lon: number, cityName: string, countryName: string) => {
    setSelectedCity(cityName);
    setSelectedCountry(countryName);
    setLatitude(lat);
    setLongitude(lon);
    fetchWeather(lat, lon, cityName, countryName);
  };

  const handleToggleUnit = () => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  const handleRefresh = () => {
    fetchWeather(latitude, longitude, selectedCity, selectedCountry);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased">
      
      {/* Dynamic Aesthetic Blur Backdrops */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-indigo-300/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Visual Frame */}
      <header className="border-b border-slate-100 bg-white/70 backdrop-blur-md sticky top-0 z-40" id="global-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl text-white shadow-md shadow-blue-500/10">
              <CloudSun className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent">
              Atmosphere AI
            </span>
          </div>

          <p className="text-xs text-slate-400 font-medium font-mono hidden sm:block">
            Universal Weather Systems
          </p>
        </div>
      </header>

      {/* Weather Dash Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        
        {/* Search Header Container */}
        <section className="flex flex-col gap-3.5">
          <SearchHeader 
            onSelectCity={handleSelectCity} 
            isLoading={isWeatherLoading} 
          />

          {/* Quick Preset discovery Badges */}
          <div className="flex items-center justify-center flex-wrap gap-2.5 mt-1" id="presets-container">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 select-none">
              Quick explore:
            </span>
            {HOT_PRESETS.map((p) => {
              const active = selectedCity.toLowerCase() === p.name.toLowerCase();
              return (
                <button
                  key={p.name}
                  onClick={() => handleSelectResult(p)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all shadow-xs ${
                    active 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/15 border-transparent' 
                      : 'bg-white hover:bg-slate-50 border border-slate-100 text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {p.name}
                </button>
              );
              
              function handleSelectResult(preset: typeof p) {
                handleSelectCity(preset.lat, preset.lon, preset.name, preset.country);
              }
            })}
          </div>
        </section>

        {/* Outer State Loading / Error Gateways */}
        {isWeatherLoading && !weatherData && (
          <div className="flex-1 py-16 flex flex-col items-center justify-center gap-3 text-center" id="global-loading">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-sm font-semibold text-slate-600">Gathering meteorological reports...</p>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Querying high-fidelity satellite coordinates and thermal charts.
            </p>
          </div>
        )}

        {weatherError && !weatherData && (
          <div className="flex-1 py-12 flex flex-col items-center justify-center gap-4 text-center max-w-md mx-auto" id="global-error">
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 text-rose-500">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <p className="text-slate-700 font-bold text-base">Weather forecast service unavailable</p>
              <p className="text-xs text-slate-400 leading-normal mt-1">{weatherError}</p>
            </div>
            <button
              onClick={handleRefresh}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-sm font-bold text-white rounded-xl shadow-lg active:scale-95 transition-all"
            >
              Reconnect
            </button>
          </div>
        )}

        {/* Dashboard Grid Container */}
        {weatherData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="dashboard-grid">
            
            {/* Primary content list: 8 cols out of 12 */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Card 1: Main conditions */}
              <CurrentWeatherCard 
                data={weatherData}
                unit={unit}
                onToggleUnit={handleToggleUnit}
                onRefresh={handleRefresh}
                isRefreshing={isWeatherLoading}
              />

              {/* Card 2: 24-Hour timelines */}
              <ForecastHourly 
                hourly={weatherData.hourly}
                unit={unit}
              />

              {/* Card 3: AI Smart recommendations advice */}
              <WeatherAIAssistant 
                advice={advice}
                isLoading={isAdviceLoading}
                error={adviceError}
                onRetry={() => fetchAIAdvice(weatherData)}
              />
            </div>

            {/* Secondary side columns: 4 cols out of 12 */}
            <div className="lg:col-span-4 flex flex-col h-full">
              <ForecastDaily 
                daily={weatherData.daily}
                unit={unit}
              />
            </div>

          </div>
        )}

      </main>

      {/* Humble Footer */}
      <footer className="border-t border-slate-100 bg-white py-6 mt-12 text-center text-xs text-slate-400 font-semibold" id="global-footer">
        <p className="tracking-tight">
          Atmosphere AI Dashboard • Backed by Google Gemini and Open-Meteo Satellites • UTC 2026
        </p>
      </footer>

    </div>
  );
}

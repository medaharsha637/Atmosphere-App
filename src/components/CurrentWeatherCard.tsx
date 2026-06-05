import React from 'react';
import { 
  Wind, 
  Droplets, 
  Thermometer, 
  TrendingDown, 
  TrendingUp, 
  Umbrella,
  RefreshCw,
  Sun,
  Moon
} from 'lucide-react';
import { WeatherData, WeatherUnit } from '../types';
import { getWeatherCondition, formatTemp } from '../utils/weatherHelpers';

interface CurrentWeatherCardProps {
  data: WeatherData;
  unit: WeatherUnit;
  onToggleUnit: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function CurrentWeatherCard({
  data,
  unit,
  onToggleUnit,
  onRefresh,
  isRefreshing
}: CurrentWeatherCardProps) {
  const { current, cityName = data.city, countryName = data.country } = {
    ...data,
    cityName: data.city,
    countryName: data.country
  };

  const condition = getWeatherCondition(current.weatherCode, current.isDay);
  const IconComponent = condition.icon;

  // Simple min/max ranges for today
  const maxTempToday = data.daily.tempMax[0];
  const minTempToday = data.daily.tempMin[0];

  return (
    <div 
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${condition.bgGradient} text-white shadow-xl transition-all duration-700`}
      id="current-weather-card"
    >
      {/* Decorative subtle sun/moon backing glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Section */}
      <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white drop-shadow-sm truncate max-w-xs md:max-w-md">
              {cityName}
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm self-center">
              {countryName}
            </span>
          </div>
          <p className="text-xs md:text-sm text-white/80 font-medium mt-1">
            Current Conditions • Measured {new Date(current.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/35 transition-all text-white backdrop-blur-sm disabled:opacity-50 flex items-center justify-center"
            title="Refresh weather data"
            id="btn-refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* C / F Unit Toggle Buttons */}
          <div className="bg-white/15 p-1 rounded-xl flex items-center gap-1 backdrop-blur-sm">
            <button
              onClick={() => unit !== 'C' && onToggleUnit()}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                unit === 'C' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => unit !== 'F' && onToggleUnit()}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                unit === 'F' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              °F
            </button>
          </div>
        </div>
      </div>

      {/* Middle Hero Meteorological Layout */}
      <div className="px-6 md:px-8 pb-6 md:pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className={`p-4 bg-white/15 rounded-2xl backdrop-blur-sm ${condition.textColor} transition-all duration-300 transform group-hover:scale-105`}>
              <IconComponent className="w-16 h-16 md:w-20 md:h-20 drop-shadow-sm" />
            </div>
            {/* Day/Night Mini Floating Badge */}
            <div className="absolute -bottom-1 -right-1 bg-white hover:scale-110 shadow-md p-1.5 rounded-full transition-transform text-slate-800">
              {current.isDay ? <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> : <Moon className="w-3.5 h-3.5 text-indigo-900 fill-indigo-950" />}
            </div>
          </div>

          <div>
            <div className="text-6xl md:text-7xl font-extrabold tracking-tighter text-white drop-shadow-sm flex items-start">
              {unit === 'C' ? Math.round(current.temperature) : Math.round((current.temperature * 9/5) + 32)}
              <span className="text-2xl md:text-3xl font-medium ml-1 mt-1 opacity-90">°</span>
            </div>
            <div className="text-lg md:text-xl font-bold tracking-tight text-white/95 mt-1 drop-shadow-xs capitalize">
              {condition.label}
            </div>
            <div className="flex items-center gap-3 text-white/80 mt-1 font-medium text-xs">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-red-300" /> Max: {formatTemp(maxTempToday, unit)}
              </span>
              <span className="flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-blue-300" /> Min: {formatTemp(minTempToday, unit)}
              </span>
            </div>
          </div>
        </div>

        {/* Essential Meteorology Stats Panel */}
        <div className="w-full md:w-auto grid grid-cols-2 md:flex md:items-center gap-3 md:gap-4 shrink-0">
          {/* Card: Apparent Temperature */}
          <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm border border-white/5 flex flex-col justify-between hover:bg-white/15 transition-all">
            <div className="flex items-center gap-1.5 text-white/60 text-xs font-semibold mb-1">
              <Thermometer className="w-3.5 h-3.5 text-pink-300" />
              <span>FEELS LIKE</span>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              {formatTemp(current.apparentTemperature, unit)}
            </span>
          </div>

          {/* Card: Humidity */}
          <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm border border-white/5 flex flex-col justify-between hover:bg-white/15 transition-all">
            <div className="flex items-center gap-1.5 text-white/60 text-xs font-semibold mb-1">
              <Droplets className="w-3.5 h-3.5 text-sky-300" />
              <span>HUMIDITY</span>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              {current.humidity}%
            </span>
          </div>

          {/* Card: Wind Speed */}
          <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm border border-white/5 flex flex-col justify-between hover:bg-white/15 transition-all">
            <div className="flex items-center gap-1.5 text-white/60 text-xs font-semibold mb-1">
              <Wind className="w-3.5 h-3.5 text-teal-300" />
              <span>WIND SPEED</span>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              {current.windSpeed} km/h
            </span>
          </div>

          {/* Card: Precipitation */}
          <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm border border-white/5 flex flex-col justify-between hover:bg-white/15 transition-all">
            <div className="flex items-center gap-1.5 text-white/60 text-xs font-semibold mb-1">
              <Umbrella className="w-3.5 h-3.5 text-indigo-300" />
              <span>PRECIPIT.</span>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              {current.precipitation} mm
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

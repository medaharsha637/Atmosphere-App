import React from 'react';
import { Clock } from 'lucide-react';
import { WeatherHourly, WeatherUnit } from '../types';
import { getWeatherCondition, formatTemp, formatTime } from '../utils/weatherHelpers';

interface ForecastHourlyProps {
  hourly: WeatherHourly;
  unit: WeatherUnit;
}

export default function ForecastHourly({ hourly, unit }: ForecastHourlyProps) {
  // Find current index to slice the upcoming 24 hours
  // Let's filter or slice the first 24 items dynamically
  const currentHourString = new Date().toISOString().slice(0, 13) + ':00';
  let startIndex = hourly.time.findIndex((t) => t.startsWith(currentHourString));
  if (startIndex === -1) startIndex = 0;

  // Take the next 24 hours of data
  const next24Hours = {
    time: hourly.time.slice(startIndex, startIndex + 24),
    temperature: hourly.temperature.slice(startIndex, startIndex + 24),
    weatherCode: hourly.weatherCode.slice(startIndex, startIndex + 24)
  };

  const temps = next24Hours.temperature;
  const maxTemp = temps.length > 0 ? Math.max(...temps) : 40;
  const minTemp = temps.length > 0 ? Math.min(...temps) : 0;
  const range = maxTemp - minTemp || 1;

  return (
    <div 
      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
      id="hourly-forecast-container"
    >
      <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
        <Clock className="w-5 h-5 text-blue-500" />
        <h2 className="text-base font-bold text-slate-800 tracking-tight">
          Hourly Forecast
        </h2>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full uppercase ml-auto">
          24h timeline
        </span>
      </div>

      {/* Horizontal Scroll Bar */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {next24Hours.time.map((time, idx) => {
          const tempVal = next24Hours.temperature[idx];
          const code = next24Hours.weatherCode[idx];
          const cond = getWeatherCondition(code, true);
          const Icon = cond.icon;
          const displayTime = idx === 0 ? 'Now' : formatTime(time);

          // Calculate height proportion for a subtle thermal grid view
          const heightPercent = Math.max(10, Math.round(((tempVal - minTemp) / range) * 100));

          return (
            <div
              key={time}
              className="flex flex-col items-center min-w-[70px] bg-slate-50/50 hover:bg-blue-50/40 rounded-2xl py-3 px-2 border border-slate-100 transition-all hover:border-blue-100/50 group"
            >
              <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">
                {displayTime}
              </span>

              {/* Icon Container */}
              <div className={`my-3 p-1.5 rounded-xl bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform ${cond.textColor}`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Heat visual bars */}
              <div className="w-1.5 h-10 bg-slate-100 rounded-full mb-3 flex items-end overflow-hidden">
                <div 
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-gradient-to-t from-blue-400 to-amber-400 rounded-full"
                />
              </div>

              <span className="text-xs font-bold text-slate-800">
                {formatTemp(tempVal, unit).split('°')[0]}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

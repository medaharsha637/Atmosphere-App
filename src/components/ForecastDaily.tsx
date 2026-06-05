import React from 'react';
import { Calendar, Icon } from 'lucide-react';
import { WeatherDaily, WeatherUnit } from '../types';
import { getWeatherCondition, formatTemp, getDayName, formatDate } from '../utils/weatherHelpers';

interface ForecastDailyProps {
  daily: WeatherDaily;
  unit: WeatherUnit;
}

export default function ForecastDaily({ daily, unit }: ForecastDailyProps) {
  // Find extreme max and min of the entire week for the scale bar
  const absoluteMax = Math.max(...daily.tempMax);
  const absoluteMin = Math.min(...daily.tempMin);
  const totalSpan = absoluteMax - absoluteMin || 1;

  return (
    <div 
      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col h-full"
      id="daily-forecast-container"
    >
      <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
        <Calendar className="w-5 h-5 text-indigo-500" />
        <h2 className="text-base font-bold text-slate-800 tracking-tight">
          7-Day Forecast
        </h2>
        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-50/70 px-2 py-0.5 rounded-full ml-auto">
          Extended Outlook
        </span>
      </div>

      <div className="divide-y divide-slate-100/80 flex-1 flex flex-col justify-between">
        {daily.time.map((time, idx) => {
          const minVal = daily.tempMin[idx];
          const maxVal = daily.tempMax[idx];
          const weatherCode = daily.weatherCode[idx];
          const condition = getWeatherCondition(weatherCode, true);
          const IconComponent = condition.icon;
          const isToday = idx === 0;

          // Calculate offset percentages for standard weather temperature bar
          const leftPercent = ((minVal - absoluteMin) / totalSpan) * 100;
          const rightPercent = ((maxVal - absoluteMin) / totalSpan) * 100;
          const barWidth = rightPercent - leftPercent;

          return (
            <div
              key={time}
              className="flex items-center justify-between py-3.5 hover:bg-slate-50/40 rounded-xl px-1.5 transition-colors group"
            >
              {/* Day Label */}
              <div className="w-24 shrink-0">
                <p className="text-sm font-bold text-slate-850 group-hover:text-slate-900">
                  {isToday ? 'Today' : getDayName(time)}
                </p>
                <p className="text-[10px] font-semibold text-slate-400">
                  {formatDate(time).split(',')[1]?.trim() || ''}
                </p>
              </div>

              {/* Weather Status */}
              <div className="flex items-center gap-3 w-32 shrink-0">
                <div className={`p-1.5 rounded-xl bg-slate-50 shadow-xs border border-slate-100 group-hover:scale-110 transition-transform ${condition.textColor}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-600 truncate max-w-[90px]">
                  {condition.label}
                </span>
              </div>

              {/* Min Temperature Label */}
              <span className="text-xs font-bold text-slate-400 w-8 text-right font-mono shrink-0">
                {unit === 'C' ? Math.round(minVal) : Math.round((minVal * 9/5) + 32)}°
              </span>

              {/* Temperature Scale Bar (Apple Weather style) */}
              <div className="hidden sm:block flex-1 mx-3.5 h-2 bg-slate-100 rounded-full relative overflow-hidden shrink-0">
                <div
                  style={{
                    left: `${leftPercent}%`,
                    width: `${Math.max(8, barWidth)}%`
                  }}
                  className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-400"
                />
              </div>

              {/* Max Temperature Label */}
              <span className="text-xs font-bold text-slate-800 w-8 text-right font-mono shrink-0">
                {unit === 'C' ? Math.round(maxVal) : Math.round((maxVal * 9/5) + 32)}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  Snowflake, 
  CloudLightning,
  Icon
} from 'lucide-react';

export interface WeatherConditionInfo {
  label: string;
  icon: any; // Lucide component
  bgGradient: string; // Tailwind bg-gradient configuration
  textColor: string;
}

export function getWeatherCondition(code: number, isDay: boolean = true): WeatherConditionInfo {
  // WMO weather interpretation codes
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Clear Sky' : 'Clear Night',
        icon: Sun,
        bgGradient: isDay 
          ? 'from-sky-400 via-blue-500 to-indigo-600' 
          : 'from-slate-950 via-slate-900 to-indigo-950',
        textColor: 'text-amber-300'
      };
    case 1:
    case 2:
    case 3:
      return {
        label: code === 1 ? 'Mainly Clear' : code === 2 ? 'Partly Cloudy' : 'Overcast',
        icon: CloudSun,
        bgGradient: isDay 
          ? 'from-blue-400 via-slate-400 to-slate-500' 
          : 'from-slate-900 via-slate-800 to-indigo-950',
        textColor: 'text-slate-100'
      };
    case 45:
    case 48:
      return {
        label: 'Foggy',
        icon: CloudFog,
        bgGradient: 'from-zinc-500 via-slate-600 to-zinc-700',
        textColor: 'text-zinc-200'
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        icon: CloudDrizzle,
        bgGradient: 'from-sky-300 via-slate-500 to-zinc-600',
        textColor: 'text-sky-100'
      };
    case 56:
    case 57:
    case 66:
    case 67:
      return {
        label: 'Freezing Rain/Drizzle',
        icon: Snowflake,
        bgGradient: 'from-cyan-750 via-blue-600 to-slate-700',
        textColor: 'text-cyan-150'
      };
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return {
        label: code >= 80 ? 'Passing Showers' : 'Rainy',
        icon: CloudRain,
        bgGradient: 'from-sky-500 via-blue-600 to-slate-700',
        textColor: 'text-sky-200'
      };
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return {
        label: 'Snowing',
        icon: Snowflake,
        bgGradient: 'from-teal-100 via-sky-400 to-indigo-800',
        textColor: 'text-white'
      };
    case 95:
    case 96:
    case 99:
      return {
        label: 'Thunderstorm',
        icon: CloudLightning,
        bgGradient: 'from-indigo-950 via-slate-900 to-purple-950',
        textColor: 'text-yellow-400'
      };
    default:
      return {
        label: 'Unknown Weather',
        icon: Cloud,
        bgGradient: 'from-slate-500 to-slate-700',
        textColor: 'text-white'
      };
  }
}

export function cToF(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

export function formatTemp(celsius: number, unit: 'C' | 'F'): string {
  const value = unit === 'C' ? Math.round(celsius) : cToF(celsius);
  return `${value}°${unit}`;
}

export function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return '';
  }
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

export function getDayName(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  } catch {
    return '';
  }
}

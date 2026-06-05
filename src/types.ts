export interface WeatherCurrent {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  isDay: boolean;
  weatherCode: number;
  time: string;
}

export interface WeatherHourly {
  time: string[];
  temperature: number[];
  weatherCode: number[];
}

export interface WeatherDaily {
  time: string[];
  weatherCode: number[];
  tempMax: number[];
  tempMin: number[];
  sunrise: string[];
  sunset: string[];
}

export interface WeatherData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  current: WeatherCurrent;
  hourly: WeatherHourly;
  daily: WeatherDaily;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // region or state
  country_code?: string;
}

export interface AIVerdict {
  summary: string;
  clothing: string;
  activities: string[];
  safety: string;
}

export type WeatherUnit = 'C' | 'F';

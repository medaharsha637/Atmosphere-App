import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Compass, Loader2 } from 'lucide-react';
import { GeocodingResult } from '../types';

interface SearchHeaderProps {
  onSelectCity: (latitude: number, longitude: number, city: string, country: string) => void;
  isLoading: boolean;
}

export default function SearchHeader({ onSelectCity, isLoading }: SearchHeaderProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch cities from Open-Meteo Geocoding
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            query
          )}&count=5&language=en&format=json`
        );
        const data = await response.json();
        if (data.results) {
          setResults(data.results);
          setShowDropdown(true);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error('Geocoding fetch failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Handle direct coordinates geolocation
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let cityName = 'My Location';
        let countryName = 'GPS';

        try {
          // Attempt reverse geocoding to find city name
          const revRep = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          if (revRep.ok) {
            const revData = await revRep.json();
            cityName =
              revData.address.city ||
              revData.address.town ||
              revData.address.village ||
              revData.address.suburb ||
              'Located Area';
            countryName = revData.address.country || 'GPS';
          }
        } catch (e) {
          console.error('Reverse geocode failed, using coordinates fallback:', e);
        }

        onSelectCity(latitude, longitude, cityName, countryName);
        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation lookup failed:', error);
        alert('Could not access location. Please search for a city manually.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSelectResult = (city: GeocodingResult) => {
    onSelectCity(city.latitude, city.longitude, city.name, city.country);
    setQuery('');
    setResults([]);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto z-50 px-2" id="search-container">
      <div className="flex items-center gap-2 bg-white rounded-2xl shadow-md border border-slate-100 p-2 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
        <Search className="w-5 h-5 text-slate-400 ml-2" />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for cities..."
          className="flex-1 bg-transparent border-0 outline-none text-slate-800 placeholder-slate-400 text-sm py-1.5"
          onFocus={() => {
            if (results.length > 0) setShowDropdown(true);
          }}
        />

        {isSearching && (
          <Loader2 className="w-5 h-5 text-slate-400 animate-spin mr-1" />
        )}

        <button
          onClick={handleGeolocation}
          disabled={isLocating}
          className="flex items-center justify-center p-2 rounded-xl text-blue-600 hover:bg-blue-50/80 active:bg-blue-100 transition-colors disabled:opacity-50"
          title="Detect Current Location"
          id="btn-geolocation"
        >
          {isLocating ? (
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          ) : (
            <Compass className="w-5 h-5" />
          )}
        </button>
      </div>

      {showDropdown && results.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute left-2 right-2 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-150/50 overflow-hidden divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-200"
          id="search-results-dropdown"
        >
          {results.map((city) => (
            <button
              key={city.id}
              onClick={() => handleSelectResult(city)}
              className="w-full text-left px-5 py-3.5 hover:bg-blue-50/50 active:bg-blue-100/75 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                <div>
                  <span className="font-medium text-slate-800 text-sm mr-1">
                    {city.name}
                  </span>
                  {city.admin1 && (
                    <span className="text-slate-400 text-xs">
                      {city.admin1},
                    </span>
                  )}
                  <span className="text-slate-500 text-xs">
                    {' '}{city.country}
                  </span>
                </div>
              </div>
              {city.country_code && (
                <span className="font-mono text-[10px] text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  {city.country_code}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

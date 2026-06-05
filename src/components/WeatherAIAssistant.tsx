import React from 'react';
import { Sparkles, Shirt, Compass, ShieldAlert, Loader2 } from 'lucide-react';
import { AIVerdict } from '../types';

interface WeatherAIAssistantProps {
  advice: AIVerdict | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function WeatherAIAssistant({
  advice,
  isLoading,
  error,
  onRetry
}: WeatherAIAssistantProps) {
  return (
    <div 
      className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 relative overflow-hidden"
      id="ai-assistant-card"
    >
      {/* Dynamic backing vector elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-505/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4 relative z-10">
        <div className="p-2.5 bg-indigo-500/15 text-indigo-400 rounded-2xl border border-indigo-500/30">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Climate AI Personal Planner
          </h2>
          <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase mt-0.5">
            Realtime Gemini intelligence
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-8 flex flex-col items-center justify-center gap-4 text-center">
          <div className="relative flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
            <Sparkles className="w-4 h-4 text-indigo-300 absolute" />
          </div>
          <div>
            <p className="text-slate-200 font-semibold text-sm">Synthesizing personalized advice...</p>
            <p className="text-slate-400 text-xs mt-1">
              Correlating weather metrics with styling and activity heuristics.
            </p>
          </div>
          
          {/* Skeleton lines */}
          <div className="w-full flex flex-col gap-2 mt-4 max-w-sm">
            <div className="h-4 bg-slate-800 rounded-md animate-pulse w-3/4 self-center" />
            <div className="h-3 bg-slate-800 rounded-md animate-pulse w-1/2 self-center" />
            <div className="h-3 bg-slate-800 rounded-md animate-pulse w-5/6 self-center" />
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {error && !isLoading && (
        <div className="py-6 text-center">
          <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <p className="text-slate-350 font-medium text-sm">Failed to generate AI advice</p>
          <p className="text-slate-500 text-xs mt-1">{error}</p>
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold rounded-xl transition-colors shadow-lg active:scale-95 whitespace-nowrap"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Advice Content Presentation */}
      {advice && !isLoading && !error && (
        <div className="space-y-6 relative z-10 animate-in fade-in duration-500">
          
          {/* Weather visual vibe summary overlay */}
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-sm italic font-medium text-slate-100 leading-relaxed text-center sm:text-left">
              "{advice.summary}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Clothing Advisor Section */}
            <div className="bg-slate-850 border border-slate-800/60 p-5 rounded-2xl flex flex-col gap-3 hover:border-slate-700/60 transition-colors">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
                <Shirt className="w-4.5 h-4.5" />
                <span>What to Wear</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {advice.clothing}
              </p>
            </div>

            {/* Activities Planner Section */}
            <div className="bg-slate-850 border border-slate-800/60 p-5 rounded-2xl flex flex-col gap-3 hover:border-slate-700/60 transition-colors">
              <div className="flex items-center gap-2 text-sky-300 font-bold text-xs uppercase tracking-wider">
                <Compass className="w-4.5 h-4.5" />
                <span>Best Activities</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2 font-medium">
                {advice.activities.map((act, index) => (
                  <li key={index} className="flex items-start gap-1.5 leading-snug">
                    <span className="text-sky-400 font-bold text-sm leading-none">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Precaution warning alerts Section */}
            <div className="bg-slate-850 border border-slate-800/60 p-5 rounded-2xl flex flex-col gap-3 hover:border-slate-700/60 transition-colors">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
                <ShieldAlert className="w-4.5 h-4.5" />
                <span>Safety Alerts</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {advice.safety}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

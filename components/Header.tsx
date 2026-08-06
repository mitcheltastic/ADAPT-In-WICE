import React from 'react';
import { Sparkles, MapPin, Cpu, ShieldAlert } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="mb-8 text-center pt-6">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 border border-pink-200 text-pink-600 text-xs font-bold tracking-wide uppercase mb-3 shadow-xs">
        <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
        AI-Powered Decision Support System (DSS)
      </div>

      <h1 className="text-3xl md:text-5xl font-extrabold text-pink-600 tracking-tight mb-2">
        ADAPT-IN
      </h1>

      <p className="text-sm md:text-base text-pink-700 font-semibold max-w-3xl mx-auto leading-relaxed">
        Adaptive Decision Support System for Poverty Alleviation Intervention Recommendations in Indonesia
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-xs font-medium text-pink-600">
        <span className="inline-flex items-center gap-1 bg-white/80 px-3 py-1 rounded-lg border border-pink-200 shadow-2xs">
          <MapPin className="w-3.5 h-3.5 text-pink-500" /> 514 Regencies / Cities
        </span>
        <span className="inline-flex items-center gap-1 bg-white/80 px-3 py-1 rounded-lg border border-pink-200 shadow-2xs">
          <Cpu className="w-3.5 h-3.5 text-pink-500" /> Neural Network Model API
        </span>
        <span className="inline-flex items-center gap-1 bg-white/80 px-3 py-1 rounded-lg border border-pink-200 shadow-2xs">
          <ShieldAlert className="w-3.5 h-3.5 text-pink-500" /> GeoJSON Choropleth Map
        </span>
      </div>
    </header>
  );
};

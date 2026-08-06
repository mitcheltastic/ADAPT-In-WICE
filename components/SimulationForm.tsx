'use client';

import React, { useState } from 'react';
import { Sliders, Play, RefreshCw, Calculator } from 'lucide-react';

interface SimulationFormProps {
  onPredict: (formData: any) => void;
  isLoading: boolean;
}

export const SimulationForm: React.FC<SimulationFormProps> = ({
  onPredict,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    rls: 8.5,
    exp: 10000,
    ipm: 68.5,
    uhh: 70.0,
    sanitasi: 75.0,
    air: 85.0,
    tpt: 5.5,
    tpak: 65.0,
  });

  const handleChange = (field: string, val: string) => {
    const parsed = parseFloat(val);
    setFormData((prev) => ({ ...prev, [field]: isNaN(parsed) ? 0 : parsed }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 md:p-8 border border-pink-200 shadow-lg">
      <div className="flex items-center gap-3 mb-6 border-b border-pink-200 pb-4">
        <div className="p-2.5 rounded-xl bg-pink-100 text-pink-600">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-pink-700">
            Interactive Simulation Tool (Precision Input)
          </h3>
          <p className="text-xs text-pink-700/80">
            Enter the socio-economic indicator values for a region below:
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Category 1: Education & Economy */}
        <div className="bg-white/80 p-5 rounded-2xl border border-pink-200 shadow-2xs">
          <h4 className="text-xs font-extrabold text-pink-700 uppercase tracking-wider mb-4 border-b border-pink-100 pb-2">
            Education & Economy
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Mean Years of Schooling (MYS - Years)
              </label>
              <input
                type="number"
                min={0}
                max={15}
                step={0.1}
                value={formData.rls}
                onChange={(e) => handleChange('rls', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent shadow-2xs transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Per Capita Expenditure (Thousand IDR)
              </label>
              <input
                type="number"
                min={1000}
                max={30000}
                step={500}
                value={formData.exp}
                onChange={(e) => handleChange('exp', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent shadow-2xs transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Human Development Index (HDI)
              </label>
              <input
                type="number"
                min={40}
                max={90}
                step={0.5}
                value={formData.ipm}
                onChange={(e) => handleChange('ipm', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent shadow-2xs transition-all"
              />
            </div>
          </div>
        </div>

        {/* Category 2: Health & Infrastructure */}
        <div className="bg-white/80 p-5 rounded-2xl border border-pink-200 shadow-2xs">
          <h4 className="text-xs font-extrabold text-pink-700 uppercase tracking-wider mb-4 border-b border-pink-100 pb-2">
            Health & Infrastructure
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Life Expectancy (Years)
              </label>
              <input
                type="number"
                min={50}
                max={80}
                step={0.5}
                value={formData.uhh}
                onChange={(e) => handleChange('uhh', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent shadow-2xs transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Decent Sanitation Access (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={formData.sanitasi}
                onChange={(e) => handleChange('sanitasi', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent shadow-2xs transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Safe Drinking Water Access (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={formData.air}
                onChange={(e) => handleChange('air', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent shadow-2xs transition-all"
              />
            </div>
          </div>
        </div>

        {/* Category 3: Employment & Labor */}
        <div className="bg-white/80 p-5 rounded-2xl border border-pink-200 shadow-2xs">
          <h4 className="text-xs font-extrabold text-pink-700 uppercase tracking-wider mb-4 border-b border-pink-100 pb-2">
            Employment & Labor
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Open Unemployment Rate (%)
              </label>
              <input
                type="number"
                min={0}
                max={25}
                step={0.1}
                value={formData.tpt}
                onChange={(e) => handleChange('tpt', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent shadow-2xs transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Labor Force Participation Rate (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={formData.tpak}
                onChange={(e) => handleChange('tpak', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent shadow-2xs transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-300 via-pink-500 to-pink-600 text-white font-extrabold text-base shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" /> Running AI Inference...
          </>
        ) : (
          <>
            <Play className="w-5 h-5 fill-current" /> Run AI Analysis & Get Policy Recommendations
          </>
        )}
      </button>
    </form>
  );
};

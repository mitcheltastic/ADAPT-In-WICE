'use client';

import React, { useState } from 'react';
import { Sparkles, Sliders, Play, RefreshCw } from 'lucide-react';

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

  const handleChange = (field: string, val: number) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 md:p-8 border border-pink-200 shadow-lg">
      <div className="flex items-center gap-3 mb-6 border-b border-pink-200 pb-4">
        <div className="p-2.5 rounded-xl bg-pink-100 text-pink-600">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-pink-700">
            Interactive Simulation Tool (Precision Input)
          </h3>
          <p className="text-xs text-pink-700/80">
            Adjust socio-economic indicators below to simulate AI intervention recommendations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Category 1: Education & Economy */}
        <div className="bg-white/70 p-4 rounded-2xl border border-pink-200">
          <h4 className="text-xs font-bold text-pink-700 uppercase tracking-wide mb-4 border-b border-pink-100 pb-2">
            Education & Economy
          </h4>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <label className="text-gray-700">Mean Years of Schooling (MYS)</label>
                <span className="text-pink-600 font-bold">{formData.rls} Years</span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                step={0.1}
                value={formData.rls}
                onChange={(e) => handleChange('rls', parseFloat(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <label className="text-gray-700">Per Capita Expenditure</label>
                <span className="text-pink-600 font-bold">{formData.exp.toLocaleString()} k IDR</span>
              </div>
              <input
                type="range"
                min={1000}
                max={30000}
                step={500}
                value={formData.exp}
                onChange={(e) => handleChange('exp', parseFloat(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <label className="text-gray-700">Human Development Index (HDI)</label>
                <span className="text-pink-600 font-bold">{formData.ipm}</span>
              </div>
              <input
                type="range"
                min={40}
                max={90}
                step={0.5}
                value={formData.ipm}
                onChange={(e) => handleChange('ipm', parseFloat(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Category 2: Health & Infrastructure */}
        <div className="bg-white/70 p-4 rounded-2xl border border-pink-200">
          <h4 className="text-xs font-bold text-pink-700 uppercase tracking-wide mb-4 border-b border-pink-100 pb-2">
            Health & Infrastructure
          </h4>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <label className="text-gray-700">Life Expectancy</label>
                <span className="text-pink-600 font-bold">{formData.uhh} Years</span>
              </div>
              <input
                type="range"
                min={50}
                max={80}
                step={0.5}
                value={formData.uhh}
                onChange={(e) => handleChange('uhh', parseFloat(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <label className="text-gray-700">Decent Sanitation Access</label>
                <span className="text-pink-600 font-bold">{formData.sanitasi}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={formData.sanitasi}
                onChange={(e) => handleChange('sanitasi', parseFloat(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <label className="text-gray-700">Safe Drinking Water Access</label>
                <span className="text-pink-600 font-bold">{formData.air}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={formData.air}
                onChange={(e) => handleChange('air', parseFloat(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Category 3: Employment & GRDP */}
        <div className="bg-white/70 p-4 rounded-2xl border border-pink-200">
          <h4 className="text-xs font-bold text-pink-700 uppercase tracking-wide mb-4 border-b border-pink-100 pb-2">
            Employment & Labor
          </h4>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <label className="text-gray-700">Open Unemployment Rate</label>
                <span className="text-pink-600 font-bold">{formData.tpt}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                step={0.1}
                value={formData.tpt}
                onChange={(e) => handleChange('tpt', parseFloat(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <label className="text-gray-700">Labor Force Participation Rate</label>
                <span className="text-pink-600 font-bold">{formData.tpak}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={formData.tpak}
                onChange={(e) => handleChange('tpak', parseFloat(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
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

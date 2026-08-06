'use client';

import React from 'react';
import { AlertTriangle, CheckCircle, Info, Sparkles } from 'lucide-react';

interface RecommendationResultProps {
  result: {
    priority_label: string;
    class_code?: number;
    policy_recommendation: string;
    source?: string;
  } | null;
}

export const RecommendationResult: React.FC<RecommendationResultProps> = ({
  result,
}) => {
  if (!result) return null;

  const isHigh = result.priority_label === 'High Priority';
  const isMedium = result.priority_label === 'Medium Priority';

  const badgeBg = isHigh
    ? 'bg-pink-600 text-white'
    : isMedium
    ? 'bg-pink-300 text-pink-700'
    : 'bg-emerald-500 text-white';

  const cardBg = isHigh
    ? 'bg-pink-50/90 border-pink-500'
    : isMedium
    ? 'bg-amber-50/90 border-pink-300'
    : 'bg-emerald-50/90 border-emerald-400';

  const IconComponent = isHigh
    ? AlertTriangle
    : isMedium
    ? Info
    : CheckCircle;

  return (
    <div
      className={`mt-8 p-6 md:p-8 rounded-3xl border-2 backdrop-blur-md shadow-xl transition-all animate-in fade-in slide-in-from-bottom-4 duration-300 ${cardBg}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-pink-200/60 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${badgeBg} shadow-md`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block">
              ADAPT-In Classification Result
            </span>
            <h2 className="text-2xl font-extrabold text-pink-700">
              {result.priority_label}
            </h2>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-pink-200 text-xs font-semibold text-pink-600">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          {result.source === 'hf_space_proxy' ? 'HF Spaces AI Model' : 'Inference Engine'}
        </span>
      </div>

      <div className="bg-white/80 rounded-2xl p-5 border border-pink-100 shadow-2xs">
        <h4 className="text-xs font-bold text-pink-700 uppercase tracking-wide mb-2">
          AI Policy Recommendation & Action Plan:
        </h4>
        <p className="text-sm md:text-base text-gray-800 font-medium leading-relaxed">
          {result.policy_recommendation}
        </p>
      </div>
    </div>
  );
};

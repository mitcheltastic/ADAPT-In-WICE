'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface RecordItem {
  id: number;
  provinsi: string;
  kabKota: string;
  p0: number;
  rls: number;
  exp: number;
  ipm: number;
  uhh: number;
  sanitasi: number;
  air: number;
  tpt: number;
  tpak: number;
  pdrb: number;
}

interface RegionalProfileChartsProps {
  data: RecordItem[];
}

export const RegionalProfileCharts: React.FC<RegionalProfileChartsProps> = ({
  data,
}) => {
  if (!data || data.length === 0) return null;

  // Top 5 sorted items for each indicator
  const topRLS = [...data].sort((a, b) => b.rls - a.rls).slice(0, 5);
  const topEXP = [...data].sort((a, b) => b.exp - a.exp).slice(0, 5);
  const topIPM = [...data].sort((a, b) => b.ipm - a.ipm).slice(0, 5);

  const topUHH = [...data].sort((a, b) => b.uhh - a.uhh).slice(0, 5);
  const topSAN = [...data].sort((a, b) => b.sanitasi - a.sanitasi).slice(0, 5);
  const topAIR = [...data].sort((a, b) => b.air - a.air).slice(0, 5);

  const lowestTPT = [...data].sort((a, b) => a.tpt - b.tpt).slice(0, 5);
  const topTPAK = [...data].sort((a, b) => b.tpak - a.tpak).slice(0, 5);
  const topPDRB = [...data].sort((a, b) => b.pdrb - a.pdrb).slice(0, 5);

  const renderHorizontalBar = (
    chartData: any[],
    dataKey: string,
    title: string,
    color: string,
    unit: string
  ) => (
    <div className="bg-white/80 rounded-xl p-3 border border-pink-100 mb-4 shadow-2xs">
      <h5 className="text-xs font-bold text-pink-700 mb-2 tracking-wide uppercase">
        {title}
      </h5>
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
          >
            <XAxis type="number" tick={{ fontSize: 10, fill: '#6B7280' }} />
            <YAxis
              dataKey="kabKota"
              type="category"
              tick={{ fontSize: 10, fill: '#8A2355', fontWeight: 600 }}
              width={90}
            />
            <Tooltip
              formatter={(value: any) => [`${value} ${unit}`, title]}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#F8C8DC',
                borderRadius: '8px',
                fontSize: '11px',
              }}
            />
            <Bar dataKey={dataKey} fill={color} radius={[0, 6, 6, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {/* Column 1: Education & Economy */}
      <div className="glass-card rounded-2xl p-5 border border-pink-200">
        <div className="border-b-2 border-pink-200 pb-2 mb-4">
          <h3 className="text-sm font-extrabold text-pink-700 tracking-wide uppercase">
            Education & Economy Profile
          </h3>
        </div>
        {renderHorizontalBar(topRLS, 'rls', 'Mean Years of Schooling (MYS)', '#E8A0BF', 'Years')}
        {renderHorizontalBar(topEXP, 'exp', 'Per Capita Expenditure', '#AD336D', 'k IDR')}
        {renderHorizontalBar(topIPM, 'ipm', 'Human Development Index (HDI)', '#8A2355', 'pts')}
      </div>

      {/* Column 2: Health & Infrastructure */}
      <div className="glass-card rounded-2xl p-5 border border-pink-200">
        <div className="border-b-2 border-pink-200 pb-2 mb-4">
          <h3 className="text-sm font-extrabold text-pink-700 tracking-wide uppercase">
            Health & Infrastructure Profile
          </h3>
        </div>
        {renderHorizontalBar(topUHH, 'uhh', 'Life Expectancy', '#FFB6C1', 'Years')}
        {renderHorizontalBar(topSAN, 'sanitasi', 'Decent Sanitation Access', '#D47AE8', '%')}
        {renderHorizontalBar(topAIR, 'air', 'Safe Drinking Water Access', '#519E8A', '%')}
      </div>

      {/* Column 3: Employment & GRDP */}
      <div className="glass-card rounded-2xl p-5 border border-pink-200">
        <div className="border-b-2 border-pink-200 pb-2 mb-4">
          <h3 className="text-sm font-extrabold text-pink-700 tracking-wide uppercase">
            Employment & GRDP Profile
          </h3>
        </div>
        {renderHorizontalBar(lowestTPT, 'tpt', 'Lowest Open Unemployment Rate', '#F8C8DC', '%')}
        {renderHorizontalBar(topTPAK, 'tpak', 'Labor Force Participation Rate', '#E8A0BF', '%')}
        {renderHorizontalBar(topPDRB, 'pdrb', 'GRDP at Constant Prices', '#AD336D', 'Rupiah')}
      </div>
    </div>
  );
};

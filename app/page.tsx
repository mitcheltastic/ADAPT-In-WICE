'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { MetricCard } from '@/components/MetricCard';
import { RegionalProfileCharts } from '@/components/RegionalProfileCharts';
import { SimulationForm } from '@/components/SimulationForm';
import { RecommendationResult } from '@/components/RecommendationResult';
import { MapPin, AlertCircle, CheckCircle, Info, Filter, Layers } from 'lucide-react';

// Dynamic import for Leaflet map component (CSR only)
const SpatialMap = dynamic(
  () => import('@/components/SpatialMap').then((mod) => mod.SpatialMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] rounded-2xl bg-pink-50/50 border border-pink-200 flex items-center justify-center text-pink-600 font-semibold animate-pulse">
        Loading Interactive GeoJSON Map...
      </div>
    ),
  }
);

interface RegencyRecord {
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
  priority: string;
  lat: number;
  long: number;
}

export default function Home() {
  const [records, setRecords] = useState<RegencyRecord[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('All Provinces');
  const [activeTab, setActiveTab] = useState<'tab1' | 'tab2'>('tab1');
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);

  useEffect(() => {
    fetch('/data/poverty_data.json')
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch((err) => console.error('Failed to load poverty data:', err));
  }, []);

  const provinceList = useMemo(() => {
    if (!records.length) return ['All Provinces'];
    const provs = Array.from(new Set(records.map((r) => r.provinsi))).sort();
    return ['All Provinces', ...provs];
  }, [records]);

  const filteredRecords = useMemo(() => {
    if (selectedProvince === 'All Provinces') return records;
    return records.filter((r) => r.provinsi === selectedProvince);
  }, [records, selectedProvince]);

  const highPriorityCount = useMemo(
    () => filteredRecords.filter((r) => r.priority === 'High Priority').length,
    [filteredRecords]
  );
  const mediumPriorityCount = useMemo(
    () => filteredRecords.filter((r) => r.priority === 'Medium Priority').length,
    [filteredRecords]
  );
  const lowPriorityCount = useMemo(
    () => filteredRecords.filter((r) => r.priority === 'Low Priority').length,
    [filteredRecords]
  );

  const handlePredict = async (formData: any) => {
    setIsPredicting(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setPredictionResult(data);
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <main className="min-h-screen pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <Header />

      {/* Navigation & Region Filter Bar */}
      <div className="glass-card rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 border border-pink-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-pink-600" />
          <label htmlFor="prov-select" className="text-xs font-bold text-pink-700 uppercase">
            Select Province Region:
          </label>
          <select
            id="prov-select"
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="bg-white border border-pink-200 text-pink-700 font-semibold text-xs rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-pink-300 transition-all cursor-pointer shadow-2xs"
          >
            {provinceList.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Modern Tabs */}
        <div className="flex items-center gap-2 bg-pink-100/70 p-1.5 rounded-xl border border-pink-200">
          <button
            onClick={() => setActiveTab('tab1')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'tab1'
                ? 'bg-gradient-to-r from-pink-300 to-pink-500 text-white shadow-md'
                : 'text-pink-600 hover:text-pink-700'
            }`}
          >
            1. Regional Descriptive Analysis
          </button>
          <button
            onClick={() => setActiveTab('tab2')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'tab2'
                ? 'bg-gradient-to-r from-pink-300 to-pink-500 text-white shadow-md'
                : 'text-pink-600 hover:text-pink-700'
            }`}
          >
            2. Simulation Tool (AI Prediction)
          </button>
        </div>
      </div>

      {/* TAB 1: REGIONAL DESCRIPTIVE ANALYSIS */}
      {activeTab === 'tab1' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="TOTAL REGIONS"
              value={filteredRecords.length}
              borderColor="#E8A0BF"
              textColor="#8A2355"
              icon={<MapPin className="w-4 h-4 text-pink-500" />}
            />
            <MetricCard
              title="HIGH PRIORITY"
              value={highPriorityCount}
              borderColor="#AD336D"
              textColor="#AD336D"
              icon={<AlertCircle className="w-4 h-4 text-pink-600" />}
            />
            <MetricCard
              title="MEDIUM PRIORITY"
              value={mediumPriorityCount}
              borderColor="#E8A0BF"
              textColor="#E8A0BF"
              icon={<Info className="w-4 h-4 text-pink-400" />}
            />
            <MetricCard
              title="LOW PRIORITY"
              value={lowPriorityCount}
              borderColor="#519E8A"
              textColor="#519E8A"
              icon={<CheckCircle className="w-4 h-4 text-emerald-500" />}
            />
          </div>

          {/* Spatial Map Section */}
          <div className="glass-card rounded-3xl p-6 border border-pink-200">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-pink-600" />
              <h3 className="text-base font-extrabold text-pink-700">
                Spatial Distribution Map of Poverty Percentage in Indonesia (GeoJSON Vector Layer)
              </h3>
            </div>
            <SpatialMap data={filteredRecords} />
          </div>

          {/* Indicator Profiles (Recharts) */}
          <RegionalProfileCharts data={filteredRecords} />
        </div>
      )}

      {/* TAB 2: SIMULATION TOOL (AI PREDICTION) */}
      {activeTab === 'tab2' && (
        <div className="animate-in fade-in duration-300">
          <SimulationForm onPredict={handlePredict} isLoading={isPredicting} />
          <RecommendationResult result={predictionResult} />
        </div>
      )}
    </main>
  );
}

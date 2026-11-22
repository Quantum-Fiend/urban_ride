'use client';

import React, { useState } from 'react';
import {
  Activity,
  Car,
  Users,
  DollarSign,
  TrendingUp,
  Flame,
  ShieldCheck,
  Server,
  Zap,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';

export default function AdminOperationsCenter() {
  const [baseFareEconomy, setBaseFareEconomy] = useState(3.5);
  const [ratePerKmEconomy, setRatePerKmEconomy] = useState(1.25);
  const [surgeCap, setSurgeCap] = useState(2.5);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const mockDrivers = [
    {
      id: 1,
      name: 'Marcus Wright',
      vehicle: 'Tesla Model 3',
      plate: 'KA-01-EQ-9921',
      tier: 'EV',
      rating: 4.96,
      status: 'AVAILABLE',
      trips: 384,
      earnings: '$8,420.00',
    },
    {
      id: 2,
      name: 'Elena Rostova',
      vehicle: 'BMW 5 Series',
      plate: 'KA-03-MB-4012',
      tier: 'BLACK',
      rating: 4.98,
      status: 'ON_TRIP',
      trips: 512,
      earnings: '$14,890.00',
    },
    {
      id: 3,
      name: 'David Chen',
      vehicle: 'Toyota Camry Hybrid',
      plate: 'KA-05-AB-7741',
      tier: 'COMFORT',
      rating: 4.91,
      status: 'AVAILABLE',
      trips: 290,
      earnings: '$6,120.00',
    },
    {
      id: 4,
      name: 'Priya Sharma',
      vehicle: 'Honda City',
      plate: 'KA-02-XC-1029',
      tier: 'ECONOMY',
      rating: 4.88,
      status: 'OFFLINE',
      trips: 180,
      earnings: '$3,850.00',
    },
  ];

  const handleSavePricing = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Operations & Fleet Control Center
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-widest">
              Live Cluster
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time geospatial analytics, fleet dispatch monitoring, dynamic pricing controls, and system health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span>PostgreSQL + Redis Cluster: <strong>Optimal</strong></span>
          </div>
        </div>
      </div>

      {/* Enterprise Executive KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Trips</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">42</span>
            <span className="text-xs font-semibold text-emerald-400">+12% vs last hr</span>
          </div>
          <p className="text-[11px] text-slate-500">Peak hour concurrency active</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Online Fleet</span>
            <Car className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">186</span>
            <span className="text-xs font-semibold text-slate-400">/ 1,240 registered</span>
          </div>
          <p className="text-[11px] text-slate-500">14 pending KYC verification</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Platform Vol</span>
            <DollarSign className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">$48,750</span>
            <span className="text-xs font-semibold text-emerald-400">+24.8% YoY</span>
          </div>
          <p className="text-[11px] text-slate-500">20% net platform commission</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Surge Multiplier</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-300 font-mono">1.25x</span>
            <span className="text-xs font-semibold text-amber-400">Zone High</span>
          </div>
          <p className="text-[11px] text-slate-500">Demand/Supply ratio at 1.42</p>
        </div>
      </div>

      {/* 2-Column Section: Dynamic Pricing Engine + System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dynamic Pricing Engine (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-panel space-y-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Dynamic Pricing Engine</h3>
            </div>
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> Rules Updated
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-2">
              <label className="text-[10px] text-slate-400 font-bold uppercase block">Economy Base Fare</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-400">$</span>
                <input
                  type="number"
                  step="0.25"
                  value={baseFareEconomy}
                  onChange={(e) => setBaseFareEconomy(Number(e.target.value))}
                  className="w-full bg-transparent text-lg font-mono font-bold text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-2">
              <label className="text-[10px] text-slate-400 font-bold uppercase block">Rate Per KM</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-400">$</span>
                <input
                  type="number"
                  step="0.05"
                  value={ratePerKmEconomy}
                  onChange={(e) => setRatePerKmEconomy(Number(e.target.value))}
                  className="w-full bg-transparent text-lg font-mono font-bold text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-2">
              <label className="text-[10px] text-slate-400 font-bold uppercase block">Max Surge Ceiling</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={surgeCap}
                  onChange={(e) => setSurgeCap(Number(e.target.value))}
                  className="w-full bg-transparent text-lg font-mono font-bold text-amber-300 focus:outline-none"
                />
                <span className="text-sm font-bold text-slate-400">x</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSavePricing}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
          >
            Apply Pricing Rules to Cluster
          </button>
        </div>

        {/* System Cluster Health & Observability (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-panel space-y-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Cluster Telemetry</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">99.99% Uptime</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-400">P99 REST API Latency</span>
                <span className="text-white font-mono">42 ms</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-400">Redis Geospatial Cache Hit Rate</span>
                <span className="text-white font-mono">99.4%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '99%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-400">Kafka Telemetry Throughput</span>
                <span className="text-white font-mono">18,240 events/sec</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-400 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-400">HikariCP PostgreSQL Pool</span>
                <span className="text-white font-mono">4 / 20 active connections</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Driver Fleet Table */}
      <div className="p-6 rounded-2xl glass-panel space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Car className="w-4 h-4 text-cyan-400" /> Active Driver Fleet Roster
          </h3>
          <span className="text-xs text-slate-400">Showing 4 of 186 online drivers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-white/[0.06]">
                <th className="pb-3 font-semibold">Driver Partner</th>
                <th className="pb-3 font-semibold">Vehicle</th>
                <th className="pb-3 font-semibold">Tier</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Rating</th>
                <th className="pb-3 font-semibold">Total Trips</th>
                <th className="pb-3 font-semibold text-right">Lifetime Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {mockDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 font-bold text-white">{driver.name}</td>
                  <td className="py-3.5 text-slate-300">
                    <div>{driver.vehicle}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{driver.plate}</span>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold text-[10px] border border-cyan-500/20">
                      {driver.tier}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      driver.status === 'AVAILABLE'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : driver.status === 'ON_TRIP'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        driver.status === 'AVAILABLE' ? 'bg-emerald-400' : driver.status === 'ON_TRIP' ? 'bg-cyan-400' : 'bg-slate-400'
                      }`} />
                      {driver.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-200 font-semibold">{driver.rating} ★</td>
                  <td className="py-3.5 text-slate-400 font-mono">{driver.trips}</td>
                  <td className="py-3.5 text-right font-mono font-bold text-white">{driver.earnings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

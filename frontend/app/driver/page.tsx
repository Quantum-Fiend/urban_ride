'use client';

import React, { useState, useEffect } from 'react';
import InteractiveMap from '../../shared/components/InteractiveMap';
import {
  Navigation,
  Power,
  Shield,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Star,
  KeyRound,
  Compass,
  Zap,
} from 'lucide-react';

export default function DriverCockpit() {
  const [isOnline, setIsOnline] = useState(true);
  const [driverState, setDriverState] = useState<'IDLE' | 'OFFER' | 'PICKUP' | 'ARRIVED' | 'IN_TRIP' | 'COMPLETED'>('IDLE');
  const [countdown, setCountdown] = useState(15);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [todayEarnings, setTodayEarnings] = useState(148.5);
  const [todayTrips, setTodayTrips] = useState(6);

  // Auto trigger dispatch simulation when driver goes online
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOnline && driverState === 'IDLE') {
      timer = setTimeout(() => {
        setDriverState('OFFER');
        setCountdown(15);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isOnline, driverState]);

  // Countdown for incoming offer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (driverState === 'OFFER' && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setDriverState('IDLE');
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [driverState, countdown]);

  const handleAcceptOffer = () => {
    setDriverState('PICKUP');
  };

  const handleArrivedAtPickup = () => {
    setDriverState('ARRIVED');
  };

  const handleVerifyOtpAndStart = () => {
    if (otpInput.trim() === '4921') {
      setOtpError(false);
      setDriverState('IN_TRIP');
    } else {
      setOtpError(true);
    }
  };

  const handleCompleteTrip = () => {
    const tripPayout = 19.6; // 80% net earnings
    setTodayEarnings((prev) => prev + tripPayout);
    setTodayTrips((prev) => prev + 1);
    setDriverState('COMPLETED');
    setTimeout(() => {
      setDriverState('IDLE');
      setOtpInput('');
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header & Cockpit Telemetry Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Driver Partner Cockpit
            </h1>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isOnline
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border border-white/10'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              {isOnline ? 'Online & Dispatch Ready' : 'Offline'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Marcus Wright • Tesla Model 3 (Midnight Silver) • License Plate KA-01-EQ-9921
          </p>
        </div>

        {/* Go Online / Go Offline Big Switch */}
        <button
          onClick={() => {
            setIsOnline(!isOnline);
            if (isOnline) setDriverState('IDLE');
          }}
          className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg ${
            isOnline
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
              : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500 shadow-emerald-500/20'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{isOnline ? 'Go Offline' : 'Go Online Now'}</span>
        </button>
      </div>

      {/* Driver Metric HUD Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl glass-panel space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Today's Earnings</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-white font-mono">${todayEarnings.toFixed(2)}</span>
            <span className="text-[10px] text-emerald-400 font-semibold">+18% vs avg</span>
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Completed Trips</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-white font-mono">{todayTrips}</span>
            <span className="text-[10px] text-slate-400 font-semibold">trips today</span>
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Partner Rating</span>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-extrabold text-white font-mono">4.96</span>
            <div className="flex text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">High Demand Surge</span>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className="text-sm font-bold text-amber-300">Indiranagar (1.4x)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Navigation Map + Cockpit Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Vector Navigation Canvas (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <InteractiveMap
            tripStatus={driverState === 'IN_TRIP' ? 'IN_PROGRESS' : driverState}
            speed={driverState === 'IN_TRIP' ? 46 : 0}
          />
        </div>

        {/* Right: Driver Action HUD (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Dispatch Offer Modal / Alert */}
          {driverState === 'OFFER' && (
            <div className="p-6 rounded-2xl glass-panel border-cyan-500/50 space-y-5 shadow-2xl animate-pulse-slow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" /> New Ride Dispatch Offer
                </span>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs border border-cyan-500/30">
                  {countdown}s remaining
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Rider</span>
                    <h4 className="text-base font-extrabold text-white">Sarah Connor</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-400 uppercase font-bold">Estimated Payout</span>
                    <div className="text-lg font-black text-emerald-400 font-mono">$19.60</div>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 pt-2 border-t border-white/[0.08]">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>Pickup: <strong>MG Road Metro Station</strong> (0.8 km away)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span>Dropoff: <strong>Koramangala 5th Block</strong> (8.4 km total)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDriverState('IDLE')}
                  className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={handleAcceptOffer}
                  className="py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 transition-all"
                >
                  Accept Ride
                </button>
              </div>
            </div>
          )}

          {/* En Route to Pickup State */}
          {driverState === 'PICKUP' && (
            <div className="p-6 rounded-2xl glass-panel space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-400" /> Navigating to Passenger Pickup
                </span>
                <span className="text-xs font-mono text-slate-400">0.8 km • 3 min</span>
              </div>

              {/* Turn guidance simulation */}
              <div className="p-4 rounded-xl bg-slate-900 border border-white/10 flex items-center gap-3">
                <Compass className="w-7 h-7 text-cyan-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">In 200m, turn right onto MG Road</h4>
                  <p className="text-[10px] text-slate-400">Destination at left exit lane</p>
                </div>
              </div>

              <button
                onClick={handleArrivedAtPickup}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20"
              >
                I Have Arrived at Pickup
              </button>
            </div>
          )}

          {/* Arrived at Pickup & OTP Verification State */}
          {driverState === 'ARRIVED' && (
            <div className="p-6 rounded-2xl glass-panel space-y-5 shadow-2xl border-amber-500/40">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Verify Passenger PIN
                </span>
                <h3 className="text-base font-extrabold text-white mt-1">Passenger Onboard Verification</h3>
                <p className="text-xs text-slate-400">
                  Ask rider for their 4-digit security code (Demo PIN: <strong>4921</strong>)
                </p>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="Enter 4-digit PIN"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className={`w-full py-3 px-4 rounded-xl bg-slate-900 text-center font-mono text-2xl font-black tracking-widest text-white border focus:outline-none ${
                    otpError ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-white/10 focus:border-cyan-400'
                  }`}
                />
                {otpError && (
                  <p className="text-[11px] text-rose-400 font-semibold flex items-center justify-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Incorrect PIN. Enter 4921 to start ride.
                  </p>
                )}
              </div>

              <button
                onClick={handleVerifyOtpAndStart}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20"
              >
                Verify PIN & Commence Trip
              </button>
            </div>
          )}

          {/* In Trip HUD */}
          {driverState === 'IN_TRIP' && (
            <div className="p-6 rounded-2xl glass-panel space-y-5 shadow-2xl border-cyan-500/30">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" /> Ride in Progress
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">Live Meter: $24.50</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Destination</span>
                <h4 className="text-sm font-extrabold text-white">Koramangala 5th Block Hub</h4>
                <p className="text-xs text-slate-400">Sony World Junction, Koramangala</p>
              </div>

              <button
                onClick={handleCompleteTrip}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20"
              >
                Complete Dropoff & Settle Payout (+$19.60)
              </button>
            </div>
          )}

          {/* Completed State */}
          {driverState === 'COMPLETED' && (
            <div className="p-8 rounded-2xl glass-panel text-center space-y-3 border-emerald-500/40">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Dropoff Confirmed!</h3>
              <p className="text-xs text-slate-300">
                Fare settled. <strong>$19.60</strong> was credited to your earnings wallet.
              </p>
            </div>
          )}

          {/* Idle Waiting Card */}
          {driverState === 'IDLE' && (
            <div className="p-6 rounded-2xl glass-panel text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                <Navigation className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {isOnline ? 'Searching for nearby requests...' : 'You are currently offline'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isOnline
                    ? 'Stay in high demand zones to receive dispatches with up to 1.5x surge pricing.'
                    : 'Tap Go Online above to start receiving ride offers.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

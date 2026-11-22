'use client';

import React, { useState, useEffect } from 'react';
import InteractiveMap from '../shared/components/InteractiveMap';
import { SAMPLE_LOCATIONS, DEFAULT_TIERS } from '../shared/constants';
import { VehicleType, TripStatus, PaymentMethod, Trip } from '../shared/types';
import { api } from '../shared/services/api';
import {
  MapPin,
  Navigation,
  Car,
  ShieldCheck,
  CreditCard,
  Wallet,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Star,
  X,
  ChevronRight,
  Phone,
  Share2,
} from 'lucide-react';

export default function RiderPage() {
  const [pickupIndex, setPickupIndex] = useState(1);
  const [dropoffIndex, setDropoffIndex] = useState(3);
  const [selectedTier, setSelectedTier] = useState<VehicleType>('COMFORT');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('WALLET');
  const [trip, setTrip] = useState<Trip | null>(null);
  const [tripStatus, setTripStatus] = useState<TripStatus>('IDLE');
  const [isLoading, setIsLoading] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingScore, setRatingScore] = useState(5);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState(150.0);

  const pickup = SAMPLE_LOCATIONS[pickupIndex];
  const dropoff = SAMPLE_LOCATIONS[dropoffIndex];

  // Request ride flow
  const handleBookRide = async () => {
    setIsLoading(true);
    setTripStatus('MATCHING');

    const createdTrip = await api.requestTrip({
      pickupLatitude: pickup.lat,
      pickupLongitude: pickup.lng,
      dropoffLatitude: dropoff.lat,
      dropoffLongitude: dropoff.lng,
      pickupAddress: pickup.name,
      dropoffAddress: dropoff.name,
      vehicleType: selectedTier,
      paymentMethod,
    });

    setTrip(createdTrip);
    setIsLoading(false);

    // Simulate realistic dispatch progression
    setTimeout(() => {
      setTripStatus('ACCEPTED');
    }, 2500);

    setTimeout(() => {
      setTripStatus('ARRIVED');
    }, 6000);
  };

  const handleSimulateStartTrip = () => {
    setTripStatus('IN_PROGRESS');
  };

  const handleSimulateCompleteTrip = () => {
    setTripStatus('COMPLETED');
    setShowRatingModal(true);
    if (paymentMethod === 'WALLET') {
      const fare = trip?.fare || 24.5;
      setWalletBalance((prev) => Math.max(0, prev - fare));
    }
  };

  const handleCancelTrip = () => {
    setTripStatus('IDLE');
    setTrip(null);
  };

  const currentTierData = DEFAULT_TIERS.find((t) => t.tier === selectedTier) || DEFAULT_TIERS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <span>Intelligent Ride Hailing</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold uppercase tracking-wider">
              Surge Active (1.15x)
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Request an on-demand private vehicle with sub-5ms geospatial dispatch and live GPS telemetry.
          </p>
        </div>

        <button
          onClick={() => setShowWalletModal(true)}
          className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-xs font-semibold text-slate-200 transition-all shadow-md group"
        >
          <Wallet className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span>Top Up Wallet</span>
          <span className="font-mono text-cyan-400 font-bold">${walletBalance.toFixed(2)}</span>
        </button>
      </div>

      {/* Main Grid: Interactive Map + Booking Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Vector Map (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <InteractiveMap
            pickup={{ lat: pickup.lat, lng: pickup.lng, address: pickup.name }}
            dropoff={{ lat: dropoff.lat, lng: dropoff.lng, address: dropoff.name }}
            tripStatus={tripStatus}
          />

          {/* Quick Route Presets */}
          <div className="p-4 rounded-xl glass-panel space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick Waypoint Selectors
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_LOCATIONS.map((loc, idx) => (
                <button
                  key={loc.name}
                  onClick={() => {
                    if (idx !== dropoffIndex) setPickupIndex(idx);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    pickupIndex === idx
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  {loc.name.split(' ')[0]} (Pickup)
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Dispatch Panel & Dynamic Tier Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {tripStatus === 'IDLE' ? (
            /* Booking Configuration Form */
            <div className="p-5 sm:p-6 rounded-2xl glass-panel space-y-5 shadow-2xl">
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Select Trip Route
                </span>

                {/* Pickup Input */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-white/10 focus-within:border-emerald-500/50 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] text-slate-400 font-bold block uppercase">Pickup Location</label>
                    <select
                      value={pickupIndex}
                      onChange={(e) => setPickupIndex(Number(e.target.value))}
                      className="w-full bg-transparent text-xs sm:text-sm font-semibold text-white focus:outline-none cursor-pointer truncate"
                    >
                      {SAMPLE_LOCATIONS.map((loc, idx) => (
                        <option key={loc.name} value={idx} disabled={idx === dropoffIndex} className="bg-slate-900 text-white">
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dropoff Input */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-white/10 focus-within:border-rose-500/50 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] text-slate-400 font-bold block uppercase">Dropoff Destination</label>
                    <select
                      value={dropoffIndex}
                      onChange={(e) => setDropoffIndex(Number(e.target.value))}
                      className="w-full bg-transparent text-xs sm:text-sm font-semibold text-white focus:outline-none cursor-pointer truncate"
                    >
                      {SAMPLE_LOCATIONS.map((loc, idx) => (
                        <option key={loc.name} value={idx} disabled={idx === pickupIndex} className="bg-slate-900 text-white">
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Vehicle Tier Selection */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Available Vehicle Tiers
                  </span>
                  <span className="text-[11px] text-cyan-400 font-medium">Est: 8.4 km • 22 min</span>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {DEFAULT_TIERS.map((tier) => {
                    const isSelected = selectedTier === tier.tier;
                    return (
                      <div
                        key={tier.tier}
                        onClick={() => setSelectedTier(tier.tier)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent border-cyan-500/50 shadow-md shadow-cyan-500/10'
                            : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                            <Car className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-bold text-white">{tier.tierName}</span>
                              <span className="text-[10px] text-slate-400 font-medium">({tier.capacity} seats)</span>
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-1">{tier.description}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-extrabold text-white font-mono">
                            ${tier.fare.toFixed(2)}
                          </div>
                          <span className="text-[10px] text-emerald-400 font-medium">
                            {tier.etaMinutes} min away
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  <span className="font-medium">Payment:</span>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                  >
                    <option value="WALLET">RideSphere Wallet (${walletBalance.toFixed(2)})</option>
                    <option value="CREDIT_CARD">Credit Card (•••• 4921)</option>
                    <option value="UPI">Instant UPI / QR</option>
                    <option value="CASH">Cash on Dropoff</option>
                  </select>
                </div>
              </div>

              {/* Dispatch Action Button */}
              <button
                onClick={handleBookRide}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Matching Nearest Driver...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Request {currentTierData.tierName} • ${currentTierData.fare.toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Active Ride Lifecycle State Tracker Card */
            <div className="p-5 sm:p-6 rounded-2xl glass-panel space-y-5 shadow-2xl border-cyan-500/30">
              {/* Status Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Status: {tripStatus}
                  </span>
                </div>
                <button
                  onClick={handleCancelTrip}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                >
                  Cancel Ride
                </button>
              </div>

              {/* Status-specific Display */}
              {tripStatus === 'MATCHING' && (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center animate-pulse">
                    <Navigation className="w-6 h-6 text-cyan-400 animate-spin-slow" />
                  </div>
                  <h3 className="text-base font-bold text-white">Contacting nearby drivers...</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Geospatial matching engine is ranking available drivers within 5km of {pickup.name}.
                  </p>
                </div>
              )}

              {(tripStatus === 'ACCEPTED' || tripStatus === 'ARRIVED' || tripStatus === 'IN_PROGRESS') && (
                <div className="space-y-4">
                  {/* Driver Card */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                        MW
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">Marcus Wright</h4>
                          <span className="flex items-center text-[10px] text-amber-400 font-semibold">
                            <Star className="w-3 h-3 fill-amber-400 mr-0.5" /> 4.96
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">Tesla Model 3 • Midnight Silver</p>
                        <span className="inline-block px-2 py-0.5 mt-1 rounded bg-slate-800 text-[10px] font-mono text-cyan-400 font-bold border border-white/10">
                          KA-01-EQ-9921
                        </span>
                      </div>
                    </div>

                    <a
                      href="tel:+15550108821"
                      className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-500/30 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>

                  {/* 4-Digit Ride PIN / OTP Notification */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                        Ride Start Verification PIN
                      </span>
                      <p className="text-xs text-slate-300">Share this code with your driver before departure</p>
                    </div>
                    <div className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-extrabold font-mono text-lg tracking-widest shadow-md">
                      4921
                    </div>
                  </div>

                  {/* Simulation Controls for Interactive Evaluation */}
                  <div className="pt-2 border-t border-white/[0.08] space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Demo State Controller
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {tripStatus === 'ACCEPTED' && (
                        <button
                          onClick={() => setTripStatus('ARRIVED')}
                          className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                        >
                          Simulate Driver Arrived
                        </button>
                      )}
                      {(tripStatus === 'ARRIVED' || tripStatus === 'ACCEPTED') && (
                        <button
                          onClick={handleSimulateStartTrip}
                          className="py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white"
                        >
                          Simulate Start Trip
                        </button>
                      )}
                      {tripStatus === 'IN_PROGRESS' && (
                        <button
                          onClick={handleSimulateCompleteTrip}
                          className="col-span-2 py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30"
                        >
                          Complete Trip & Settle Fare ($24.50)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rating & Review Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="max-w-md w-full p-6 rounded-2xl glass-panel border-cyan-500/40 space-y-5 text-center shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white">Trip Completed!</h3>
              <p className="text-xs text-slate-300 mt-1">
                You have reached {dropoff.name}. Fare of $24.50 was settled via {paymentMethod}.
              </p>
            </div>

            {/* Star Rating Selector */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">Rate your experience with Marcus</span>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRatingScore(star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= ratingScore ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setShowRatingModal(false);
                setTripStatus('IDLE');
                setTrip(null);
              }}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Submit Feedback & Close
            </button>
          </div>
        </div>
      )}

      {/* Wallet Top-Up Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-sm w-full p-6 rounded-2xl glass-panel space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-400" /> Top Up Wallet
              </h3>
              <button onClick={() => setShowWalletModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Current Balance: <span className="font-mono font-bold text-cyan-400">${walletBalance.toFixed(2)}</span>
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[25, 50, 100].map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setWalletBalance((prev) => prev + amt);
                    setShowWalletModal(false);
                  }}
                  className="py-2 rounded-lg bg-slate-800 hover:bg-cyan-500/20 hover:border-cyan-500 border border-white/10 text-xs font-bold text-white transition-all font-mono"
                >
                  +${amt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

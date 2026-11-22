'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Navigation, MapPin, Compass, Shield, Maximize2, Zap } from 'lucide-react';

interface InteractiveMapProps {
  pickup?: { lat: number; lng: number; address: string };
  dropoff?: { lat: number; lng: number; address: string };
  driverLocation?: { lat: number; lng: number };
  tripStatus?: string;
  speed?: number;
}

export default function InteractiveMap({
  pickup,
  dropoff,
  driverLocation,
  tripStatus = 'IDLE',
  speed = 42,
}: InteractiveMapProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [carProgress, setCarProgress] = useState(0.25);

  // Animation frame loop for continuous smooth simulated vehicle transit
  useEffect(() => {
    let animationFrameId: number;
    let progress = carProgress;

    const animate = () => {
      if (tripStatus === 'IN_PROGRESS' || tripStatus === 'ACCEPTED') {
        progress += 0.0015;
        if (progress > 0.95) progress = 0.05;
        setCarProgress(progress);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [tripStatus]);

  // Render stylized dark-mode vector navigation map on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background gradient - dark oceanic slate
    ctx.fillStyle = '#090E17';
    ctx.fillRect(0, 0, width, height);

    // Grid road network lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Stylized arterial highways
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(60, height - 80);
    ctx.lineTo(width - 80, 80);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(100, 60);
    ctx.bezierCurveTo(width * 0.4, height * 0.2, width * 0.6, height * 0.8, width - 60, height - 100);
    ctx.stroke();

    // Route Polyline (Glowing Neon Cyan with shadow)
    const pX = 140;
    const pY = height - 120;
    const dX = width - 140;
    const dY = 120;

    // Route Glow
    ctx.shadowColor = '#00F0FF';
    ctx.shadowBlur = 15;
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(pX, pY);
    ctx.bezierCurveTo(width * 0.35, height * 0.7, width * 0.65, height * 0.3, dX, dY);
    ctx.stroke();
    ctx.shadowBlur = 0; // reset shadow

    // Pickup Marker (Emerald Green Pulse)
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(pX, pY, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(pX, pY, 16, 0, Math.PI * 2);
    ctx.stroke();

    // Dropoff Marker (Rose Red Finish)
    ctx.fillStyle = '#F43F5E';
    ctx.beginPath();
    ctx.arc(dX, dY, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(dX, dY, 16, 0, Math.PI * 2);
    ctx.stroke();

    // Animated Vehicle Marker on Route Curve
    // Bezier curve interpolation: B(t) = (1-t)^3 P0 + 3(1-t)^2 t P1 + 3(1-t) t^2 P2 + t^3 P3
    const t = carProgress;
    const cp1x = width * 0.35;
    const cp1y = height * 0.7;
    const cp2x = width * 0.65;
    const cp2y = height * 0.3;

    const carX = Math.pow(1 - t, 3) * pX + 3 * Math.pow(1 - t, 2) * t * cp1x + 3 * (1 - t) * Math.pow(t, 2) * cp2x + Math.pow(t, 3) * dX;
    const carY = Math.pow(1 - t, 3) * pY + 3 * Math.pow(1 - t, 2) * t * cp1y + 3 * (1 - t) * Math.pow(t, 2) * cp2y + Math.pow(t, 3) * dY;

    // Draw Vehicle Icon with Headlights
    ctx.save();
    ctx.translate(carX, carY);

    // Glowing car beacon
    ctx.fillStyle = '#38BDF8';
    ctx.shadowColor = '#38BDF8';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Inner vehicle core
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }, [carProgress, pickup, dropoff]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl bg-[#090E17]">
      <canvas
        ref={canvasRef}
        width={900}
        height={520}
        className="w-full h-full object-cover"
      />

      {/* Map Control HUD Overlay */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-300 shadow-lg">
        <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
        <span>Live GPS Telemetry</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
      </div>

      {/* Live Speed & Navigation Stats */}
      {tripStatus === 'IN_PROGRESS' && (
        <div className="absolute top-4 right-4 flex items-center gap-4 px-4 py-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 text-white shadow-xl">
          <div className="text-center">
            <span className="text-[10px] text-cyan-400 font-bold block uppercase tracking-wider">Speed</span>
            <span className="text-base font-extrabold font-mono">{speed} <span className="text-xs text-slate-400">km/h</span></span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="text-center">
            <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">ETA</span>
            <span className="text-base font-extrabold font-mono">14 <span className="text-xs text-slate-400">min</span></span>
          </div>
        </div>
      )}

      {/* Map Legend & Status Footer */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/10 text-xs text-slate-300">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30" />
            <span className="font-medium text-slate-200">Pickup: {pickup?.address ? pickup.address.slice(0, 24) + '...' : 'MG Road Station'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-500/30" />
            <span className="font-medium text-slate-200">Dropoff: {dropoff?.address ? dropoff.address.slice(0, 24) + '...' : 'Koramangala Hub'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-cyan-400 font-medium">
          <Zap className="w-3.5 h-3.5" />
          <span>Driver: Tesla Model 3 (Midnight Silver)</span>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, Navigation, ShieldAlert, Wallet, Sparkles, MapPin, Activity } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    {
      href: '/',
      label: 'Rider Portal',
      icon: Car,
      desc: 'Book & Track',
    },
    {
      href: '/driver',
      label: 'Driver Cockpit',
      icon: Navigation,
      desc: 'Dispatch & Earn',
    },
    {
      href: '/admin',
      label: 'Operations Center',
      icon: Activity,
      desc: 'Fleet & Analytics',
    },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070A10]/85 border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
            <Car className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                RideSphere
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-widest">
                Enterprise
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Urban Ride Mobility Suite</p>
          </div>
        </Link>

        {/* Portal Switcher Tabs */}
        <nav className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/60 border border-white/[0.05]">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Balance & Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block leading-tight font-medium">Ride Balance</span>
              <span className="text-xs font-bold text-white font-mono">$150.00</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pl-2 border-l border-white/[0.08]">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                SC
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#070A10]" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-white leading-tight">Sarah Connor</p>
              <p className="text-[10px] text-cyan-400 font-medium">Verified Rider</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

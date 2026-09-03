import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles, CheckCircle2, Shield, Layers, Zap } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-36 pb-20 overflow-hidden glow-gradient">
      {/* Background ambient lighting effects */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-40 right-10 w-[300px] h-[300px] bg-accent-cyan/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-elevated/80 border border-white/10 text-xs font-semibold text-slate-300 backdrop-blur-md shadow-lg">
            <span className="flex h-2 w-2 rounded-full bg-accent-emerald animate-pulse" />
            <span className="text-brand-400">Orbitly Studio</span>
            <span className="text-slate-500">•</span>
            <span>Accepting Q3/Q4 Product Sprints</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Turning bold ideas into{' '}
            <span className="text-gradient-brand">digital products.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We partner with ambitious startups and scale-ups to design, architect, and ship high-impact software from initial concept to market dominance.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="#contact"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-all shadow-xl shadow-brand-600/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-5 h-5" />
            </Link>
            <Link
              href="#work"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-slate-300 hover:text-white bg-surface-elevated/70 hover:bg-surface-elevated border border-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Case Studies</span>
            </Link>
          </div>

          {/* Trust Metrics Pill */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
              <span>Full-Stack Engineering</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
              <span>Design Systems & UI/UX</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
              <span>Production-Ready Delivery</span>
            </div>
          </div>
        </div>

        {/* Studio Highlights Grid */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="glass-card p-6 rounded-2xl text-center space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">$450M+</p>
            <p className="text-xs sm:text-sm text-slate-400">Client Capital Raised</p>
          </div>
          <div className="glass-card p-6 rounded-2xl text-center space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-brand-400 tracking-tight">40+</p>
            <p className="text-xs sm:text-sm text-slate-400">Digital Products Shipped</p>
          </div>
          <div className="glass-card p-6 rounded-2xl text-center space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">99.4%</p>
            <p className="text-xs sm:text-sm text-slate-400">On-Time Sprint Completion</p>
          </div>
          <div className="glass-card p-6 rounded-2xl text-center space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-accent-cyan tracking-tight">4.9★</p>
            <p className="text-xs sm:text-sm text-slate-400">Average App Store Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
};

'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-32 sm:pt-36 pb-16 sm:pb-20 overflow-hidden hero-radial-bg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-7">
          {/* Eyebrow Badge */}
          <ScrollReveal delay={0}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-[#20263A] text-xs font-semibold text-[#9CA3B5]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
              <span>Design + Development Studio</span>
            </div>
          </ScrollReveal>

          {/* Main Headline */}
          <ScrollReveal delay={100}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F5F5F7] leading-[1.12]">
              We design and build <br className="hidden sm:inline" />
              <span className="text-[#8B7CF6]">products people remember.</span>
            </h1>
          </ScrollReveal>

          {/* Description */}
          <ScrollReveal delay={200}>
            <p className="text-base sm:text-lg text-[#9CA3B5] max-w-2xl mx-auto leading-relaxed font-normal">
              Orbitly helps ambitious startups turn complex ideas into clear, useful, and scalable digital products.
            </p>
          </ScrollReveal>

          {/* Call to Action Buttons */}
          <ScrollReveal delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-1">
              <Link
                href="#contact"
                className="group w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 transition-all shadow-sm hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="#work"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-[#F5F5F7] bg-surface hover:bg-surface-elevated border border-[#20263A] hover:border-white/15 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>View Case Studies</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Studio Capabilities (01, 02, 03) */}
        <div className="mt-14 pt-8 border-t border-[#20263A]/60 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          <ScrollReveal delay={400}>
            <div className="p-4 sm:p-5 rounded-xl bg-surface border border-[#20263A] flex items-center gap-4">
              <span className="text-xs font-mono font-bold text-[#8B7CF6] bg-brand-500/10 px-2 py-1 rounded">01</span>
              <div>
                <h3 className="text-sm font-bold text-[#F5F5F7]">Product Strategy</h3>
                <p className="text-xs text-[#9CA3B5] mt-0.5">Problem discovery & roadmap scoping</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={500}>
            <div className="p-4 sm:p-5 rounded-xl bg-surface border border-[#20263A] flex items-center gap-4">
              <span className="text-xs font-mono font-bold text-[#8B7CF6] bg-brand-500/10 px-2 py-1 rounded">02</span>
              <div>
                <h3 className="text-sm font-bold text-[#F5F5F7]">UX / UI Design</h3>
                <p className="text-xs text-[#9CA3B5] mt-0.5">Design systems & interactive prototypes</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={600}>
            <div className="p-4 sm:p-5 rounded-xl bg-surface border border-[#20263A] flex items-center gap-4">
              <span className="text-xs font-mono font-bold text-[#8B7CF6] bg-brand-500/10 px-2 py-1 rounded">03</span>
              <div>
                <h3 className="text-sm font-bold text-[#F5F5F7]">Full-Stack Development</h3>
                <p className="text-xs text-[#9CA3B5] mt-0.5">Scalable Next.js & API engineering</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

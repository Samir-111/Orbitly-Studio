import React from 'react';
import {
  Compass,
  Palette,
  Code2,
  Smartphone,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { ScrollReveal } from '../components/ScrollReveal';

export const ServicesSection: React.FC = () => {
  const services = [
    {
      title: 'Product Strategy',
      icon: Compass,
      description:
        'We validate product-market fit, define core feature roadmaps, and conduct user discovery sprints to de-risk development.',
      deliverables: ['Discovery Sprints', 'User Journey Mapping', 'Product Roadmaps', 'MVP Scoping'],
    },
    {
      title: 'UX / UI Design',
      icon: Palette,
      description:
        'We craft high-converting, intuitive user interfaces with scalable design systems, interactive prototypes, and usability testing.',
      deliverables: ['Design Systems', 'Interactive Wireframes', 'High-Fidelity UI', 'Usability Audits'],
    },
    {
      title: 'Full-Stack Development',
      icon: Code2,
      description:
        'We engineer fast, scalable web applications using Next.js, React, Node.js, and TypeScript built for reliability and speed.',
      deliverables: ['Next.js Applications', 'REST APIs', 'Database Architecture', 'Performance Tuning'],
    },
    {
      title: 'Mobile App Development',
      icon: Smartphone,
      description:
        'We engineer responsive, native-feel iOS and Android applications with offline-first state and smooth user interactions.',
      deliverables: ['Cross-Platform Apps', 'Offline-First Sync', 'Biometric Auth', 'Push Notifications'],
    },
    {
      title: 'Brand Identity',
      icon: Sparkles,
      description:
        'We craft clear visual identity systems, typographic guidelines, and brand assets that position startups as industry leaders.',
      deliverables: ['Visual Identity', 'Brand Guidelines', 'Typography Systems', 'Asset Libraries'],
    },
    {
      title: 'Design Systems',
      icon: Layers,
      description:
        'We build structured, reusable component libraries in Figma and code to keep product teams moving fast with design consistency.',
      deliverables: ['Component Libraries', 'Figma Tokens', 'Documentation', 'Accessibility Checks'],
    },
  ];

  return (
    <section id="services" className="py-24 relative section-radial-bg border-t border-[#20263A]/40">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <ScrollReveal>
          <div className="max-w-3xl mb-14 space-y-3">
            <div className="text-xs font-semibold text-[#8B7CF6] uppercase tracking-wider">
              Capabilities & Services
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F5F7] leading-tight">
              Everything your product needs to succeed at scale.
            </h2>
            <p className="text-base sm:text-lg text-[#9CA3B5]">
              From initial concept validation to production-grade deployment, Orbitly provides the multidisciplinary expertise required to build category-defining software.
            </p>
          </div>
        </ScrollReveal>

        {/* Services Grid with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <ScrollReveal key={service.title} delay={index * 70}>
                <div className="glass-card rounded-2xl p-7 flex flex-col justify-between space-y-6 h-full hover:-translate-y-1">
                  <div className="space-y-4">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-[#20263A] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#8B7CF6]" />
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg font-bold text-[#F5F5F7]">
                      {service.title}
                    </h3>
                    <p className="text-sm text-[#9CA3B5] leading-relaxed font-normal">
                      {service.description}
                    </p>
                  </div>

                  {/* Deliverables */}
                  <div className="pt-4 border-t border-[#20263A]/60 space-y-2">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Deliverables</p>
                    <div className="flex flex-wrap gap-1.5">
                      {service.deliverables.map((item) => (
                        <span
                          key={item}
                          className="px-2 py-0.5 rounded bg-surface-elevated border border-[#20263A] text-xs text-[#9CA3B5]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <ScrollReveal delay={200}>
          <div className="mt-12 p-8 rounded-2xl bg-surface border border-[#20263A] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-base font-bold text-[#F5F5F7]">Have a specific product challenge?</h4>
              <p className="text-sm text-[#9CA3B5]">Our team can scope a focused sprint tailored to your roadmap.</p>
            </div>
            <Link
              href="#contact"
              className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 transition-all shadow-sm flex-shrink-0"
            >
              <span>Start a Conversation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

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

export const ServicesSection: React.FC = () => {
  const services = [
    {
      title: 'Product Strategy',
      icon: Compass,
      color: 'text-brand-400',
      bgColor: 'bg-brand-500/10 border-brand-500/20',
      description:
        'We validate product-market fit, define feature prioritization matrices, and conduct user research to ensure engineering investments yield maximum ROI.',
      deliverables: ['Discovery Sprints', 'User Journey Mapping', 'Product Roadmaps', 'MVP Scoping'],
    },
    {
      title: 'UI/UX Design',
      icon: Palette,
      color: 'text-accent-cyan',
      bgColor: 'bg-accent-cyan/10 border-accent-cyan/20',
      description:
        'We design intuitive, high-converting interfaces with pixel-perfect design systems, interactive prototypes, and frictionless user experiences.',
      deliverables: ['Design Systems', 'Interactive Wireframes', 'High-Fidelity UI', 'Usability Audits'],
    },
    {
      title: 'Web Development',
      icon: Code2,
      color: 'text-accent-emerald',
      bgColor: 'bg-accent-emerald/10 border-accent-emerald/20',
      description:
        'We build scalable, lightning-fast web applications using Next.js, TypeScript, and modern backend architectures designed for zero downtime.',
      deliverables: ['Next.js Applications', 'REST & GraphQL APIs', 'Full-Stack Engineering', 'Performance Tuning'],
    },
    {
      title: 'Mobile App Development',
      icon: Smartphone,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
      description:
        'We engineer native-feel cross-platform iOS and Android mobile applications that delight users and achieve top-tier App Store ratings.',
      deliverables: ['React Native & Flutter', 'Offline-First Sync', 'Biometric Auth', 'Push Notifications'],
    },
    {
      title: 'Brand Identity',
      icon: Sparkles,
      color: 'text-accent-amber',
      bgColor: 'bg-accent-amber/10 border-accent-amber/20',
      description:
        'We craft distinctive brand narratives, typographic guidelines, and visual identity systems that position tech startups as industry leaders.',
      deliverables: ['Logo & Visual Systems', 'Brand Guidelines', 'Typography Systems', 'Marketing Collateral'],
    },
    {
      title: 'Product Development',
      icon: Layers,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
      description:
        'End-to-end full-lifecycle development from zero to scaled launch, integrating automated CI/CD pipelines, analytics, and security audits.',
      deliverables: ['Full Lifecycle Builds', 'Cloud Infrastructure', 'CI/CD Pipelines', 'Security Audits'],
    },
  ];

  return (
    <section id="services" className="py-24 relative bg-[#090D17] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-400 uppercase tracking-wider">
            Capabilities & Services
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Everything your product needs to <span className="text-gradient">succeed at scale.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            From initial concept validation to production-grade deployment, Orbitly Studio provides the multidisciplinary expertise required to build category-defining software.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="glass-card rounded-2xl p-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${service.bgColor}`}>
                    <Icon className={`w-6 h-6 ${service.color}`} />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Deliverables List */}
                <div className="pt-4 border-t border-white/5 space-y-2">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Key Deliverables</p>
                  <div className="flex flex-wrap gap-1.5">
                    {service.deliverables.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-0.5 rounded bg-surface-elevated/80 border border-white/5 text-xs text-slate-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-8 rounded-2xl glass-panel flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold text-white">Have a specific challenge in mind?</h4>
            <p className="text-sm text-slate-400">Our senior team can scope a custom sprint tailored to your roadmap.</p>
          </div>
          <Link
            href="#contact"
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-all shadow-lg"
          >
            <span>Book a Discovery Call</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

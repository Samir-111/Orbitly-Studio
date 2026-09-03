import React from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote:
        'Orbitly Studio didn’t just build our telemedicine platform—they fundamentally reshaped how our clinical team interacts with patients. Our 62% reduction in onboarding drop-offs is directly attributable to their UX leadership.',
      author: 'Dr. Aris Thorne',
      role: 'Chief Medical Officer',
      company: 'Apex Health',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5,
    },
    {
      quote:
        'Finding an agency that truly understands both high-frequency FinTech architecture and consumer-grade luxury design is nearly impossible. Orbitly delivered on every single milestone ahead of schedule.',
      author: 'Julian Vance',
      role: 'Founder & CEO',
      company: 'NovaPay Global',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5,
    },
    {
      quote:
        'The design system and canvas workspace Orbitly architected for Luminary AI became the core differentiator that closed our $35M Series B round. Their engineering standards are second to none.',
      author: 'Maya Lin',
      role: 'Head of Product',
      company: 'Luminary Systems',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      rating: 5,
    },
  ];

  return (
    <section id="about" className="py-24 relative bg-[#080C15] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-400 uppercase tracking-wider">
            Client Success & Proof
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Trusted by founders building <span className="text-gradient-brand">the future.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            Hear directly from the executive teams and technical leaders we partner with to build market-defining software.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.author}
              className="glass-card rounded-2xl p-8 flex flex-col justify-between space-y-6 relative"
            >
              <Quote className="w-10 h-10 text-brand-500/20 absolute top-6 right-6" />

              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent-amber text-accent-amber" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="w-11 h-11 rounded-full object-cover border border-brand-500/30"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{item.author}</h4>
                  <p className="text-xs text-slate-400">
                    {item.role}, <span className="text-brand-400">{item.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

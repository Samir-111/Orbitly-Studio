import React from 'react';
import { Star, Quote } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote:
        'Orbitly didn’t just write code—they helped us refine our product roadmap and cut 3 months of unnecessary features. The resulting MVP helped us secure our initial customer traction.',
      author: 'Dr. Aris Thorne',
      role: 'Co-Founder',
      company: 'Apex Health',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5,
    },
    {
      quote:
        'Finding an engineering team that understands both complex backend systems and modern UX design is rare. Orbitly executed our trading dashboard with zero downtime.',
      author: 'Julian Vance',
      role: 'Founder & CEO',
      company: 'NovaPay',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5,
    },
    {
      quote:
        'The design system and component architecture Orbitly built became the foundation for our entire frontend team. Fast, reliable, and thoughtful execution.',
      author: 'Maya Lin',
      role: 'Head of Product',
      company: 'Luminary Systems',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      rating: 5,
    },
  ];

  return (
    <section id="about" className="py-24 relative section-radial-bg border-t border-[#20263A]/40">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <ScrollReveal>
          <div className="max-w-2xl mb-14 space-y-3">
            <div className="text-xs font-semibold text-[#8B7CF6] uppercase tracking-wider">
              Testimonials
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F5F7] leading-tight">
              Trusted by founders.
            </h2>
            <p className="text-base sm:text-lg text-[#9CA3B5]">
              Real feedback from startup founders and product leaders we partner with.
            </p>
          </div>
        </ScrollReveal>

        {/* Testimonials Grid with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <ScrollReveal key={item.author} delay={index * 100}>
              <div className="glass-card rounded-2xl p-7 flex flex-col justify-between space-y-6 relative h-full hover:-translate-y-1">
                <Quote className="w-8 h-8 text-brand-500/20 absolute top-6 right-6" />

                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-[#F5F5F7] text-sm leading-relaxed font-normal">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-[#20263A]/60 flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.author}
                    className="w-10 h-10 rounded-full object-cover border border-[#20263A]"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F5F7]">{item.author}</h4>
                    <p className="text-xs text-[#9CA3B5]">
                      {item.role}, <span className="text-[#8B7CF6]">{item.company}</span>
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

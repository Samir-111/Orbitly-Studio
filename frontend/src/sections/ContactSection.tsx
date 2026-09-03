'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { inquiriesApi } from '../services/api';
import { ScrollReveal } from '../components/ScrollReveal';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Full-Stack Development',
    budget: '$25k - $50k',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setErrorMessage(null);

      // Submit inquiry directly to the backend database
      await inquiriesApi.create(formData);

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative section-radial-bg border-t border-[#20263A]/40">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Context */}
          <div className="lg:col-span-5 space-y-8">
            <ScrollReveal>
              <div className="space-y-3">
                <div className="text-xs font-semibold text-[#8B7CF6] uppercase tracking-wider">
                  Contact & Scope
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F5F7] leading-tight">
                  Have a product idea? <br />
                  <span className="text-[#8B7CF6]">Let&apos;s talk about it.</span>
                </h2>
                <p className="text-base text-[#9CA3B5] leading-relaxed font-normal">
                  Tell us about what you want to build. We review briefs within 24 hours and can schedule a discovery sprint to scope your architecture.
                </p>
              </div>
            </ScrollReveal>

            {/* Direct Details */}
            <ScrollReveal delay={150}>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-[#20263A]">
                  <div className="w-9 h-9 rounded-lg bg-surface-elevated border border-[#20263A] flex items-center justify-center text-[#8B7CF6]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3B5]">Direct Studio Email</p>
                    <p className="text-sm font-semibold text-[#F5F5F7]">hello@orbitly.studio</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-[#20263A]">
                  <div className="w-9 h-9 rounded-lg bg-surface-elevated border border-[#20263A] flex items-center justify-center text-[#8B7CF6]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3B5]">Location</p>
                    <p className="text-sm font-semibold text-[#F5F5F7]">San Francisco, CA & Remote Worldwide</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Interactive Project Brief Form */}
          <div className="lg:col-span-7">
            <ScrollReveal delay={200}>
              <div className="bg-surface p-8 sm:p-10 rounded-2xl border border-[#20263A] relative overflow-hidden">
                {submitted ? (
                  <div className="py-16 text-center space-y-4 animate-fadeIn">
                    <div className="w-14 h-14 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-[#F5F5F7]">Thank you for reaching out!</h3>
                    <p className="text-sm text-[#9CA3B5] max-w-md mx-auto font-normal">
                      We&apos;ve received your project inquiry and will get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          service: 'Full-Stack Development',
                          budget: '$25k - $50k',
                          message: '',
                        });
                      }}
                      className="mt-4 px-6 py-2 rounded-full text-xs font-semibold bg-surface-elevated border border-[#20263A] text-slate-300 hover:text-white transition-all"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h3 className="text-lg font-bold text-[#F5F5F7]">Project Inquiry</h3>

                    {errorMessage && (
                      <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#9CA3B5]">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Alex Morgan"
                          className="w-full bg-surface-elevated border border-[#20263A] rounded-xl px-4 py-2.5 text-sm text-[#F5F5F7] placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#9CA3B5]">
                          Work Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="alex@company.com"
                          className="w-full bg-surface-elevated border border-[#20263A] rounded-xl px-4 py-2.5 text-sm text-[#F5F5F7] placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Service */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#9CA3B5]">
                          Primary Need
                        </label>
                        <select
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full bg-surface-elevated border border-[#20263A] rounded-xl px-4 py-2.5 text-sm text-[#F5F5F7] focus:outline-none focus:border-brand-500 transition-colors"
                        >
                          <option value="Product Strategy">Product Strategy</option>
                          <option value="UI/UX Design">UI/UX Design</option>
                          <option value="Full-Stack Development">Full-Stack Development</option>
                          <option value="Mobile App">Mobile App (iOS/Android)</option>
                          <option value="Brand Identity">Brand Identity</option>
                        </select>
                      </div>

                      {/* Budget */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#9CA3B5]">
                          Estimated Budget
                        </label>
                        <select
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          className="w-full bg-surface-elevated border border-[#20263A] rounded-xl px-4 py-2.5 text-sm text-[#F5F5F7] focus:outline-none focus:border-brand-500 transition-colors"
                        >
                          <option value="$15k - $25k">$15,000 – $25,000</option>
                          <option value="$25k - $50k">$25,000 – $50,000</option>
                          <option value="$50k - $100k">$50,000 – $100,000</option>
                          <option value="$100k+">$100,000+</option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#9CA3B5]">
                        Project Summary *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Briefly describe your product goals, timeline, or current technical challenges..."
                        className="w-full bg-surface-elevated border border-[#20263A] rounded-xl p-3.5 text-sm text-[#F5F5F7] placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      {submitting ? (
                        <span>Sending Inquiry...</span>
                      ) : (
                        <>
                          <span>Submit Project Brief</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

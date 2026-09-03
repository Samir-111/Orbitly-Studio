'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { inquiriesApi } from '../services/api';

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
    <section id="contact" className="py-24 relative bg-[#090D17] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Information */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-400 uppercase tracking-wider">
                Start a Conversation
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Let's turn your concept into <span className="text-gradient">reality.</span>
              </h2>
              <p className="text-base text-slate-400 leading-relaxed">
                Whether you're scoping an MVP, refactoring an enterprise product, or building a new brand, our studio is ready to jump into sprint 1.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4 p-4 rounded-xl glass-card">
                <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Direct Inquiries</p>
                  <p className="text-sm font-semibold text-white">hello@orbitly.studio</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl glass-card">
                <div className="w-10 h-10 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Studio Locations</p>
                  <p className="text-sm font-semibold text-white">San Francisco, CA & London, UK</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-8 sm:p-10 rounded-3xl relative overflow-hidden">
              {submitted ? (
                <div className="py-16 text-center space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-accent-emerald/20 border border-accent-emerald/30 text-accent-emerald flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Thank you for reaching out!</h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto">
                    A senior product partner from Orbitly Studio will review your project brief and get back to you within 24 hours.
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
                    className="mt-4 px-6 py-2.5 rounded-full text-xs font-semibold bg-surface border border-white/10 text-slate-300 hover:text-white transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-xl font-bold text-white">Project Inquiry Form</h3>

                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Alex Morgan"
                        className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@company.com"
                        className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Service */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Primary Need
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                      >
                        <option value="Product Strategy">Product Strategy</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Full-Stack Development">Full-Stack Development</option>
                        <option value="Mobile App">Mobile App (iOS/Android)</option>
                        <option value="Brand Identity">Brand Identity</option>
                      </select>
                    </div>

                    {/* Budget */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Estimated Budget
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                      >
                        <option value="$15k - $25k">$15,000 – $25,000</option>
                        <option value="$25k - $50k">$25,000 – $50,000</option>
                        <option value="$50k - $100k">$50,000 – $100,000</option>
                        <option value="$100k+">$100,000+</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Project Goals & Timeline *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about the product you want to build, current challenges, and target launch timeframe..."
                      className="w-full bg-surface border border-white/10 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Submitting Brief...</span>
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
          </div>
        </div>
      </div>
    </section>
  );
};

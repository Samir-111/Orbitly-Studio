'use client';

import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { inquiriesApi, settingsApi, StudioSettings } from '../services/api';
import { ScrollReveal } from '../components/ScrollReveal';
import { DarkSelect, Option } from '../components/DarkSelect';

const SERVICE_OPTIONS: Option[] = [
  { value: 'Product Strategy', label: 'Product Strategy' },
  { value: 'UI/UX Design', label: 'UI/UX Design' },
  { value: 'Full-Stack Development', label: 'Full-Stack Development' },
  { value: 'Mobile App', label: 'Mobile App (iOS/Android)' },
  { value: 'Brand Identity', label: 'Brand Identity' },
  { value: 'custom', label: 'Other / Custom Requirement (Type your own)' },
];

const BUDGET_OPTIONS: Option[] = [
  { value: '₹10,000 – ₹20,000', label: '₹10,000 – ₹20,000' },
  { value: '₹20,000 – ₹25,000', label: '₹20,000 – ₹25,000' },
  { value: '₹25,000 – ₹30,000', label: '₹25,000 – ₹30,000' },
  { value: '₹30,000 – ₹35,000', label: '₹30,000 – ₹35,000' },
  { value: '₹35,000 – ₹50,000', label: '₹35,000 – ₹50,000' },
  { value: '₹50,000 – ₹1,00,000', label: '₹50,000 – ₹1,00,000' },
  { value: 'custom', label: 'Custom Price (Enter your own budget)' },
];

export const ContactSection: React.FC = () => {
  const [studioSettings, setStudioSettings] = useState<StudioSettings>({
    studioEmail: 'hello@orbitly.studio',
    location: 'San Francisco, CA & Remote Worldwide',
  });
  const [serviceOption, setServiceOption] = useState('');
  const [customService, setCustomService] = useState('');
  const [budgetOption, setBudgetOption] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    budget: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    settingsApi
      .get()
      .then((res) => {
        if (res?.data) {
          setStudioSettings({
            studioEmail: res.data.studioEmail || 'hello@orbitly.studio',
            location: res.data.location || 'San Francisco, CA & Remote Worldwide',
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load studio settings:', err);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setErrorMessage(null);

      // Validate primary need selection
      if (!serviceOption) {
        setErrorMessage('Please select your primary need.');
        setSubmitting(false);
        return;
      }

      // Determine final service string
      let finalService = serviceOption;
      if (serviceOption === 'custom') {
        if (!customService.trim()) {
          setErrorMessage('Please specify your custom requirement.');
          setSubmitting(false);
          return;
        }
        finalService = customService.trim();
      }

      // Validate budget selection
      if (!budgetOption) {
        setErrorMessage('Please select an estimated budget.');
        setSubmitting(false);
        return;
      }

      // Determine final budget string
      let finalBudget = budgetOption;
      if (budgetOption === 'custom') {
        if (!customPrice.trim()) {
          setErrorMessage('Please enter your custom budget amount.');
          setSubmitting(false);
          return;
        }
        const cleanedPrice = customPrice.trim();
        finalBudget = cleanedPrice.startsWith('₹') ? cleanedPrice : `₹${cleanedPrice}`;
      }

      // Submit inquiry directly to the backend database
      await inquiriesApi.create({
        ...formData,
        service: finalService,
        budget: finalBudget,
      });

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
                    <a
                      href={`mailto:${studioSettings.studioEmail}`}
                      className="text-sm font-semibold text-[#F5F5F7] hover:text-[#8B7CF6] transition-colors"
                    >
                      {studioSettings.studioEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-[#20263A]">
                  <div className="w-9 h-9 rounded-lg bg-surface-elevated border border-[#20263A] flex items-center justify-center text-[#8B7CF6]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3B5]">Location</p>
                    <p className="text-sm font-semibold text-[#F5F5F7]">{studioSettings.location}</p>
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
                        setServiceOption('');
                        setCustomService('');
                        setBudgetOption('');
                        setCustomPrice('');
                        setFormData({
                          name: '',
                          email: '',
                          service: '',
                          budget: '',
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
                          Primary Need *
                        </label>
                        <DarkSelect
                          required
                          value={serviceOption}
                          options={SERVICE_OPTIONS}
                          placeholder="Select Primary Need..."
                          onChange={(val) => {
                            setServiceOption(val);
                            if (val !== 'custom') {
                              setFormData({ ...formData, service: val });
                            } else {
                              setFormData({ ...formData, service: customService.trim() });
                            }
                          }}
                        />
                      </div>

                      {/* Budget */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#9CA3B5]">
                          Estimated Budget (INR) *
                        </label>
                        <DarkSelect
                          required
                          value={budgetOption}
                          options={BUDGET_OPTIONS}
                          placeholder="Select Budget Range..."
                          onChange={(val) => {
                            setBudgetOption(val);
                            if (val !== 'custom') {
                              setFormData({ ...formData, budget: val });
                            } else {
                              const cleaned = customPrice.trim();
                              setFormData({
                                ...formData,
                                budget: cleaned ? (cleaned.startsWith('₹') ? cleaned : `₹${cleaned}`) : '',
                              });
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Customer Custom Service/Requirement Input */}
                    {serviceOption === 'custom' && (
                      <div className="space-y-1.5 animate-fadeIn p-4 rounded-xl bg-surface-elevated/70 border border-[#8B7CF6]/40">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#8B7CF6] flex items-center gap-1.5">
                          <span>Specify Your Requirement / Service Need *</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={customService}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomService(val);
                            setFormData({
                              ...formData,
                              service: val.trim(),
                            });
                          }}
                          placeholder="e.g. AI Model Integration, Cloud DevOps, SEO & Growth, Custom CRM..."
                          className="w-full bg-surface border border-[#20263A] focus:border-[#8B7CF6] rounded-xl px-4 py-2.5 text-sm text-[#F5F5F7] placeholder-slate-500 focus:outline-none transition-colors"
                        />
                        <p className="text-[11px] text-slate-400">
                          Type any custom requirement or specialized service you need for your project.
                        </p>
                      </div>
                    )}

                    {/* Customer Custom Budget Input */}
                    {budgetOption === 'custom' && (
                      <div className="space-y-1.5 animate-fadeIn p-4 rounded-xl bg-surface-elevated/70 border border-[#8B7CF6]/40">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#8B7CF6] flex items-center gap-1.5">
                          <span>Enter Your Custom Budget (₹ INR) *</span>
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
                            ₹
                          </span>
                          <input
                            type="text"
                            required
                            value={customPrice}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCustomPrice(val);
                              const cleaned = val.trim();
                              setFormData({
                                ...formData,
                                budget: cleaned ? (cleaned.startsWith('₹') ? cleaned : `₹${cleaned}`) : '',
                              });
                            }}
                            placeholder="e.g. 75,000 or 3.5 Lakhs"
                            className="w-full bg-surface border border-[#20263A] focus:border-[#8B7CF6] rounded-xl pl-8 pr-4 py-2.5 text-sm text-[#F5F5F7] placeholder-slate-500 focus:outline-none transition-colors"
                          />
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Feel free to write any budget or rate in Indian Rupees.
                        </p>
                      </div>
                    )}

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

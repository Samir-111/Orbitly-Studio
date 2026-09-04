'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings as SettingsIcon,
  Mail,
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { getAdminToken, settingsApi } from '../../../services/api';

/**
 * Admin Studio Settings Page
 * Allows the studio admin to configure public contact information (Email and Location).
 * Changes made here automatically propagate to the public ContactSection and Footer components.
 */
export default function AdminSettingsPage() {
  const router = useRouter();

  // Controlled form state for studio settings
  const [formData, setFormData] = useState({
    studioEmail: '',
    location: '',
  });

  // UI state for loading, saving status, and alert messages
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await settingsApi.get();
        if (res.data) {
          setFormData({
            studioEmail: res.data.studioEmail || 'hello@orbitly.studio',
            location: res.data.location || 'San Francisco, CA & Remote Worldwide',
          });
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load studio settings.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const res = await settingsApi.update(formData);

      if (res.data) {
        setFormData({
          studioEmail: res.data.studioEmail,
          location: res.data.location,
        });
        setSuccessMessage('Studio settings updated successfully. Public pages will now reflect these details.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update settings. Please check your inputs.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B14] flex flex-col md:flex-row font-sans">
      {/* Admin Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 lg:p-12 min-w-0 max-w-6xl">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#20263A]">
          <div>
            <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-[#8B7CF6] mb-1">
              <SettingsIcon className="w-4 h-4" />
              <span>Studio Configuration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F7] tracking-tight">
              Studio Settings
            </h1>
            <p className="text-sm text-[#9CA3B5] mt-1">
              Manage the public contact email and physical/remote location shown on your website.
            </p>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-surface border border-[#20263A] text-slate-300 hover:text-white hover:border-brand-500/40 transition-all self-start sm:self-auto"
          >
            <Globe className="w-3.5 h-3.5 text-brand-400" />
            <span>View Live Website</span>
          </a>
        </div>

        {/* Notifications */}
        <div className="space-y-4 pt-6">
          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-emerald-400 hover:text-emerald-200 text-xs ml-4"
              >
                ✕
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-400 hover:text-rose-200 text-xs ml-4"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-7 h-7 text-[#8B7CF6] animate-spin mx-auto" />
            <p className="text-xs text-[#9CA3B5]">Loading studio settings...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-start">
            {/* Settings Form Column */}
            <div className="lg:col-span-7 bg-surface p-6 sm:p-8 rounded-2xl border border-[#20263A] space-y-6">
              <div className="flex items-center justify-between border-b border-[#20263A] pb-4">
                <h2 className="text-base font-bold text-[#F5F5F7] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-400" />
                  <span>Public Contact Information</span>
                </h2>
                <span className="text-[11px] bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2.5 py-0.5 rounded-full font-medium">
                  Auto-synced to site
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Studio Email Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#9CA3B5] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-brand-400" />
                    <span>Studio Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.studioEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, studioEmail: e.target.value })
                    }
                    placeholder="hello@orbitly.studio"
                    className="w-full bg-surface-elevated border border-[#20263A] focus:border-[#8B7CF6] rounded-xl px-4 py-2.5 text-sm text-[#F5F5F7] placeholder-slate-500 focus:outline-none transition-colors"
                  />
                  <p className="text-[11px] text-slate-400">
                    Displayed in the Contact Brief section, footer, and inquiry email links.
                  </p>
                </div>

                {/* Studio Location Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#9CA3B5] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-400" />
                    <span>Studio Location *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="San Francisco, CA & Remote Worldwide"
                    className="w-full bg-surface-elevated border border-[#20263A] focus:border-[#8B7CF6] rounded-xl px-4 py-2.5 text-sm text-[#F5F5F7] placeholder-slate-500 focus:outline-none transition-colors"
                  />
                  <p className="text-[11px] text-slate-400">
                    City, region, or operating availability displayed on public sections.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Settings</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Live Preview Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-surface p-6 rounded-2xl border border-[#20263A] space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#8B7CF6] uppercase tracking-wider">
                  <Eye className="w-4 h-4" />
                  <span>Public Contact Preview</span>
                </div>
                <p className="text-xs text-[#9CA3B5]">
                  This is how your studio information looks to potential clients on the website:
                </p>

                <div className="space-y-3 pt-2">
                  {/* Email Preview Box */}
                  <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-surface-elevated border border-[#20263A]">
                    <div className="w-8 h-8 rounded-lg bg-surface border border-[#20263A] flex items-center justify-center text-[#8B7CF6]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] text-[#9CA3B5] uppercase font-semibold">Direct Studio Email</p>
                      <p className="text-xs font-semibold text-[#F5F5F7] truncate">
                        {formData.studioEmail || 'hello@orbitly.studio'}
                      </p>
                    </div>
                  </div>

                  {/* Location Preview Box */}
                  <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-surface-elevated border border-[#20263A]">
                    <div className="w-8 h-8 rounded-lg bg-surface border border-[#20263A] flex items-center justify-center text-[#8B7CF6]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] text-[#9CA3B5] uppercase font-semibold">Location</p>
                      <p className="text-xs font-semibold text-[#F5F5F7] truncate">
                        {formData.location || 'San Francisco, CA & Remote Worldwide'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
